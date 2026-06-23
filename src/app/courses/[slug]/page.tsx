import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Award, Users, CheckCircle, BookOpen, HardHat, Calendar } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/shared/container";
import { CtaSection } from "@/components/sections/cta";
import { ALL_COURSES, COMPANY } from "@/lib/constants";
import { formatCurrency, getOriginalPrice } from "@/lib/utils";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_COURSES.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = ALL_COURSES.find((c) => c.slug === slug);
  if (!course) return { title: "Course Not Found" };

  return {
    title: course.title,
    description: course.description,
    keywords: [
      course.title.toLowerCase(),
      `${course.title.toLowerCase()} course`,
      `${course.title.toLowerCase()} training south africa`,
      "mining training",
      "machinery certification",
    ],
    openGraph: {
      title: `${course.title} | ${COMPANY.name}`,
      description: course.shortDescription,
    },
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = ALL_COURSES.find((c) => c.slug === slug);
  if (!course) notFound();

  const relatedCourses = ALL_COURSES.filter(
    (c) => c.category === course.category && c.id !== course.id
  ).slice(0, 3);

  return (
    <>
      <Header />

      <main>
        {/* Course Hero */}
        <section className="relative overflow-hidden bg-surface py-20 pt-28 md:py-28 md:pt-36 lg:py-32 lg:pt-40">
          <div
            className="absolute inset-0 opacity-[0.03]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/20 to-transparent" aria-hidden="true" />

          <Container className="relative">
            {/* Breadcrumb */}
            <Link
              href="/courses"
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold"
            >
              <ArrowLeft size={14} />
              All Training Programs
            </Link>

            <div className="mb-8 overflow-hidden rounded-xl">
              <div className="relative h-52 sm:h-64 lg:h-80">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
              {/* Left - Course Info */}
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                    {course.category}
                  </span>
                  {course.certification && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
                      <Award size={12} />
                      Industry Certified
                    </span>
                  )}
                </div>

                <h1 className="font-display text-4xl tracking-wide text-off-white sm:text-5xl lg:text-6xl">
                  {course.title.toUpperCase()}
                </h1>

                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  {course.description}
                </p>

                {/* Quick Meta */}
                <div className="mt-8 flex flex-wrap gap-6 text-sm text-silver">
                  <span className="inline-flex items-center gap-2">
                    <Clock size={16} className="text-gold" />
                    {course.durationWeeks} weeks ({course.durationHours} hours)
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Users size={16} className="text-gold" />
                    {course.level}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <BookOpen size={16} className="text-gold" />
                    Theory + Practical
                  </span>
                </div>
              </div>

              {/* Right - Pricing Card */}
              <div className="rounded-xl border border-white/5 bg-industrial-black p-6 lg:p-8">
                <p className="text-xs font-medium text-muted-foreground">Limited-Time Offer</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg text-muted-foreground line-through">
                    {formatCurrency(getOriginalPrice(course.price))}
                  </span>
                  <span className="text-xs text-muted-foreground">was</span>
                </div>
                <p className="font-display text-4xl text-[#E53935]">
                  {formatCurrency(course.price)}
                </p>
                <p className="mt-1 text-xs text-red-400/70">
                  Save {formatCurrency(getOriginalPrice(course.price) - course.price)} — limited spots available
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Payment plans available
                </p>

                <div className="my-6 h-px bg-white/5" />

                <ul className="space-y-3 text-sm text-silver">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="shrink-0 text-gold" />
                    Industry-recognized certificate
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="shrink-0 text-gold" />
                    Online &amp; on-site training
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="shrink-0 text-gold" />
                    Expert instructor guidance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="shrink-0 text-gold" />
                    Student portal access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="shrink-0 text-gold" />
                    Career placement support
                  </li>
                </ul>

                <Link
                  href={`/apply?course=${course.slug}`}
                  className="mt-8 flex h-12 items-center justify-center rounded-lg bg-gold text-sm font-bold text-industrial-black transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(217,164,0,0.3)]"
                >
                  Apply for This Course
                </Link>

                <Link
                  href="/contact"
                  className="mt-3 flex h-11 items-center justify-center rounded-lg border border-white/10 text-sm font-medium text-off-white transition-all hover:border-gold/30"
                >
                  Contact Admissions
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Course Outcomes */}
        <section className="bg-industrial-black py-[var(--section-padding)]">
          <Container size="narrow">
            <h2 className="mb-8 font-heading text-2xl font-bold text-off-white lg:text-3xl">
              What You&apos;ll Learn
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {course.outcomes.map((outcome) => (
                <div
                  key={outcome}
                  className="flex gap-3 rounded-lg border border-white/5 bg-surface p-4"
                >
                  <CheckCircle size={18} className="mt-0.5 shrink-0 text-gold" />
                  <p className="text-sm text-muted-foreground">{outcome}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Prerequisites */}
        <section className="bg-surface py-[var(--section-padding)]">
          <Container size="narrow">
            <h2 className="mb-8 font-heading text-2xl font-bold text-off-white lg:text-3xl">
              Entry Requirements
            </h2>
            <div className="rounded-xl border border-white/5 bg-industrial-black p-6 lg:p-8">
              <ul className="space-y-4">
                {course.prerequisites.map((req) => (
                  <li key={req} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <HardHat size={16} className="mt-0.5 shrink-0 text-gold" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* Training Process */}
        <section className="bg-industrial-black py-[var(--section-padding)]">
          <Container size="narrow">
            <h2 className="mb-8 font-heading text-2xl font-bold text-off-white lg:text-3xl">
              Training Process
            </h2>
            <div className="space-y-4">
              {[
                { step: "01", title: "Apply & Enroll", desc: "Submit your application online and choose this course. Our admissions team will review and confirm your enrollment." },
                { step: "02", title: "Theory Learning", desc: "Access structured learning materials through our student portal. Study at your own pace with instructor support." },
                { step: "03", title: "Practical Training", desc: "Attend hands-on training sessions with real machinery at our Middelburg facility under expert supervision." },
                { step: "04", title: "Assessment", desc: "Complete written and practical assessments to demonstrate competency in all required areas." },
                { step: "05", title: "Certification", desc: "Upon successful completion, receive your industry-recognized certificate and join the MMS alumni network." },
              ].map((step) => (
                <div
                  key={step.step}
                  className="flex gap-5 rounded-xl border border-white/5 bg-surface p-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-sm font-bold text-gold">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-bold text-off-white">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <section className="bg-surface py-[var(--section-padding)]">
            <Container>
              <h2 className="mb-8 font-heading text-2xl font-bold text-off-white lg:text-3xl">
                Related Training Programs
              </h2>
              <div className="grid gap-6 sm:grid-cols-3">
                {relatedCourses.map((rc) => (
                  <Link
                    key={rc.id}
                    href={`/courses/${rc.slug}`}
                    className="group rounded-xl border border-white/5 bg-industrial-black transition-all hover:border-gold/15 overflow-hidden"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <Image
                        src={rc.image}
                        alt={rc.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-industrial-black via-transparent to-transparent" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-base font-bold text-off-white group-hover:text-gold transition-colors">
                        {rc.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">{rc.shortDescription}</p>
                      <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="text-xs text-muted-foreground line-through">
                          {formatCurrency(getOriginalPrice(rc.price))}
                        </span>
                        <span className="text-sm font-bold text-[#E53935]">
                          {formatCurrency(rc.price)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{rc.durationWeeks} weeks</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        )}

        <CtaSection />
      </main>

      <Footer />
    </>
  );
}
