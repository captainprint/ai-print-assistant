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
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Knowledge Base
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm text-gray-500">
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

                        {files.length > 0 && (
                            <button
                                type="button"
                                onClick={handleUploadClick}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
                            >
                                <Upload size={16} />
                                Upload Files
                            </button>
                        )}
                    </div>
                </div>

                {files.length === 0 ? (
                    <div className="mt-8 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <Upload size={28} />
                        </div>

                        <h3 className="mt-5 text-lg font-semibold text-gray-900">
                            No files uploaded yet
                        </h3>

                        <p className="mt-2 max-w-md text-sm text-gray-500">
                            Upload product catalogs, printing guides, FAQs, pricing sheets,
                            and other documents to help your AI assistant answer customer
                            questions.
                        </p>

                        <button
                            type="button"
                            onClick={handleUploadClick}
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            <Upload size={16} />
                            Upload Files
                        </button>
                    </div>
                ) : (
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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