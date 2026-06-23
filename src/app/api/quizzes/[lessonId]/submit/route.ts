import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ lessonId: string }> };

export async function POST(request: NextRequest, { params }: Props) {
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

  const { data: quiz } = await supabase
    .from("quizzes").select("id, passing_score, max_attempts")
    .eq("course_id", lesson.course_id).eq("is_published", true).maybeSingle();
  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  // Count existing attempts
  const { count: attemptCount } = await supabase
    .from("quiz_results").select("*", { count: "exact", head: true })
    .eq("student_id", student.id).eq("quiz_id", quiz.id);

  if (quiz.max_attempts > 0 && (attemptCount ?? 0) >= quiz.max_attempts) {
    return NextResponse.json({ error: "Maximum attempts reached" }, { status: 403 });
  }

  const { answers } = await request.json();
  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ error: "Answers required" }, { status: 400 });
  }

  const { data: questions } = await supabase
    .from("quiz_questions").select("id, correct_answer, points")
    .eq("quiz_id", quiz.id);

  let totalPoints = 0;
  let earnedPoints = 0;
  const graded: Record<string, { correct: boolean; correctAnswer: string; points: number }> = {};

  for (const q of questions ?? []) {
    totalPoints += q.points;
    const userAnswer = answers[q.id]?.trim() ?? "";
    const isCorrect = userAnswer.toLowerCase() === (q.correct_answer?.trim() ?? "").toLowerCase();
    if (isCorrect) earnedPoints += q.points;
    graded[q.id] = { correct: isCorrect, correctAnswer: q.correct_answer ?? "", points: q.points };
  }

  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const passed = score >= quiz.passing_score;

  const { data: result } = await supabase
    .from("quiz_results")
    .insert({
      student_id: student.id,
      quiz_id: quiz.id,
      score,
      passed,
      attempt_number: (attemptCount ?? 0) + 1,
      answers,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  // If passed, auto-mark the lesson as complete
  if (passed) {
    const { data: existing } = await supabase
      .from("lesson_progress")
      .select("id")
      .eq("enrollment_id", enrollment.id)
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (!existing) {
      await supabase.from("lesson_progress").insert({
        enrollment_id: enrollment.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      });
    }

    // Recalculate course progress
    const { count: total } = await supabase
      .from("lessons").select("*", { count: "exact", head: true })
      .eq("course_id", lesson.course_id).eq("is_published", true);

    const { count: done } = await supabase
      .from("lesson_progress").select("*", { count: "exact", head: true })
      .eq("enrollment_id", enrollment.id).eq("completed", true);

    const pct = total && total > 0 ? Math.round(((done ?? 0) / total) * 100) : 0;
    await supabase.from("enrollments").update({ progress_percentage: pct }).eq("id", enrollment.id);
  }

  return NextResponse.json({
    score,
    passed,
    passingScore: quiz.passing_score,
    totalPoints,
    earnedPoints,
    graded,
    resultId: result?.id,
  });
}
