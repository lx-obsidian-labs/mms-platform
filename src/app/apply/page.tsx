import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/shared/page-header";
import { CtaSection } from "@/components/sections/cta";
import { COMPANY } from "@/lib/constants";
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
        />

        <section className="bg-industrial-black py-[var(--section-padding)]">
          <EnrollmentForm />
        </section>

        <CtaSection />
      </main>

      <Footer />
    </>
  );
}
