"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, LogIn, UserPlus, ArrowRight, Shield } from "lucide-react";
import { signInWithPassword, signUp } from "@/lib/actions";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "register";

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (mode === "login") {
      const result = await signInWithPassword(email, password);
      if (result.success) {
        router.push(redirect);
        router.refresh();
      } else {
        setError(result.error || "Login failed");
      }
    } else {
      if (!firstName || !lastName) {
        setError("First and last name are required");
        setLoading(false);
        return;
      }
      const result = await signUp(email, password, firstName, lastName);
      if (result.success) {
        setSuccess("Account created! Check your email to verify, or sign in now.");
        setMode("login");
      } else {
        setError(result.error || "Registration failed");
      }
    }

    setLoading(false);
  }

  return (
    <div className="w-full max-w-md">
      {/* Mode Tabs */}
      <div className="mb-8 flex rounded-lg bg-surface p-1">
        {(["login", "register"] as AuthMode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(""); setSuccess(""); }}
            className={cn(
              "flex-1 rounded-md py-2.5 text-sm font-semibold capitalize transition-colors",
              mode === m
                ? "bg-gold text-black"
                : "text-muted-foreground hover:text-off-white"
            )}
          >
            {m === "login" ? "Sign In" : "Register"}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" value={firstName} onChange={setFirstName} placeholder="John" required />
            <Input label="Last Name" value={lastName} onChange={setLastName} placeholder="Doe" required />
          </div>
        )}

        <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
        <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required minLength={6} />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400"
          >
            {success}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-bold text-black transition-all hover:bg-gold/90 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : mode === "login" ? (
            <>
              <LogIn className="size-4" />
              Sign In
            </>
          ) : (
            <>
              <UserPlus className="size-4" />
              Create Account
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "login" ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setSuccess(""); }}
          className="font-semibold text-gold hover:underline"
        >
          {mode === "login" ? "Register here" : "Sign in"}
        </button>
      </p>

      <div className="mt-6">
        <Link
          href="/"
          className="flex items-center justify-center gap-1 text-sm text-muted-foreground transition-colors hover:text-gold"
        >
          <ArrowRight className="size-3 rotate-180" />
          Back to Home
        </Link>
      </div>
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
  minLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
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
        minLength={minLength}
        className="w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm text-off-white placeholder:text-white/20 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30"
      />
    </div>
  );
}
