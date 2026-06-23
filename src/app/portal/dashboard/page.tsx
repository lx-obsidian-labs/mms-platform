import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, Award, Bell, TrendingUp, Clock, CheckCircle,
  ArrowRight, Play, GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_COURSES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "Your MMS student dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/portal/dashboard");

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
    .select("*, courses!inner(title, slug, category)")
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

  const recentEnrollment = activeEnrollments.length > 0
    ? activeEnrollments.reduce((a, b) =>
        (a.progress_percentage ?? 0) < (b.progress_percentage ?? 0) ? a : b
      )
    : null;

  const totalProgress = enrollments && enrollments.length > 0
    ? Math.round(enrollments.reduce((a, e) => a + (e.progress_percentage || 0), 0) / enrollments.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-gold/10">
        <div className="absolute inset-0">
          <Image
            src="/images/backgrounds/hero-bg.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/90 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-gold/20">
                <GraduationCap className="size-6 text-gold" />
              </div>
              <div>
                <h1 className="font-display text-2xl text-off-white sm:text-3xl">
                  Welcome back{profile ? `, ${profile.first_name}` : ""}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {student?.student_number
                    ? `Student #${student.student_number}`
                    : "Mpumalanga Mining Solutions"}
                </p>
              </div>
            </div>
          </div>
          {recentEnrollment && (
            <Link
              href={`/portal/courses/${recentEnrollment.courses?.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-industrial-black transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(217,164,0,0.3)]"
            >
              <Play size={16} />
              Continue Learning
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Active Courses"
          value={activeEnrollments.length}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-400"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={completedEnrollments.length}
          iconBg="bg-green-500/10"
          iconColor="text-green-400"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Progress"
          value={`${totalProgress}%`}
          iconBg="bg-gold/10"
          iconColor="text-gold"
        />
        <StatCard
          icon={Bell}
          label="Notifications"
          value={notifications?.length ?? 0}
          iconBg="bg-purple-500/10"
          iconColor="text-purple-400"
        />
      </div>

      {/* Referral Banner */}
      <Link
        href="/portal/refer"
        className="group flex items-center gap-4 rounded-xl border border-gold/10 bg-gradient-to-r from-gold/5 to-surface p-4 transition-all hover:border-gold/30 sm:p-5"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gold/20 transition-colors group-hover:bg-gold/30">
          <Award className="size-5 text-gold" />
        </div>
        <div className="flex-1">
          <p className="font-heading text-sm font-bold text-off-white">Refer & Earn</p>
          <p className="text-xs text-muted-foreground">Partner with us — earn rewards for every student you refer.</p>
        </div>
        <ArrowRight className="size-4 text-gold transition-transform group-hover:translate-x-0.5" />
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Continue Learning (featured) */}
          {recentEnrollment && (
            <section>
              <h2 className="mb-3 font-heading text-lg font-bold text-off-white">Continue Learning</h2>
              <FeaturedCourseCard enrollment={recentEnrollment} />
            </section>
          )}

          {/* All Active Courses */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-off-white">
                {recentEnrollment ? "All Active Courses" : "Current Courses"}
              </h2>
              {activeEnrollments.length > 0 && (
                <Link
                  href="/portal/courses"
                  className="text-xs font-medium text-gold hover:text-gold-light"
                >
                  View all →
                </Link>
              )}
            </div>
            {activeEnrollments.length === 0 ? (
              <div className="rounded-xl border border-white/5 bg-surface p-8 text-center">
                <BookOpen className="mx-auto mb-3 size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No active courses yet.</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your courses will appear here once your enrollment is approved.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {activeEnrollments.map((enrollment) => {
                  const courseInfo = ALL_COURSES.find((c) => c.slug === enrollment.courses?.slug);
                  return (
                    <Link
                      key={enrollment.id}
                      href={`/portal/courses/${enrollment.courses?.slug}`}
                      className="group rounded-xl border border-white/5 bg-surface transition-all hover:border-gold/20"
                    >
                      {/* Course Image */}
                      {courseInfo?.image && (
                        <div className="relative h-36 overflow-hidden rounded-t-xl">
                          <Image
                            src={courseInfo.image}
                            alt={enrollment.courses?.title ?? ""}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                          <span className={cn(
                            "absolute right-2.5 top-2.5 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase",
                            statusBadgeColor(enrollment.status)
                          )}>
                            {enrollment.status}
                          </span>
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-heading text-sm font-bold text-off-white group-hover:text-gold">
                          {enrollment.courses?.title ?? "Course"}
                        </h3>
                        {enrollment.courses?.category && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{enrollment.courses.category}</p>
                        )}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{enrollment.progress_percentage}%</span>
                          </div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-industrial-black">
                            <div
                              className="h-full rounded-full bg-gold transition-all"
                              style={{ width: `${enrollment.progress_percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs font-medium text-gold">
                            Continue <ArrowRight size={12} />
                          </div>
                          <a
                            href={`/api/enrollments/${enrollment.id}/proof-of-registration`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] text-muted-foreground underline-offset-2 hover:text-gold hover:underline"
                          >
                            Proof of Registration
                          </a>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          {student && (
            <div className="rounded-xl border border-white/5 bg-surface p-5">
              <h3 className="font-heading text-sm font-bold text-off-white">Quick Stats</h3>
              <div className="mt-4 space-y-3">
                <QuickStat icon={BookOpen} label="Total Enrolled" value={enrollments?.length ?? 0} />
                <QuickStat icon={Clock} label="In Progress" value={activeEnrollments.length} />
                <QuickStat icon={Award} label="Certificates" value={completedEnrollments.length} />
              </div>
            </div>
          )}

          {/* Application Status */}
          <div className="overflow-hidden rounded-xl border border-white/5 bg-surface">
            {applications && applications.length > 0 ? (
              <div className="p-5">
                <h3 className="font-heading text-sm font-bold text-off-white">Application</h3>
                <div className="mt-3 flex items-center gap-2">
                  <span className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-medium",
                    statusColor(applications[0].status)
                  )}>
                    {applications[0].status.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(applications[0].created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Ref: {applications[0].reference_number}
                </p>
              </div>
            ) : (
              <div className="p-5">
                <h3 className="font-heading text-sm font-bold text-off-white">Application</h3>
                <p className="mt-2 text-xs text-muted-foreground">No applications yet.</p>
                <Link
                  href="/apply"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gold hover:text-gold-light"
                >
                  Apply Now <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>

          {/* Recent Notifications */}
          <div className="rounded-xl border border-white/5 bg-surface p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-off-white">Notifications</h3>
              {notifications && notifications.length > 0 && (
                <Link href="/portal/notifications" className="text-[10px] text-gold hover:text-gold-light">
                  View all
                </Link>
              )}
            </div>
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
              <p className="mt-3 text-xs text-muted-foreground">All clear — no new notifications.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, iconBg, iconColor }: {
  icon: React.ElementType; label: string; value: string | number; iconBg: string; iconColor: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-surface p-5 transition-all hover:border-gold/20">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className={cn("flex size-9 items-center justify-center rounded-lg", iconBg)}>
          <Icon className={cn("size-[18px]", iconColor)} />
        </div>
      </div>
      <p className="mt-3 font-heading text-2xl font-bold text-off-white">{value}</p>
    </div>
  );
}

function QuickStat({ icon: Icon, label, value }: {
  icon: React.ElementType; label: string; value: string | number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="size-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className="text-xs font-bold text-off-white">{value}</span>
    </div>
  );
}

function FeaturedCourseCard({ enrollment }: { enrollment: Record<string, unknown> }) {
  const courseInfo = ALL_COURSES.find(
    (c) => c.slug === (enrollment.courses as Record<string, unknown>)?.slug
  );

  return (
    <Link
      href={`/portal/courses/${(enrollment.courses as Record<string, unknown>)?.slug}`}
      className="group relative flex overflow-hidden rounded-xl border border-white/5 bg-surface transition-all hover:border-gold/20"
    >
      {courseInfo?.image && (
        <div className="relative hidden h-auto w-48 shrink-0 sm:block">
          <Image
            src={courseInfo.image}
            alt={(enrollment.courses as Record<string, unknown>)?.title as string ?? ""}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface" />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-center p-5">
        <h3 className="font-heading font-bold text-off-white group-hover:text-gold">
          {(enrollment.courses as Record<string, unknown>)?.title as string ?? "Course"}
        </h3>
        <div className="mt-2 flex items-center gap-4">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Play size={12} /> {(enrollment.progress_percentage as number) ?? 0}% complete
          </span>
          {!!(enrollment.courses as Record<string, unknown>)?.category && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              {(enrollment.courses as Record<string, unknown>)?.category as string}
            </span>
          )}
        </div>
        <div className="mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-industrial-black">
          <div
            className="h-full rounded-full bg-gold transition-all"
            style={{ width: `${(enrollment.progress_percentage as number) ?? 0}%` }}
          />
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-gold">
          Continue Learning <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  );
}

function statusBadgeColor(status: string): string {
  switch (status) {
    case "active": return "bg-green-500/10 text-green-400";
    case "completed": return "bg-blue-500/10 text-blue-400";
    case "suspended": return "bg-red-500/10 text-red-400";
    case "withdrawn": return "bg-gray-500/10 text-gray-400";
    case "failed": return "bg-red-500/10 text-red-400";
    default: return "bg-yellow-500/10 text-yellow-400";
  }
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
