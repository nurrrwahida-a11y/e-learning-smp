import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Settings2,
  Sliders,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { PrintExportDropdown } from '../common/PrintExportDropdown';
import { downloadTeacherGradesPDF, downloadExcel, getSchoolInfoFromSettings } from '../../utils/exportUtils';

export const TeacherGrades: React.FC = () => {
  const {
    currentUser,
    teachingAssignments,
    classes,
    subjects,
    users,
    studentProfiles,
    assignments,
    submissions,
    quizAttempts,
    gradeConfig,
    updateGradeConfig,
    showToast,
    systemSettings,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>('cls-7a');
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Config weights state
  const [tugasWeight, setTugasWeight] = useState(gradeConfig.tugas_weight);
  const [kuisWeight, setKuisWeight] = useState(gradeConfig.kuis_weight);
  const [ujianWeight, setUjianWeight] = useState(gradeConfig.ujian_weight);

  const myAllocations = teachingAssignments.filter((ta) => ta.teacher_id === currentUser?.id);
  const myClassIds = Array.from(new Set(myAllocations.map((ta) => ta.class_id)));
  const myClasses = classes.filter((c) => myClassIds.includes(c.id));

  const studentsInClass = studentProfiles.filter((sp) => sp.class_id === selectedClassId);

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    if (tugasWeight + kuisWeight + ujianWeight !== 100) {
      showToast('Total bobot penilaian harus berjumlah tepat 100%!', 'error');
      return;
    }
    updateGradeConfig({
      tugas_weight: tugasWeight,
      kuis_weight: kuisWeight,
      ujian_weight: ujianWeight,
    });
    setShowConfigModal(false);
  };

  const getComputedTeacherGrades = () => {
    return studentsInClass.map((sp, idx) => {
      const studentUser = users.find((u) => u.id === sp.user_id);
      const studentSubs = submissions.filter((s) => s.student_id === sp.user_id && s.score !== undefined);
      const tugasAvg = studentSubs.length
        ? Math.round(studentSubs.reduce((acc, curr) => acc + (curr.score || 0), 0) / studentSubs.length)
        : 0;

      const studentQuizzes = quizAttempts.filter((qa) => qa.student_id === sp.user_id);
      const kuisAvg = studentQuizzes.length
        ? Math.round(studentQuizzes.reduce((acc, curr) => acc + curr.total_score, 0) / studentQuizzes.length)
        : 0;

      const ujianScore = kuisAvg;
      const finalScore = Math.round(
        (tugasAvg * gradeConfig.tugas_weight) / 100 +
          (kuisAvg * gradeConfig.kuis_weight) / 100 +
          (ujianScore * gradeConfig.ujian_weight) / 100
      );
      const pred = finalScore >= 90 ? 'A' : finalScore >= 80 ? 'B' : finalScore >= 75 ? 'C' : 'D';
      const status = finalScore >= 75 ? 'Tuntas KKM' : 'Remidial';

      return {
        no: idx + 1,
        nis: sp.nis,
        name: studentUser?.name || 'Siswa',
        tugasAvg,
        kuisAvg,
        ujianScore,
        finalScore,
        predikat: pred,
        status,
      };
    });
  };

  const handleExportPDF = () => {
    const schoolInfo = getSchoolInfoFromSettings(systemSettings);
    const data = getComputedTeacherGrades();
    const currentClassObj = classes.find((c) => c.id === selectedClassId);
    const classNameStr = currentClassObj?.name || 'VII-A';
    downloadTeacherGradesPDF(schoolInfo, currentUser?.name || 'Guru Pengajar', classNameStr, gradeConfig, data);
    showToast(`Rekapitulasi nilai Kelas ${classNameStr} berhasil diunduh dalam format PDF!`, 'success');
  };

  const handleExportExcel = () => {
    const data = getComputedTeacherGrades();
    const currentClassObj = classes.find((c) => c.id === selectedClassId);
    const classNameStr = currentClassObj?.name || 'VII-A';
    const headers = [
      'No',
      'NIS',
      'Nama Siswa',
      `Rata-rata Tugas (${gradeConfig.tugas_weight}%)`,
      `Rata-rata Kuis (${gradeConfig.kuis_weight}%)`,
      `Ujian CBT (${gradeConfig.ujian_weight}%)`,
      'Nilai Akhir',
      'Predikat',
      'Status Kelulusan',
    ];
    const rows = data.map((d) => [
      d.no,
      d.nis,
      d.name,
      d.tugasAvg,
      d.kuisAvg,
      d.ujianScore,
      d.finalScore,
      d.predikat,
      d.status,
    ]);
    downloadExcel(`rekap_nilai_kelas_${classNameStr.replace(/\s+/g, '_')}.xlsx`, `Kelas ${classNameStr}`, headers, rows);
    showToast(`Rekapitulasi nilai Kelas ${classNameStr} berhasil diunduh dalam format Excel (.xlsx)!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Rekapitulasi Nilai & Bobot Penilaian
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Perhitungan transparan berdasarkan formulasi bobot Tugas, Kuis, dan Ujian CBT sekolah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-emerald-600" />
            Konfigurasi Bobot
          </button>
          <PrintExportDropdown
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            variant="emerald"
            tooltip="Cetak atau Unduh Rekap Nilai Siswa (Pilihan PDF atau Excel)"
          />
        </div>
      </div>

      {/* Weight Formulation Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 uppercase tracking-wider">
            Formulasi Aktif
          </span>
          <h3 className="font-extrabold text-sm sm:text-base mt-1">
            Nilai Akhir = ({gradeConfig.tugas_weight}% Tugas) + ({gradeConfig.kuis_weight}% Kuis) + ({gradeConfig.ujian_weight}% Ujian)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Batas KKM Kelulusan SMP: <strong>75.0</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-xs text-slate-200">
          <div>
            <span className="text-slate-400 block text-[10px]">Tugas</span>
            <strong className="text-emerald-400 text-sm">{gradeConfig.tugas_weight}%</strong>
          </div>
          <span className="text-slate-500">+</span>
          <div>
            <span className="text-slate-400 block text-[10px]">Kuis</span>
            <strong className="text-blue-400 text-sm">{gradeConfig.kuis_weight}%</strong>
          </div>
          <span className="text-slate-500">+</span>
          <div>
            <span className="text-slate-400 block text-[10px]">Ujian</span>
            <strong className="text-purple-400 text-sm">{gradeConfig.ujian_weight}%</strong>
          </div>
        </div>
      </div>

      {/* Class Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Pilih Rombel Kelas:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white font-bold text-slate-800"
          >
            {myClasses.map((c) => (
              <option key={c.id} value={c.id}>
                Kelas {c.name} ({studentsInClass.length} Murid)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grades Table / Printable Area */}
      <div className="print-area bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden print:border-none print:shadow-none">
        {/* Official Kop Surat for Print */}
        <div className="hidden print:block border-b-2 border-slate-900 pb-4 text-center mb-6">
          <div className="flex items-center justify-center gap-4">
            {systemSettings?.logoUrl ? (
              <img
                src={systemSettings.logoUrl}
                alt="Logo"
                className="w-14 h-14 object-contain rounded-xl p-0.5 bg-white border border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold shrink-0">
                <FileSpreadsheet className="w-7 h-7" />
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
          <div className="mt-3 pt-2 border-t border-slate-300">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
              REKAPITULASI CAPAIAN NILAI AKADEMIK — KELAS {classes.find((c) => c.id === selectedClassId)?.name || 'VII-A'}
            </h2>
            <p className="text-[11px] text-slate-500">
              Guru Pengajar: {currentUser?.name} • Semester Ganjil 2026/2027 • Tanggal: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">No</th>
                <th className="py-3 px-3">NIS</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-3 text-center">Rerata Tugas ({gradeConfig.tugas_weight}%)</th>
                <th className="py-3 px-3 text-center">Rerata Kuis ({gradeConfig.kuis_weight}%)</th>
                <th className="py-3 px-3 text-center">Ujian CBT ({gradeConfig.ujian_weight}%)</th>
                <th className="py-3 px-3 text-center">Nilai Akhir</th>
                <th className="py-3 px-3 text-center">Predikat</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentsInClass.map((sp, idx) => {
                const studentUser = users.find((u) => u.id === sp.user_id);
                const studentSubs = submissions.filter((s) => s.student_id === sp.user_id && s.score !== undefined);
                const tugasAvg = studentSubs.length
                  ? Math.round(studentSubs.reduce((acc, curr) => acc + (curr.score || 0), 0) / studentSubs.length)
                  : 0;

                const studentQuizzes = quizAttempts.filter((qa) => qa.student_id === sp.user_id);
                const kuisAvg = studentQuizzes.length
                  ? Math.round(studentQuizzes.reduce((acc, curr) => acc + curr.total_score, 0) / studentQuizzes.length)
                  : 0;

                const ujianScore = kuisAvg; // Simulated / derived from CBT
                const finalScore = Math.round(
                  (tugasAvg * gradeConfig.tugas_weight) / 100 +
                    (kuisAvg * gradeConfig.kuis_weight) / 100 +
                    (ujianScore * gradeConfig.ujian_weight) / 100
                );
                const isPassed = finalScore >= 75;
                const letterGrade = finalScore >= 90 ? 'A' : finalScore >= 80 ? 'B' : finalScore >= 75 ? 'C' : 'D';

                return (
                  <tr key={sp.user_id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{sp.nis}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{studentUser?.name}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {tugasAvg > 0 ? tugasAvg : '-'}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-blue-700">
                      {kuisAvg > 0 ? kuisAvg : '-'}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-purple-700">
                      {ujianScore > 0 ? ujianScore : '-'}
                    </td>
                    <td className="py-3 px-3 text-center font-black text-sm text-slate-900">
                      {finalScore > 0 ? finalScore : '-'}
                    </td>
                    <td className="py-3 px-3 text-center font-extrabold text-emerald-700">
                      {finalScore > 0 ? letterGrade : '-'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isPassed && finalScore > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {finalScore > 0 ? (isPassed ? 'TUNTAS' : 'REMIDIAL') : 'BELUM TUNTAS'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Config Weights */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Atur Bobot Penilaian Mata Pelajaran</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tentukan persentase bobot masing-masing komponen. Total harus tepat 100%.
              </p>
            </div>

            <form onSubmit={handleSaveWeights} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bobot Tugas Harian (%)</label>
                <input
                  type="number"
                  min={10}
                  max={80}
                  value={tugasWeight}
                  onChange={(e) => setTugasWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bobot Kuis Interaktif (%)</label>
                <input
                  type="number"
                  min={10}
                  max={80}
                  value={kuisWeight}
                  onChange={(e) => setKuisWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bobot Ujian Resmi CBT (PTS/PAS) (%)</label>
                <input
                  type="number"
                  min={10}
                  max={80}
                  value={ujianWeight}
                  onChange={(e) => setUjianWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between font-bold">
                <span>Total Bobot:</span>
                <span
                  className={
                    tugasWeight + kuisWeight + ujianWeight === 100 ? 'text-emerald-600' : 'text-rose-600'
                  }
                >
                  {tugasWeight + kuisWeight + ujianWeight}% {tugasWeight + kuisWeight + ujianWeight === 100 ? '✓' : '(Harus 100%)'}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Simpan Bobot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
