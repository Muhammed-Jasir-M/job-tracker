"use client";

import { Board, Column, JobApplication } from "./models/models.types";
import { demoBoard } from "./demo-data";
import { GuestJobData } from "./actions/migrate-guest";

export const GUEST_BOARD_ID = "demo-board";

export function isGuestBoard(boardId?: string | null): boolean {
  return boardId === GUEST_BOARD_ID;
}

const GUEST_STORAGE_KEY = "job_tracker_guest_board_v2";
const GUEST_ID_KEY = "job_tracker_guest_id";

export function getOrCreateGuestId(): string {
  if (typeof window === "undefined") return "guest_ssr";
  let guestId = localStorage.getItem(GUEST_ID_KEY);
  if (!guestId) {
    guestId = `guest_${crypto.randomUUID()}`;
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }
  return guestId;
}

export function getGuestBoardFromStorage(): Board {
  if (typeof window === "undefined") {
    return demoBoard;
  }

  try {
    const data = localStorage.getItem(GUEST_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && parsed.columns) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to read guest board from localStorage", err);
  }

  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(demoBoard));
  } catch (err) {
    console.error("Failed to write initial guest board to localStorage", err);
  }

  return demoBoard;
}

export function saveGuestBoardToStorage(board: Board) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(board));
    
    // Extract all guest job applications for migration when user signs up
    const allGuestJobs: GuestJobData[] = [];
    board.columns?.forEach((col) => {
      col.jobApplications?.forEach((job) => {
        allGuestJobs.push({
          company: job.company,
          position: job.position,
          location: job.location,
          priority: job.priority,
          notes: job.notes,
          salary: job.salary,
          jobUrl: job.jobUrl,
          columnName: col.name,
          tags: job.tags,
          description: job.description,
          order: job.order,
        });
      });
    });
    localStorage.setItem("job_tracker_guest_jobs", JSON.stringify(allGuestJobs));
  } catch (err) {
    console.error("Failed to save guest board to localStorage", err);
  }
}

export function clearGuestBoardFromStorage() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GUEST_STORAGE_KEY);
    localStorage.removeItem(GUEST_ID_KEY);
    localStorage.removeItem("job_tracker_guest_jobs");
  } catch (err) {
    console.error("Failed to clear guest board from localStorage", err);
  }
}

// ---- Coherent read-modify-write helpers for the guest board ----
// Each returns the updated Board so callers can re-render consistently.

const GUEST_JOB_PREFIX = "guest-job-";

function cloneBoard(board: Board): Board {
  return JSON.parse(JSON.stringify(board));
}

export function addGuestJob(input: {
  columnId: string;
  company: string;
  position: string;
  location?: string;
  priority?: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  tags?: string[];
  description?: string;
}): Board {
  const board = getGuestBoardFromStorage();
  const id = `${GUEST_JOB_PREFIX}${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  const newJob: JobApplication = {
    _id: id,
    company: input.company,
    position: input.position,
    location: input.location,
    priority: input.priority || "Medium",
    notes: input.notes,
    salary: input.salary,
    jobUrl: input.jobUrl,
    columnId: input.columnId,
    tags: input.tags || [],
    description: input.description,
    status: "applied",
    order: Date.now(),
  };

  const next = cloneBoard(board);
  next.columns = (next.columns || []).map((col) =>
    col._id === input.columnId
      ? { ...col, jobApplications: [...(col.jobApplications || []), newJob] }
      : col
  );
  saveGuestBoardToStorage(next);
  return next;
}

export function updateGuestJob(
  jobId: string,
  patch: Partial<JobApplication>
): Board {
  const board = getGuestBoardFromStorage();
  const next = cloneBoard(board);
  next.columns = (next.columns || []).map((col) => ({
    ...col,
    jobApplications: (col.jobApplications || []).map((job) =>
      job._id === jobId ? { ...job, ...patch } : job
    ),
  }));
  saveGuestBoardToStorage(next);
  return next;
}

export function deleteGuestJob(jobId: string): Board {
  const board = getGuestBoardFromStorage();
  const next = cloneBoard(board);
  next.columns = (next.columns || []).map((col) => ({
    ...col,
    jobApplications: (col.jobApplications || []).filter(
      (job) => job._id !== jobId
    ),
  }));
  saveGuestBoardToStorage(next);
  return next;
}

export function moveGuestJob(
  jobId: string,
  newColumnId: string,
  newOrder: number
): Board {
  const board = getGuestBoardFromStorage();
  const next = cloneBoard(board);

  let jobToMove: JobApplication | null = null;
  next.columns = (next.columns || []).map((col) => {
    if (col.jobApplications?.some((j) => j._id === jobId)) {
      jobToMove = col.jobApplications.find((j) => j._id === jobId) || null;
      return {
        ...col,
        jobApplications: (col.jobApplications || []).filter(
          (j) => j._id !== jobId
        ),
      };
    }
    return col;
  });

  if (jobToMove) {
    next.columns = (next.columns || []).map((col) => {
      if (col._id !== newColumnId) return col;
      const updated = col.jobApplications || [];
      updated.splice(newOrder, 0, {
        ...jobToMove!,
        columnId: newColumnId,
        order: newOrder,
      });
      return {
        ...col,
        jobApplications: updated.map((j, idx) => ({ ...j, order: idx })),
      };
    });
  }

  saveGuestBoardToStorage(next);
  return next;
}

export function addGuestColumn(name: string): Board {
  const board = getGuestBoardFromStorage();
  const next = cloneBoard(board);
  const columns = next.columns || [];
  const newColumn: Column = {
    _id: `${GUEST_JOB_PREFIX}col-${Date.now()}-${Math.floor(
      Math.random() * 1e6
    )}`,
    name,
    order: columns.length,
    jobApplications: [],
  };
  next.columns = [...columns, newColumn];
  saveGuestBoardToStorage(next);
  return next;
}

export function renameGuestColumn(columnId: string, name: string): Board {
  const board = getGuestBoardFromStorage();
  const next = cloneBoard(board);
  next.columns = (next.columns || []).map((col) =>
    col._id === columnId ? { ...col, name } : col
  );
  saveGuestBoardToStorage(next);
  return next;
}

export function deleteGuestColumn(columnId: string): Board {
  const board = getGuestBoardFromStorage();
  const next = cloneBoard(board);
  next.columns = (next.columns || []).filter((col) => col._id !== columnId);
  saveGuestBoardToStorage(next);
  return next;
}

export function reorderGuestColumns(columnAId: string, columnBId: string): Board {
  const board = getGuestBoardFromStorage();
  const next = cloneBoard(board);
  const columns = (next.columns || []).map((col) => ({ ...col }));
  const a = columns.find((c) => c._id === columnAId);
  const b = columns.find((c) => c._id === columnBId);
  if (a && b) {
    const aOrder = a.order;
    a.order = b.order;
    b.order = aOrder;
  }
  next.columns = columns;
  saveGuestBoardToStorage(next);
  return next;
}

export function refreshGuestBoard(board: Board): Board {
  if (board._id !== GUEST_BOARD_ID) return board;
  return getGuestBoardFromStorage();
}
