"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  FileText,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { markLessonComplete } from "@/lib/actions";
import { QuizViewer } from "@/components/quiz-viewer";
import { AssignmentUpload } from "@/components/assignment-upload";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  content_url: string | null;
  lesson_type: string;
  duration_minutes: number;
}

interface Course {
  id: string;
  title: string;
  slug: string;
}

interface NavLesson {
  id: string;
  title: string;
}

export function LessonViewer({
  lesson,
  course,
  enrollmentId,
  isCompleted: initialCompleted,
  prevLesson,
  nextLesson,
  courseSlug,
}: {
  lesson: Lesson;
  course: Course;
  enrollmentId: string;
  isCompleted: boolean;
  prevLesson: NavLesson | null;
  nextLesson: NavLesson | null;
  courseSlug: string;
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [completing, setCompleting] = useState(false);

  async function handleComplete() {
    setCompleting(true);
    const form = new FormData();
    form.set("lessonId", lesson.id);
    form.set("courseId", course.id);
    const result = await markLessonComplete(form);
    if (result.success) {
      setCompleted(true);
      router.refresh();
    }
    setCompleting(false);
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/portal/courses/${courseSlug}`}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-gold"
      >
        <ArrowLeft size={12} /> Back to {course.title}
      </Link>

      <div className="rounded-xl border border-white/5 bg-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              completed ? "bg-green-500/10" : "bg-gold/10"
            )}>
              {completed ? (
                <CheckCircle className="size-5 text-green-400" />
              ) : lesson.lesson_type === "video" ? (
                <Play className="size-5 text-gold" />
              ) : (
                <FileText className="size-5 text-gold" />
              )}
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-off-white">{lesson.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground capitalize">
                {lesson.lesson_type} &middot; {lesson.duration_minutes} min
              </p>
            </div>
          </div>
          {completed && (
            <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
              <CheckCircle size={12} /> Completed
            </span>
          )}
        </div>

        {lesson.description && (
          <p className="mt-4 text-sm text-muted-foreground">{lesson.description}</p>
        )}
      </div>

      {lesson.lesson_type === "video" && (
        <div className="overflow-hidden rounded-xl border border-white/5 bg-surface">
          {lesson.content_url ? (
            <div className="aspect-video bg-industrial-black">
              <video
                controls
                className="size-full"
                poster={`${lesson.content_url}/poster.jpg`}
                onEnded={completed ? undefined : () => {
                  handleComplete();
                }}
              >
                <source src={lesson.content_url} type="video/mp4" />
              </video>
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center bg-industrial-black">
              <div className="text-center">
                <Play className="mx-auto mb-3 size-10 text-white/20" />
                <p className="text-sm text-muted-foreground">Video content not yet available</p>
              </div>
            </div>
          )}
        </div>
      )}

      {lesson.lesson_type === "document" && (
        <div className="rounded-xl border border-white/5 bg-surface p-8">
          {lesson.content_url ? (
            <iframe
              src={lesson.content_url}
              className="h-[70vh] w-full rounded-lg"
              title={lesson.title}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <FileText className="mb-3 size-10 text-white/20" />
              <p className="text-sm text-muted-foreground">Document content not yet available</p>
            </div>
          )}
        </div>
      )}

      {lesson.lesson_type === "quiz" && (
        <QuizViewer lessonId={lesson.id} enrollmentId={enrollmentId} />
      )}

      {(lesson.lesson_type === "assignment" || lesson.lesson_type === "practical") && (
        <AssignmentUpload lessonId={lesson.id} enrollmentId={enrollmentId}
          courseSlug={courseSlug} lessonTitle={lesson.title} isSubmitted={completed} />
      )}

      {/* Complete & Navigate */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={handleComplete}
          disabled={completing || completed}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all",
            completed
              ? "bg-green-500/10 text-green-400"
              : "bg-gold text-industrial-black hover:bg-gold-light"
          )}
        >
          {completing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : completed ? (
            <CheckCircle className="size-4" />
          ) : (
            <CheckCircle className="size-4" />
          )}
          {completed ? "Completed" : "Mark as Complete"}
        </button>

        <div className="flex gap-2">
          {prevLesson && (
            <Link
              href={`/portal/courses/${courseSlug}/lessons/${prevLesson.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-gold/20 hover:text-gold"
            >
              <ChevronLeft size={14} />
              {prevLesson.title.length > 20 ? prevLesson.title.slice(0, 20) + "..." : prevLesson.title}
            </Link>
          )}
          {nextLesson && (
            <Link
              href={`/portal/courses/${courseSlug}/lessons/${nextLesson.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2.5 text-xs font-bold text-industrial-black transition-colors hover:bg-gold-light"
            >
              {nextLesson.title.length > 20 ? nextLesson.title.slice(0, 20) + "..." : nextLesson.title}
              <ChevronRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
