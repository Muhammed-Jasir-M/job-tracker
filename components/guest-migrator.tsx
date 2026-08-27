"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth/auth-client";
import { migrateGuestJobs, GuestJobData } from "@/lib/actions/migrate-guest";
import { clearGuestBoardFromStorage } from "@/lib/guest-storage";

export default function GuestMigrator() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) return;

    const storedGuestData = localStorage.getItem("job_tracker_guest_jobs");
    if (!storedGuestData) return;

    try {
      const parsedJobs: GuestJobData[] = JSON.parse(storedGuestData);
      if (Array.isArray(parsedJobs) && parsedJobs.length > 0) {
        migrateGuestJobs(parsedJobs).then((res) => {
          if (res.success) {
            clearGuestBoardFromStorage();
          }
        });
      } else {
        clearGuestBoardFromStorage();
      }
    } catch (err) {
      console.error("Failed to parse guest data for migration", err);
      clearGuestBoardFromStorage();
    }
  }, [session]);

  return null;
}
