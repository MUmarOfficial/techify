# Techify - Premium Learning Management System

Techify is a luxury editorial design system-based Learning Management System (LMS) built with React, TypeScript, and Vite. It offers a comprehensive platform for engineers, designers, and technology professionals to teach and learn.

## 🌟 Key Features

### 🔐 Role-Based Architecture
The platform supports three distinct user roles, each with a dedicated dashboard and tailored experience:
- **Students**: Learn and track progress.
- **Instructors**: Create and manage courses.
- **Administrators**: Oversee the platform and analyze data.

### 🎓 Student Features
- **Course Discovery**: Browse a catalog of premium technical courses with category filters and search.
- **Enrollment & Learning**: Enroll in courses and access lesson content.
- **Video Player & Progress Tracking**: Custom video player that automatically tracks watch percentage and remembers the last accessed lesson.
- **Dashboard**: Personalized dashboard showing learning statistics, in-progress courses, and completed courses.

### 👨‍🏫 Instructor Features
- **Course Creation**: Create and publish courses with details, pricing, and category.
- **Lesson Management**: Upload and order lessons for each course. Supports video uploads (or external URLs), rich text content, and custom thumbnails.
- **Media Management**: Built-in image cropper for perfect course and lesson thumbnails.
- **Analytics**: Track total courses and enrolled students.

### 🛡️ Admin Features
- **User Management**: View all users, change user roles (promote to instructor/admin), or remove users.
- **Course Moderation**: Oversee all published courses across the platform and remove them if necessary.
- **Category Management**: Create and manage course categories to keep the platform organized.
- **Platform Analytics**: Comprehensive dashboard showing enrollment trends, category distribution, and total platform metrics.

### 👤 Profile & Security
- **Authentication**: Secure login and registration with JWT.
- **Profile Management**: Update personal details and upload/crop profile avatars.
- **Password Strength**: Real-time password strength meter and validation during registration and password changes.

### 🎨 UI/UX Design System
- **Luxury Aesthetic**: Custom design system featuring an 'Alabaster', 'Charcoal', and 'Gold' color palette.
- **Smooth Animations**: Page transitions, modal reveals, and interactions powered by `framer-motion`.
- **Responsive Layout**: Fully responsive design with a collapsible mobile sidebar for dashboards.
- **Custom Components**: Includes reusable, highly-styled UI components like Skeleton loaders, Toasts, Badges, and Data Tables.

## 🛠️ Tech Stack

- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom CSS variables
- **Routing**: React Router v6
- **State Management**: React Context API (Auth, Toast)
- **Form Handling**: React Hook Form
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 🚀 Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables. Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

