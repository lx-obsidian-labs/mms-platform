"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { updateTicketStatus } from "@/lib/actions";

export function AdminTicketActions({ ticketId, currentStatus }: { ticketId: string; currentStatus: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, form: FormData) => {
      const ticketId = form.get("ticketId") as string;
      const status = form.get("status") as string;
      const result = await updateTicketStatus(ticketId, status);
      if (!result.success) return { error: result.error ?? "Failed" };
      router.refresh();
      return null;
    },
    null
  );

  const statuses = ["open", "in_progress", "resolved", "closed"];

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((s) => (
        <form key={s} action={formAction}>
          <input type="hidden" name="ticketId" value={ticketId} />
          <input type="hidden" name="status" value={s} />
          <button
            type="submit"
            disabled={pending || s === currentStatus}
            className={cn(
              "rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors",
              s === currentStatus
                ? "bg-gold/10 text-gold cursor-default"
                : "border border-white/10 text-muted-foreground hover:border-gold/30 hover:text-off-white"
            )}
          >
            {s.replace("_", " ")}
          </button>
        </form>
      ))}
      {state?.error && <p className="w-full text-xs text-red-400">{state.error}</p>}
    </div>
  );
}
