import { Resend } from "resend";
import { COMPANY } from "@/lib/constants";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY environment variable is not set");
  return new Resend(apiKey);
}

const FROM_EMAIL = "Mpumalanga Mining Solutions <noreply@mpumalangaminingsolutions.com>";

const GOLD = "#D9A400";
const GOLD_DARK = "#B88D00";
const BLACK = "#111111";
const SURFACE = "#1A1A1A";
const SURFACE_LIGHT = "#222222";
const OFF_WHITE = "#F7F7F7";
const SILVER = "#C0C0C0";
const MUTED = "#888888";
const GREEN = "#22c55e";
const RED = "#ef4444";

function emailLayout(content: string, title: string): string {
  const year = new Date().getFullYear();
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | ${COMPANY.name}</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#050505;padding:30px 10px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:${SURFACE};border-radius:12px;overflow:hidden;border:1px solid rgba(217,164,0,0.08);">

          <!-- DARK TOP BAR -->
          <tr>
            <td style="background-color:${BLACK};padding:0;height:4px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- HEADER -->
          <tr>
            <td style="text-align:center;padding:32px 32px 20px;">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:${GOLD};border-radius:6px;width:48px;height:48px;text-align:center;vertical-align:middle;font-size:0;">
                    <span style="font-family:'Impact','Arial Black',sans-serif;font-size:22px;color:${BLACK};letter-spacing:1px;">M</span>
                  </td>
                  <td style="padding-left:14px;">
                    <h1 style="margin:0;font-family:'Impact','Arial Black',sans-serif;font-size:20px;color:${OFF_WHITE};letter-spacing:1.5px;text-transform:uppercase;">MPUMALANGA<br><span style="color:${GOLD};">MINING SOLUTIONS</span></h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- GOLD DIVIDER -->
          <tr>
            <td style="padding:0 32px;">
              <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:2px solid ${GOLD};font-size:0;line-height:0;height:0;">&nbsp;</td></tr></table>
            </td>
          </tr>

          <!-- TAGLINE -->
          <tr>
            <td style="text-align:center;padding:10px 32px 0;">
              <p style="margin:0;font-family:'Tahoma',sans-serif;font-size:11px;color:${GOLD};letter-spacing:3px;text-transform:uppercase;">Building The Future Of Mining</p>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding:28px 32px;color:${OFF_WHITE};font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:15px;line-height:1.7;">
              ${content}
            </td>
          </tr>

          <!-- GOLD DIVIDER -->
          <tr>
            <td style="padding:0 32px;">
              <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid rgba(217,164,0,0.15);font-size:0;line-height:0;height:0;">&nbsp;</td></tr></table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:24px 32px;text-align:center;">
              <p style="margin:0 0 8px;font-family:'Tahoma',sans-serif;font-size:13px;font-weight:700;color:${OFF_WHITE};">${COMPANY.name}</p>
              <p style="margin:0 0 4px;color:${MUTED};font-size:11px;">${COMPANY.location}</p>
              <p style="margin:0 0 12px;color:${MUTED};font-size:11px;">Tel: ${COMPANY.phone} | Email: <a href="mailto:${COMPANY.email}" style="color:${GOLD};text-decoration:none;">${COMPANY.email}</a></p>
              <p style="margin:12px 0 0;color:#555;font-size:10px;border-top:1px solid rgba(255,255,255,0.04);padding-top:12px;">&copy; ${year} ${COMPANY.name}. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function goldBox(content: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;"><tr><td style="background-color:${BLACK};border-left:4px solid ${GOLD};border-radius:6px;padding:18px 20px;font-size:14px;color:${OFF_WHITE};">${content}</td></tr></table>`;
}

function btnGold(href: string, label: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:20px auto;"><tr><td style="background-color:${GOLD};border-radius:6px;text-align:center;"><a href="${href}" style="display:inline-block;padding:13px 36px;font-family:'Tahoma',sans-serif;font-size:14px;font-weight:700;color:${BLACK};text-decoration:none;letter-spacing:0.5px;">${label}</a></td></tr></table>`;
}

function statBlock(label: string, value: string, accentColor: string = GOLD): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0;"><tr><td style="background-color:${BLACK};border-left:4px solid ${accentColor};border-radius:6px;padding:14px 18px;">
    <p style="margin:0 0 4px;font-family:'Tahoma',sans-serif;font-size:11px;color:${MUTED};text-transform:uppercase;letter-spacing:1px;">${label}</p>
    <p style="margin:0;font-family:'Tahoma',sans-serif;font-size:18px;font-weight:700;color:${accentColor};letter-spacing:1px;">${value}</p>
  </td></tr></table>`;
}

function nextStepsList(items: string[]): string {
  const lis = items.map((item, i) =>
    `<tr><td style="padding:6px 0;color:${OFF_WHITE};font-size:13px;">
      <table cellpadding="0" cellspacing="0"><tr>
        <td style="background-color:${GOLD};color:${BLACK};font-weight:700;font-size:11px;width:22px;height:22px;border-radius:50%;text-align:center;vertical-align:middle;line-height:22px;">${i + 1}</td>
        <td style="padding-left:10px;color:${SILVER};">${item}</td>
      </tr></table>
    </td></tr>`
  ).join("");
  return `<table cellpadding="0" cellspacing="0" style="margin:16px 0;">${lis}</table>`;
}

function contactBlock(): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;"><tr><td style="background-color:${BLACK};border-radius:6px;padding:16px;">
    <p style="margin:0 0 8px;font-family:'Tahoma',sans-serif;font-size:12px;color:${GOLD};font-weight:700;text-transform:uppercase;letter-spacing:1px;">Need Help?</p>
    <p style="margin:0;color:${SILVER};font-size:13px;">Email: <a href="mailto:${COMPANY.email}" style="color:${GOLD};text-decoration:none;">${COMPANY.email}</a><br>Phone: <a href="tel:${COMPANY.phone}" style="color:${GOLD};text-decoration:none;">${COMPANY.phone}</a></p>
  </td></tr></table>`;
}

