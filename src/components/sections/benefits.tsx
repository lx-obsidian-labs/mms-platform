"use client";

import { motion, type Variants } from "framer-motion";
import { Award, Wrench, Users, Clock } from "lucide-react";
import { BENEFITS } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

const iconMap = {
  Award,
  Wrench,
  Users,
  Clock,
} as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export function BenefitsSection() {
  return (
    <section className="relative bg-industrial-black py-[var(--section-padding)]" aria-label="Benefits">
      <Container>
        <SectionHeading
          title="Why Choose MMS"
          subtitle="We don't just train — we build careers. Here's what sets Mpumalanga Mining Solutions apart from the rest."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {BENEFITS.map((benefit) => {
            const Icon = iconMap[benefit.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={benefit.title}
                variants={cardVariants}
                className={cn(
                  "group relative rounded-xl border border-white/5 bg-surface p-6",
                  "transition-all duration-300 hover:border-gold/20 hover:-translate-y-1",
                  "hover:shadow-[0_8px_30px_rgba(217,164,0,0.08)]"
                )}
              >
                {/* Icon */}
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 text-gold transition-colors group-hover:bg-gold/15">
                  {Icon && <Icon size={24} />}
                </div>

                {/* Content */}
                <h3 className="mb-2 font-heading text-lg font-semibold text-off-white">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
