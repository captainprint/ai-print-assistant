import { UserRound } from "lucide-react";

type Props = {
  role: "ai" | "user";
  message: string;
  time: string;
};

export default function MessageBubble({
  role,
  message,
  time,
}: Props) {
  if (role === "ai") {
    return (
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-[#3157F6] text-white flex items-center justify-center text-sm font-semibold shrink-0">
          AI
        </div>

        <div className="max-w-[320px] rounded-xl bg-white border border-gray-200 px-5 py-4 shadow-sm">
          <p>{message}</p>

          <p className="text-xs text-gray-500 mt-3">
            {time}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end items-start gap-3">
      <div className="max-w-[320px] rounded-xl bg-[#344054] px-5 py-4 shadow-sm">
        <p className="text-white">{message}</p>

        <p className="text-xs text-gray-200 mt-3">
          {time}
        </p>
      </div>

      <div className="w-9 h-9 rounded-full bg-[#344054] text-white flex items-center justify-center">
        <UserRound size={18} />
      </div>
    </div>
  );
}