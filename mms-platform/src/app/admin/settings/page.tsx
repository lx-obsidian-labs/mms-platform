import type { Metadata } from "next";
import { Settings, Database, Mail, Shield, Bell, Globe } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Settings" };

export default function AdminSettingsPage() {
  const sections = [
    {
      icon: Database,
      title: "Database Setup",
      description: "Run the SQL migration to create all Supabase tables, indexes, and RLS policies.",
      action: "Run Migration",
      status: "ready",
      href: "https://supabase.com/dashboard/project/aplhybiqpmejpbnunudf/sql",
    },
    {
      icon: Mail,
      title: "Email Configuration",
      description: "Resend is configured for transactional emails (application confirmations, admin notifications).",
      action: "Test Email",
      status: "configured",
      href: "https://resend.com",
    },
    {
      icon: Shield,
      title: "Authentication",
      description: "Supabase Auth handles user registration, login, and role-based access control.",
      action: "Manage Auth",
      status: "active",
      href: "https://supabase.com/dashboard/project/aplhybiqpmejpbnunudf/auth/users",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Configure email notification preferences for admins and instructors.",
      action: "Coming Soon",
      status: "pending",
      href: "#",
    },
    {
      icon: Globe,
      title: "Site Settings",
      description: "Manage public-facing content, branding, and SEO metadata.",
      action: "Coming Soon",
      status: "pending",
      href: "#",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-white/10">
          <Settings className="size-5 text-white/70" />
        </div>
        <div>
          <h1 className="font-display text-2xl tracking-wide text-off-white lg:text-3xl">Settings</h1>
          <p className="text-sm text-muted-foreground">Platform configuration and management</p>
        </div>
      </div>

      {/* Setup Checklist */}
      <div className="rounded-xl border border-gold/20 bg-gold/5 p-5">
        <h2 className="text-sm font-semibold text-gold">Quick Start Checklist</h2>
        <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-gold">1.</span>
            Run the SQL migration file at <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-off-white">supabase/migrations/001_initial_schema.sql</code> in the Supabase SQL editor.
          </li>
          <li className="flex gap-2">
            <span className="text-gold">2.</span>
            Insert courses into the <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-off-white">courses</code> table (matching the 17 programs in constants.ts).
          </li>
          <li className="flex gap-2">
            <span className="text-gold">3.</span>
            Create an admin user: sign up via /login, then update the role in the <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-off-white">profiles</code> table.
          </li>
          <li className="flex gap-2">
            <span className="text-gold">4.</span>
            Configure Supabase Storage buckets for document uploads (id_documents, qualifications, medical_fitness).
          </li>
        </ol>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isReady = section.status === "ready" || section.status === "configured" || section.status === "active";
          return (
            <Link
              key={section.title}
              href={section.href}
              target={section.href.startsWith("http") ? "_blank" : undefined}
              className="group rounded-xl border border-white/5 bg-surface p-5 transition-all hover:border-gold/20"
            >
              <div className="flex items-start justify-between">
                <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-gold" />
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  section.status === "pending"
                    ? "bg-white/5 text-white/40"
                    : "bg-green-400/10 text-green-400"
                }`}>
                  {section.status === "pending" ? "Pending" : "Active"}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-off-white">{section.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{section.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Environment Info */}
      <div className="rounded-xl border border-white/5 bg-surface p-5">
        <h2 className="text-sm font-semibold text-off-white">Environment</h2>
        <div className="mt-3 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Supabase Project</span>
            <span className="font-mono text-off-white">aplhybiqpmejpbnunudf</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">App URL</span>
            <span className="font-mono text-off-white">{process.env.NEXT_PUBLIC_APP_URL}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email Provider</span>
            <span className="font-mono text-off-white">Resend</span>
          </div>
        </div>
      </div>
    </div>
  );
}
