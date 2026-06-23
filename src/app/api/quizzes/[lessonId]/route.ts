import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ lessonId: string }> };

export async function GET(_request: NextRequest, { params }: Props) {
  const { lessonId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: student } = await supabase
    .from("students").select("id").eq("user_id", user.id).single();
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  const { data: lesson } = await supabase
    .from("lessons").select("course_id, module_id").eq("id", lessonId).single();
  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

  const { data: enrollment } = await supabase
    .from("enrollments").select("id")
    .eq("student_id", student.id).eq("course_id", lesson.course_id).single();
  if (!enrollment) return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

  const q = supabase.from("quizzes").select("id, title, description, passing_score, max_attempts, time_limit_minutes")
    .eq("course_id", lesson.course_id).eq("is_published", true);
  if (lesson.module_id) q.eq("module_id", lesson.module_id);
  const { data: quizzes } = await q.maybeSingle();

  if (!quizzes) {
    return NextResponse.json({ quiz: null, message: "No quiz configured for this lesson" });
  }

  const { data: existingResults } = await supabase
    .from("quiz_results").select("*")
    .eq("student_id", student.id).eq("quiz_id", quizzes.id)
    .order("attempt_number", { ascending: false });

  const attemptsUsed = existingResults?.length ?? 0;
  const canRetake = quizzes.max_attempts === 0 || attemptsUsed < quizzes.max_attempts;
  const lastResult = existingResults?.[0] ?? null;

  const { data: questions } = await supabase
    .from("quiz_questions").select("id, question, question_type, options, points, question_order")
    .eq("quiz_id", quizzes.id).order("question_order");

  return NextResponse.json({
    quiz: {
      id: quizzes.id,
      title: quizzes.title,
      description: quizzes.description,
      passingScore: quizzes.passing_score,
      maxAttempts: quizzes.max_attempts,
      timeLimitMinutes: quizzes.time_limit_minutes,
    },
    questions: questions?.map((q) => ({
      id: q.id,
      question: q.question,
      type: q.question_type,
      options: q.options,
      points: q.points,
      order: q.question_order,
    })) ?? [],
    attemptsUsed,
    canRetake,
    lastResult: lastResult ? {
      score: lastResult.score,
      passed: lastResult.passed,
      attemptNumber: lastResult.attempt_number,
      completedAt: lastResult.completed_at,
    } : null,
  });
}
