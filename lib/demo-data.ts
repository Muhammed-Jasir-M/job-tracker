import { Board, Column, JobApplication } from "./models/models.types";

const job = (
  _id: string,
  company: string,
  position: string,
  order: number,
  extra: Partial<JobApplication> = {}
): JobApplication => ({
  _id,
  company,
  position,
  order,
  status: "wishlist",
  priority: "Medium",
  ...extra,
});

const wishlist: Column = {
  _id: "demo-wishlist",
  name: "Wish List",
  order: 0,
  jobApplications: [
    job("demo-wish-1", "CRED", "Senior Frontend Developer", 0, {
      location: "Bengaluru, Karnataka (Hybrid)",
      priority: "High",
      salary: "₹28 LPA - ₹38 LPA",
      tags: ["React", "TypeScript", "Next.js", "FinTech"],
      description:
        "Build ultra-polished, high-performance web interfaces for CRED's premium member experiences.",
      jobUrl: "https://cred.club/careers",
    }),
  ],
};

const applied: Column = {
  _id: "demo-applied",
  name: "Applied",
  order: 1,
  jobApplications: [
    job("demo-app-1", "Razorpay", "Full Stack Engineer (Node + React)", 0, {
      location: "Bengaluru, Karnataka",
      priority: "High",
      salary: "₹24 LPA - ₹32 LPA",
      tags: ["React", "Node.js", "MongoDB", "Payments"],
      description:
        "Architect secure payment gateway dashboards, checkout forms, and merchant integration SDKs.",
      jobUrl: "https://razorpay.com/jobs",
    }),
  ],
};

const interviewing: Column = {
  _id: "demo-interviewing",
  name: "Interviewing",
  order: 2,
  jobApplications: [],
};

const offer: Column = {
  _id: "demo-offer",
  name: "Offer",
  order: 3,
  jobApplications: [],
};

const rejected: Column = {
  _id: "demo-rejected",
  name: "Rejected",
  order: 4,
  jobApplications: [],
};

export const demoBoard: Board = {
  _id: "demo-board",
  name: "Job Hunt",
  columns: [wishlist, applied, interviewing, offer, rejected],
};
