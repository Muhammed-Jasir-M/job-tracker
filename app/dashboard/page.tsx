import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";
import Link from "next/link";
import KanbanBoard from "@/components/kanban-board";
import { Button } from "@/components/ui/button";
import { ListChecks } from "lucide-react";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

async function getBoard(userId: string) {
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

  const board = JSON.parse(JSON.stringify(boardDoc));

  return board;
}

async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const board = await getBoard(session.user.id);

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                Job Hunt
              </p>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Job Hunt Board
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1.5">
              Manage your application pipeline and stay organized throughout your search.
            </p>
          </div>
          <Link href="/dashboard/applications">
            <Button
              variant="outline"
              className="rounded-xl border-slate-200 text-slate-600 hover:text-violet-700 hover:border-violet-300 gap-2"
            >
              <ListChecks className="h-4 w-4" />
              Manage All Applications
            </Button>
          </Link>
        </div>
        <KanbanBoard board={board} userId={session.user.id} />
      </div>
    </div>
  );
}

export default async function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center gap-3 text-violet-600 font-medium">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading your job board...</span>
        </div>
      }
    >
      <DashboardPage />
    </Suspense>
  );
}

