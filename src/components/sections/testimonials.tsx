"use client";

import { motion, type Variants } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";
import { Container } from "@/components/shared/container";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export function TestimonialsSection() {
  return (
    <section className="relative bg-industrial-black py-[var(--section-padding)]" aria-label="Testimonials">
      <Container>
        <SectionHeading
          title="What Our Students Say"
          subtitle="Hear from graduates who transformed their careers through MMS training programs."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 md:grid-cols-3"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              variants={cardVariants}
              className="relative rounded-xl border border-white/5 bg-surface p-6 lg:p-8"
            >
              {/* Quote Icon */}
              <div className="mb-4 text-gold/30" aria-hidden="true">
                <Quote size={32} />
              </div>

              {/* Stars */}
              <div className="mb-4 flex gap-0.5" aria-label={`${testimonial.rating} out of 5 stars`}>
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-gold text-gold" />
                ))}
              </div>

              {/* Quote Text */}
              <blockquote className="mb-6 text-sm leading-relaxed text-silver">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="border-t border-white/5 pt-4">
                <p className="font-heading text-sm font-semibold text-off-white">
                  {testimonial.name}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {testimonial.course} &middot; {testimonial.year}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
