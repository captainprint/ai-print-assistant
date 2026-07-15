import { FileText, Trash2 } from "lucide-react";

type KnowledgeFile = {
  id: string;
  name: string;
  uploadedAt: string;
};

type KnowledgeFileCardProps = {
  file: KnowledgeFile;
  onRemove: (id: string) => void;
};

export default function KnowledgeFileCard({
  file,
  onRemove,
}: KnowledgeFileCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 transition hover:border-gray-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FileText size={20} />
          </div>

          <div className="min-w-0">
            <p
              className="truncate text-sm font-medium text-gray-900"
              title={file.name}
            >
              {file.name}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Uploaded {file.uploadedAt}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(file.id)}
          className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
          aria-label={`Remove ${file.name}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}