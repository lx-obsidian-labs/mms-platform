// ============================================
// MMS SERVER ACTIONS
// ============================================

"use server";

import { createClient } from "@/lib/supabase/server";
import {
  sendApplicationConfirmation,
  sendApplicationStatusUpdate,
  sendAdminNotification,
  sendContactFormNotification,
  sendCourseAccessActivated,
  sendInstructorNotification,
  sendWelcomeStudent,
} from "@/lib/email";
import { generateReferenceNumber, generateStudentNumber, generateTemporaryPassword, generateCertificateNumber } from "@/lib/utils";
import { ALL_COURSES } from "@/lib/constants";
import { COMPANY } from "@/lib/constants";

// ============================================
// FILE UPLOAD TO SUPABASE STORAGE
// ============================================

export async function uploadApplicationFile(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string;
    const applicationId = formData.get("applicationId") as string;

    if (!file || file.size === 0) {
      return { success: false, error: "No file provided" };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { success: false, error: "File exceeds 5MB limit" };
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Invalid file type. Only PDF, PNG, JPG allowed." };
    }

    const supabase = await createClient();

    const ext = file.name.split(".").pop() || "pdf";
    const fileName = `${folder}/${applicationId}_${Date.now()}.${ext}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("applications")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("[Upload] Storage error:", uploadError);
      return { success: false, error: "Failed to upload file" };
    }

    const { data: urlData } = supabase.storage
      .from("applications")
      .getPublicUrl(fileName);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error("[Upload] Unexpected error:", error);
    return { success: false, error: "Upload failed" };
  }
}

// ============================================
// ENROLLMENT APPLICATION SUBMISSION
// ============================================

export interface EnrollmentFormData {
  courseSlug: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp: string;
  idNumber: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  province: string;
  address: string;
  city: string;
  postalCode: string;
  employmentStatus: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyRelationship: string;
  emergencyAltPhone: string;
  trainingType: string;
  preferredIntakeDate: string;
  motivation: string;
  consentGiven: boolean;
  idCopyUrl?: string;
  proofOfAddressUrl?: string;
  passportUrl?: string;
  previousCertificatesUrl?: string;
  proofOfPaymentUrl?: string;
}

export async function submitApplication(formData: EnrollmentFormData) {
  try {
    const supabase = await createClient();

    const course = ALL_COURSES.find((c) => c.slug === formData.courseSlug);
    if (!course) {
      return { success: false, error: "Selected course not found." };
    }

    const { data: dbCourse, error: courseError } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", formData.courseSlug)
      .single();

    if (courseError || !dbCourse) {
      return {
        success: false,
        error: "Course not found in database. Please ensure the database schema is set up.",
      };
    }

    const referenceNumber = generateReferenceNumber();
    const tempPassword = generateTemporaryPassword();

    // Try to create auth user (skip if exists)
    let userId: string | null = null;
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", formData.email)
      .single();

    if (!existingUser) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: tempPassword,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });

      if (authError && !authError.message.includes("already")) {
        console.error("[Application] Auth signup error:", authError);
      }

      userId = authData?.user?.id ?? null;
    } else {
      userId = existingUser.id;
    }

    // Insert application (with a fallback if user creation fails)
    const { data: application, error: appError } = await supabase
      .from("applications")
      .insert({
        reference_number: referenceNumber,
        course_id: dbCourse.id,
        user_id: userId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        id_number: formData.idNumber,
        date_of_birth: formData.dateOfBirth ? formData.dateOfBirth.split("T")[0] : null,
        gender: formData.gender,
        province: formData.province,
        address: `${formData.address}, ${formData.city}`,
        postal_code: formData.postalCode,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_phone: formData.emergencyContactPhone,
        employment_status: formData.employmentStatus,
        training_type: formData.trainingType,
        motivation: formData.motivation,
        id_document_url: formData.idCopyUrl,
        qualifications_url: formData.previousCertificatesUrl,
        medical_fitness_url: null,
        consent_given: formData.consentGiven,
        consent_given_at: formData.consentGiven ? new Date().toISOString() : null,
        status: "submitted",
      })
      .select("id, reference_number")
      .single();

    if (appError) {
      console.error("[Application] DB insert error:", appError);
      return { success: false, error: "Failed to submit application. Please try again." };
    }

    // Log to audit
    await supabase.from("audit_logs").insert({
      user_id: userId,
      action: "application_submitted",
      entity_type: "applications",
      entity_id: application.id,
      details: { reference: referenceNumber, course: course.title },
    }).maybeSingle();

    // Create WhatsApp follow-up task
    await supabase.from("whatsapp_queue").insert({
      student_id: null,
      assigned_to: null,
      message_type: "new_application",
      message_body: `Follow up with ${formData.firstName} ${formData.lastName} regarding ${course.title} application (${referenceNumber})`,
      status: "pending",
    }).maybeSingle();

    // Send confirmation email to applicant
    await sendApplicationConfirmation({
      to: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      courseName: course.title,
      referenceNumber,
    });

    // Notify admin
    await sendAdminNotification({
      firstName: formData.firstName,
      lastName: formData.lastName,
      courseName: course.title,
      referenceNumber,
      email: formData.email,
      phone: formData.phone,
    });

    // Notify instructor
    await sendInstructorNotification({
      to: COMPANY.email,
      studentName: `${formData.firstName} ${formData.lastName}`,
      courseName: course.title,
      phone: formData.phone,
      email: formData.email,
      referenceNumber,
      whatsapp: formData.whatsapp || formData.phone,
    });

    return {
      success: true,
      referenceNumber,
      applicationId: application.id,
      tempPassword,
    };
  } catch (error) {
    console.error("[Application] Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

// ============================================
// CONTACT FORM SUBMISSION
// ============================================

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function submitContactForm(formData: ContactFormData) {
  try {
    // Send notification to admin
    await sendContactFormNotification({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    });

    return { success: true };
  } catch (error) {
    console.error("[Contact] Error:", error);
    return { success: false, error: "Failed to send message. Please try again." };
  }
}

// ============================================
// AUTH ACTIONS
// ============================================

export async function signInWithPassword(email: string, password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user };
}

export async function signUp(email: string, password: string, firstName: string, lastName: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function requestLoginDetails(email: string) {
  try {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name")
      .eq("email", email)
      .maybeSingle();

    if (profile) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
      });
      if (error) return { success: false, error: error.message };
    }

    return { success: true };
  } catch {
    return { success: true };
  }
}

// ============================================
// ADMIN ACTIONS
// ============================================

export async function getApplications(filters?: {
  status?: string;
  search?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("applications")
    .select("*, courses(title, slug)")
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters?.search) {
    query = query.or(
      `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,reference_number.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error("[Admin] Get applications error:", error);
    return { data: [], error: error.message };
  }

  return { data: data ?? [], error: null };
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "under_review" | "accepted" | "rejected" | "waitlisted",
  notes?: string
) {
  const supabase = await createClient();

  const { data: { user: admin } } = await supabase.auth.getUser();
  if (!admin) return { success: false, error: "Unauthorized" };

  // Fetch application with course
  const { data: application, error: fetchError } = await supabase
    .from("applications")
    .select("*, courses!inner(id, title, slug)")
    .eq("id", applicationId)
    .single();

  if (fetchError || !application) {
    return { success: false, error: fetchError?.message ?? "Application not found" };
  }

  const course = application.courses as unknown as { id: string; title: string; slug: string };

  // Update application status
  const { error: updateError } = await supabase
    .from("applications")
    .update({
      status,
      reviewed_by: admin.id,
      reviewed_at: new Date().toISOString(),
      notes: notes ?? null,
    })
    .eq("id", applicationId);

  if (updateError) {
    console.error("[Admin] Update application error:", updateError);
    return { success: false, error: updateError.message };
  }

  // If accepted: create student record + enrollment
  if (status === "accepted" && application.user_id) {
    const studentNumber = generateStudentNumber();

    const { data: student } = await supabase.from("students").upsert({
      user_id: application.user_id,
      student_number: studentNumber,
      id_number: application.id_number,
      date_of_birth: application.date_of_birth,
      gender: application.gender,
      address: application.address,
      province: application.province,
      postal_code: application.postal_code,
      emergency_contact_name: application.emergency_contact_name,
      emergency_contact_phone: application.emergency_contact_phone,
    }).select("id").maybeSingle();

    const studentId = student?.id ?? application.user_id;

    // Create enrollment
    await supabase.from("enrollments").upsert({
      student_id: studentId,
      course_id: course.id,
      status: "active",
      enrolled_at: new Date().toISOString(),
      progress_percentage: 0,
    }).maybeSingle();

    // Send course access + welcome emails
    await sendCourseAccessActivated({
      to: application.email,
      firstName: application.first_name,
      lastName: application.last_name,
      courseName: course.title,
      portalUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://mpumalangaminingsolutions.co.za"}/portal`,
      email: application.email,
      password: "Use your existing password",
    });

    await sendWelcomeStudent({
      to: application.email,
      firstName: application.first_name,
      lastName: application.last_name,
      courseName: course.title,
      startDate: new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" }),
    });
  }

  // Send status update email
  if (status === "accepted" || status === "rejected" || status === "under_review") {
    await sendApplicationStatusUpdate({
      to: application.email,
      firstName: application.first_name,
      lastName: application.last_name,
      courseName: course?.title ?? "your selected course",
      referenceNumber: application.reference_number,
      status: status as "accepted" | "rejected" | "under_review",
      notes,
    });
  }

  return { success: true };
}

