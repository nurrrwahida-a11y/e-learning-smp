import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Send,
  Award,
  X,
  FileCheck2,
  Search,
} from 'lucide-react';
import { Assignment } from '../../types';

export const StudentAssignments: React.FC = () => {
  const {
    currentUser,
    studentProfiles,
    classes,
    subjects,
    assignments,
    submissions,
    submitAssignment,
    showToast,
  } = useApp();

  const currentProfile = studentProfiles.find((sp) => sp.user_id === currentUser?.id);
  const myClass = classes.find((c) => c.id === currentProfile?.class_id);

  const [activeFilter, setActiveFilter] = useState<'semua' | 'pending' | 'submitted' | 'graded'>('semua');
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Submission Form State
  const [textAnswer, setTextAnswer] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  const myAssignments = assignments.filter((a) => a.class_id === myClass?.id);

  const filtered = myAssignments.filter((asg) => {
    const sub = submissions.find((s) => s.assignment_id === asg.id && s.student_id === currentUser?.id);
    const subj = subjects.find((s) => s.id === asg.subject_id);

    if (activeFilter === 'pending' && sub) return false;
    if (activeFilter === 'submitted' && (!sub || sub.status === 'graded')) return false;
    if (activeFilter === 'graded' && sub?.status !== 'graded') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = asg.title.toLowerCase().includes(q);
      const matchChapter = asg.chapter.toLowerCase().includes(q);
      const matchSubject = subj?.name.toLowerCase().includes(q);
      const matchInstr = asg.instructions.toLowerCase().includes(q);
      if (!matchTitle && !matchChapter && !matchSubject && !matchInstr) return false;
    }

    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignment || !currentUser) return;

    if (!textAnswer.trim() && !uploadedFileName) {
      showToast('Ketik jawaban teks atau pilih unggah berkas tugas.', 'error');
      return;
    }

    submitAssignment(submittingAssignment.id, currentUser.id, textAnswer.trim(), uploadedFileName || undefined);
    setSubmittingAssignment(null);
    setTextAnswer('');
    setUploadedFileName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Tugas & Lembar Kerja Siswa
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Kerjakan tugas harian, unggah berkas pekerjaan rumah, dan lihat evaluasi nilai dari dewan guru SMP N 1 JAYA.
          </p>
        </div>

        {/* Real-time Search Box */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tugas otomatis..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {(['semua', 'pending', 'submitted', 'graded'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
              activeFilter === filter
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {filter === 'semua'
              ? 'Semua Tugas'
              : filter === 'pending'
              ? 'Belum Dikerjakan'
              : filter === 'submitted'
              ? 'Sudah Dikumpulkan'
              : 'Sudah Dinilai'}
          </button>
        ))}
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
            Tidak ada tugas pada kategori ini.
          </div>
        ) : (
          filtered.map((asg) => {
            const sbj = subjects.find((s) => s.id === asg.subject_id);
            const sub = submissions.find((s) => s.assignment_id === asg.id && s.student_id === currentUser?.id);
            const isGraded = sub?.status === 'graded';
            const isSubmitted = !!sub;

            return (
              <div
                key={asg.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                      {sbj?.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        isGraded
                          ? 'bg-emerald-100 text-emerald-800'
                          : isSubmitted
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isGraded ? `Nilai: ${sub.score}` : isSubmitted ? 'Terkumpul' : 'Belum Selesai'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 mt-3 leading-snug">
                    {asg.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {asg.instructions}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      Tenggat: {asg.due_date}
                    </span>
                    <span className="font-bold text-slate-700">Maks: {asg.max_score}</span>
                  </div>

                  {/* Feedback Box if Graded */}
                  {isGraded && sub.feedback && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                      <strong className="block text-[10px] uppercase text-emerald-700 mb-0.5">
                        Catatan Guru:
                      </strong>
                      "{sub.feedback}"
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    {isSubmitted ? `Terkumpul: ${sub.submitted_at.substring(0, 10)}` : 'Wajib dikerjakan'}
                  </span>
                  <button
                    onClick={() => {
                      setSubmittingAssignment(asg);
                      setTextAnswer(sub?.text_answer || '');
                      setUploadedFileName(sub?.file_name || '');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      isSubmitted
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {isSubmitted ? 'Edit / Lihat Jawaban' : 'Kirim Jawaban'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Submit Assignment */}
      {submittingAssignment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase">
                  Lembar Pengumpulan Tugas
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
                  {submittingAssignment.title}
                </h3>
              </div>
              <button
                onClick={() => setSubmittingAssignment(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-700 space-y-1">
              <strong className="text-slate-900 block font-bold">Instruksi Soal:</strong>
              <p className="leading-relaxed whitespace-pre-line">{submittingAssignment.instructions}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Jawaban Teks Online (Ketik Langsung):
                </label>
                <textarea
                  rows={6}
                  placeholder="Tuliskan jawaban atau langkah perhitungan Anda secara lengkap..."
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl leading-relaxed font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Unggah Dokumen Jawaban / Foto Buku Tulis (Opsional):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Contoh: Jawaban_Matematika_Ahmad_Fauzi.pdf"
                    value={uploadedFileName}
                    onChange={(e) => setUploadedFileName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFileName(`Jawaban_${currentUser?.username || 'Siswa'}_Tugas.pdf`);
                      showToast('File lampiran PDF berhasil dipilih!', 'info');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Pilih File
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubmittingAssignment(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Kirim Jawaban Final (+40 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
