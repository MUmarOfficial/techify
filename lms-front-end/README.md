# Techify LMS - Frontend Client

This is the frontend client for the Techify LMS platform, built with React 19, TypeScript, Vite, Tailwind CSS, and Framer Motion. It provides three dedicated, highly aesthetic dashboards for Students, Instructors, and Admins.

## Features

- **Modern Architecture**: Uses React Router v7, React Hook Form, and Framer Motion for a seamless, SPA experience.
- **Video & Progress Tracking**: Integrated `react-player` and intelligent hooks to track YouTube/MP4 watch percentages and natively prevent users from skipping ahead before marking a lesson as complete.
- **Responsive Layout**: Completely mobile-first and fully responsive across all devices using Tailwind CSS.
- **Editorial UI**: Features a sleek, modern aesthetic heavily utilizing glassmorphism, precise typography, and carefully chosen color palettes.

## Local Setup

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in this directory:

```env
# Point this to your backend server
VITE_API_URL=http://localhost:5000/api
```

### Development Server

Run the local development server:

```bash
npm run dev
```

### Build for Production

To create a highly optimized production build:

```bash
npm run build
```

The output will be placed in the `dist` directory.

## Deployment Notes
- When deploying to **Vercel** or **Netlify**, ensure that your build command is set to `npm run build` and output directory is `dist`.
- Always set `VITE_API_URL` to your production backend URL *before* building.
