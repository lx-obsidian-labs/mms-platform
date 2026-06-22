"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { STATS } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";
import { Container } from "@/components/shared/container";

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref}>
      <span className="font-display text-4xl text-gold sm:text-5xl lg:text-6xl">
        {count.toLocaleString()}{suffix}
      </span>
    </div>
  );
}

export function StudentJourneySection() {
  return (
    <section className="relative bg-surface py-[var(--section-padding)]" aria-label="Student Journey">
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" aria-hidden="true" />

      <Container>
        <SectionHeading
          title="Your Journey at MMS"
          subtitle="Join thousands of students who have launched their mining careers through our training programs."
        />

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/5 bg-industrial-black p-6 text-center"
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Journey Visual */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-16 grid gap-4 sm:grid-cols-3"
        >
          {[
            {
              phase: "Foundation",
              description: "Build your theoretical knowledge through structured online and classroom-based learning modules.",
              label: "Phase 1",
            },
            {
              phase: "Practical",
              description: "Apply your knowledge with hands-on training using real machinery and simulated mining environments.",
              label: "Phase 2",
            },
            {
              phase: "Certification",
              description: "Complete assessments, earn your certificate, and join the MMS alumni network ready for industry.",
              label: "Phase 3",
            },
          ].map((phase, i) => (
            <div
              key={phase.phase}
              className="relative rounded-xl border border-white/5 bg-industrial-black p-6"
            >
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-gold">
                {phase.label}
              </span>
              <h3 className="mb-2 font-heading text-lg font-bold text-off-white">
                {phase.phase}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {phase.description}
              </p>
              {/* Connector Arrow (hidden on last) */}
              {i < 2 && (
                <div className="absolute -right-2 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 rotate-45 border-r border-t border-gold/20 sm:block" aria-hidden="true" />
              )}
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
