import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCertificatePDF } from "@/lib/certificate-pdf";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: cert } = await supabase
    .from("certificates")
    .select("*, enrollments!inner(courses!inner(title, category, duration_weeks, duration_hours), students!inner(profiles!inner(first_name, last_name)))")
    .eq("id", id)
    .single();

  if (!cert) {
    return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  }

  const enrollment = cert.enrollments as Record<string, unknown>;
  const course = enrollment?.courses as Record<string, unknown> ?? {};
  const student = enrollment?.students as Record<string, unknown> ?? {};
  const profile = student?.profiles as Record<string, unknown> ?? {};

  const studentName = `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim();

  if (!studentName) {
    return NextResponse.json({ error: "Student name not found" }, { status: 400 });
  }

  const pdfBuffer = await generateCertificatePDF({
    certificateNumber: cert.certificate_number,
    studentName,
    courseName: String(course.title ?? ""),
    courseCategory: String(course.category ?? ""),
    durationWeeks: Number(course.duration_weeks ?? 0),
    durationHours: Number(course.duration_hours ?? 0),
    issueDate: new Date(cert.issued_at),
    expiryDate: cert.expires_at ? new Date(cert.expires_at) : undefined,
  });

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificate-${cert.certificate_number}.pdf"`,
    },
  });
}
