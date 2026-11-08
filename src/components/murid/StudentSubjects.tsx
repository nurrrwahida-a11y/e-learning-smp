import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronLeft,
  FileText,
  Award,
  MessageSquare,
  Sparkles,
  Download,
  Video,
  Paperclip,
  Search,
  FileDown,
  X,
} from 'lucide-react';
import { Subject, Lesson } from '../../types';
import { downloadLessonPDF, downloadLessonTXT, getSchoolInfoFromSettings } from '../../utils/exportUtils';
import { MaterialDownloadDropdown } from '../common/MaterialDownloadDropdown';

export const StudentSubjects: React.FC = () => {
  const {
    currentUser,
    studentProfiles,
    classes,
    subjects,
    teachingAssignments,
    lessons,
    lessonProgresses,
    assignments,
    submissions,
    quizzes,
    users,
    systemSettings,
    markLessonComplete,
    setActiveTab,
    showToast,
  } = useApp();

  const currentProfile = studentProfiles.find((sp) => sp.user_id === currentUser?.id);
  const myClass = classes.find((c) => c.id === currentProfile?.class_id) || classes[0];
  const [selectedClassId, setSelectedClassId] = useState<string>(myClass?.id || 'cls-7a');

  React.useEffect(() => {
    if (myClass?.id) {
      setSelectedClassId(myClass.id);
    }
  }, [myClass?.id]);

  const activeClass = classes.find((c) => c.id === selectedClassId) || myClass || classes[0];

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'materi' | 'tugas' | 'kuis'>('materi');
  const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter teaching assignments for active class
  const classAssignments = teachingAssignments.filter((ta) => ta.class_id === activeClass?.id);
  const classSubjectIds = Array.from(new Set(classAssignments.map((ta) => ta.subject_id)));
  const activeSubjects = subjects.filter((s) => classSubjectIds.length === 0 || classSubjectIds.includes(s.id));

  // Filtered subjects based on automatic search query
  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return activeSubjects;
    const q = searchQuery.toLowerCase();
    return activeSubjects.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [activeSubjects, searchQuery]);

  // If viewing a subject in detail
  if (selectedSubject) {
    const subjectLessons = lessons.filter(
      (l) => l.subject_id === selectedSubject.id && l.class_id === activeClass?.id
    );
    const subjectAssignments = assignments.filter(
      (a) => a.subject_id === selectedSubject.id && a.class_id === activeClass?.id
    );
    const subjectQuizzes = quizzes.filter(
      (q) => q.subject_id === selectedSubject.id && q.class_id === activeClass?.id
    );

    const assignmentForThisSubj = classAssignments.find((ta) => ta.subject_id === selectedSubject.id);
    const teacherUser = users.find((u) => u.id === assignmentForThisSubj?.teacher_id);

    return (
      <div className="space-y-6">
        {/* Back Button & Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              setSelectedSubject(null);
              setViewingLesson(null);
            }}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1 text-xs font-bold cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Semua Mapel
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-500">Materi Jenjang / Kelas:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-800 shadow-2xs outline-none cursor-pointer"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  Kelas {cls.name} (Jenjang {cls.grade}) {cls.id === myClass?.id ? '★ Rombel Saya' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subject Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 uppercase tracking-wider">
                {selectedSubject.code} • Kelas {activeClass?.name} (Jenjang {activeClass?.grade})
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                Kurikulum Merdeka SMP — Fase D
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">{selectedSubject.name}</h2>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-xl">
              {selectedSubject.description}
            </p>
          </div>

          {teacherUser && (
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 flex items-center gap-3 shrink-0">
              <img
                src={teacherUser.avatar}
                alt={teacherUser.name}
                className="w-10 h-10 rounded-full object-cover border border-white/40"
              />
              <div>
                <span className="text-[10px] font-bold text-blue-200 block uppercase">
                  Guru Pengajar:
                </span>
                <p className="text-xs font-extrabold text-white">{teacherUser.name}</p>
                <p className="text-[10px] text-blue-200">{teacherUser.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Search & Sub-tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('materi')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'materi'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Bab Materi Belajar ({subjectLessons.length})
            </button>
            <button
              onClick={() => setActiveSubTab('tugas')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'tugas'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Tugas & Latihan ({subjectAssignments.length})
            </button>
            <button
              onClick={() => setActiveSubTab('kuis')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'kuis'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Kuis CBT ({subjectQuizzes.length})
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi, tugas, atau kuis..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Tab 1: Materi */}
        {activeSubTab === 'materi' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectLessons
              .filter(
                (lsn) =>
                  !searchQuery.trim() ||
                  lsn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  lsn.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  lsn.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((lsn) => {
              const isCompleted = lessonProgresses.some(
                (lp) => lp.lesson_id === lsn.id && lp.student_id === currentUser?.id && lp.completed
              );

              return (
                <div
                  key={lsn.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {lsn.chapter}
                      </span>
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Selesai Dipelajari
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Belum Selesai (+50 XP)
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mt-2">
                      {lsn.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {lsn.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewingLesson(lsn)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        Buka & Baca Materi
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MaterialDownloadDropdown
                        lesson={lsn}
                        subjectName={selectedSubject?.name || 'Mata Pelajaran'}
                        teacherName={teacherUser?.name || 'Dewan Guru'}
                        variant="compact"
                      />

                      {!isCompleted && currentUser && (
                        <button
                          onClick={() => markLessonComplete(lsn.id, currentUser.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                        >
                          Tandai Selesai
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Tugas */}
        {activeSubTab === 'tugas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectAssignments
              .filter(
                (asg) =>
                  !searchQuery.trim() ||
                  asg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  asg.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  asg.instructions.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((asg) => {
              const mySub = submissions.find(
                (s) => s.assignment_id === asg.id && s.student_id === currentUser?.id
              );
              const isSubmitted = !!mySub;

              return (
                <div
                  key={asg.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {asg.chapter}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          mySub?.status === 'graded'
                            ? 'bg-emerald-100 text-emerald-800'
                            : isSubmitted
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {mySub?.status === 'graded'
                          ? `Nilai: ${mySub.score}`
                          : isSubmitted
                          ? 'Sudah Dikumpulkan'
                          : 'Belum Dikerjakan'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-900 mt-2">{asg.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {asg.instructions}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Tenggat: {asg.due_date}
                    </span>
                    <button
                      onClick={() => setActiveTab('tugas_murid')}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Buka Tugas
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Kuis */}
        {activeSubTab === 'kuis' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectQuizzes
              .filter(
                (qz) =>
                  !searchQuery.trim() ||
                  qz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  qz.instructions.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((qz) => (
              <div
                key={qz.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                    {qz.type}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 mt-2">{qz.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{qz.instructions}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">{qz.duration_minutes} Menit</span>
                  <button
                    onClick={() => setActiveTab('ujian_murid')}
                    className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                  >
                    Masuk CBT
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: View Material Content */}
        {viewingLesson && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-blue-700 uppercase">
                    {viewingLesson.chapter}
                  </span>
                  <h3 className="font-black text-xl text-slate-900 mt-0.5">{viewingLesson.title}</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setViewingLesson(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0 cursor-pointer"
                  title="Tutup Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 text-xs text-slate-700 leading-relaxed whitespace-pre-line border-b border-slate-100">
                {viewingLesson.content_text}
              </div>

              {/* Video URL */}
              {viewingLesson.video_url && (
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-rose-600" />
                    <span className="font-semibold text-slate-800">Tonton Video Pembelajaran:</span>
                  </div>
                  <a
                    href={viewingLesson.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-blue-600 hover:underline"
                  >
                    Buka Video
                  </a>
                </div>
              )}

              {/* Single Clean Material Download Control with Format Selection */}
              <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                    Unduh Berkas Pembelajaran
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pilih format yang dibutuhkan: Modul PDF resmi, Word (.docx), slide presentasi, atau paket lengkap.
                  </p>
                </div>
                <MaterialDownloadDropdown
                  lesson={viewingLesson}
                  subjectName={selectedSubject?.name || 'Mata Pelajaran'}
                  teacherName={teacherUser?.name || 'Dewan Guru'}
                  variant="primary"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setViewingLesson(null)}
                  className="px-5 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Tutup
                </button>
                {currentUser && (
                  <button
                    type="button"
                    onClick={() => {
                      markLessonComplete(viewingLesson.id, currentUser.id);
                      setViewingLesson(null);
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    Tandai Selesai (+50 XP)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default: Grid of all subjects for student
  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Kurikulum Merdeka SMP
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              Jenjang {activeClass?.grade} • Rombel {activeClass?.name}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Ruang Belajar Mata Pelajaran
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Akses materi bab terstruktur, modul unduhan, penugasan, dan kuis online untuk jenjang SMP.
          </p>
        </div>

        {/* Toolbar: Class Selector & Automatic Search Box */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-500 hidden sm:inline">Kelas:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-xs focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  Kelas {cls.name} ({cls.grade}) {cls.id === myClass?.id ? '★ Saya' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari mata pelajaran otomatis..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Grid of Subject Cards */}
      {filteredSubjects.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold">Tidak ditemukan mata pelajaran yang cocok dengan "{searchQuery}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map((subj) => {
            const alloc = classAssignments.find((ta) => ta.subject_id === subj.id);
            const teacher = users.find((u) => u.id === alloc?.teacher_id);
            const subjectLessons = lessons.filter(
              (l) => l.subject_id === subj.id && l.class_id === activeClass?.id
            );

            return (
              <div
                key={subj.id}
                onClick={() => {
                  setSelectedSubject(subj);
                  setSearchQuery('');
                }}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {subj.code}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {subjectLessons.length} Bab Materi
                    </span>
                  </div>

                  <h3 className="font-black text-base text-slate-900 mt-3 group-hover:text-blue-700 transition-colors">
                    {subj.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {subj.description}
                  </p>

                  {/* Teacher Info */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2.5">
                    <img
                      src={teacher?.avatar}
                      alt={teacher?.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div className="min-w-0 text-xs">
                      <p className="font-bold text-slate-800 truncate">{teacher?.name || 'Guru'}</p>
                      <p className="text-[10px] text-slate-400">Pengampu Kelas {myClass?.name}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-800">
                  <span>Buka Ruang Belajar</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
