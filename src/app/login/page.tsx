import { Suspense } from "react";
import type { Metadata } from "next";
import { Shield, GraduationCap, CreditCard } from "lucide-react";
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
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-6 text-center">
            <div className="mb-4 inline-flex size-14 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
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

          {/* E-Learning Info */}
          <div className="mt-6 rounded-xl border border-gold/10 bg-gradient-to-br from-gold/5 to-surface p-4 text-left">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gold/20">
                <GraduationCap className="size-5 text-gold" />
              </div>
              <div>
                <p className="text-sm font-bold text-off-white">E-Learning Portal</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Complete your classes online through our e-learning system. Access study materials, watch instructional videos, and learn at your own pace.
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-lg bg-industrial-black p-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                <CreditCard className="size-4 text-gold" />
              </div>
              <div>
                <p className="text-xs font-bold text-gold">R300 activation fee</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Payable at the college office or via bank transfer. Once activated, you get full e-learning access for the duration of your course.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
