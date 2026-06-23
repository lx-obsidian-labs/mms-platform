"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { replyToSupportTicket } from "@/lib/actions";

export function AdminTicketReplyForm({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, form: FormData) => {
      form.set("ticketId", ticketId);
      const result = await replyToSupportTicket(form);
      if (!result.success) return { error: result.error ?? "Failed to send reply" };
      router.refresh();
      return null;
    },
    null
  );

  return (
    <div className="rounded-xl border border-white/5 bg-surface p-5">
      <h3 className="mb-3 font-heading text-sm font-bold text-off-white">Staff Reply</h3>
      {state?.error && (
        <div className="mb-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
          {state.error}
        </div>
      )}
      <form action={formAction} className="space-y-3">
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Type your reply..."
          className="w-full resize-y rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm text-off-white placeholder:text-muted-foreground/50 focus:border-gold/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-gold px-5 text-xs font-bold text-industrial-black transition-all hover:bg-gold-light disabled:opacity-50"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Send size={14} />}
          {pending ? "Sending..." : "Send Reply"}
        </button>
      </form>
    </div>
  );
}
