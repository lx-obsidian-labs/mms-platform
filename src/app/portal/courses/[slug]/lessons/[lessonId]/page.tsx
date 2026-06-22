import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { LessonViewer } from "./lesson-viewer";

type Props = { params: Promise<{ slug: string; lessonId: string }> };

export const metadata: Metadata = {
  title: "Lesson",
  robots: { index: false, follow: false },
};

export default async function LessonPage({ params }: Props) {
  const { slug, lessonId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!student) redirect("/portal/courses");

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, slug")
    .eq("slug", slug)
    .single();

  if (!course) notFound();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("student_id", student.id)
    .eq("course_id", course.id)
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

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .eq("course_id", course.id)
    .single();

  if (!lesson || !lesson.is_published) notFound();

  const { data: allLessons } = await supabase
    .from("lessons")
    .select("id, title, order_index")
    .eq("course_id", course.id)
    .eq("is_published", true)
    .order("order_index");

  const currentIdx = allLessons?.findIndex((l) => l.id === lessonId) ?? -1;
  const prevLesson = currentIdx > 0 ? allLessons?.[currentIdx - 1] : null;
  const nextLesson = currentIdx >= 0 && currentIdx < (allLessons?.length ?? 0) - 1 ? allLessons?.[currentIdx + 1] : null;

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("enrollment_id", enrollment.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  return (
    <LessonViewer
      lesson={lesson}
      course={course}
      enrollmentId={enrollment.id}
      isCompleted={progress?.completed ?? false}
      prevLesson={prevLesson ? { id: prevLesson.id, title: prevLesson.title } : null}
      nextLesson={nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null}
      courseSlug={slug}
    />
  );
}
