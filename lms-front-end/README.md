# Techify Client - Luxury Learning Experience

Techify is a luxury, editorial-inspired frontend for a technical LMS. It is built with **React 19**, **Vite**, and **Tailwind CSS**, prioritizing a high-end aesthetic with smooth user interactions.

---

## ✨ Key Features

### 🎨 Luxury Editorial Design
*   **Palette**: 'Alabaster' background, 'Charcoal' text, and 'Gold' accents.
*   **Interactions**: Page transitions and modal reveals powered by **Framer Motion**.
*   **Typography**: Mix of *Playfair Display* (Headings) and *Inter* (Body) for a high-end magazine feel.

### 📺 Smart Learning Interface
*   **Video Engine**: Custom player that communicates with the backend every 10% of progress.
*   **Lesson Sidebar**: Dynamic curriculum list that updates "Watched" status and completion badges in real-time.

### ✂️ Media Workflow
*   **Client-Side Cropping**: Integrated **Canvas-based image cropper** allows users to perfectly frame profile pictures and course thumbnails before they are converted to Base64 and sent to the server.

---

## 🛠️ Tech Stack
*   **Framework**: React 19 (Vite)
*   **Styling**: Tailwind CSS 4.0
*   **Icons**: Lucide React
*   **State**: Context API (Auth, Toast)
*   **Forms**: React Hook Form
*   **Networking**: Axios with request/response interceptors

---

## 🚀 Local Development

### 1. Environment Setup
Create a `.env` file in the root:
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Installation & Running
```bash
npm install
npm run dev   # Starts Vite server on http://localhost:5173
```

---

## 🔗 Connecting to Backend

The client uses an **Axios Interceptor** (`src/services/api.ts`) to handle connectivity:
1.  **Auth Injection**: It automatically grabs the `lms_token` from `localStorage` and injects it into the `Authorization` header.
2.  **401 Handling**: If a token expires, the interceptor clears local storage and redirects the user to `/login`.
3.  **Media Resolution**: A utility `getMediaUrl` handles the mapping of relative server paths (e.g., `/uploads/...`) to absolute URLs using the API base.

---

## 📂 Architecture
*   **`/components/ui`**: Atomic, reusable luxury components (Buttons, Inputs, Modals).
*   **`/context`**: Global providers for Authentication and the Toast notification system.
*   **`/hooks`**: Specialized logic for video progress tracking and enrollment status.
*   **`/pages`**: Role-based routing for Students, Instructors, and Admins.
