// ============================================
// MMS EMAIL SERVICE
// Uses Resend API for transactional emails
// ============================================

import { Resend } from "resend";
import { COMPANY } from "@/lib/constants";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
}

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

// ============================================
// PAYMENT CONFIRMATION EMAIL
// ============================================

export async function sendPaymentConfirmation(params: {
  to: string;
  firstName: string;
  lastName: string;
  courseName: string;
  referenceNumber: string;
  amount: number;
}) {
  const { to, firstName, lastName, courseName, referenceNumber, amount } = params;

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:#F7F7F7;">Payment Confirmed</h2>
    <p style="margin:0 0 16px;color:#ccc;line-height:1.6;">Dear ${firstName} ${lastName},</p>
    <p style="margin:0 0 16px;color:#ccc;line-height:1.6;">
      Your payment of <strong style="color:#D9A400;">R${amount.toLocaleString()}</strong> for <strong style="color:#D9A400;">${courseName}</strong> has been successfully verified.
    </p>
    <div style="background-color:#222;border-left:4px solid #22c55e;padding:16px;margin:24px 0;border-radius:4px;">
      <p style="margin:0 0 8px;color:#888;font-size:12px;text-transform:uppercase;">Reference Number</p>
      <p style="margin:0;font-size:20px;font-weight:700;color:#22c55e;letter-spacing:1px;">${referenceNumber}</p>
    </div>
    <h3 style="margin:24px 0 12px;font-size:16px;color:#F7F7F7;">What Happens Next?</h3>
    <ol style="color:#ccc;line-height:1.8;padding-left:20px;">
      <li>Your enrollment is now being processed</li>
      <li>You will receive course access details within 24 hours</li>
      <li>Check your student portal for updates</li>
    </ol>
  `;

  return sendEmail({
    to,
    subject: `Payment Confirmed - ${referenceNumber} | Mpumalanga Mining Solutions`,
    html: emailLayout(content, "Payment Confirmation"),
  });
}

// ============================================
// COURSE ACCESS ACTIVATED EMAIL
// ============================================

export async function sendCourseAccessActivated(params: {
  to: string;
  firstName: string;
  lastName: string;
  courseName: string;
  portalUrl: string;
  email: string;
  password: string;
}) {
  const { to, firstName, lastName, courseName, portalUrl, email, password } = params;

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:#F7F7F7;">Course Access Granted</h2>
    <p style="margin:0 0 16px;color:#ccc;line-height:1.6;">Dear ${firstName} ${lastName},</p>
    <p style="margin:0 0 16px;color:#ccc;line-height:1.6;">
      Your access to <strong style="color:#D9A400;">${courseName}</strong> has been activated.
    </p>
    <div style="background-color:#222;border-left:4px solid #D9A400;padding:16px;margin:24px 0;border-radius:4px;">
      <p style="margin:0 0 8px;color:#888;font-size:12px;text-transform:uppercase;">Portal Credentials</p>
      <p style="margin:0 0 4px;color:#ccc;font-size:14px;">Email: <strong style="color:#D9A400;">${email}</strong></p>
      <p style="margin:0;color:#ccc;font-size:14px;">Password: <strong style="color:#D9A400;">${password}</strong></p>
    </div>
    <p style="margin:16px 0;color:#ccc;line-height:1.6;">
      Login at: <a href="${portalUrl}" style="color:#D9A400;">${portalUrl}</a>
    </p>
    <h3 style="margin:24px 0 12px;font-size:16px;color:#F7F7F7;">You Can Now Access:</h3>
    <ul style="color:#ccc;line-height:1.8;padding-left:20px;">
      <li>Learning Materials</li>
      <li>Video Lessons</li>
      <li>Study Guides & Downloads</li>
      <li>Assessments</li>
      <li>Progress Tracking</li>
      <li>Student Services</li>
    </ul>
    <p style="margin:16px 0 0;color:#ccc;line-height:1.6;">We wish you success in your training journey.</p>
  `;

  return sendEmail({
    to,
    subject: `Course Access Activated - ${courseName} | Mpumalanga Mining Solutions`,
    html: emailLayout(content, "Course Access"),
  });
}

// ============================================
// WELCOME STUDENT EMAIL
// ============================================

export async function sendWelcomeStudent(params: {
  to: string;
  firstName: string;
  lastName: string;
  courseName: string;
  startDate: string;
}) {
  const { to, firstName, lastName, courseName, startDate } = params;

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:#F7F7F7;">Welcome to MMS</h2>
    <p style="margin:0 0 16px;color:#ccc;line-height:1.6;">Dear ${firstName} ${lastName},</p>
    <p style="margin:0 0 16px;color:#ccc;line-height:1.6;">
      Welcome to <strong style="color:#D9A400;">Mpumalanga Mining Solutions</strong>. You are now officially enrolled in <strong style="color:#D9A400;">${courseName}</strong>.
    </p>
    <div style="background-color:#222;border-left:4px solid #D9A400;padding:16px;margin:24px 0;border-radius:4px;">
      <p style="margin:0 0 4px;color:#888;font-size:12px;text-transform:uppercase;">Course Start Date</p>
      <p style="margin:0;font-size:18px;font-weight:700;color:#D9A400;">${startDate}</p>
    </div>
    <p style="margin:16px 0;color:#ccc;line-height:1.6;">
      We are committed to supporting your success throughout your training journey. Your student portal contains everything you need to get started.
    </p>
    <p style="margin:16px 0 0;color:#ccc;line-height:1.6;">
      Building The Future Of Mining.
    </p>
  `;

  return sendEmail({
    to,
    subject: `Welcome To Mpumalanga Mining Solutions | ${courseName}`,
    html: emailLayout(content, "Welcome"),
  });
}

// ============================================
// CERTIFICATE ISSUED EMAIL
// ============================================

export async function sendCertificateIssued(params: {
  to: string;
  firstName: string;
  lastName: string;
  courseName: string;
  certificateNumber: string;
}) {
  const { to, firstName, lastName, courseName, certificateNumber } = params;

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:#F7F7F7;">Certificate Available</h2>
    <p style="margin:0 0 16px;color:#ccc;line-height:1.6;">Dear ${firstName} ${lastName},</p>
    <p style="margin:0 0 16px;color:#ccc;line-height:1.6;">
      Congratulations! Your certificate for <strong style="color:#D9A400;">${courseName}</strong> has been issued and is now available.
    </p>
    <div style="background-color:#222;border-left:4px solid #22c55e;padding:16px;margin:24px 0;border-radius:4px;">
      <p style="margin:0 0 8px;color:#888;font-size:12px;text-transform:uppercase;">Certificate Number</p>
      <p style="margin:0;font-size:20px;font-weight:700;color:#22c55e;letter-spacing:1px;">${certificateNumber}</p>
    </div>
    <p style="margin:16px 0;color:#ccc;line-height:1.6;">
      You may download your certificate from the student portal. Well done on completing your training.
    </p>
  `;

  return sendEmail({
    to,
    subject: `Certificate Available - ${courseName} | Mpumalanga Mining Solutions`,
    html: emailLayout(content, "Certificate"),
  });
}

