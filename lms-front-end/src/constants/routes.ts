export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  COURSES: "/courses",
  DASHBOARD: {
    STUDENT: {
      HOME: "/dashboard/student",
      MY_COURSES: "/dashboard/student/my-courses",
      WATCH: (courseId: string) => `/dashboard/student/watch/${courseId}`,
      PROFILE: "/dashboard/student/profile",
      CHECKOUT: (enrollmentId: string) => `/checkout/${enrollmentId}`,
    },

    INSTRUCTOR: {
      HOME: "/dashboard/instructor",
      COURSES: "/dashboard/instructor/courses",
      CREATE_COURSE: "/dashboard/instructor/create",
      LESSONS: (courseId: string) =>
        `/dashboard/instructor/lessons/${courseId}`,
      PROFILE: "/dashboard/instructor/profile",
    },
    ADMIN: {
      HOME: "/dashboard/admin",
      USERS: "/dashboard/admin/users",
      COURSES: "/dashboard/admin/courses",
      CATEGORIES: "/dashboard/admin/categories",
      ANALYTICS: "/dashboard/admin/analytics",
      PROFILE: "/dashboard/admin/profile",
    },
  },
};
