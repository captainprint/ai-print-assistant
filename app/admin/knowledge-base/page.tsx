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
    const [fileToDelete, setFileToDelete] = useState<KnowledgeFile | null>(null);
    const [duplicateFileName, setDuplicateFileName] = useState<string | null>(null);

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

        const existingFileNames = new Set(
            files.map((file) => file.name.toLowerCase())
        );

        const uniqueSelectedFiles = Array.from(selectedFiles).filter(
            (file) => !existingFileNames.has(file.name.toLowerCase())
        );

        const duplicateFiles = Array.from(selectedFiles).filter(
            (file) => existingFileNames.has(file.name.toLowerCase())
        );

        const newFiles: KnowledgeFile[] = uniqueSelectedFiles.map(
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

        if (duplicateFiles.length > 0) {
            setDuplicateFileName(
                duplicateFiles.length === 1
                    ? duplicateFiles[0].name
                    : `${duplicateFiles.length} files`
            );
        }

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
                <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Knowledge Base
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm text-gray-500">
                        Upload files that your AI assistant can use to answer customer
                        questions.
                    </p>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.csv"
                    onChange={handleFileChange}
                />

                <div className="mt-8 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <Upload size={28} />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-gray-900">
                        {files.length === 0
                            ? "No files uploaded yet"
                            : "Add more files"}
                    </h3>

                    <p className="mt-2 max-w-md text-sm text-gray-500">
                        {files.length === 0
                            ? "Upload product catalogs, printing guides, FAQs, pricing sheets, and other documents to help your AI assistant answer customer questions."
                            : "Upload additional documents to keep your AI assistant's knowledge up to date."}
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

                {files.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {files.map((file) => (
                            <KnowledgeFileCard
                                key={file.id}
                                file={file}
                                onRemove={(file) => setFileToDelete(file)}
                            />
                        ))}
                    </div>
                )}

                {fileToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Delete file?
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Are you sure you want to delete{" "}
                                <span className="font-medium text-gray-900">
                                    {fileToDelete.name}
                                </span>
                                ? This action cannot be undone.
                            </p>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFileToDelete(null)}
                                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        handleRemoveFile(fileToDelete.id);
                                        setFileToDelete(null);
                                    }}
                                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {duplicateFileName && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                            <h3 className="text-lg font-semibold text-gray-900">
                                File already uploaded
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                <span className="font-medium text-gray-900">
                                    {duplicateFileName}
                                </span>{" "}
                                is already in the Knowledge Base and was not uploaded again.
                            </p>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setDuplicateFileName(null)}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                >
                                    Okay
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}