// ============================================
// DOCUMENT REQUEST EMAIL
// ============================================

export async function sendDocumentRequest(params: {
  to: string;
  firstName: string;
  lastName: string;
  documentList: string[];
}) {
  const { to, firstName, lastName, documentList } = params;

  const docItems = documentList.map((d) => `<li>${d}</li>`).join("");

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:#F7F7F7;">Additional Documents Required</h2>
    <p style="margin:0 0 16px;color:#ccc;line-height:1.6;">Dear ${firstName} ${lastName},</p>
    <p style="margin:0 0 16px;color:#ccc;line-height:1.6;">
      Your application requires additional documentation before it can be processed.
    </p>
    <div style="background-color:#222;border-left:4px solid #D9A400;padding:16px;margin:24px 0;border-radius:4px;">
      <p style="margin:0 0 8px;color:#888;font-size:12px;text-transform:uppercase;">Required Documents</p>
      <ul style="color:#ccc;line-height:1.8;padding-left:20px;margin:0;">${docItems}</ul>
    </div>
    <p style="margin:16px 0;color:#ccc;line-height:1.6;">
      Please upload the documents through your student portal. If you need assistance, please contact support.
    </p>
  `;

  return sendEmail({
    to,
    subject: "Additional Documents Required | Mpumalanga Mining Solutions",
    html: emailLayout(content, "Document Request"),
  });
}

// ============================================
// PASSWORD RESET EMAIL
// ============================================

export async function sendPasswordReset(params: {
  to: string;
  firstName: string;
  resetLink: string;
}) {
  const { to, firstName, resetLink } = params;

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:#F7F7F7;">Password Reset Request</h2>
    <p style="margin:0 0 16px;color:#ccc;line-height:1.6;">Dear ${firstName},</p>
    <p style="margin:0 0 16px;color:#ccc;line-height:1.6;">
      A request has been received to reset your password.
    </p>
    <p style="margin:16px 0;text-align:center;">
      <a href="${resetLink}" style="display:inline-block;background-color:#D9A400;color:#111;padding:14px 32px;border-radius:4px;text-decoration:none;font-weight:700;font-size:16px;">Reset Password</a>
    </p>
    <p style="margin:16px 0;color:#ccc;line-height:1.6;">
      If you did not make this request, please ignore this email. Your password will remain unchanged.
    </p>
  `;

  return sendEmail({
    to,
    subject: "Password Reset Request | Mpumalanga Mining Solutions",
    html: emailLayout(content, "Password Reset"),
  });
}

// ============================================
// INSTRUCTOR NOTIFICATION (New Application)
// ============================================

export async function sendInstructorNotification(params: {
  to: string;
  studentName: string;
  courseName: string;
  phone: string;
  email: string;
  referenceNumber: string;
  whatsapp: string;
}) {
  const { to, studentName, courseName, phone, email, referenceNumber, whatsapp } = params;

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:#F7F7F7;">New Student Registration</h2>
    <p style="margin:0 0 16px;color:#ccc;line-height:1.6;">A new student has submitted an application.</p>
    <table width="100%" cellpadding="8" cellspacing="0" style="color:#ccc;">
      <tr><td style="color:#888;width:120px;">Name:</td><td>${studentName}</td></tr>
      <tr><td style="color:#888;">Course:</td><td>${courseName}</td></tr>
      <tr><td style="color:#888;">Phone:</td><td>${phone}</td></tr>
      <tr><td style="color:#888;">WhatsApp:</td><td>${whatsapp}</td></tr>
      <tr><td style="color:#888;">Email:</td><td>${email}</td></tr>
      <tr><td style="color:#888;">Reference:</td><td>${referenceNumber}</td></tr>
    </table>
    <p style="margin:24px 0 0;background-color:#222;border-left:4px solid #D9A400;padding:16px;border-radius:4px;color:#ccc;">
      <strong>Action Required:</strong> Contact student within 24 hours.
    </p>
  `;

  return sendEmail({
    to,
    subject: `New Student Registration - ${studentName} | MMS`,
    html: emailLayout(content, "New Student"),
  });
}

// ============================================
// CORE SEND FUNCTION
// ============================================

async function sendEmail(params: { to: string; subject: string; html: string }) {
  try {
    const resend = getResend();
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
