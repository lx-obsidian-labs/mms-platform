import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, Award, Play, CheckCircle, GraduationCap, ArrowRight,
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
    .select("*, courses!inner(id, title, slug, category, description, image_url, is_featured)")
    .eq("student_id", student?.id ?? "")
    .order("created_at", { ascending: false });

  const active = enrollments?.filter((e) => e.status === "active") ?? [];
  const completed = enrollments?.filter((e) => e.status === "completed") ?? [];
  const totalEnrolled = enrollments?.length ?? 0;
  const finishedCount = completed.length + active.filter((e) => (e.progress_percentage ?? 0) >= 100).length;
  const overallProgress = totalEnrolled > 0 ? Math.round((finishedCount / totalEnrolled) * 100) : 0;

  // Fetch first video lesson for each active course
  let courseVideos: Array<{ courseSlug: string; courseTitle: string; lessonId: string; lessonTitle: string; contentUrl: string; duration: number }> = [];
  if (active.length > 0) {
    const courseIds = active.map((e) => (e.courses as unknown as { id: string }).id);
    const { data: firstVideos } = await supabase
      .from("lessons")
      .select("id, title, content_url, duration_minutes, course_id, order_index")
      .in("course_id", courseIds)
      .eq("lesson_type", "video")
      .eq("is_published", true)
      .order("order_index");

    // Deduplicate: keep first video per course
    const seen = new Set<string>();
    const deduped = (firstVideos ?? []).filter((v) => {
      if (seen.has(v.course_id)) return false;
      seen.add(v.course_id);
      return true;
    });

    courseVideos = deduped
      .filter((v) => v.content_url)
      .map((v) => {
        const enrollment = active.find((e) => (e.courses as unknown as { id: string }).id === v.course_id);
        const course = enrollment?.courses as unknown as { slug: string; title: string } | undefined;
        return {
          courseSlug: course?.slug ?? "",
          courseTitle: course?.title ?? "",
          lessonId: v.id,
          lessonTitle: v.title,
          contentUrl: v.content_url!,
          duration: v.duration_minutes,
        };
      });
  }

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

      {/* Recommended Courses */}
      {active.length > 0 && (
        <section>
          <h2 className="mb-4 font-heading font-bold text-off-white flex items-center gap-2">
            <Award className="size-4 text-gold" /> Recommended for You
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((enrollment) => {
              const course = enrollment.courses as unknown as { id: string; title: string; slug: string; category: string; description: string; image_url: string | null; is_featured: boolean };
              // Show featured courses as recommended
              if (!course.is_featured) return null;
              const progress = enrollment.progress_percentage ?? 0;
              return (
                <Link key={enrollment.id} href={`/portal/courses/${course.slug}`}
                  className="group rounded-xl border border-gold/20 bg-surface p-5 transition-all hover:border-gold/40 hover:bg-surface-light">
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="font-heading font-bold text-off-white group-hover:text-gold transition-colors">{course.title}</h3>
                    <span className="whitespace-nowrap rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold">Featured</span>
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

      {/* Course Videos Section */}
      {courseVideos.length > 0 && (
        <section>
          <h2 className="mb-4 font-heading font-bold text-off-white flex items-center gap-2">
            <Play className="size-4 text-gold" /> Course Videos
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {courseVideos.map((video) => (
              <div key={video.lessonId} className="overflow-hidden rounded-xl border border-white/5 bg-surface">
                <div className="aspect-video bg-industrial-black">
                  <video controls className="size-full" poster={`${video.contentUrl}/poster.jpg`}>
                    <source src={video.contentUrl} type="video/mp4" />
                  </video>
                </div>
                <div className="p-4">
                  <Link href={`/portal/courses/${video.courseSlug}/lessons/${video.lessonId}`}
                    className="font-heading font-bold text-off-white transition-colors hover:text-gold">
                    {video.lessonTitle}
                  </Link>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Link href={`/portal/courses/${video.courseSlug}`} className="hover:text-gold transition-colors">
                      {video.courseTitle}
                    </Link>
                    <span>&middot;</span>
                    <span>{video.duration} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Active Courses */}
      {active.length > 0 && (
        <section>
          <h2 className="mb-4 font-heading font-bold text-off-white flex items-center gap-2">
            <Play className="size-4 text-gold" /> Continue Learning
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((enrollment) => {
              const course = enrollment.courses as unknown as { id: string; title: string; slug: string; category: string; description: string; image_url: string | null; is_featured: boolean };
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
              const course = enrollment.courses as unknown as { id: string; title: string; slug: string; description: string; is_featured: boolean };
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