// ============================================
// LESSON PROGRESS ACTIONS
// ============================================

export async function markLessonComplete(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const lessonId = formData.get("lessonId") as string;
  const courseId = formData.get("courseId") as string;
  if (!lessonId || !courseId) return { success: false, error: "Missing required fields" };

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!student) return { success: false, error: "Student profile not found" };

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, progress_percentage")
    .eq("student_id", student.id)
    .eq("course_id", courseId)
    .single();

  if (!enrollment) return { success: false, error: "Enrollment not found" };

  // Upsert lesson progress
  const { error: progressError } = await supabase
    .from("lesson_progress")
    .upsert({
      enrollment_id: enrollment.id,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString(),
    }, { onConflict: "enrollment_id, lesson_id" });

  if (progressError) {
    console.error("[Progress] Upsert error:", progressError);
    return { success: false, error: "Failed to update progress" };
  }

  // Recalculate overall progress
  const { count: totalLessons } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true })
    .eq("course_id", courseId)
    .eq("is_published", true);

  const { count: completedLessons } = await supabase
    .from("lesson_progress")
    .select("id", { count: "exact", head: true })
    .eq("enrollment_id", enrollment.id)
    .eq("completed", true);

  const newPct = totalLessons && totalLessons > 0
    ? Math.round(((completedLessons ?? 0) / totalLessons) * 100)
    : enrollment.progress_percentage;

  await supabase
    .from("enrollments")
    .update({ progress_percentage: newPct })
    .eq("id", enrollment.id);

  return { success: true, progress: newPct };
}

