"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import connectDB from "../db";
import mongoose from "mongoose";
import { Board, Column, JobApplication } from "../models";

export async function createColumn(data: { boardId: string; name: string }) {
  const session = await getSession();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }
  const userId = session.user.id;

  await connectDB();

  const { boardId, name } = data;

  if (!boardId || !name.trim()) {
    return { error: "Missing required fields" };
  }

  // Verify board ownership
  const board = await Board.findOne({ _id: boardId, userId });

  if (!board) {
    return { error: "Board not found" };
  }

  const maxOrder = (await Column.findOne({ boardId, order: -1 })
    .sort({ order: -1 })
    .select("order")
    .lean()) as { order: number } | null;

  const column = await Column.create({
    name: name.trim(),
    order: maxOrder ? maxOrder.order + 1 : board.columns.length,
    boardId,
    jobApplications: [],
  });

  board.columns.push(column._id);
  await board.save();

  revalidatePath("/dashboard");

  return { data: JSON.parse(JSON.stringify(column)) };
}

export async function renameColumn(id: string, name: string) {
  const session = await getSession();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }
  const userId = session.user.id;

  await connectDB();

  if (!name.trim()) {
    return { error: "Column name is required" };
  }

  const column = await Column.findById(id);

  if (!column) {
    return { error: "Column not found" };
  }

  // Verify the column belongs to a board owned by this user
  const board = await Board.findOne({
    _id: column.boardId,
    userId,
  });

  if (!board) {
    return { error: "Unauthorized" };
  }

  column.name = name.trim();
  await column.save();

  revalidatePath("/dashboard");

  return { data: JSON.parse(JSON.stringify(column)) };
}

export async function deleteColumn(id: string) {
  const session = await getSession();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }
  const userId = session.user.id;

  await connectDB();

  const column = await Column.findById(id);

  if (!column) {
    return { error: "Column not found" };
  }

  // Verify the column belongs to a board owned by this user
  const board = await Board.findOne({
    _id: column.boardId,
    userId,
  });

  if (!board) {
    return { error: "Unauthorized" };
  }

  // Remove all job applications in this column
  await JobApplication.deleteMany({ columnId: column._id });

  // Remove the column from the board's columns array
  board.columns = board.columns.filter(
    (colId: mongoose.Types.ObjectId) => colId.toString() !== id.toString()
  );
  await board.save();

  await Column.deleteOne({ _id: column._id });

  revalidatePath("/dashboard");

  return { success: true };
}

export async function updateColumnOrder(columnId: string, newOrder: number) {
  const session = await getSession();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }
  const userId = session.user.id;

  await connectDB();

  const column = await Column.findById(columnId);
  if (!column) return { error: "Column not found" };

  const board = await Board.findOne({
    _id: column.boardId,
    userId,
  });

  if (!board) return { error: "Unauthorized" };

  column.order = newOrder;
  await column.save();

  revalidatePath("/dashboard");

  return { success: true };
}
