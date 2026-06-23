"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { issueCertificate } from "@/lib/actions";

export function CertActions({ enrollmentId, pdfUrl }: { enrollmentId: string; pdfUrl: string | null }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null) => {
      const result = await issueCertificate(enrollmentId);
      if (result.success) {
        router.refresh();
        return { success: true };
      }
      return { error: result.error ?? "Failed" };
    },
    null
  );

  return (
    <div className="flex gap-2">
      {pdfUrl && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-white/10 px-3 py-1 text-[11px] text-off-white transition-colors hover:border-gold/30"
        >
          View PDF
        </a>
      )}
      {!pdfUrl && (
        <form action={formAction}>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg border border-white/10 px-3 py-1 text-[11px] text-off-white transition-colors hover:border-gold/30 disabled:opacity-50"
          >
            {pending ? <Loader2 className="size-3 animate-spin" /> : "Issue"}
          </button>
        </form>
      )}
      {state?.error && <p className="text-xs text-red-400">{state.error}</p>}
    </div>
  );
}
