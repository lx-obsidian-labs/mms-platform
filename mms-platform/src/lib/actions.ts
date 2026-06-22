// ============================================
// MMS SERVER ACTIONS
// ============================================

"use server";

import { createClient } from "@/lib/supabase/server";
import {
  sendApplicationConfirmation,
  sendAdminNotification,
  sendContactFormNotification,
} from "@/lib/email";
import { generateReferenceNumber } from "@/lib/utils";
import { ALL_COURSES } from "@/lib/constants";

// ============================================
// ENROLLMENT APPLICATION SUBMISSION
// ============================================

export interface EnrollmentFormData {
  // Course
  courseSlug: string;
  // Personal
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  dateOfBirth: string;
  gender: string;
  province: string;
  address: string;
  postalCode: string;
  // Emergency
  emergencyContactName: string;
  emergencyContactPhone: string;
  // Course Details
  employmentStatus: string;
  trainingType: string;
  motivation: string;
  // Consent
  consentGiven: boolean;
}

export async function submitApplication(formData: EnrollmentFormData) {
  try {
    const supabase = await createClient();

    // Find the course
    const course = ALL_COURSES.find((c) => c.slug === formData.courseSlug);
    if (!course) {
      return { success: false, error: "Selected course not found." };
    }

    // Look up course in database
    const { data: dbCourse, error: courseError } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", formData.courseSlug)
      .single();

    if (courseError || !dbCourse) {
      // If course not in DB yet, store application with course_id as null fallback
      // For now, return error prompting DB setup
      return {
        success: false,
        error: "Course not found in database. Please ensure the database schema is set up.",
      };
    }

    const referenceNumber = generateReferenceNumber();

    // Insert application
    const { data: application, error: appError } = await supabase
      .from("applications")
      .insert({
        reference_number: referenceNumber,
        course_id: dbCourse.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        id_number: formData.idNumber,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        province: formData.province,
        address: formData.address,
        postal_code: formData.postalCode,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_phone: formData.emergencyContactPhone,
        employment_status: formData.employmentStatus,
        training_type: formData.trainingType,
        motivation: formData.motivation,
        consent_given: formData.consentGiven,
        consent_given_at: formData.consentGiven ? new Date().toISOString() : null,
        status: "submitted",
      })
      .select("id")
      .single();

    if (appError) {
      console.error("[Application] DB insert error:", appError);
      return { success: false, error: "Failed to submit application. Please try again." };
    }

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

    return {
      success: true,
      referenceNumber,
      applicationId: application.id,
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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("applications")
    .update({
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      notes: notes ?? null,
    })
    .eq("id", applicationId)
    .select()
    .single();

  if (error) {
    console.error("[Admin] Update application error:", error);
    return { success: false, error: error.message };
  }

  // Send email notification to applicant
  if (data && (status === "accepted" || status === "rejected" || status === "under_review")) {
    const course = ALL_COURSES.find((c) => c.slug === (data as Record<string, unknown>).course_slug);

    await import("@/lib/email").then(({ sendApplicationStatusUpdate }) =>
      sendApplicationStatusUpdate({
        to: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        courseName: course?.title ?? "your selected course",
        referenceNumber: data.reference_number,
        status,
        notes,
      })
    );
  }

  return { success: true, data };
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
