import type { Metadata } from "next";
import { BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ALL_COURSES, COURSE_CATEGORIES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "Courses" };

export default function AdminCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-gold/10">
          <BookOpen className="size-5 text-gold" />
        </div>
        <div>
          <h1 className="font-display text-2xl tracking-wide text-off-white lg:text-3xl">Courses</h1>
          <p className="text-sm text-muted-foreground">Manage course catalog ({ALL_COURSES.length} programs)</p>
        </div>
      </div>

      {/* Category Summary */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {COURSE_CATEGORIES.filter((cat) => cat.value !== "all").map((cat) => {
          const count = ALL_COURSES.filter((c) => c.category === cat.value).length;
          return (
            <div key={cat.value} className="rounded-xl border border-white/5 bg-surface p-4">
              <p className="text-lg font-bold text-off-white">{count}</p>
              <p className="text-sm text-muted-foreground">{cat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Course List */}
      <div className="rounded-xl border border-white/5 bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">Course</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Level</th>
                <th className="hidden px-5 py-3 font-medium lg:table-cell">Duration</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ALL_COURSES.map((course) => (
                <tr key={course.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <p className="font-medium text-off-white">{course.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{course.shortDescription}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-muted-foreground">
                      {course.category}
                    </span>
                  </td>
                  <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">{course.level}</td>
                  <td className="hidden px-5 py-3 text-muted-foreground lg:table-cell">
                    {course.durationWeeks} {course.durationWeeks === 1 ? "week" : "weeks"} ({course.durationHours}h)
                  </td>
                  <td className="px-5 py-3 font-semibold text-gold">{formatCurrency(course.price)}</td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-gold"
                      title="View public page"
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