// ============================================
// APPLICATION CONFIRMATION
// ============================================

export async function sendApplicationConfirmation(params: {
  to: string; firstName: string; lastName: string; courseName: string; referenceNumber: string;
}) {
  const { to, firstName, lastName, courseName, referenceNumber } = params;

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:${OFF_WHITE};font-weight:700;">Application Received</h2>
    <p style="margin:0 0 16px;color:${SILVER};">Dear ${firstName} ${lastName},</p>
    <p style="margin:0 0 16px;color:${SILVER};">
      Thank you for applying to <strong style="color:${GOLD};">${courseName}</strong> at Mpumalanga Mining Solutions.
      Your application has been successfully submitted and is now being reviewed by our admissions team.
    </p>

    ${statBlock("Application Reference", referenceNumber)}

    <h3 style="margin:24px 0 12px;font-size:16px;color:${OFF_WHITE};font-weight:700;">What Happens Next</h3>
    ${nextStepsList([
      "Our admissions team will review your application within 48 hours",
      "You will receive an email notification of the outcome",
      "If accepted, you will receive payment instructions and enrollment details",
      "Course dates and schedules will be confirmed after payment verification",
    ])}

    ${contactBlock()}
  `;

  return sendEmail({
    to,
    subject: `Application Received – ${referenceNumber} | ${COMPANY.shortName}`,
    html: emailLayout(content, "Application Confirmation"),
  });
}

// ============================================
// ADMIN NOTIFICATION
// ============================================

export async function sendAdminNotification(params: {
  firstName: string; lastName: string; courseName: string; referenceNumber: string; email: string; phone: string;
}) {
  const { firstName, lastName, courseName, referenceNumber, email, phone } = params;

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:${OFF_WHITE};font-weight:700;">New Application</h2>
    ${goldBox(`Reference: <strong style="color:${GOLD};">${referenceNumber}</strong>`)}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
      <tr><td style="padding:6px 0;color:${MUTED};width:110px;font-size:13px;">Applicant</td><td style="padding:6px 0;color:${OFF_WHITE};font-size:13px;"><strong>${firstName} ${lastName}</strong></td></tr>
      <tr><td style="padding:6px 0;color:${MUTED};font-size:13px;border-top:1px solid rgba(255,255,255,0.04);">Course</td><td style="padding:6px 0;color:${OFF_WHITE};font-size:13px;border-top:1px solid rgba(255,255,255,0.04);">${courseName}</td></tr>
      <tr><td style="padding:6px 0;color:${MUTED};font-size:13px;border-top:1px solid rgba(255,255,255,0.04);">Email</td><td style="padding:6px 0;font-size:13px;border-top:1px solid rgba(255,255,255,0.04);"><a href="mailto:${email}" style="color:${GOLD};text-decoration:none;">${email}</a></td></tr>
      <tr><td style="padding:6px 0;color:${MUTED};font-size:13px;border-top:1px solid rgba(255,255,255,0.04);">Phone</td><td style="padding:6px 0;font-size:13px;border-top:1px solid rgba(255,255,255,0.04);"><a href="tel:${phone}" style="color:${GOLD};text-decoration:none;">${phone}</a></td></tr>
    </table>

    ${btnGold(`${process.env.NEXT_PUBLIC_APP_URL}/admin/applications`, "Review Application")}
  `;

  return sendEmail({
    to: COMPANY.email,
    subject: `New Application – ${referenceNumber} – ${firstName} ${lastName}`,
    html: emailLayout(content, "Admin Notification"),
  });
}

