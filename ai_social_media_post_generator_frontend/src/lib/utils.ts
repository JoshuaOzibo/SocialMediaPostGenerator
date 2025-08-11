import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// JWT Token Decoding Utility
export function decodeJwtToken(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    throw new Error('Invalid JWT token format');
  }
}

// Format user data for display
export function formatUserData(user: any): {
  id: string;
  name: string;
  email: string;
  picture: string;
  emailVerified: boolean;
} {
  return {
    id: user.sub || user.id,
    name: user.name || `${user.given_name || ''} ${user.family_name || ''}`.trim(),
    email: user.email,
    picture: user.picture,
    emailVerified: user.email_verified || false,
  };
}
