import { apiFetch } from "@/lib/api";

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  const res = await apiFetch("/api/v1/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Failed to change password");
  }

  return data;
}
