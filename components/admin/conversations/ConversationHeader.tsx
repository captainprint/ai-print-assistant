"use client";

import { ChevronDown, Info } from "lucide-react";

type ConversationHeaderProps = {
    onToggleCustomerInfo?: () => void;
};

export default function ConversationHeader({
    onToggleCustomerInfo,
}: ConversationHeaderProps) {
    return (
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                    SM
                </div>

                <div>
                    <h2 className="text-base font-semibold text-gray-900">
                        Sarah Mitchell
                    </h2>

                    <p className="text-sm text-gray-500">
                        sarah.mitchell@designco.com
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50">
                    <span>New</span>
                    <ChevronDown size={16} className="text-gray-500" />
                </button>

                <button
                    onClick={onToggleCustomerInfo}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 xl:hidden"
                    aria-label="Customer information"
                >
                    <Info size={18} />
                </button>
            </div>
        </header>
    );
}