"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Board, Column, JobApplication } from "@/lib/models/models.types";
import {
  DollarSign,
  ExternalLink,
  Kanban,
  MapPin,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { deleteJobApplication, updateJobApplication } from "@/lib/actions/job-applications";

interface ApplicationsManagerProps {
  board: Board;
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-violet-100 text-violet-700 border-violet-200",
    "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
    "bg-sky-100 text-sky-700 border-sky-200",
    "bg-emerald-100 text-emerald-700 border-emerald-200",
    "bg-amber-100 text-amber-700 border-amber-200",
    "bg-rose-100 text-rose-700 border-rose-200",
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return colors[sum % colors.length];
}

function getPriorityBadge(priority?: string) {
  switch (priority?.toLowerCase()) {
    case "high":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "medium":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "low":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

export default function ApplicationsManager({ board }: ApplicationsManagerProps) {
  const columns = useMemo(
    () => [...(board.columns || [])].sort((a, b) => a.order - b.order),
    [board.columns]
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [columnFilter, setColumnFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);

  const jobs = useMemo<Array<JobApplication & { columnName: string }>>(() => {
    let all: Array<JobApplication & { columnName: string }> = [];
    columns.forEach((col) => {
      (col.jobApplications || []).forEach((job) => {
        all.push({ ...job, columnName: col.name });
      });
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      all = all.filter(
        (j) =>
          j.company.toLowerCase().includes(q) ||
          j.position.toLowerCase().includes(q) ||
          (j.location && j.location.toLowerCase().includes(q)) ||
          (j.tags && j.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (columnFilter !== "all") {
      all = all.filter((j) => j.columnId === columnFilter);
    }

    if (priorityFilter !== "all") {
      all = all.filter(
        (j) => (j.priority || "Medium").toLowerCase() === priorityFilter.toLowerCase()
      );
    }

    const pMap: Record<string, number> = { high: 3, medium: 2, low: 1 };
    switch (sortBy) {
      case "company_asc":
        all.sort((a, b) => a.company.localeCompare(b.company));
        break;
      case "company_desc":
        all.sort((a, b) => b.company.localeCompare(a.company));
        break;
      case "priority_desc":
        all.sort(
          (a, b) =>
            (pMap[(b.priority || "medium").toLowerCase()] || 0) -
            (pMap[(a.priority || "medium").toLowerCase()] || 0)
        );
        break;
      case "position_asc":
        all.sort((a, b) => a.position.localeCompare(b.position));
        break;
      default:
        all.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    return all;
  }, [columns, searchQuery, columnFilter, priorityFilter, sortBy]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() || columnFilter !== "all" || priorityFilter !== "all" || sortBy !== "default"
  );

  async function handleStatusChange(id: string, columnId: string) {
    await updateJobApplication(id, { columnId });
  }

  async function handleDelete(id: string, company: string) {
    if (window.confirm(`Delete the application for ${company}?`)) {
      await deleteJobApplication(id);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header + board link */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
              Management
            </p>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            All Applications
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Search, filter, and manage every application from one place.
          </p>
        </div>
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 text-slate-600 hover:text-violet-700 hover:border-violet-300 gap-2"
          >
            <Kanban className="h-4 w-4" />
            View Board
          </Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-card">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by role, company, tag, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-slate-200 bg-slate-50/70 focus:bg-white text-xs sm:text-sm rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={columnFilter}
            onChange={(e) => setColumnFilter(e.target.value)}
            className="h-10 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer transition-colors"
          >
            <option value="all">All Stages</option>
            {columns.map((col) => (
              <option key={col._id} value={col._id}>
                {col.name}
              </option>
            ))}
          </select>

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

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer transition-colors"
          >
            <option value="default">Sort: Default Order</option>
            <option value="company_asc">Company (A - Z)</option>
            <option value="company_desc">Company (Z - A)</option>
            <option value="position_asc">Position (A - Z)</option>
            <option value="priority_desc">Priority (High to Low)</option>
          </select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setColumnFilter("all");
                setPriorityFilter("all");
                setSortBy("default");
              }}
              className="h-10 px-3 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/80 rounded-xl"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">
            Applications{" "}
            <span className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-violet-50 text-violet-700 border border-violet-200">
              {jobs.length}
            </span>
          </h2>
        </div>

        {jobs.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center px-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
              <Search className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-600">
              No applications found
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {hasActiveFilters
                ? "Try adjusting your search or filters."
                : "Add applications from the board view to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/70">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">
                    Salary
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => {
                  return (
                    <tr key={job._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                              <span className="truncate">{job.company}</span>
                              {job.jobUrl && (
                                <a
                                  href={job.jobUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-slate-400 hover:text-violet-600"
                                  title="Open listing"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-400 sm:hidden">
                              {job.location && (
                                <span className="inline-flex items-center gap-0.5 truncate">
                                  <MapPin className="h-3 w-3" />
                                  {job.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-700 font-medium block max-w-52 truncate">
                          {job.position}
                        </span>
                        {job.tags && job.tags.length > 0 && (
                          <div className="flex gap-1 mt-0.5 max-w-52 overflow-hidden">
                            {job.tags.slice(0, 2).map((tag, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-violet-50 text-violet-700 border border-violet-200/60 truncate"
                              >
                                {tag}
                              </span>
                            ))}
                            {job.tags.length > 2 && (
                              <span className="text-[10px] text-slate-400">
                                +{job.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={job.columnId || ""}
                          onChange={(e) => handleStatusChange(job._id, e.target.value)}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg px-2 py-1.5 border border-slate-200 focus:border-violet-500 focus:outline-none cursor-pointer transition-colors max-w-36"
                        >
                          {columns.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-[11px] font-semibold rounded-md border ${getPriorityBadge(
                            job.priority
                          )}`}
                        >
                          {job.priority || "Medium"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 hidden lg:table-cell">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {job.location || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 hidden xl:table-cell">
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                          {job.salary || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setEditingJob(job)}
                            className="h-8 w-8 text-slate-400 hover:text-violet-700 hover:bg-violet-50 rounded-lg"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDelete(job._id, job.company)}
                            className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog open={Boolean(editingJob)} onOpenChange={(o) => !o && setEditingJob(null)}>
        <DialogContent className="max-w-2xl rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Edit Job Application
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Update details for {editingJob?.position} at {editingJob?.company}.
            </DialogDescription>
          </DialogHeader>
          {editingJob && (
            <EditJobForm job={editingJob} columns={columns} onDone={() => setEditingJob(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EditJobForm({
  job,
  columns,
  onDone,
}: {
  job: JobApplication;
  columns: Column[];
  onDone: () => void;
}) {
  const [formData, setFormData] = useState({
    company: job.company,
    position: job.position,
    location: job.location || "",
    priority: job.priority || "Medium",
    notes: job.notes || "",
    salary: job.salary || "",
    jobUrl: job.jobUrl || "",
    columnId: job.columnId || columns[0]?._id || "",
    tags: job.tags?.join(", ") || "",
    description: job.description || "",
  });

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    const result = await updateJobApplication(job._id, {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    });

    if (!result.error) {
      onDone();
    }
  }

  return (
    <form className="space-y-4 pt-2" onSubmit={handleUpdate}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="mg-company" className="text-xs font-semibold text-slate-700">
            Company *
          </Label>
          <Input
            id="mg-company"
            required
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="border-slate-200 rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mg-position" className="text-xs font-semibold text-slate-700">
            Position *
          </Label>
          <Input
            id="mg-position"
            required
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="border-slate-200 rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="mg-location" className="text-xs font-semibold text-slate-700">
            Location
          </Label>
          <Input
            id="mg-location"
            value={formData.location}
            placeholder="e.g. Remote"
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="border-slate-200 rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mg-salary" className="text-xs font-semibold text-slate-700">
            Salary
          </Label>
          <Input
            id="mg-salary"
            value={formData.salary}
            placeholder="e.g. $120k"
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            className="border-slate-200 rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mg-priority" className="text-xs font-semibold text-slate-700">
            Priority
          </Label>
          <select
            id="mg-priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="mg-stage" className="text-xs font-semibold text-slate-700">
            Stage
          </Label>
          <select
            id="mg-stage"
            value={formData.columnId}
            onChange={(e) => setFormData({ ...formData, columnId: e.target.value })}
            className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          >
            {columns.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mg-jobUrl" className="text-xs font-semibold text-slate-700">
            Job Listing URL
          </Label>
          <Input
            id="mg-jobUrl"
            type="url"
            placeholder="https://..."
            value={formData.jobUrl}
            onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
            className="border-slate-200 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="mg-tags" className="text-xs font-semibold text-slate-700">
          Tags (comma-separated)
        </Label>
        <Input
          id="mg-tags"
          placeholder="React, Remote, High Priority"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="border-slate-200 rounded-xl"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="mg-description" className="text-xs font-semibold text-slate-700">
          Role Description
        </Label>
        <Textarea
          id="mg-description"
          rows={2}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="border-slate-200 rounded-xl"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="mg-notes" className="text-xs font-semibold text-slate-700">
          Personal Notes
        </Label>
        <Textarea
          id="mg-notes"
          rows={2}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="border-slate-200 rounded-xl"
        />
      </div>

      <DialogFooter className="gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onDone}
          className="rounded-xl border-slate-200"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 text-white shadow-glow-indigo rounded-xl"
        >
          Save Changes
        </Button>
      </DialogFooter>
    </form>
  );
}
