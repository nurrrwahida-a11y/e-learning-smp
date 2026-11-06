/**
 * SMP N 1 JAYA - Data Types & Database Schema Interfaces
 * Berdasarkan rancangan 26 tabel database MySQL Sistem Informasi E-Learning SMP
 */

export type Role = 'admin' | 'guru' | 'murid';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  status: 'aktif' | 'nonaktif';
  phone?: string;
  bio?: string;
  created_at: string;
}

export interface StudentProfile {
  user_id: string;
  nis: string;
  nisn: string;
  class_id: string; // foreign key ke classes
  gender: 'L' | 'P';
  birth_place?: string;
  birth_date?: string;
  address?: string;
  points: number; // Gamifikasi XP
  completed_lessons_count: number;
  badges: string[]; // ID lencana yang didapat
}

export interface TeacherProfile {
  user_id: string;
  nip: string;
  nuptk?: string;
  gender: 'L' | 'P';
  specialization: string; // e.g. "Matematika", "IPA Terpadu"
  homeroom_class_id?: string; // Wali kelas rombel
  education?: string;
}

export interface AcademicYear {
  id: string;
  name: string; // "2026/2027"
  semester: 'Ganjil' | 'Genap';
  is_active: boolean;
}

export interface ClassRoom {
  id: string;
  grade: 'VII' | 'VIII' | 'IX';
  name: string; // "VII-A", "VII-B", dll.
  homeroom_teacher_id?: string;
  academic_year_id: string;
  capacity: number;
}

export interface Subject {
  id: string;
  code: string; // "MTK-7", "IPA-7", dll.
  name: string; // "Matematika", "IPA", dll.
  grade: 'VII' | 'VIII' | 'IX' | 'Semua';
  description: string;
  color: string;
  icon: string;
  status: 'aktif' | 'nonaktif';
}

export interface TeachingAssignment {
  id: string;
  teacher_id: string;
  subject_id: string;
  class_id: string;
  academic_year_id: string;
}

export interface Schedule {
  id: string;
  class_id: string;
  subject_id: string;
  teacher_id: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  start_time: string; // "07:30"
  end_time: string;   // "09:00"
  room: string;
}

export type AttachmentFileType = 'pdf' | 'doc' | 'ppt' | 'xls' | 'image' | 'video' | 'audio' | 'zip' | 'other';

export interface AttachmentFile {
  id: string;
  name: string;
  file_type: AttachmentFileType;
  file_size?: string;
  url?: string;
  download_url?: string;
}

export interface Lesson {
  id: string;
  subject_id: string;
  class_id: string;
  teacher_id: string;
  chapter: string; // "Bab 1: Bilangan Bulat & Pecahan"
  title: string;
  description: string;
  content_text: string;
  image_url?: string;
  attachment_name?: string;
  attachment_url?: string;
  attachments?: AttachmentFile[];
  video_url?: string;
  status: 'published' | 'draft';
  published_at: string;
  order_index: number;
}

export interface LessonProgress {
  id: string;
  lesson_id: string;
  student_id: string;
  completed: boolean;
  completed_at?: string;
}

export interface Assignment {
  id: string;
  subject_id: string;
  class_id: string;
  teacher_id: string;
  title: string;
  instructions: string;
  chapter: string;
  start_date: string;
  due_date: string;
  max_score: number;
  submission_type: 'text' | 'file' | 'both';
  attachment_name?: string;
  attachment_url?: string;
  status: 'published' | 'draft';
  created_at: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  submitted_at: string;
  text_answer?: string;
  file_name?: string;
  file_url?: string;
  score?: number;
  feedback?: string;
  graded_at?: string;
  status: 'submitted' | 'late' | 'graded' | 'resubmit';
}

