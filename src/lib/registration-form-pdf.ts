import { COMPANY, ALL_COURSES, COURSE_CATEGORIES } from "@/lib/constants";

interface RegistrationFormData {
  courseSlug?: string;
}

export async function generateRegistrationFormPDF(data?: RegistrationFormData): Promise<Buffer> {
  const PDFDocument = (await import("pdfkit")).default;

  const doc = new PDFDocument({
    size: "A4",
    layout: "portrait",
    margins: { top: 30, bottom: 30, left: 25, right: 25 },
    info: {
      Title: `Registration Form - ${COMPANY.name}`,
      Author: COMPANY.name,
      Subject: "Student Registration Form",
    },
  });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  const pw = doc.page.width;
  const ph = doc.page.height;

  // === HEADER ===
  doc.rect(0, 0, pw, 90).fill("#111111");
  doc.font("Helvetica-Bold").fontSize(18).fillColor("#D9A400");
  doc.text(COMPANY.name.toUpperCase(), 25, 18, { width: pw - 50, align: "center" });
  doc.font("Helvetica").fontSize(9).fillColor("#CCCCCC");
  doc.text(COMPANY.location, { align: "center" });
  doc.text(`Email: ${COMPANY.email} | Phone: ${COMPANY.phone}`, { align: "center" });
  doc.text(`Website: ${COMPANY.website}`, { align: "center" });
  doc.moveDown(0.3);
  doc.font("Helvetica-Bold").fontSize(14).fillColor("#D9A400");
  doc.text("STUDENT REGISTRATION FORM", { align: "center" });

  const yStart = 100;
  let y = yStart;
  const leftX = 25;
  const rightX = pw / 2 + 10;
  const fieldW = pw / 2 - 40;
  const lineH = 22;
  const smallH = 18;

  function line(yPos: number) {
    doc.moveTo(leftX, yPos).lineTo(pw - 25, yPos).lineWidth(0.3).stroke("#888888");
  }

  function sectionTitle(text: string, yPos: number) {
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#D9A400");
    const rectH = 18;
    doc.rect(leftX, yPos - 2, pw - 50, rectH).fillOpacity(0.08).fillColor("#D9A400").fillOpacity(1);
    doc.fillColor("#D9A400").text(text, leftX + 6, yPos + 1);
    doc.fillColor("#111111");
    return yPos + rectH + 4;
  }

  function field(label: string, x: number, yPos: number, w: number, value = "") {
    doc.font("Helvetica-Bold").fontSize(7).fillColor("#555555");
    doc.text(label, x, yPos, { width: w, continued: false });
    doc.font("Helvetica").fontSize(9).fillColor("#000000");
    doc.text(value || ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", x, yPos + 10, { width: w });
    line(yPos + 22);
    return yPos + 24;
  }

  function spacer(h: number) { return h; }

  // === SECTION 1: COURSE SELECTION ===
  y = sectionTitle("1. COURSE SELECTION", y);

  doc.font("Helvetica-Bold").fontSize(7).fillColor("#555555");
  doc.text("Select your desired course(s):", leftX, y);
  y += 12;

  const catOrder = ["Machinery", "Safety", "Mining", "Industrial"];
  for (const cat of catOrder) {
    const coursesInCat = ALL_COURSES.filter((c) => c.category === cat);
    if (coursesInCat.length === 0) continue;
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#D9A400");
    doc.text(cat, leftX, y);
    y += 10;
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000");
    const items = coursesInCat.map(
      (c) =>
        `☐  ${c.title} (${c.durationWeeks} wk · R${c.price.toLocaleString()})`
    );
    const col1 = items.slice(0, Math.ceil(items.length / 2));
    const col2 = items.slice(Math.ceil(items.length / 2));
    const maxRows = Math.max(col1.length, col2.length);
    for (let i = 0; i < maxRows; i++) {
      if (col1[i]) doc.text(col1[i], leftX, y, { width: fieldW + 20 });
      if (col2[i]) doc.text(col2[i], rightX, y, { width: fieldW + 20 });
      y += 12;
    }
    y += 2;
  }
  y += 2;

  doc.font("Helvetica-Bold").fontSize(7).fillColor("#555555");
  doc.text("Training Type:", leftX, y);
  y += 10;
  doc.font("Helvetica").fontSize(8).fillColor("#000000");
  doc.text("☐  Weekdays     ☐  Weekends     ☐  Flexible", leftX, y);
  y += 18;

  doc.font("Helvetica-Bold").fontSize(7).fillColor("#555555");
  doc.text("Preferred Intake Date:", leftX, y);
  doc.text(". . . . . . . . . . . . . . . . . .", leftX + 80, y + 10);
  y += 24;

  // === SECTION 2: PERSONAL INFORMATION ===
  y = sectionTitle("2. PERSONAL INFORMATION", y);

  let fy = y;
  fy = field("Full Name(s)", leftX, fy, fieldW);
  fy = field("Surname", rightX, fy - 24, fieldW);
  fy = field("ID Number", leftX, fy, fieldW);
  fy = field("Date of Birth (YYYY-MM-DD)", rightX, fy - 24, fieldW);
  fy = field("Gender", leftX, fy, fieldW);
  fy = field("Nationality", rightX, fy - 24, fieldW);
  fy = field("Mobile Number", leftX, fy, fieldW);
  fy = field("WhatsApp Number", rightX, fy - 24, fieldW);
  fy = field("Email Address", leftX, fy, pw - 50);
  fy = field("Physical Address", leftX, fy, pw - 50);
  fy = field("City", leftX, fy, fieldW);
  fy = field("Province", rightX, fy - 24, fieldW);
  fy = field("Employment Status", leftX, fy, fieldW);
  fy = field("Employer (if employed)", rightX, fy - 24, fieldW);
  y = fy + 4;

  // === SECTION 3: EMERGENCY CONTACT ===
  y = sectionTitle("3. EMERGENCY CONTACT", y);

  fy = y;
  fy = field("Contact Person (Full Name)", leftX, fy, pw - 50);
  fy = field("Relationship to Student", leftX, fy, fieldW);
  fy = field("Phone Number", rightX, fy - 24, fieldW);
  fy = field("Alternative Phone Number", leftX, fy, pw - 50);
  y = fy + 4;

  // === SECTION 4: EDUCATION & BACKGROUND ===
  y = sectionTitle("4. EDUCATION & BACKGROUND", y);

  fy = y;
  doc.font("Helvetica").fontSize(8).fillColor("#000000");
  doc.text("Highest Education Level Obtained:", leftX, fy);
  fy += 14;
  doc.text("☐  Grade 10    ☐  Grade 12    ☐  Certificate    ☐  Diploma    ☐  Degree    ☐  Other", leftX, fy);
  fy += 18;
  fy = field("Other (specify)", leftX, fy, fieldW);
  fy = field("Previous Mining / Machinery Experience", rightX, fy - 24, fieldW);
  fy = field("How did you hear about MMS?", leftX, fy, pw - 50);
  y = fy + 4;

  // === SECTION 5: DOCUMENTS REQUIRED ===
  y = sectionTitle("5. DOCUMENTS REQUIRED", y);
  doc.font("Helvetica").fontSize(8).fillColor("#555555");
  doc.text("Please attach copies of the following when submitting this form:", leftX, y);
  y += 14;
  doc.font("Helvetica").fontSize(8).fillColor("#000000");
  const docs = [
    "☐  Certified Copy of ID Document",
    "☐  Proof of Address (not older than 3 months)",
    "☐  Passport (for foreign nationals)",
    "☐  Previous Certificates (if applicable)",
    "☐  Proof of Payment / Deposit (if applicable)",
  ];
  for (const d of docs) {
    doc.text(d, leftX, y);
    y += 13;
  }
  y += 4;

  // === SECTION 6: DECLARATIONS ===
  y = sectionTitle("6. DECLARATIONS & CONSENT", y);

  doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#D9A400");
  doc.text("POPIA Consent", leftX, y);
  y += 12;
  doc.font("Helvetica").fontSize(7.5).fillColor("#333333");
  const popiaText =
    "I hereby consent to Mpumalanga Mining Solutions processing my personal information for training, administrative, and communication purposes in accordance with the Protection of Personal Information Act (POPIA). I understand that my information will not be shared with third parties without my explicit consent.";
  doc.text(popiaText, leftX, y, { width: pw - 50 });
  y += 40;
  doc.font("Helvetica").fontSize(8).fillColor("#000000");
  doc.text("☐  I consent to the processing of my personal information as described above.", leftX, y);
  y += 18;
  doc.text("☐  I confirm that all information provided in this form is accurate and complete.", leftX, y);
  y += 22;

  const termsText =
    "I acknowledge that by submitting this registration form, I agree to abide by the terms and conditions of Mpumalanga Mining Solutions, including payment policies, attendance requirements, and code of conduct. I understand that my application is subject to review and approval by the admissions committee.";
  doc.font("Helvetica").fontSize(7.5).fillColor("#333333");
  doc.text(termsText, leftX, y, { width: pw - 50 });
  y += 40;

  // === SIGNATURE SECTION ===
  y = sectionTitle("7. SIGNATURE", y);

  doc.font("Helvetica").fontSize(8).fillColor("#000000");
  doc.text("Applicant Signature: . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", leftX, y);
  doc.text("Date: . . . . . . . / . . . . . . / . . . . . .", rightX, y);
  y += 20;

  doc.text("Parent / Guardian Signature (if under 18): . . . . . . . . . . . . . . . . . . . . . . . . . .", leftX, y);
  doc.text("Date: . . . . . . . / . . . . . . / . . . . . .", rightX, y);
  y += 22;

  // === FOOTER ===
  doc.rect(0, ph - 20, pw, 20).fill("#111111");
  doc.font("Helvetica").fontSize(7).fillColor("#888888");
  doc.text(`${COMPANY.name} | ${COMPANY.location} | ${COMPANY.phone} | ${COMPANY.email}`, 0, ph - 15, { align: "center", width: pw });

  doc.end();
  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
