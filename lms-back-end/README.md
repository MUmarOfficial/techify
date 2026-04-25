# Techify - Premium Learning Management System

Techify is a luxury, full-stack Learning Management System (LMS) designed with an editorial aesthetic. Built with React (Vite), Express.js, TypeScript, and MongoDB, it offers a comprehensive platform for engineers, designers, and technology professionals to teach and learn.

## 🌟 Key Features

### 🔐 Role-Based Architecture
The platform is built with strict Role-Based Access Control (RBAC), offering dedicated dashboards and tailored experiences for three user types:
- **Students**: Learn, track progress, and consume content.
- **Instructors**: Create courses, manage curriculums, and track student enrollment.
- **Administrators**: Oversee the platform, manage users, categories, and analyze global platform data.

### 🎓 Student Experience
- **Course Discovery**: Browse a catalog of technical courses with category filters and search functionalities.
- **Advanced Video Player**: Custom video player supporting local uploads and YouTube embeds. 
- **Granular Progress Tracking**: Automatically tracks video watch percentage. Lessons unlock "Complete" status only after reaching 95% watch time.
- **Personalized Dashboard**: View learning statistics, resume in-progress courses, and access completed materials.

### 👨‍🏫 Instructor Studio
- **Course Management**: Create, edit, publish, and delete courses with rich details and pricing.
- **Curriculum Builder**: Upload and reorder lessons for each course. 
- **Media Management**: Built-in image cropper for perfect course and lesson thumbnails. Supports direct video uploads or external video URLs.
- **Analytics**: Track total created courses and active student enrollments.

### 🛡️ Admin Control Panel
- **User Management**: View all platform users, change user roles (promote to instructor/admin), and delete accounts.
- **Platform Analytics**: Comprehensive dashboard showing enrollment trends (monthly aggregates), category distribution, and total platform metrics.
- **Global Course Moderation**: Oversee all published courses across the platform with the ability to search and remove them.
- **Category Management**: Dynamically create and manage course categories to keep the platform organized.

### 👤 Profile & Security
- **Authentication**: Secure login and registration powered by JWT and bcryptjs password hashing.
- **Profile Management**: Update personal details and upload/crop profile avatars.
- **Password Security**: Real-time password strength meter and strict validation (requiring letters, numbers, and symbols) during registration and password changes.

## 🛠️ Tech Stack


### Backend
- **Server**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **File Uploads**: Base64 file processing with strict MIME type and size validation
- **Logging**: Jet-Logger

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

1. **Environment Setup:**
   Create a `.env` file in the root directory based on the configuration expected in `src/config/env.ts`:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/techify
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=7d
   BCRYPT_ROUNDS=10
   VITE_API_URL=http://localhost:5000/api
   CLIENT_URL=http://localhost:5173
   UPLOAD_PATH=uploads
   MAX_JSON_PAYLOAD=600mb
   ```

2. **Database Seeding (Optional but recommended):**
   Populate the database with realistic test data (Admins, Instructors, Students, and Courses):

   ```bash
   # Make sure your TypeScript runner is configured, e.g., via ts-node or similar script
   npm run seed 
   ```

   *Note: Seeder creates users with the universal password `password123`.*

3. **Start the Development Servers:**
   Run the backend Express server and the Vite frontend:

   ```bash
   npm run dev
   ```

## 📂 Project Structure Overview

This repository uses a monolithic structure where both backend and frontend code coexist:

- `src/components/`, `src/pages/`, `src/hooks/`, `src/context/` - React Frontend
- `src/controllers/`, `src/models/`, `src/routes/`, `src/middleware/` - Express Backend API
- `src/index.ts` - Backend entry point
- `src/main.tsx`, `src/App.tsx` - Frontend entry point

```
