import type { Metadata } from "next";
import Link from "next/link";
import { Lock, LogIn } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/shared/container";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Student Portal",
  description: `Access the ${COMPANY.name} Student Portal to view your courses, track progress, download certificates, and manage your account.`,
  robots: { index: false, follow: false },
};

export default function PortalPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center bg-industrial-black px-4 pt-20">
        <Container size="narrow" className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
            <Lock size={28} className="text-gold" />
          </div>
          <h1 className="font-display text-4xl tracking-wide text-off-white sm:text-5xl">
            STUDENT PORTAL
          </h1>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            The Student Portal is coming soon. Once enrolled, you&apos;ll receive login credentials to access your courses, track progress, and manage your account.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/apply"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-gold px-6 text-sm font-bold text-industrial-black transition-all hover:bg-gold-light"
            >
              Apply Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/10 px-6 text-sm font-medium text-off-white transition-all hover:border-gold/30"
            >
              Contact Admissions
            </Link>
          </div>

          <p className="mt-10 text-xs text-muted-foreground">
            Already a student? Portal access will be provided by your instructor.
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
