import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { TicketReplyForm } from "./reply-form";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Support Ticket",
  robots: { index: false, follow: false },
};

export default async function SupportTicketDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!student) redirect("/portal/support");

  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("id", id)
    .eq("student_id", student.id)
    .single();

  if (!ticket) notFound();

  const { data: replies } = await supabase
    .from("support_ticket_replies")
    .select("*, profiles!inner(first_name, last_name)")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-6">
      <Link href="/portal/support" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold">
        <ArrowLeft size={12} /> Back to Support
      </Link>

      <div className="rounded-xl border border-white/5 bg-surface p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-heading text-xl font-bold text-off-white">{ticket.subject}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className={cn(
                "rounded-full px-2.5 py-0.5 text-[10px] font-medium",
                ticket.status === "open" ? "bg-blue-500/10 text-blue-400" :
                ticket.status === "in_progress" ? "bg-yellow-500/10 text-yellow-400" :
                ticket.status === "resolved" ? "bg-green-500/10 text-green-400" :
                "bg-gray-500/10 text-gray-400"
              )}>
                {ticket.status.replace("_", " ")}
              </span>
              <span className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                ticket.priority === "urgent" ? "bg-red-500/10 text-red-400" :
                ticket.priority === "high" ? "bg-orange-500/10 text-orange-400" :
                ticket.priority === "normal" ? "bg-blue-500/10 text-blue-400" :
                "bg-gray-500/10 text-gray-400"
              )}>
                {ticket.priority}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {new Date(ticket.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">{ticket.message}</p>
      </div>

      {replies && replies.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-heading text-sm font-bold text-off-white">Replies</h2>
          {replies.map((reply) => (
            <div key={reply.id} className={cn(
              "rounded-xl border p-4",
              reply.is_staff ? "border-gold/20 bg-gold/5" : "border-white/5 bg-surface"
            )}>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MessageSquare size={12} />
                <span className="font-medium text-off-white">
                  {reply.profiles?.first_name} {reply.profiles?.last_name}
                </span>
                {reply.is_staff && <span className="rounded bg-gold/10 px-1.5 py-0.5 text-[10px] text-gold">Staff</span>}
                <span>{new Date(reply.created_at).toLocaleDateString()}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{reply.message}</p>
            </div>
          ))}
        </div>
      )}

      {ticket.status !== "resolved" && ticket.status !== "closed" && (
        <TicketReplyForm ticketId={id} />
      )}
    </div>
  );
}
