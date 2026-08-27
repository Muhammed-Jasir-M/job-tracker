import Link from "next/link";
import { Briefcase, Github, Twitter, Linkedin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-slate-200/70 bg-white/75 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 transition-opacity hover:opacity-90"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-tr from-violet-600 via-violet-500 to-fuchsia-500 text-white shadow-glow-indigo group-hover:scale-105 transition-transform duration-200">
                <Briefcase className="h-4 w-4" />
              </div>
              <span className="bg-linear-to-r from-slate-900 to-violet-800 bg-clip-text text-transparent">
                Job Tracker
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              Organize your entire job search in one visual, real-time workspace.
              Track applications from wishlist to offer with effortless drag and drop.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-violet-700"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-violet-700"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-violet-700"
                >
                  Get started
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Connect
            </h3>
            <div className="mt-4 flex gap-2">
              <a
                href="#"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-violet-300 hover:text-violet-700 hover:shadow-card-hover"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-violet-300 hover:text-violet-700 hover:shadow-card-hover"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-violet-300 hover:text-violet-700 hover:shadow-card-hover"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/70 pt-6 sm:flex-row">
          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            © 2026 Job Tracker. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            Built with <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 animate-pulse" /> by{" "}
            <span className="font-bold text-violet-600">Muhammed Jasir</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