// ============================================
// APPLICATION STATUS UPDATE
// ============================================

export async function sendApplicationStatusUpdate(params: {
  to: string; firstName: string; lastName: string; courseName: string; referenceNumber: string;
  status: "accepted" | "rejected" | "under_review"; notes?: string;
}) {
  const { to, firstName, lastName, courseName, referenceNumber, status, notes } = params;

  const statusConfig = {
    accepted: { color: GREEN, title: "Congratulations – You're Accepted", line: "Your application has been accepted." },
    rejected: { color: RED, title: "Application Update", line: "Your application has not been approved at this time." },
    under_review: { color: GOLD, title: "Application Under Review", line: "Your application is currently under review." },
  };

  const config = statusConfig[status];
  const notesHtml = notes ? `<p style="margin:12px 0 0;color:${SILVER};font-size:13px;"><strong>Note:</strong> ${notes}</p>` : "";

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:${OFF_WHITE};font-weight:700;">${config.title}</h2>
    <p style="margin:0 0 16px;color:${SILVER};">Dear ${firstName} ${lastName},</p>

    ${goldBox(`
      <p style="margin:0 0 4px;color:${MUTED};font-size:11px;text-transform:uppercase;letter-spacing:1px;">Reference: ${referenceNumber}</p>
      <p style="margin:0;color:${config.color};font-weight:700;font-size:15px;">${config.line}</p>
      ${notesHtml}
    `)}

    ${status === "accepted" ? `
      <h3 style="margin:24px 0 12px;font-size:16px;color:${OFF_WHITE};font-weight:700;">Your Next Steps</h3>
      ${nextStepsList([
        "Complete your payment to secure your enrollment",
        "Attend the mandatory orientation session",
        "Bring required documents on your first day",
        "Access your student portal for course materials",
      ])}
    ` : ""}

    ${contactBlock()}
  `;

  const subj = status === "accepted" ? "Accepted" : status === "rejected" ? "Not Approved" : "Under Review";
  return sendEmail({
    to,
    subject: `Application ${subj} – ${referenceNumber} | ${COMPANY.shortName}`,
    html: emailLayout(content, "Application Status"),
  });
}

// ============================================
// CONTACT FORM NOTIFICATION
// ============================================

export async function sendContactFormNotification(params: {
  name: string; email: string; phone?: string; subject: string; message: string;
}) {
  const { name, email, phone, subject, message } = params;

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:${OFF_WHITE};font-weight:700;">New Contact Message</h2>

    ${goldBox(`<p style="margin:0;font-size:16px;color:${GOLD};font-weight:700;">${subject}</p>`)}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0;">
      <tr><td style="padding:5px 0;color:${MUTED};width:80px;font-size:12px;">Name</td><td style="padding:5px 0;color:${OFF_WHITE};font-size:13px;">${name}</td></tr>
      <tr><td style="padding:5px 0;color:${MUTED};font-size:12px;">Email</td><td style="padding:5px 0;font-size:13px;"><a href="mailto:${email}" style="color:${GOLD};text-decoration:none;">${email}</a></td></tr>
      ${phone ? `<tr><td style="padding:5px 0;color:${MUTED};font-size:12px;">Phone</td><td style="padding:5px 0;color:${OFF_WHITE};font-size:13px;">${phone}</td></tr>` : ""}
    </table>

    <h3 style="margin:20px 0 8px;font-size:14px;color:${OFF_WHITE};">Message</h3>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="background-color:${BLACK};border-radius:6px;padding:16px;color:${SILVER};font-size:13px;line-height:1.6;white-space:pre-wrap;">${message}</td></tr></table>
  `;

  return sendEmail({
    to: COMPANY.email,
    subject: `Contact Form – ${subject} – From ${name}`,
    html: emailLayout(content, "Contact Message"),
  });
}

