type MessageBubbleProps = {
  sender: "customer" | "ai" | "admin";
  senderName: string;
  initials: string;
  message: string;
  time: string;
};

export default function MessageBubble({
  sender,
  senderName,
  initials,
  message,
  time,
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
        className={`flex max-w-[85%] flex-col sm:max-w-[65%] ${
          isCustomer ? "items-start" : "items-end"
        }`}
      >
        <div
          className={`rounded-2xl px-5 py-3.5 text-sm leading-6 shadow-sm ${
            isCustomer
              ? "rounded-tl-md border border-gray-200 bg-gray-50 text-gray-800"
              : "rounded-tr-md bg-[#165DFC] text-white"
          }`}
        >
          {message}
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