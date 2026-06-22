import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${COMPANY.name}. Learn how we collect, use, store, and protect your personal information in compliance with POPIA.`,
  robots: { index: false, follow: false },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader title="PRIVACY POLICY" subtitle="Last updated: January 2026" />

        <section className="bg-industrial-black py-[var(--section-padding)]">
          <Container size="narrow">
            <div className="prose-custom space-y-8 text-sm leading-relaxed text-muted-foreground">
              <p>
                Mpumalanga Mining Solutions (&quot;MMS&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your personal information in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA) and other applicable South African legislation.
              </p>

              <Section title="1. Information We Collect">
                <p>We collect the following types of personal information:</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Identity information: full name, surname, ID number, date of birth, gender, nationality</li>
                  <li>Contact information: email address, mobile number, WhatsApp number, physical address</li>
                  <li>Employment information: employment status, employer details</li>
                  <li>Emergency contact details: name, relationship, phone numbers</li>
                  <li>Education and certification records: previous certificates, qualifications</li>
                  <li>Financial information: proof of payment, banking details (for refunds)</li>
                  <li>Technical information: IP address, browser type, device information, website usage data</li>
                  <li>Communication records: emails, WhatsApp messages, support tickets, AI assistant conversations</li>
                </ul>
              </Section>

              <Section title="2. How We Use Your Information">
                <p>We use your personal information for the following purposes:</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Processing enrollment applications and managing student records</li>
                  <li>Providing training services and learning management</li>
                  <li>Communicating with you about your courses, applications, and account</li>
                  <li>Issuing certificates and verifying qualifications</li>
                  <li>Processing payments and maintaining financial records</li>
                  <li>Improving our website, services, and user experience</li>
                  <li>Complying with legal and regulatory obligations</li>
                  <li>Marketing communications (with your consent)</li>
                </ul>
              </Section>

              <Section title="3. Legal Basis for Processing">
                <p>Under POPIA, we process your personal information based on:</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Your explicit consent (provided during enrollment)</li>
                  <li>Performance of a contract (training services agreement)</li>
                  <li>Compliance with legal obligations</li>
                  <li>Our legitimate business interests</li>
                </ul>
              </Section>

              <Section title="4. Data Sharing">
                <p>We do not sell your personal information. We may share your data with:</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Authorized training partners (for practical training delivery)</li>
                  <li>Certification bodies (for issuing recognized certificates)</li>
                  <li>Payment processors (for transaction processing)</li>
                  <li>Service providers (hosting, email, analytics — under data processing agreements)</li>
                  <li>Regulatory authorities (when required by law)</li>
                </ul>
              </Section>

              <Section title="5. Data Security">
                <p>We implement the following security measures to protect your information:</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Encryption of data in transit (TLS/SSL) and at rest</li>
                  <li>Row-Level Security (RLS) on our database</li>
                  <li>Role-based access control for all systems</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Password policies requiring minimum 12 characters</li>
                  <li>Comprehensive audit logging of all data access</li>
                </ul>
              </Section>

              <Section title="6. Data Retention">
                <p>We retain your personal information as follows:</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Student records: 5 years after course completion</li>
                  <li>Application records (unsuccessful): 2 years</li>
                  <li>Financial records: 7 years (as required by tax law)</li>
                  <li>Certificate records: Permanent</li>
                  <li>Communication records: 3 years</li>
                  <li>Website analytics: 26 months</li>
                </ul>
              </Section>

              <Section title="7. Your Rights Under POPIA">
                <p>You have the right to:</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Access your personal information held by us</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information (subject to legal requirements)</li>
                  <li>Object to processing of your information</li>
                  <li>Withdraw consent at any time</li>
                  <li>Lodge a complaint with the Information Regulator of South Africa</li>
                </ul>
              </Section>

              <Section title="8. Cookies and Tracking">
                <p>Our website uses cookies and similar technologies for:</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Essential functionality (authentication, session management)</li>
                  <li>Analytics (Google Analytics, Microsoft Clarity)</li>
                  <li>Performance monitoring</li>
                </ul>
              </Section>

              <Section title="9. Contact">
                <p>For privacy-related inquiries or to exercise your rights, contact us at:</p>
                <p className="mb-4"><strong className="text-off-white">Email:</strong> {COMPANY.email}<br /><strong className="text-off-white">Phone:</strong> {COMPANY.phone}<br /><strong className="text-off-white">Address:</strong> {COMPANY.location}</p>
                <p>Information Regulator South Africa: <br />Email: complaints.IR@justice.gov.za<br />Website: www.justice.gov.za/inforeg</p>
              </Section>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 font-heading text-lg font-bold text-off-white">{title}</h2>
      {children}
    </div>
  );
}
