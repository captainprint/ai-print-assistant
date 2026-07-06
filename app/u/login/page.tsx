import LoginForm from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        <LoginForm />

        <p className="mt-6 text-center text-xs text-gray-500">
          © 2026 AI Print Assistant · Support Portal v1.0
        </p>
      </div>
    </main>
  );
}
