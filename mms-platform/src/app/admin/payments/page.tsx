import type { Metadata } from "next";
import { CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "Payments" };

export default async function AdminPaymentsPage() {
  const supabase = await createClient();

  const { data: payments } = await supabase
    .from("payments")
    .select("*, students(student_number, profiles(first_name, last_name, email))")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-cyan-400/10">
          <CreditCard className="size-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl tracking-wide text-off-white lg:text-3xl">Payments</h1>
          <p className="text-sm text-muted-foreground">Track and verify student payments</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-surface">
        {!payments || payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <CreditCard className="size-10 text-white/20" />
            <p className="mt-4 text-sm text-muted-foreground">No payments recorded yet</p>
            <p className="mt-1 text-xs text-white/30">Payments will appear here once students complete their enrollment fees.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Reference</th>
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="hidden px-5 py-3 font-medium md:table-cell">Method</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((payment: Record<string, unknown>) => {
                  const student = payment.students as Record<string, unknown> | null;
                  const profile = student?.profiles as Record<string, unknown> | null;
                  return (
                    <tr key={String(payment.id)} className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-5 py-3 font-mono text-xs text-gold">{String(payment.reference ?? "—")}</td>
                      <td className="px-5 py-3 text-off-white">
                        {profile ? `${String(profile.first_name ?? "")} ${String(profile.last_name ?? "")}` : "—"}
                      </td>
                      <td className="px-5 py-3 font-semibold text-off-white">{formatCurrency(Number(payment.amount))}</td>
                      <td className="px-5 py-3">
                        <PaymentStatusBadge status={String(payment.status)} />
                      </td>
                      <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">{String(payment.payment_method ?? "—")}</td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {new Date(String(payment.created_at)).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    paid: "bg-green-400/10 text-green-400 border-green-400/20",
    pending: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    failed: "bg-red-400/10 text-red-400 border-red-400/20",
    refunded: "bg-purple-400/10 text-purple-400 border-purple-400/20",
    partial: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  };

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${colors[status] ?? "bg-white/5 text-white/50 border-white/10"}`}>
      {status}
    </span>
  );
}
