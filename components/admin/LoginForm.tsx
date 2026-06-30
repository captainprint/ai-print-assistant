import { Eye, Mail, Printer } from "lucide-react";

export default function LoginForm() {
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

        <form className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#111827]">
              Email address
            </label>

            <div className="flex h-12 items-center gap-3 rounded-2xl border border-[#d9dde5] bg-[#fbfcfd] px-4">
              <Mail size={18} className="text-[#6b7280]" />
              <input
                type="email"
                defaultValue="example@aiprintassistant.com"
                className="w-full bg-transparent text-sm text-[#111827] outline-none"
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

            <div className="flex h-12 items-center gap-3 rounded-2xl border border-[#d9dde5] bg-[#fbfcfd] px-4">
              <input
                type="password"
                defaultValue="password123"
                className="w-full bg-transparent text-sm text-[#111827] outline-none"
              />

              <Eye size={18} className="text-[#6b7280]" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-[#6b7280]">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 accent-[#4361ee]"
            />
            Keep me signed in
          </label>

          <button
            type="submit"
            className="h-12 w-full rounded-2xl bg-[#4361ee] text-sm font-semibold text-white shadow-sm transition hover:bg-[#304ee0]"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}