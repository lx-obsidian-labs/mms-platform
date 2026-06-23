"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { Container } from "@/components/shared/container";

const footerLinks = {
  training: [
    { label: "Excavator Training", href: "/courses/excavator-training" },
    { label: "Forklift Training", href: "/courses/forklift-training" },
    { label: "Mobile Crane", href: "/courses/mobile-crane-training" },
    { label: "SHE Representative", href: "/courses/she-representative-training" },
    { label: "Dump Truck 777D", href: "/courses/dump-truck-777d-training" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "All Courses", href: "/courses" },
    { label: "Apply Now", href: "/apply" },
    { label: "Student Portal", href: "/portal" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "Support & FAQ", href: "/support" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-industrial-black">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-2 md:py-16 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-display text-2xl tracking-wider text-gold">
                MMS
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {COMPANY.tagline}. South Africa&apos;s premier mining and heavy
              machinery training institution.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} className="shrink-0 text-gold" />
                <span>{COMPANY.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={16} className="shrink-0 text-gold" />
                <span>{COMPANY.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={16} className="shrink-0 text-gold" />
                <span>{COMPANY.email}</span>
              </div>
            </div>
          </div>

          {/* Training Programs */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-off-white">
              Training Programs
            </h3>
            <ul className="space-y-3">
              {footerLinks.training.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-off-white">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-off-white">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Registered Training Provider &mdash; South Africa
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
