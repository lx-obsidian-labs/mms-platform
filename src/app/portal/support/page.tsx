import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LifeBuoy, Mail, Phone, MessageSquare, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Support",
  robots: { index: false, follow: false },
};

export default async function PortalSupportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("student_id", student?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold text-off-white">Support</h1>
        <Link
          href="/portal/support/new"
          className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-xs font-bold text-industrial-black transition-all hover:bg-gold-light"
        >
          <Plus size={14} />
          New Ticket
        </Link>
      </div>

      {/* Quick Contact */}
      <div className="grid gap-4 sm:grid-cols-3">
        <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-3 rounded-xl border border-white/5 bg-surface p-4 transition-all hover:border-gold/20">
          <Phone className="size-5 text-gold" />
          <div>
            <p className="text-xs font-medium text-off-white">Call Us</p>
            <p className="text-xs text-muted-foreground">{COMPANY.phone}</p>
          </div>
        </a>
        <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-3 rounded-xl border border-white/5 bg-surface p-4 transition-all hover:border-gold/20">
          <Mail className="size-5 text-gold" />
          <div>
            <p className="text-xs font-medium text-off-white">Email Us</p>
            <p className="text-xs text-muted-foreground">{COMPANY.email}</p>
          </div>
        </a>
        <a href="https://wa.me/27000000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-white/5 bg-surface p-4 transition-all hover:border-gold/20">
          <MessageSquare className="size-5 text-gold" />
          <div>
            <p className="text-xs font-medium text-off-white">WhatsApp</p>
            <p className="text-xs text-muted-foreground">Send a message</p>
          </div>
        </a>
      </div>

      {/* Support Tickets */}
      <div>
        <h2 className="mb-3 font-heading text-sm font-bold text-off-white">My Tickets</h2>
        {(!tickets || tickets.length === 0) ? (
          <div className="rounded-xl border border-white/5 bg-surface p-8 text-center">
            <LifeBuoy className="mx-auto mb-3 size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No support tickets yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/portal/support/${ticket.id}`}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-surface p-4 transition-all hover:border-gold/20"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-off-white">{ticket.subject}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={cn(
                  "ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium",
                  ticket.status === "open" ? "bg-blue-500/10 text-blue-400" :
                  ticket.status === "in_progress" ? "bg-yellow-500/10 text-yellow-400" :
                  ticket.status === "resolved" ? "bg-green-500/10 text-green-400" :
                  "bg-gray-500/10 text-gray-400"
                )}>
                  {ticket.status.replace("_", " ")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