// ============================================
// BLOG POST ACTIONS
// ============================================

export async function createBlogPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const title = (formData.get("title") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const category = (formData.get("category") as string)?.trim() || "General";
  const author_name = (formData.get("author_name") as string)?.trim() || "MMS Admin";
  const published = formData.get("published") === "true";
  const tags = (formData.get("tags") as string)?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];

  if (!title || !content) {
    return { success: false, error: "Title and content are required." };
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const { error } = await supabase.from("blog_posts").insert({
    title,
    slug,
    excerpt,
    content,
    category,
    author_name,
    published,
    tags,
    published_at: published ? new Date().toISOString() : null,
  });

  if (error) {
    console.error("[Blog] Create error:", error);
    return { success: false, error: "Failed to create post: " + error.message };
  }

  return { success: true, slug };
}

export async function updateBlogPost(postId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const title = (formData.get("title") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const author_name = (formData.get("author_name") as string)?.trim();
  const published = formData.get("published") === "true";
  const tags = (formData.get("tags") as string)?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];

  if (!title || !content) {
    return { success: false, error: "Title and content are required." };
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const updates: Record<string, unknown> = {
    title,
    slug,
    excerpt,
    content,
    category,
    author_name,
    tags,
  };

  if (published && !formData.get("published_at")) {
    updates.published_at = new Date().toISOString();
  }

  const { error } = await supabase.from("blog_posts").update(updates).eq("id", postId);

  if (error) {
    return { success: false, error: "Failed to update post." };
  }

  return { success: true };
}

// ============================================
// AI CHATBOT ACTIONS
// ============================================

const AI_SYSTEM_PROMPT = `You are an AI assistant for Mpumalanga Mining Solutions (MMS), 
a premier mining and heavy machinery training institution in Middelburg, Mpumalanga, South Africa.

Your role:
- Help prospective students with course information, enrollment, and requirements
- Answer questions about training programs, prices, durations, and career paths
- Provide general information about the institution, location, and contact details
- Be helpful, professional, and concise
- If you don't know something, say so honestly
- Never share pricing that you're not confident about — direct them to the website or contact form

Keep responses brief and scannable. Use bullet points when helpful.`;

export async function chatWithAI(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const message = formData.get("message") as string;
  const sessionId = formData.get("sessionId") as string;

  if (!message || !sessionId) {
    return { success: false, error: "Message and session are required." };
  }

  // Store user message
  await supabase.from("ai_conversations").insert({
    user_id: user?.id ?? null,
    session_id: sessionId,
    role: "user",
    message,
  }).maybeSingle();

  // Get recent conversation history
  const { data: history } = await supabase
    .from("ai_conversations")
    .select("role, message")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(10);

  const conversationHistory = (history ?? []).reverse();

  // Build messages array for the API
  const messages: { role: string; content: string }[] = [
    { role: "system", content: AI_SYSTEM_PROMPT },
    ...conversationHistory.map((h) => ({ role: h.role, content: h.message })),
  ];

  let reply = "";

  // Try NVIDIA NIM API if key is configured
  const apiKey = process.env.NVIDIA_NIM_API_KEY || process.env.NVIDIA_API_KEY;
  const apiUrl = process.env.NVIDIA_NIM_API_URL ?? "https://integrate.api.nvidia.com/v1/chat/completions";

  if (apiKey) {
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.NVIDIA_NIM_MODEL ?? "meta/llama-3.1-8b-instruct",
          messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        console.error("[AI] API error:", res.status, await res.text());
        reply = "I'm sorry, I'm having trouble connecting right now. Please try again later.";
      } else {
        const data = await res.json();
        reply = data.choices?.[0]?.message?.content ?? "I'm not sure how to respond to that.";
      }
    } catch (err) {
      console.error("[AI] Fetch error:", err);
      reply = "I'm sorry, I encountered an error. Please try again.";
    }
  } else {
    // Fallback: simple keyword-based responses
    reply = generateFallbackResponse(message);
  }

  // Store assistant response
  await supabase.from("ai_conversations").insert({
    user_id: user?.id ?? null,
    session_id: sessionId,
    role: "assistant",
    message: reply,
  }).maybeSingle();

  return { success: true, reply, sessionId };
}

function generateFallbackResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("course") || lower.includes("train") || lower.includes("program")) {
    return `We offer **17 training programs** including Forklift, Excavator, Dump Truck 777D, Mobile Crane, and more. 

Visit our **Courses page** to see the full list: https://mpumalangaminingsolutions.co.za/courses

Or contact us for personalized advice.`;
  }

  if (lower.includes("price") || lower.includes("cost") || lower.includes("fee") || lower.includes("pay")) {
    return `Our course fees range from **R5,000** (First Aid) to **R32,000** (Mobile Crane).

For exact pricing and payment plan options, please visit the course page or contact our admissions team:

📧 info@mpumalangaminingsolutions.co.za
📞 +27 000 000 000`;
  }

  if (lower.includes("apply") || lower.includes("enroll") || lower.includes("register") || lower.includes("admission")) {
    return `Ready to apply? Here's how:

1. **Choose your course** on our Courses page
2. Click **"Apply Now"** on your chosen course
3. Complete the online application form
4. Our team will review and contact you within 48 hours

Start your application here: https://mpumalangaminingsolutions.co.za/apply`;
  }

  if (lower.includes("location") || lower.includes("address") || lower.includes("where") || lower.includes("middelburg")) {
    return `We are located in **Middelburg, Mpumalanga**, South Africa.

📍 Middelburg, Mpumalanga
📧 info@mpumalangaminingsolutions.co.za
📞 +27 000 000 000`;
  }

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("good")) {
    return `Hello! 👋 Welcome to Mpumalanga Mining Solutions.

I can help you with:
• Course information and pricing
• Application and enrollment
• Training requirements
• Location and contact details

What would you like to know?`;
  }

  return `Thanks for your question! I'm here to help with information about our training programs, enrollment, and more.

For specific queries, you can also:
• Browse our **Courses**: https://mpumalangaminingsolutions.co.za/courses
• **Contact us**: info@mpumalangaminingsolutions.co.za
• Call us: +27 000 000 000

How else can I assist you?`;
}

