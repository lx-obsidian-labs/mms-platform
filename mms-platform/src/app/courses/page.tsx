import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { CtaSection } from "@/components/sections/cta";
import { ALL_COURSES, COURSE_CATEGORIES, COMPANY } from "@/lib/constants";
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
            <CoursesGrid courses={ALL_COURSES} categories={COURSE_CATEGORIES} />
          </Container>
        </section>

        <CtaSection />
      </main>

      <Footer />
    </>
  );
}
