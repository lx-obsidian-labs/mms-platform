import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FileText, Download, Eye } from "lucide-react";
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

  const { data: certificates } = await supabase
    .from("certificates")
    .select("*, enrollments!inner(courses(title))")
    .eq("enrollments.student_id", student?.id ?? "")
    .order("issued_at", { ascending: false });

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-xl font-bold text-off-white">Document Center</h1>

      {/* Uploaded Documents */}
      <section>
        <h2 className="mb-3 font-heading text-sm font-bold text-off-white">My Documents</h2>
        {(!documents || documents.length === 0) ? (
          <div className="rounded-xl border border-white/5 bg-surface p-8 text-center">
            <FileText className="mx-auto mb-3 size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-surface p-4">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 shrink-0 text-gold" />
                  <div>
                    <p className="text-sm font-medium text-off-white">{doc.file_name}</p>
                    <p className="text-xs text-muted-foreground">{doc.document_type.replace(/_/g, " ")}</p>
                  </div>
                </div>
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-off-white transition-colors hover:border-gold/30"
                >
                  <Eye size={14} />
                  View
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Invoices & Receipts */}
      <section>
        <h2 className="mb-3 font-heading text-sm font-bold text-off-white">Payments & Invoices</h2>
        {(!payments || payments.length === 0) ? (
          <div className="rounded-xl border border-white/5 bg-surface p-8 text-center">
            <p className="text-sm text-muted-foreground">No payment records yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-surface p-4">
                <div>
                  <p className="text-sm font-medium text-off-white">
                    R{Number(payment.amount).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(payment.created_at).toLocaleDateString()} · {payment.reference ?? "No reference"}
                  </p>
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
