"use server";

import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobApplication } from "../models";
import { revalidatePath } from "next/cache";

export interface GuestJobData {
  company: string;
  position: string;
  location?: string;
  priority?: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  columnName: string;
  tags?: string[];
  description?: string;
  order?: number;
}

export async function migrateGuestJobs(guestJobs: GuestJobData[]) {
  const session = await getSession();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  if (!guestJobs || guestJobs.length === 0) {
    return { success: true, count: 0 };
  }

  await connectDB();

  // Find or create user's board
  let board = await Board.findOne({
    userId: session.user.id,
    name: "Job Hunt",
  }).populate("columns");

  if (!board) {
    const columnNames = ["Wish List", "Applied", "Interviewing", "Offer", "Rejected"];
    const createdCols = [];
    for (let i = 0; i < columnNames.length; i++) {
      const col = await Column.create({
        name: columnNames[i],
        order: i,
        jobApplications: [],
      });
      createdCols.push(col._id);
    }

    board = await Board.create({
      userId: session.user.id,
      name: "Job Hunt",
      columns: createdCols,
    });
    board = await Board.findById(board._id).populate("columns");
  }

  const userColumns = board.columns as unknown as Array<{ _id: string; name: string }>;
  let count = 0;

  for (const guestJob of guestJobs) {
    const targetCol =
      userColumns.find((c) =>
        c.name.toLowerCase().includes(guestJob.columnName.toLowerCase())
      ) || userColumns[0];

    if (!targetCol) continue;

    const maxOrder = (await JobApplication.findOne({ columnId: targetCol._id })
      .sort({ order: -1 })
      .select("order")
      .lean()) as { order: number } | null;

    const newJob = await JobApplication.create({
      company: guestJob.company,
      position: guestJob.position,
      location: guestJob.location,
      priority: guestJob.priority || "Medium",
      notes: guestJob.notes,
      salary: guestJob.salary,
      jobUrl: guestJob.jobUrl,
      columnId: targetCol._id,
      boardId: board._id,
      userId: session.user.id,
      tags: guestJob.tags || [],
      description: guestJob.description,
      status: targetCol.name.toLowerCase(),
      order: maxOrder ? maxOrder.order + 100 : (guestJob.order || 0) * 100,
    });

    await Column.findByIdAndUpdate(targetCol._id, {
      $push: { jobApplications: newJob._id },
    });
    count++;
  }

  revalidatePath("/dashboard");
  return { success: true, count };
}
