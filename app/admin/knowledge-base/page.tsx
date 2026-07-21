"use client";

import { useEffect, useRef, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Loader2, Upload } from "lucide-react";
import KnowledgeFileCard, {
    DisplayKnowledgeFile,
} from "@/components/admin/knowledge-base/KnowledgeFileCard";
import {
    ApiError,
    deleteKnowledgeFile,
    listKnowledgeFiles,
    replaceKnowledgeFile,
    uploadKnowledgeFile,
} from "@/lib/knowledgeBase";

const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "xls", "xlsx", "csv", "txt"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB, mirrors the backend's multer limit

function getExtension(filename: string): string {
    return filename.split(".").pop()?.toLowerCase() ?? "";
}

function makeProcessingPlaceholder(file: File): DisplayKnowledgeFile {
    return {
        _id: `local-${crypto.randomUUID()}`,
        originalFilename: file.name,
        mimetype: file.type,
        fileExtension: getExtension(file.name),
        sizeBytes: file.size,
        extractedChars: 0,
        status: "processing",
        parseError: null,
        uploadedBy: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

export default function KnowledgeBasePage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const replaceInputRef = useRef<HTMLInputElement>(null);

    const [files, setFiles] = useState<DisplayKnowledgeFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [listError, setListError] = useState("");
    const [actionError, setActionError] = useState("");

    const [fileToDelete, setFileToDelete] = useState<DisplayKnowledgeFile | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const [duplicateConflict, setDuplicateConflict] = useState<{
        existing: DisplayKnowledgeFile;
        incoming: File;
    } | null>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [invalidFileMessage, setInvalidFileMessage] = useState<string | null>(null);
    const [oversizedFileMessage, setOversizedFileMessage] = useState<string | null>(null);

    const [replaceTarget, setReplaceTarget] = useState<DisplayKnowledgeFile | null>(null);

    async function loadFiles() {
        setLoading(true);
        setListError("");
        try {
            const data = await listKnowledgeFiles();
            setFiles(data.files);
        } catch (err) {
            setListError(err instanceof ApiError ? err.message : "Failed to load knowledge base files.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadFiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleUploadClick() {
        fileInputRef.current?.click();
    }

    async function uploadOne(file: File) {
        const placeholder = makeProcessingPlaceholder(file);
        setFiles((current) => [placeholder, ...current]);

        try {
            const { file: saved } = await uploadKnowledgeFile(file);
            setFiles((current) =>
                current.map((f) => (f._id === placeholder._id ? saved : f))
            );
        } catch (err) {
            setFiles((current) => current.filter((f) => f._id !== placeholder._id));
            setActionError(
                err instanceof ApiError ? err.message : `Failed to upload ${file.name}.`
            );
        }
    }

    async function replaceOne(existing: DisplayKnowledgeFile, file: File) {
        setFiles((current) =>
            current.map((f) => (f._id === existing._id ? { ...f, status: "processing" } : f))
        );

        try {
            const { file: saved } = await replaceKnowledgeFile(existing._id, file);
            setFiles((current) => current.map((f) => (f._id === existing._id ? saved : f)));
        } catch (err) {
            setFiles((current) => current.map((f) => (f._id === existing._id ? existing : f)));
            setActionError(
                err instanceof ApiError ? err.message : `Failed to replace ${existing.originalFilename}.`
            );
        }
    }

    function processFiles(selectedFiles: File[]) {
        setActionError("");

        const validFiles = selectedFiles.filter((file) =>
            ALLOWED_EXTENSIONS.includes(getExtension(file.name))
        );
        const invalidFiles = selectedFiles.filter(
            (file) => !ALLOWED_EXTENSIONS.includes(getExtension(file.name))
        );

        const sizedFiles = validFiles.filter((file) => file.size <= MAX_FILE_SIZE_BYTES);
        const oversizedFiles = validFiles.filter((file) => file.size > MAX_FILE_SIZE_BYTES);

        const savedFiles = files.filter((f) => f.status !== "processing");
        const existingByName = new Map(
            savedFiles.map((f) => [f.originalFilename.toLowerCase(), f])
        );

        const uniqueFiles: File[] = [];
        let firstConflict: { existing: DisplayKnowledgeFile; incoming: File } | null = null;

        for (const file of sizedFiles) {
            const existing = existingByName.get(file.name.toLowerCase());
            if (existing) {
                if (!firstConflict) firstConflict = { existing, incoming: file };
            } else {
                uniqueFiles.push(file);
            }
        }

        for (const file of uniqueFiles) {
            uploadOne(file);
        }

        if (firstConflict) {
            setDuplicateConflict(firstConflict);
        }

        if (oversizedFiles.length > 0) {
            setOversizedFileMessage(
                oversizedFiles.length === 1
                    ? oversizedFiles[0].name
                    : `${oversizedFiles.length} files`
            );
        }

        if (invalidFiles.length > 0) {
            setInvalidFileMessage(
                invalidFiles.length === 1
                    ? invalidFiles[0].name
                    : `${invalidFiles.length} files`
            );
        }
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const selectedFiles = event.target.files;
        if (!selectedFiles) return;
        processFiles(Array.from(selectedFiles));
        event.target.value = "";
    }

    function handleReplaceFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files?.[0];
        event.target.value = "";
        if (!selectedFile || !replaceTarget) return;

        const target = replaceTarget;
        setReplaceTarget(null);

        const ext = getExtension(selectedFile.name);
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            setInvalidFileMessage(selectedFile.name);
            return;
        }
        if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
            setOversizedFileMessage(selectedFile.name);
            return;
        }

        replaceOne(target, selectedFile);
    }

    function handleReplaceClick(file: DisplayKnowledgeFile) {
        setReplaceTarget(file);
        // Defer to next tick so the ref's accept attribute (if ever made
        // extension-specific) and ref itself are ready before click().
        requestAnimationFrame(() => replaceInputRef.current?.click());
    }

    function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsDragging(false);
    }

    function handleDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(event.dataTransfer.files);
        if (droppedFiles.length === 0) return;

        processFiles(droppedFiles);
    }

    async function handleConfirmDelete() {
        if (!fileToDelete) return;
        setDeleting(true);
        setDeleteError("");
        try {
            await deleteKnowledgeFile(fileToDelete._id);
            setFiles((current) => current.filter((f) => f._id !== fileToDelete._id));
            setFileToDelete(null);
        } catch (err) {
            setDeleteError(
                err instanceof ApiError ? err.message : "Failed to delete file. Try again."
            );
        } finally {
            setDeleting(false);
        }
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

                {actionError && (
                    <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {actionError}
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
                    onChange={handleFileChange}
                />

                <input
                    ref={replaceInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
                    onChange={handleReplaceFileChange}
                />

                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`mt-8 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-16 text-center transition ${isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                        }`}
                >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <Upload size={28} />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-gray-900">
                        {isDragging
                            ? "Drop files here"
                            : files.length === 0
                                ? "Drag and drop files here"
                                : "Add more files"}
                    </h3>

                    <p className="mt-2 max-w-md text-sm text-gray-500">
                        {isDragging
                            ? "Release the files to add them to the Knowledge Base."
                            : files.length === 0
                                ? "Drag files here or use the button below to upload product catalogs, printing guides, FAQs, and pricing sheets."
                                : "Drag additional files here or use the button below to keep your AI assistant up to date."}
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

                {loading && (
                    <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Loader2 size={18} className="animate-spin" />
                        Loading files…
                    </div>
                )}

                {!loading && listError && (
                    <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {listError}
                    </div>
                )}

                {!loading && !listError && files.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {files.map((file) => (
                            <KnowledgeFileCard
                                key={file._id}
                                file={file}
                                onRemove={(f) => setFileToDelete(f)}
                                onReplace={handleReplaceClick}
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
                                    {fileToDelete.originalFilename}
                                </span>
                                ? This action cannot be undone.
                            </p>

                            {deleteError && (
                                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                                    {deleteError}
                                </p>
                            )}

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFileToDelete(null);
                                        setDeleteError("");
                                    }}
                                    disabled={deleting}
                                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    disabled={deleting}
                                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                    {deleting && <Loader2 size={14} className="animate-spin" />}
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {duplicateConflict && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                            <h3 className="text-lg font-semibold text-gray-900">
                                File already uploaded
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                <span className="font-medium text-gray-900">
                                    {duplicateConflict.existing.originalFilename}
                                </span>{" "}
                                is already in the Knowledge Base. You can replace its contents
                                with the new file, or cancel this upload.
                            </p>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDuplicateConflict(null)}
                                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        replaceOne(duplicateConflict.existing, duplicateConflict.incoming);
                                        setDuplicateConflict(null);
                                    }}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                >
                                    Replace instead
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {invalidFileMessage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Unsupported File Type
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                <span className="font-medium text-gray-900">
                                    {invalidFileMessage}
                                </span>{" "}
                                is not a supported file type.
                            </p>

                            <p className="mt-4 text-sm text-gray-500">
                                Only PDF, Word (.doc, .docx), Excel (.xls, .xlsx), CSV, and TXT files can be uploaded to the Knowledge Base.
                            </p>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setInvalidFileMessage(null)}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                >
                                    Okay
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {oversizedFileMessage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                            <h3 className="text-lg font-semibold text-gray-900">
                                File Too Large
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                <span className="font-medium text-gray-900">
                                    {oversizedFileMessage}
                                </span>{" "}
                                is larger than the 10MB limit.
                            </p>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setOversizedFileMessage(null)}
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
