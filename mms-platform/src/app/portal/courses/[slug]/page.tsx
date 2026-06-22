import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Play, FileText, CheckCircle, Clock, BookOpen, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ALL_COURSES } from "@/lib/constants";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = {
  title: "Course Learning",
  robots: { index: false, follow: false },
};

export default async function CourseLearningPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!student) redirect("/portal/courses");

  const { data: dbCourse } = await supabase
    .from("courses")
    .select("id, title, slug, description, duration_weeks, category")
    .eq("slug", slug)
    .single();

  if (!dbCourse) notFound();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*")
    .eq("student_id", student.id)
    .eq("course_id", dbCourse.id)
    .single();

  if (!enrollment) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
          <h2 className="font-heading text-xl font-bold text-off-white">Not Enrolled</h2>
          <p className="mt-2 text-sm text-muted-foreground">You are not enrolled in this course.</p>
          <Link href="/portal/courses" className="mt-4 inline-flex items-center gap-1 text-sm text-gold hover:text-gold-light">
            <ArrowLeft size={14} /> Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("course_id", dbCourse.id)
    .order("module_order");

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", dbCourse.id)
    .eq("is_published", true)
    .order("order_index");

  const lessonIds = lessons?.map((l) => l.id) ?? [];
  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("enrollment_id", enrollment.id)
    .in("lesson_id", lessonIds);

  const completedIds = new Set(progress?.filter((p) => p.completed).map((p) => p.lesson_id) ?? []);

  const courseInfo = ALL_COURSES.find((c) => c.slug === slug);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/portal/courses" className="mb-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold">
          <ArrowLeft size={12} /> Back to My Courses
        </Link>
        <h1 className="font-heading text-2xl font-bold text-off-white">{dbCourse.title}</h1>
        <div className="mt-2 flex flex-wrap gap-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} /> {dbCourse.duration_weeks} weeks
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <CheckCircle size={12} /> {enrollment.progress_percentage}% complete
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <BookOpen size={12} /> {lessons?.length ?? 0} lessons
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-industrial-black">
          <div
            className="h-full rounded-full bg-gold transition-all"
            style={{ width: `${enrollment.progress_percentage}%` }}
          />
        </div>
      </div>

      {/* Course content */}
      <div className="space-y-4">
        {(modules ?? []).length === 0 && (lessons ?? []).length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-surface p-12 text-center">
            <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h2 className="font-heading text-lg font-bold text-off-white">Content Coming Soon</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Learning materials for this course are being prepared.
            </p>
          </div>
        ) : (
          <>
            {modules!.length > 0 && modules!.map((mod, modIdx) => {
              const moduleLessons = lessons?.filter((l) => l.module_id === mod.id) ?? [];
              const completedCount = moduleLessons.filter((l) => completedIds.has(l.id)).length;

              return (
                <div key={mod.id} className="overflow-hidden rounded-xl border border-white/5 bg-surface">
                  <div className="flex items-center justify-between border-b border-white/5 bg-industrial-black px-5 py-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Module {modIdx + 1}</p>
                      <h3 className="font-heading text-sm font-bold text-off-white">{mod.title}</h3>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {completedCount}/{moduleLessons.length}
                    </span>
                  </div>
                  {moduleLessons.length > 0 && (
                    <div className="divide-y divide-white/5">
                      {moduleLessons.map((lesson) => {
                        const isCompleted = completedIds.has(lesson.id);
                        return (
                          <Link key={lesson.id} href={`/portal/courses/${slug}/lessons/${lesson.id}`} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/5">
                            <div className={cn(
                              "flex size-8 shrink-0 items-center justify-center rounded-lg",
                              isCompleted ? "bg-green-500/10" : "bg-white/5"
                            )}>
                              {isCompleted ? (
                                <CheckCircle className="size-4 text-green-400" />
                              ) : lesson.lesson_type === "video" ? (
                                <Play className="size-4 text-gold" />
                              ) : (
                                <FileText className="size-4 text-gold" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={cn("text-sm", isCompleted ? "text-muted-foreground" : "text-off-white")}>
                                {lesson.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {lesson.lesson_type} · {lesson.duration_minutes} min
                              </p>
                            </div>
                            <ChevronRight className="size-4 text-muted-foreground" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Lessons without modules */}
            {lessons?.filter((l) => !l.module_id).map((lesson) => {
              const isCompleted = completedIds.has(lesson.id);
              return (
                <Link key={lesson.id} href={`/portal/courses/${slug}/lessons/${lesson.id}`} className="flex items-center gap-3 rounded-xl border border-white/5 bg-surface px-5 py-3 transition-colors hover:border-gold/20">
                  <div className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    isCompleted ? "bg-green-500/10" : "bg-white/5"
                  )}>
                    {isCompleted ? (
                      <CheckCircle className="size-4 text-green-400" />
                    ) : lesson.lesson_type === "video" ? (
                      <Play className="size-4 text-gold" />
                    ) : (
                      <FileText className="size-4 text-gold" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm", isCompleted ? "text-muted-foreground" : "text-off-white")}>
                      {lesson.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lesson.lesson_type} · {lesson.duration_minutes} min
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
