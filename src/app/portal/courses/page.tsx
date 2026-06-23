import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Play, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_COURSES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "My Courses",
  robots: { index: false, follow: false },
};

export default async function PortalCoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!student) {
    return <EmptyState />;
  }

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, courses!inner(id, title, slug, description, duration_weeks, category)")
    .eq("student_id", student.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold text-off-white">My Courses</h1>
        {enrollments && enrollments.length > 0 && (
          <span className="text-xs text-muted-foreground">{enrollments.length} enrolled</span>
        )}
      </div>

      {(!enrollments || enrollments.length === 0) ? (
        <EmptyState />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => {
            const courseInfo = ALL_COURSES.find((c) => c.slug === enrollment.courses?.slug);
            return (
              <div
                key={enrollment.id}
                className="group overflow-hidden rounded-xl border border-white/5 bg-surface transition-all hover:border-gold/20"
              >
                {/* Course Image */}
                {courseInfo?.image && (
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={courseInfo.image}
                      alt={enrollment.courses?.title ?? ""}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                    <span className={cn(
                      "absolute right-2.5 top-2.5 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase",
                      statusBadgeColor(enrollment.status)
                    )}>
                      {enrollment.status}
                    </span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-heading font-bold text-off-white group-hover:text-gold">
                    {enrollment.courses?.title ?? "Course"}
                  </h3>
                  {enrollment.courses?.category && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{enrollment.courses.category}</p>
                  )}
                  <div className="mt-3 flex items-center gap-3">
                    {enrollment.courses?.duration_weeks && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={12} />
                        {enrollment.courses.duration_weeks} weeks
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{enrollment.progress_percentage}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-industrial-black">
                      <div
                        className="h-full rounded-full bg-gold transition-all"
                        style={{ width: `${enrollment.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                  <Link
                    href={`/portal/courses/${enrollment.courses?.slug ?? enrollment.course_id}`}
                    className="mt-4 flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-xs font-medium transition-colors hover:border-gold/30 hover:text-gold"
                  >
                    <span className="flex items-center gap-1.5">
                      <Play size={12} />
                      Continue Learning
                    </span>
                    <ChevronRight size={14} />
                  </Link>
                  <a
                    href={`/api/enrollments/${enrollment.id}/proof-of-registration`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center justify-center gap-1 rounded-lg border border-white/5 px-3 py-1.5 text-[10px] text-muted-foreground transition-colors hover:border-gold/20 hover:text-gold"
                  >
                    Proof of Registration
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-white/5 bg-surface p-12 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-gold/10">
        <BookOpen className="size-7 text-gold" />
      </div>
      <h2 className="font-heading text-lg font-bold text-off-white">No Enrollments Yet</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Once you enroll in a course, it will appear here.
      </p>
      <Link
        href="/courses"
        className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-industrial-black transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(217,164,0,0.3)]"
      >
        Browse Courses <ChevronRight size={14} />
      </Link>
    </div>
  );
}

function statusBadgeColor(status: string): string {
  switch (status) {
    case "active": return "bg-green-500/10 text-green-400";
    case "completed": return "bg-blue-500/10 text-blue-400";
    case "suspended": return "bg-red-500/10 text-red-400";
    case "withdrawn": return "bg-gray-500/10 text-gray-400";
    case "failed": return "bg-red-500/10 text-red-400";
    default: return "bg-yellow-500/10 text-yellow-400";
  }
}
