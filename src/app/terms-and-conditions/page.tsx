import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms and Conditions for ${COMPANY.name}. Read our terms governing enrollment, training services, payments, and use of the platform.`,
  robots: { index: false, follow: false },
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader title="TERMS & CONDITIONS" subtitle="Last updated: January 2026" />

        <section className="bg-industrial-black py-[var(--section-padding)]">
          <Container size="narrow">
            <div className="prose-custom space-y-8 text-sm leading-relaxed text-muted-foreground">
              <p>
                These Terms and Conditions (&quot;Terms&quot;) govern your enrollment, training, and use of services provided by Mpumalanga Mining Solutions (&quot;MMS&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;). By submitting an application or using our services, you agree to these Terms.
              </p>

              <Section title="1. Enrollment and Admission">
                <ul className="ml-4 list-disc space-y-1">
                  <li>All applications are subject to review and approval by MMS.</li>
                  <li>Submission of an application does not guarantee enrollment.</li>
                  <li>Applicants must provide accurate and complete information.</li>
                  <li>MMS reserves the right to decline applications that do not meet course requirements.</li>
                  <li>Enrollment is confirmed only after application approval and payment verification.</li>
                </ul>
              </Section>

              <Section title="2. Course Fees and Payment">
                <ul className="ml-4 list-disc space-y-1">
                  <li>All course fees are quoted in South African Rand (ZAR) and are inclusive of VAT where applicable.</li>
                  <li>Fees are payable before the commencement of training unless a payment plan has been agreed upon.</li>
                  <li>Payment plans must be agreed upon in writing prior to enrollment.</li>
                  <li>Proof of payment must be submitted and verified before training access is granted.</li>
                  <li>Course fees are subject to change. Confirmed enrollments are honored at the agreed rate.</li>
                </ul>
              </Section>

              <Section title="3. Refund Policy">
                <ul className="ml-4 list-disc space-y-1">
                  <li>Cancellations made more than 14 days before the start date: 80% refund.</li>
                  <li>Cancellations made 7-14 days before the start date: 50% refund.</li>
                  <li>Cancellations made less than 7 days before the start date: No refund.</li>
                  <li>No refunds are issued after training has commenced.</li>
                  <li>Refund requests must be submitted in writing to {COMPANY.email}.</li>
                  <li>Refunds are processed within 14 business days.</li>
                </ul>
              </Section>

              <Section title="4. Training and Attendance">
                <ul className="ml-4 list-disc space-y-1">
                  <li>Students are expected to attend all scheduled training sessions.</li>
                  <li>A minimum attendance rate of 80% is required for certification.</li>
                  <li>MMS reserves the right to modify training schedules with reasonable notice.</li>
                  <li>Practical training requires appropriate personal protective equipment (PPE).</li>
                  <li>Students must comply with all safety regulations during practical sessions.</li>
                </ul>
              </Section>

              <Section title="5. Assessment and Certification">
                <ul className="ml-4 list-disc space-y-1">
                  <li>Certificates are issued upon successful completion of all course requirements.</li>
                  <li>Students must achieve the minimum passing grade in both theoretical and practical assessments.</li>
                  <li>Re-assessment opportunities may be provided at MMS&apos;s discretion.</li>
                  <li>Certificates remain the property of MMS until all fees are paid in full.</li>
                  <li>MMS reserves the right to withhold certificates for non-compliance with course requirements.</li>
                </ul>
              </Section>

              <Section title="6. Student Conduct">
                <ul className="ml-4 list-disc space-y-1">
                  <li>Students must conduct themselves professionally at all times.</li>
                  <li>Alcohol, drugs, and weapons are strictly prohibited on MMS premises.</li>
                  <li>Disruptive, abusive, or dangerous behavior may result in immediate expulsion without refund.</li>
                  <li>Students must respect MMS property, equipment, and fellow students.</li>
                  <li>Academic dishonesty, including cheating and plagiarism, is grounds for expulsion.</li>
                </ul>
              </Section>

              <Section title="7. Intellectual Property">
                <ul className="ml-4 list-disc space-y-1">
                  <li>All training materials, course content, and resources are the intellectual property of MMS.</li>
                  <li>Students may not reproduce, distribute, or share MMS materials without written permission.</li>
                  <li>Unauthorized recording of training sessions is prohibited.</li>
                </ul>
              </Section>

              <Section title="8. Platform and Portal Usage">
                <ul className="ml-4 list-disc space-y-1">
                  <li>Students are responsible for maintaining the confidentiality of their login credentials.</li>
                  <li>Sharing of portal access with unauthorized persons is prohibited.</li>
                  <li>MMS is not liable for unauthorized access resulting from credential sharing.</li>
                  <li>MMS reserves the right to suspend accounts for terms violations.</li>
                  <li>Students must not use the platform for unlawful or harmful activities.</li>
                </ul>
              </Section>

              <Section title="9. Limitation of Liability">
                <ul className="ml-4 list-disc space-y-1">
                  <li>MMS is not liable for injuries sustained during unauthorized use of machinery.</li>
                  <li>MMS does not guarantee employment upon completion of training.</li>
                  <li>Our liability is limited to the course fees paid by the student.</li>
                  <li>MMS is not responsible for loss or damage to personal property on premises.</li>
                </ul>
              </Section>

              <Section title="10. Data Protection">
                <p>
                  Your personal information is processed in accordance with our Privacy Policy and the Protection of Personal Information Act (POPIA). Please refer to our{" "}
                  <a href="/privacy-policy" className="text-gold underline hover:text-gold-light">
                    Privacy Policy
                  </a>{" "}
                  for complete details.
                </p>
              </Section>

              <Section title="11. Dispute Resolution">
                <ul className="ml-4 list-disc space-y-1">
                  <li>Any disputes must first be raised in writing with MMS administration.</li>
                  <li>MMS will respond to disputes within 14 business days.</li>
                  <li>Unresolved disputes may be escalated to the relevant industry regulatory body.</li>
                  <li>These Terms are governed by the laws of the Republic of South Africa.</li>
                </ul>
              </Section>

              <Section title="12. Amendments">
                <p>
                  MMS reserves the right to amend these Terms at any time. Amendments will be communicated via the website and/or email. Continued use of our services after amendments constitutes acceptance of the updated Terms.
                </p>
              </Section>

              <Section title="13. Contact">
                <p>For questions about these Terms, contact us at:</p>
                <p><strong className="text-off-white">Email:</strong> {COMPANY.email}<br /><strong className="text-off-white">Phone:</strong> {COMPANY.phone}<br /><strong className="text-off-white">Address:</strong> {COMPANY.location}</p>
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
