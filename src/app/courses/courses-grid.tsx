"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Truck, Shield, Mountain, Layers, ArrowRight, Clock, Award, HeartPulse, Flame, ChevronRight } from "lucide-react";
import type { Course } from "@/lib/constants";
import { cn, formatCurrency, getOriginalPrice } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Truck, Shield, Mountain, Layers, HeartPulse,
  Forklift: Truck, Flame: Shield,
};

interface CoursesGridProps {
  courses: Course[];
  categories: readonly { label: string; value: string }[];
}

export function CoursesGrid({ courses, categories }: CoursesGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? courses
      : courses.filter((c) => c.category === activeCategory);

  return (
    <>
      {/* Category Filters */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setActiveCategory(cat.value)}
            className={cn(
              "rounded-full border px-5 py-2 text-sm font-medium transition-all",
              activeCategory === cat.value
                ? "border-gold bg-gold text-industrial-black"
                : "border-white/10 text-silver hover:border-gold/30 hover:text-off-white"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="mb-8 text-center text-sm text-muted-foreground">
        Showing <span className="font-semibold text-off-white">{filtered.length}</span> training{" "}
        {filtered.length === 1 ? "program" : "programs"}
      </p>

      {/* Course Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course) => {
          const Icon = iconMap[course.icon] ?? Truck;
          return (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className={cn(
                "group flex flex-col rounded-xl border border-white/5 bg-surface p-6",
                "transition-all duration-300 hover:border-gold/15",
                "hover:shadow-[0_8px_40px_rgba(217,164,0,0.06)]"
              )}
            >
              {/* Image */}
              <div className="relative mb-4 h-40 overflow-hidden rounded-lg">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gold/90 text-black shadow-lg">
                  <Icon size={18} />
                </div>
                <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-[#E53935]/90 px-2 py-0.5 text-[10px] font-bold text-white uppercase backdrop-blur-sm">
                  Sale
                </span>
                {course.certification && (
                  <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-0.5 text-[11px] font-medium text-gold backdrop-blur-sm">
                    <Award size={10} />
                    Certified
                  </span>
                )}
              </div>

              {/* Content */}
              <h3 className="mb-2 font-heading text-lg font-bold text-off-white group-hover:text-gold transition-colors">
                {course.title}
              </h3>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                {course.shortDescription}
              </p>

              {/* Meta */}
              <div className="mb-5 flex flex-wrap items-center gap-3 text-xs text-silver">
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} className="text-gold" />
                  {course.durationWeeks} weeks
                </span>
                <span className="text-white/10">|</span>
                <span>{course.durationHours}h</span>
                <span className="text-white/10">|</span>
                <span className="rounded-full bg-surface-light/50 px-2 py-0.5 text-[11px]">
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
                <span className="inline-flex items-center gap-1 text-xs font-medium text-off-white transition-colors group-hover:text-gold">
                  View Details
                  <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
