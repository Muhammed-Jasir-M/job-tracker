"use client";

import { Board, Column, JobApplication } from "@/lib/models/models.types";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Briefcase,
  Calendar,
  CheckCircle2,
  Inbox,
  Mic,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import CreateJobApplicationDialog from "./create-job-dialog";
import JobApplicationCard from "./job-application-card";
import { useBoard } from "@/lib/hooks/useBoards";
import { createColumn, deleteColumn, renameColumn, updateColumnOrder } from "@/lib/actions/columns";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useMemo } from "react";

interface KanbanBoardProps {
  board: Board;
  userId: string;
}

interface ColConfig {
  accentColor: string;
  badgeStyle: string;
  icon: React.ReactNode;
  dot: string;
}

const COLUMN_CONFIG: Array<ColConfig> = [
  {
    accentColor: "bg-sky-500",
    badgeStyle: "bg-sky-50 text-sky-700 border-sky-200/80",
    icon: <Calendar className="h-4 w-4 text-sky-600" />,
    dot: "bg-sky-500",
  },
  {
    accentColor: "bg-violet-500",
    badgeStyle: "bg-violet-50 text-violet-700 border-violet-200/80",
    icon: <CheckCircle2 className="h-4 w-4 text-violet-600" />,
    dot: "bg-violet-500",
  },
  {
    accentColor: "bg-amber-500",
    badgeStyle: "bg-amber-50 text-amber-700 border-amber-200/80",
    icon: <Mic className="h-4 w-4 text-amber-600" />,
    dot: "bg-amber-500",
  },
  {
    accentColor: "bg-emerald-500",
    badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    icon: <Award className="h-4 w-4 text-emerald-600" />,
    dot: "bg-emerald-500",
  },
  {
    accentColor: "bg-rose-500",
    badgeStyle: "bg-rose-50 text-rose-700 border-rose-200/80",
    icon: <XCircle className="h-4 w-4 text-rose-600" />,
    dot: "bg-rose-500",
  },
];

