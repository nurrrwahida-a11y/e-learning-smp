import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  BookOpen,
  Users,
  FileCheck2,
  Clock,
  Award,
  AlertCircle,
  Plus,
  ArrowRight,
  Sparkles,
  Calendar,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const {
    currentUser,
    teachingAssignments,
    classes,
    subjects,
    studentProfiles,
    assignments,
    submissions,
    schedules,
    quizzes,
    systemSettings,
    setActiveTab,
  } = useApp();

  // Find assignments belonging to this teacher
  const myAllocations = teachingAssignments.filter((ta) => ta.teacher_id === currentUser?.id);
  const myClassIds = Array.from(new Set(myAllocations.map((ta) => ta.class_id)));
  const mySubjectIds = Array.from(new Set(myAllocations.map((ta) => ta.subject_id)));

  const myClasses = classes.filter((c) => myClassIds.includes(c.id));
  const mySubjects = subjects.filter((s) => mySubjectIds.includes(s.id));

  // Count students in my classes
  const myStudentsCount = studentProfiles.filter((sp) => myClassIds.includes(sp.class_id)).length;

  // Assignments created by this teacher
  const myAssignments = assignments.filter((a) => a.teacher_id === currentUser?.id);
  const myAssignmentIds = myAssignments.map((a) => a.id);

  // Submissions on my assignments
  const mySubmissions = submissions.filter((s) => myAssignmentIds.includes(s.assignment_id));
  const needGrading = mySubmissions.filter((s) => s.status === 'submitted' || s.status === 'late').length;

  // Schedules for this teacher
  const mySchedules = schedules.filter((s) => s.teacher_id === currentUser?.id);

  // Upcoming exams/quizzes
  const myQuizzes = quizzes.filter((q) => q.teacher_id === currentUser?.id);

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            Portal Guru Pengajar {systemSettings?.shortName || systemSettings?.schoolName || 'SMP N 1 JAYA'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Selamat Mengajar, {currentUser?.name}
          </h2>
          <p className="text-sm text-emerald-100/90 mt-1 max-w-2xl">
            Kelola ruang pembelajaran, publikasikan modul, periksa jawaban tugas murid, dan selenggarakan ujian CBT terintegrasi.
          </p>
        </div>

        {/* Quick Create Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('materi')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold shadow-md transition-all"
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            Tambah Materi
          </button>
          <button
            onClick={() => setActiveTab('tugas')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold border border-emerald-400/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            Buat Tugas
          </button>
          <button
            onClick={() => setActiveTab('ujian')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold border border-emerald-400/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            Ujian CBT
          </button>
        </div>
      </div>

      {/* 4 Stat Cards for Teacher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveTab('kelas_guru')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Kelas Diampu</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{myClasses.length} Rombel</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            {myClasses.map((c) => c.name).join(', ') || 'Belum ada rombel'}
          </p>
        </div>

        <div
          onClick={() => setActiveTab('kelas_guru')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Jumlah Murid</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{myStudentsCount} Siswa</div>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">Pada kelas yang diampu</p>
        </div>

        <div
          onClick={() => setActiveTab('tugas')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Perlu Dinilai</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{needGrading} Jawaban</div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">Menunggu pemeriksaan guru</p>
        </div>

        <div
          onClick={() => setActiveTab('ujian')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Paket Kuis / Ujian</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{myQuizzes.length} Paket</div>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">CBT Computer-Based Test</p>
        </div>
      </div>

      {/* Grid: Teaching Schedules & Pending Task Review */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Jadwal Mengajar */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Jadwal Mengajar Saya</h3>
            </div>
            <span className="text-xs font-bold text-slate-500">{mySchedules.length} Sesi Terjadwal</span>
          </div>

          <div className="space-y-3">
            {mySchedules.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Belum ada jadwal mengajar.</p>
            ) : (
              mySchedules.map((sch) => {
                const cls = classes.find((c) => c.id === sch.class_id);
                const sbj = subjects.find((s) => s.id === sch.subject_id);

                return (
                  <div
                    key={sch.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          {sch.day}
                        </span>
                        <span className="font-bold text-xs text-slate-900">{sbj?.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Kelas {cls?.name} • Ruang: {sch.room}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-200">
                      {sch.start_time} - {sch.end_time}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Tugas Yang Menunggu Diperiksa */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Pengumpulan Tugas Siswa</h3>
            </div>
            <button
              onClick={() => setActiveTab('tugas')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Buka Penilaian
            </button>
          </div>

          <div className="space-y-3">
            {mySubmissions.slice(0, 4).map((sub) => {
              const asg = assignments.find((a) => a.id === sub.assignment_id);
              const student = studentProfiles.find((sp) => sp.user_id === sub.student_id);
              const userObj = [
                { id: 'usr-murid-1', name: 'Ahmad Fauzi Pratama' },
                { id: 'usr-murid-2', name: 'Bella Safitri Azzahra' },
                { id: 'usr-murid-3', name: 'Citra Kirana Putri' },
                { id: 'usr-murid-4', name: 'Doni Pratama Kusuma' },
              ].find((u) => u.id === sub.student_id);

              return (
                <div
                  key={sub.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{userObj?.name || 'Siswa'}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{asg?.title}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sub.status === 'graded'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {sub.status === 'graded' ? `Nilai: ${sub.score}` : 'Perlu Diperiksa'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
