import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Play, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
          <h2 className="font-heading text-xl font-bold text-off-white">No Enrollments Yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">You are not enrolled in any courses yet.</p>
          <Link href="/courses" className="mt-4 inline-flex items-center text-sm text-gold hover:text-gold-light">
            Browse Courses →
          </Link>
        </div>
      </div>
    );
  }

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, courses(id, title, slug, description, duration_weeks, category)")
    .eq("student_id", student.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-xl font-bold text-off-white">My Courses</h1>

      {(!enrollments || enrollments.length === 0) ? (
        <div className="rounded-xl border border-white/5 bg-surface p-12 text-center">
          <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
          <h2 className="font-heading text-lg font-bold text-off-white">No Enrollments Yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Once enrolled, your courses will appear here.</p>
          <Link href="/courses" className="mt-4 inline-flex items-center text-sm text-gold hover:text-gold-light">
            Browse Courses →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="rounded-xl border border-white/5 bg-surface p-5 transition-all hover:border-gold/20">
              <div className="flex items-center justify-between">
                <span className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase",
                  statusBadgeColor(enrollment.status)
                )}>
                  {enrollment.status}
                </span>
              </div>
              <h3 className="mt-3 font-heading font-bold text-off-white">
                {enrollment.courses?.title ?? "Course"}
              </h3>
              {enrollment.courses?.category && (
                <p className="mt-1 text-xs text-muted-foreground">{enrollment.courses.category}</p>
              )}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{enrollment.progress_percentage}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-industrial-black">
                  <div
                    className="h-full rounded-full bg-gold transition-all"
                    style={{ width: `${enrollment.progress_percentage}%` }}
                  />
                </div>
              </div>
              <Link
                href={`/portal/courses/${enrollment.courses?.slug ?? enrollment.course_id}`}
                className="mt-4 flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-off-white transition-colors hover:border-gold/30 hover:text-gold"
              >
                <span className="flex items-center gap-1.5">
                  <Play size={12} />
                  Continue Learning
                </span>
                <ChevronRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}
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
