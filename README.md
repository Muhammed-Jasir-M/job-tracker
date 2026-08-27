# Job Tracker

A modern, lightweight application tracker built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS 4**, and **MongoDB**. Organize your entire job search in one visual, real-time workspace with a Kanban drag-and-drop board, a full management view, and guest mode.

---

## ✨ Features

- 📋 **Kanban Board**: Drag-and-drop applications across pipeline stages with optimistic reordering (`dnd-kit`).
- 🔀 **Column Management**: Add, rename, delete, and move columns left/right directly on the board.
- 📊 **Overview Stats**: 6 live summary stat badges (Total Tracked, Wishlist, Applied, Interviewing, Offers, Rejected).
- 🔍 **Search & Filtering**: Search by company, position, tags, or location. Filter by stage, priority, or custom sort order.
- ⚡ **Guest Mode**: Test the app immediately as a guest. All guest edits are stored in `localStorage` and automatically migrate to your MongoDB account when you sign up!
- 🔐 **Authentication**: Sign up and sign in powered by **Better Auth** with MongoDB adapter.
- 🎨 **Modern Light UI**: Built with Tailwind CSS 4, soft glassmorphism, glowing badges, and responsive navigation.

---

## 🧰 Tech Stack

| Layer | Tech |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Server Actions) |
| **UI & Styling** | React 19, Tailwind CSS 4, Lucide Icons |
| **Database** | MongoDB + Mongoose |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |
| **Auth** | Better Auth |

---

## 🚀 Getting Started

### 1. Clone the repository & Install dependencies

```bash
git clone https://github.com/Muhammed-Jasir-M/Job-Tracker.git
cd Job-Tracker
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/job-tracker
BETTER_AUTH_SECRET=your_auth_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
```

### 3. Run the Development Server

Make sure your MongoDB server is running, then start the Next.js dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ❤️ Author

Built with ❤️ by **[Muhammed Jasir](https://github.com/Muhammed-Jasir-M)**