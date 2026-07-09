"use client";

import { useState } from "react";
import {
  BriefcaseBusiness,
  Calendar,
  Mail,
  MessageSquare,
  Phone,
  Check,
  ChevronDown
} from "lucide-react";

const TEAM_MEMBERS = [
  { id: "1", initials: "RB", name: "Roch Bajracharya", role: "Admin" },
  { id: "2", initials: "SG", name: "Sakchhi Gurung", role: "User" },
  { id: "3", initials: "NB", name: "Nisha Bhattarai", role: "Admin" },
];

export default function CustomerInfo() {
  const [status, setStatus] = useState("New");
  const [assignedUserId, setAssignedUserId] = useState("3");
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [assignmentSearch, setAssignmentSearch] = useState("");

  const assignedUser =
    TEAM_MEMBERS.find((member) => member.id === assignedUserId) ??
    TEAM_MEMBERS[0];


  const pendingUser = TEAM_MEMBERS.find(
    (member) => member.id === pendingUserId
  );

  const filteredTeamMembers = TEAM_MEMBERS.filter((member) =>
    member.name.toLowerCase().includes(assignmentSearch.toLowerCase())
  );
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
        </div>

        {/* SET STATUS DROPDOWN */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Conversation Status
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Update the current progress of this chat.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="New">New</option>
              <option value="Open">Open</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <button
            type="button"
            className="mt-4 h-10 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Save Status
          </button>
        </div>

        {/* ASSIGNMENT */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Assignment
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Assign this conversation to a team member.
          </p>

          <div className="relative mt-4">
            <button
              type="button"
              onClick={() => {
                setIsAssignmentOpen(!isAssignmentOpen);
                setAssignmentSearch("");
              }}
              className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 text-left transition hover:border-gray-300"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700">
                  {assignedUser.initials}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {assignedUser.name}
                  </p>
                  <p className="text-xs text-gray-500">{assignedUser.role}</p>
                </div>
              </div>

              <ChevronDown
                size={17}
                className={`shrink-0 text-gray-400 transition ${isAssignmentOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {isAssignmentOpen && (
              <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                <div className="border-b border-gray-100 p-3">
                  <input
                    type="text"
                    value={assignmentSearch}
                    onChange={(e) => setAssignmentSearch(e.target.value)}
                    placeholder="Search team member..."
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {filteredTeamMembers.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => {
                      if (member.id === assignedUserId) {
                        setIsAssignmentOpen(false);
                        return;
                      }

                      setPendingUserId(member.id);
                      setIsAssignmentOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-gray-50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                        {member.initials}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>

                    {assignedUserId === member.id && (
                      <Check size={17} className="shrink-0 text-blue-600" />
                    )}
                  </button>
                ))}
                {filteredTeamMembers.length === 0 && (
                  <div className="px-4 py-4 text-sm text-gray-500">
                    No team member found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {
        pendingUser && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
              <h3 className="text-base font-semibold text-gray-900">
                Transfer chat?
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to transfer this chat to{" "}
                <span className="font-semibold text-gray-900">
                  {pendingUser.name}
                </span>
                ?
              </p>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPendingUserId(null)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  No
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAssignedUserId(pendingUser.id);
                    setPendingUserId(null);
                  }}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Yes, transfer
                </button>
              </div>
            </div>
          </div>
        )
      }
    </aside >
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