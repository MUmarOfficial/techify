# Techify - Premium Full-Stack Learning Management System

Techify is a luxury, editorial-inspired Learning Management System (LMS) designed for engineers, designers, and technology professionals. Built with the **MERN stack** (MongoDB, Express, React, Node.js) and **TypeScript**, it provides a seamless end-to-end experience for creating, managing, and consuming high-quality technical content.

---

## 🏗️ Architecture Overview

The project is organized as a decoupled monorepo containing two primary packages:

*   **`lms-back-end/`**: A robust Express.js REST API using Mongoose for MongoDB data modeling. It handles business logic, JWT-based authentication, Role-Based Access Control (RBAC), and heavy-duty data aggregation for analytics.
*   **`lms-front-end/`**: A high-performance React SPA powered by Vite and Tailwind CSS. It features a custom design system, complex state management via Context API, and interactive components like a progress-aware video player and client-side image cropper.

---

## ✨ Features by Role

### 🎓 Student Experience
*   **Course Discovery**: Browse curated technical courses with advanced category filtering and search.
*   **Smart Learning Interface**: A dedicated "Watch" environment with a sidebar for course curriculum and lesson status.
*   **Progress Tracking**: Automated video watch percentage tracking. Lessons are marked complete only after 95% watch time, and progress is persisted across sessions.
*   **Personal Dashboard**: View enrollment statistics (In-Progress vs. Completed) and quickly resume the last accessed lesson.

### 👨‍🏫 Instructor Studio
*   **Studio Dashboard**: Track total student reach and active course performance.
*   **Course Creator**: Multi-step flow for course metadata, pricing, and high-resolution thumbnails.
*   **Curriculum Builder**: Drag-and-drop-style lesson management. Supports local video uploads (processed as Base64) or external embeds (YouTube/Vimeo).
*   **Media Management**: Integrated image cropping utility to ensure all thumbnails meet platform aesthetic standards.

### 🛡️ Admin Control Panel
*   **Platform Analytics**: Real-time visualization of enrollment trends, user growth (monthly aggregates), and category distribution.
*   **Global Moderation**: Oversight of all users and courses. Admins can promote users to instructors, moderate content, and manage dynamic categories.
*   **System Integrity**: Secure deletion protocols for users and courses to maintain database hygiene.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, React Hook Form, Axios |
| **Backend** | Node.js, Express.js, TypeScript, MongoDB (Mongoose), JWT, Bcrypt.js, Morgan, Jet-Logger |
| **DevOps/Tools** | ESLint, Prettier, TS-Node, Nodemon, Vitest |

---

## 🚀 Getting Started

### 1. Prerequisites
*   **Node.js**: v18.0.0 or higher.
*   **MongoDB**: A local instance or a MongoDB Atlas connection string.

### 2. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd lms-back-end
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    Create a `.env` file based on the provided `.env.example`:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/techify
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRES_IN=7d
    CLIENT_URL=http://localhost:5173
    UPLOAD_PATH=uploads
    ```
4.  **Seed the Database** (Highly Recommended):
    Populate the system with 50+ students, 5 instructors, and 20 courses to see the analytics in action:
    ```bash
    npm run seed
    ```
    *(Default password for all seeded users: `password123`)*

5.  Start the server:
    ```bash
    npm run dev
    ```

### 3. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd lms-front-end
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure API connection:
    Create a `.env` file:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

---

## 🔗 Connecting Frontend & Backend

The connection is established via HTTP requests using **Axios**. To ensure smooth communication:

1.  **CORS Configuration**: The backend `index.ts` is configured to allow requests from the `CLIENT_URL` defined in the environment variables.
2.  **API URL**: The frontend uses `import.meta.env.VITE_API_URL` to point to the Express server.
3.  **Authentication**: Tokens received upon login/registration are stored in `localStorage` and automatically attached to the `Authorization: Bearer <token>` header of every request via an Axios interceptor (`src/services/api.ts`).
4.  **Static Files**: Images and videos uploaded to the backend are served from the `uploads/` directory, which the frontend resolves using a utility function to handle both local and external paths.

---

## 📂 Project Structure

```text
final-project/
├── lms-back-end/           # Node.js + Express API
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routes
│   │   ├── middleware/     # Auth & Role verification
│   │   └── seeder.ts       # Database population script
│   └── uploads/            # Local media storage
└── lms-front-end/          # React + Vite Client
    ├── src/
    │   ├── components/     # UI, Layout, Shared components
    │   ├── context/        # Auth & Global state
    │   ├── pages/          # Role-specific views
    │   ├── services/       # API integration layers
    │   └── hooks/          # Progress & Video logic
    └── public/             # Static assets
```

---

## 🛡️ Security Implementation
*   **Password Hashing**: Passwords are never stored in plain text; `bcryptjs` is used with 10 salt rounds.
*   **JWT Protection**: All sensitive routes require a valid token.
*   **RBAC Middleware**: Granular access control ensures Students cannot access Instructor Studio, and only Admins can manage global settings.
*   **Data Sanitization**: Backend prevents password leaking by stripping sensitive fields before returning user objects.

---

## 📝 License
This project was developed as a final capstone for the Hunarmand Punjab Program.
