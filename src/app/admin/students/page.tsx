import type { Metadata } from "next";
import { Users, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Students" };

export default async function AdminStudentsPage() {
  const supabase = await createClient();

  const { data: students } = await supabase
    .from("students")
    .select("*, profiles(first_name, last_name, email)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-purple-400/10">
          <Users className="size-5 text-purple-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl tracking-wide text-off-white lg:text-3xl">Students</h1>
          <p className="text-sm text-muted-foreground">View and manage enrolled students</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-surface">
        {!students || students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Users className="size-10 text-white/20" />
            <p className="mt-4 text-sm text-muted-foreground">No students enrolled yet</p>
            <p className="mt-1 text-xs text-white/30">Students will appear here once applications are accepted and processed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Student #</th>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="hidden px-5 py-3 font-medium md:table-cell">Email</th>
                  <th className="hidden px-5 py-3 font-medium lg:table-cell">Province</th>
                  <th className="px-5 py-3 font-medium">Enrolled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.map((student: Record<string, unknown>) => {
                  const profile = student.profiles as Record<string, unknown> | null;
                  return (
                    <tr key={String(student.id)} className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-5 py-3 font-mono text-xs text-gold">{String(student.student_number)}</td>
                      <td className="px-5 py-3 text-off-white">
                        {profile ? `${String(profile.first_name ?? "")} ${String(profile.last_name ?? "")}` : "—"}
                      </td>
                      <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">
                        {profile ? String(profile.email ?? "—") : "—"}
                      </td>
                      <td className="hidden px-5 py-3 text-muted-foreground lg:table-cell">{String(student.province ?? "—")}</td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {new Date(String(student.created_at)).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
