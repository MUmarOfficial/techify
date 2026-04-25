export const ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

export const ROLE_LABELS: Record<UserRole, string> = {
  student: 'Student',
  instructor: 'Instructor',
  admin: 'Administrator',
};

export const ROLE_COLORS: Record<UserRole, 'default' | 'gold' | 'muted' | 'error' | 'success'> = {
  student: 'muted',
  instructor: 'gold',
  admin: 'default',
};
