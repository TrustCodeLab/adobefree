import { createClient } from "../../utils/supabase/server";
import SupportRequestCard, { type SupportRequest } from "./SupportRequestCard";
import { LifebuoyIcon } from "@heroicons/react/24/outline";

export default async function SupportRequestsPage() {
  const supabase = await createClient();

  const { data: requests, error } = await supabase
    .from("support_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-[#1c1c1c] border border-red-500/30 text-red-400 text-sm">
        Error loading support requests: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Supabase Styled Header Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#1c1c1c] p-6 sm:p-8 border border-[#2e2e2e]">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/20">
              <LifebuoyIcon className="w-3.5 h-3.5" /> Customer Feedback
            </span>
            <span className="text-[#6b7280] text-xs font-medium">
              • User Inquiries
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#ededef] tracking-tight">
            Support Requests
          </h2>
          <p className="text-[#878c96] text-sm leading-relaxed">
            Customer support inbox.
          </p>
        </div>
      </div>

      {!requests || requests.length === 0 ? (
        <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl p-8 text-center text-[#878c96] text-sm">
          No support requests found yet.
        </div>
      ) : (
        <div className="grid gap-3">
          {requests.map((req: SupportRequest) => (
            <SupportRequestCard key={req.id} request={req} />
          ))}
        </div>
      )}
    </div>
  );
}
