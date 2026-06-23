// ============================================
// MMS DATABASE TYPES
// Maps to the Supabase PostgreSQL schema
// ============================================

export type UserRole = "admin" | "instructor" | "student" | "staff";
export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected"
  | "waitlisted";
export type EnrollmentStatus =
  | "active"
  | "completed"
  | "suspended"
  | "withdrawn"
  | "failed";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "partial";
export type CertificateStatus = "pending" | "issued" | "revoked" | "expired";
export type LessonType = "video" | "document" | "quiz" | "assignment" | "practical";

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  student_number: string;
  id_number: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  medical_aid_number: string | null;
  medical_conditions: string | null;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string | null;
  category: string;
  level: string;
  duration_weeks: number;
  duration_hours: number;
  price: number;
  max_students: number;
  prerequisites: string | null;
  certification: boolean;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  instructor_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  reference_number: string;
  user_id: string;
  course_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  id_number: string | null;
  date_of_birth: string | null;
  address: string | null;
  motivation: string | null;
  status: ApplicationStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  notes: string | null;
  referral_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  status: EnrollmentStatus;
  enrolled_at: string;
  completed_at: string | null;
  progress_percentage: number;
  certificate_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  module_id: string | null;
  title: string;
  description: string | null;
  content_url: string | null;
  lesson_type: LessonType;
  duration_minutes: number;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface LessonProgress {
  id: string;
  enrollment_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  score: number | null;
  created_at: string;
}

export interface Certificate {
  id: string;
  enrollment_id: string;
  certificate_number: string;
  issued_at: string;
  expires_at: string | null;
  status: CertificateStatus;
  pdf_url: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  student_id: string;
  enrollment_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: string | null;
  reference: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  assigned_to: string | null;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  due_at: string | null;
  completed_at: string | null;
  related_entity_type: string | null;
  related_entity_id: string | null;
  created_at: string;
  updated_at: string;
}

export type ReferralStatus = "pending" | "converted" | "paid" | "cancelled";
export type ReferralRewardType = "cash" | "discount" | "points";

export interface Referral {
  id: string;
  referrer_id: string;
  referee_email: string | null;
  referee_student_id: string | null;
  referral_code: string;
  status: ReferralStatus;
  reward_type: ReferralRewardType;
  reward_amount: number | null;
  reward_paid_at: string | null;
  application_id: string | null;
  enrolled_at: string | null;
  converted_at: string | null;
  created_at: string;
  updated_at: string;
}

// Database schema type for Supabase generated types
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, "created_at" | "updated_at">; Update: Partial<Profile> };
      students: { Row: Student; Insert: Omit<Student, "created_at" | "updated_at">; Update: Partial<Student> };
      courses: { Row: Course; Insert: Omit<Course, "created_at" | "updated_at">; Update: Partial<Course> };
      applications: { Row: Application; Insert: Omit<Application, "created_at" | "updated_at">; Update: Partial<Application> };
      enrollments: { Row: Enrollment; Insert: Omit<Enrollment, "created_at" | "updated_at">; Update: Partial<Enrollment> };
      lessons: { Row: Lesson; Insert: Omit<Lesson, "created_at" | "updated_at">; Update: Partial<Lesson> };
      lesson_progress: { Row: LessonProgress; Insert: Omit<LessonProgress, "created_at">; Update: Partial<LessonProgress> };
      certificates: { Row: Certificate; Insert: Omit<Certificate, "created_at">; Update: Partial<Certificate> };
      payments: { Row: Payment; Insert: Omit<Payment, "created_at" | "updated_at">; Update: Partial<Payment> };
      audit_logs: { Row: AuditLog; Insert: Omit<AuditLog, "created_at">; Update: Partial<AuditLog> };
      tasks: { Row: Task; Insert: Omit<Task, "created_at">; Update: Partial<Task> };
      referrals: { Row: Referral; Insert: Omit<Referral, "created_at" | "updated_at">; Update: Partial<Referral> };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      application_status: ApplicationStatus;
      enrollment_status: EnrollmentStatus;
      payment_status: PaymentStatus;
      certificate_status: CertificateStatus;
      lesson_type: LessonType;
    };
  };
}
