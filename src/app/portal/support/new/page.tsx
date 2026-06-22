import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, LifeBuoy } from "lucide-react";
import Link from "next/link";
import { NewTicketForm } from "./form";

export const metadata: Metadata = {
  title: "New Support Ticket",
  robots: { index: false, follow: false },
};

export default async function NewTicketPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!student) {
    return (
      <div className="space-y-6">
        <Link
          href="/portal/support"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-gold"
        >
          <ArrowLeft size={14} /> Back to support
        </Link>
        <div className="rounded-xl border border-white/5 bg-surface p-12 text-center">
          <LifeBuoy className="mx-auto mb-3 size-10 text-muted-foreground" />
          <h2 className="font-heading text-lg font-bold text-off-white">Student Profile Required</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You need to be an accepted student before you can create support tickets.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/portal/support"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-gold"
      >
        <ArrowLeft size={14} /> Back to support
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-gold/10">
          <LifeBuoy className="size-5 text-gold" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold text-off-white">Create Support Ticket</h1>
          <p className="text-sm text-muted-foreground">We typically respond within 24 hours</p>
        </div>
      </div>

      <NewTicketForm />
    </div>
  );
}
