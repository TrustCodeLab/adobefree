"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteSupportRequest } from "./actions";

export type SupportRequest = {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  message: string;
  status: "pending" | "reviewed" | "resolved";
};

export default function SupportRequestCard({
  request,
}: {
  request: SupportRequest;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const maxLength = 150;
  const shouldTruncate = request.message.length > maxLength;
  const displayedMessage = isExpanded
    ? request.message
    : shouldTruncate
      ? request.message.slice(0, maxLength) + "..."
      : request.message;

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this message?")) return;

    setIsDeleting(true);
    const result = await deleteSupportRequest(request.id);

    if (result.error) {
      toast.error(result.error);
      setIsDeleting(false);
    } else {
      toast.success("Message deleted successfully");
    }
  }

  return (
    <div
      className={`bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl p-5 sm:p-6 flex flex-col gap-3.5 transition-all ${
        isDeleting ? "opacity-50 pointer-events-none" : "hover:border-[#3ecf8e]/30"
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base font-bold text-[#ededef]">{request.name}</h3>
          {request.email && (
            <a
              href={`mailto:${request.email}`}
              className="text-xs text-[#3ecf8e] hover:underline font-mono"
            >
              {request.email}
            </a>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <span
            className={`px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-md border ${
              request.status === "pending"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : request.status === "resolved"
                  ? "bg-[#3ecf8e]/10 text-[#3ecf8e] border-[#3ecf8e]/20"
                  : "bg-[#242424] text-[#ededef] border-[#2e2e2e]"
            }`}
          >
            {request.status}
          </span>
          <span className="text-xs text-[#6b7280]" suppressHydrationWarning>
            {formatDistanceToNow(new Date(request.created_at), {
              addSuffix: true,
            })}
          </span>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete message"
            className="bg-[#242424] hover:bg-red-500/10 text-[#6b7280] hover:text-red-400 p-2 rounded-lg border border-[#2e2e2e] hover:border-red-500/20 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="text-xs sm:text-sm text-[#ededef] whitespace-pre-wrap font-mono break-all bg-[#141414] p-3.5 rounded-lg border border-[#2e2e2e]">
        {displayedMessage}

        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#3ecf8e] hover:underline transition-colors text-xs font-sans mt-2 block font-semibold cursor-pointer"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    </div>
  );
}
