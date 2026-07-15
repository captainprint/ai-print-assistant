"use client";

import { useRef, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Upload } from "lucide-react";
import KnowledgeFileCard from "@/components/admin/knowledge-base/KnowledgeFileCard";

type KnowledgeFile = {
    id: string;
    name: string;
    uploadedAt: string;
}

export default function KnowledgeBasePage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<KnowledgeFile[]>([]);

    function handleUploadClick() {
        fileInputRef.current?.click();
    }

    function handleFileChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const selectedFiles = event.target.files;

        if (!selectedFiles) {
            return;
        }

        const newFiles: KnowledgeFile[] = Array.from(selectedFiles).map(
            (file) => ({
                id: crypto.randomUUID(),
                name: file.name,
                uploadedAt: new Date().toLocaleDateString("en-CA", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }),
            })
        );

        setFiles((currentFiles) => [...newFiles, ...currentFiles]);

        event.target.value = "";
    }

    function handleRemoveFile(id: string) {
        setFiles((currentFiles) =>
            currentFiles.filter((file) => file.id !== id)
        );
    }


    return (
        <AdminLayout title="Knowledge Base" noPadding>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Knowledge Base
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Upload files that your AI assistant can use to answer customer
                            questions.
                        </p>
                    </div>

                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            accept=".pdf,.doc,.docx,.txt,.csv"
                            onChange={handleFileChange}
                        />

                        <button
                            type="button"
                            onClick={handleUploadClick}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            <Upload size={16} />
                            Upload Files
                        </button>
                    </div>
                </div>

                {files.length > 0 && (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {files.map((file) => (
                            <KnowledgeFileCard
                                key={file.id}
                                file={file}
                                onRemove={handleRemoveFile}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}