"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMPANY, NAV_LINKS } from "@/lib/constants";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-industrial-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[var(--container-max)] items-center justify-between px-[var(--container-padding)] lg:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label={COMPANY.name}>
          <span className="font-display text-2xl tracking-wider text-gold lg:text-3xl">
            MMS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-silver transition-colors hover:text-off-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="inline-flex h-10 items-center rounded-lg border border-gold/30 px-5 text-sm font-medium text-gold transition-all hover:border-gold/60 hover:bg-gold/10"
          >
            Login
          </Link>
          <Link
            href="/apply"
            className="inline-flex h-10 items-center rounded-lg bg-gold px-5 text-sm font-semibold text-industrial-black transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(217,164,0,0.3)]"
          >
            Enroll Now
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-off-white transition-colors hover:bg-surface lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={cn(
          "overflow-hidden border-t border-white/5 bg-industrial-black transition-all duration-300 lg:hidden",
          mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-[var(--container-padding)] py-4" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-3 text-base font-medium text-silver transition-colors hover:bg-surface hover:text-off-white"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-gold/30 text-base font-medium text-gold transition-all hover:border-gold/60 hover:bg-gold/10"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/apply"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-gold text-base font-semibold text-industrial-black transition-all hover:bg-gold-light"
              onClick={() => setMobileOpen(false)}
            >
              Enroll Now
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
