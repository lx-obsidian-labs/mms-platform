-- ============================================
-- MMS Platform - Email Webhook Events
-- Tracks Resend webhook events (bounces, deliveries, opens, clicks, complaints)
-- ============================================

CREATE TYPE email_event_type AS ENUM (
  'email.sent',
  'email.delivered',
  'email.delayed',
  'email.complained',
  'email.bounced',
  'email.opened',
  'email.clicked',
  'email.authenticated'
);

CREATE TABLE email_webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type email_event_type NOT NULL,
  provider_message_id TEXT,
  recipient TEXT NOT NULL,
  subject TEXT,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_email_webhook_events_type ON email_webhook_events(event_type);
CREATE INDEX idx_email_webhook_events_recipient ON email_webhook_events(recipient);
CREATE INDEX idx_email_webhook_events_message_id ON email_webhook_events(provider_message_id);
CREATE INDEX idx_email_webhook_events_created ON email_webhook_events(created_at DESC);

ALTER TABLE email_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view webhook events" ON email_webhook_events
  FOR SELECT USING (public.is_admin());

CREATE POLICY "System can insert webhook events" ON email_webhook_events
  FOR INSERT WITH CHECK (true);
