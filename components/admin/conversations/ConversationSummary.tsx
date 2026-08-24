"use client";

import { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { relativeTime } from "@/lib/conversations";

type ConversationSummaryProps = {
  summary: string;
  generatedAt: string | null;
};

export default function ConversationSummary({ summary, generatedAt }: ConversationSummaryProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-blue-100 bg-blue-50/60">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="shrink-0 text-blue-600" />
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-800">
            Chat Summary
          </span>
          {generatedAt && (
            <span className="text-xs text-blue-400">· updated {relativeTime(generatedAt)}</span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-blue-400 transition ${collapsed ? "-rotate-90" : ""}`}
        />
      </button>

      {!collapsed && (
        <p className="px-4 pb-4 text-sm leading-relaxed text-blue-900">{summary}</p>
      )}
    </div>
  );
}
