import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  BookOpen,
  Clock,
  Calendar,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  TrendingUp,
  ArrowRight,
  Flame,
  Trophy,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    studentProfiles,
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
    announcements,
    setActiveTab,
  } = useApp();

  const currentProfile = studentProfiles.find((sp) => sp.user_id === currentUser?.id);
  const myClass = classes.find((c) => c.id === currentProfile?.class_id);

  // Subjects for my class
  const classAssignments = teachingAssignments.filter((ta) => ta.class_id === myClass?.id);
  const mySubjectIds = Array.from(new Set(classAssignments.map((ta) => ta.subject_id)));
  const mySubjects = subjects.filter((s) => mySubjectIds.includes(s.id));

  // Today's schedule - dynamically determine Indonesian day or fallback to active schedules
  const dayNamesIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const todayDay = dayNamesIndo[new Date().getDay()];
  const targetDay = todayDay === 'Minggu' || todayDay === 'Sabtu' ? 'Senin' : todayDay;
  const matchedSchedules = schedules.filter((s) => s.class_id === myClass?.id && s.day === targetDay);
  const todaySchedules = matchedSchedules.length > 0
    ? matchedSchedules
    : schedules.filter((s) => s.class_id === myClass?.id).slice(0, 4);

  // Pending assignments for this student
  const pendingAssignments = assignments.filter((a) => {
    if (a.class_id !== myClass?.id) return false;
    const isSubmitted = submissions.some((s) => s.assignment_id === a.id && s.student_id === currentUser?.id);
    return !isSubmitted;
  });

  // Recent grades
  const myGradedSubmissions = submissions.filter(
    (s) => s.student_id === currentUser?.id && s.status === 'graded'
  );

  // Upcoming quizzes
  const myActiveQuizzes = quizzes.filter(
    (q) => q.class_id === myClass?.id && q.status === 'active'
  );

  // Learning progress %
  const totalClassLessons = lessons.filter((l) => l.class_id === myClass?.id).length;
  const myCompletedLessons = lessonProgresses.filter((lp) => lp.student_id === currentUser?.id && lp.completed).length;
  const progressPercent = totalClassLessons > 0 ? Math.round((myCompletedLessons / totalClassLessons) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner: Warm greeting & XP summary */}
      <div className="bg-gradient-to-r from-indigo-700 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold mb-3 border border-indigo-400/30">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            Tahun Ajaran 2026/2027 Ganjil • Semester Aktif
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Semangat Belajar, {currentUser?.name}! 👋
          </h2>
          <p className="text-sm text-indigo-100/90 mt-1 max-w-2xl">
            Anda terdaftar di <strong className="text-white">Kelas {myClass?.name}</strong> (Jenjang {myClass?.grade} SMP). Tetap konsisten menuntaskan materi dan kerjakan tugas tepat waktu!
          </p>
        </div>

        {/* Gamification Card inside banner */}
        <div
          onClick={() => setActiveTab('gamifikasi')}
          className="bg-white/10 hover:bg-white/15 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 flex items-center gap-4 cursor-pointer transition-all self-start md:self-auto shrink-0 group"
          title="Buka Halaman Lencana & Prestasi"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-slate-900 font-black shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
              Poin Gamifikasi
            </span>
            <p className="text-2xl font-black text-white">{currentProfile?.points || 0} XP</p>
            <span className="text-[10px] text-indigo-200 font-semibold flex items-center gap-1">
              {currentProfile?.badges.length || 0} Lencana Prestasi
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards for Student */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveTab('mapel_murid')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Mata Pelajaran</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{mySubjects.length} Mapel</div>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">Sesuai rombel {myClass?.name}</p>
        </div>

        <div
          onClick={() => setActiveTab('tugas_murid')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tugas Belum Selesai</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {pendingAssignments.length} Tugas
          </div>
          <p className="text-[11px] text-rose-600 font-semibold mt-1">Perlu dikerjakan segera</p>
        </div>

        <div
          onClick={() => setActiveTab('ujian_murid')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Ujian & Kuis CBT</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {myActiveQuizzes.length} Tersedia
          </div>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">Siap dikerjakan</p>
        </div>

        <div
          onClick={() => setActiveTab('materi_murid')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Progres Belajar</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{progressPercent}%</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            {myCompletedLessons}/{totalClassLessons} Bab materi tuntas
          </p>
        </div>
      </div>

      {/* Grid: Pending Tasks & Today's Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Assignments */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-slate-900">Tugas Yang Perlu Diselesaikan</h3>
            </div>
            <button
              onClick={() => setActiveTab('tugas_murid')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {pendingAssignments.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                🎉 Luar biasa! Semua tugas Anda telah selesai dikumpulkan.
              </div>
            ) : (
              pendingAssignments.map((asg) => {
                const sbj = subjects.find((s) => s.id === asg.subject_id);

                return (
                  <div
                    key={asg.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-300 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 uppercase">
                        {sbj?.name}
                      </span>
                      <h4 className="font-extrabold text-xs text-slate-900 mt-1.5">{asg.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-rose-500" />
                        Tenggat: {asg.due_date}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('tugas_murid')}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs self-start sm:self-auto shrink-0"
                    >
                      Kerjakan Tugas
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Today's Timetable */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Jadwal Pelajaran Hari Ini</h3>
            </div>
            <span className="text-xs font-bold text-slate-500">Senin</span>
          </div>

          <div className="space-y-3">
            {todaySchedules.map((sch) => {
              const sbj = subjects.find((s) => s.id === sch.subject_id);
              return (
                <div
                  key={sch.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{sbj?.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Ruang: {sch.room}</p>
                  </div>
                  <span className="font-mono font-bold text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-200">
                    {sch.start_time} - {sch.end_time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Recent Grades & School Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Hasil Penilaian Terbaru</h3>
            </div>
            <button
              onClick={() => setActiveTab('nilai_murid')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Transkrip Lengkap
            </button>
          </div>

          <div className="space-y-3">
            {myGradedSubmissions.slice(0, 3).map((sub) => {
              const asg = assignments.find((a) => a.id === sub.assignment_id);

              return (
                <div key={sub.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{asg?.title}</span>
                    <span className="text-sm font-black text-emerald-600">Skor: {sub.score}</span>
                  </div>
                  {sub.feedback && (
                    <p className="text-[11px] text-slate-600 mt-1.5 italic bg-white p-2 rounded-lg border border-slate-200/60">
                      "{sub.feedback}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Pengumuman Sekolah</h3>
            <span className="text-xs font-semibold text-slate-400">Resmi</span>
          </div>

          <div className="space-y-3">
            {announcements
              .filter((a) => a.target === 'semua' || a.target === 'murid')
              .slice(0, 2)
              .map((anc) => (
                <div key={anc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <h4 className="font-bold text-slate-900">{anc.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {anc.content}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    {anc.published_at.substring(0, 10)} • {anc.author_name}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
