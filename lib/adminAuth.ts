export type AdminUser = {
  username?: string;
  email?: string;
  fullName?: string;
  role: string;
};

const TOKEN_KEY = "admin_token";
const USER_KEY = "admin_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function saveAuth(token: string, user: AdminUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // Set a non-httpOnly cookie so proxy.ts can check auth for redirects
  document.cookie = `admin_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = "admin_token=; path=/; max-age=0; SameSite=Lax";
}

export function getInitials(user: AdminUser): string {
  if (user.fullName) {
    return user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  const name = user.username || user.email || "";
  return name.slice(0, 2).toUpperCase() || "AD";
}
