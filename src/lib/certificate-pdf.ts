import { COMPANY } from "@/lib/constants";

interface CertificateData {
  certificateNumber: string;
  studentName: string;
  courseName: string;
  courseCategory: string;
  durationWeeks: number;
  durationHours: number;
  issueDate: Date;
  expiryDate?: Date;
}

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  const PDFDocument = (await import("pdfkit")).default;

  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margins: { top: 40, bottom: 40, left: 40, right: 40 },
    info: {
      Title: `Certificate - ${data.certificateNumber}`,
      Author: COMPANY.name,
      Subject: `Certificate of Completion - ${data.courseName}`,
    },
  });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  // Border
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30).lineWidth(2).stroke("#C79A3E");
  doc.rect(20, 20, pageWidth - 40, pageHeight - 40).lineWidth(0.5).stroke("#C79A3E");

  // Background decorative lines
  for (let i = 0; i < 3; i++) {
    const y = 100 + i * 180;
    doc
      .moveTo(40, y)
      .lineTo(pageWidth - 40, y)
      .lineWidth(0.3)
      .stroke("#D4AF37");
  }

  // Header
  doc.font("Helvetica-Bold").fontSize(16).fillColor("#8B6914").text(COMPANY.name, { align: "center" });
  doc.moveDown(0.3);
  doc.font("Helvetica").fontSize(10).fillColor("#666666").text(COMPANY.location, { align: "center" });

  // Certificate title
  doc.moveDown(1.5);
  doc.font("Helvetica-Bold").fontSize(28).fillColor("#1a1a1a").text("CERTIFICATE OF COMPLETION", { align: "center" });

  // Decorative line under title
  const titleWidth = doc.widthOfString("CERTIFICATE OF COMPLETION");
  const titleX = (pageWidth - titleWidth) / 2;
  doc
    .moveTo(titleX, doc.y + 5)
    .lineTo(titleX + titleWidth, doc.y + 5)
    .lineWidth(1.5)
    .stroke("#C79A3E");

  // "This is to certify that"
  doc.moveDown(1.5);
  doc.font("Helvetica").fontSize(12).fillColor("#444444").text("This is to certify that", { align: "center" });

  // Student name
  doc.moveDown(0.8);
  doc.font("Helvetica-Bold").fontSize(26).fillColor("#1a1a1a").text(data.studentName.toUpperCase(), { align: "center" });

  // Course completion text
  doc.moveDown(0.8);
  doc.font("Helvetica").fontSize(12).fillColor("#444444").text(
    `has successfully completed the`,
    { align: "center" }
  );

  // Course name
  doc.moveDown(0.5);
  doc.font("Helvetica-Bold").fontSize(18).fillColor("#1a1a1a").text(data.courseName, { align: "center" });

  // Course details
  doc.moveDown(0.5);
  doc.font("Helvetica").fontSize(11).fillColor("#666666").text(
    `${data.durationWeeks} ${data.durationWeeks === 1 ? "week" : "weeks"} · ${data.durationHours} hours · ${data.courseCategory}`,
    { align: "center" }
  );

  // Issue details
  doc.moveDown(1.5);
  doc.font("Helvetica").fontSize(10).fillColor("#444444");
  doc.text(`Certificate Number: ${data.certificateNumber}`, { align: "center" });
  doc.text(`Date Issued: ${formatDateLong(data.issueDate)}`, { align: "center" });
  if (data.expiryDate) {
    doc.text(`Expiry Date: ${formatDateLong(data.expiryDate)}`, { align: "center" });
  }

  // Authority seal text
  doc.moveDown(2);
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#C79A3E").text("AUTHORISED CERTIFICATE", { align: "center" });

  // Footer signature lines
  const footerY = pageHeight - 100;
  const signatureWidth = 120;

  // Left signature
  doc
    .moveTo(80, footerY)
    .lineTo(80 + signatureWidth, footerY)
    .lineWidth(0.5)
    .stroke("#999999");
  doc.font("Helvetica-Bold").fontSize(8).fillColor("#666666").text("Training Manager", 80, footerY + 5, { width: signatureWidth, align: "center" });

  // Right signature
  doc
    .moveTo(pageWidth - 80 - signatureWidth, footerY)
    .lineTo(pageWidth - 80, footerY)
    .lineWidth(0.5)
    .stroke("#999999");
  doc.font("Helvetica-Bold").fontSize(8).fillColor("#666666").text("Quality Assurer", pageWidth - 80 - signatureWidth, footerY + 5, { width: signatureWidth, align: "center" });

  // Footer - certificate verification text
  doc.font("Helvetica").fontSize(7).fillColor("#999999");
  doc.text(
    `This certificate is the property of ${COMPANY.name}. Verify at ${COMPANY.website}/verify-certificate`,
    40,
    pageHeight - 55,
    { align: "center", width: pageWidth - 80 }
  );

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

function formatDateLong(date: Date): string {
  return new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
