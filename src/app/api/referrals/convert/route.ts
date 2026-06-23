import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const body = await request.json().catch(() => ({}));
  const { application_id, enrollment_id, referee_email } = body;

  if (!application_id || !enrollment_id) {
    return NextResponse.json({ error: "Application ID and Enrollment ID required" }, { status: 400 });
  }

  const { data: referral } = await supabase
    .from("referrals")
    .select("id, referrer_id, status, reward_amount")
    .eq("referee_email", referee_email)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .maybeSingle();

  if (!referral) {
    return NextResponse.json({ error: "No pending referral found for this email" }, { status: 404 });
  }

  const { error } = await supabase
    .from("referrals")
    .update({
      status: "converted",
      application_id,
      enrolled_at: new Date().toISOString(),
      converted_at: new Date().toISOString(),
    })
    .eq("id", referral.id);

  if (error) {
    console.error("[Referral Convert] Error:", error);
    return NextResponse.json({ error: "Failed to convert referral" }, { status: 500 });
  }

  return NextResponse.json({ success: true, referral_id: referral.id, reward_amount: referral.reward_amount });
}