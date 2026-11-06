import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Search,
  Filter,
  CheckCircle,
  GraduationCap,
  Layers,
  BookOpen,
} from 'lucide-react';
import { PrintExportDropdown } from '../common/PrintExportDropdown';
import { downloadAdminReportPDF, downloadExcel, getSchoolInfoFromSettings } from '../../utils/exportUtils';

export const AdminReports: React.FC = () => {
  const { users, classes, subjects, studentProfiles, submissions, quizzes, quizAttempts, showToast, systemSettings } = useApp();
  const [selectedClass, setSelectedClass] = useState<string>('semua');
  const [searchName, setSearchName] = useState('');

  const students = users.filter((u) => u.role === 'murid');

  const filteredStudents = students.filter((s) => {
    const sp = studentProfiles.find((p) => p.user_id === s.id);
    if (selectedClass !== 'semua' && sp?.class_id !== selectedClass) return false;
    if (searchName && !s.name.toLowerCase().includes(searchName.toLowerCase())) return false;
    return true;
  });

  const getComputedStudentReports = () => {
    return filteredStudents.map((s, idx) => {
      const sp = studentProfiles.find((p) => p.user_id === s.id);
      const cls = classes.find((c) => c.id === sp?.class_id);
      const studentSubs = submissions.filter((sub) => sub.student_id === s.id);
      const gradedSubs = studentSubs.filter((sub) => sub.score !== undefined);
      const avgScore = gradedSubs.length
        ? Math.round(gradedSubs.reduce((acc, curr) => acc + (curr.score || 0), 0) / gradedSubs.length)
        : 0;

      const studentAttempts = quizAttempts.filter((qa) => qa.student_id === s.id);
      const avgQuiz = studentAttempts.length
        ? Math.round(studentAttempts.reduce((acc, curr) => acc + curr.total_score, 0) / studentAttempts.length)
        : 0;

      const overall = Math.round(avgScore * 0.5 + avgQuiz * 0.5);
      const pred =
        overall >= 90
          ? 'A (Sangat Baik)'
          : overall >= 80
          ? 'B (Baik)'
          : overall >= 75
          ? 'C (Cukup)'
          : 'D (Perlu Bimbingan)';

      return {
        no: idx + 1,
        nis: sp?.nis || '-',
        name: s.name,
        className: cls?.name ? `Kelas ${cls.name}` : '-',
        completedLessons: sp?.completed_lessons_count || 0,
        assignmentsCount: studentSubs.length,
        avgScore,
        quizScore: avgQuiz,
        overallScore: overall,
        predikat: overall > 0 ? pred : 'Belum Ada',
      };
    });
  };

  const handleExportPDF = () => {
    const schoolInfo = getSchoolInfoFromSettings(systemSettings);
    const data = getComputedStudentReports();
    const classNameStr = selectedClass === 'semua' ? 'semua' : classes.find((c) => c.id === selectedClass)?.name || selectedClass;
    downloadAdminReportPDF(schoolInfo, classNameStr, data);
    showToast('Laporan akademik resmi berhasil diunduh dalam format PDF!', 'success');
  };

  const handleExportExcel = () => {
    const data = getComputedStudentReports();
    const headers = [
      'No',
      'NIS',
      'Nama Peserta Didik',
      'Rombel',
      'Materi Tuntas (Bab)',
      'Tugas Dikumpulkan',
      'Rata-rata Tugas',
      'Skor Kuis/Ujian CBT',
      'Nilai Akhir',
      'Predikat',
    ];
    const rows = data.map((d) => [
      d.no,
      d.nis,
      d.name,
      d.className,
      d.completedLessons,
      d.assignmentsCount,
      d.avgScore,
      d.quizScore,
      d.overallScore,
      d.predikat,
    ]);
    downloadExcel('laporan_rekapitulasi_akademik_smp.xlsx', 'Rekapitulasi Akademik', headers, rows);
    showToast('Rekapitulasi akademik berhasil diunduh dalam format Excel (.xlsx)!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Laporan & Rekapitulasi Akademik
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Rekap pengumpulan tugas, kuis, evaluasi hasil belajar, dan performa siswa seluruh rombel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <PrintExportDropdown
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            variant="blue"
            tooltip="Cetak atau Unduh Laporan Akademik (Pilihan PDF atau Excel)"
          />
        </div>
      </div>

      {/* Filter Toolbar (hidden when printing) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama murid..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Pilih Rombel:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl font-bold bg-white"
          >
            <option value="semua">Semua Rombel (VII-A s/d IX-B)</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Kelas {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Official Report Card Table / Printable Area */}
      <div className="print-area bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden p-6 print:border-none print:shadow-none print:p-0">
        <div className="border-b-2 border-slate-900 pb-4 mb-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            {systemSettings?.logoUrl ? (
              <img
                src={systemSettings.logoUrl}
                alt="Logo"
                className="w-14 h-14 object-contain rounded-xl p-0.5 bg-white border border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold shrink-0">
                <GraduationCap className="w-7 h-7" />
              </div>
            )}
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                Pemerintah Daerah Dinas Pendidikan & Kebudayaan
              </p>
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {systemSettings?.schoolName || systemSettings?.school_name || 'SMP N 1 JAYA'}
              </h1>
              <p className="text-[10px] text-slate-600">
                {systemSettings?.address || 'Jl. Pendidikan Mandiri No. 45, Kebayoran Baru, Jakarta Selatan'} • Telp: {systemSettings?.phone || '(021) 7890-1234'}
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-300">
            <h3 className="font-black text-base text-slate-900 uppercase tracking-wider">
              REKAPITULASI LAPORAN HASIL BELAJAR SISWA SELURUH ROMBEL
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tahun Pelajaran 2026/2027 Semester Ganjil • Kurikulum SMP Merdeka
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200 uppercase text-[11px]">
                <th className="py-3 px-3">No</th>
                <th className="py-3 px-3">NIS</th>
                <th className="py-3 px-4">Nama Peserta Didik</th>
                <th className="py-3 px-3">Rombel</th>
                <th className="py-3 px-3 text-center">Materi Tuntas</th>
                <th className="py-3 px-3 text-center">Tugas Dikumpul</th>
                <th className="py-3 px-3 text-center">Rerata Tugas</th>
                <th className="py-3 px-3 text-center">Skor Kuis/Ujian</th>
                <th className="py-3 px-3 text-center">Predikat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s, idx) => {
                const sp = studentProfiles.find((p) => p.user_id === s.id);
                const cls = classes.find((c) => c.id === sp?.class_id);
                const studentSubs = submissions.filter((sub) => sub.student_id === s.id);
                const gradedSubs = studentSubs.filter((sub) => sub.score !== undefined);
                const avgScore = gradedSubs.length
                  ? Math.round(gradedSubs.reduce((acc, curr) => acc + (curr.score || 0), 0) / gradedSubs.length)
                  : 0;

                const studentAttempts = quizAttempts.filter((qa) => qa.student_id === s.id);
                const avgQuiz = studentAttempts.length
                  ? Math.round(studentAttempts.reduce((acc, curr) => acc + curr.total_score, 0) / studentAttempts.length)
                  : 0;

                const overall = Math.round((avgScore * 0.5) + (avgQuiz * 0.5));
                const pred = overall >= 90 ? 'A (Sangat Baik)' : overall >= 80 ? 'B (Baik)' : overall >= 75 ? 'C (Cukup)' : 'D (Perlu Bimbingan)';

                return (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{sp?.nis || '-'}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3 px-3 font-semibold text-blue-700">Kelas {cls?.name}</td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-600">
                      {sp?.completed_lessons_count || 0} Bab
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">
                      {studentSubs.length} Tugas
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">
                      {avgScore > 0 ? avgScore : '-'}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-indigo-700">
                      {avgQuiz > 0 ? avgQuiz : '-'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          overall >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {overall > 0 ? pred : 'Belum Ada'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            <p>Dicetak otomatis dari Sistem Informasi E-Learning {systemSettings?.schoolName || 'SMP N 1 JAYA'}</p>
            <p>Status Data: Valid dan Terverifikasi</p>
          </div>
          <div className="text-right">
            <p>Kepala Sekolah / Administrator</p>
            <div className="h-12" />
            <p className="font-bold text-slate-900">Hendra Wijaya, S.Kom.</p>
            <p className="text-[10px] text-slate-400">NIP. 197808152003121002</p>
          </div>
        </div>
      </div>
    </div>
  );
};
