"use client";

import { useState } from "react";
import { Board, Column, JobApplication } from "../models/models.types";
import { getGuestBoardFromStorage, saveGuestBoardToStorage } from "../guest-storage";
import { updateJobApplication } from "../actions/job-applications";

export function useBoard(initialBoard?: Board | null) {
  const [boardState, setBoardState] = useState<{
    prevInitialBoard: Board | null | undefined;
    board: Board | null;
    columns: Column[];
  }>(() => {
    const b =
      initialBoard?._id === "demo-board" && typeof window !== "undefined"
        ? getGuestBoardFromStorage()
        : initialBoard || null;
    return {
      prevInitialBoard: initialBoard,
      board: b,
      columns: b?.columns || [],
    };
  });

  if (initialBoard !== boardState.prevInitialBoard) {
    const b =
      initialBoard?._id === "demo-board" && typeof window !== "undefined"
        ? getGuestBoardFromStorage()
        : initialBoard || null;
    setBoardState({
      prevInitialBoard: initialBoard,
      board: b,
      columns: b?.columns || [],
    });
  }

  const { board, columns } = boardState;

  function setColumns(
    updater: (prev: Column[]) => Column[]
  ) {
    setBoardState((prev) => ({
      ...prev,
      columns: updater(prev.columns),
    }));
  }

  async function moveJob(
    jobApplicationId: string,
    newColumnId: string,
    newOrder: number
  ) {
    setColumns((prev) => {
      const newColumns = prev.map((col) => ({
        ...col,
        jobApplications: [...col.jobApplications],
      }));

      let jobToMove: JobApplication | null = null;
      let oldColumnId: string | null = null;

      for (const col of newColumns) {
        const jobIndex = col.jobApplications.findIndex(
          (j) => j._id === jobApplicationId
        );
        if (jobIndex !== -1 && jobIndex !== undefined) {
          jobToMove = col.jobApplications[jobIndex];
          oldColumnId = col._id;
          col.jobApplications = col.jobApplications.filter(
            (job) => job._id !== jobApplicationId
          );
          break;
        }
      }

      if (jobToMove && oldColumnId) {
        const targetColumnIndex = newColumns.findIndex(
          (col) => col._id === newColumnId
        );
        if (targetColumnIndex !== -1) {
          const targetColumn = newColumns[targetColumnIndex];
          const currentJobs = targetColumn.jobApplications || [];

          const updatedJobs = [...currentJobs];
          updatedJobs.splice(newOrder, 0, {
            ...jobToMove,
            columnId: newColumnId,
            order: newOrder * 100,
          });

          const jobsWithUpdatedOrders = updatedJobs.map((job, idx) => ({
            ...job,
            order: idx * 100,
          }));

          newColumns[targetColumnIndex] = {
            ...targetColumn,
            jobApplications: jobsWithUpdatedOrders,
          };
        }
      }

      if (board?._id === "demo-board") {
        const updatedBoard = { ...board, columns: newColumns };
        saveGuestBoardToStorage(updatedBoard);
      }

      return newColumns;
    });

    if (board?._id !== "demo-board") {
      try {
        await updateJobApplication(jobApplicationId, {
          columnId: newColumnId,
          order: newOrder,
        });
      } catch (err) {
        console.error("Error", err);
      }
    }
  }

  return { board, columns, moveJob };
}