// ============================================
// PAYMENT CONFIRMATION
// ============================================

export async function sendPaymentConfirmation(params: {
  to: string; firstName: string; lastName: string; courseName: string; referenceNumber: string; amount: number;
}) {
  const { to, firstName, lastName, courseName, referenceNumber, amount } = params;

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:${OFF_WHITE};font-weight:700;">Payment Confirmed</h2>
    <p style="margin:0 0 16px;color:${SILVER};">Dear ${firstName} ${lastName},</p>
    <p style="margin:0 0 16px;color:${SILVER};">
      Your payment of <strong style="color:${GOLD};">R${amount.toLocaleString()}</strong> for <strong style="color:${GOLD};">${courseName}</strong> has been successfully verified.
    </p>

    ${statBlock("Payment Reference", referenceNumber, GREEN)}

    <h3 style="margin:24px 0 12px;font-size:16px;color:${OFF_WHITE};font-weight:700;">What Happens Next</h3>
    ${nextStepsList([
      "Your enrollment is now being processed",
      "You will receive course access details within 24 hours",
      "Check your student portal for course materials and updates",
    ])}

    ${contactBlock()}
  `;

  return sendEmail({
    to,
    subject: `Payment Confirmed – ${referenceNumber} | ${COMPANY.shortName}`,
    html: emailLayout(content, "Payment Confirmation"),
  });
}

// ============================================
// COURSE ACCESS ACTIVATED
// ============================================

export async function sendCourseAccessActivated(params: {
  to: string; firstName: string; lastName: string; courseName: string; portalUrl: string; email: string; password: string;
}) {
  const { to, firstName, lastName, courseName, portalUrl, email, password } = params;

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:${OFF_WHITE};font-weight:700;">Course Access Granted</h2>
    <p style="margin:0 0 16px;color:${SILVER};">Dear ${firstName} ${lastName},</p>
    <p style="margin:0 0 16px;color:${SILVER};">
      Your access to <strong style="color:${GOLD};">${courseName}</strong> has been activated. You can now begin your training.
    </p>

    ${statBlock("Student Portal", `${COMPANY.shortName} LMS`)}

    <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="background-color:${BLACK};border-radius:6px;padding:16px;margin:16px 0;">
      <p style="margin:0 0 8px;font-size:11px;color:${MUTED};text-transform:uppercase;letter-spacing:1px;font-weight:700;">Your Login Credentials</p>
      <p style="margin:0 0 4px;color:${SILVER};font-size:13px;">Portal: <a href="${portalUrl}" style="color:${GOLD};text-decoration:none;">${portalUrl}</a></p>
      <p style="margin:0 0 4px;color:${SILVER};font-size:13px;">Email: <strong style="color:${GOLD};">${email}</strong></p>
      <p style="margin:0;color:${SILVER};font-size:13px;">Password: <strong style="color:${GOLD};">${password}</strong></p>
    </td></tr></table>

    ${btnGold(portalUrl, "Login to Portal")}

    <h3 style="margin:24px 0 12px;font-size:16px;color:${OFF_WHITE};font-weight:700;">You Can Now Access</h3>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
      ${["Learning Materials & Video Lessons", "Study Guides & Downloads", "Assessments & Progress Tracking", "Student Support Services"].map(item => `
        <tr><td style="padding:4px 0;color:${SILVER};font-size:13px;">✓ ${item}</td></tr>
      `).join("")}
    </table>

    <p style="margin:16px 0 0;color:${GOLD};font-weight:700;">We wish you success in your training journey.</p>
  `;

  return sendEmail({
    to,
    subject: `Course Access Activated – ${courseName} | ${COMPANY.shortName}`,
    html: emailLayout(content, "Course Access"),
  });
}

