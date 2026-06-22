import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero";
import { BenefitsSection } from "@/components/sections/benefits";
import { FeaturedCoursesSection } from "@/components/sections/featured-courses";
import { LearningExperienceSection } from "@/components/sections/learning-experience";
import { StudentJourneySection } from "@/components/sections/student-journey";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { FaqSection } from "@/components/sections/faq";
import { CtaSection } from "@/components/sections/cta";
import { COMPANY } from "@/lib/constants";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: COMPANY.name,
  description: COMPANY.description,
  url: process.env.NEXT_PUBLIC_APP_URL || "https://mpumalangaminingsolutions.co.za",
  email: COMPANY.email,
  telephone: COMPANY.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Middelburg",
    addressRegion: "Mpumalanga",
    addressCountry: "ZA",
  },
  slogan: COMPANY.tagline,
  sameAs: [],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <Header />

      <main>
        <HeroSection />
        <BenefitsSection />
        <FeaturedCoursesSection />
        <LearningExperienceSection />
        <StudentJourneySection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>

      <Footer />
    </>
  );
}
