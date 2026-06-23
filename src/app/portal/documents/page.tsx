import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FileText, Eye, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Documents",
  robots: { index: false, follow: false },
};

export default async function PortalDocumentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("student_id", student?.id ?? "")
    .order("created_at", { ascending: false });

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("student_id", student?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold text-off-white">Document Center</h1>
      </div>

      {/* Uploaded Documents */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <FileText className="size-4 text-gold" />
          <h2 className="font-heading text-sm font-bold text-off-white">My Documents</h2>
        </div>
        {(!documents || documents.length === 0) ? (
          <div className="rounded-xl border border-white/5 bg-surface p-8 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-gold/10">
              <FileText className="size-6 text-gold/60" />
            </div>
            <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Documents you upload during enrollment will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="group flex items-center justify-between rounded-xl border border-white/5 bg-surface p-4 transition-all hover:border-gold/20"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                    <FileText className="size-5 text-gold" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-off-white group-hover:text-gold">
                      {doc.file_name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {doc.document_type.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-off-white transition-colors hover:border-gold/30 hover:text-gold"
                >
                  <Eye size={14} />
                  View
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Payments & Invoices */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <CreditCard className="size-4 text-gold" />
          <h2 className="font-heading text-sm font-bold text-off-white">Payments & Invoices</h2>
        </div>
        {(!payments || payments.length === 0) ? (
          <div className="rounded-xl border border-white/5 bg-surface p-8 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-gold/10">
              <FileText className="size-6 text-gold/60" />
            </div>
            <p className="text-sm text-muted-foreground">No payment records yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-surface p-4 transition-all hover:border-gold/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-gold/10">
                    <FileText className="size-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-off-white">
                      R{Number(payment.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.created_at).toLocaleDateString(undefined, {
                        year: "numeric", month: "short", day: "numeric"
                      })}
                      {payment.reference ? ` · ${payment.reference}` : ""}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-medium",
                  payment.status === "paid" ? "bg-green-500/10 text-green-400" :
                  payment.status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                  "bg-red-500/10 text-red-400"
                )}>
                  {payment.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
