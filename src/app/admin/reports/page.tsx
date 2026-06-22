import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Award,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  BookOpen,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reports",
  robots: { index: false, follow: false },
};

export default async function AdminReportsPage() {
  const supabase = await createClient();

  const [studentsCount, appsResult, coursesResult, certsResult, paymentsResult, enrollmentsResult, ticketsResult] =
    await Promise.all([
      supabase.from("students").select("*", { count: "exact", head: true }),
      supabase.from("applications").select("status"),
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("certificates").select("status"),
      supabase.from("payments").select("id, amount, status, paid_at, reference, payment_method, students!inner(profiles!inner(first_name, last_name))").order("created_at", { ascending: false }).limit(20),
      supabase.from("enrollments").select("status, courses(title)"),
      supabase.from("support_tickets").select("status"),
    ]);

  const totalStudents = studentsCount.count ?? 0;
  const totalCourses = coursesResult.count ?? 0;

  const appStatuses = appsResult.data ?? [];
  const submitted = appStatuses.filter((a) => a.status === "submitted").length;
  const underReview = appStatuses.filter((a) => a.status === "under_review").length;
  const accepted = appStatuses.filter((a) => a.status === "accepted").length;
  const rejected = appStatuses.filter((a) => a.status === "rejected").length;
  const totalApps = appStatuses.length;

  const certStatuses = certsResult.data ?? [];
  const certsIssued = certStatuses.filter((c) => c.status === "issued").length;
  const certsPending = certStatuses.filter((c) => c.status === "pending").length;
  const totalCerts = certStatuses.length;

  const enrData = enrollmentsResult.data ?? [];
  const enrActive = enrData.filter((e) => e.status === "active").length;
  const enrCompleted = enrData.filter((e) => e.status === "completed").length;
  const totalEnrollments = enrData.length;

  const payments = paymentsResult.data ?? [];
  const totalRevenue = payments.filter((p) => (p as { status: string }).status === "paid").reduce((sum, p) => sum + Number((p as { amount: number }).amount), 0);
  const pendingRevenue = payments.filter((p) => (p as { status: string }).status === "pending").reduce((sum, p) => sum + Number((p as { amount: number }).amount), 0);

  const ticketData = ticketsResult.data ?? [];
  const openTickets = ticketData.filter((t) => t.status === "open" || t.status === "in_progress").length;
  const resolvedTickets = ticketData.filter((t) => t.status === "resolved" || t.status === "closed").length;

  const courseEnrollments = new Map<string, number>();
  for (const e of enrData) {
    const crs = (e as unknown as { courses: { title: string }[] }).courses;
    const title = crs?.[0]?.title ?? "Unknown";
    courseEnrollments.set(title, (courseEnrollments.get(title) ?? 0) + 1);
  }
  const topCourses = [...courseEnrollments.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const monthlyPayments = new Map<string, number>();
  for (const p of payments) {
    const pStatus = (p as { status: string }).status;
    const pPaidAt = (p as { paid_at: string | null }).paid_at;
    if (pStatus === "paid" && pPaidAt) {
      const key = new Date(pPaidAt).toLocaleString("en-ZA", { month: "short", year: "2-digit" });
      monthlyPayments.set(key, (monthlyPayments.get(key) ?? 0) + Number((p as { amount: number }).amount));
    }
  }
  const revenueData = [...monthlyPayments.entries()].reverse();
  const maxRevenue = Math.max(...revenueData.map(([, v]) => v), 1);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-gold/10">
          <BarChart3 className="size-5 text-gold" />
        </div>
        <div>
          <h1 className="font-display text-2xl tracking-wide text-off-white lg:text-3xl">Reports</h1>
          <p className="text-sm text-muted-foreground">Institution-wide analytics and performance metrics</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total Students" value={totalStudents} color="blue" />
        <StatCard icon={FileText} label="Applications" value={totalApps} color="gold" />
        <StatCard icon={BookOpen} label="Enrollments" value={totalEnrollments} color="purple" />
        <StatCard icon={Award} label="Certificates" value={totalCerts} color="green" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/5 bg-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold text-off-white">Revenue Overview</h2>
              <p className="text-xs text-muted-foreground">Monthly collections</p>
            </div>
            <div className="text-right">
              <p className="font-heading text-lg font-bold text-gold">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">Collected</p>
            </div>
          </div>
          {revenueData.length > 0 ? (
            <div className="flex items-end gap-2">
              {revenueData.map(([month, amount]) => (
                <div key={month} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">{formatCurrency(amount)}</span>
                  <div
                    className="w-full rounded-t-sm bg-gold/70 transition-all hover:bg-gold"
                    style={{ height: `${(amount / maxRevenue) * 120}px` }}
                  />
                  <span className="text-[10px] text-muted-foreground">{month}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              No payment data yet
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/5 bg-surface p-6">
          <h2 className="mb-4 font-heading text-lg font-bold text-off-white">Course Popularity</h2>
          {topCourses.length > 0 ? (
            <div className="space-y-3">
              {topCourses.map(([title, count]) => {
                const maxCount = topCourses[0][1];
                return (
                  <div key={title}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-off-white">{title}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gold transition-all"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              No enrollment data yet
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-white/5 bg-surface p-6">
          <h2 className="mb-4 font-heading text-lg font-bold text-off-white">Applications</h2>
          <div className="space-y-4">
            <StatusRow label="Submitted" value={submitted} total={totalApps} color="bg-blue-500" />
            <StatusRow label="Under Review" value={underReview} total={totalApps} color="bg-yellow-500" />
            <StatusRow label="Accepted" value={accepted} total={totalApps} color="bg-green-500" />
            <StatusRow label="Rejected" value={rejected} total={totalApps} color="bg-red-500" />
          </div>
        </div>
        <div className="rounded-xl border border-white/5 bg-surface p-6">
          <h2 className="mb-4 font-heading text-lg font-bold text-off-white">Enrollments</h2>
          <div className="space-y-4">
            <StatusRow label="Active" value={enrActive} total={totalEnrollments} color="bg-green-500" />
            <StatusRow label="Completed" value={enrCompleted} total={totalEnrollments} color="bg-blue-500" />
            <StatusRow label="Other" value={totalEnrollments - enrActive - enrCompleted} total={totalEnrollments} color="bg-white/20" />
          </div>
        </div>
        <div className="rounded-xl border border-white/5 bg-surface p-6">
          <h2 className="mb-4 font-heading text-lg font-bold text-off-white">Support Tickets</h2>
          <div className="space-y-4">
            <StatusRow label="Open" value={openTickets} total={ticketData.length} color="bg-red-500" />
            <StatusRow label="Resolved" value={resolvedTickets} total={ticketData.length} color="bg-green-500" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-industrial-black p-3 text-center">
              <CreditCard className="mx-auto mb-1 size-4 text-gold" />
              <p className="text-xs text-muted-foreground">Pending Revenue</p>
              <p className="font-heading text-sm font-bold text-yellow-400">{formatCurrency(pendingRevenue)}</p>
            </div>
            <div className="rounded-lg bg-industrial-black p-3 text-center">
              <TrendingUp className="mx-auto mb-1 size-4 text-gold" />
              <p className="text-xs text-muted-foreground">Courses</p>
              <p className="font-heading text-sm font-bold text-off-white">{totalCourses}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-surface">
        <div className="flex items-center gap-2 border-b border-white/5 px-5 py-4">
          <CreditCard className="size-4 text-gold" />
          <h2 className="font-heading font-bold text-off-white">Recent Payments</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Student</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  No payments yet
                </td>
              </tr>
            ) : (
              payments.map((p) => {
                const student = (p.students as unknown as { profiles: { first_name: string; last_name: string }[] });
                const profile = student?.profiles?.[0];
                return (
                  <tr key={(p as { id: string }).id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                    <td className="px-4 py-3 text-off-white">
                      {profile?.first_name ?? ""} {profile?.last_name ?? ""}
                    </td>
                    <td className="px-4 py-3 font-medium text-off-white">{formatCurrency(Number((p as { amount: number }).amount))}</td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">{(p as { payment_method: string | null }).payment_method ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-medium",
                          (p as { status: string }).status === "paid" && "bg-green-500/10 text-green-400",
                          (p as { status: string }).status === "pending" && "bg-yellow-500/10 text-yellow-400",
                          (p as { status: string }).status === "failed" && "bg-red-500/10 text-red-400",
                          (p as { status: string }).status === "refunded" && "bg-blue-500/10 text-blue-400",
                        )}
                      >
                        {(p as { status: string }).status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {(p as { paid_at: string | null }).paid_at
                        ? new Date((p as { paid_at: string }).paid_at).toLocaleDateString("en-ZA")
                        : "—"}
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

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: "blue" | "gold" | "purple" | "green";
}) {
  const colorMap = {
    blue: "bg-blue-500/10 text-blue-400",
    gold: "bg-gold/10 text-gold",
    purple: "bg-purple-500/10 text-purple-400",
    green: "bg-green-500/10 text-green-400",
  };
  return (
    <div className="rounded-xl border border-white/5 bg-surface p-4">
      <div className="flex items-center gap-3">
        <div className={cn("flex size-10 items-center justify-center rounded-lg", colorMap[color])}>
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-heading text-2xl font-bold text-off-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-off-white">
          {value} <span className="text-xs text-muted-foreground">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
