import { Suspense } from "react";
import type { Metadata } from "next";
import { Shield } from "lucide-react";
import { AuthForm } from "./auth-form";

export const metadata: Metadata = {
  title: "Sign In | Mpumalanga Mining Solutions",
  description: "Access your MMS student portal or admin dashboard.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.06]" style={{ backgroundImage: "url(/images/backgrounds/login-hero.jpg)" }} aria-hidden="true" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
              <Shield className="size-7 text-gold" />
            </div>
            <h1 className="font-display text-3xl tracking-wide text-off-white">MMS</h1>
            <p className="mt-1 text-sm text-muted-foreground">Mpumalanga Mining Solutions</p>
          </div>

          {/* Auth Form */}
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="size-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            </div>
          }>
            <AuthForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
