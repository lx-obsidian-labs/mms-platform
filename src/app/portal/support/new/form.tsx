"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { createSupportTicket } from "@/lib/actions";

export function NewTicketForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, form: FormData) => {
      const result = await createSupportTicket(form);
      if (!result.success) return { error: result.error ?? "Failed to create ticket" };
      return null;
    },
    null
  );

  useEffect(() => {
    if (state === null && !pending) {
      router.push("/portal/support");
      router.refresh();
    }
  }, [state, pending, router]);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          placeholder="Brief description of your issue"
          className="h-11 w-full rounded-lg border border-white/10 bg-surface px-4 text-sm text-off-white placeholder:text-muted-foreground/50 focus:border-gold/50 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="priority" className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          className="h-11 w-full rounded-lg border border-white/10 bg-surface px-4 text-sm text-off-white focus:border-gold/50 focus:outline-none"
        >
          <option value="low">Low</option>
          <option value="normal" selected>Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={8}
          placeholder="Describe your issue in detail..."
          className="w-full resize-y rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm text-off-white placeholder:text-muted-foreground/50 focus:border-gold/50 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center gap-2 rounded-lg bg-gold px-6 font-bold text-industrial-black transition-all hover:bg-gold-light disabled:opacity-50"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Send size={16} />}
        {pending ? "Submitting..." : "Submit Ticket"}
      </button>
    </form>
  );
}
