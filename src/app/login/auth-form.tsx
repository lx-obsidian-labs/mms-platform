"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, LogIn, Mail, CheckCircle } from "lucide-react";
import { signInWithPassword, requestLoginDetails } from "@/lib/actions";

type View = "login" | "request";

export function AuthForm() {
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signInWithPassword(email, password);
    if (result.success) {
      router.push(redirect);
      router.refresh();
    } else {
      setError(result.error || "Login failed");
    }

    setLoading(false);
  }

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const result = await requestLoginDetails(email);
    if (result.success) {
      setSuccess("If an account exists with this email, login instructions have been sent.");
    } else {
      setError(result.error || "Request failed. Please try again.");
    }

    setLoading(false);
  }

  if (view === "request") {
    return (
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gold/10">
            <Mail className="size-6 text-gold" />
          </div>
          <h2 className="font-heading text-lg font-bold text-off-white">Request Login Details</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the email address you used during enrollment. We&apos;ll send you instructions to access your account.
            </p>
        </div>

        <form onSubmit={handleRequest} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />

          {error && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400 flex items-start gap-2">
              <CheckCircle className="mt-0.5 size-4 shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-bold text-black transition-all hover:bg-gold/90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Send Instructions"}
          </button>
        </form>

        <p className="mt-6 text-center">
          <button onClick={() => { setView("login"); setError(""); setSuccess(""); }} className="text-sm text-gold hover:underline">
            Back to Sign In
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleLogin} className="space-y-4">
        <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
        <div>
          <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
          <button
            type="button"
            onClick={() => setView("request")}
            className="mt-1 text-xs text-muted-foreground hover:text-gold"
          >
            Forgot your password?
          </button>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-bold text-black transition-all hover:bg-gold/90 disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <><LogIn className="size-4" /> Sign In</>}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New student?{" "}
        <a href="/apply" className="font-semibold text-gold hover:underline">Apply here</a>
        {" — "}your login credentials will be sent to you upon enrollment.
      </p>

      <p className="mt-4 text-center">
        <button
          onClick={() => setView("request")}
          className="text-xs text-muted-foreground hover:text-gold"
        >
          Returning student? Request your login details
        </button>
      </p>
    </div>
  );
}

// ============================================
// INPUT HELPER
// ============================================

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm text-off-white placeholder:text-white/20 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30"
      />
    </div>
  );
}
