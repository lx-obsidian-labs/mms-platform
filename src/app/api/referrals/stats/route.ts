import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: student } = await supabase
    .from("students")
    .select("id, referral_code")
    .eq("user_id", user.id)
    .single();

  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  const { data: referrals, error } = await supabase
    .from("referrals")
    .select("*")
    .eq("referrer_id", student.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Referral Stats] Error:", error);
    return NextResponse.json({ error: "Failed to fetch referrals" }, { status: 500 });
  }

  const stats = {
    total: referrals?.length ?? 0,
    pending: referrals?.filter((r) => r.status === "pending").length ?? 0,
    converted: referrals?.filter((r) => r.status === "converted").length ?? 0,
    paid: referrals?.filter((r) => r.status === "paid").length ?? 0,
    total_rewards: referrals?.filter((r) => r.status === "paid" || r.status === "converted").reduce((sum, r) => sum + (r.reward_amount ?? 0), 0) ?? 0,
    pending_rewards: referrals?.filter((r) => r.status === "converted").reduce((sum, r) => sum + (r.reward_amount ?? 0), 0) ?? 0,
  };

  return NextResponse.json({
    referral_code: student.referral_code,
    stats,
    referrals: referrals ?? [],
  });
}