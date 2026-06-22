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
import { generateReferenceNumber, generateStudentNumber, generateTemporaryPassword } from "@/lib/utils";
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
