import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, CheckCircle2, Sparkles, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/2 h-96 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-tr from-violet-200/50 via-fuchsia-100/40 to-sky-100/50 blur-3xl" />
            <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-sky-100/40 blur-3xl" />
            <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-fuchsia-100/40 blur-3xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-4xl text-center">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold text-violet-700 shadow-sm backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                <span>Streamline your career growth</span>
              </div>

              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                A better way to track your{" "}
                <span className="bg-linear-to-r from-violet-600 via-fuchsia-600 to-violet-500 bg-clip-text text-transparent">
                  job applications
                </span>
              </h1>

              <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 sm:text-xl">
                Capture, organize, and manage your entire job search journey in one visual, real-time workspace.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/sign-up">
                  <Button size="lg" className="h-13 px-8 text-base font-semibold bg-violet-600 hover:bg-violet-700 text-white shadow-glow-indigo rounded-xl transition-all duration-200 gap-2">
                    Start for free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button variant="outline" size="lg" className="h-13 px-8 text-base font-semibold border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all">
                    Sign in to your account
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center gap-6 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Free forever
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-500" /> No credit card required
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-24 border-t border-slate-200/60">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Everything you need to land your next role
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Stop managing job applications in chaotic spreadsheets. Use a modern visual workflow designed for job seekers.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="group rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover hover:border-violet-200">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">
                  Organize Applications
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Create custom status columns and drag-and-drop cards to keep every opportunity neatly categorized.
                </p>
              </div>

              <div className="group rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover hover:border-fuchsia-200">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-fuchsia-50 text-fuchsia-600 group-hover:bg-fuchsia-600 group-hover:text-white transition-colors duration-200">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">
                  Track Progress
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Monitor your funnel from Wishlist to Applied, Interviewing, and Offers with instant visual clarity.
                </p>
              </div>

              <div className="group rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover hover:border-emerald-200">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">
                  Stay Ahead
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Store notes, interview dates, target salaries, and direct links to job postings in one centralized spot.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: How It Works Workflow */}
        <section className="bg-slate-50/70 py-24 border-t border-slate-200/60">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-200">
                Simple Workflow
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                3 simple steps to job search success
              </h2>
              <p className="mt-4 text-slate-600 text-base">
                Get up and running in minutes. No complex setups or manual tracking required.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="relative flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-200/80 shadow-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white font-bold text-sm mb-4 shadow-md shadow-violet-500/25">
                  1
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Save & Organize</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Add target job postings, company details, salaries, priority levels, and referral notes in seconds.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-200/80 shadow-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-600 text-white font-bold text-sm mb-4 shadow-md shadow-fuchsia-500/25">
                  2
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Drag & Manage</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Move cards across status columns as you move from Wishlist to Applied, Interviewing, and Offers.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-200/80 shadow-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm mb-4 shadow-md shadow-emerald-500/25">
                  3
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Land Your Offer</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Keep clear visibility over interview schedules, salary offers, and follow-ups to sign your best role.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

