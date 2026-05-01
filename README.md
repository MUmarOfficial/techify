# Techify LMS - Enterprise Learning Management System

Welcome to **Techify LMS**, a premium, full-stack Learning Management System engineered with modern architecture, beautiful editorial design, and a highly scalable backend. 

## ✨ The Best Features of the Project

1. **Editorial & Luxury Design System**: The frontend uses a highly customized, animation-rich, and deeply aesthetic design system (using Framer Motion, Tailwind CSS, and custom typography) that makes the learning experience feel like a high-end application.
2. **Three Dedicated Dashboards**: 
   - **Student Dashboard**: Track course progress, continue watching where you left off, and browse modern tech courses.
   - **Instructor Dashboard**: Create rich courses, manage lessons with YouTube integrations, and track your active students.
   - **Admin Dashboard**: Oversee the entire platform, manage all users, review platform revenue, and track site-wide analytics.
3. **Automated First-Deployment Seeding**: The system automatically detects if your database is empty. Upon your very first deployment, it natively generates 2 admins, 5 instructors, 10 students, 5 categories, 20 high-quality courses with Unsplash thumbnails, and 200 fully-configured lessons with YouTube integrations. 
4. **Intelligent Video Progress Tracking**: Built-in support for native HTML5 video and YouTube video progress tracking. It automatically saves exactly where a student stops watching and only unlocks the "Mark as Complete" button once the student actually watches 95% of the video.
5. **Secure & Scalable Backend**: Built with Express.js, TypeScript, Mongoose, and advanced JWT Authentication strategies (with HttpOnly cookies).

---

## 💻 How to Run on Local Machine

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or a MongoDB Atlas connection string.

### 1. Setup Backend
```bash
cd lms-back-end
npm install
```

Create a `.env` file in `lms-back-end/`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/techify-lms
JWT_SECRET=super_secret_key_123
CLIENT_URL=http://localhost:5173
```

Run the backend:
```bash
npm run dev
```

### 2. Setup Frontend
```bash
cd ../lms-front-end
npm install
```

Create a `.env` file in `lms-front-end/`:
```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:
```bash
npm run dev
```

### 3. Log In!
Since you started the backend with an empty database, it automatically seeded the system for you! You can log in immediately at `http://localhost:5173`:
- **Admin**: `admin@techify.com` / `Admin@123`
- **Instructor**: `instructor@techify.com` / `Password@123`
- **Student**: `student@techify.com` / `Password@123`

---

## 🚀 How to Setup Deployment (100% Free)

You can easily deploy this entire stack for free using **Render** (for the backend) and **Vercel** (for the frontend). 

### Step 1: Database Setup (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free shared cluster.
2. Under "Database Access", create a user and password.
3. Under "Network Access", allow IP access from anywhere (`0.0.0.0/0`).
4. Click "Connect" -> "Connect your application" and copy your connection string.

### Step 2: Backend Deployment (Render.com)
1. Push your entire repository to GitHub.
2. Go to [Render](https://render.com/), sign in, and click **New -> Web Service**.
3. Connect your GitHub repository.
4. Settings:
   - **Root Directory**: `lms-back-end`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
5. Add Environment Variables:
   - `MONGO_URI`: *<Paste your MongoDB Atlas connection string>*
   - `JWT_SECRET`: *<Create a secure random string>*
   - `CLIENT_URL`: *<We will update this after Vercel deployment, for now put `https://your-future-vercel-url.vercel.app`>*
6. Click **Deploy Web Service**. Render will build and deploy your API. Note the public URL Render gives you (e.g., `https://lms-backend-xyz.onrender.com`).

*Note: Because we added the auto-seeder, the very first time this spins up, it will connect to your empty MongoDB cluster and populate it with all 20 courses and users automatically!*

### Step 3: Frontend Deployment (Vercel.com)
1. Go to [Vercel](https://vercel.com/) and click **Add New -> Project**.
2. Connect your GitHub repository.
3. Settings:
   - **Root Directory**: `lms-front-end`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   - `VITE_API_URL`: *<Paste your Render Backend URL, e.g., `https://lms-backend-xyz.onrender.com/api`>*
5. Click **Deploy**. Vercel will build and host your frontend globally.

### Step 4: Finalize Connection
Go back to your Render Dashboard (Backend) and update your `CLIENT_URL` environment variable to match your new Vercel frontend URL exactly (e.g., `https://techify-lms.vercel.app`). Restart the Render service.

You are now live!