export type QuestionType = 'pilihan_ganda' | 'benar_salah' | 'isian' | 'esai';

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: string;
  quiz_id?: string;
  subject_id: string;
  grade: 'VII' | 'VIII' | 'IX';
  chapter?: string;
  type: QuestionType;
  question_text: string;
  options?: QuestionOption[];
  correct_answer: string; // Kunci jawaban: 'A'/'B'/'C'/'D', 'true'/'false', atau kata kunci isian
  explanation?: string;
  points: number;
  difficulty: 'mudah' | 'sedang' | 'sulit';
}

export interface Quiz {
  id: string;
  type: 'kuis' | 'ujian';
  subject_id: string;
  class_id: string;
  teacher_id: string;
  title: string;
  instructions: string;
  duration_minutes: number;
  start_time: string;
  end_time: string;
  max_attempts: number;
  randomize_questions: boolean;
  show_answers_after: boolean;
  passing_score: number;
  status: 'active' | 'upcoming' | 'ended' | 'draft';
  created_at: string;
  questions: Question[];
}

export interface QuizAttemptAnswer {
  question_id: string;
  student_answer: string;
  is_correct?: boolean;
  earned_score: number;
  teacher_note?: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  student_id: string;
  start_time: string;
  submit_time?: string;
  time_spent_seconds: number;
  answers: QuizAttemptAnswer[];
  auto_score: number;
  essay_score: number;
  total_score: number;
  status: 'in_progress' | 'submitted' | 'graded';
}

export interface GradeConfig {
  tugas_weight: number; // e.g. 30
  kuis_weight: number;  // e.g. 30
  ujian_weight: number; // e.g. 40
}

export interface StudentGradeRecap {
  student_id: string;
  student_name: string;
  nis: string;
  class_name: string;
  subject_id: string;
  subject_name: string;
  tugas_avg: number;
  kuis_avg: number;
  ujian_avg: number;
  final_score: number;
  letter_grade: 'A' | 'B' | 'C' | 'D' | 'E';
  predicate: string;
}

export interface DiscussionReply {
  id: string;
  discussion_id: string;
  user_id: string;
  user_name: string;
  user_role: Role;
  user_avatar: string;
  content: string;
  is_helpful: boolean;
  created_at: string;
}

export interface Discussion {
  id: string;
  subject_id: string;
  class_id: string;
  user_id: string;
  user_name: string;
  user_role: Role;
  user_avatar: string;
  title: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
  replies: DiscussionReply[];
}

export interface AttendanceRecord {
  student_id: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpa';
  note?: string;
}

export interface AttendanceSession {
  id: string;
  class_id: string;
  subject_id: string;
  teacher_id: string;
  date: string;
  meeting_number: number;
  topic: string;
  records: AttendanceRecord[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target: 'semua' | 'guru' | 'murid';
  author_name: string;
  published_at: string;
  is_pinned: boolean;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'tugas' | 'materi' | 'ujian' | 'nilai' | 'pengumuman' | 'presensi';
  target_tab?: string;
  read: boolean;
  created_at: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user_name: string;
  user_role: Role;
  action: string;
  details: string;
  ip_address: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: 'kehadiran' | 'tugas' | 'kuis' | 'prestasi';
}

export interface SystemSettings {
  school_name: string;
  school_tagline: string;
  school_npsn: string;
  school_accreditation: string;
  headmaster_name: string;
  headmaster_nip: string;
  headmaster_message: string;
  headmaster_avatar: string;
  school_vision: string;
  school_mission: string[];
  school_address: string;
  school_phone: string;
  school_email: string;
  school_website: string;
  hero_title: string;
  hero_subtitle: string;
  hero_badge: string;
  hero_image: string;
  academic_year: string;
  semester: 'Ganjil' | 'Genap';

  // CamelCase property aliases
  schoolName?: string;
  shortName?: string;
  tagline?: string;
  npsn?: string;
  accreditation?: string;
  headmasterName?: string;
  headmasterNip?: string;
  headmasterMessage?: string;
  headmasterAvatar?: string;
  vision?: string;
  mission: string[];
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  landingHeroTitle?: string;
  landingHeroSubtitle?: string;
  landingHeroBadge?: string;
  landingHeroImage?: string;
  [key: string]: any;
}
