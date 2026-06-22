import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Lock, LogIn, GraduationCap } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/shared/container";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Student Portal",
  description: `Access the ${COMPANY.name} Student Portal to view your courses, track progress, download certificates, and manage your account.`,
  robots: { index: false, follow: false },
};

export default async function PortalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/portal/dashboard");
  }

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center bg-industrial-black px-4 pt-20">
        <Container size="narrow" className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
            <GraduationCap size={28} className="text-gold" />
          </div>
          <h1 className="font-display text-4xl tracking-wide text-off-white sm:text-5xl">
            STUDENT PORTAL
          </h1>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Access your courses, track your progress, download certificates, and manage your account.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login?redirect=/portal/dashboard"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-gold px-6 text-sm font-bold text-industrial-black transition-all hover:bg-gold-light"
            >
              <LogIn size={16} />
              Sign In
            </Link>
            <Link
              href="/apply"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/10 px-6 text-sm font-medium text-off-white transition-all hover:border-gold/30"
            >
              Apply Now
            </Link>
          </div>

          <p className="mt-10 text-xs text-muted-foreground">
            New student? <Link href="/apply" className="text-gold hover:underline">Apply here</Link> to get started.
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
