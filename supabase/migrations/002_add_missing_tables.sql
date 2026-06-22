-- ============================================
-- MMS Platform - Additional Tables Migration
-- Adds tables defined in the Database Architecture PDF
-- ============================================

-- ============================================
-- NEW ENUMS
-- ============================================
CREATE TYPE support_ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE intake_status AS ENUM ('planned', 'open', 'full', 'in_progress', 'completed', 'cancelled');
CREATE TYPE instructor_status AS ENUM ('active', 'inactive', 'on_leave');
CREATE TYPE document_type AS ENUM ('id_copy', 'proof_of_address', 'passport', 'certificate', 'application_form', 'proof_of_payment', 'other');
CREATE TYPE notification_type AS ENUM ('application', 'payment', 'course', 'certificate', 'support', 'announcement', 'system');
CREATE TYPE email_type AS ENUM ('application_confirmation', 'application_approved', 'application_rejected', 'payment_confirmation', 'course_access', 'welcome_student', 'certificate_issued', 'document_request', 'password_reset', 'newsletter', 'promotion', 'admin_notification', 'instructor_notification');

-- ============================================
-- MODULES (Course modules / sections)
-- ============================================
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  module_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_modules_course_id ON modules(course_id);
CREATE INDEX idx_modules_order ON modules(course_id, module_order);

-- ============================================
-- QUIZZES
-- ============================================
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER NOT NULL DEFAULT 60 CHECK (passing_score >= 0 AND passing_score <= 100),
  max_attempts INTEGER NOT NULL DEFAULT 3,
  time_limit_minutes INTEGER,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quizzes_course_id ON quizzes(course_id);
CREATE INDEX idx_quizzes_module_id ON quizzes(module_id);

-- ============================================
-- QUIZ QUESTIONS
-- ============================================
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
  options JSONB,
  correct_answer TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 1,
  question_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);

-- ============================================
-- QUIZ RESULTS
-- ============================================
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  answers JSONB,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, quiz_id, attempt_number)
);

CREATE INDEX idx_quiz_results_student_id ON quiz_results(student_id);
CREATE INDEX idx_quiz_results_quiz_id ON quiz_results(quiz_id);

-- ============================================
-- ANNOUNCEMENTS (Broadcast messages)
-- ============================================
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  audience TEXT NOT NULL CHECK (audience IN ('all', 'students', 'instructors', 'specific_course', 'specific_intake')),
  audience_filter TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_announcements_audience ON announcements(audience);
CREATE INDEX idx_announcements_published_at ON announcements(published_at DESC);

-- ============================================
-- NOTIFICATIONS (Personal in-app notifications)
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type notification_type NOT NULL DEFAULT 'system',
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- EMAIL LOGS
-- ============================================
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  email_type email_type NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  provider TEXT NOT NULL DEFAULT 'resend',
  provider_message_id TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_email_logs_recipient ON email_logs(recipient);
CREATE INDEX idx_email_logs_type ON email_logs(email_type);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at DESC);

-- ============================================
-- WHATSAPP QUEUE
-- ============================================
CREATE TABLE whatsapp_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  message_type TEXT NOT NULL,
  message_body TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'contacted', 'completed', 'cancelled')),
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_queue_assigned ON whatsapp_queue(assigned_to);
CREATE INDEX idx_whatsapp_queue_status ON whatsapp_queue(status);

-- ============================================
-- SUPPORT TICKETS
-- ============================================
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status support_ticket_status NOT NULL DEFAULT 'open',
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_support_tickets_student_id ON support_tickets(student_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_assigned ON support_tickets(assigned_to);

-- ============================================
-- SUPPORT TICKET REPLIES
-- ============================================
CREATE TABLE support_ticket_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  is_staff BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ticket_replies_ticket_id ON support_ticket_replies(ticket_id);

-- ============================================
-- AI CONVERSATIONS
-- ============================================
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_session ON ai_conversations(session_id);
CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_created ON ai_conversations(created_at);

-- ============================================
-- INTAKES (Training schedules)
-- ============================================
CREATE TABLE intakes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 20,
  enrolled_count INTEGER NOT NULL DEFAULT 0,
  status intake_status NOT NULL DEFAULT 'planned',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_intakes_course_id ON intakes(course_id);
CREATE INDEX idx_intakes_status ON intakes(status);
CREATE INDEX idx_intakes_start_date ON intakes(start_date);

-- ============================================
-- INSTRUCTORS
-- ============================================
CREATE TABLE instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  employee_number TEXT NOT NULL UNIQUE,
  specialization TEXT,
  phone TEXT,
  bio TEXT,
  status instructor_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_instructors_user_id ON instructors(user_id);
CREATE INDEX idx_instructors_status ON instructors(status);

-- ============================================
-- COURSE ASSIGNMENTS (Link instructors to courses)
-- ============================================
CREATE TABLE course_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  assigned_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  UNIQUE(course_id, instructor_id)
);

CREATE INDEX idx_course_assignments_course ON course_assignments(course_id);
CREATE INDEX idx_course_assignments_instructor ON course_assignments(instructor_id);

-- ============================================
-- DOCUMENTS (Student document management)
-- ============================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_student_id ON documents(student_id);
CREATE INDEX idx_documents_type ON documents(student_id, document_type);

