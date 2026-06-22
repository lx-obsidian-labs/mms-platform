import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Support Tickets",
  robots: { index: false, follow: false },
};

export default async function AdminSupportPage() {
  const supabase = await createClient();

  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("*, students!inner(profiles!inner(first_name, last_name, email))")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-xl font-bold text-off-white">Support Tickets</h1>

      <div className="overflow-x-auto rounded-xl border border-white/5 bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Student</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(!tickets || tickets.length === 0) ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  <LifeBuoy className="mx-auto mb-2 size-5" /> No tickets yet
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => {
                const student = ticket.students as Record<string, unknown> ?? {};
                const profile = student?.profiles as Record<string, unknown> ?? {};
                return (
                  <tr key={ticket.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <p className="font-medium text-off-white">
                        {String(profile.first_name ?? "")} {String(profile.last_name ?? "")}
                      </p>
                      <p className="text-xs text-muted-foreground">{String(profile.email ?? "")}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{ticket.subject}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium",
                        ticket.priority === "urgent" ? "bg-red-500/10 text-red-400" :
                        ticket.priority === "high" ? "bg-orange-500/10 text-orange-400" :
                        ticket.priority === "normal" ? "bg-blue-500/10 text-blue-400" :
                        "bg-gray-500/10 text-gray-400"
                      )}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase",
                        ticket.status === "open" ? "bg-blue-500/10 text-blue-400" :
                        ticket.status === "in_progress" ? "bg-yellow-500/10 text-yellow-400" :
                        ticket.status === "resolved" ? "bg-green-500/10 text-green-400" :
                        "bg-gray-500/10 text-gray-400"
                      )}>
                        {ticket.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button className="rounded-lg border border-white/10 px-3 py-1 text-[11px] text-off-white transition-colors hover:border-gold/30">
                        View
                      </button>
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
