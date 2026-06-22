"use client";

import { useState, useTransition } from "react";
import { Loader2, Search, Eye, CheckCircle2, XCircle, Clock } from "lucide-react";
import { updateApplicationStatus } from "@/lib/actions";
import { cn } from "@/lib/utils";

interface Application {
  id: string;
  reference_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  id_number: string | null;
  date_of_birth: string | null;
  gender: string | null;
  province: string | null;
  employment_status: string | null;
  training_type: string | null;
  motivation: string | null;
  status: string;
  created_at: string;
  reviewed_at: string | null;
  notes: string | null;
  courses: { title: string; slug: string } | null;
}

export function ApplicationsTable({ applications }: { applications: Application[] }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isPending, startTransition] = useTransition();
  const [refreshKey, setRefreshKey] = useState(0);

  const statuses = ["all", "submitted", "under_review", "accepted", "rejected", "waitlisted"];

  const filtered = applications.filter((app) => {
    const matchStatus = filter === "all" || app.status === filter;
    const matchSearch =
      !search ||
      `${app.first_name} ${app.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      app.reference_number.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  function handleStatusUpdate(appId: string, status: "under_review" | "accepted" | "rejected" | "waitlisted") {
    startTransition(() => {
      updateApplicationStatus(appId, status).then(() => {
        setRefreshKey((k) => k + 1);
        if (selectedApp?.id === appId) {
          setSelectedApp({ ...selectedApp, status });
        }
      });
    });
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                filter === s
                  ? "bg-gold text-black"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10"
              )}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or ref..."
            className="w-full rounded-lg border border-white/10 bg-surface py-2 pl-10 pr-4 text-sm text-off-white placeholder:text-white/30 focus:border-gold/50 focus:outline-none sm:w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/5 bg-surface">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No applications found</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium">Applicant</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Email</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">Course</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((app) => (
                <tr key={app.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono text-xs text-gold">{app.reference_number}</td>
                  <td className="px-4 py-3 text-off-white">{app.first_name} {app.last_name}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{app.email}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{app.courses?.title ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {new Date(app.created_at).toLocaleDateString("en-ZA", { day: "2-digit", month: "short" })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-gold"
                    >
                      <Eye className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} of {applications.length} applications</p>

      {/* Detail Panel */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelectedApp(null)}>
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-background p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs text-gold">{selectedApp.reference_number}</p>
                <h3 className="mt-1 text-lg font-bold text-off-white">{selectedApp.first_name} {selectedApp.last_name}</h3>
              </div>
              <StatusBadge status={selectedApp.status} />
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <InfoRow label="Email" value={selectedApp.email} />
              <InfoRow label="Phone" value={selectedApp.phone} />
              <InfoRow label="ID Number" value={selectedApp.id_number} />
              <InfoRow label="Date of Birth" value={selectedApp.date_of_birth} />
              <InfoRow label="Gender" value={selectedApp.gender} />
              <InfoRow label="Province" value={selectedApp.province} />
              <InfoRow label="Employment" value={selectedApp.employment_status} />
              <InfoRow label="Training Type" value={selectedApp.training_type} />
              <InfoRow label="Course" value={selectedApp.courses?.title ?? "—"} />
              {selectedApp.motivation && <InfoRow label="Motivation" value={selectedApp.motivation} />}
              {selectedApp.notes && <InfoRow label="Admin Notes" value={selectedApp.notes} />}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-2">
              {selectedApp.status !== "under_review" && (
                <ActionButton
                  onClick={() => handleStatusUpdate(selectedApp.id, "under_review")}
                  disabled={isPending}
                  icon={Clock}
                  label="Under Review"
                  variant="amber"
                />
              )}
              {selectedApp.status !== "accepted" && (
                <ActionButton
                  onClick={() => handleStatusUpdate(selectedApp.id, "accepted")}
                  disabled={isPending}
                  icon={CheckCircle2}
                  label="Accept"
                  variant="green"
                />
              )}
              {selectedApp.status !== "rejected" && (
                <ActionButton
                  onClick={() => handleStatusUpdate(selectedApp.id, "rejected")}
                  disabled={isPending}
                  icon={XCircle}
                  label="Reject"
                  variant="red"
                />
              )}
            </div>
          </div>
        </div>
      )}
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
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${colors[status] ?? colors.draft}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <span className="w-28 shrink-0 text-muted-foreground">{label}:</span>
      <span className="text-off-white">{value}</span>
    </div>
  );
}

function ActionButton({
  onClick,
  disabled,
  icon: Icon,
  label,
  variant,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  variant: "amber" | "green" | "red";
}) {
  const colors = {
    amber: "border-amber-400/20 text-amber-400 hover:bg-amber-400/10",
    green: "border-green-400/20 text-green-400 hover:bg-green-400/10",
    red: "border-red-400/20 text-red-400 hover:bg-red-400/10",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:opacity-50",
        colors[variant]
      )}
    >
      {disabled ? <Loader2 className="size-3.5 animate-spin" /> : <Icon className="size-3.5" />}
      {label}
    </button>
  );
}
