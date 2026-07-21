import { apiFetch } from "@/lib/api";

export type KnowledgeFileStatus = "ready" | "failed";

export type KnowledgeFile = {
  _id: string;
  originalFilename: string;
  mimetype: string;
  fileExtension: string;
  sizeBytes: number;
  extractedChars: number;
  status: KnowledgeFileStatus;
  parseError: string | null;
  uploadedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.message || "Request failed", res.status);
  }

  return data as T;
}

export async function listKnowledgeFiles(): Promise<{ files: KnowledgeFile[] }> {
  return request(`/api/v1/admin/knowledge-base`);
}

export async function uploadKnowledgeFile(file: File): Promise<{ file: KnowledgeFile }> {
  const formData = new FormData();
  formData.append("file", file);
  return request(`/api/v1/admin/knowledge-base`, { method: "POST", body: formData });
}

export async function replaceKnowledgeFile(id: string, file: File): Promise<{ file: KnowledgeFile }> {
  const formData = new FormData();
  formData.append("file", file);
  return request(`/api/v1/admin/knowledge-base/${id}`, { method: "PUT", body: formData });
}

export async function deleteKnowledgeFile(id: string): Promise<{ message: string }> {
  return request(`/api/v1/admin/knowledge-base/${id}`, { method: "DELETE" });
}
