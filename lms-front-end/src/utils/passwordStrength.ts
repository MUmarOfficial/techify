export interface PasswordStrength {
  score: 0 | 1 | 2 | 3;
  label: 'Weak' | 'Fair' | 'Strong';
  color: string;        // CSS colour token string
  bgColor: string;      // Tailwind bg class for segments
}

/**
 * Returns a 0–3 score and a human-readable label based on:
 *  • length >= 8
 *  • contains a letter (upper or lower)
 *  • contains a digit
 *  • contains a symbol (non-alphanumeric)
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: 'Weak', color: '#e53e3e', bgColor: 'bg-red-500' };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Za-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z\d]/.test(password)) score++;

  // Clamp to 0-3
  const clamped = Math.min(score, 3) as 0 | 1 | 2 | 3;

  if (clamped <= 1) return { score: clamped, label: 'Weak',   color: '#e53e3e', bgColor: 'bg-red-500'    };
  if (clamped === 2) return { score: clamped, label: 'Fair',   color: '#d97706', bgColor: 'bg-amber-500'  };
  return              { score: clamped, label: 'Strong', color: '#16a34a', bgColor: 'bg-green-600'  };
}

/**
 * Returns true if the password passes ALL strength criteria.
 */
export function isPasswordStrong(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z\d]/.test(password)
  );
}
