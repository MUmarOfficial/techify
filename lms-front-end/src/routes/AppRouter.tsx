import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import DashboardLayout from '../components/layout/DashboardLayout';

// Public pages
import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import CoursesPage from '../pages/public/CoursesPage';
import CourseDetailPage from '../pages/public/CourseDetailPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';

// Student
import StudentDashboard from '../pages/student/StudentDashboard';
import MyCoursesPage from '../pages/student/MyCoursesPage';
import WatchCoursePage from '../pages/student/WatchCoursePage';
import ProfilePage from '../pages/student/ProfilePage';
import CheckoutPage from '../pages/student/CheckoutPage';
import PaymentSuccessPage from '../pages/student/PaymentSuccessPage';

// Instructor
import InstructorDashboard from '../pages/instructor/InstructorDashboard';
import CreateCoursePage from '../pages/instructor/CreateCoursePage';
import ManageCoursesPage from '../pages/instructor/ManageCoursesPage';
import UploadLessonsPage from '../pages/instructor/UploadLessonsPage';

// Admin
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsersPage from '../pages/admin/ManageUsersPage';
import AdminCoursesPage from '../pages/admin/AdminCoursesPage';
import AnalyticsPage from '../pages/admin/AnalyticsPage';
import ManageCategoriesPage from '../pages/admin/ManageCategoriesPage';


// Shared
import SharedProfilePage from '../pages/shared/ProfilePage';

import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from '../constants';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes — wrapped in PublicLayout (Navbar + Footer) */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path={ROUTES.COURSES} element={<CoursesPage />} />
          <Route path={`${ROUTES.COURSES}/:id`} element={<CourseDetailPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>

        {/* Student Dashboard — wrapped in DashboardLayout */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD.STUDENT.HOME} element={<StudentDashboard />} />
            <Route path={ROUTES.DASHBOARD.STUDENT.MY_COURSES} element={<MyCoursesPage />} />
            <Route path={ROUTES.DASHBOARD.STUDENT.WATCH(':courseId')} element={<WatchCoursePage />} />
            <Route path={ROUTES.DASHBOARD.STUDENT.PROFILE} element={<ProfilePage />} />
          </Route>
          {/* Checkout doesn't need the dashboard layout, so it's outside DashboardLayout but inside ProtectedRoute */}
          <Route path="/checkout/:id" element={<CheckoutPage />} />
          <Route path="/checkout/:id/success" element={<PaymentSuccessPage />} />
        </Route>

        {/* Instructor Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD.INSTRUCTOR.HOME} element={<InstructorDashboard />} />
            <Route path={ROUTES.DASHBOARD.INSTRUCTOR.CREATE_COURSE} element={<CreateCoursePage />} />
            <Route path={ROUTES.DASHBOARD.INSTRUCTOR.COURSES} element={<ManageCoursesPage />} />
            <Route path={ROUTES.DASHBOARD.INSTRUCTOR.LESSONS(':courseId')} element={<UploadLessonsPage />} />
            <Route path={ROUTES.DASHBOARD.INSTRUCTOR.PROFILE} element={<SharedProfilePage />} />
          </Route>
        </Route>

        {/* Admin Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD.ADMIN.HOME} element={<AdminDashboard />} />
            <Route path={ROUTES.DASHBOARD.ADMIN.USERS} element={<ManageUsersPage />} />
            <Route path={ROUTES.DASHBOARD.ADMIN.COURSES} element={<AdminCoursesPage />} />
            <Route path={ROUTES.DASHBOARD.ADMIN.CATEGORIES} element={<ManageCategoriesPage />} />
            <Route path={ROUTES.DASHBOARD.ADMIN.ANALYTICS} element={<AnalyticsPage />} />
            <Route path={ROUTES.DASHBOARD.ADMIN.PROFILE} element={<SharedProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

