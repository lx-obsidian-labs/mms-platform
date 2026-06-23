import { COMPANY } from "@/lib/constants";

interface ProofData {
  referenceNumber: string;
  studentName: string;
  studentNumber: string;
  courseName: string;
  courseCategory: string;
  durationWeeks: number;
  enrolledAt: Date;
  status: string;
  generatedAt: Date;
}

export async function generateProofOfRegistrationPDF(data: ProofData): Promise<Buffer> {
  const PDFDocument = (await import("pdfkit")).default;

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    info: {
      Title: `Proof of Registration - ${data.referenceNumber}`,
      Author: COMPANY.name,
      Subject: `Proof of Registration - ${data.courseName}`,
    },
  });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  const pw = doc.page.width;
  const ml = 50;
  const mr = 50;
  const cw = pw - ml - mr;

  const GOLD = "#C79A3E";
  const DARK = "#1a1a1a";
  const MUTED = "#666666";
  const LIGHT = "#f5f5f5";

  // Full background header bar
  doc.rect(0, 0, pw, 130).fill("#111111");

  // Company name
  doc.font("Helvetica-Bold").fontSize(22).fillColor(GOLD).text(COMPANY.name, ml, 30, { width: cw, align: "center" });
  doc.font("Helvetica").fontSize(10).fillColor("#999999").text(COMPANY.location, { width: cw, align: "center" });
  doc.moveDown(0.3);
  doc.font("Helvetica").fontSize(8).fillColor("#777777").text(COMPANY.website, { width: cw, align: "center" });

  // Title
  doc.font("Helvetica-Bold").fontSize(18).fillColor(GOLD).text("PROOF OF REGISTRATION", ml, 95, { width: cw, align: "center" });

  // Gold accent line
  doc.moveTo(ml + 120, 128).lineTo(pw - ml - 120, 128).lineWidth(1.5).stroke(GOLD);

  // Reference section
  doc.font("Helvetica-Bold").fontSize(8).fillColor(MUTED).text("REFERENCE NUMBER", ml, 148, { width: cw, align: "center" });
  doc.font("Helvetica-Bold").fontSize(12).fillColor(DARK).text(data.referenceNumber, ml, 160, { width: cw, align: "center" });

  // Separator
  const sepY = 182;
  doc.moveTo(ml + 60, sepY).lineTo(pw - ml - 60, sepY).lineWidth(0.5).stroke("#dddddd");

  // Content box labels
  const boxY = 198;
  const col1X = ml;
  const col2X = ml + cw / 2 + 10;
  const labelW = (cw - 20) / 2;
  const rowH = 24;

  function fieldRow(y: number, label: string, value: string, x: number, w: number) {
    doc.font("Helvetica-Bold").fontSize(8).fillColor(MUTED).text(label, x, y, { width: w });
    doc.font("Helvetica").fontSize(11).fillColor(DARK).text(value, x, y + 12, { width: w });
  }

  fieldRow(boxY, "STUDENT NAME", data.studentName, col1X, labelW);
  fieldRow(boxY, "STUDENT NUMBER", data.studentNumber, col2X, labelW);

  fieldRow(boxY + rowH, "COURSE NAME", data.courseName, col1X, labelW);
  fieldRow(boxY + rowH, "CATEGORY", data.courseCategory, col2X, labelW);

  fieldRow(boxY + rowH * 2, "DURATION", `${data.durationWeeks} ${data.durationWeeks === 1 ? "week" : "weeks"}`, col1X, labelW);
  fieldRow(boxY + rowH * 2, "ENROLLMENT DATE", formatDateShort(data.enrolledAt), col2X, labelW);

  fieldRow(boxY + rowH * 3, "STATUS", data.status.replace("_", " ").toUpperCase(), col1X, labelW);
  fieldRow(boxY + rowH * 3, "DATE ISSUED", formatDateShort(data.generatedAt), col2X, labelW);

  // Table-like border
  const tableY = boxY - 6;
  const tableH = rowH * 4 + 40;
  doc.roundedRect(ml, tableY, cw, tableH, 4).lineWidth(0.5).stroke("#dddddd");

  // Footer section with verification
  const footerY = 430;
  doc.moveTo(ml + 60, footerY).lineTo(pw - ml - 60, footerY).lineWidth(0.5).stroke("#dddddd");

  // Signature area
  doc.font("Helvetica").fontSize(9).fillColor(MUTED)
    .text("This is to certify that the above-named student is registered with", ml, footerY + 12, { width: cw, align: "center" })
    .text(`${COMPANY.name} for the specified training program.`, { width: cw, align: "center" });

  // Stamp area (visual placeholder)
  const stampX = pw - ml - 90;
  const stampY = 460;
  doc.roundedRect(stampX, stampY, 80, 60, 4).lineWidth(0.5).stroke(GOLD);
  doc.font("Helvetica-Bold").fontSize(7).fillColor(GOLD).text("AUTHORISED", stampX, stampY + 22, { width: 80, align: "center" });
  doc.font("Helvetica").fontSize(6).fillColor(MUTED).text("Stamp & Signature", stampX, stampY + 34, { width: 80, align: "center" });

  // Left signature line
  const sigY = 490;
  doc.moveTo(ml + 40, sigY).lineTo(ml + 170, sigY).lineWidth(0.5).stroke("#999999");
  doc.font("Helvetica-Bold").fontSize(8).fillColor(MUTED).text("Authorised Signature", ml + 40, sigY + 5, { width: 130, align: "center" });

  // Footer
  doc.font("Helvetica").fontSize(7).fillColor("#999999");
  doc.text(
    `Document Reference: ${data.referenceNumber} | Generated on ${formatDateLong(data.generatedAt)}`,
    ml, 540,
    { width: cw, align: "center" }
  );
  doc.text(
    `${COMPANY.name} | ${COMPANY.location} | ${COMPANY.email}`,
    ml, 555,
    { width: cw, align: "center" }
  );

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat("en-ZA", {
    year: "numeric", month: "short", day: "numeric",
  }).format(date);
}

function formatDateLong(date: Date): string {
  return new Intl.DateTimeFormat("en-ZA", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(date);
}
