import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: student } = await supabase
    .from("students").select("id").eq("user_id", user.id).single();
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  const fd = await request.formData();
  const file = fd.get("file") as File | null;
  const lessonId = fd.get("lessonId") as string | null;
  const enrollmentId = fd.get("enrollmentId") as string | null;

  if (!file || !lessonId || !enrollmentId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Verify enrollment ownership
  const { data: enrollment } = await supabase
    .from("enrollments").select("id")
    .eq("id", enrollmentId).eq("student_id", student.id).single();
  if (!enrollment) return NextResponse.json({ error: "Enrollment not found" }, { status: 403 });

  // Validate file
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 400 });
  }

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg", "image/jpg", "image/png",
  ];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "pdf";
  const fileName = `assignments/${enrollmentId}/${lessonId}_${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("applications")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    console.error("[Assignment Upload] Error:", uploadError);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from("applications").getPublicUrl(fileName);

  // Check if progress record exists
  const { data: existing } = await supabase
    .from("lesson_progress")
    .select("id")
    .eq("enrollment_id", enrollmentId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (existing) {
    await supabase.from("lesson_progress").update({
      completed: true,
      completed_at: new Date().toISOString(),
    }).eq("id", existing.id);
  } else {
    await supabase.from("lesson_progress").insert({
      enrollment_id: enrollmentId,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString(),
    });
  }

  // Recalculate course progress
  const { data: lesson } = await supabase
    .from("lessons").select("course_id").eq("id", lessonId).single();

  if (lesson) {
    const { count: total } = await supabase
      .from("lessons").select("*", { count: "exact", head: true })
      .eq("course_id", lesson.course_id).eq("is_published", true);

    const { count: done } = await supabase
      .from("lesson_progress").select("*", { count: "exact", head: true })
      .eq("enrollment_id", enrollmentId).eq("completed", true);

    const pct = total && total > 0 ? Math.round(((done ?? 0) / total) * 100) : 0;
    await supabase.from("enrollments").update({ progress_percentage: pct }).eq("id", enrollmentId);
  }

  return NextResponse.json({ url: urlData.publicUrl });
}
