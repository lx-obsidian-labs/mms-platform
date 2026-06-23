import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateProofOfRegistrationPDF } from "@/lib/proof-of-registration-pdf";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*, courses(title, category, duration_weeks), students(profiles(first_name, last_name), student_number)")
    .eq("id", id)
    .single();

  if (!enrollment) {
    return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
  }

  const enrollmentData = enrollment as Record<string, unknown>;
  const course = enrollmentData.courses as Record<string, unknown> ?? {};
  const student = enrollmentData.students as Record<string, unknown> ?? {};
  const profile = student.profiles as Record<string, unknown> ?? {};

  const studentName = `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim();

  if (!studentName) {
    return NextResponse.json({ error: "Student name not found" }, { status: 400 });
  }

  const refNumber = `POR-${String(enrollmentData.id ?? "").slice(0, 8).toUpperCase()}-${new Date().getFullYear()}`;

  const pdfBuffer = await generateProofOfRegistrationPDF({
    referenceNumber: refNumber,
    studentName,
    studentNumber: String(student.student_number ?? ""),
    courseName: String(course.title ?? ""),
    courseCategory: String(course.category ?? ""),
    durationWeeks: Number(course.duration_weeks ?? 0),
    enrolledAt: new Date(enrollmentData.enrolled_at as string ?? new Date()),
    status: String(enrollmentData.status ?? "active"),
    generatedAt: new Date(),
  });

  const filename = `proof-of-registration-${String(course.title ?? "").toLowerCase().replace(/\s+/g, "-")}.pdf`;

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
