import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Users, UserPlus, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Instructor Management",
  robots: { index: false, follow: false },
};

export default async function AdminInstructorsPage() {
  const supabase = await createClient();

  const { data: instructors } = await supabase
    .from("instructors")
    .select("*, profiles(first_name, last_name, email)")
    .order("created_at", { ascending: false });

  const { data: assignments } = await supabase
    .from("course_assignments")
    .select("*, courses(title)");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-off-white">Instructor Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage training facilitators and their course assignments.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/5 bg-surface p-4">
          <p className="text-xs text-muted-foreground">Total Instructors</p>
          <p className="mt-1 font-heading text-2xl font-bold text-off-white">{instructors?.length ?? 0}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-surface p-4">
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="mt-1 font-heading text-2xl font-bold text-green-400">
            {instructors?.filter((i) => i.status === "active").length ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-white/5 bg-surface p-4">
          <p className="text-xs text-muted-foreground">Course Assignments</p>
          <p className="mt-1 font-heading text-2xl font-bold text-gold">{assignments?.length ?? 0}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/5 bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Instructor</th>
              <th className="px-4 py-3 font-medium">Employee #</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Specialization</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Courses</th>
            </tr>
          </thead>
          <tbody>
            {(!instructors || instructors.length === 0) ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  <Users className="mx-auto mb-2 size-5" /> No instructors found
                </td>
              </tr>
            ) : (
              instructors.map((instructor) => {
                const profile = instructor.profiles as Record<string, unknown> ?? {};
                const courseAssignments = assignments?.filter((a) => a.instructor_id === instructor.id) ?? [];
                return (
                  <tr key={instructor.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <p className="font-medium text-off-white">
                        {String(profile.first_name ?? "")} {String(profile.last_name ?? "")}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gold">{instructor.employee_number}</td>
                    <td className="px-4 py-3 text-muted-foreground">{String(profile.email ?? "")}</td>
                    <td className="px-4 py-3 text-muted-foreground">{instructor.specialization ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-medium",
                        instructor.status === "active" ? "bg-green-500/10 text-green-400" :
                        instructor.status === "inactive" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"
                      )}>
                        {instructor.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {courseAssignments.length > 0
                        ? courseAssignments.map((a) => (a.courses as Record<string, unknown>)?.title as string ?? "Untitled").join(", ")
                        : "No assignments"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
