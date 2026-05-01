# 🎓 Techify LMS - Enterprise Full Stack MERN Application

Developed with ❤️ by **[Muhammad Umar](https://www.linkedin.com/in/muhammadumarofficial/)**

Welcome to **Techify LMS**, a premium, production-ready Learning Management System engineered meticulously to exceed real-world industry standards. This platform is a complete Full Stack MERN application, demonstrating mastery of React.js, Node.js, Express, MongoDB, and modern software design patterns.

- **[Live Front-End](https://techify-frontend-swart.vercel.app)**
- **[Live Back-End](https://techify-backend.vercel.app/health)**
---

## 🌟 Executive Summary

Techify LMS delivers an immersive, frictionless learning experience. From dynamic video progress tracking to a robust role-based access control system, the platform is designed to handle content creators, students, and administrators with specialized, secure dashboards.

### 🚀 Key Technical Highlights
- **Modern React Architecture**: Built with React 19, leveraging the React Compiler for optimal rendering performance.
- **Enterprise-Grade Backend**: A highly performant RESTful API layer utilizing Node.js and Native ESM (ECMAScript Modules).
- **Vercel Serverless Ready**: Optimized for Vercel Serverless deployments with intelligent MongoDB connection pooling.
- **Cloud-Native Media**: Deep integration with **Cloudinary** for scalable cloud storage of thumbnails and high-definition video lessons.
- **Automated Seeding**: A smart algorithm that automatically provisions 17 mock users, 20 courses, and 200 lessons on the first boot.

---

## 🏗 Project Structure

The project is organized into two primary directories, ensuring a clean separation of concerns:

```text
├── lms-back-end/           # Node.js & Express Server
│   ├── src/
│   │   ├── config/         # DB & Environment Configuration
│   │   ├── controllers/    # API Request Handlers
│   │   ├── middleware/     # Auth, RBAC & Error Handling
│   │   ├── models/         # Mongoose Schemas (User, Course, etc.)
│   │   ├── routes/         # Express Route Definitions
│   │   ├── utils/          # Helpers (Cloudinary, Seeding)
│   │   └── index.ts        # Server Entry Point
│   ├── vercel.json         # Vercel Deployment Config
│   └── package.json
│
└── lms-front-end/          # React Client
    ├── src/
    │   ├── components/     # Reusable UI Components
    │   ├── context/        # Global State Management
    │   ├── pages/          # Dashboard & Public Pages
    │   ├── services/       # API Integration Layer
    │   └── App.tsx         # Routing & App Logic
    ├── tailwind.config.ts  # Styling Configuration
    └── package.json
```

---

## 💎 Core Features & Functionality

### 🎬 Advanced Video Player & Progress Tracking
- **Intelligent Tracking**: Granularly tracks student watch time.
- **Completion Logic**: Lessons only unlock the "Mark as Complete" function after 95% completion.

### 💳 Simulated Checkout & Validation
- **Frictionless Enrollment**: A beautiful checkout flow with real-time credit card formatting.
- **Strict Validation**: Powered by **Zod** to ensure robust data integrity.

### 🎨 Editorial UI & Interactive Cards
- **Luxury Aesthetic**: Bespoke CSS + Tailwind for a premium feel.
- **Framer Motion**: Smooth micro-animations on course cards and transitions.

---

## 🎯 Robust Role-Based Access Control (RBAC)

### 1️⃣ 🛡 Admin (Platform Overseer)
- View and manage all registered users.
- Global authority to manage all courses.
- Real-time analytics dashboard for platform statistics.

### 2️⃣ 👨‍🏫 Instructor (Content Creator)
- Comprehensive course creation and editing suite.
- Integrated Cloudinary media uploads for lessons.
- Full control over their own teaching content.

### 3️⃣ 🎓 Student (Learner)
- Secure registration and login.
- Interactive course catalog with category filtering.
- Personalized "My Learning" hub to track progress.

---

## 🚀 Free Deployment Guide

You can deploy this entire stack for **FREE** using Vercel and MongoDB Atlas.

### 1. Database (MongoDB Atlas)
1. Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster and a database named `techify`.
3. In "Network Access", allow access from "0.0.0.0/0" (for Vercel).
4. Get your **Connection String**.

### 2. Backend (Vercel)
1. Push your code to GitHub.
2. Connect your GitHub to [Vercel](https://vercel.com).
3. Select the **[lms-back-end](https://github.com/MUmarOfficial/techify-backend)** folder as the project root.
4. Add the following **Environment Variables**:
   - `MONGO_URI`: Your MongoDB Atlas string.
   - `JWT_SECRET`: A random secure string.
   - `CLIENT_URL`: Your future frontend URL (or `*`).
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
   - `VERCEL`: `1`.
5. Deploy!

### 3. Frontend (Vercel)

1. Create another project on Vercel for the **[lms-front-end](https://github.com/MUmarOfficial/techify-frontend)** folder.
2. Add the following **Environment Variable**:
   - `VITE_API_URL`: Your deployed Backend URL + `/api`.
3. Deploy!

---

## ⚙️ Local Setup & Usage

### 1. Backend
```bash
cd lms-back-end
npm install
# Create .env with MONGO_URI, JWT_SECRET, CLIENT_URL, etc.
npm run dev
```

### 2. Frontend
```bash
cd lms-front-end
npm install
# Create .env with VITE_API_URL
npm run dev
```

### Test Credentials (Pre-Seeded)
The system automatically seeds data on the first run:
- **Admin**: `admin@techify.com` / `Admin@123`
- **Instructor**: `instructor@techify.com` / `Password@123`
- **Student**: `student@techify.com` / `Password@123`

---
Developed by **[Muhammad Umar](https://www.linkedin.com/in/muhammadumarofficial/)** 🚀
