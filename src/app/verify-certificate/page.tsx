import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Award, Shield, Search, XCircle, CheckCircle } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Certificate Verification",
  description: `Verify ${COMPANY.name} certificates online. Enter your certificate number to validate.`,
};

interface CertData {
  certificate_number: string;
  student_name: string;
  course_name: string;
  issued_at: string;
  status: string;
}

export default async function VerifyCertificatePage(props: { searchParams: Promise<{ code?: string }> }) {
  const searchParams = await props.searchParams;
  const code = searchParams.code;
  let certData: CertData | null = null;

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("certificates")
      .select("certificate_number, issued_at, status, enrollments!inner(courses(title), students!inner(profiles!inner(first_name, last_name)))")
      .eq("certificate_number", code)
      .single();

    if (data) {
      const enrollment = (data as Record<string, unknown>)?.enrollments as Record<string, unknown> ?? {};
      const course = enrollment?.courses as Record<string, unknown> ?? {};
      const student = enrollment?.students as Record<string, unknown> ?? {};
      const profile = student?.profiles as Record<string, unknown> ?? {};

      certData = {
        certificate_number: String((data as Record<string, unknown>)?.certificate_number ?? ""),
        student_name: `${String(profile?.first_name ?? "")} ${String(profile?.last_name ?? "")}`.trim(),
        course_name: String(course?.title ?? ""),
        issued_at: new Date(String((data as Record<string, unknown>)?.issued_at ?? "")).toLocaleDateString(),
        status: String((data as Record<string, unknown>)?.status ?? ""),
      };
    }
  }

  return (
    <>
      <Header />
      <main className="relative min-h-screen bg-industrial-black pt-24">
        <div className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.07]" style={{ backgroundImage: "url(/images/backgrounds/verify-hero.jpg)" }} aria-hidden="true" />
        <Container size="narrow" className="py-16">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
              <Shield className="size-7 text-gold" />
            </div>
            <h1 className="font-display text-4xl tracking-wide text-off-white sm:text-5xl">
              CERTIFICATE VERIFICATION
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Verify the authenticity of certificates issued by {COMPANY.name}. Enter the certificate number to validate.
            </p>
          </div>

          <form className="mx-auto mt-10 flex max-w-md gap-3">
            <input
              type="text"
              name="code"
              defaultValue={code ?? ""}
              placeholder="Enter certificate number (e.g. MMS-CERT-2026-000001)"
              className="h-12 flex-1 rounded-lg border border-white/10 bg-surface px-4 text-sm text-off-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-gold px-6 font-bold text-industrial-black transition-all hover:bg-gold-light"
            >
              <Search size={16} />
              Verify
            </button>
          </form>

          {code && certData ? (
            <div className="mx-auto mt-10 max-w-lg">
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle className="size-5 text-green-400" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-green-400">Certificate Verified</h2>
                    <p className="text-xs text-muted-foreground">This certificate is authentic and valid.</p>
                  </div>
                </div>
                <div className="space-y-2 rounded-lg bg-industrial-black p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Certificate</span>
                    <span className="font-medium text-gold">{certData.certificate_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Student</span>
                    <span className="font-medium text-off-white">{certData.student_name || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Course</span>
                    <span className="font-medium text-off-white">{certData.course_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issue Date</span>
                    <span className="font-medium text-off-white">{certData.issued_at}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium capitalize text-green-400">{certData.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : code && !certData ? (
            <div className="mx-auto mt-10 max-w-lg">
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
                <XCircle className="mx-auto mb-3 size-8 text-red-400" />
                <h2 className="font-heading text-lg font-bold text-red-400">Certificate Not Found</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  No certificate matches the number you entered. Please check the number and try again.
                </p>
              </div>
            </div>
          ) : null}

          <div className="mx-auto mt-16 max-w-md rounded-lg border border-white/5 bg-surface p-4 text-center">
            <Shield className="mx-auto mb-2 size-5 text-gold" />
            <p className="text-xs text-muted-foreground">
              All MMS certificates are digitally verifiable. This verification system ensures the authenticity and integrity of every certificate issued by {COMPANY.name}.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
