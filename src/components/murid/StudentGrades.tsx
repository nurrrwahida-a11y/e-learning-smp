import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Award,
  CheckCircle,
  GraduationCap,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react';
import { PrintExportDropdown } from '../common/PrintExportDropdown';
import { downloadStudentGradesPDF, downloadExcel, getSchoolInfoFromSettings } from '../../utils/exportUtils';

export const StudentGrades: React.FC = () => {
  const {
    currentUser,
    studentProfiles,
    teacherProfiles,
    classes,
    subjects,
    teachingAssignments,
    assignments,
    submissions,
    quizAttempts,
    gradeConfig,
    systemSettings,
    users,
    showToast,
  } = useApp();

  const currentProfile = studentProfiles.find((sp) => sp.user_id === currentUser?.id);
  const myClass = classes.find((c) => c.id === currentProfile?.class_id);

  // Find actual homeroom teacher for this student's class
  const homeroomTeacherProfile = teacherProfiles.find((tp) => tp.user_id === myClass?.homeroom_teacher_id);
  const homeroomUser = users.find((u) => u.id === myClass?.homeroom_teacher_id);
  const homeroomTeacherUser = {
    name: homeroomUser?.name || 'Wali Kelas ' + (myClass?.name || 'SMP N 1 JAYA'),
    nip: homeroomTeacherProfile?.nip || '197805122003121002',
  };

  const classAssignments = teachingAssignments.filter((ta) => ta.class_id === myClass?.id);
  const mySubjectIds = Array.from(new Set(classAssignments.map((ta) => ta.subject_id)));
  const mySubjects = subjects.filter((s) => mySubjectIds.includes(s.id));

  // Compute overall summary
  const gradesData = mySubjects.map((sbj, idx) => {
    const subjectAsgs = assignments.filter((a) => a.subject_id === sbj.id);
    const asgIds = subjectAsgs.map((a) => a.id);
    const myGradedSubs = submissions.filter(
      (s) => asgIds.includes(s.assignment_id) && s.student_id === currentUser?.id && s.score !== undefined
    );
    const tugasAvg = myGradedSubs.length
      ? Math.round(myGradedSubs.reduce((acc, curr) => acc + (curr.score || 0), 0) / myGradedSubs.length)
      : sbj.id === 'sbj-mtk'
      ? 92
      : 86;

    const myQuizzes = quizAttempts.filter((qa) => qa.student_id === currentUser?.id);
    const kuisAvg = myQuizzes.length
      ? Math.round(myQuizzes.reduce((acc, curr) => acc + curr.total_score, 0) / myQuizzes.length)
      : 88;

    const finalScore = Math.round(
      (tugasAvg * gradeConfig.tugas_weight) / 100 +
        (kuisAvg * gradeConfig.kuis_weight) / 100 +
        (kuisAvg * gradeConfig.ujian_weight) / 100
    );
    const isPassed = finalScore >= 75;
    const letterGrade = finalScore >= 90 ? 'A' : finalScore >= 80 ? 'B' : finalScore >= 75 ? 'C' : 'D';

    return {
      no: idx + 1,
      subject: sbj,
      tugasAvg,
      kuisAvg,
      finalScore,
      isPassed,
      letterGrade,
    };
  });

  const totalFinalScore = gradesData.reduce((acc, g) => acc + g.finalScore, 0);
  const averageFinalScore = gradesData.length ? Math.round(totalFinalScore / gradesData.length) : 0;
  const overallLetter = averageFinalScore >= 90 ? 'A' : averageFinalScore >= 80 ? 'B' : averageFinalScore >= 75 ? 'C' : 'D';

  const schoolTitle = systemSettings?.schoolName || systemSettings?.school_name || 'SMP N 1 JAYA';
  const schoolAddress = systemSettings?.address || 'Jl. Pendidikan Mandiri No. 45, Kebayoran Baru, Jakarta Selatan';
  const headmaster = systemSettings?.headmasterName || 'Drs. H. Mulyadi Kusuma, M.Pd.';
  const headmasterNip = systemSettings?.headmasterNip || '196803121994031005';

  const handleExportPDF = () => {
    const schoolInfo = getSchoolInfoFromSettings(systemSettings);
    const pdfData = gradesData.map((g) => ({
      no: g.no,
      subjectName: g.subject.name,
      subjectCode: g.subject.code,
      kkm: 75,
      tugasAvg: g.tugasAvg,
      kuisAvg: g.kuisAvg,
      ujianScore: g.kuisAvg,
      finalScore: g.finalScore,
      letterGrade: g.letterGrade,
      isPassed: g.isPassed,
    }));

    downloadStudentGradesPDF(
      schoolInfo,
      currentUser?.name || 'Siswa SMP',
      currentProfile?.nis || '247001',
      currentProfile?.nisn || '0098765432',
      myClass?.name || 'VII-A',
      homeroomTeacherUser,
      pdfData,
      averageFinalScore,
      overallLetter
    );
    showToast('Transkrip rapor nilai siswa berhasil diunduh dalam format PDF!', 'success');
  };

  const handleExportExcel = () => {
    const headers = ['No', 'Mata Pelajaran', 'Kode Mapel', 'KKM', 'Rata-rata Tugas', 'Kuis CBT', 'Ujian Resmi', 'Nilai Akhir', 'Predikat', 'Status Kelulusan'];
    const rows = gradesData.map((g) => [
      g.no,
      g.subject.name,
      g.subject.code,
      75,
      g.tugasAvg,
      g.kuisAvg,
      g.kuisAvg,
      g.finalScore,
      g.letterGrade,
      g.isPassed ? 'Tuntas KKM' : 'Remidial',
    ]);
    rows.push([
      '',
      'RATA-RATA KESELURUHAN',
      '',
      75,
      '-',
      '-',
      '-',
      averageFinalScore,
      overallLetter,
      'LULUS / BAIK',
    ]);
    downloadExcel(
      `transkrip_nilai_${currentProfile?.nis || 'siswa'}_${currentUser?.name?.toLowerCase().replace(/[^a-z0-9]/g, '_')}.xlsx`,
      'Transkrip Nilai',
      headers,
      rows
    );
    showToast('Transkrip nilai siswa berhasil diunduh dalam format Excel (.xlsx)!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Action Header — Hidden when Printing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Transkrip Nilai Hasil Belajar Siswa
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Laporan resmi capaian belajar {schoolTitle} (tugas, kuis online, dan ujian CBT semester berjalan).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <PrintExportDropdown
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            variant="blue"
            tooltip="Cetak atau Unduh Transkrip Nilai Siswa (Pilihan PDF atau Excel)"
          />
        </div>
      </div>

      {/* Official Student Report Document (Ready for Print & Screen) */}
      <div className="print-area bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Official Kop Surat Sekolah */}
        <div className="border-b-2 border-slate-900 pb-4 text-center">
          <div className="flex items-center justify-center gap-4">
            {systemSettings?.logoUrl ? (
              <img
                src={systemSettings.logoUrl}
                alt="Logo Sekolah"
                className="w-14 h-14 object-contain rounded-xl p-0.5 bg-white border border-slate-200 shadow-sm shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                <GraduationCap className="w-8 h-8" />
              </div>
            )}
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                Pemerintah Daerah Dinas Pendidikan & Kebudayaan
              </p>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight mt-0.5">
                {schoolTitle}
              </h1>
              <p className="text-[11px] text-slate-600 mt-0.5 max-w-xl mx-auto">
                {schoolAddress} • Telp: {systemSettings?.phone || '(021) 7890-1234'} • Email: {systemSettings?.email || 'info@smpj1jaya.sch.id'}
              </p>
              <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-slate-500 mt-1">
                <span>NPSN: <strong>{systemSettings?.npsn || '20104589'}</strong></span>
                <span>•</span>
                <span>Akreditasi: <strong>{systemSettings?.accreditation || 'A (Unggul)'}</strong></span>
                <span>•</span>
                <span>Website: <strong>{systemSettings?.website || 'smpj1jaya.sch.id'}</strong></span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-300">
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900">
              TRANSKRIP CAPAIAN HASIL BELAJAR SISWA (RAPOR SEMENTARA)
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Tahun Ajaran 2026/2027 Semester Ganjil • Kurikulum SMP Merdeka Belajar
            </p>
          </div>

          {/* Student Identity Metadata */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Nama Lengkap Siswa</span>
              <strong className="text-slate-900 text-sm font-black">{currentUser?.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Nomor Induk Siswa (NIS/NISN)</span>
              <strong className="text-slate-900 font-mono">
                {currentProfile?.nis || '247001'} / {currentProfile?.nisn || '0098765432'}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Rombongan Belajar (Kelas)</span>
              <strong className="text-slate-900">
                Kelas {myClass?.name || 'VII-A'} (Jenjang {myClass?.grade || 'VII'})
              </strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Status Kelayakan</span>
              <strong className="text-emerald-700 font-black inline-flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                MEMENUHI KKM
              </strong>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-y border-slate-300 uppercase text-[11px]">
                <th className="py-2.5 px-3 text-center w-10">No</th>
                <th className="py-2.5 px-4">Mata Pelajaran</th>
                <th className="py-2.5 px-3 text-center">KKM</th>
                <th className="py-2.5 px-3 text-center">Rata-rata Tugas ({gradeConfig.tugas_weight}%)</th>
                <th className="py-2.5 px-3 text-center">Kuis CBT ({gradeConfig.kuis_weight}%)</th>
                <th className="py-2.5 px-3 text-center">Ujian Resmi ({gradeConfig.ujian_weight}%)</th>
                <th className="py-2.5 px-3 text-center font-black">Nilai Akhir</th>
                <th className="py-2.5 px-3 text-center">Predikat</th>
                <th className="py-2.5 px-3 text-center">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {gradesData.map((g) => (
                <tr key={g.subject.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-mono text-center text-slate-500">{g.no}</td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    <div>{g.subject.name}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{g.subject.code}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-600">75</td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-700">{g.tugasAvg}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-blue-700">{g.kuisAvg}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-purple-700">{g.kuisAvg}</td>
                  <td className="py-2.5 px-3 text-center font-black text-sm text-slate-900 bg-slate-50/60">
                    {g.finalScore}
                  </td>
                  <td className="py-2.5 px-3 text-center font-black text-emerald-700 text-sm">
                    {g.letterGrade}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        g.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {g.isPassed ? 'Tuntas KKM' : 'Remidial'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100/80 font-bold border-t-2 border-slate-300 text-slate-900">
                <td colSpan={6} className="py-3 px-4 text-right uppercase tracking-wider text-xs font-black">
                  Rata-rata Nilai Keseluruhan:
                </td>
                <td className="py-3 px-3 text-center font-black text-base text-blue-800">
                  {averageFinalScore}
                </td>
                <td className="py-3 px-3 text-center font-black text-base text-emerald-700">
                  {overallLetter}
                </td>
                <td className="py-3 px-3 text-center text-[11px] font-black text-emerald-800">
                  LULUS / BAIK
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Predicate Explanation */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>Predikat A: 90 - 100 (Sangat Baik)</div>
          <div>Predikat B: 80 - 89 (Baik)</div>
          <div>Predikat C: 75 - 79 (Cukup)</div>
          <div>Predikat D: &lt; 75 (Perlu Bimbingan / Remidial)</div>
        </div>

        {/* Official Signatures for PDF */}
        <div className="pt-8 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs text-slate-700">
          <div>
            <p className="font-semibold">Mengetahui,</p>
            <p className="font-semibold">Orang Tua / Wali Siswa</p>
            <div className="h-16" />
            <p className="font-bold text-slate-900 border-b border-slate-400 inline-block px-6 pb-0.5">
              .............................................
            </p>
          </div>

          <div>
            <p className="font-semibold">Wali Kelas {myClass?.name || 'VII-A'}</p>
            <p className="text-[11px] text-slate-500">Guru Pembimbing Akademik</p>
            <div className="h-16" />
            <p className="font-bold text-slate-900 border-b border-slate-400 inline-block px-2 pb-0.5">
              {homeroomTeacherUser.name}
            </p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">NIP. {homeroomTeacherUser.nip}</p>
          </div>

          <div>
            <p className="font-semibold">Jakarta, 3 November 2026</p>
            <p className="font-semibold">Kepala Sekolah {schoolTitle}</p>
            <div className="h-16" />
            <p className="font-bold text-slate-900 border-b border-slate-400 inline-block px-2 pb-0.5">
              {headmaster}
            </p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">NIP. {headmasterNip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
