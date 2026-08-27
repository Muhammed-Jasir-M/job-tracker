import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";
import { demoBoard } from "@/lib/demo-data";
import ApplicationsManager from "@/components/applications-manager";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

async function getBoardData(userId: string) {
  "use cache";

  await connectDB();

  const boardDoc = await Board.findOne({
    userId: userId,
    name: "Job Hunt",
  }).populate({
    path: "columns",
    populate: {
      path: "jobApplications",
    },
  });

  if (!boardDoc) return null;

  return JSON.parse(JSON.stringify(boardDoc));
}

async function ApplicationsPage() {
  const session = await getSession();

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background pb-16">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <ApplicationsManager board={demoBoard} />
        </div>
      </div>
    );
  }

  const board = await getBoardData(session.user.id);

  if (!board) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <ApplicationsManager board={board} />
      </div>
    </div>
  );
}

export default async function ApplicationsPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center gap-3 text-violet-600 font-medium">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading applications...</span>
        </div>
      }
    >
      <ApplicationsPage />
    </Suspense>
  );
}
