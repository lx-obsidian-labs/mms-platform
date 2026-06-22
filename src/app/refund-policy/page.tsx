import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `Refund policy for ${COMPANY.name}. Learn about our cancellation and refund terms for training courses.`,
  robots: { index: false, follow: false },
};

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader title="REFUND POLICY" subtitle="Last updated: January 2026" />

        <section className="bg-industrial-black py-[var(--section-padding)]">
          <Container size="narrow">
            <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
              <p>
                Mpumalanga Mining Solutions (&quot;MMS&quot;) is committed to fair and transparent refund practices. This policy applies to all courses and training programs.
              </p>

              <div>
                <h2 className="mb-3 font-heading text-lg font-bold text-off-white">Cancellation by Student</h2>
                <ul className="ml-4 list-disc space-y-2">
                  <li><strong className="text-off-white">More than 14 days before start date:</strong> 80% refund of course fees.</li>
                  <li><strong className="text-off-white">7 to 14 days before start date:</strong> 50% refund of course fees.</li>
                  <li><strong className="text-off-white">Less than 7 days before start date:</strong> No refund.</li>
                  <li><strong className="text-off-white">After training has commenced:</strong> No refund.</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-3 font-heading text-lg font-bold text-off-white">Cancellation by MMS</h2>
                <p>If MMS cancels a course due to insufficient enrollment or unforeseen circumstances, students will receive a full refund or the option to transfer to the next available intake.</p>
              </div>

              <div>
                <h2 className="mb-3 font-heading text-lg font-bold text-off-white">How to Request a Refund</h2>
                <ol className="ml-4 list-decimal space-y-2">
                  <li>Submit a written refund request to <strong className="text-gold">{COMPANY.email}</strong></li>
                  <li>Include your full name, application reference number, and reason for cancellation</li>
                  <li>MMS will acknowledge receipt within 2 business days</li>
                  <li>Approved refunds are processed within 14 business days</li>
                  <li>Refunds are credited to the original payment method or via EFT</li>
                </ol>
              </div>

              <div>
                <h2 className="mb-3 font-heading text-lg font-bold text-off-white">Non-Refundable Items</h2>
                <ul className="ml-4 list-disc space-y-2">
                  <li>Application fees (if applicable)</li>
                  <li>Materials and resources already provided to the student</li>
                  <li>Assessment fees for completed assessments</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-3 font-heading text-lg font-bold text-off-white">Contact</h2>
                <p>For refund inquiries, please contact us at:</p>
                <p><strong className="text-off-white">Email:</strong> {COMPANY.email}<br /><strong className="text-off-white">Phone:</strong> {COMPANY.phone}</p>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
