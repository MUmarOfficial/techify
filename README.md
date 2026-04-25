# Techify - Full-Stack Learning Management System

Techify is a premium, full-stack Learning Management System (LMS) built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. This repository contains both the backend API and the frontend client integrated into a single cohesive project structure.

## 🏗️ Architecture Overview

The application follows a monolithic repository structure where both backend and frontend source files coexist within the `src/` directory.

* **Frontend**: A React single-page application (SPA) powered by Vite, handling user interfaces, state management, and client-side routing.
* **Backend**: An Express.js REST API handling business logic, database operations with MongoDB, authentication, and file processing.

---

## ✨ Features

### Frontend (Client-Side)

* **Role-Based Dashboards**: Distinct UI layouts for Students, Instructors, and Admins.
* **Custom Video Player**: Advanced playback with progress tracking and auto-resume capabilities.
* **Rich UI Components**: Built with Tailwind CSS, featuring skeleton loaders, animated modals (Framer Motion), and toast notifications.
* **Media Processing**: Built-in image cropping utility for profile pictures and course thumbnails before uploading.

### Backend (Server-Side)

* **Secure Authentication**: JWT-based stateless authentication with hashed passwords (bcryptjs).
* **Role-Based Access Control (RBAC)**: Middleware to protect routes and ensure only authorized roles (e.g., `instructor`, `admin`) can access specific endpoints.
* **Media Handling**: Base64 file parsing with strict MIME-type validation and size limits.
* **Advanced Data Aggregation**: MongoDB aggregation pipelines to calculate platform statistics, enrollment tracking, and monthly revenue/student growth.

---

## 🛠️ Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router v6, React Hook Form, Axios.
**Backend:** Node.js, Express.js, TypeScript, MongoDB (Mongoose), JSON Web Tokens (JWT).

---

## 🔗 Connecting Frontend & Backend

Because both exist in the same environment during development, they need to communicate across different ports.

1. **Backend Port**: The Express server typically runs on `http://localhost:5000`.
2. **Frontend Port**: The Vite development server typically runs on `http://localhost:5173`.
3. **The Connection**: The frontend uses Axios to make HTTP requests to the backend. This connection is established via the `VITE_API_URL` environment variable. The backend uses the `cors` middleware to accept requests from the frontend's origin (`CLIENT_URL`).

---

## 🚀 Local Development Setup

Follow these steps to get both the frontend and backend running locally.

### 1. Prerequisites

* Node.js (v18+ recommended)
* MongoDB running locally or a MongoDB Atlas connection string.
