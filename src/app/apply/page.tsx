import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { CtaSection } from "@/components/sections/cta";
import { COMPANY } from "@/lib/constants";
import { Download } from "lucide-react";
import { EnrollmentForm } from "./enrollment-form";

export const metadata: Metadata = {
  title: "Apply Now",
  description:
    "Apply online to Mpumalanga Mining Solutions. Complete our 7-step enrollment form to register for mining and machinery training programs.",
  openGraph: {
    title: `Apply Now | ${COMPANY.name}`,
    description:
      "Start your mining career — apply online for industry-recognized training at MMS.",
  },
};

export default function ApplyPage() {
  return (
    <>
      <Header />

      <main>
        <PageHeader
          title="APPLY NOW"
          subtitle="Complete the form below to submit your application. Our admissions team will review and respond within 24 hours."
          image="/images/backgrounds/about-hero.jpg"
        />

        <section className="bg-industrial-black py-[var(--section-padding)]">
          <Container size="narrow">
            <div className="mb-8 flex items-center justify-between rounded-lg border border-gold/20 bg-gold/5 p-4">
              <div>
                <p className="font-heading text-sm font-bold text-off-white">Prefer to submit a paper form?</p>
                <p className="mt-1 text-xs text-muted-foreground">Download and print our registration form, then submit it via email or in person.</p>
              </div>
              <Link
                href="/api/registration-form/download"
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-xs font-bold text-industrial-black transition-all hover:bg-gold-light"
              >
                <Download size={16} />
                Download Form
              </Link>
            </div>
          </Container>
          <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading application form...</div>}>
            <EnrollmentForm />
          </Suspense>
        </section>

        <CtaSection />
      </main>

      <Footer />
    </>
  );
}