// ============================================
// SUPPORT TICKET ACTIONS
// ============================================

export async function createSupportTicket(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;
  const priority = (formData.get("priority") as string) || "normal";

  if (!subject || !message) {
    return { success: false, error: "Subject and message are required." };
  }

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!student) {
    return { success: false, error: "Student profile not found." };
  }

  const { error } = await supabase.from("support_tickets").insert({
    student_id: student.id,
    subject,
    message,
    priority,
    status: "open",
  });

  if (error) {
    console.error("[Ticket] Create error:", error);
    return { success: false, error: "Failed to create ticket." };
  }

  return { success: true };
}

export async function replyToSupportTicket(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const ticketId = formData.get("ticketId") as string;
  const message = formData.get("message") as string;

  if (!ticketId || !message) {
    return { success: false, error: "Message is required." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isStaff = profile?.role === "admin" || profile?.role === "instructor" || profile?.role === "staff";

  const { error } = await supabase.from("support_ticket_replies").insert({
    ticket_id: ticketId,
    user_id: user.id,
    message,
    is_staff: isStaff,
  });

  if (error) {
    console.error("[Ticket Reply] Error:", error);
    return { success: false, error: "Failed to send reply." };
  }

  return { success: true };
}

export async function updateTicketStatus(ticketId: string, status: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const update: Record<string, string> = { status };
  if (status === "resolved" || status === "closed") {
    update.resolved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("support_tickets")
    .update(update)
    .eq("id", ticketId);

  if (error) {
    console.error("[Ticket Status] Error:", error);
    return { success: false, error: "Failed to update ticket status." };
  }

  return { success: true };
}

export async function issueCertificate(enrollmentId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*, courses(title), students!inner(profiles!inner(first_name, last_name))")
    .eq("id", enrollmentId)
    .single();

  if (!enrollment) return { success: false, error: "Enrollment not found" };

  if (enrollment.certificate_id) {
    return { success: false, error: "Certificate already issued for this enrollment" };
  }

  const certificateNumber = generateCertificateNumber();

  const { data: cert, error: certError } = await supabase
    .from("certificates")
    .insert({
      enrollment_id: enrollmentId,
      certificate_number: certificateNumber,
      status: "issued",
      issued_at: new Date().toISOString(),
      pdf_url: null,
    })
    .select()
    .single();

  if (certError) {
    console.error("[Certificate] Create error:", certError);
    return { success: false, error: "Failed to create certificate" };
  }

  const { error: enrollError } = await supabase
    .from("enrollments")
    .update({ certificate_id: cert.id, status: "completed", completed_at: new Date().toISOString() })
    .eq("id", enrollmentId);

  if (enrollError) {
    console.error("[Certificate] Enroll update error:", enrollError);
  }

  const { error: pdfError } = await supabase
    .from("certificates")
    .update({ pdf_url: `/api/certificates/${cert.id}/download` })
    .eq("id", cert.id);

  if (pdfError) {
    console.error("[Certificate] PDF URL update error:", pdfError);
  }

  return { success: true, certificateId: cert.id };
}

export async function getDashboardStats() {
  const supabase = await createClient();

  const [
    { count: totalApplications },
    { count: pendingApplications },
    { count: acceptedApplications },
    { count: totalStudents },
    { count: activeEnrollments },
    { count: totalCourses },
  ] = await Promise.all([
    supabase.from("applications").select("*", { count: "exact", head: true }),
    supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "submitted"),
    supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "accepted"),
    supabase.from("students").select("*", { count: "exact", head: true }),
    supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("courses").select("*", { count: "exact", head: true }).eq("is_active", true),
  ]);

  return {
    totalApplications: totalApplications ?? 0,
    pendingApplications: pendingApplications ?? 0,
    acceptedApplications: acceptedApplications ?? 0,
    totalStudents: totalStudents ?? 0,
    activeEnrollments: activeEnrollments ?? 0,
    totalCourses: totalCourses ?? 0,
  };
}
