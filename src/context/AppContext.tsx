import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  StudentProfile,
  TeacherProfile,
  AcademicYear,
  ClassRoom,
  Subject,
  TeachingAssignment,
  Schedule,
  Lesson,
  LessonProgress,
  Assignment,
  Submission,
  Quiz,
  Question,
  QuizAttempt,
  QuizAttemptAnswer,
  GradeConfig,
  Discussion,
  DiscussionReply,
  AttendanceSession,
  Announcement,
  NotificationItem,
  AuditLogItem,
  Badge,
  Role,
  SystemSettings,
} from '../types';
import {
  initialAcademicYears,
  initialClasses,
  initialUsers,
  initialTeacherProfiles,
  initialStudentProfiles,
  initialSubjects,
  initialTeachingAssignments,
  initialSchedules,
  initialLessons,
  initialLessonProgresses,
  initialAssignments,
  initialSubmissions,
  initialQuizzes,
  initialQuizAttempts,
  initialDiscussions,
  initialAttendances,
  initialAnnouncements,
  initialNotifications,
  initialAuditLogs,
  initialBadges,
  defaultGradeConfig,
  defaultSystemSettings,
} from '../data/initialData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  activeRole: Role;
  isLoggedIn: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // State Entities
  users: User[];
  studentProfiles: StudentProfile[];
  teacherProfiles: TeacherProfile[];
  academicYears: AcademicYear[];
  classes: ClassRoom[];
  subjects: Subject[];
  teachingAssignments: TeachingAssignment[];
  schedules: Schedule[];
  lessons: Lesson[];
  lessonProgresses: LessonProgress[];
  assignments: Assignment[];
  submissions: Submission[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  gradeConfig: GradeConfig;
  discussions: Discussion[];
  attendances: AttendanceSession[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
  badges: Badge[];
  systemSettings: SystemSettings;

  // Auth & Role
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  switchUserById: (userId: string) => void;
  switchRoleQuick: (role: Role) => void;
  resetDatabase: () => void;

  // User & Student/Teacher CRUD
  addUser: (userData: Partial<User>, profileData?: any) => void;
  updateUser: (userId: string, data: Partial<User>) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;

  // Class Management
  addClass: (cls: Omit<ClassRoom, 'id'>) => void;
  updateClass: (classId: string, data: Partial<ClassRoom>) => void;
  deleteClass: (classId: string) => void;
  moveStudentClass: (studentUserId: string, newClassId: string) => void;

  // Subject & Teaching Assignments
  addSubject: (subj: Omit<Subject, 'id'>) => void;
  updateSubject: (subjectId: string, data: Partial<Subject>) => void;
  assignTeacherToSubject: (teacherId: string, subjectId: string, classId: string) => void;
  removeTeachingAssignment: (id: string) => void;

  // Schedule
  addSchedule: (sched: Omit<Schedule, 'id'>) => { success: boolean; conflictMsg?: string };
  deleteSchedule: (scheduleId: string) => void;

  // Lessons
  addLesson: (lesson: Omit<Lesson, 'id' | 'published_at'>) => void;
  updateLesson: (lessonId: string, data: Partial<Lesson>) => void;
  deleteLesson: (lessonId: string) => void;
  markLessonComplete: (lessonId: string, studentId: string) => void;

  // Assignments & Submissions
  addAssignment: (asg: Omit<Assignment, 'id' | 'created_at'>) => void;
  updateAssignment: (asgId: string, data: Partial<Assignment>) => void;
  deleteAssignment: (asgId: string) => void;
  submitAssignment: (assignmentId: string, studentId: string, textAnswer?: string, fileName?: string) => void;
  gradeSubmission: (submissionId: string, score: number, feedback: string) => void;

  // Quizzes & Exams CBT
  addQuiz: (quiz: Omit<Quiz, 'id' | 'created_at'>) => void;
  updateQuiz: (quizId: string, data: Partial<Quiz>) => void;
  deleteQuiz: (quizId: string) => void;
  submitQuizAttempt: (quizId: string, studentId: string, answers: { question_id: string; student_answer: string }[], timeSpent: number) => QuizAttempt;
  gradeEssayAnswer: (attemptId: string, questionId: string, score: number, note?: string) => void;

  // Discussions
  addDiscussion: (subjectId: string, classId: string, title: string, content: string) => void;
  addDiscussionReply: (discussionId: string, content: string) => void;
  markReplyHelpful: (discussionId: string, replyId: string) => void;

  // Attendance
  saveAttendanceSession: (session: Omit<AttendanceSession, 'id'>) => void;
  updateAttendanceSession: (sessionId: string, updated: Partial<AttendanceSession>) => void;
  deleteAttendanceSession: (sessionId: string) => void;
  updateAttendanceRecordNote: (sessionId: string, studentId: string, status: 'hadir' | 'izin' | 'sakit' | 'alpa', note: string) => void;

  // Announcements
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'published_at' | 'author_name'>) => void;
  deleteAnnouncement: (id: string) => void;

  // Notifications & Audit
  markNotificationRead: (id: string) => void;
  logAuditAction: (action: string, details: string) => void;
  updateGradeConfig: (config: GradeConfig) => void;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage or defaults
  const loadState = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(`smpsmartlearn_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  const [users, setUsers] = useState<User[]>(() => {
    const loaded = loadState<User[]>('users', initialUsers);
    const source = !Array.isArray(loaded) || loaded.length < initialUsers.length ? initialUsers : loaded;
    const seen = new Set<string>();
    const uniqueList: User[] = [];
    for (const u of source) {
      if (u && u.id && !seen.has(u.id)) {
        seen.add(u.id);
        uniqueList.push({
          ...u,
          email: u.email
            ? u.email
                .replace(/@smpsmartlearn\.sch\.id/g, '@smpn1jaya.sch.id')
                .replace(/@siswa\.smpsmartlearn\.sch\.id/g, '@siswa.smpn1jaya.sch.id')
            : u.email,
        });
      }
    }
    return uniqueList;
  });
  const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>(() => {
    const loaded = loadState<StudentProfile[]>('studentProfiles', initialStudentProfiles);
    const source = !Array.isArray(loaded) || loaded.length < initialStudentProfiles.length ? initialStudentProfiles : loaded;
    const seen = new Set<string>();
    const uniqueList: StudentProfile[] = [];
    for (const sp of source) {
      if (sp && sp.user_id && !seen.has(sp.user_id)) {
        seen.add(sp.user_id);
        uniqueList.push(sp);
      }
    }
    return uniqueList;
  });
  const [teacherProfiles, setTeacherProfiles] = useState<TeacherProfile[]>(() => loadState('teacherProfiles', initialTeacherProfiles));
  const [academicYears] = useState<AcademicYear[]>(() => loadState('academicYears', initialAcademicYears));
  const [classes, setClasses] = useState<ClassRoom[]>(() => loadState('classes', initialClasses));
  const [subjects, setSubjects] = useState<Subject[]>(() => loadState('subjects', initialSubjects));
  const [teachingAssignments, setTeachingAssignments] = useState<TeachingAssignment[]>(() => {
    const loaded = loadState<TeachingAssignment[]>('teachingAssignments', initialTeachingAssignments);
    if (!Array.isArray(loaded) || loaded.length < initialTeachingAssignments.length) {
      return initialTeachingAssignments;
    }
    return loaded;
  });
  const [schedules, setSchedules] = useState<Schedule[]>(() => {
    const loaded = loadState<Schedule[]>('schedules', initialSchedules);
    if (!Array.isArray(loaded) || loaded.length < initialSchedules.length) {
      return initialSchedules;
    }
    return loaded;
  });
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const loaded = loadState<Lesson[]>('lessons', initialLessons);
    if (!Array.isArray(loaded) || loaded.length < initialLessons.length) {
      return initialLessons;
    }
    return loaded;
  });
  const [lessonProgresses, setLessonProgresses] = useState<LessonProgress[]>(() => {
    const loaded = loadState<LessonProgress[]>('lessonProgresses', initialLessonProgresses);
    if (!Array.isArray(loaded) || loaded.length < initialLessonProgresses.length) {
      return initialLessonProgresses;
    }
    return loaded;
  });
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const loaded = loadState<Assignment[]>('assignments', initialAssignments);
    if (!Array.isArray(loaded) || loaded.length < initialAssignments.length) {
      return initialAssignments;
    }
    return loaded;
  });
  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const loaded = loadState<Submission[]>('submissions', initialSubmissions);
    if (!Array.isArray(loaded) || loaded.length < initialSubmissions.length) {
      return initialSubmissions;
    }
    return loaded;
  });
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const loaded = loadState<Quiz[]>('quizzes', initialQuizzes);
    if (!Array.isArray(loaded) || loaded.length < initialQuizzes.length) {
      return initialQuizzes;
    }
    return loaded;
  });
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => {
    const loaded = loadState<QuizAttempt[]>('quizAttempts', initialQuizAttempts);
    if (!Array.isArray(loaded) || loaded.length < initialQuizAttempts.length) {
      return initialQuizAttempts;
    }
    return loaded;
  });
  const [gradeConfig, setGradeConfigState] = useState<GradeConfig>(() => loadState('gradeConfig', defaultGradeConfig));
  const [discussions, setDiscussions] = useState<Discussion[]>(() => {
    const loaded = loadState<Discussion[]>('discussions', initialDiscussions);
    if (!Array.isArray(loaded) || loaded.length < initialDiscussions.length) {
      return initialDiscussions;
    }
    return loaded;
  });
  const [attendances, setAttendances] = useState<AttendanceSession[]>(() => {
    const loaded = loadState<AttendanceSession[]>('attendances', initialAttendances);
    if (!Array.isArray(loaded) || loaded.length < initialAttendances.length) {
      return initialAttendances;
    }
    return loaded;
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => loadState('announcements', initialAnnouncements));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadState('notifications', initialNotifications));
  const getDeviceTimestamp = (dateObj: Date = new Date()): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = dateObj.getFullYear();
    const mm = pad(dateObj.getMonth() + 1);
    const dd = pad(dateObj.getDate());
    const hh = pad(dateObj.getHours());
    const min = pad(dateObj.getMinutes());
    const ss = pad(dateObj.getSeconds());
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const loaded = loadState<AuditLogItem[]>('auditLogs', initialAuditLogs);
    if (!Array.isArray(loaded) || loaded.length === 0) {
      return initialAuditLogs.map((log, idx) => ({
        ...log,
        timestamp: getDeviceTimestamp(new Date(Date.now() - (idx * 25 + 5) * 60000)),
      }));
    }
    return loaded;
  });
  const [systemSettings, setSystemSettingsState] = useState<SystemSettings>(() => {
    const loaded = loadState<SystemSettings>('systemSettings', defaultSystemSettings);
    const resolvedLogo =
      !loaded?.logoUrl || loaded.logoUrl.includes('photo-1546410531-bb4caa6b424d')
        ? defaultSystemSettings.logoUrl
        : loaded.logoUrl;

    if (!loaded || loaded.schoolName !== 'SMP N 1 JAYA' || loaded.school_name !== 'SMP N 1 JAYA') {
      return {
        ...defaultSystemSettings,
        ...(loaded || {}),
        schoolName: 'SMP N 1 JAYA',
        school_name: 'SMP N 1 JAYA',
        shortName: 'SMP N 1 JAYA',
        email: 'info@smpn1jaya.sch.id',
        school_email: 'info@smpn1jaya.sch.id',
        website: 'https://smpn1jaya.sch.id',
        school_website: 'https://smpn1jaya.sch.id',
        hero_title: 'Belajar Interaktif, Terstruktur, dan Terpadu di SMP N 1 JAYA',
        landingHeroTitle: 'Sistem Informasi Pembelajaran Terpadu SMP N 1 JAYA',
        hero_badge: 'Sistem Informasi Pembelajaran SMP N 1 JAYA Berbasis Web',
        landingHeroBadge: '🚀 Platform Digital Kurikulum Merdeka SMP N 1 JAYA',
        headmaster_message: 'Selamat datang di portal Sistem Informasi E-Learning SMP N 1 JAYA. Kami berkomitmen menyelenggarakan pembelajaran inovatif berbasis teknologi demi mencetak generasi pelajar yang cerdas, kreatif, dan berintegritas.',
        headmasterMessage: 'Selamat datang di portal Sistem Informasi E-Learning SMP N 1 JAYA. Kami berkomitmen menyelenggarakan pembelajaran inovatif berbasis teknologi demi mencetak generasi pelajar yang cerdas, kreatif, dan berintegritas.',
        school_vision: 'Mewujudkan insan pembelajar SMP N 1 JAYA yang berakhlak mulia, berprestasi gemilang, terampil teknologi informasi, dan berwawasan global.',
        vision: 'Mewujudkan insan pembelajar SMP N 1 JAYA yang berakhlak mulia, berprestasi gemilang, terampil teknologi informasi, dan berwawasan global.',
        logoUrl: resolvedLogo,
        landingHeroImage: loaded?.landingHeroImage || defaultSystemSettings.landingHeroImage,
      };
    }
    return { ...defaultSystemSettings, ...loaded, logoUrl: resolvedLogo };
  });
  const [badges] = useState<Badge[]>(initialBadges);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = loadState<User | null>('currentUser', initialUsers[0]);
    if (!savedUser) return initialUsers[0];
    return {
      ...savedUser,
      email: savedUser.email
        .replace(/@smpsmartlearn\.sch\.id/g, '@smpn1jaya.sch.id')
        .replace(/@siswa\.smpsmartlearn\.sch\.id/g, '@siswa.smpn1jaya.sch.id'),
    };
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_systemSettings', JSON.stringify(systemSettings));
  }, [systemSettings]);
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_studentProfiles', JSON.stringify(studentProfiles));
  }, [studentProfiles]);
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_teacherProfiles', JSON.stringify(teacherProfiles));
  }, [teacherProfiles]);
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_classes', JSON.stringify(classes));
  }, [classes]);
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_subjects', JSON.stringify(subjects));
  }, [subjects]);
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_teachingAssignments', JSON.stringify(teachingAssignments));
  }, [teachingAssignments]);
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_schedules', JSON.stringify(schedules));
  }, [schedules]);
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_lessons', JSON.stringify(lessons));
  }, [lessons]);
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_lessonProgresses', JSON.stringify(lessonProgresses));
  }, [lessonProgresses]);
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_assignments', JSON.stringify(assignments));
  }, [assignments]);
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_submissions', JSON.stringify(submissions));
  }, [submissions]);
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_quizAttempts', JSON.stringify(quizAttempts));
  }, [quizAttempts]);
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_gradeConfig', JSON.stringify(gradeConfig));
  }, [gradeConfig]);
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_discussions', JSON.stringify(discussions));
  }, [discussions]);
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_attendances', JSON.stringify(attendances));
  }, [attendances]);
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_announcements', JSON.stringify(announcements));
  }, [announcements]);
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_notifications', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('smpsmartlearn_auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('smpsmartlearn_currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logAuditAction = (action: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: getDeviceTimestamp(),
      user_name: currentUser?.name || 'Sistem',
      user_role: currentUser?.role || 'admin',
      action,
      details,
      ip_address: '127.0.0.1 (Perangkat Lokal)',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const login = (usernameOrName: string, _pass: string): boolean => {
    const query = usernameOrName.trim().toLowerCase();
    if (!query) {
      showToast('Harap masukkan username atau nama lengkap Anda.', 'error');
      return false;
    }
    // Match by username or by full name
    const found = users.find(
      (u) =>
        u.username.toLowerCase() === query ||
        u.name.toLowerCase() === query ||
        u.name.toLowerCase().includes(query)
    );
    if (found) {
      if (found.status === 'nonaktif') {
        showToast('Akun Anda dinonaktifkan oleh administrator.', 'error');
        return false;
      }
      setCurrentUser(found);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      logAuditAction('LOGIN_SUCCESS', `Pengguna ${found.name} (${found.role}) berhasil masuk.`);
      showToast(`Selamat datang kembali, ${found.name}!`, 'success');
      return true;
    }
    showToast('Username atau nama pengguna tidak ditemukan dalam sistem.', 'error');
    return false;
  };

  const logout = () => {
    if (currentUser) {
      logAuditAction('LOGOUT', `Pengguna ${currentUser.name} keluar.`);
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('landing');
    showToast('Anda telah berhasil keluar.', 'info');
  };

  const switchUserById = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      showToast(`Beralih ke akun: ${found.name} (${found.role.toUpperCase()})`, 'info');
    }
  };

  const switchRoleQuick = (role: Role) => {
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      showToast(`Mode Demo: Beralih ke role ${role.toUpperCase()} (${targetUser.name})`, 'info');
    }
  };

  const resetDatabase = () => {
    localStorage.clear();
    setUsers(initialUsers);
    setStudentProfiles(initialStudentProfiles);
    setTeacherProfiles(initialTeacherProfiles);
    setClasses(initialClasses);
    setSubjects(initialSubjects);
    setTeachingAssignments(initialTeachingAssignments);
    setSchedules(initialSchedules);
    setLessons(initialLessons);
    setLessonProgresses(initialLessonProgresses);
    setAssignments(initialAssignments);
    setSubmissions(initialSubmissions);
    setQuizzes(initialQuizzes);
    setQuizAttempts(initialQuizAttempts);
    setGradeConfigState(defaultGradeConfig);
    setDiscussions(initialDiscussions);
    setAttendances(initialAttendances);
    setAnnouncements(initialAnnouncements);
    setNotifications(initialNotifications);
    setAuditLogs(
      initialAuditLogs.map((log, idx) => ({
        ...log,
        timestamp: getDeviceTimestamp(new Date(Date.now() - (idx * 25 + 5) * 60000)),
      }))
    );
    setSystemSettingsState(defaultSystemSettings);
    setCurrentUser(initialUsers[0]);
    setIsLoggedIn(true);
    setActiveTab('dashboard');
    showToast('Database dan seluruh setelan sistem berhasil direset ke nilai awal pabrik!', 'success');
  };

  // CRUD User
  const addUser = (userData: Partial<User>, profileData?: any) => {
    const id = `usr-${userData.role}-${Date.now()}`;
    const defaultAvatar =
      userData.role === 'admin'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        : userData.role === 'guru'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150';
    const newUser: User = {
      id,
      username: userData.username || `user_${Date.now()}`,
      name: userData.name || 'Pengguna Baru',
      email: userData.email || `${userData.username}@smpn1jaya.sch.id`,
      role: userData.role || 'murid',
      avatar: userData.avatar || defaultAvatar,
      status: 'aktif',
      phone: userData.phone || '0812000000',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setUsers((prev) => [newUser, ...prev]);

    if (userData.role === 'murid' && profileData) {
      const newStudentProfile: StudentProfile = {
        user_id: id,
        nis: profileData.nis || `${Date.now().toString().slice(-6)}`,
        nisn: profileData.nisn || `00${Date.now().toString().slice(-8)}`,
        class_id: profileData.class_id || 'cls-7a',
        gender: profileData.gender || 'L',
        points: 0,
        completed_lessons_count: 0,
        badges: ['badge-1'],
        birth_place: profileData.birth_place || 'Jakarta',
        birth_date: profileData.birth_date || '2013-01-01',
      };
      setStudentProfiles((prev) => [...prev, newStudentProfile]);
    } else if (userData.role === 'guru' && profileData) {
      const newTeacherProfile: TeacherProfile = {
        user_id: id,
        nip: profileData.nip || `1985${Date.now().toString().slice(-10)}`,
        nuptk: profileData.nuptk || '',
        gender: profileData.gender || 'L',
        specialization: profileData.specialization || 'Umum',
        homeroom_class_id: profileData.homeroom_class_id,
        education: profileData.education || 'S1 Pendidikan',
      };
      setTeacherProfiles((prev) => [...prev, newTeacherProfile]);
    }

    logAuditAction('USER_CREATE', `Membuat akun baru ${newUser.name} (${newUser.role})`);
    showToast(`Akun ${newUser.name} berhasil dibuat!`, 'success');
  };

  const updateUser = (userId: string, data: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...data } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, ...data } : null));
    }
    logAuditAction('USER_UPDATE', `Memperbarui data pengguna ID: ${userId}`);
    showToast('Data pengguna berhasil diperbarui.', 'success');
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'aktif' ? 'nonaktif' : 'aktif';
          showToast(`Status akun ${u.name} diubah menjadi ${newStatus}.`, 'info');
          logAuditAction('USER_STATUS_CHANGE', `Mengubah status ${u.name} menjadi ${newStatus}`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const deleteUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setStudentProfiles((prev) => prev.filter((sp) => sp.user_id !== userId));
    setTeacherProfiles((prev) => prev.filter((tp) => tp.user_id !== userId));
    logAuditAction('USER_DELETE', `Menghapus akun pengguna ${target?.name || userId}`);
    showToast('Pengguna berhasil dihapus.', 'info');
  };

  // Class Management
  const addClass = (cls: Omit<ClassRoom, 'id'>) => {
    const id = `cls-${cls.grade.toLowerCase()}-${Date.now().toString().slice(-3)}`;
    const newClass: ClassRoom = { id, ...cls };
    setClasses((prev) => [...prev, newClass]);
    logAuditAction('CLASS_CREATE', `Membuat kelas baru ${cls.name}`);
    showToast(`Kelas ${cls.name} berhasil ditambahkan!`, 'success');
  };

  const updateClass = (classId: string, data: Partial<ClassRoom>) => {
    setClasses((prev) => prev.map((c) => (c.id === classId ? { ...c, ...data } : c)));
    showToast('Data kelas berhasil diperbarui.', 'success');
  };

  const deleteClass = (classId: string) => {
    const hasStudents = studentProfiles.some((s) => s.class_id === classId);
    if (hasStudents) {
      showToast('Tidak dapat menghapus kelas yang masih memiliki murid terdaftar!', 'error');
      return;
    }
    setClasses((prev) => prev.filter((c) => c.id !== classId));
    showToast('Kelas berhasil dihapus.', 'info');
  };

  const moveStudentClass = (studentUserId: string, newClassId: string) => {
    setStudentProfiles((prev) =>
      prev.map((sp) => (sp.user_id === studentUserId ? { ...sp, class_id: newClassId } : sp))
    );
    const targetStudent = users.find((u) => u.id === studentUserId);
    const targetClass = classes.find((c) => c.id === newClassId);
    logAuditAction('STUDENT_MOVE_CLASS', `Memindahkan ${targetStudent?.name} ke rombel ${targetClass?.name}`);
    showToast(`Siswa ${targetStudent?.name} berhasil dipindahkan ke rombel ${targetClass?.name}!`, 'success');
  };

  // Subject Management
  const addSubject = (subj: Omit<Subject, 'id'>) => {
    const id = `sbj-${subj.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const newSubj: Subject = { id, ...subj };
    setSubjects((prev) => [...prev, newSubj]);
    showToast(`Mata pelajaran ${subj.name} berhasil ditambahkan!`, 'success');
  };

  const updateSubject = (subjectId: string, data: Partial<Subject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === subjectId ? { ...s, ...data } : s)));
    showToast('Mata pelajaran berhasil diperbarui.', 'success');
  };

  const assignTeacherToSubject = (teacherId: string, subjectId: string, classId: string) => {
    const existing = teachingAssignments.find(
      (ta) => ta.teacher_id === teacherId && ta.subject_id === subjectId && ta.class_id === classId
    );
    if (existing) {
      showToast('Penugasan ini sudah ada sebelumnya!', 'error');
      return;
    }
    const newAssignment: TeachingAssignment = {
      id: `ta-${Date.now()}`,
      teacher_id: teacherId,
      subject_id: subjectId,
      class_id: classId,
      academic_year_id: 'ay-1',
    };
    setTeachingAssignments((prev) => [...prev, newAssignment]);
    showToast('Penugasan guru ke kelas & mapel berhasil disimpan!', 'success');
  };

  const removeTeachingAssignment = (id: string) => {
    setTeachingAssignments((prev) => prev.filter((ta) => ta.id !== id));
    showToast('Penugasan berhasil dihapus.', 'info');
  };

  // Schedules with Clash Detection
  const addSchedule = (sched: Omit<Schedule, 'id'>): { success: boolean; conflictMsg?: string } => {
    // Check clash:
    // 1. Same teacher at same day & overlapping time
    // 2. Same class at same day & overlapping time
    const clash = schedules.find((s) => {
      if (s.day !== sched.day) return false;
      const overlaps =
        (sched.start_time >= s.start_time && sched.start_time < s.end_time) ||
        (sched.end_time > s.start_time && sched.end_time <= s.end_time) ||
        (sched.start_time <= s.start_time && sched.end_time >= s.end_time);

      if (!overlaps) return false;

      if (s.teacher_id === sched.teacher_id) {
        return true;
      }
      if (s.class_id === sched.class_id) {
        return true;
      }
      return false;
    });

    if (clash) {
      const teacherObj = users.find((u) => u.id === clash.teacher_id);
      const classObj = classes.find((c) => c.id === clash.class_id);
      const subjectObj = subjects.find((sb) => sb.id === clash.subject_id);
      const reason =
        clash.teacher_id === sched.teacher_id
          ? `Bentrok Guru: ${teacherObj?.name} telah mengajar ${subjectObj?.name} di ${classObj?.name} pada ${clash.day} (${clash.start_time} - ${clash.end_time})!`
          : `Bentrok Kelas: Kelas ${classObj?.name} sudah memiliki jadwal ${subjectObj?.name} pada waktu yang sama (${clash.start_time} - ${clash.end_time})!`;
      return { success: false, conflictMsg: reason };
    }

    const newSched: Schedule = { id: `sch-${Date.now()}`, ...sched };
    setSchedules((prev) => [...prev, newSched]);
    showToast('Jadwal pelajaran berhasil disimpan!', 'success');
    return { success: true };
  };

  const deleteSchedule = (scheduleId: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
    showToast('Jadwal berhasil dihapus.', 'info');
  };

  // Lessons
  const addLesson = (lesson: Omit<Lesson, 'id' | 'published_at'>) => {
    const newLesson: Lesson = {
      id: `lsn-${Date.now()}`,
      published_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...lesson,
    };
    setLessons((prev) => [newLesson, ...prev]);
    logAuditAction('LESSON_CREATE', `Menerbitkan materi pembelajaran "${lesson.title}" (${lesson.chapter})`);
    showToast(`Materi "${lesson.title}" berhasil diterbitkan!`, 'success');
  };

  const updateLesson = (lessonId: string, data: Partial<Lesson>) => {
    setLessons((prev) => prev.map((l) => (l.id === lessonId ? { ...l, ...data } : l)));
    logAuditAction('LESSON_UPDATE', `Memperbarui isi modul materi ID: ${lessonId}`);
    showToast('Materi berhasil diperbarui.', 'success');
  };

  const deleteLesson = (lessonId: string) => {
    const target = lessons.find((l) => l.id === lessonId);
    setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    logAuditAction('LESSON_DELETE', `Menghapus materi pembelajaran "${target?.title || lessonId}"`);
    showToast('Materi telah dihapus.', 'info');
  };

  const markLessonComplete = (lessonId: string, studentId: string) => {
    const existing = lessonProgresses.find((lp) => lp.lesson_id === lessonId && lp.student_id === studentId);
    if (!existing) {
      const newProgress: LessonProgress = {
        id: `lp-${Date.now()}`,
        lesson_id: lessonId,
        student_id: studentId,
        completed: true,
        completed_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      setLessonProgresses((prev) => [...prev, newProgress]);

      // Add points to student profile (+50 XP)
      setStudentProfiles((prev) =>
        prev.map((sp) => {
          if (sp.user_id === studentId) {
            const newPoints = sp.points + 50;
            const newCount = sp.completed_lessons_count + 1;
            const newBadges = [...sp.badges];
            if (newCount >= 3 && !newBadges.includes('badge-2')) {
              newBadges.push('badge-2');
              showToast('🏆 Selamat! Anda meraih Lencana: Penuntas Materi!', 'success');
            }
            return {
              ...sp,
              points: newPoints,
              completed_lessons_count: newCount,
              badges: newBadges,
            };
          }
          return sp;
        })
      );
      showToast('🎉 Hebat! Materi ditandai selesai (+50 XP)', 'success');
    }
  };

  // Assignments & Submissions
  const addAssignment = (asg: Omit<Assignment, 'id' | 'created_at'>) => {
    const newAsg: Assignment = {
      id: `asg-${Date.now()}`,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...asg,
    };
    setAssignments((prev) => [newAsg, ...prev]);
    logAuditAction('ASSIGNMENT_CREATE', `Membuat penugasan tugas "${asg.title}"`);
    showToast(`Tugas "${asg.title}" berhasil dibuat!`, 'success');
  };

  const updateAssignment = (asgId: string, data: Partial<Assignment>) => {
    setAssignments((prev) => prev.map((a) => (a.id === asgId ? { ...a, ...data } : a)));
    showToast('Tugas berhasil diperbarui.', 'success');
  };

  const deleteAssignment = (asgId: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== asgId));
    showToast('Tugas dihapus.', 'info');
  };

  const submitAssignment = (assignmentId: string, studentId: string, textAnswer?: string, fileName?: string) => {
    const asg = assignments.find((a) => a.id === assignmentId);
    const isLate = asg ? new Date() > new Date(asg.due_date) : false;
    const existingIndex = submissions.findIndex((s) => s.assignment_id === assignmentId && s.student_id === studentId);

    const submissionData: Submission = {
      id: existingIndex >= 0 ? submissions[existingIndex].id : `sub-${Date.now()}`,
      assignment_id: assignmentId,
      student_id: studentId,
      submitted_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      text_answer: textAnswer,
      file_name: fileName || (textAnswer ? 'Jawaban_Teks_Online.txt' : 'Dokumen_Tugas.pdf'),
      file_url: '#',
      status: isLate ? 'late' : 'submitted',
    };

    if (existingIndex >= 0) {
      setSubmissions((prev) => prev.map((s, idx) => (idx === existingIndex ? submissionData : s)));
    } else {
      setSubmissions((prev) => [submissionData, ...prev]);
    }

    // Award +40 XP
    setStudentProfiles((prev) =>
      prev.map((sp) => (sp.user_id === studentId ? { ...sp, points: sp.points + 40 } : sp))
    );

    const studentUser = users.find((u) => u.id === studentId);
    logAuditAction('SUBMISSION_SUBMIT', `Siswa ${studentUser?.name || 'Murid'} mengumpulkan tugas "${asg?.title || assignmentId}"`);
    showToast('Tugas berhasil dikirim ke guru!', 'success');
  };

  const gradeSubmission = (submissionId: string, score: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              score,
              feedback,
              graded_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
              status: 'graded',
            }
          : s
      )
    );
    const sub = submissions.find((s) => s.id === submissionId);
    const studentUser = users.find((u) => u.id === sub?.student_id);
    logAuditAction('GRADE_SUBMISSION', `Memberikan nilai (${score}) untuk tugas siswa ${studentUser?.name || 'Murid'}`);
    showToast(`Nilai (${score}) dan umpan balik berhasil disimpan.`, 'success');
  };

  // Quizzes & Exams CBT
  const addQuiz = (quiz: Omit<Quiz, 'id' | 'created_at'>) => {
    const newQuiz: Quiz = {
      id: `qz-${Date.now()}`,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...quiz,
    };
    setQuizzes((prev) => [newQuiz, ...prev]);
    logAuditAction('QUIZ_CREATE', `Membuat paket ${quiz.type === 'ujian' ? 'Ujian CBT' : 'Kuis'}: "${quiz.title}"`);
    showToast(`Paket ${quiz.type === 'ujian' ? 'Ujian CBT' : 'Kuis'} berhasil dibuat!`, 'success');
  };

  const updateQuiz = (quizId: string, data: Partial<Quiz>) => {
    setQuizzes((prev) => prev.map((q) => (q.id === quizId ? { ...q, ...data } : q)));
    showToast('Kuis/Ujian berhasil diperbarui.', 'success');
  };

  const deleteQuiz = (quizId: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    showToast('Kuis/Ujian dihapus.', 'info');
  };

  const submitQuizAttempt = (
    quizId: string,
    studentId: string,
    answers: { question_id: string; student_answer: string }[],
    timeSpent: number
  ): QuizAttempt => {
    const quiz = quizzes.find((q) => q.id === quizId);
    let autoScore = 0;
    let hasEssay = false;

    const detailedAnswers: QuizAttemptAnswer[] = answers.map((ans) => {
      const question = quiz?.questions.find((q) => q.id === ans.question_id);
      if (!question) {
        return {
          question_id: ans.question_id,
          student_answer: ans.student_answer,
          earned_score: 0,
        };
      }

      if (question.type === 'esai') {
        hasEssay = true;
        return {
          question_id: ans.question_id,
          student_answer: ans.student_answer,
          earned_score: 0,
        };
      }

      // Check objective answers
      const isCorrect =
        question.correct_answer.trim().toLowerCase() === ans.student_answer.trim().toLowerCase();
      const earned = isCorrect ? question.points : 0;
      autoScore += earned;

      return {
        question_id: ans.question_id,
        student_answer: ans.student_answer,
        is_correct: isCorrect,
        earned_score: earned,
      };
    });

    const newAttempt: QuizAttempt = {
      id: `qa-${Date.now()}`,
      quiz_id: quizId,
      student_id: studentId,
      start_time: new Date(Date.now() - timeSpent * 1000).toISOString().replace('T', ' ').substring(0, 19),
      submit_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      time_spent_seconds: timeSpent,
      answers: detailedAnswers,
      auto_score: autoScore,
      essay_score: 0,
      total_score: autoScore,
      status: hasEssay ? 'submitted' : 'graded',
    };

    setQuizAttempts((prev) => [newAttempt, ...prev]);

    // Bonus XP if 100
    if (autoScore === 100) {
      setStudentProfiles((prev) =>
        prev.map((sp) => {
          if (sp.user_id === studentId) {
            const badges = [...sp.badges];
            if (!badges.includes('badge-3')) badges.push('badge-3');
            return { ...sp, points: sp.points + 100, badges };
          }
          return sp;
        })
      );
    } else {
      setStudentProfiles((prev) =>
        prev.map((sp) => (sp.user_id === studentId ? { ...sp, points: sp.points + 50 } : sp))
      );
    }

    return newAttempt;
  };

  const gradeEssayAnswer = (attemptId: string, questionId: string, score: number, note?: string) => {
    setQuizAttempts((prev) =>
      prev.map((attempt) => {
        if (attempt.id !== attemptId) return attempt;
        const updatedAnswers = attempt.answers.map((a) =>
          a.question_id === questionId ? { ...a, earned_score: score, teacher_note: note } : a
        );
        const essayTotal = updatedAnswers.reduce((sum, a) => {
          const q = quizzes.flatMap((qz) => qz.questions).find((item) => item.id === a.question_id);
          return q?.type === 'esai' ? sum + a.earned_score : sum;
        }, 0);
        const total = attempt.auto_score + essayTotal;

        return {
          ...attempt,
          answers: updatedAnswers,
          essay_score: essayTotal,
          total_score: total,
          status: 'graded',
        };
      })
    );
    showToast('Koreksi esai dan nilai ujian diperbarui.', 'success');
  };

  // Discussions
  const addDiscussion = (subjectId: string, classId: string, title: string, content: string) => {
    if (!currentUser) return;
    const newDiscussion: Discussion = {
      id: `disc-${Date.now()}`,
      subject_id: subjectId,
      class_id: classId,
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_role: currentUser.role,
      user_avatar: currentUser.avatar,
      title,
      content,
      is_pinned: false,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      replies: [],
    };
    setDiscussions((prev) => [newDiscussion, ...prev]);
    showToast('Topik diskusi berhasil diterbitkan!', 'success');
  };

  const addDiscussionReply = (discussionId: string, content: string) => {
    if (!currentUser) return;
    const newReply: DiscussionReply = {
      id: `rep-${Date.now()}`,
      discussion_id: discussionId,
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_role: currentUser.role,
      user_avatar: currentUser.avatar,
      content,
      is_helpful: false,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setDiscussions((prev) =>
      prev.map((d) => (d.id === discussionId ? { ...d, replies: [...d.replies, newReply] } : d))
    );
    showToast('Balasan Anda telah dikirim.', 'success');
  };

  const markReplyHelpful = (discussionId: string, replyId: string) => {
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== discussionId) return d;
        return {
          ...d,
          replies: d.replies.map((r) => (r.id === replyId ? { ...r, is_helpful: !r.is_helpful } : r)),
        };
      })
    );
    showToast('Status jawaban membantu diperbarui.', 'info');
  };

  // Attendance
  const saveAttendanceSession = (session: Omit<AttendanceSession, 'id'>) => {
    const newSession: AttendanceSession = {
      id: `att-${Date.now()}`,
      ...session,
    };
    setAttendances((prev) => [newSession, ...prev]);
    showToast(`Presensi pertemuan ke-${session.meeting_number} berhasil disimpan!`, 'success');
  };

  const updateAttendanceSession = (sessionId: string, updated: Partial<AttendanceSession>) => {
    setAttendances((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, ...updated } : s))
    );
    showToast('Presensi pertemuan berhasil diperbarui.', 'success');
  };

  const deleteAttendanceSession = (sessionId: string) => {
    setAttendances((prev) => prev.filter((s) => s.id !== sessionId));
    showToast('Data presensi pertemuan berhasil dihapus.', 'info');
  };

  const updateAttendanceRecordNote = (
    sessionId: string,
    studentId: string,
    status: 'hadir' | 'izin' | 'sakit' | 'alpa',
    note: string
  ) => {
    setAttendances((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;
        return {
          ...session,
          records: session.records.map((r) =>
            r.student_id === studentId ? { ...r, status, note } : r
          ),
        };
      })
    );
    showToast('Status presensi dan keterangan murid diperbarui.', 'success');
  };

  // Announcements
  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'published_at' | 'author_name'>) => {
    const newAnn: Announcement = {
      id: `anc-${Date.now()}`,
      published_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      author_name: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Administrator',
      ...ann,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast('Pengumuman sekolah berhasil dipublikasikan!', 'success');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Pengumuman dihapus.', 'info');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const updateGradeConfig = (config: GradeConfig) => {
    setGradeConfigState(config);
    showToast('Bobot penilaian sekolah berhasil diperbarui.', 'success');
  };

  const updateSystemSettings = (newSettings: Partial<SystemSettings>) => {
    setSystemSettingsState((prev) => {
      const merged: SystemSettings = { ...prev, ...newSettings };
      if (newSettings.schoolName) {
        merged.school_name = newSettings.schoolName;
      } else if (newSettings.school_name) {
        merged.schoolName = newSettings.school_name;
      }
      if (newSettings.shortName) {
        merged.shortName = newSettings.shortName;
      } else if (newSettings.schoolName) {
        merged.shortName = newSettings.schoolName;
      }
      if (newSettings.tagline) merged.school_tagline = newSettings.tagline;
      if (newSettings.school_tagline) merged.tagline = newSettings.school_tagline;
      if (newSettings.landingHeroImage) merged.hero_image = newSettings.landingHeroImage;
      if (newSettings.hero_image) merged.landingHeroImage = newSettings.hero_image;
      if (newSettings.landingHeroTitle) merged.hero_title = newSettings.landingHeroTitle;
      if (newSettings.hero_title) merged.landingHeroTitle = newSettings.hero_title;
      if (newSettings.landingHeroSubtitle) merged.hero_subtitle = newSettings.landingHeroSubtitle;
      if (newSettings.hero_subtitle) merged.landingHeroSubtitle = newSettings.hero_subtitle;
      if (newSettings.logoUrl !== undefined) merged.logoUrl = newSettings.logoUrl;
      return merged;
    });
    const schoolNameApplied = newSettings.schoolName || newSettings.school_name || 'SMP N 1 JAYA';
    logAuditAction('SETTINGS_UPDATE', `Memperbarui profil resmi sekolah: ${schoolNameApplied}, logo, dan banner.`);
    showToast(`Pengaturan profil sekolah "${schoolNameApplied}" berhasil disimpan!`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole: currentUser?.role || 'murid',
        isLoggedIn,
        activeTab,
        setActiveTab,
        toasts,
        showToast,
        removeToast,
        users,
        studentProfiles,
        teacherProfiles,
        academicYears,
        classes,
        subjects,
        teachingAssignments,
        schedules,
        lessons,
        lessonProgresses,
        assignments,
        submissions,
        quizzes,
        quizAttempts,
        gradeConfig,
        discussions,
        attendances,
        announcements,
        notifications,
        auditLogs,
        badges,
        login,
        logout,
        switchUserById,
        switchRoleQuick,
        resetDatabase,
        addUser,
        updateUser,
        toggleUserStatus,
        deleteUser,
        addClass,
        updateClass,
        deleteClass,
        moveStudentClass,
        addSubject,
        updateSubject,
        assignTeacherToSubject,
        removeTeachingAssignment,
        addSchedule,
        deleteSchedule,
        addLesson,
        updateLesson,
        deleteLesson,
        markLessonComplete,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        submitAssignment,
        gradeSubmission,
        addQuiz,
        updateQuiz,
        deleteQuiz,
        submitQuizAttempt,
        gradeEssayAnswer,
        addDiscussion,
        addDiscussionReply,
        markReplyHelpful,
        saveAttendanceSession,
        updateAttendanceSession,
        deleteAttendanceSession,
        updateAttendanceRecordNote,
        addAnnouncement,
        deleteAnnouncement,
        markNotificationRead,
        logAuditAction,
        updateGradeConfig,
        systemSettings,
        updateSystemSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
