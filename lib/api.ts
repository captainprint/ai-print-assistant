import { getToken, clearAuth } from "@/lib/adminAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401 && typeof window !== "undefined") {
    clearAuth();
    window.location.href = "/u/login";
  }

  return res;
}
