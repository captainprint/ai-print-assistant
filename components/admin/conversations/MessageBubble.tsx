import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import RecommendationCards from "@/components/RecommendationCards";
import type { ChatRecommendation, MatchedImageGroup } from "@/lib/chat";

type MessageBubbleProps = {
  sender: "customer" | "ai" | "admin";
  senderName: string;
  initials: string;
  message: string;
  time: string;
  recommendations?: ChatRecommendation[];
  images?: MatchedImageGroup[];
};

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-2 last:mb-0">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline opacity-90 hover:opacity-100"
    >
      {children}
    </a>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-[13px]">
      {children}
    </code>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="mb-2 border-l-2 border-current/30 pl-3 italic last:mb-0">
      {children}
    </blockquote>
  ),
};

export default function MessageBubble({
  sender,
  senderName,
  initials,
  message,
  time,
  recommendations,
  images,
}: MessageBubbleProps) {
  const isCustomer = sender === "customer";
  const isAi = sender === "ai";

  return (
    <div className={`flex gap-3 ${isCustomer ? "justify-start" : "justify-end"}`}>
      {isCustomer && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
          {initials}
        </div>
      )}

      <div
        className={`flex min-w-0 max-w-[85%] flex-col sm:max-w-[80%] ${
          isCustomer ? "items-start" : "items-end"
        }`}
      >
        <div
          className={`min-w-0 max-w-full rounded-2xl px-5 py-3.5 text-sm leading-6 shadow-sm ${
            isCustomer
              ? "rounded-tl-md border border-gray-200 bg-gray-50 text-gray-800"
              : "rounded-tr-md bg-[#165DFC] text-white"
          }`}
        >
          {isAi ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={markdownComponents}
            >
              {message}
            </ReactMarkdown>
          ) : (
            <p className="whitespace-pre-wrap break-words">{message}</p>
          )}

          {isAi && recommendations && recommendations.length > 0 && (
            <RecommendationCards recommendations={recommendations} images={images ?? []} />
          )}
        </div>

        <span className="mt-2 text-xs text-gray-400">
          {senderName} · {time}
        </span>
      </div>

      {!isCustomer && (
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${
            isAi ? "bg-[#165DFC]" : "bg-gray-900"
          }`}
        >
          {initials}
        </div>
      )}
    </div>
  );
}