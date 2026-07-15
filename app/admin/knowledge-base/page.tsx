"use client";

import { useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Upload } from "lucide-react";

export default function KnowledgeBasePage() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleUploadClick() {
        fileInputRef.current?.click();
    }

    return (
        <AdminLayout title="Knowledge Base" noPadding>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
                <h2 className="text-lg font-semibold text-gray-900">Knowledge Base</h2>
                <p className="mt-2 mb-4 text-sm text-gray-500">
                    Upload files that your AI assistant can use to answer customer questions.
                </p>
                <button
                    type="button"
                    onClick={handleUploadClick}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    <Upload size={16} />
                    Upload Files
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.csv"
                />
            </div>
        </AdminLayout>
    );
}