// ============================================
// WELCOME STUDENT
// ============================================

export async function sendWelcomeStudent(params: {
  to: string; firstName: string; lastName: string; courseName: string; startDate: string;
}) {
  const { to, firstName, lastName, courseName, startDate } = params;

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:${OFF_WHITE};font-weight:700;">Welcome to MMS</h2>
    <p style="margin:0 0 16px;color:${SILVER};">Dear ${firstName} ${lastName},</p>
    <p style="margin:0 0 16px;color:${SILVER};">
      Welcome to <strong style="color:${GOLD};">Mpumalanga Mining Solutions</strong>.
      You are now officially enrolled in <strong style="color:${GOLD};">${courseName}</strong>.
    </p>

    ${statBlock("Course Start Date", startDate)}

    <p style="margin:16px 0;color:${SILVER};">We are committed to supporting your success throughout your training journey. Your student portal contains everything you need to get started.</p>

    <p style="margin:24px 0 0;text-align:center;font-family:'Tahoma',sans-serif;font-size:13px;color:${GOLD};letter-spacing:2px;font-weight:700;">BUILDING THE FUTURE OF MINING</p>
  `;

  return sendEmail({
    to,
    subject: `Welcome to ${COMPANY.name} – ${courseName}`,
    html: emailLayout(content, "Welcome"),
  });
}

// ============================================
// CERTIFICATE ISSUED
// ============================================

export async function sendCertificateIssued(params: {
  to: string; firstName: string; lastName: string; courseName: string; certificateNumber: string;
}) {
  const { to, firstName, lastName, courseName, certificateNumber } = params;

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:${OFF_WHITE};font-weight:700;">Certificate Available</h2>
    <p style="margin:0 0 16px;color:${SILVER};">Dear ${firstName} ${lastName},</p>
    <p style="margin:0 0 16px;color:${SILVER};">
      Congratulations! Your certificate for <strong style="color:${GOLD};">${courseName}</strong> has been issued and is now available for download.
    </p>

    ${statBlock("Certificate Number", certificateNumber, GREEN)}

    <p style="margin:16px 0;color:${SILVER};">You may download your certificate from the student portal. Well done on completing your training.</p>

    <p style="margin:20px 0 0;text-align:center;font-family:'Tahoma',sans-serif;font-size:13px;color:${GOLD};letter-spacing:1px;font-weight:700;">Well done on your achievement!</p>
  `;

  return sendEmail({
    to,
    subject: `Certificate Available – ${courseName} | ${COMPANY.shortName}`,
    html: emailLayout(content, "Certificate"),
  });
}

// ============================================
// DOCUMENT REQUEST
// ============================================

