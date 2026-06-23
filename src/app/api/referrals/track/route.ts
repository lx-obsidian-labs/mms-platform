import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const body = await request.json().catch(() => ({}));
  const { referral_code, referee_email } = body;

  if (!referral_code) {
    return NextResponse.json({ error: "Referral code required" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("referrals")
    .select("id")
    .eq("referral_code", referral_code)
    .maybeSingle();

  if (existing) {
    if (referee_email) {
      await supabase
        .from("referrals")
        .update({ referee_email })
        .eq("id", existing.id);
    }
    return NextResponse.json({ referral_id: existing.id, already_tracked: true });
  }

  const { data: referrer } = await supabase
    .from("students")
    .select("id")
    .eq("referral_code", referral_code)
    .maybeSingle();

  if (!referrer) {
    return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
  }

  const { data: referral, error } = await supabase
    .from("referrals")
    .insert({
      referrer_id: referrer.id,
      referee_email: referee_email || null,
      referral_code,
      status: "pending",
      reward_type: "cash",
      reward_amount: 100,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[Referral Track] Error:", error);
    return NextResponse.json({ error: "Failed to track referral" }, { status: 500 });
  }

  return NextResponse.json({ referral_id: referral.id });
}