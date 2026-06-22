// ============================================
// MMS EMAIL SERVICE
// Uses Resend API for transactional emails
// ============================================

import { Resend } from "resend";
import { COMPANY } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Mpumalanga Mining Solutions <noreply@mpumalangaminingsolutions.co.za>";

// ============================================
// EMAIL TEMPLATES (HTML)
// ============================================

function emailLayout(content: string, title: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#111111;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#111111;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1A1A1A;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#D9A400;padding:24px 32px;">
              <h1 style="margin:0;color:#111111;font-size:20px;font-weight:700;letter-spacing:1px;">MPUMALANGA MINING SOLUTIONS</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:32px;color:#F7F7F7;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #2a2a2a;text-align:center;">
              <p style="margin:0 0 8px;color:#888;font-size:12px;">${COMPANY.name}</p>
              <p style="margin:0 0 4px;color:#666;font-size:11px;">${COMPANY.location}</p>
              <p style="margin:0;color:#666;font-size:11px;">Tel: ${COMPANY.phone} | Email: ${COMPANY.email}</p>
              <p style="margin:12px 0 0;color:#555;font-size:10px;">&copy; ${new Date().getFullYear()} ${COMPANY.name}. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ============================================
// APPLICATION CONFIRMATION EMAIL
// ============================================

export async function sendApplicationConfirmation(params: {
  to: string;
  firstName: string;
  lastName: string;
  courseName: string;
  referenceNumber: string;
}) {
  const { to, firstName, lastName, courseName, referenceNumber } = params;

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:#F7F7F7;">Application Received</h2>
    <p style="margin:0 0 16px;color:#ccc;line-height:1.6;">Dear ${firstName} ${lastName},</p>
    <p style="margin:0 0 16px;color:#ccc;line-height:1.6;">
      Thank you for applying to <strong style="color:#D9A400;">${courseName}</strong> at Mpumalanga Mining Solutions.
    </p>
    <div style="background-color:#222;border-left:4px solid #D9A400;padding:16px;margin:24px 0;border-radius:4px;">
      <p style="margin:0 0 8px;color:#888;font-size:12px;text-transform:uppercase;">Your Reference Number</p>
      <p style="margin:0;font-size:24px;font-weight:700;color:#D9A400;letter-spacing:2px;">${referenceNumber}</p>
    </div>
    <h3 style="margin:24px 0 12px;font-size:16px;color:#F7F7F7;">What Happens Next?</h3>
    <ol style="color:#ccc;line-height:1.8;padding-left:20px;">
      <li>Our admissions team will review your application within <strong>48 hours</strong></li>
      <li>You will receive an email notification of the outcome</li>
      <li>If accepted, you will receive payment instructions and enrollment details</li>
      <li>Course dates and schedules will be confirmed after payment verification</li>
    </ol>
    <h3 style="margin:24px 0 12px;font-size:16px;color:#F7F7F7;">Need Help?</h3>
    <p style="margin:0;color:#ccc;line-height:1.6;">
      Contact our admissions office at <a href="mailto:${COMPANY.email}" style="color:#D9A400;">${COMPANY.email}</a>
      or call <a href="tel:${COMPANY.phone}" style="color:#D9A400;">${COMPANY.phone}</a>.
    </p>
  `;

  return sendEmail({
    to,
    subject: `Application Received - ${referenceNumber} | Mpumalanga Mining Solutions`,
    html: emailLayout(content, "Application Confirmation"),
  });
}

// ============================================
// ADMIN NOTIFICATION EMAIL
// ============================================

export async function sendAdminNotification(params: {
  firstName: string;
  lastName: string;
  courseName: string;
  referenceNumber: string;
  email: string;
  phone: string;
}) {
  const { firstName, lastName, courseName, referenceNumber, email, phone } = params;

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:#F7F7F7;">New Application Submitted</h2>
    <div style="background-color:#222;border-left:4px solid #D9A400;padding:16px;margin:16px 0;border-radius:4px;">
      <p style="margin:0;font-size:14px;color:#888;">Reference: <strong style="color:#D9A400;">${referenceNumber}</strong></p>
    </div>
    <table width="100%" cellpadding="8" cellspacing="0" style="color:#ccc;">
      <tr><td style="color:#888;width:120px;">Applicant:</td><td>${firstName} ${lastName}</td></tr>
      <tr><td style="color:#888;">Course:</td><td>${courseName}</td></tr>
      <tr><td style="color:#888;">Email:</td><td><a href="mailto:${email}" style="color:#D9A400;">${email}</a></td></tr>
      <tr><td style="color:#888;">Phone:</td><td><a href="tel:${phone}" style="color:#D9A400;">${phone}</a></td></tr>
    </table>
    <p style="margin:24px 0 0;color:#ccc;line-height:1.6;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/applications" style="display:inline-block;background-color:#D9A400;color:#111;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:700;">Review Application</a>
    </p>
  `;

  return sendEmail({
    to: COMPANY.email,
    subject: `New Application: ${referenceNumber} - ${firstName} ${lastName}`,
    html: emailLayout(content, "Admin Notification"),
  });
}

// ============================================
// APPLICATION STATUS UPDATE EMAIL
// ============================================

export async function sendApplicationStatusUpdate(params: {
  to: string;
  firstName: string;
  lastName: string;
  courseName: string;
  referenceNumber: string;
  status: "accepted" | "rejected" | "under_review";
  notes?: string;
}) {
  const { to, firstName, lastName, courseName, referenceNumber, status, notes } = params;

  const statusMessages = {
    accepted: {
      color: "#22c55e",
      title: "Congratulations! You've Been Accepted",
      message: `Your application for <strong style="color:#D9A400;">${courseName}</strong> has been <strong style="color:#22c55e;">accepted</strong>. Please follow the payment instructions below to secure your spot.`,
    },
    rejected: {
      color: "#ef4444",
      title: "Application Update",
      message: `Unfortunately, your application for <strong>${courseName}</strong> could not be approved at this time.${notes ? `<br><br><strong>Reason:</strong> ${notes}` : ""}`,
    },
    under_review: {
      color: "#D9A400",
      title: "Application Under Review",
      message: `Your application for <strong style="color:#D9A400;">${courseName}</strong> is currently under review. We will notify you once a decision has been made.`,
    },
  };

  const statusInfo = statusMessages[status];

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:#F7F7F7;">${statusInfo.title}</h2>
    <p style="margin:0 0 16px;color:#ccc;line-height:1.6;">Dear ${firstName} ${lastName},</p>
    <div style="background-color:#222;border-left:4px solid ${statusInfo.color};padding:16px;margin:16px 0;border-radius:4px;">
      <p style="margin:0 0 8px;color:#888;font-size:12px;">Reference: ${referenceNumber}</p>
      <p style="margin:0;color:#ccc;line-height:1.6;">${statusInfo.message}</p>
    </div>
    ${status === "accepted" ? `
      <h3 style="margin:24px 0 12px;font-size:16px;color:#F7F7F7;">Next Steps:</h3>
      <ol style="color:#ccc;line-height:1.8;padding-left:20px;">
        <li>Complete your payment to secure your enrollment</li>
        <li>Attend the mandatory orientation session</li>
        <li>Bring required documents on your first day</li>
      </ol>
    ` : ""}
    <p style="margin:24px 0 0;color:#ccc;line-height:1.6;">
      Questions? Contact us at <a href="mailto:${COMPANY.email}" style="color:#D9A400;">${COMPANY.email}</a>
      or call <a href="tel:${COMPANY.phone}" style="color:#D9A400;">${COMPANY.phone}</a>.
    </p>
  `;

  return sendEmail({
    to,
    subject: `Application ${status === "accepted" ? "Accepted" : status === "rejected" ? "Not Approved" : "Under Review"} - ${referenceNumber}`,
    html: emailLayout(content, "Application Status Update"),
  });
}

// ============================================
// CONTACT FORM EMAIL
// ============================================

export async function sendContactFormNotification(params: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const { name, email, phone, subject, message } = params;

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:#F7F7F7;">New Contact Form Message</h2>
    <div style="background-color:#222;border-left:4px solid #D9A400;padding:16px;margin:16px 0;border-radius:4px;">
      <p style="margin:0 0 4px;color:#888;font-size:12px;">Subject</p>
      <p style="margin:0;font-size:16px;color:#D9A400;font-weight:700;">${subject}</p>
    </div>
    <table width="100%" cellpadding="8" cellspacing="0" style="color:#ccc;">
      <tr><td style="color:#888;width:80px;">Name:</td><td>${name}</td></tr>
      <tr><td style="color:#888;">Email:</td><td><a href="mailto:${email}" style="color:#D9A400;">${email}</a></td></tr>
      ${phone ? `<tr><td style="color:#888;">Phone:</td><td>${phone}</td></tr>` : ""}
    </table>
    <h3 style="margin:24px 0 12px;font-size:16px;color:#F7F7F7;">Message:</h3>
    <div style="background-color:#222;padding:16px;border-radius:4px;color:#ccc;line-height:1.6;white-space:pre-wrap;">${message}</div>
  `;

  return sendEmail({
    to: COMPANY.email,
    subject: `Contact Form: ${subject} - From ${name}`,
    html: emailLayout(content, "Contact Form Message"),
  });
}

// ============================================
// CORE SEND FUNCTION
// ============================================

async function sendEmail(params: { to: string; subject: string; html: string }) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      console.error("[Email] Send error:", error);
      return { success: false, error: error.message };
    }

    console.log("[Email] Sent successfully:", data?.id);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error("[Email] Send failed:", error);
    return { success: false, error: "Failed to send email" };
  }
}
