"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { COMPANY } from "@/lib/constants";

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-industrial-black"
      aria-label="Hero"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: "url(/images/backgrounds/hero-bg.jpg)" }}
        aria-hidden="true"
      />
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-industrial-black via-industrial-black/60 to-industrial-black/80" />
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(217,164,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(217,164,0,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        {/* Radial Glow */}
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.04] blur-[120px]" />
        {/* Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-industrial-black to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[var(--container-max)] px-[var(--container-padding)] pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              <span className="text-xs font-medium tracking-wide text-gold">
                South Africa&apos;s Premier Mining Training
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-display text-5xl leading-[0.95] tracking-wide text-off-white sm:text-6xl md:text-7xl lg:text-8xl">
              BUILDING THE
              <br />
              <span className="text-gold">FUTURE</span> OF
              <br />
              MINING
            </h1>

            {/* Subheadline */}
            <p className="mt-6 max-w-lg text-base leading-relaxed text-silver sm:text-lg">
              Industry-recognized certification, hands-on practical training,
              and expert-led courses for South Africa&apos;s mining and
              industrial sector. Based in {COMPANY.location}.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/apply"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-gold px-6 text-sm font-semibold text-industrial-black transition-all hover:bg-gold-light hover:shadow-[0_0_30px_rgba(217,164,0,0.3)]"
              >
                Apply Now
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/courses"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 text-sm font-semibold text-off-white backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                Explore Courses
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex items-center gap-8">
              <div>
                <p className="font-display text-3xl text-gold">2500+</p>
                <p className="text-xs text-muted-foreground">Students Trained</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="font-display text-3xl text-gold">94%</p>
                <p className="text-xs text-muted-foreground">Certification Rate</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="font-display text-3xl text-gold">25+</p>
                <p className="text-xs text-muted-foreground">Programs</p>
              </div>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="hidden lg:block"
            aria-hidden="true"
          >
            <div className="relative">
              {/* Industrial Graphic */}
              <div className="relative aspect-square rounded-2xl border border-white/5 bg-surface overflow-hidden">
                {/* Abstract Mining Visual */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-64 w-64">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-[spin_20s_linear_infinite]" />
                    {/* Middle Ring */}
                    <div className="absolute inset-6 rounded-full border border-gold/10 animate-[spin_15s_linear_infinite_reverse]" />
                    {/* Inner Core */}
                    <div className="absolute inset-16 rounded-full bg-gold/10 backdrop-blur-sm flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-gold/20" />
                    </div>
                    {/* Accent Dots */}
                    <div className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" />
                    <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-gold/60" />
                    <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/40" />
                  </div>
                </div>
                {/* Corner Accents */}
                <div className="absolute top-6 left-6 h-12 w-12 border-l-2 border-t-2 border-gold/30" />
                <div className="absolute bottom-6 right-6 h-12 w-12 border-b-2 border-r-2 border-gold/30" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
