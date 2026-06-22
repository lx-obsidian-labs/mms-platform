import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Users,
  BookOpen,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { getDashboardStats, getApplications } from "@/lib/actions";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const [stats, recentApps] = await Promise.all([
    getDashboardStats(),
    getApplications({ search: "" }),
  ]);

  const statCards = [
    {
      label: "Total Applications",
      value: stats.totalApplications,
      icon: FileText,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      href: "/admin/applications",
    },
    {
      label: "Pending Review",
      value: stats.pendingApplications,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      href: "/admin/applications?status=submitted",
    },
    {
      label: "Accepted",
      value: stats.acceptedApplications,
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-400/10",
      href: "/admin/applications?status=accepted",
    },
    {
      label: "Active Students",
      value: stats.totalStudents,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      href: "/admin/students",
    },
    {
      label: "Active Enrollments",
      value: stats.activeEnrollments,
      icon: TrendingUp,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      href: "/admin/students",
    },
    {
      label: "Active Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "text-gold",
      bg: "bg-gold/10",
      href: "/admin/courses",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl tracking-wide text-off-white lg:text-4xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome to the MMS Admin Management Portal</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-xl border border-white/5 bg-surface p-5 transition-colors hover:border-gold/20"
            >
              <div className="flex items-center justify-between">
                <div className={`flex size-10 items-center justify-center rounded-lg ${card.bg}`}>
                  <Icon className={`size-5 ${card.color}`} />
                </div>
                <ArrowUpRight className="size-4 text-white/20 transition-colors group-hover:text-gold" />
              </div>
              <p className="mt-4 text-2xl font-bold text-off-white">{card.value}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{card.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Applications */}
      <div className="rounded-xl border border-white/5 bg-surface">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <h2 className="text-sm font-semibold text-off-white">Recent Applications</h2>
          <Link
            href="/admin/applications"
            className="text-xs font-medium text-gold hover:underline"
          >
            View All →
          </Link>
        </div>

        {recentApps.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="size-8 text-white/20" />
            <p className="mt-3 text-sm text-muted-foreground">No applications yet</p>
            <p className="text-xs text-white/30">Applications will appear here once students submit the enrollment form.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Reference</th>
                  <th className="px-5 py-3 font-medium">Applicant</th>
                  <th className="px-5 py-3 font-medium">Course</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentApps.data.slice(0, 8).map((app: Record<string, unknown>) => (
                  <tr key={String(app.id)} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-mono text-xs text-gold">{String(app.reference_number)}</td>
                    <td className="px-5 py-3 text-off-white">
                      {String(app.first_name)} {String(app.last_name)}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {app.courses ? String((app.courses as Record<string, unknown>).title ?? "—") : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={String(app.status)} />
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(String(app.created_at)).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <QuickAction href="/admin/applications" icon={FileText} label="Review Applications" description="Process pending enrollment applications" />
        <QuickAction href="/admin/students" icon={Users} label="Manage Students" description="View and manage student records" />
        <QuickAction href="/admin/courses" icon={BookOpen} label="Manage Courses" description="Update course information and pricing" />
      </div>
    </div>
  );
}

// ============================================
// HELPERS
// ============================================

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    submitted: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    under_review: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    accepted: "bg-green-400/10 text-green-400 border-green-400/20",
    rejected: "bg-red-400/10 text-red-400 border-red-400/20",
    waitlisted: "bg-purple-400/10 text-purple-400 border-purple-400/20",
    draft: "bg-white/5 text-white/50 border-white/10",
  };

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[status] ?? colors.draft}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function QuickAction({ href, icon: Icon, label, description }: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-white/5 bg-surface p-5 transition-all hover:border-gold/20 hover:bg-surface/80"
    >
      <Icon className="size-5 text-gold/60 transition-colors group-hover:text-gold" />
      <p className="mt-3 text-sm font-semibold text-off-white">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </Link>
  );
}
