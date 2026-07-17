"use client";

import { ChevronDown } from "lucide-react";

export type StatusFilterValue = "all" | "unassigned" | "assigned" | "closed";

const options: { label: string; value: StatusFilterValue }[] = [
  { label: "All Status", value: "all" },
  { label: "New", value: "unassigned" },
  { label: "Open", value: "assigned" },
  { label: "Resolved", value: "closed" },
];

type StatusFilterProps = {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
};

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="flex justify-end">
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as StatusFilterValue)}
          className="h-9 appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-3 pr-9 text-xs font-medium text-gray-700 outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
      </div>
    </div>
  );
}
