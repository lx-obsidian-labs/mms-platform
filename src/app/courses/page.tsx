import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { CtaSection } from "@/components/sections/cta";
import { ALL_COURSES, COURSE_CATEGORIES, COMPANY } from "@/lib/constants";
import { Download } from "lucide-react";
import { CoursesGrid } from "./courses-grid";

export const metadata: Metadata = {
  title: "Training Programs",
  description:
    "Browse all 17 mining and machinery training programs at Mpumalanga Mining Solutions. From forklift operation to mobile crane certification — industry-aligned courses for your mining career.",
  keywords: [
    "mining courses",
    "machinery training",
    "excavator training",
    "forklift certification",
    "mobile crane training",
    "SHE representative",
    "mining training South Africa",
    "heavy machinery courses",
  ],
  openGraph: {
    title: `Training Programs | ${COMPANY.name}`,
    description:
      "Explore 17 industry-aligned training programs at MMS — heavy machinery, safety compliance, and mining operations certification.",
  },
};

export default function CoursesPage() {
  return (
    <>
      <Header />

      <main>
        <PageHeader
          title="TRAINING PROGRAMS"
          subtitle="17 industry-aligned courses designed to prepare you for a successful career in South Africa's mining and industrial sectors."
        />

        <section className="bg-industrial-black py-[var(--section-padding)]">
          <Container>
            <div className="mb-8 flex items-center justify-between rounded-lg border border-gold/20 bg-gold/5 p-4">
              <div>
                <p className="font-heading text-sm font-bold text-off-white">Need a paper registration form?</p>
                <p className="mt-1 text-xs text-muted-foreground">Download and print our form to submit via email or in person.</p>
              </div>
              <Link
                href="/api/registration-form/download"
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-xs font-bold text-industrial-black transition-all hover:bg-gold-light"
              >
                <Download size={16} />
                Download Form
              </Link>
            </div>
            <CoursesGrid courses={ALL_COURSES} categories={COURSE_CATEGORIES} />
          </Container>
        </section>

        <CtaSection />
      </main>

      <Footer />
    </>
  );
}
