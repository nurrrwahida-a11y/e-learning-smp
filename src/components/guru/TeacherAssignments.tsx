import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Plus,
  Clock,
  Calendar,
  CheckCircle,
  FileCheck2,
  Trash2,
  X,
  User,
  MessageSquare,
  AlertCircle,
  Award,
} from 'lucide-react';
import { Assignment, Submission } from '../../types';

export const TeacherAssignments: React.FC = () => {
  const {
    currentUser,
    teachingAssignments,
    classes,
    subjects,
    assignments,
    submissions,
    users,
    studentProfiles,
    addAssignment,
    deleteAssignment,
    gradeSubmission,
    showToast,
  } = useApp();

  const [selectedAssignmentForReview, setSelectedAssignmentForReview] = useState<Assignment | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);

  // Form State for new Assignment
  const [formData, setFormData] = useState({
    title: '',
    chapter: '',
    instructions: '',
    class_id: 'cls-7a',
    subject_id: 'sbj-mtk',
    start_date: '2026-10-29 08:00',
    due_date: '2026-11-10 23:59',
    max_score: 100,
    submission_type: 'both' as 'text' | 'file' | 'both',
  });

  // Grading form state
  const [inputScore, setInputScore] = useState<number>(90);
  const [inputFeedback, setInputFeedback] = useState<string>('Pekerjaan sangat baik dan rapi.');

  const myAllocations = teachingAssignments.filter((ta) => ta.teacher_id === currentUser?.id);
  const myClassIds = Array.from(new Set(myAllocations.map((ta) => ta.class_id)));
  const myClasses = classes.filter((c) => myClassIds.includes(c.id));

  const myAssignments = assignments.filter((a) => a.teacher_id === currentUser?.id);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.instructions.trim()) {
      showToast('Judul dan instruksi tugas wajib diisi.', 'error');
      return;
    }

    addAssignment({
      title: formData.title.trim(),
      chapter: formData.chapter.trim() || 'Tugas Bab Berjalan',
      instructions: formData.instructions.trim(),
      class_id: formData.class_id,
      subject_id: formData.subject_id,
      teacher_id: currentUser?.id || 'usr-guru-1',
      start_date: formData.start_date,
      due_date: formData.due_date,
      max_score: formData.max_score,
      submission_type: formData.submission_type,
      status: 'published',
    });

    setShowAddModal(false);
    setFormData({
      title: '',
      chapter: '',
      instructions: '',
      class_id: myClasses[0]?.id || 'cls-7a',
      subject_id: 'sbj-mtk',
      start_date: '2026-10-29 08:00',
      due_date: '2026-11-10 23:59',
      max_score: 100,
      submission_type: 'both',
    });
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;
    gradeSubmission(gradingSubmission.id, Number(inputScore), inputFeedback);
    setGradingSubmission(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Tugas & Koreksi Nilai
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Buat penugasan baru, atur tenggat waktu, dan periksa lembar jawaban murid secara berkala.
          </p>
        </div>

        <button
          onClick={() => {
            if (myClasses.length > 0) setFormData((prev) => ({ ...prev, class_id: myClasses[0].id }));
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Buat Tugas Baru
        </button>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {myAssignments.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
            Belum ada tugas yang dibuat. Silakan klik tombol "Buat Tugas Baru".
          </div>
        ) : (
          myAssignments.map((asg) => {
            const cls = classes.find((c) => c.id === asg.class_id);
            const asgSubs = submissions.filter((s) => s.assignment_id === asg.id);
            const gradedCount = asgSubs.filter((s) => s.status === 'graded').length;
            const pendingCount = asgSubs.filter((s) => s.status === 'submitted' || s.status === 'late').length;

            return (
              <div
                key={asg.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                      Kelas {cls?.name} • Nilai Maks: {asg.max_score}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      Tenggat: {asg.due_date.substring(0, 10)}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 mt-2.5 leading-snug">
                    {asg.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {asg.instructions}
                  </p>

                  {/* Submission Statistics Bar */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px]">Terkumpul:</span>
                      <p className="font-bold text-slate-900">{asgSubs.length} Murid</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px]">Sudah Dinilai:</span>
                      <p className="font-bold text-emerald-700">{gradedCount}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px]">Perlu Diperiksa:</span>
                      <p className="font-bold text-amber-600">{pendingCount}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedAssignmentForReview(asg)}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    Koreksi Jawaban ({asgSubs.length})
                  </button>
                  <button
                    onClick={() => deleteAssignment(asg.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Hapus Tugas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Submissions List & Grading */}
      {selectedAssignmentForReview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase">
                  Pemeriksaan Tugas Siswa
                </span>
                <h3 className="font-black text-lg text-slate-900 mt-0.5">
                  {selectedAssignmentForReview.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAssignmentForReview(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              {submissions.filter((s) => s.assignment_id === selectedAssignmentForReview.id).length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Belum ada murid yang mengumpulkan jawaban pada tugas ini.
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions
                    .filter((s) => s.assignment_id === selectedAssignmentForReview.id)
                    .map((sub) => {
                      const studentObj = users.find((u) => u.id === sub.student_id);
                      const isGraded = sub.status === 'graded';

                      return (
                        <div
                          key={sub.id}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={studentObj?.avatar}
                                alt={studentObj?.name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <h4 className="font-bold text-xs text-slate-900">{studentObj?.name}</h4>
                                <span className="text-[10px] text-slate-400">
                                  Dikirim: {sub.submitted_at}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  isGraded
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : sub.status === 'late'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {isGraded ? `Nilai: ${sub.score}` : sub.status === 'late' ? 'Terlambat' : 'Terkumpul'}
                              </span>
                              <button
                                onClick={() => {
                                  setGradingSubmission(sub);
                                  setInputScore(sub.score || 85);
                                  setInputFeedback(sub.feedback || 'Pekerjaan sudah bagus dan lengkap.');
                                }}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                              >
                                {isGraded ? 'Koreksi Ulang' : 'Beri Nilai'}
                              </button>
                            </div>
                          </div>

                          {/* Student Answer Content */}
                          {sub.text_answer && (
                            <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-mono">
                              {sub.text_answer}
                            </div>
                          )}

                          {sub.file_name && (
                            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50/70 p-2.5 rounded-xl border border-blue-200/60">
                              <FileText className="w-4 h-4 text-blue-600" />
                              <span>Berkas Lampiran: {sub.file_name}</span>
                            </div>
                          )}

                          {sub.feedback && (
                            <div className="text-[11px] text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                              <strong>Umpan Balik Guru:</strong> {sub.feedback}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedAssignmentForReview(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Grading Form */}
      {gradingSubmission && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                Input Nilai & Umpan Balik Guru
              </h3>
              <button onClick={() => setGradingSubmission(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nilai / Skor Tugas (0 - 100) *</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={inputScore}
                  onChange={(e) => setInputScore(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-lg text-emerald-700 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan / Umpan Balik Siswa</label>
                <textarea
                  rows={3}
                  value={inputFeedback}
                  onChange={(e) => setInputFeedback(e.target.value)}
                  placeholder="Berikan apresiasi atau saran perbaikan langkah perhitungan..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold shadow-md"
                >
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Assignment */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Buat Tugas Pembelajaran Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rombel Kelas Tujuan *</label>
                  <select
                    value={formData.class_id}
                    onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  >
                    {myClasses.map((c) => (
                      <option key={c.id} value={c.id}>
                        Kelas {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Pengumpulan</label>
                  <select
                    value={formData.submission_type}
                    onChange={(e) => setFormData({ ...formData, submission_type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="both">Teks Online & Unggah Berkas</option>
                    <option value="text">Hanya Jawaban Teks Online</option>
                    <option value="file">Hanya Unggah Dokumen / Foto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bab / Kompetensi Dasar</label>
                <input
                  type="text"
                  placeholder="Misal: Bab 1: Bilangan Bulat"
                  value={formData.chapter}
                  onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Tugas *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Tugas Mandiri 2: Analisis Soal Cerita Operasi Hitung"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instruksi & Soal Tugas Lengkap *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tuliskan petunjuk pengerjaan dan daftar pertanyaan yang harus dijawab siswa..."
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl leading-relaxed font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Batas Waktu (Tenggat Pengumpulan) *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nilai Maksimal</label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={formData.max_score}
                    onChange={(e) => setFormData({ ...formData, max_score: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold shadow-md"
                >
                  Terbitkan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
