"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";

export function CtaSection() {
  return (
    <section className="relative bg-industrial-black py-[var(--section-padding)]" aria-label="Call to Action">
      {/* Top gold accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" aria-hidden="true" />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="relative overflow-hidden rounded-2xl border border-gold/20 bg-surface p-8 text-center sm:p-12 lg:p-16"
        >
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.06] blur-[80px]" />
          </div>

          <div className="relative z-10">
            <h2 className="font-display text-4xl tracking-wide text-off-white sm:text-5xl lg:text-6xl">
              READY TO BUILD YOUR
              <br />
              <span className="text-gold">MINING CAREER?</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base text-silver sm:text-lg">
              Applications for our next intake are now open. Secure your spot in
              South Africa&apos;s leading mining training program today.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/apply"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-gold px-8 text-base font-semibold text-industrial-black transition-all hover:bg-gold-light hover:shadow-[0_0_40px_rgba(217,164,0,0.3)]"
              >
                Apply Now
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/courses"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-8 text-base font-semibold text-off-white transition-all hover:border-white/20 hover:bg-white/10"
              >
                View All Courses
              </Link>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              No application fee &middot; Response within 48 hours &middot; Flexible payment plans available
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
