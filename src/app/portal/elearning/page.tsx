import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, Award, Play, CheckCircle, Clock, GraduationCap, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "E-Learning",
  description: "Your MMS e-learning portal",
  robots: { index: false, follow: false },
};

export default async function ELearningPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/portal/elearning");

  const { data: student } = await supabase
    .from("students").select("*").eq("user_id", user.id).single();

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, courses!inner(id, title, slug, category, description, image_url)")
    .eq("student_id", student?.id ?? "")
    .order("created_at", { ascending: false });

  const active = enrollments?.filter((e) => e.status === "active") ?? [];
  const completed = enrollments?.filter((e) => e.status === "completed") ?? [];
  const totalLessons = enrollments?.length ?? 0;
  const completedLessons = completed.length + active.filter((e) => (e.progress_percentage ?? 0) >= 100).length;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-off-white flex items-center gap-2">
          <GraduationCap className="size-6 text-gold" />
          E-Learning
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Your learning journey at Mpumalanga Mining Solutions</p>
      </div>

      {/* Stats */}
      {enrollments && enrollments.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Enrolled", value: enrollments.length, icon: BookOpen, color: "text-blue-400 bg-blue-500/10" },
            { label: "In Progress", value: active.length, icon: Play, color: "text-amber-400 bg-amber-500/10" },
            { label: "Completed", value: completed.length, icon: CheckCircle, color: "text-green-400 bg-green-500/10" },
            { label: "Progress", value: `${overallProgress}%`, icon: Award, color: "text-gold bg-gold/10" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/5 bg-surface p-4">
              <div className={cn("mb-2 inline-flex rounded-lg p-2", stat.color)}>
                <stat.icon className="size-4" />
              </div>
              <p className="text-lg font-bold text-off-white">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Active Courses */}
      {active.length > 0 && (
        <section>
          <h2 className="mb-4 font-heading font-bold text-off-white flex items-center gap-2">
            <Play className="size-4 text-gold" /> Continue Learning
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((enrollment) => {
              const course = enrollment.courses as unknown as { id: string; title: string; slug: string; category: string; description: string; image_url: string | null };
              const progress = enrollment.progress_percentage ?? 0;
              return (
                <Link key={enrollment.id} href={`/portal/courses/${course.slug}`}
                  className="group rounded-xl border border-white/5 bg-surface p-5 transition-all hover:border-gold/20 hover:bg-surface-light">
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="font-heading font-bold text-off-white group-hover:text-gold transition-colors">{course.title}</h3>
                    <span className="whitespace-nowrap rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold">{course.category}</span>
                  </div>
                  <p className="mb-4 line-clamp-2 text-xs text-muted-foreground">{course.description}</p>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gold">{progress}%</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Completed Courses */}
      {completed.length > 0 && (
        <section>
          <h2 className="mb-4 font-heading font-bold text-off-white flex items-center gap-2">
            <Award className="size-4 text-green-400" /> Completed
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completed.map((enrollment) => {
              const course = enrollment.courses as unknown as { id: string; title: string; slug: string; description: string };
              return (
                <Link key={enrollment.id} href={`/portal/courses/${course.slug}`}
                  className="rounded-xl border border-green-500/10 bg-surface p-5 transition-all hover:border-green-500/20">
                  <div className="flex items-start justify-between">
                    <h3 className="font-heading font-bold text-off-white">{course.title}</h3>
                    <CheckCircle className="size-5 shrink-0 text-green-400" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{course.description}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-green-400">
                    <Award size={12} /> Certificate Available
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty State */}
      {(!enrollments || enrollments.length === 0) && (
        <div className="rounded-xl border border-white/5 bg-surface p-12 text-center">
          <GraduationCap className="mx-auto mb-4 size-12 text-gold/40" />
          <h2 className="font-heading text-lg font-bold text-off-white">No Courses Yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">You are not enrolled in any courses yet.</p>
          <Link href="/courses" className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-gold px-6 py-2.5 text-sm font-bold text-black transition-all hover:bg-gold-light">
            Browse Courses <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
