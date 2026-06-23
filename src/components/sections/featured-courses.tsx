"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Truck, Shield, Mountain, Layers, ArrowRight, Clock, Award, HeartPulse } from "lucide-react";
import { FEATURED_COURSES } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";
import { Container } from "@/components/shared/container";
import { cn, formatCurrency, getOriginalPrice } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Truck,
  Shield,
  Mountain,
  Layers,
  HeartPulse,
  Forklift: Truck,
  Flame: Shield,
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export function FeaturedCoursesSection() {
  return (
    <section className="relative bg-surface py-[var(--section-padding)]" aria-label="Featured Courses" id="courses">
      {/* Subtle top border accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" aria-hidden="true" />

      <Container>
        <SectionHeading
          title="Our Training Programs"
          subtitle="Industry-aligned courses designed to prepare you for a successful career in South Africa's mining sector."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 sm:grid-cols-2"
        >
          {FEATURED_COURSES.map((course) => {
            const Icon = iconMap[course.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={course.id}
                variants={cardVariants}
                className={cn(
                  "group relative flex flex-col rounded-xl border border-white/5 bg-industrial-black p-6 lg:p-8",
                  "transition-all duration-300 hover:border-gold/15",
                  "hover:shadow-[0_8px_40px_rgba(217,164,0,0.06)]"
                )}
              >
                {/* Image */}
                <div className="relative mb-5 h-44 overflow-hidden rounded-lg">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gold/90 text-black shadow-lg">
                    {Icon && <Icon size={20} />}
                  </div>
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#E53935]/90 px-2.5 py-1 text-[10px] font-bold text-white uppercase backdrop-blur-sm">
                    Sale
                  </span>
                  {course.certification && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-gold backdrop-blur-sm">
                      <Award size={12} />
                      Certified
                    </span>
                  )}
                </div>

                {/* Content */}
                <h3 className="mb-2 font-heading text-xl font-bold text-off-white">
                  {course.title}
                </h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {course.shortDescription}
                </p>

                {/* Meta */}
                <div className="mb-6 flex flex-wrap items-center gap-4 text-xs text-silver">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={14} className="text-gold" />
                    {course.durationWeeks} weeks
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    {course.durationHours} hours
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-0.5">
                    {course.level}
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-muted-foreground line-through">
                      {formatCurrency(getOriginalPrice(course.price))}
                    </span>
                    <span className="font-heading text-lg font-bold text-[#E53935]">
                      {formatCurrency(course.price)}
                    </span>
                  </div>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-off-white transition-colors hover:text-gold"
                  >
                    Learn More
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All Link */}
        <div className="mt-12 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-gold-light"
          >
            View All Training Programs
            <ArrowRight size={16} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
