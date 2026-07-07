"use client";

import { useState } from "react";
import {
  BriefcaseBusiness,
  Calendar,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";

export default function CustomerInfo() {
  const [isResolved, setIsResolved] = useState(false);
  return (
    <aside className="flex h-full min-h-0 flex-col bg-white">
      <div className="shrink-0 border-b border-gray-200 px-5 py-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900">
          Customer Info
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="flex flex-col items-center border-b border-gray-200 pb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            SM
          </div>

          <h3 className="mt-3 text-[15px] font-semibold text-gray-800">
            Sarah Mitchell
          </h3>

          <p className="text-xs text-gray-500">DesignCo Studio</p>
        </div>

        <div className="mt-6 space-y-4">
          <InfoRow icon={Mail} label="Email" value="sarah.mitchell@designco.com" />
          <InfoRow icon={Phone} label="Phone" value="+1 (415) 882-0192" />
          <InfoRow icon={BriefcaseBusiness} label="Company" value="DesignCo Studio" />
          <InfoRow icon={Calendar} label="First Contact" value="Jan 12, 2024" />
          <InfoRow icon={MessageSquare} label="Total Conversations" value="7" />
        </div>

        {/* MARK RESOLVED TOGGLE BUTTON */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Issue Status
              </p>
              <p className="mt-1 text-[13px] text-gray-600">
                {isResolved
                  ? "Marked as resolved."
                  : "Conversation is still active."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsResolved(!isResolved)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${isResolved ? "bg-green-500" : "bg-gray-300"
                }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${isResolved ? "translate-x-5" : "translate-x-0.5"
                  }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-gray-100 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Assigned To
          </p>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700">
              NB
            </div>

            <span className="text-[14px] text-gray-700">
              Nisha Bhattarai
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

type InfoRowProps = {
  icon: React.ElementType;
  label: string;
  value: string;
};

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
        <Icon size={15} className="text-gray-400" />
        <span>{value}</span>
      </div>
    </div>
  );
}