"use client";

import { ArrowLeft, Info } from "lucide-react";

type ConversationHeaderProps = {
    onBack?: () => void;
    showBackButton?: boolean;
    onToggleCustomerInfo: () => void;
};

export default function ConversationHeader({
    onBack,
    showBackButton,
    onToggleCustomerInfo,
}: ConversationHeaderProps) {
    return (
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center gap-3">
                {showBackButton && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 xl:hidden"
                        aria-label="Back to conversations"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
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