import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ResendWebhookPayload = {
  type: string;
  created_at: string;
  data: {
    email_id?: string;
    from?: string;
    to?: string[];
    subject?: string;
    bounced_at?: string;
    bounce_type?: string;
    bounce_reason?: string;
    complaint_type?: string;
    authenticated_at?: string;
    ip_address?: string;
    tag?: string;
    url?: string;
    clicked_at?: string;
    opened_at?: string;
    delivered_at?: string;
  };
};

export async function POST(request: NextRequest) {
  try {
    const payload: ResendWebhookPayload = await request.json();

    const { type, data } = payload;
    const recipient = data.to?.[0] || "unknown";
    const subject = data.subject || "";
    const messageId = data.email_id || "";

    const supabase = await createClient();

    // Map Resend event types to our enum
    const eventType = mapEventType(type);
    if (!eventType) {
      console.log("[Email Webhook] Unhandled event type:", type);
      return NextResponse.json({ received: true });
    }

    // Insert webhook event record
    await supabase.from("email_webhook_events").insert({
      event_type: eventType,
      provider_message_id: messageId,
      recipient,
      subject,
      event_data: data,
    });

    // For bounce/complaint, update email_logs status
    if (type === "email.bounced" || type === "email.complained") {
      const bounceStatus = type === "email.bounced" ? "bounced" : "complained";
      await supabase
        .from("email_logs")
        .update({ status: bounceStatus })
        .eq("provider_message_id", messageId);
    }

    // For delivery, mark email_logs as delivered
    if (type === "email.delivered") {
      await supabase
        .from("email_logs")
        .update({ status: "delivered" })
        .eq("provider_message_id", messageId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Email Webhook] Error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

function mapEventType(type: string): string | null {
  const map: Record<string, string> = {
    "email.sent": "email.sent",
    "email.delivered": "email.delivered",
    "email.delayed": "email.delayed",
    "email.complained": "email.complained",
    "email.bounced": "email.bounced",
    "email.opened": "email.opened",
    "email.clicked": "email.clicked",
    "email.authenticated": "email.authenticated",
  };
  return map[type] || null;
}