function AddColumnDialog({ boardId }: { boardId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const result = await createColumn({ boardId, name });
    if (!result.error) {
      setOpen(false);
      setName("");
    } else {
      console.error("Failed to create column:", result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-12 w-[320px] shrink-0 justify-center text-sm font-semibold text-slate-500 hover:text-violet-700 border-dashed border-2 border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 rounded-2xl shadow-none gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Column
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            Add New Column
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Create a new stage in your application pipeline.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4 pt-2" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="column-name" className="text-xs font-semibold text-slate-700">
              Column Name
            </Label>
            <Input
              id="column-name"
              required
              autoFocus
              placeholder="e.g. Phone Screen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-slate-200 rounded-xl"
            />
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl border-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white shadow-glow-indigo rounded-xl"
            >
              Add Column
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RenameColumnDialog({
  columnId,
  initialName,
  open,
  onOpenChange,
  onRename,
}: {
  columnId: string;
  initialName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRename: (columnId: string, name: string) => void;
}) {
  const [name, setName] = useState(initialName);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            Rename Column
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Update the name of this pipeline stage.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4 pt-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            onRename(columnId, name.trim());
            onOpenChange(false);
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="rename-column" className="text-xs font-semibold text-slate-700">
              Column Name
            </Label>
            <Input
              id="rename-column"
              required
              autoFocus
              placeholder="e.g. Phone Screen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-slate-200 rounded-xl"
            />
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white shadow-glow-indigo rounded-xl"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DroppableColumn({
  column,
  config,
  boardId,
  sortedColumns,
  searchQuery,
  priorityFilter,
  sortBy,
  onRename,
  onDelete,
  onMoveLeft,
  onMoveRight,
  canMoveLeft,
  canMoveRight,
}: {
  column: Column;
  config: ColConfig;
  boardId: string;
  sortedColumns: Column[];
  searchQuery: string;
  priorityFilter: string;
  sortBy: string;
  onRename: (columnId: string, name: string) => void;
  onDelete: (columnId: string) => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column._id,
    data: {
      type: "column",
      columnId: column._id,
    },
  });

  const sortedJobs = useMemo(() => {
    let jobs = [...(column.jobApplications || [])];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.company.toLowerCase().includes(q) ||
          j.position.toLowerCase().includes(q) ||
          (j.tags && j.tags.some((t) => t.toLowerCase().includes(q))) ||
          (j.location && j.location.toLowerCase().includes(q))
      );
    }

    // 2. Priority Filter (Task Manager style)
    if (priorityFilter && priorityFilter !== "all") {
      jobs = jobs.filter(
        (j) => (j.priority || "Medium").toLowerCase() === priorityFilter.toLowerCase()
      );
    }

    // 3. Sorting (Task Manager style)
    if (sortBy === "company_asc") {
      jobs.sort((a, b) => a.company.localeCompare(b.company));
    } else if (sortBy === "company_desc") {
      jobs.sort((a, b) => b.company.localeCompare(a.company));
    } else if (sortBy === "priority_desc") {
      const pMap: Record<string, number> = { high: 3, medium: 2, low: 1 };
      jobs.sort((a, b) => {
        const pA = pMap[(a.priority || "medium").toLowerCase()] || 0;
        const pB = pMap[(b.priority || "medium").toLowerCase()] || 0;
        return pB - pA;
      });
    } else {
      jobs.sort((a, b) => a.order - b.order);
    }

    return jobs;
  }, [column.jobApplications, searchQuery, priorityFilter, sortBy]);

  return (
    <Card className="w-[320px] shrink-0 border border-slate-200/80 shadow-card bg-white rounded-2xl flex flex-col transition-all">
      {/* Top accent border line */}
      <div className={`h-1.5 w-full ${config.accentColor} rounded-t-2xl`} />

      <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between border-b border-slate-100 space-y-0">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg border ${config.badgeStyle}`}>
            {config.icon}
          </div>
          <CardTitle className="text-slate-900 text-sm font-bold tracking-tight flex items-center gap-2">
            {column.name}
            <span className="min-w-6 px-2 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-center">
              {sortedJobs.length}
            </span>
          </CardTitle>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-xl">
            <DropdownMenuItem
              className="cursor-pointer text-xs font-medium text-slate-700"
              onClick={() => onRename(column._id, column.name)}
            >
              <Pencil className="mr-2 h-4 w-4 text-slate-500" />
              Rename Column
            </DropdownMenuItem>

            {canMoveLeft && (
              <DropdownMenuItem
                className="cursor-pointer text-xs font-medium text-slate-700"
                onClick={onMoveLeft}
              >
                <ArrowLeft className="mr-2 h-4 w-4 text-slate-500" />
                Move Left
              </DropdownMenuItem>
            )}

            {canMoveRight && (
              <DropdownMenuItem
                className="cursor-pointer text-xs font-medium text-slate-700"
                onClick={onMoveRight}
              >
                <ArrowRight className="mr-2 h-4 w-4 text-slate-500" />
                Move Right
              </DropdownMenuItem>
            )}

            <div className="my-1 border-t border-slate-100" />

            <DropdownMenuItem
              className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer text-xs font-medium"
              onClick={() => onDelete(column._id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent
        ref={setNodeRef}
        className={`flex-1 p-3 space-y-3 bg-slate-50/70 min-h-[460px] rounded-b-2xl transition-colors ${
          isOver ? "bg-violet-50/70 ring-2 ring-violet-400/50 ring-inset" : ""
        }`}
      >
        <SortableContext
          items={sortedJobs.map((job) => job._id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedJobs.map((job, key) => (
            <SortableJobCard
              key={key}
              job={{ ...job, columnId: job.columnId || column._id }}
              columns={sortedColumns}
            />
          ))}
        </SortableContext>

        {sortedJobs.length === 0 && (
          <div className="py-10 flex flex-col items-center justify-center text-center rounded-xl border-2 border-dashed border-slate-200 bg-white/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
              <Inbox className="h-5 w-5" />
            </div>
            <p className="text-xs font-medium text-slate-500">
              No applications here yet
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Drag cards here or add a new one below
            </p>
          </div>
        )}

        <CreateJobApplicationDialog columnId={column._id} boardId={boardId} />
      </CardContent>
    </Card>
  );
}

function SortableJobCard({
  job,
  columns,
}: {
  job: JobApplication;
  columns: Column[];
}) {
  const {
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef,
  } = useSortable({
    id: job._id,
    data: {
      type: "job",
      job,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <JobApplicationCard
        job={job}
        columns={columns}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export default function KanbanBoard({ board }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [columnFilter, setColumnFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [renameTarget, setRenameTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const { columns, moveJob } = useBoard(board);

  const sortedColumns = useMemo(() => {
    if (!columns) return [];
    return [...columns].sort((a, b) => a.order - b.order);
  }, [columns]);

  // Summary statistics calculations
  const stats = useMemo(() => {
    const allJobs = sortedColumns.flatMap((col) => col.jobApplications || []);
    const total = allJobs.length;

    let applied = 0;
    let interviewing = 0;
    let offers = 0;
    let rejected = 0;

    sortedColumns.forEach((col) => {
      const colName = col.name.toLowerCase();
      const count = col.jobApplications?.length || 0;
      if (colName.includes("applied") || colName.includes("wish")) {
        applied += count;
      } else if (colName.includes("interview")) {
        interviewing += count;
      } else if (colName.includes("offer")) {
        offers += count;
      } else if (colName.includes("reject")) {
        rejected += count;
      }
    });

    return { total, applied, interviewing, offers, rejected };
  }, [sortedColumns]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
      priorityFilter !== "all" ||
      columnFilter !== "all" ||
      sortBy !== "default"
  );

  function handleRenameColumn(columnId: string, name: string) {
    renameColumn(columnId, name).then((result) => {
      if (result.error) {
        console.error("Failed to rename column:", result.error);
      }
    });
  }

  function handleDeleteColumn(columnId: string) {
    const column = sortedColumns.find((c) => c._id === columnId);
    if (!column) return;

    if (
      window.confirm(
        `Delete "${column.name}" and all ${column.jobApplications?.length || 0} application(s) inside it?`
      )
    ) {
      deleteColumn(columnId).then((result) => {
        if (result.error) {
          console.error("Failed to delete column:", result.error);
        }
      });
    }
  }

  async function handleMoveColumn(columnIndex: number, direction: "left" | "right") {
    const targetIndex = direction === "left" ? columnIndex - 1 : columnIndex + 1;
    if (targetIndex < 0 || targetIndex >= sortedColumns.length) return;

    const currentCol = sortedColumns[columnIndex];
    const targetCol = sortedColumns[targetIndex];

    const currentOrder = currentCol.order;
    const targetOrder = targetCol.order;

    await updateColumnOrder(currentCol._id, targetOrder);
    await updateColumnOrder(targetCol._id, currentOrder);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  async function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null);

    if (!over || !board._id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    let draggedJob: JobApplication | null = null;
    let sourceColumn: Column | null = null;
    let sourceIndex = -1;

    for (const column of sortedColumns) {
      const jobs =
        column.jobApplications.sort((a, b) => a.order - b.order) || [];
      const jobIndex = jobs.findIndex((j) => j._id === activeId);
      if (jobIndex !== -1) {
        draggedJob = jobs[jobIndex];
        sourceColumn = column;
        sourceIndex = jobIndex;
        break;
      }
    }

    if (!draggedJob || !sourceColumn) return;

    // Check if dropped in a column or another job
    const targetColumn = sortedColumns.find((col) => col._id === overId);
    const targetJob = sortedColumns
      .flatMap((col) => col.jobApplications || [])
      .find((job) => job._id === overId);

    let targetColumnId: string;
    let newOrder: number;

    if (targetColumn) {
      targetColumnId = targetColumn._id;
      const jobsInTarget =
        targetColumn.jobApplications
          .filter((j) => j._id !== activeId)
          .sort((a, b) => a.order - b.order) || [];
      newOrder = jobsInTarget.length;
    } else if (targetJob) {
      const targetJobColumn = sortedColumns.find((col) =>
        col.jobApplications.some((j) => j._id === targetJob._id)
      );
      targetColumnId = targetJob.columnId || targetJobColumn?._id || "";
      if (!targetColumnId) return;

      const targetColumnObj = sortedColumns.find(
        (col) => col._id === targetColumnId
      );

      if (!targetColumnObj) return;

      const allJobsInTargetOriginal =
        targetColumnObj.jobApplications.sort((a, b) => a.order - b.order) || [];

      const allJobsInTargetFiltered =
        allJobsInTargetOriginal.filter((j) => j._id !== activeId) || [];

      const targetIndexInOriginal = allJobsInTargetOriginal.findIndex(
        (j) => j._id === overId
      );

      const targetIndexInFiltered = allJobsInTargetFiltered.findIndex(
        (j) => j._id === overId
      );

      if (targetIndexInFiltered !== -1) {
        if (sourceColumn._id === targetColumnId) {
          if (sourceIndex < targetIndexInOriginal) {
            newOrder = targetIndexInFiltered + 1;
          } else {
            newOrder = targetIndexInFiltered;
          }
        } else {
          newOrder = targetIndexInFiltered;
        }
      } else {
        newOrder = allJobsInTargetFiltered.length;
      }
    } else {
      return;
    }

    if (!targetColumnId) {
      return;
    }

    await moveJob(activeId, targetColumnId, newOrder);
  }

  const activeJob = sortedColumns
    .flatMap((col) => col.jobApplications || [])
    .find((job) => job._id === activeId);

  return (
    <div className="space-y-6">
      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card overflow-hidden">
          <div className="absolute -top-8 -right-8 h-20 w-20 rounded-full bg-violet-100/60 blur-2xl" />
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Tracked
            </span>
            <div className="rounded-lg bg-violet-50 p-2 text-violet-600 shadow-sm">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">
              {stats.total}
            </span>
          </div>
        </div>

        <div className="relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card overflow-hidden">
          <div className="absolute -top-8 -right-8 h-20 w-20 rounded-full bg-sky-100/60 blur-2xl" />
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Applied / Wishlist
            </span>
            <div className="rounded-lg bg-sky-50 p-2 text-sky-600 shadow-sm">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">
              {stats.applied}
            </span>
          </div>
        </div>

        <div className="relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card overflow-hidden">
          <div className="absolute -top-8 -right-8 h-20 w-20 rounded-full bg-amber-100/60 blur-2xl" />
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Interviewing
            </span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600 shadow-sm">
              <Mic className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">
              {stats.interviewing}
            </span>
          </div>
        </div>

        <div className="relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card overflow-hidden">
          <div className="absolute -top-8 -right-8 h-20 w-20 rounded-full bg-emerald-100/60 blur-2xl" />
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Offers
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 shadow-sm">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">
              {stats.offers}
            </span>
          </div>
        </div>

        <div className="relative col-span-2 sm:col-span-1 flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card overflow-hidden">
          <div className="absolute -top-8 -right-8 h-20 w-20 rounded-full bg-rose-100/60 blur-2xl" />
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Archived / Rejected
            </span>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600 shadow-sm">
              <XCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">
              {stats.rejected}
            </span>
          </div>
        </div>
      </div>

      {/* Board Controls Bar: Search, Priority Filter & Sort Options (Task Manager style) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-card">
        {/* Search Input */}
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search applications by role, company, tag, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-slate-200 bg-slate-50/70 focus:bg-white text-xs sm:text-sm rounded-xl"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Column / Stage Filter */}
          <select
            value={columnFilter}
            onChange={(e) => setColumnFilter(e.target.value)}
            className="h-10 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer transition-colors"
          >
            <option value="all">All Stages</option>
            {sortedColumns.map((col) => (
              <option key={col._id} value={col._id}>
                {col.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-10 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer transition-colors"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* Sort By Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer transition-colors"
          >
            <option value="default">Sort: Default Order</option>
            <option value="company_asc">Company (A - Z)</option>
            <option value="company_desc">Company (Z - A)</option>
            <option value="priority_desc">Priority (High to Low)</option>
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setPriorityFilter("all");
                setColumnFilter("all");
                setSortBy("default");
              }}
              className="h-10 px-3 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/80 rounded-xl"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Kanban Board Drag & Drop area */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-5 overflow-x-auto pb-6 pt-1 items-start min-h-[550px]">
          {sortedColumns
            .filter(
              (col) => columnFilter === "all" || col._id === columnFilter
            )
            .map((col, index) => {
              const config = COLUMN_CONFIG[index] || {
                accentColor: "bg-slate-400",
                badgeStyle: "bg-slate-100 text-slate-700 border-slate-200",
                icon: <Calendar className="h-4 w-4 text-slate-600" />,
                dot: "bg-slate-400",
              };
              const colIndexInSorted = sortedColumns.findIndex((c) => c._id === col._id);
              return (
                <DroppableColumn
                  key={col._id}
                  column={col}
                  config={config}
                  boardId={board._id}
                  sortedColumns={sortedColumns}
                  searchQuery={searchQuery}
                  priorityFilter={priorityFilter}
                  sortBy={sortBy}
                  onRename={(columnId, name) => {
                    setRenameTarget({ id: columnId, name });
                  }}
                  onDelete={handleDeleteColumn}
                  canMoveLeft={colIndexInSorted > 0}
                  canMoveRight={colIndexInSorted < sortedColumns.length - 1}
                  onMoveLeft={() => handleMoveColumn(colIndexInSorted, "left")}
                  onMoveRight={() => handleMoveColumn(colIndexInSorted, "right")}
                />
              );
            })}

          {columnFilter === "all" && <AddColumnDialog boardId={board._id} />}
        </div>

        <DragOverlay>
          {activeJob ? (
            <div className="opacity-90 scale-105 shadow-2xl">
              <JobApplicationCard job={activeJob} columns={sortedColumns} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <RenameColumnDialog
        columnId={renameTarget?.id || ""}
        initialName={renameTarget?.name || ""}
        open={Boolean(renameTarget)}
        onOpenChange={(open) => {
          if (!open) setRenameTarget(null);
        }}
        onRename={handleRenameColumn}
      />
    </div>
  );
}


