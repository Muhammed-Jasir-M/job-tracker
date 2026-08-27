import connectDB from "../lib/db";
import "@/lib/models";
import { Board, Column, JobApplication } from "@/lib/models";

const DEFAULT_USER_ID = "6a90263336b0bf75603d70d0";

const SAMPLE_JOBS = [
  // Wish List
  {
    company: "CRED",
    position: "Senior Frontend Developer",
    location: "Bengaluru, Karnataka (Hybrid)",
    priority: "High",
    tags: ["React", "TypeScript", "Next.js", "FinTech"],
    description: "Build ultra-polished, high-performance web interfaces for CRED's premium member experiences.",
    jobUrl: "https://cred.club/careers",
    salary: "₹28 LPA - ₹38 LPA",
  },
  {
    company: "Razorpay",
    position: "Full Stack Engineer (Node + React)",
    location: "Bengaluru, Karnataka",
    priority: "High",
    tags: ["React", "Node.js", "MongoDB", "Payments"],
    description: "Architect secure payment gateway dashboards, checkout forms, and merchant integration SDKs.",
    jobUrl: "https://razorpay.com/jobs",
    salary: "₹24 LPA - ₹32 LPA",
  },
  {
    company: "Zoho",
    position: "UI Engineer - Design Systems",
    location: "Chennai, Tamil Nadu",
    priority: "Medium",
    tags: ["JavaScript", "CSS3", "Design Systems", "SaaS"],
    description: "Design and maintain reusable UI component libraries for Zoho's cloud suite applications.",
    jobUrl: "https://zoho.com/careers",
    salary: "₹16 LPA - ₹22 LPA",
  },

  // Applied
  {
    company: "Flipkart",
    position: "SDE 2 - Web Platform",
    location: "Bengaluru, Karnataka",
    priority: "High",
    tags: ["React", "Redux", "Performance", "E-Commerce"],
    description: "Optimize web client performance, initial load times, and checkout funnels for Big Billion Days.",
    jobUrl: "https://flipkartcareers.com",
    salary: "₹30 LPA - ₹42 LPA",
  },
  {
    company: "Swiggy",
    position: "Senior Frontend Engineer",
    location: "Remote (India)",
    priority: "High",
    tags: ["React", "TypeScript", "Micro-frontends", "Next.js"],
    description: "Engineered web order tracking and restaurant partner management portals.",
    jobUrl: "https://careers.swiggy.com",
    salary: "₹26 LPA - ₹36 LPA",
  },
  {
    company: "Freshworks",
    position: "Frontend Engineer 2",
    location: "Chennai, Tamil Nadu",
    priority: "Medium",
    tags: ["React", "TypeScript", "SaaS", "Tailwind"],
    description: "Develop CRM analytics dashboards and customer service ticket workspaces.",
    jobUrl: "https://freshworks.com/careers",
    salary: "₹20 LPA - ₹28 LPA",
  },
  {
    company: "PhonePe",
    position: "Software Engineer - Web",
    location: "Bengaluru, Karnataka",
    priority: "Low",
    tags: ["React", "TypeScript", "FinTech", "Webpack"],
    description: "Build merchant onboarding tools and financial service dashboards.",
    jobUrl: "https://phonepe.com/careers",
    salary: "₹22 LPA - ₹30 LPA",
  },

  // Interviewing
  {
    company: "Microsoft India",
    position: "Software Engineer II (Web)",
    location: "Hyderabad, Telangana",
    priority: "High",
    tags: ["React", "TypeScript", "Azure", "GraphQL"],
    description: "Develop collaborative web tools and cloud portal interfaces for Microsoft Azure.",
    jobUrl: "https://careers.microsoft.com",
    salary: "₹35 LPA - ₹48 LPA",
  },
  {
    company: "Atlassian India",
    position: "Frontend Engineer",
    location: "Bengaluru, Karnataka (Hybrid)",
    priority: "High",
    tags: ["React", "GraphQL", "Design System", "Jira"],
    description: "Build issue tracking and project collaboration interfaces for Jira Cloud.",
    jobUrl: "https://atlassian.com/careers",
    salary: "₹32 LPA - ₹45 LPA",
  },
  {
    company: "Zomato",
    position: "Senior Web Developer",
    location: "Gurugram, Haryana",
    priority: "Medium",
    tags: ["React", "Next.js", "Tailwind CSS", "SEO"],
    description: "Build fast SSR web pages for restaurant discovery and online food ordering.",
    jobUrl: "https://zomato.com/careers",
    salary: "₹25 LPA - ₹34 LPA",
  },

  // Offer
  {
    company: "Google India",
    position: "Software Engineer III (Frontend)",
    location: "Bengaluru, Karnataka",
    priority: "High",
    tags: ["Angular", "TypeScript", "Distributed Systems"],
    description: "Lead web architecture for Google Pay and Next Billion Users web ecosystem.",
    jobUrl: "https://careers.google.com",
    salary: "₹45 LPA - ₹60 LPA",
  },
  {
    company: "InMobi",
    position: "Senior Frontend Architect",
    location: "Bengaluru, Karnataka",
    priority: "High",
    tags: ["React", "Node.js", "AdTech", "Webpack"],
    description: "Architect high-throughput advertising analytics dashboards and creative studio tools.",
    jobUrl: "https://inmobi.com/careers",
    salary: "₹32 LPA - ₹42 LPA",
  },

  // Rejected
  {
    company: "TCS Digital",
    position: "System Engineer - Full Stack",
    location: "Kochi, Kerala",
    priority: "Low",
    tags: ["Java", "Spring Boot", "React", "SQL"],
    description: "Developed enterprise banking portals and RESTful backend microservices.",
    jobUrl: "https://tcs.com/careers",
    salary: "₹7 LPA - ₹10 LPA",
  },
  {
    company: "Infosys",
    position: "Senior Specialist Programmer",
    location: "Pune, Maharashtra",
    priority: "Medium",
    tags: ["Angular", "Node.js", "AWS", "Docker"],
    description: "Maintained cloud enterprise applications for international financial clients.",
    jobUrl: "https://infosys.com/careers",
    salary: "₹12 LPA - ₹16 LPA",
  },
];

