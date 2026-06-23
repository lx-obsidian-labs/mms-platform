import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Award, Download, ExternalLink, Shield, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Certificates",
  robots: { index: false, follow: false },
};

export default async function PortalCertificatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!student) return <EmptyState />;

  const { data: certificates } = await supabase
    .from("certificates")
    .select("*, enrollments!inner(courses(title))")
    .eq("enrollments.student_id", student.id)
    .order("issued_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold text-off-white">My Certificates</h1>
        {certificates && certificates.length > 0 && (
          <span className="text-xs text-muted-foreground">{certificates.length} issued</span>
        )}
      </div>

      {(!certificates || certificates.length === 0) ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="group rounded-xl border border-white/5 bg-surface p-5 transition-all hover:border-gold/20"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold/20 to-gold/5">
                  <Award className="size-6 text-gold" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-sm font-bold text-off-white group-hover:text-gold">
                    {(cert.enrollments as Record<string, unknown>)?.courses as string ?? "Certificate"}
                  </h3>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {cert.certificate_number}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Shield size={10} />
                      Issued {new Date(cert.issued_at).toLocaleDateString()}
                    </span>
                    {cert.expires_at && (
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <CheckCircle size={10} />
                        Expires {new Date(cert.expires_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    "mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium uppercase",
                    cert.status === "issued" ? "bg-green-500/10 text-green-400" :
                    cert.status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                    "bg-red-500/10 text-red-400"
                  )}>
                    {cert.status}
                  </span>
                </div>
              </div>
              {cert.pdf_url && (
                <div className="mt-4 flex gap-2 border-t border-white/5 pt-3">
                  <a
                    href={cert.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-off-white transition-colors hover:border-gold/30 hover:text-gold"
                  >
                    <Download size={14} />
                    Download
                  </a>
                  <a
                    href={`/verify-certificate?code=${cert.certificate_number}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-off-white transition-colors hover:border-gold/30 hover:text-gold"
                  >
                    <ExternalLink size={14} />
                    Verify
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-white/5 bg-surface p-12 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-gold/10">
        <Award className="size-7 text-gold" />
      </div>
      <h2 className="font-heading text-lg font-bold text-off-white">No Certificates Yet</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Complete a course to earn your certificate.
      </p>
    </div>
  );
}
