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
    <div
      className={`mb-6 flex ${
        isCustomer ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`max-w-[75%] ${
          isCustomer ? "items-start" : "items-end"
        } flex flex-col`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
            isCustomer
              ? "rounded-tl-md bg-white text-gray-800"
              : "rounded-tr-md bg-blue-600 text-white"
          }`}
        >
          {message}
        </div>

        <span className="mt-2 text-xs text-gray-400">
          {time}
        </span>
      </div>
    </div>
  );
}