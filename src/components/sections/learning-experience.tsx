"use client";

import { motion, type Variants } from "framer-motion";
import { FileText, CheckCircle, BookOpen, HardHat, GraduationCap } from "lucide-react";
import { LEARNING_STEPS } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

const iconMap = {
  FileText,
  CheckCircle,
  BookOpen,
  HardHat,
  GraduationCap,
} as const;

const stepVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export function LearningExperienceSection() {
  return (
    <section className="relative bg-industrial-black py-[var(--section-padding)]" aria-label="How You'll Learn" id="how-it-works">
      <Container>
        <SectionHeading
          title="How You'll Learn"
          subtitle="From application to certification — our structured process ensures you're fully prepared for the mining industry."
        />

        <div className="relative mx-auto max-w-3xl">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-gold/10 to-transparent md:left-1/2 md:-translate-x-px" aria-hidden="true" />

          <div className="space-y-12 md:space-y-16">
            {LEARNING_STEPS.map((step, index) => {
              const Icon = iconMap[step.icon as keyof typeof iconMap];
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.step}
                  variants={stepVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className={cn(
                    "relative grid items-center gap-6 md:grid-cols-2 md:gap-12",
                    !isEven && "md:[direction:rtl]"
                  )}
                >
                  {/* Step Number Node */}
                  <div className="absolute left-6 top-0 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-2 border-gold/30 bg-industrial-black md:left-1/2">
                    <span className="font-display text-lg text-gold">{step.step}</span>
                  </div>

                  {/* Content Card */}
                  <div className={cn(
                    "ml-16 rounded-xl border border-white/5 bg-surface p-6 md:ml-0",
                    isEven ? "md:pr-16 md:text-right md:[direction:ltr]" : "md:pl-16 md:[direction:ltr]"
                  )}>
                    <div className={cn("mb-3 flex items-center gap-3", isEven && "md:justify-end")}>
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
                        {Icon && <Icon size={20} />}
                      </div>
                    </div>
                    <h3 className="mb-2 font-heading text-lg font-bold text-off-white">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>

                  {/* Spacer for the other side */}
                  <div className="hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
