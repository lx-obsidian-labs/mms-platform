import { NextRequest, NextResponse } from "next/server";
import { generateRegistrationFormPDF } from "@/lib/registration-form-pdf";

export async function GET(request: NextRequest) {
  const course = request.nextUrl.searchParams.get("course") || undefined;

  const pdfBuffer = await generateRegistrationFormPDF(
    course ? { courseSlug: course } : undefined
  );

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="MMS-Registration-Form.pdf"`,
    },
  });
}
