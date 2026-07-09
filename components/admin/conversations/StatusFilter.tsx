"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const options = [
  "All Status",
  "New",
  "Open",
  "Resolved",
];

export default function StatusFilter() {
  const [selected, setSelected] = useState("All Statuses");

  return (
    <div className="flex justify-end">
      <div className="relative">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="h-9 appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-3 pr-9 text-xs font-medium text-gray-700 outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
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