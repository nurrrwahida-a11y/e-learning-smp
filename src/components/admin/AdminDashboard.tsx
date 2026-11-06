import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  Layers,
  BookOpen,
  FileCheck2,
  Clock,
  Megaphone,
  TrendingUp,
  UserPlus,
  CalendarPlus,
  PlusCircle,
  FileSpreadsheet,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    classes,
    subjects,
    studentProfiles,
    teacherProfiles,
    assignments,
    submissions,
    announcements,
    auditLogs,
    systemSettings,
    setActiveTab,
  } = useApp();

  const totalTeachers = users.filter((u) => u.role === 'guru').length;
  const totalStudents = users.filter((u) => u.role === 'murid').length;
  const totalClasses = classes.length;
  const totalSubjects = subjects.filter((s) => s.status === 'aktif').length;

  // Breakdown murid per jenjang
  const studentsGrade7 = studentProfiles.filter((sp) => {
    const cls = classes.find((c) => c.id === sp.class_id);
    return cls?.grade === 'VII';
  }).length;
  const studentsGrade8 = studentProfiles.filter((sp) => {
    const cls = classes.find((c) => c.id === sp.class_id);
    return cls?.grade === 'VIII';
  }).length;
  const studentsGrade9 = studentProfiles.filter((sp) => {
    const cls = classes.find((c) => c.id === sp.class_id);
    return cls?.grade === 'IX';
  }).length;

  // Task submission metrics
  const totalAssignments = assignments.length;
  const totalSubmissions = submissions.length;
  const gradedSubmissions = submissions.filter((s) => s.status === 'graded').length;
  const pendingReview = submissions.filter((s) => s.status === 'submitted' || s.status === 'late').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-3 border border-blue-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Pusat Kendali Administrator {systemSettings?.shortName || systemSettings?.schoolName || 'SMP N 1 JAYA'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Selamat Datang di Panel Pengelola Sekolah
          </h2>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Tahun Ajaran 2026/2027 Semester Ganjil aktif. Pantau statistik murid, penugasan guru, jadwal, dan aktivitas pembelajaran real-time.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <button
            onClick={() => setActiveTab('murid')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold shadow-md transition-all"
          >
            <UserPlus className="w-4 h-4 text-blue-600" />
            Tambah Murid
          </button>
          <button
            onClick={() => setActiveTab('guru')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold border border-blue-400/40 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Tambah Guru
          </button>
          <button
            onClick={() => setActiveTab('pengumuman')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold border border-blue-400/40 transition-all"
          >
            <Megaphone className="w-4 h-4" />
            Buat Pengumuman
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveTab('murid')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Murid</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalStudents}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-blue-600 font-semibold mt-1">
            <span>Kelas VII: {studentsGrade7}</span>
            <span>•</span>
            <span>VIII: {studentsGrade8}</span>
            <span>•</span>
            <span>IX: {studentsGrade9}</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('guru')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Guru</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalTeachers}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Semua aktif mengajar</p>
        </div>

        <div
          onClick={() => setActiveTab('kelas')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Rombel Belajar</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalClasses} Rombel</div>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">VII-A s/d IX-B</p>
        </div>

        <div
          onClick={() => setActiveTab('mapel')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Mata Pelajaran</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalSubjects} Mapel</div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">Kurikulum SMP Merdeka</p>
        </div>
      </div>

      {/* Grid: Distribution Chart & Task Submissions Recap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Murid Per Jenjang Distribution */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Distribusi Murid per Jenjang Pendidikan</h3>
              <p className="text-xs text-slate-500">Komposisi murid aktif kelas VII, VIII, dan IX</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
              Total {totalStudents} Siswa
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Kelas VII (7)</span>
                <span className="font-semibold text-slate-500">
                  {studentsGrade7} Murid ({totalStudents ? Math.round((studentsGrade7 / totalStudents) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{ width: `${totalStudents ? (studentsGrade7 / totalStudents) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Kelas VIII (8)</span>
                <span className="font-semibold text-slate-500">
                  {studentsGrade8} Murid ({totalStudents ? Math.round((studentsGrade8 / totalStudents) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${totalStudents ? (studentsGrade8 / totalStudents) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Kelas IX (9)</span>
                <span className="font-semibold text-slate-500">
                  {studentsGrade9} Murid ({totalStudents ? Math.round((studentsGrade9 / totalStudents) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-teal-600 h-full rounded-full transition-all"
                  style={{ width: `${totalStudents ? (studentsGrade9 / totalStudents) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Kapasitas rombel maksimal 32 siswa per kelas</span>
            <button
              onClick={() => setActiveTab('kelas')}
              className="text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              Kelola Rombel
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Task & Learning Stats */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Rekapitulasi Tugas & Penilaian</h3>
            <span className="text-xs font-bold text-blue-600">{totalAssignments} Paket Tugas</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500">Terkumpul</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{totalSubmissions}</p>
              <span className="text-[10px] text-emerald-600 font-bold">Jawaban siswa</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500">Sudah Dinilai</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{gradedSubmissions}</p>
              <span className="text-[10px] text-blue-600 font-bold">Oleh dewan guru</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500">Menunggu Koreksi</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{pendingReview}</p>
              <span className="text-[10px] text-amber-600 font-bold">Antrean penilaian</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500">Rata-rata Skor</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">92.5</p>
              <span className="text-[10px] text-emerald-600 font-bold">Di atas KKM (75)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Announcements & Audit Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Announcements */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Pengumuman Sekolah Terkini</h3>
            </div>
            <button
              onClick={() => setActiveTab('pengumuman')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {announcements.slice(0, 3).map((anc) => (
              <div key={anc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 line-clamp-1">{anc.title}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 capitalize">
                    {anc.target}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {anc.content}
                </p>
                <div className="text-[10px] text-slate-400 mt-2 font-medium">
                  {anc.published_at.substring(0, 10)} • Oleh {anc.author_name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit Trail */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Jejak Keamanan & Audit Sistem</h3>
            </div>
            <button
              onClick={() => setActiveTab('audit')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Log Lengkap
            </button>
          </div>

          <div className="space-y-2 pt-1">
            {auditLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center justify-between font-medium">
                  <span className="font-bold text-slate-800">{log.user_name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{log.timestamp.substring(11, 19)}</span>
                </div>
                <p className="text-slate-600 mt-0.5">{log.details}</p>
                <span className="text-[10px] font-bold text-slate-400 mt-1 inline-block uppercase">
                  Action: {log.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