async function seed() {
  try {
    console.log("🌱 Starting seed process...");
    await connectDB();
    console.log("✅ Connected to database");

    // Find all boards in the database
    let boards = await Board.find({});

    if (boards.length === 0) {
      console.log("⚠️ No boards found in database. Initializing default board...");
      const { initializeUserBoard } = await import("../lib/init-user-board");
      const newBoard = await initializeUserBoard(DEFAULT_USER_ID);
      boards = [newBoard];
    }

    console.log(`📋 Seeding data across ${boards.length} board(s)...`);

    for (const board of boards) {
      const userId = board.userId;
      console.log(`\n📌 Seeding Board "${board.name}" for User ID: ${userId}`);

      // Get columns for this board
      const columns = await Column.find({ boardId: board._id }).sort({ order: 1 });
      if (columns.length === 0) {
        console.warn(`⚠️ No columns found for board ${board._id}, skipping...`);
        continue;
      }

      // Clear existing job applications for this user/board
      await JobApplication.deleteMany({ boardId: board._id });
      for (const column of columns) {
        column.jobApplications = [];
        await column.save();
      }

      // Map column names
      const columnMap: Record<string, string> = {};
      columns.forEach((col) => {
        columnMap[col.name] = col._id.toString();
      });

      const jobsByColumn: Record<string, typeof SAMPLE_JOBS> = {
        "Wish List": SAMPLE_JOBS.slice(0, 3),
        Applied: SAMPLE_JOBS.slice(3, 7),
        Interviewing: SAMPLE_JOBS.slice(7, 10),
        Offer: SAMPLE_JOBS.slice(10, 12),
        Rejected: SAMPLE_JOBS.slice(12, 14),
      };

      let countCreated = 0;

      for (const [columnName, jobs] of Object.entries(jobsByColumn)) {
        const columnId = columnMap[columnName];
        if (!columnId) continue;

        const column = columns.find((c) => c._id.toString() === columnId);
        if (!column) continue;

        for (let i = 0; i < jobs.length; i++) {
          const jobData = jobs[i];
          const jobApp = await JobApplication.create({
            company: jobData.company,
            position: jobData.position,
            location: jobData.location,
            priority: jobData.priority,
            tags: jobData.tags,
            description: jobData.description,
            jobUrl: jobData.jobUrl,
            salary: jobData.salary,
            columnId: column._id,
            boardId: board._id,
            userId: userId,
            status: columnName.toLowerCase().replace(" ", "-"),
            order: i,
          });

          column.jobApplications.push(jobApp._id);
          countCreated++;
        }

        await column.save();
        console.log(`  ✅ Added ${jobs.length} jobs to "${columnName}" column`);
      }

      console.log(`🎉 Board "${board.name}" seeded with ${countCreated} jobs!`);
    }

    console.log("\n🚀 All database boards seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();

