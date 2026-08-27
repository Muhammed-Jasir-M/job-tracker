"use client";

import { Briefcase, LayoutDashboard, ListChecks, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import SignOutButton from "./sign-out-btn";
import { useSession } from "@/lib/auth/auth-client";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/75 backdrop-blur-xl transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-violet-600 via-violet-500 to-fuchsia-500 text-white shadow-glow-indigo group-hover:scale-105 transition-transform duration-200">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="bg-linear-to-r from-slate-900 via-slate-800 to-violet-800 bg-clip-text text-transparent">
            Job Tracker
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium text-slate-600 hover:bg-violet-50 hover:text-violet-700 rounded-lg gap-2"
                >
                  <LayoutDashboard className="h-4 w-4 text-violet-600" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/applications">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium text-slate-600 hover:bg-violet-50 hover:text-violet-700 rounded-lg gap-2"
                >
                  <ListChecks className="h-4 w-4 text-violet-600" />
                  Manage
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ring-2 ring-violet-500/20 hover:ring-violet-500/40 transition-all p-0"
                  >
                    <Avatar className="h-9 w-9 border border-slate-200">
                      <AvatarFallback className="bg-linear-to-tr from-violet-600 to-fuchsia-600 text-white font-semibold text-xs">
                        {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-60 rounded-xl border border-slate-200 p-2 shadow-xl bg-white" align="end">
                  <DropdownMenuLabel className="font-normal p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none text-slate-900">
                        {session.user.name}
                      </p>
                      <p className="text-xs leading-none text-slate-500 truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <div className="my-1 border-t border-slate-100" />
                  <SignOutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg gap-1.5"
                >
                  <LogIn className="h-4 w-4" />
                  Log In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  size="sm"
                  className="bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-glow-indigo rounded-lg transition-all"
                >
                  Start for free
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

