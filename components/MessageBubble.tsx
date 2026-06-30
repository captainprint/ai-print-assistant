type MessageBubbleProps = {
  sender: "customer" | "assistant";
  message: string;
  time: string;
};

export default function MessageBubble({
  sender,
  message,
  time,
}: MessageBubbleProps) {
  const isCustomer = sender === "customer";

  return (
    <div className={`flex gap-3 ${isCustomer ? "justify-start" : "justify-end"}`}>
      {isCustomer && (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
          SM
        </div>
      )}

      <div className={`flex max-w-[65%] flex-col ${isCustomer ? "items-start" : "items-end"}`}>
        <div
          className={`rounded-2xl px-5 py-3.5 text-sm leading-6 shadow-sm ${
            isCustomer
              ? "rounded-tl-md bg-gray-50 border border-gray-200 text-gray-800"
              : "rounded-tr-md bg-[#4361ee] text-white"
          }`}
        >
          {message}
        </div>

        <span className="mt-2 text-xs text-gray-400">{time}</span>
      </div>

      {!isCustomer && (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4361ee] text-sm font-semibold text-white">
          AI
        </div>
      )}
    </div>
  );
}