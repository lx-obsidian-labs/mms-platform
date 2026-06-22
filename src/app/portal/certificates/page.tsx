import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Award, Download, ExternalLink } from "lucide-react";
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

  if (!student) {
    return <EmptyState />;
  }

  const { data: certificates } = await supabase
    .from("certificates")
    .select("*, enrollments!inner(courses(title))")
    .eq("enrollments.student_id", student.id)
    .order("issued_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-xl font-bold text-off-white">My Certificates</h1>

      {(!certificates || certificates.length === 0) ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-surface p-5 transition-all hover:border-gold/20"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-gold/10">
                  <Award className="size-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-off-white">
                    {(cert.enrollments as Record<string, unknown>)?.courses as string ?? "Certificate"}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {cert.certificate_number}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Issued: {new Date(cert.issued_at).toLocaleDateString()}
                    {cert.expires_at ? ` · Expires: ${new Date(cert.expires_at).toLocaleDateString()}` : ""}
                  </p>
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
              <div className="flex gap-2">
                {cert.pdf_url && (
                  <>
                    <a
                      href={cert.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-off-white transition-colors hover:border-gold/30"
                    >
                      <Download size={14} />
                      Download
                    </a>
                    <a
                      href={`/verify-certificate?code=${cert.certificate_number}`}
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-off-white transition-colors hover:border-gold/30"
                    >
                      <ExternalLink size={14} />
                      Verify
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <Award className="mx-auto mb-4 size-12 text-muted-foreground" />
        <h2 className="font-heading text-xl font-bold text-off-white">No Certificates Yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">Certificates will appear here once you complete a course.</p>
      </div>
    </div>
  );
}
