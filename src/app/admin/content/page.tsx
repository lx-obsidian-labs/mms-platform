import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { BookOpen, Plus, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Learning Content",
  robots: { index: false, follow: false },
};

export default async function AdminContentPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, slug, is_active, is_featured")
    .order("title");

  const { data: modules } = await supabase
    .from("modules")
    .select("*, courses(title)")
    .order("module_order");

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*, courses!inner(title)")
    .order("order_index");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-off-white">Learning Content</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage courses, modules, and lessons.</p>
        </div>
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-xs font-bold text-industrial-black transition-all hover:bg-gold-light"
        >
          <Plus size={14} />
          Manage Courses
        </Link>
      </div>

      {/* Courses Overview */}
      <div className="rounded-xl border border-white/5 bg-surface">
        <div className="border-b border-white/5 px-6 py-4">
          <h2 className="font-heading text-sm font-bold text-off-white">Courses ({courses?.length ?? 0})</h2>
        </div>
        <div className="divide-y divide-white/5">
          {(!courses || courses.length === 0) ? (
            <div className="px-6 py-12 text-center text-muted-foreground">No courses found.</div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  <BookOpen className="size-4 text-gold" />
                  <div>
                    <p className="text-sm font-medium text-off-white">{course.title}</p>
                    <p className="text-xs text-muted-foreground">/{course.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]",
                    course.is_active ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                  )}>
                    {course.is_active ? <Eye size={10} /> : <EyeOff size={10} />}
                    {course.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modules & Lessons */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-white/5 bg-surface">
          <div className="border-b border-white/5 px-6 py-4">
            <h2 className="font-heading text-sm font-bold text-off-white">Modules ({modules?.length ?? 0})</h2>
          </div>
          <div className="divide-y divide-white/5">
            {(!modules || modules.length === 0) ? (
              <div className="px-6 py-12 text-center text-muted-foreground">No modules created yet.</div>
            ) : (
              modules.map((mod) => (
                <div key={mod.id} className="px-6 py-3">
                  <p className="text-sm font-medium text-off-white">{mod.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {(mod.courses as Record<string, unknown>)?.title as string ?? "Unknown course"} · Order {mod.module_order}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-surface">
          <div className="border-b border-white/5 px-6 py-4">
            <h2 className="font-heading text-sm font-bold text-off-white">Lessons ({lessons?.length ?? 0})</h2>
          </div>
          <div className="divide-y divide-white/5">
            {(!lessons || lessons.length === 0) ? (
              <div className="px-6 py-12 text-center text-muted-foreground">No lessons created yet.</div>
            ) : (
              lessons.map((lesson) => (
                <div key={lesson.id} className="px-6 py-3">
                  <p className="text-sm font-medium text-off-white">{lesson.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {(lesson.courses as Record<string, unknown>)?.title as string ?? "Unknown"} · {lesson.lesson_type} · {lesson.duration_minutes}min
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
