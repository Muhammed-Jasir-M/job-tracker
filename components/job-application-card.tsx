"use client";

import { JobApplication, Column } from "@/lib/models/models.types";
import { Card, CardContent } from "./ui/card";
import {
  Building2,
  DollarSign,
  Edit2,
  ExternalLink,
  GripVertical,
  MapPin,
  MoreVertical,
  MoveRight,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  deleteJobApplication,
  updateJobApplication,
} from "@/lib/actions/job-applications";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import React, { useState } from "react";

interface JobApplicationCardProps {
  job: JobApplication;
  columns: Column[];
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

// Generate pastel avatar background color based on company name
function getAvatarColor(name: string) {
  const colors = [
    "bg-violet-100 text-violet-700 border-violet-200",
    "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
    "bg-sky-100 text-sky-700 border-sky-200",
    "bg-emerald-100 text-emerald-700 border-emerald-200",
    "bg-amber-100 text-amber-700 border-amber-200",
    "bg-rose-100 text-rose-700 border-rose-200",
  ];
  let charCodeSum = 0;
  for (let i = 0; i < name.length; i++) {
    charCodeSum += name.charCodeAt(i);
  }
  return colors[charCodeSum % colors.length];
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

export default function JobApplicationCard({
  job,
  columns,
  dragHandleProps,
}: JobApplicationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company: job.company,
    position: job.position,
    location: job.location || "",
    priority: job.priority || "Medium",
    notes: job.notes || "",
    salary: job.salary || "",
    jobUrl: job.jobUrl || "",
    columnId: job.columnId || "",
    tags: job.tags?.join(", ") || "",
    description: job.description || "",
  });

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await updateJobApplication(job._id, {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      });

      if (!result.error) {
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to update job application: ", err);
    }
  }

  async function handleDelete() {
    try {
      const result = await deleteJobApplication(job._id);
      if (result.error) {
        console.error("Failed to delete job application:", result.error);
      }
    } catch (err) {
      console.error("Failed to delete job application: ", err);
    }
  }

  async function handleMove(newColumnId: string) {
    try {
      await updateJobApplication(job._id, {
        columnId: newColumnId,
      });
    } catch (err) {
      console.error("Failed to move job application: ", err);
    }
  }

  const avatarColorClass = getAvatarColor(job.company || "Company");
  const currentColumn = columns.find((c) => c._id === job.columnId);

  return (
    <>
      <Card className="group relative border border-slate-200/80 bg-white hover:border-violet-300 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 rounded-xl">
        <CardContent className="p-3.5 space-y-3">
          {/* Header Row: Drag Handle + Company Avatar + Role Title + Actions */}
          <div className="flex items-start justify-between gap-1.5">
            <div className="flex items-start gap-2 min-w-0 flex-1">
              {/* Grip Vertical Drag Handle */}
              <div
                {...dragHandleProps}
                className="p-1 -ml-1 text-slate-300 hover:text-violet-600 cursor-grab active:cursor-grabbing rounded hover:bg-violet-50 transition-colors shrink-0 mt-0.5 touch-none"
                title="Drag card to move"
              >
                <GripVertical className="h-4 w-4" />
              </div>

              {/* Company Avatar */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-bold text-xs shadow-xs ${avatarColorClass}`}
              >
                {job.company ? job.company[0].toUpperCase() : "C"}
              </div>

              {/* Position & Company */}
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm text-slate-900 leading-snug truncate group-hover:text-violet-700 transition-colors">
                  {job.position}
                </h3>
                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium truncate mt-0.5">
                  <Building2 className="h-3 w-3 text-slate-400" />
                  <span className="truncate">{job.company}</span>
                </div>
              </div>
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="cursor-pointer"
                >
                  <Edit2 className="mr-2 h-4 w-4 text-slate-500" />
                  Edit Details
                </DropdownMenuItem>

                {columns.length > 1 && (
                  <>
                    <div className="my-1 border-t border-slate-100" />
                    {columns
                      .filter((c) => c._id !== job.columnId)
                      .map((column, key) => (
                        <DropdownMenuItem
                          key={key}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMove(column._id);
                          }}
                          className="cursor-pointer text-xs"
                        >
                          <MoveRight className="mr-2 h-3.5 w-3.5 text-slate-400" />
                          Move to {column.name}
                        </DropdownMenuItem>
                      ))}
                  </>
                )}

                <div className="my-1 border-t border-slate-100" />
                <DropdownMenuItem
                  className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description snippet if available */}
          {job.description && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pl-6">
              {job.description}
            </p>
          )}

          {/* Priority & Metadata badges */}
          <div className="flex flex-wrap items-center gap-2 pl-6 text-xs text-slate-600">
            {job.priority && (
              <span
                className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getPriorityBadge(
                  job.priority
                )}`}
              >
                {job.priority} Priority
              </span>
            )}
            {job.location && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200/60">
                <MapPin className="h-3 w-3 text-slate-400" />
                {job.location}
              </span>
            )}
            {job.salary && (
              <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                <DollarSign className="h-3 w-3 text-emerald-600" />
                {job.salary}
              </span>
            )}
          </div>

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pl-6 pt-0.5">
              {job.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-violet-50 text-violet-700 border border-violet-200/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer Row: Quick Status Selector + Listing Link */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            {job.jobUrl ? (
              <a
                href={job.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <span>Listing</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span className="text-[11px] text-slate-400 font-medium truncate">
                {currentColumn?.name || "Tracked"}
              </span>
            )}

            {/* Quick Status Select Dropdown inspired by Task-Manager */}
            <select
              value={job.columnId || ""}
              onChange={(e) => {
                e.stopPropagation();
                handleMove(e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg px-2 py-1 border border-slate-200 focus:border-violet-500 focus:outline-none cursor-pointer transition-colors"
            >
              {columns.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Edit Job Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Edit Job Application
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Update details for {job.position} at {job.company}.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 pt-2" onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-company" className="text-xs font-semibold text-slate-700">
                    Company *
                  </Label>
                  <Input
                    id="edit-company"
                    required
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-position" className="text-xs font-semibold text-slate-700">
                    Position *
                  </Label>
                  <Input
                    id="edit-position"
                    required
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    className="border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-location" className="text-xs font-semibold text-slate-700">
                    Location
                  </Label>
                  <Input
                    id="edit-location"
                    value={formData.location}
                    placeholder="e.g. Remote"
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-salary" className="text-xs font-semibold text-slate-700">
                    Salary
                  </Label>
                  <Input
                    id="edit-salary"
                    placeholder="e.g. $120k"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                    className="border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-priority" className="text-xs font-semibold text-slate-700">
                    Priority
                  </Label>
                  <select
                    id="edit-priority"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-jobUrl" className="text-xs font-semibold text-slate-700">
                  Job Listing URL
                </Label>
                <Input
                  id="edit-jobUrl"
                  type="url"
                  placeholder="https://..."
                  value={formData.jobUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, jobUrl: e.target.value })
                  }
                  className="border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-tags" className="text-xs font-semibold text-slate-700">
                  Tags (comma-separated)
                </Label>
                <Input
                  id="edit-tags"
                  placeholder="React, Remote, High Priority"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-description" className="text-xs font-semibold text-slate-700">
                  Role Description
                </Label>
                <Textarea
                  id="edit-description"
                  rows={3}
                  placeholder="Brief summary of the role..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-notes" className="text-xs font-semibold text-slate-700">
                  Personal Notes
                </Label>
                <Textarea
                  id="edit-notes"
                  rows={3}
                  placeholder="Interview prep, recruiter info, referral details..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border-slate-200"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white shadow-glow-indigo rounded-xl">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

