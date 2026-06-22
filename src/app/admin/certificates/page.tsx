import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Award, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Certificate Management",
  robots: { index: false, follow: false },
};

export default async function AdminCertificatesPage() {
  const supabase = await createClient();

  const [certificatesResult] = await Promise.all([
    supabase
      .from("certificates")
      .select("*, enrollments!inner(courses(title), students!inner(profiles!inner(first_name, last_name)))")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const { data: certificates } = certificatesResult;
  const issuedStats = await supabase.from("certificates").select("*", { count: "exact", head: true });
  const pendingStats = await supabase.from("certificates").select("*", { count: "exact", head: true }).eq("status", "pending");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-xl font-bold text-off-white">Certificate Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Issue, manage, and verify student certificates.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-white/5 bg-surface p-4">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="mt-1 font-heading text-2xl font-bold text-off-white">{certificates?.length ?? 0}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-surface p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="size-4 text-green-400" />
            <p className="text-xs text-muted-foreground">Issued</p>
          </div>
          <p className="mt-1 font-heading text-2xl font-bold text-green-400">{issuedStats.count ?? 0}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-surface p-4">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-yellow-400" />
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <p className="mt-1 font-heading text-2xl font-bold text-yellow-400">{pendingStats.count ?? 0}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-surface p-4">
          <div className="flex items-center gap-2">
            <XCircle className="size-4 text-red-400" />
            <p className="text-xs text-muted-foreground">Revoked</p>
          </div>
          <p className="mt-1 font-heading text-2xl font-bold text-red-400">0</p>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="overflow-x-auto rounded-xl border border-white/5 bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Certificate #</th>
              <th className="px-4 py-3 font-medium">Student</th>
              <th className="px-4 py-3 font-medium">Course</th>
              <th className="px-4 py-3 font-medium">Issued</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(!certificates || certificates.length === 0) ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  <Award className="mx-auto mb-2 size-6" />
                  No certificates found
                </td>
              </tr>
            ) : (
              certificates.map((cert) => {
                const enrollment = cert.enrollments as Record<string, unknown>;
                const course = enrollment?.courses as Record<string, unknown> ?? {};
                const student = enrollment?.students as Record<string, unknown> ?? {};
                const profile = student?.profiles as Record<string, unknown> ?? {};
                return (
                  <tr key={cert.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                    <td className="px-4 py-3 font-medium text-gold">{cert.certificate_number}</td>
                    <td className="px-4 py-3 text-off-white">
                      {String(profile.first_name ?? "")} {String(profile.last_name ?? "")}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {String(course.title ?? "")}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(cert.issued_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-medium",
                        cert.status === "issued" ? "bg-green-500/10 text-green-400" :
                        cert.status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-red-500/10 text-red-400"
                      )}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {cert.pdf_url && (
                          <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/10 px-3 py-1 text-[11px] text-off-white transition-colors hover:border-gold/30">
                            View PDF
                          </a>
                        )}
                        <button className="rounded-lg border border-white/10 px-3 py-1 text-[11px] text-off-white transition-colors hover:border-gold/30">
                          Issue
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
