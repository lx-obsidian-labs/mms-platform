"use client";

import { useState, useTransition } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { submitContactForm } from "@/lib/actions";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const update = (field: string, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await submitContactForm({
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        subject: data.subject,
        message: data.message,
      });
      setSubmitted(true);
    });
  };

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
          <CheckCircle size={28} className="text-gold" />
        </div>
        <h3 className="font-heading text-xl font-bold text-off-white">
          Message Sent
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you for reaching out. Our team will respond within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => { setSubmitted(false); setData({ name: "", email: "", phone: "", subject: "", message: "" }); }}
          className="mt-6 text-sm font-medium text-gold hover:text-gold-light"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full Name" value={data.name} onChange={(v) => update("name", v)} required />
        <FormField label="Email Address" type="email" value={data.email} onChange={(v) => update("email", v)} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Phone Number" type="tel" value={data.phone} onChange={(v) => update("phone", v)} placeholder="+27..." />
        <FormField label="Subject" value={data.subject} onChange={(v) => update("subject", v)} required />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-silver">Message</label>
        <textarea
          value={data.message}
          onChange={(e) => update("message", e.target.value)}
          rows={5}
          required
          placeholder="How can we help you?"
          className="w-full rounded-lg border border-white/10 bg-industrial-black px-3 py-2.5 text-sm text-off-white placeholder:text-muted-foreground/50 transition-colors focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center gap-2 rounded-lg bg-gold px-6 text-sm font-bold text-industrial-black transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(217,164,0,0.3)] disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={16} />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}

function FormField({
  label, value, onChange, type = "text", placeholder, required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-silver">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-10 w-full rounded-lg border border-white/10 bg-industrial-black px-3 text-sm text-off-white placeholder:text-muted-foreground/50 transition-colors focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
      />
    </div>
  );
}
