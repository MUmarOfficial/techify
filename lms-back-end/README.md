# Techify API - Technical LMS Backend

This is the robust REST API powering the Techify Learning Management System. Built with **Node.js**, **Express**, and **TypeScript**, it manages the complex business logic, security protocols, and data aggregations required for a premium learning experience.

---

## 🛠️ Tech Stack
*   **Runtime**: Node.js (v18+)
*   **Framework**: Express.js (v5)
*   **Database**: MongoDB with Mongoose ODM
*   **Security**: JSON Web Tokens (JWT), Bcrypt.js, Helmet
*   **Development**: TypeScript, TS-Node, Nodemon, Vitest
*   **Logging**: Jet-Logger & Morgan

---

## 🏗️ Core Modules & Logic

### 🔐 Authentication & RBAC
*   **Stateless Auth**: Uses JWT stored in HTTP-only cookies or Bearer headers.
*   **Granular RBAC**: Custom middleware (`authorize`) prevents horizontal and vertical privilege escalation.
*   **Password Security**: Regex-enforced strength validation and salt-hashed storage.

### 📊 Advanced Data Aggregation
*   **Admin Stats**: Utilizes MongoDB aggregation pipelines to calculate monthly enrollment trends and category distribution percentages.
*   **Instructor Analytics**: Real-time calculation of total students reached across multiple courses.

### 📁 Media Processing
*   **Base64 Pipeline**: A custom utility converts incoming Base64 data (from the frontend cropper) into physical files stored in the `uploads/` directory to prevent database bloat.
*   **Size Guard**: Strict MIME-type validation and size limits (1MB for avatars, 50MB for thumbnails, 500MB for videos).

### 📈 Learning Progress Engine
*   **Granular Tracking**: Tracks `completedLessons` via ObjectIDs and `videoWatchProgress` as an array of lesson-specific percentages.
*   **Auto-Resume**: Remembers the `lastAccessedLesson` per enrollment for a seamless student experience.

---

## 🚀 Local Development

### 1. Environment Setup
Create a `.env` file in the root:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/techify
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
UPLOAD_PATH=uploads
```

### 2. Installation & Running
```bash
npm install
npm run seed  # Essential: Creates test data (admin1@lms.com / password123)
npm run dev   # Starts server on http://localhost:5000
```

---

## 🔗 Connection to Frontend
This API is configured to allow requests only from the `CLIENT_URL` defined in `.env`. Ensure the frontend `VITE_API_URL` points exactly to `http://localhost:5000/api`.
