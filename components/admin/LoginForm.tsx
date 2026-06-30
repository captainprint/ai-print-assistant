"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Printer, Loader2 } from "lucide-react";
import { saveAuth } from "@/lib/adminAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const isEmail = identifier.includes("@");
      const endpoint = isEmail ? "/api/auth/login" : "/api/admin/login";
      const body = isEmail
        ? { email: identifier, password }
        : { username: identifier, password };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed. Please check your credentials.");
        return;
      }

      saveAuth(data.token, data.user);
      router.push("/admin/dashboard");
    } catch {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4361ee] text-white shadow-sm">
          <Printer size={20} />
        </div>

        <h1 className="text-lg font-semibold text-[#111827]">
          AI Print Assistant
        </h1>
      </div>

      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-semibold tracking-tight text-[#111827]">
          Welcome back
        </h2>

        <p className="mt-2 text-sm text-[#6b7280]">
          Sign in to your support dashboard
        </p>

        {error && (
          <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#111827]">
              Username or Email
            </label>

            <div className="flex h-12 items-center gap-3 rounded-2xl border border-[#d9dde5] bg-[#fbfcfd] px-4 transition-colors focus-within:border-[#4361ee]">
              <Mail size={18} className="shrink-0 text-[#6b7280]" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin or you@example.com"
                required
                autoComplete="username"
                className="w-full bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-semibold text-[#111827]">
                Password
              </label>

              <button
                type="button"
                className="text-xs font-medium text-[#4361ee] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <div className="flex h-12 items-center gap-3 rounded-2xl border border-[#d9dde5] bg-[#fbfcfd] px-4 transition-colors focus-within:border-[#4361ee]">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="shrink-0 text-[#6b7280] transition-colors hover:text-[#111827]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#4361ee] text-sm font-semibold text-white shadow-sm transition hover:bg-[#304ee0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
