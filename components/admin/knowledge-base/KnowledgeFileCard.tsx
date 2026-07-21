import { FileText, Loader2, RefreshCw, Trash2 } from "lucide-react";
import type { KnowledgeFile, KnowledgeFileStatus } from "@/lib/knowledgeBase";

export type DisplayKnowledgeFile = Omit<KnowledgeFile, "status"> & {
  status: KnowledgeFileStatus | "processing";
};

type KnowledgeFileCardProps = {
  file: DisplayKnowledgeFile;
  onRemove: (file: DisplayKnowledgeFile) => void;
  onReplace: (file: DisplayKnowledgeFile) => void;
};

function formatUploadedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const STATUS_STYLES: Record<KnowledgeFileStatus | "processing", string> = {
  processing: "bg-gray-100 text-gray-600",
  ready: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
};

const STATUS_LABELS: Record<KnowledgeFileStatus | "processing", string> = {
  processing: "Processing…",
  ready: "Ready",
  failed: "Failed",
};

export default function KnowledgeFileCard({
  file,
  onRemove,
  onReplace,
}: KnowledgeFileCardProps) {
  const isBusy = file.status === "processing";

  return (
    <div className="min-w-0 rounded-xl border border-gray-200 p-4 transition hover:border-gray-300 hover:shadow-sm">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FileText size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="truncate text-sm font-medium text-gray-900"
              title={file.originalFilename}
            >
              {file.originalFilename}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {file.status === "processing"
                ? "Uploading…"
                : `Uploaded ${formatUploadedAt(file.createdAt)}`}
            </p>

            <span
              className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[file.status]}`}
            >
              {file.status === "processing" && <Loader2 size={12} className="animate-spin" />}
              {STATUS_LABELS[file.status]}
            </span>

            {file.status === "failed" && file.parseError && (
              <p
                className="mt-1 truncate text-xs text-red-600"
                title={file.parseError}
              >
                {file.parseError}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onReplace(file)}
            disabled={isBusy}
            className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Replace ${file.originalFilename}`}
          >
            <RefreshCw size={16} />
          </button>

          <button
            type="button"
            onClick={() => onRemove(file)}
            disabled={isBusy}
            className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Remove ${file.originalFilename}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
