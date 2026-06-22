import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BookOpen, Award, Bell, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "Your MMS student dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/portal/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, courses(title, slug)")
    .eq("student_id", student?.id ?? "")
    .order("created_at", { ascending: false });

  const { data: applications } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_read", false)
    .order("created_at", { ascending: false })
    .limit(5);

  const activeEnrollments = enrollments?.filter((e) => e.status === "active") ?? [];
  const completedEnrollments = enrollments?.filter((e) => e.status === "completed") ?? [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-xl border border-gold/10 bg-gradient-to-r from-gold/5 to-surface p-6 lg:p-8">
        <h1 className="font-display text-3xl text-off-white sm:text-4xl">
          WELCOME{profile ? `, ${profile.first_name?.toUpperCase()}` : ""}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your training journey at Mpumalanga Mining Solutions
        </p>
        {student?.student_number && (
          <p className="mt-2 text-xs text-gold">
            Student Number: {student.student_number}
          </p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Active Courses"
          value={activeEnrollments.length}
          color="text-blue-400"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={completedEnrollments.length}
          color="text-green-400"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Progress"
          value={enrollments && enrollments.length > 0
            ? `${Math.round(enrollments.reduce((a, e) => a + (e.progress_percentage || 0), 0) / enrollments.length)}%`
            : "0%"}
          color="text-gold"
        />
        <StatCard
          icon={Bell}
          label="Notifications"
          value={notifications?.length ?? 0}
          color="text-purple-400"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Current Courses */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-heading text-lg font-bold text-off-white">Current Courses</h2>
          {activeEnrollments.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-surface p-8 text-center">
              <BookOpen className="mx-auto mb-3 size-8 text-muted-foreground" />
              <p className="text-muted-foreground">No active courses yet.</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Your courses will appear here once your enrollment is approved.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {activeEnrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="rounded-xl border border-white/5 bg-surface p-5 transition-all hover:border-gold/20"
                >
                  <h3 className="font-heading font-bold text-off-white">
                    {enrollment.courses?.title ?? "Course"}
                  </h3>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{enrollment.progress_percentage}%</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-industrial-black">
                      <div
                        className="h-full rounded-full bg-gold transition-all"
                        style={{ width: `${enrollment.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                  <a
                    href={`/portal/courses/${enrollment.courses?.slug ?? enrollment.course_id}`}
                    className="mt-4 inline-flex items-center text-xs font-medium text-gold hover:text-gold-light"
                  >
                    Continue Learning →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Application Status */}
          <div className="rounded-xl border border-white/5 bg-surface p-5">
            <h3 className="font-heading text-sm font-bold text-off-white">Application Status</h3>
            {applications && applications.length > 0 ? (
              <div className="mt-3">
                <div className={cn(
                  "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                  statusColor(applications[0].status)
                )}>
                  {applications[0].status.replace("_", " ")}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Ref: {applications[0].reference_number}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">No applications yet.</p>
            )}
          </div>

          {/* Recent Notifications */}
          <div className="rounded-xl border border-white/5 bg-surface p-5">
            <h3 className="font-heading text-sm font-bold text-off-white">Recent Notifications</h3>
            {notifications && notifications.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {notifications.slice(0, 3).map((n) => (
                  <li key={n.id} className="border-b border-white/5 pb-2 last:border-0">
                    <p className="text-xs font-medium text-off-white">{n.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">{n.message}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">No new notifications.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <Icon className={cn("size-5", color)} />
      </div>
      <p className="mt-2 font-heading text-2xl font-bold text-off-white">{value}</p>
    </div>
  );
}

function statusColor(status: string): string {
  switch (status) {
    case "submitted": return "bg-blue-500/10 text-blue-400";
    case "under_review": return "bg-yellow-500/10 text-yellow-400";
    case "accepted": return "bg-green-500/10 text-green-400";
    case "rejected": return "bg-red-500/10 text-red-400";
    case "waitlisted": return "bg-purple-500/10 text-purple-400";
    default: return "bg-gray-500/10 text-gray-400";
  }
}
