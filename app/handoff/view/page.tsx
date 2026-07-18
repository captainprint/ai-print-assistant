"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Printer, AlertCircle } from "lucide-react";
import { getUser } from "@/lib/adminAuth";
import { viewConversationByToken } from "@/lib/conversations";

function HandoffViewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    viewConversationByToken(token)
      .then((conversation) => {
        if (cancelled) return;
        const role = getUser()?.role;
        const base = role === "admin" ? "/admin/conversations" : "/user/conversations";
        router.replace(`${base}?sessionId=${encodeURIComponent(conversation.sessionId)}`);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message || "This link is invalid or has expired.");
      });

    return () => {
      cancelled = true;
    };
  }, [token, router]);

  const displayError = error ?? (!token ? "This link is missing its token. Please use the link from your email." : null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8] px-4">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4361ee] text-white shadow-sm">
            <Printer size={20} />
          </div>
          <h1 className="text-lg font-semibold text-[#111827]">AI Print Assistant</h1>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-8 text-center shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
          {displayError ? (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <AlertCircle size={22} className="text-red-500" />
              </div>
              <h2 className="text-lg font-semibold text-[#111827]">Can&apos;t open this link</h2>
              <p className="mt-2 text-sm text-[#6b7280]">{displayError}</p>
              <a
                href="/u/login"
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-[#4361ee] text-sm font-semibold text-white shadow-sm transition hover:bg-[#304ee0]"
              >
                Go to dashboard
              </a>
            </>
          ) : (
            <>
              <Loader2 size={28} className="mx-auto mb-4 animate-spin text-[#4361ee]" />
              <h2 className="text-lg font-semibold text-[#111827]">Opening conversation…</h2>
              <p className="mt-2 text-sm text-[#6b7280]">
                Hang tight while we verify your link.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function HandoffViewPage() {
  return (
    <Suspense fallback={null}>
      <HandoffViewContent />
    </Suspense>
  );
}