export async function sendDocumentRequest(params: {
  to: string; firstName: string; lastName: string; documentList: string[];
}) {
  const { to, firstName, lastName, documentList } = params;

  const docItems = documentList.map(d =>
    `<tr><td style="padding:4px 0;color:${SILVER};font-size:13px;">📎 ${d}</td></tr>`
  ).join("");

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:${OFF_WHITE};font-weight:700;">Documents Required</h2>
    <p style="margin:0 0 16px;color:${SILVER};">Dear ${firstName} ${lastName},</p>
    <p style="margin:0 0 16px;color:${SILVER};">Your application requires additional documentation before it can be processed.</p>

    <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="background-color:${BLACK};border-left:4px solid ${GOLD};border-radius:6px;padding:16px;">
      <p style="margin:0 0 8px;color:${MUTED};font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Required Documents</p>
      <table cellpadding="0" cellspacing="0">${docItems}</table>
    </td></tr></table>

    <p style="margin:16px 0;color:${SILVER};">Please upload the documents through your student portal. If you need assistance, contact our support team.</p>

    ${contactBlock()}
  `;

  return sendEmail({
    to,
    subject: "Documents Required | Mpumalanga Mining Solutions",
    html: emailLayout(content, "Document Request"),
  });
}

// ============================================
// PASSWORD RESET
// ============================================

export async function sendPasswordReset(params: {
  to: string; firstName: string; resetLink: string;
}) {
  const { to, firstName, resetLink } = params;

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:${OFF_WHITE};font-weight:700;">Password Reset</h2>
    <p style="margin:0 0 16px;color:${SILVER};">Dear ${firstName},</p>
    <p style="margin:0 0 16px;color:${SILVER};">A request has been received to reset your password for your MMS student portal account.</p>

    ${btnGold(resetLink, "Reset Password")}

    <p style="margin:16px 0;color:${MUTED};font-size:12px;">If you did not make this request, please ignore this email. Your password will remain unchanged.</p>

    ${contactBlock()}
  `;

  return sendEmail({
    to,
    subject: "Password Reset Request | Mpumalanga Mining Solutions",
    html: emailLayout(content, "Password Reset"),
  });
}

// ============================================
// INSTRUCTOR NOTIFICATION
// ============================================

export async function sendInstructorNotification(params: {
  to: string; studentName: string; courseName: string; phone: string; email: string; referenceNumber: string; whatsapp: string;
}) {
  const { to, studentName, courseName, phone, email, referenceNumber, whatsapp } = params;

  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;color:${OFF_WHITE};font-weight:700;">New Student Registration</h2>
    <p style="margin:0 0 16px;color:${SILVER};">A new student has submitted an application for your course.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0;">
      <tr><td style="padding:5px 0;color:${MUTED};width:110px;font-size:12px;">Student</td><td style="padding:5px 0;color:${OFF_WHITE};font-size:13px;font-weight:700;">${studentName}</td></tr>
      <tr><td style="padding:5px 0;color:${MUTED};font-size:12px;border-top:1px solid rgba(255,255,255,0.04);">Course</td><td style="padding:5px 0;color:${OFF_WHITE};font-size:13px;border-top:1px solid rgba(255,255,255,0.04);">${courseName}</td></tr>
      <tr><td style="padding:5px 0;color:${MUTED};font-size:12px;border-top:1px solid rgba(255,255,255,0.04);">Phone</td><td style="padding:5px 0;color:${OFF_WHITE};font-size:13px;border-top:1px solid rgba(255,255,255,0.04);">${phone}</td></tr>
      <tr><td style="padding:5px 0;color:${MUTED};font-size:12px;border-top:1px solid rgba(255,255,255,0.04);">WhatsApp</td><td style="padding:5px 0;color:${OFF_WHITE};font-size:13px;border-top:1px solid rgba(255,255,255,0.04);">${whatsapp}</td></tr>
      <tr><td style="padding:5px 0;color:${MUTED};font-size:12px;border-top:1px solid rgba(255,255,255,0.04);">Email</td><td style="padding:5px 0;font-size:13px;border-top:1px solid rgba(255,255,255,0.04);"><a href="mailto:${email}" style="color:${GOLD};text-decoration:none;">${email}</a></td></tr>
      <tr><td style="padding:5px 0;color:${MUTED};font-size:12px;border-top:1px solid rgba(255,255,255,0.04);">Reference</td><td style="padding:5px 0;color:${GOLD};font-size:13px;border-top:1px solid rgba(255,255,255,0.04);">${referenceNumber}</td></tr>
    </table>

    ${goldBox(`<strong>Action Required:</strong> Please contact the student within 24 hours to welcome them and provide course information.`)}
  `;

  return sendEmail({
    to,
    subject: `New Student Registration – ${studentName} | ${COMPANY.shortName}`,
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