-- ============================================
-- ROW LEVEL SECURITY FOR NEW TABLES
-- ============================================
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_ticket_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Modules: enrolled students or admin/instructor
CREATE POLICY "Enrolled users can view modules" ON modules FOR SELECT USING (
  EXISTS (SELECT 1 FROM enrollments WHERE enrollments.course_id = modules.course_id AND enrollments.student_id IN (SELECT id FROM students WHERE user_id = auth.uid()))
  OR public.is_instructor()
);
CREATE POLICY "Admins can manage modules" ON modules FOR ALL USING (public.is_admin());

-- Quizzes: enrolled students or admin/instructor
CREATE POLICY "Enrolled users can view quizzes" ON quizzes FOR SELECT USING (
  is_published = true AND EXISTS (
    SELECT 1 FROM enrollments WHERE enrollments.course_id = quizzes.course_id AND enrollments.student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
  )
  OR public.is_instructor()
);
CREATE POLICY "Admins can manage quizzes" ON quizzes FOR ALL USING (public.is_admin());

-- Quiz questions: admin/instructor only
CREATE POLICY "Instructors can view quiz questions" ON quiz_questions FOR SELECT USING (public.is_instructor());
CREATE POLICY "Admins can manage quiz questions" ON quiz_questions FOR ALL USING (public.is_admin());

-- Quiz results: own or admin/instructor
CREATE POLICY "Students can view own quiz results" ON quiz_results FOR SELECT USING (
  student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
  OR public.is_instructor()
);
CREATE POLICY "Students can insert own quiz results" ON quiz_results FOR INSERT WITH CHECK (
  student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage quiz results" ON quiz_results FOR ALL USING (public.is_admin());

-- Announcements: authenticated users can view, admins manage
CREATE POLICY "Users can view announcements" ON announcements FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage announcements" ON announcements FOR ALL USING (public.is_admin());

-- Notifications: own only
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Email logs: admin only
CREATE POLICY "Admins can view email logs" ON email_logs FOR SELECT USING (public.is_admin());
CREATE POLICY "System can insert email logs" ON email_logs FOR INSERT WITH CHECK (true);

-- WhatsApp queue: assigned or admin
CREATE POLICY "Users can view assigned whatsapp" ON whatsapp_queue FOR SELECT USING (assigned_to = auth.uid() OR public.is_admin());
CREATE POLICY "Admins can manage whatsapp queue" ON whatsapp_queue FOR ALL USING (public.is_admin());

-- Support tickets: own or assigned or admin
CREATE POLICY "Students can view own tickets" ON support_tickets FOR SELECT USING (
  student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
  OR assigned_to = auth.uid()
  OR public.is_admin()
);
CREATE POLICY "Students can create tickets" ON support_tickets FOR INSERT WITH CHECK (
  student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
);
CREATE POLICY "Staff can update tickets" ON support_tickets FOR UPDATE USING (assigned_to = auth.uid() OR public.is_admin());

-- Ticket replies: participants or admin
CREATE POLICY "Users can view ticket replies" ON support_ticket_replies FOR SELECT USING (
  EXISTS (SELECT 1 FROM support_tickets WHERE support_tickets.id = support_ticket_replies.ticket_id AND (support_tickets.student_id IN (SELECT id FROM students WHERE user_id = auth.uid()) OR support_tickets.assigned_to = auth.uid()))
  OR public.is_admin()
);
CREATE POLICY "Users can create ticket replies" ON support_ticket_replies FOR INSERT WITH CHECK (true);

-- AI conversations: own or admin
CREATE POLICY "Users can view own ai conversations" ON ai_conversations FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can insert ai conversations" ON ai_conversations FOR INSERT WITH CHECK (true);

-- Intakes: enrolled or admin/instructor
CREATE POLICY "Users can view intakes" ON intakes FOR SELECT USING (
  EXISTS (SELECT 1 FROM enrollments WHERE enrollments.course_id = intakes.course_id AND enrollments.student_id IN (SELECT id FROM students WHERE user_id = auth.uid()))
  OR public.is_instructor()
);
CREATE POLICY "Admins can manage intakes" ON intakes FOR ALL USING (public.is_admin());

-- Instructors: admin only view/manage
CREATE POLICY "Users can view instructors" ON instructors FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage instructors" ON instructors FOR ALL USING (public.is_admin());

-- Course assignments: admin/instructor
CREATE POLICY "Instructors can view assignments" ON course_assignments FOR SELECT USING (public.is_instructor());
CREATE POLICY "Admins can manage assignments" ON course_assignments FOR ALL USING (public.is_admin());

-- Documents: own or admin/instructor
CREATE POLICY "Students can view own documents" ON documents FOR SELECT USING (
  student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
  OR public.is_instructor()
);
CREATE POLICY "Students can insert own documents" ON documents FOR INSERT WITH CHECK (
  student_id IN (SELECT id FROM students WHERE user_id = auth.uid()) OR public.is_admin()
);
CREATE POLICY "Admins can manage documents" ON documents FOR ALL USING (public.is_admin());

-- ============================================
-- UPDATED_AT TRIGGERS FOR NEW TABLES
-- ============================================
CREATE TRIGGER set_updated_at BEFORE UPDATE ON modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON quizzes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON intakes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON instructors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
