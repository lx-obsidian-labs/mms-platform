import type { Metadata } from "next";
import { Shield, Award, Scale, Lightbulb, Heart, Users, Target, Eye, BookOpen, GraduationCap } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaSection } from "@/components/sections/cta";
import {
  COMPANY,
  MISSION,
  VISION,
  CORE_VALUES,
  TRAINING_PHILOSOPHY,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Mpumalanga Mining Solutions — our mission, vision, core values, and commitment to delivering world-class mining and machinery training in South Africa.",
  openGraph: {
    title: `About Us | ${COMPANY.name}`,
    description:
      "Discover how MMS is building the future of mining training in South Africa through excellence, innovation, and industry-aligned education.",
  },
};

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Shield, Award, Scale, Lightbulb, Heart, Users,
};

const philosophyIcons = {
  BookOpen,
  Target: GraduationCap,
};

export default function AboutPage() {
  return (
    <>
      <Header />

      <main>
        <PageHeader
          title="ABOUT MMS"
          subtitle="Building the future of mining through excellence in training, innovation in education, and an unwavering commitment to student success."
        />

        {/* Mission & Vision */}
        <section className="bg-industrial-black py-[var(--section-padding)]">
          <Container>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Mission */}
              <div className="rounded-xl border border-white/5 bg-surface p-8 lg:p-10">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10">
                  <Target size={28} className="text-gold" />
                </div>
                <h2 className="mb-4 font-heading text-2xl font-bold text-off-white lg:text-3xl">
                  Our Mission
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {MISSION}
                </p>
              </div>

              {/* Vision */}
              <div className="rounded-xl border border-white/5 bg-surface p-8 lg:p-10">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10">
                  <Eye size={28} className="text-gold" />
                </div>
                <h2 className="mb-4 font-heading text-2xl font-bold text-off-white lg:text-3xl">
                  Our Vision
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {VISION}
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Core Values */}
        <section className="bg-surface py-[var(--section-padding)]">
          <Container>
            <SectionHeading
              title="Our Core Values"
              subtitle="The principles that guide everything we do at Mpumalanga Mining Solutions."
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {CORE_VALUES.map((value) => {
                const Icon = iconMap[value.icon];
                return (
                  <div
                    key={value.title}
                    className="group rounded-xl border border-white/5 bg-industrial-black p-6 transition-all duration-300 hover:border-gold/15 hover:shadow-[0_8px_40px_rgba(217,164,0,0.06)]"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 text-gold transition-colors group-hover:bg-gold/15">
                      {Icon && <Icon size={24} />}
                    </div>
                    <h3 className="mb-2 font-heading text-lg font-bold text-off-white">
                      {value.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Training Philosophy */}
        <section className="bg-industrial-black py-[var(--section-padding)]">
          <Container>
            <SectionHeading
              title="Our Training Philosophy"
              subtitle="How we prepare students for real-world success in the mining and industrial sectors."
            />

            <div className="grid gap-6 sm:grid-cols-2">
              {TRAINING_PHILOSOPHY.map((item, i) => (
                <div
                  key={item.title}
                  className="flex gap-5 rounded-xl border border-white/5 bg-surface p-6 lg:p-8"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold text-lg font-bold text-industrial-black">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="mb-2 font-heading text-lg font-bold text-off-white">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Company Overview / Stats */}
        <section className="bg-surface py-[var(--section-padding)]">
          <Container size="narrow">
            <div className="prose-custom">
              <h2 className="mb-6 text-center font-heading text-2xl font-bold text-off-white lg:text-3xl">
                About Mpumalanga Mining Solutions
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  Mpumalanga Mining Solutions (MMS) is a digital-first mining and heavy machinery
                  training institution based in Middelburg, Mpumalanga — the heart of South
                  Africa&apos;s coal and mining belt.
                </p>
                <p>
                  Founded with the mission to make high-quality mining training accessible to all
                  South Africans, MMS offers <strong className="text-off-white">17 industry-aligned training programs</strong> spanning
                  heavy machinery operation, safety compliance, and industrial skills development.
                </p>
                <p>
                  Our training programs are designed in consultation with mining industry experts
                  and aligned with the Mining Qualifications Authority (MQA) standards. Every course
                  combines rigorous theoretical learning with extensive hands-on practical training
                  using real machinery and simulated mining environments.
                </p>
                <p>
                  As a digital-first institution, MMS leverages modern technology — including an
                  online student portal, AI-powered learning assistant, and digital certification —
                  to deliver world-class training experiences even to students in remote locations.
                </p>
                <p>
                  Our graduates work at leading mining companies, construction firms, and industrial
                  operations across South Africa, and our alumni network continues to grow as we
                  expand toward national recognition.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Leadership */}
        <section className="bg-industrial-black py-[var(--section-padding)]">
          <Container>
            <SectionHeading
              title="Leadership"
              subtitle="Meet the team driving MMS toward national excellence."
            />

            <div className="mx-auto max-w-md">
              <div className="rounded-xl border border-white/5 bg-surface p-8 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gold/10">
                  <Users size={32} className="text-gold" />
                </div>
                <h3 className="font-heading text-xl font-bold text-off-white">
                  Mr SN Vilane
                </h3>
                <p className="mt-1 text-sm font-medium text-gold">
                  Founder &amp; Lead Instructor
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  With over a decade of experience in mining operations and machinery training,
                  Mr Vilane leads MMS with a commitment to student success, safety excellence,
                  and operational integrity.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <CtaSection />
      </main>

      <Footer />
    </>
  );
}
