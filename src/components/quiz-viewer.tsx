"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizData {
  quiz: {
    id: string; title: string; description: string | null;
    passingScore: number; maxAttempts: number; timeLimitMinutes: number | null;
  } | null;
  questions: Array<{ id: string; question: string; type: string; options: string[] | null; points: number; order: number }>;
  attemptsUsed: number;
  canRetake: boolean;
  lastResult: { score: number; passed: boolean; attemptNumber: number; completedAt: string } | null;
  message?: string;
}

export function QuizViewer({ lessonId, enrollmentId }: { lessonId: string; enrollmentId: string }) {
  const [data, setData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number; passed: boolean; passingScore: number;
    totalPoints: number; earnedPoints: number; graded: Record<string, { correct: boolean; correctAnswer: string }>;
  } | null>(null);

  const fetchQuiz = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quizzes/${lessonId}`);
      const d = await res.json();
      setData(d);
    } catch { setError("Failed to load quiz"); }
    setLoading(false);
  }, [lessonId]);

  useEffect(() => { fetchQuiz(); }, [fetchQuiz]);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/quizzes/${lessonId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const r = await res.json();
      if (r.error) { setError(r.error); return; }
      setResult(r);
    } catch { setError("Failed to submit quiz"); }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-white/5 bg-surface py-16">
        <Loader2 className="size-8 animate-spin text-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
        <AlertCircle className="mx-auto mb-3 size-8 text-red-400" />
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  // No quiz configured
  if (!data?.quiz) {
    return (
      <div className="rounded-xl border border-white/5 bg-surface p-8 text-center">
        <Award className="mx-auto mb-3 size-10 text-gold/40" />
        <h3 className="font-heading font-bold text-off-white">Quiz Not Available</h3>
        <p className="mt-2 text-sm text-muted-foreground">{data?.message ?? "This lesson has no quiz configured yet."}</p>
      </div>
    );
  }

  // Show last result if exists and not retaking
  if (data.lastResult && !started && !result) {
    const passed = data.lastResult.passed;
    return (
      <div className="rounded-xl border border-white/5 bg-surface p-8 text-center">
        <div className={cn("mx-auto mb-4 flex size-16 items-center justify-center rounded-full", passed ? "bg-green-500/10" : "bg-red-500/10")}>
          {passed ? <CheckCircle className="size-8 text-green-400" /> : <XCircle className="size-8 text-red-400" />}
        </div>
        <h3 className="font-heading text-lg font-bold text-off-white">
          {passed ? "Quiz Passed" : "Quiz Attempt"}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {passed ? "Great job! You passed this quiz." : "You did not pass this quiz."}
        </p>
        <p className="mt-1 text-sm">
          <span className="font-bold text-gold">{data.lastResult.score}%</span>
          <span className="text-muted-foreground"> (passing: {data.quiz.passingScore}%)</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Attempt {data.lastResult.attemptNumber} of {data.quiz.maxAttempts || "unlimited"}
        </p>
        {data.canRetake && (
          <button onClick={() => setStarted(true)} className="mt-4 rounded-lg bg-gold px-6 py-2 text-sm font-bold text-black transition-all hover:bg-gold-light">
            Retake Quiz
          </button>
        )}
      </div>
    );
  }

  // Show result after submission
  if (result) {
    const correctCount = Object.values(result.graded).filter((g) => g.correct).length;
    const totalCount = Object.keys(result.graded).length;
    return (
      <div className="rounded-xl border border-white/5 bg-surface p-8">
        <div className="text-center">
          <div className={cn("mx-auto mb-4 flex size-16 items-center justify-center rounded-full", result.passed ? "bg-green-500/10" : "bg-red-500/10")}>
            {result.passed ? <CheckCircle className="size-8 text-green-400" /> : <XCircle className="size-8 text-red-400" />}
          </div>
          <h3 className="font-heading text-xl font-bold text-off-white">{result.passed ? "Passed!" : "Not Passed"}</h3>
          <p className="mt-2 text-sm text-muted-foreground">Your score: <span className="font-bold text-gold">{result.score}%</span> (passing: {result.passingScore}%)</p>
          <p className="text-xs text-muted-foreground">{correctCount}/{totalCount} correct &middot; {result.earnedPoints}/{result.totalPoints} points</p>
        </div>

        {!result.passed && (
          <div className="mt-6 space-y-3">
            {data.questions.map((q) => {
              const g = result.graded[q.id];
              return (
                <div key={q.id} className={cn("rounded-lg border p-4", g?.correct ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5")}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-off-white">{q.question}</p>
                    {g ? (g.correct ? <CheckCircle className="mt-0.5 size-4 shrink-0 text-green-400" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-red-400" />) : null}
                  </div>
                  {!g?.correct && g && (
                    <p className="mt-1 text-xs text-muted-foreground">Correct answer: <span className="text-gold">{g.correctAnswer}</span></p>
                  )}
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{q.points} point{q.points !== 1 ? "s" : ""}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Quiz taking UI
  const question = data.questions[currentQ];
  if (!question) {
    return <div className="py-8 text-center text-sm text-muted-foreground">No questions available</div>;
  }

  return (
    <div className="rounded-xl border border-white/5 bg-surface">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-off-white">{data.quiz.title}</h3>
            {data.quiz.description && <p className="mt-0.5 text-xs text-muted-foreground">{data.quiz.description}</p>}
          </div>
          <div className="text-right text-xs text-muted-foreground">
            {currentQ + 1} of {data.questions.length}
          </div>
        </div>
        <div className="mt-3 flex gap-1">
          {data.questions.map((_, i) => (
            <button key={i} onClick={() => setCurrentQ(i)}
              className={cn("h-1.5 flex-1 rounded-full transition-colors",
                answers[data.questions[i].id] ? "bg-gold" : "bg-white/10",
                i === currentQ && "ring-1 ring-gold"
              )} />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.15 }}>
            <p className="mb-4 text-sm font-medium text-off-white">{question.question}</p>

            {question.type === "true_false" && (
              <div className="flex gap-3">
                {["True", "False"].map((opt) => (
                  <button key={opt} onClick={() => setAnswers({ ...answers, [question.id]: opt })}
                    className={cn("flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-all",
                      answers[question.id] === opt ? "border-gold bg-gold/10 text-gold" : "border-white/10 text-muted-foreground hover:border-white/20"
                    )}>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {question.type === "multiple_choice" && question.options && (
              <div className="space-y-2">
                {question.options.map((opt, i) => (
                  <button key={i} onClick={() => setAnswers({ ...answers, [question.id]: opt })}
                    className={cn("w-full rounded-lg border px-4 py-3 text-left text-sm transition-all",
                      answers[question.id] === opt ? "border-gold bg-gold/10 text-gold" : "border-white/10 text-muted-foreground hover:border-white/20"
                    )}>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {question.type === "short_answer" && (
              <input type="text" value={answers[question.id] ?? ""}
                onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                placeholder="Type your answer..."
                className="w-full rounded-lg border border-white/10 bg-industrial-black px-4 py-3 text-sm text-off-white placeholder:text-white/20 focus:border-gold/40 focus:outline-none"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Points */}
        <p className="mt-3 text-[10px] text-muted-foreground">{question.points} point{question.points !== 1 ? "s" : ""}</p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-white/5 px-6 py-4">
        <button onClick={() => setCurrentQ((p) => Math.max(0, p - 1))} disabled={currentQ === 0}
          className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-gold/20 hover:text-gold disabled:opacity-30">
          <ChevronLeft size={14} /> Previous
        </button>

        {currentQ < data.questions.length - 1 ? (
          <button onClick={() => setCurrentQ((p) => Math.min(data.questions.length - 1, p + 1))}
            className="flex items-center gap-1 rounded-lg bg-gold px-4 py-2 text-xs font-bold text-black transition-all hover:bg-gold-light">
            Next <ChevronRight size={14} />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting}
            className="flex items-center gap-1.5 rounded-lg bg-green-600 px-5 py-2 text-xs font-bold text-white transition-all hover:bg-green-500 disabled:opacity-50">
            {submitting ? <Loader2 className="size-3.5 animate-spin" /> : <Award size={14} />}
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </div>
    </div>
  );
}
