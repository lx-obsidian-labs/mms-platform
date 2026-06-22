import type { Metadata } from "next";
import Link from "next/link";
import {
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  BookOpen,
  Shield,
  FileText,
  ExternalLink,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { CtaSection } from "@/components/sections/cta";
import { COMPANY, FAQ_ITEMS } from "@/lib/constants";
import { FaqSection } from "./support-faq";

export const metadata: Metadata = {
  title: "Support",
  description:
    "MMS Student Support Center. Find answers to frequently asked questions, access policies, and contact our support team for assistance.",
  openGraph: {
    title: `Support | ${COMPANY.name}`,
    description: "Get help with your MMS application, student portal, courses, or any other questions.",
  },
};

const supportChannels = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "Chat with our team for quick assistance.",
    action: "Chat Now",
    href: `https://wa.me/${COMPANY.whatsapp.replace(/[^0-9]/g, "")}`,
    external: true,
    highlight: true,
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send detailed inquiries to our support team.",
    action: "Send Email",
    href: `mailto:${COMPANY.email}`,
    external: false,
    highlight: false,
  },
  {
    icon: Phone,
    title: "Phone",
    description: "Speak directly with our admissions team.",
    action: "Call Now",
    href: `tel:${COMPANY.phone.replace(/\s/g, "")}`,
    external: false,
    highlight: false,
  },
];

const policies = [
  {
    title: "Privacy Policy (POPIA)",
    description: "How we collect, use, and protect your personal information.",
    href: "/privacy-policy",
    icon: Shield,
  },
  {
    title: "Terms & Conditions",
    description: "Terms governing your enrollment and use of MMS services.",
    href: "/terms-and-conditions",
    icon: FileText,
  },
  {
    title: "Refund Policy",
    description: "Our policy on course fees, cancellations, and refunds.",
    href: "/refund-policy",
    icon: AlertCircle,
  },
];

const quickHelpTopics = [
  {
    title: "Application Status",
    description: "Track the status of your enrollment application.",
    href: "/portal",
    icon: FileText,
  },
  {
    title: "Course Information",
    description: "Browse all available training programs and requirements.",
    href: "/courses",
    icon: BookOpen,
  },
  {
    title: "Payment Queries",
    description: "Get help with payments, invoices, and receipts.",
    href: "/contact",
    icon: Clock,
  },
  {
    title: "Student Portal",
    description: "Access your dashboard, courses, and certificates.",
    href: "/portal",
    icon: HelpCircle,
  },
];

export default function SupportPage() {
  return (
    <>
      <Header />

      <main>
        <PageHeader
          title="SUPPORT CENTER"
          subtitle="Get help with applications, student portal, courses, payments, and more. Our team is here to assist you."
        />

        {/* FAQ Section */}
        <section className="bg-industrial-black py-[var(--section-padding)]">
          <Container size="narrow">
            <h2 className="mb-8 text-center font-heading text-2xl font-bold text-off-white lg:text-3xl">
              Frequently Asked Questions
            </h2>
            <FaqSection items={FAQ_ITEMS} />
          </Container>
        </section>

        {/* Quick Help Topics */}
        <section className="bg-surface py-[var(--section-padding)]">
          <Container>
            <h2 className="mb-8 text-center font-heading text-2xl font-bold text-off-white lg:text-3xl">
              How Can We Help?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickHelpTopics.map((topic) => (
                <Link
                  key={topic.title}
                  href={topic.href}
                  className="group rounded-xl border border-white/5 bg-industrial-black p-5 transition-all hover:border-gold/15"
                >
                  <topic.icon size={22} className="mb-3 text-gold" />
                  <h3 className="font-heading text-base font-bold text-off-white group-hover:text-gold transition-colors">
                    {topic.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{topic.description}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        {/* Support Channels */}
        <section className="bg-industrial-black py-[var(--section-padding)]">
          <Container>
            <h2 className="mb-8 text-center font-heading text-2xl font-bold text-off-white lg:text-3xl">
              Contact Support
            </h2>
            <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
              {supportChannels.map((channel) => (
                <a
                  key={channel.title}
                  href={channel.href}
                  target={channel.external ? "_blank" : undefined}
                  rel={channel.external ? "noopener noreferrer" : undefined}
                  className={`group flex flex-col items-center rounded-xl border p-6 text-center transition-all ${
                    channel.highlight
                      ? "border-gold/20 bg-gold/5 hover:border-gold/40"
                      : "border-white/5 bg-surface hover:border-gold/15"
                  }`}
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
                    <channel.icon size={22} className="text-gold" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-off-white">
                    {channel.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{channel.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold">
                    {channel.action}
                    {channel.external && <ExternalLink size={12} />}
                  </span>
                </a>
              ))}
            </div>

            {/* Response Times */}
            <div className="mx-auto mt-10 max-w-xl rounded-xl border border-white/5 bg-surface p-6 text-center">
              <h3 className="mb-4 font-heading text-base font-bold text-off-white">
                Response Times
              </h3>
              <div className="grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="font-semibold text-gold">AI Assistant</p>
                  <p className="text-muted-foreground">Immediate</p>
                </div>
                <div>
                  <p className="font-semibold text-gold">WhatsApp</p>
                  <p className="text-muted-foreground">Within 4 hours</p>
                </div>
                <div>
                  <p className="font-semibold text-gold">Email</p>
                  <p className="text-muted-foreground">Within 24 hours</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Policies */}
        <section className="bg-surface py-[var(--section-padding)]">
          <Container size="narrow">
            <h2 className="mb-8 text-center font-heading text-2xl font-bold text-off-white lg:text-3xl">
              Policies &amp; Legal
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {policies.map((policy) => (
                <Link
                  key={policy.title}
                  href={policy.href}
                  className="group rounded-xl border border-white/5 bg-industrial-black p-5 transition-all hover:border-gold/15"
                >
                  <policy.icon size={20} className="mb-3 text-gold" />
                  <h3 className="font-heading text-sm font-bold text-off-white group-hover:text-gold transition-colors">
                    {policy.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{policy.description}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <CtaSection />
      </main>

      <Footer />
    </>
  );
}
