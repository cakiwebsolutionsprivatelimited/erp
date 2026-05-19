/**
 * Generates initials for avatar display.
 */
export const getInitials = (firstName: string, lastName: string): string => {
  const f = firstName ? firstName.charAt(0).toUpperCase() : '';
  const l = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${f}${l}` || 'EE';
};

/**
 * Chooses a premium background color for an avatar based on a string value (like employee ID).
 */
export const getAvatarBg = (id: string): string => {
  const bgs = [
    'bg-purple-600 text-white',
    'bg-indigo-600 text-white',
    'bg-emerald-600 text-white',
    'bg-rose-600 text-white',
    'bg-amber-600 text-white',
    'bg-blue-600 text-white',
    'bg-cyan-600 text-white',
    'bg-teal-600 text-white'
  ];
  
  if (!id) return bgs[0];
  
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % bgs.length);
  return bgs[index];
};

/**
 * Validates password strength and returns a score (0 to 4) plus message.
 */
export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
}

export const checkPasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return { score: 0, label: 'Weak', color: 'bg-muted' };
  }
  
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  const labels: ('Weak' | 'Fair' | 'Good' | 'Strong')[] = ['Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-rose-500', 'bg-amber-500', 'bg-yellow-500', 'bg-emerald-500'];
  
  const idx = Math.max(0, score - 1);
  return {
    score,
    label: labels[idx],
    color: colors[idx]
  };
};

/**
 * Generates a highly secure password.
 */
export const generateSecurePassword = (): string => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  
  // Ensure at least one of each class is present
  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
  password += "0123456789"[Math.floor(Math.random() * 10)];
  password += "!@#$%^&*()_+~"[Math.floor(Math.random() * 13)];
  
  for (let i = 4; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};
