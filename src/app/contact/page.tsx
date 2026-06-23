import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { CtaSection } from "@/components/sections/cta";
import { COMPANY, BUSINESS_HOURS } from "@/lib/constants";
import { ContactForm } from "./contact-form";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Mpumalanga Mining Solutions. Contact our admissions team for course information, enrollment assistance, or general inquiries.",
  openGraph: {
    title: `Contact Us | ${COMPANY.name}`,
    description: "Reach out to MMS for mining training inquiries, enrollment support, and general questions.",
  },
};

export default function ContactPage() {
  return (
    <>
      <Header />

      <main>
        <PageHeader
          title="CONTACT US"
          subtitle="Have questions? Our team is here to help you start your mining career. Reach out through any of the channels below."
          image="/images/backgrounds/contact-hero.jpg"
        />

        <section className="bg-industrial-black py-[var(--section-padding)]">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
              {/* Contact Form */}
              <div className="rounded-xl border border-white/5 bg-surface p-6 lg:p-10">
                <h2 className="mb-6 font-heading text-2xl font-bold text-off-white">
                  Send Us a Message
                </h2>
                <ContactForm />
              </div>

              {/* Contact Info Sidebar */}
              <div className="space-y-6">
                {/* Contact Details */}
                <div className="rounded-xl border border-white/5 bg-surface p-6">
                  <h3 className="mb-5 font-heading text-lg font-bold text-off-white">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <ContactItem icon={MapPin} label="Location" value={COMPANY.location} />
                    <ContactItem icon={Phone} label="Phone" value={COMPANY.phone} />
                    <ContactItem icon={Mail} label="Email" value={COMPANY.email} />
                    <ContactItem icon={MessageCircle} label="WhatsApp" value={COMPANY.whatsapp} />
                  </div>
                </div>

                {/* Business Hours */}
                <div className="rounded-xl border border-white/5 bg-surface p-6">
                  <h3 className="mb-5 flex items-center gap-2 font-heading text-lg font-bold text-off-white">
                    <Clock size={18} className="text-gold" />
                    Business Hours
                  </h3>
                  <div className="space-y-3">
                    {BUSINESS_HOURS.map((bh) => (
                      <div key={bh.day} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{bh.day}</span>
                        <span className="font-medium text-off-white">{bh.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div className="rounded-xl border border-gold/15 bg-gold/5 p-6">
                  <h3 className="mb-3 font-heading text-lg font-bold text-gold">
                    Quick Actions
                  </h3>
                  <div className="space-y-2 text-sm">
                    <a
                      href="/apply"
                      className="block rounded-lg bg-gold px-4 py-2.5 text-center font-semibold text-industrial-black transition-all hover:bg-gold-light"
                    >
                      Apply Now
                    </a>
                    <a
                      href="/courses"
                      className="block rounded-lg border border-white/10 px-4 py-2.5 text-center text-off-white transition-all hover:border-gold/30"
                    >
                      Browse Courses
                    </a>
                    <a
                      href={`https://wa.me/${COMPANY.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg border border-white/10 px-4 py-2.5 text-center text-off-white transition-all hover:border-gold/30"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <CtaSection />
      </main>

      <Footer />
    </>
  );
}

function ContactItem({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/10">
        <Icon size={16} className="text-gold" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm text-off-white">{value}</p>
      </div>
    </div>
  );
}
