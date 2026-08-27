"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import React, { useState } from "react";
import { createJobApplication } from "@/lib/actions/job-applications";
import { getGuestBoardFromStorage, saveGuestBoardToStorage } from "@/lib/guest-storage";

interface CreateJobApplicationDialogProps {
  columnId: string;
  boardId: string;
}

const INITIAL_FORM_DATA = {
  company: "",
  position: "",
  location: "",
  priority: "Medium",
  notes: "",
  salary: "",
  jobUrl: "",
  tags: "",
  description: "",
};

export default function CreateJobApplicationDialog({
  columnId,
  boardId,
}: CreateJobApplicationDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsedTags = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (boardId === "demo-board") {
      const currentGuestBoard = getGuestBoardFromStorage();
      const newJobId = `guest-job-${Date.now()}`;
      const newJob = {
        _id: newJobId,
        company: formData.company,
        position: formData.position,
        location: formData.location,
        priority: formData.priority,
        notes: formData.notes,
        salary: formData.salary,
        jobUrl: formData.jobUrl,
        columnId,
        boardId,
        tags: parsedTags,
        description: formData.description,
        status: "applied",
        order: Date.now(),
      };

      const updatedColumns = (currentGuestBoard.columns || []).map((col) => {
        if (col._id === columnId) {
          return {
            ...col,
            jobApplications: [...(col.jobApplications || []), newJob],
          };
        }
        return col;
      });

      saveGuestBoardToStorage({ ...currentGuestBoard, columns: updatedColumns });
      setFormData(INITIAL_FORM_DATA);
      setOpen(false);
      window.location.reload();
      return;
    }

    try {
      const result = await createJobApplication({
        ...formData,
        columnId,
        boardId,
        tags: parsedTags,
      });

      if (!result.error) {
        setFormData(INITIAL_FORM_DATA);
        setOpen(false);
      } else {
        console.error("Failed to create job: ", result.error);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-center text-slate-500 hover:text-violet-700 border-dashed border-2 border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 rounded-xl py-5 transition-all font-semibold text-xs gap-1.5 shadow-none"
        >
          <Plus className="h-4 w-4" />
          Add Job
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Add New Application
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Track a new opportunity by filling in the details below.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4 pt-2" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="company" className="text-xs font-semibold text-slate-700">
                  Company *
                </Label>
                <Input
                  id="company"
                  required
                  placeholder="e.g. Google, Stripe"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="border-slate-200 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="position" className="text-xs font-semibold text-slate-700">
                  Position Title *
                </Label>
                <Input
                  id="position"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
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
                <Label htmlFor="location" className="text-xs font-semibold text-slate-700">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. Remote"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="salary" className="text-xs font-semibold text-slate-700">
                  Salary Range
                </Label>
                <Input
                  id="salary"
                  placeholder="e.g. $130k"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                  className="border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="priority" className="text-xs font-semibold text-slate-700">
                  Priority
                </Label>
                <select
                  id="priority"
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
              <Label htmlFor="jobUrl" className="text-xs font-semibold text-slate-700">
                Job Posting URL
              </Label>
              <Input
                id="jobUrl"
                type="url"
                placeholder="https://careers.company.com/job/123"
                value={formData.jobUrl}
                onChange={(e) =>
                  setFormData({ ...formData, jobUrl: e.target.value })
                }
                className="border-slate-200 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tags" className="text-xs font-semibold text-slate-700">
                Tags (comma-separated)
              </Label>
              <Input
                id="tags"
                placeholder="React, TypeScript, High Pay"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="border-slate-200 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-slate-700">
                Role Description
              </Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Brief summary of requirements or team info..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="border-slate-200 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs font-semibold text-slate-700">
                Personal Notes
              </Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Recruiter contact name, referral info, interview notes..."
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
              onClick={() => setOpen(false)}
              className="rounded-xl border-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white shadow-glow-indigo rounded-xl"
            >
              Add Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
