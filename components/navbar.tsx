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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-xl transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-6 gap-2">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 transition-opacity hover:opacity-90 shrink-0"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-violet-600 via-violet-500 to-fuchsia-500 text-white shadow-glow-indigo group-hover:scale-105 transition-transform duration-200">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="whitespace-nowrap bg-linear-to-r from-slate-900 via-slate-800 to-violet-800 bg-clip-text text-transparent text-sm sm:text-lg font-extrabold tracking-tight">
            Job Tracker
          </span>
        </Link>

        {/* Right Navigation & Profile */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          {session?.user ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-semibold text-xs sm:text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700 rounded-xl gap-1.5 px-2.5 sm:px-3 h-9"
                  title="Dashboard"
                >
                  <LayoutDashboard className="h-4 w-4 text-violet-600 shrink-0" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
              <Link href="/dashboard/applications">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-semibold text-xs sm:text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700 rounded-xl gap-1.5 px-2.5 sm:px-3 h-9"
                  title="Manage Applications"
                >
                  <ListChecks className="h-4 w-4 text-violet-600 shrink-0" />
                  <span className="hidden sm:inline">Manage</span>
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ring-2 ring-violet-500/20 hover:ring-violet-500/40 transition-all p-0 ml-1"
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
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-semibold text-xs sm:text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700 rounded-xl gap-1.5 h-9 px-2.5 sm:px-3"
                  title="Dashboard"
                >
                  <LayoutDashboard className="h-4 w-4 text-violet-600 shrink-0" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  size="sm"
                  className="bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-glow-indigo rounded-xl text-xs sm:text-sm h-9 px-2.5 sm:px-3.5 transition-all gap-1.5"
                  title="Sign In"
                >
                  <LogIn className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">Sign in</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

