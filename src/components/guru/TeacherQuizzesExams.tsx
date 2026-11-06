import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  HelpCircle,
  Plus,
  Clock,
  CheckCircle,
  X,
  Trash2,
  Edit2,
  Users,
  Eye,
  FileCheck2,
  Sparkles,
  ClipboardList,
  Filter,
  BookOpen,
  Check,
} from 'lucide-react';
import { Quiz, Question, QuestionType, QuizAttempt } from '../../types';

export const TeacherQuizzesExams: React.FC = () => {
  const {
    currentUser,
    teachingAssignments,
    classes,
    subjects,
    quizzes,
    quizAttempts,
    users,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    gradeEssayAnswer,
    activeTab,
    showToast,
  } = useApp();

  // Route / View Detection
  const isBankSoalView = activeTab === 'bank_soal';
  const isUjianView = activeTab === 'ujian';
  const isKuisView = activeTab === 'kuis';

  // Bank Soal Filter state
  const [bankSubjectFilter, setBankSubjectFilter] = useState<string>('semua');
  const [bankTypeFilter, setBankTypeFilter] = useState<string>('semua');
  const [bankDifficultyFilter, setBankDifficultyFilter] = useState<string>('semua');
  const [showAddBankQuestionModal, setShowAddBankQuestionModal] = useState(false);

  // Paket Kuis/Ujian state
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'semua' | 'kuis' | 'ujian'>(
    isUjianView ? 'ujian' : isKuisView ? 'kuis' : 'semua'
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedQuizForAttempts, setSelectedQuizForAttempts] = useState<Quiz | null>(null);
  const [gradingAttempt, setGradingAttempt] = useState<QuizAttempt | null>(null);

  // New Quiz / Exam form
  const [formData, setFormData] = useState({
    title: '',
    type: (isUjianView ? 'ujian' : 'kuis') as 'kuis' | 'ujian',
    instructions: '',
    duration_minutes: isUjianView ? 60 : 20,
    passing_score: 75,
    max_attempts: isUjianView ? 1 : 2,
    randomize_questions: true,
    show_answers_after: true,
    class_id: 'cls-7a',
    subject_id: 'sbj-mtk',
    start_time: '2026-10-29 07:00',
    end_time: '2026-11-20 23:59',
  });

  // Adding questions to the new quiz
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([
    {
      id: `q-demo-1`,
      subject_id: 'sbj-mtk',
      grade: 'VII',
      type: 'pilihan_ganda',
      question_text: 'Hasil dari 15 × (-4) + 20 adalah...',
      options: [
        { key: 'A', text: '-40' },
        { key: 'B', text: '-80' },
        { key: 'C', text: '40' },
        { key: 'D', text: '80' },
      ],
      correct_answer: 'A',
      explanation: '15 × (-4) = -60. Kemudian -60 + 20 = -40.',
      points: 50,
      difficulty: 'sedang',
    },
    {
      id: `q-demo-2`,
      subject_id: 'sbj-mtk',
      grade: 'VII',
      type: 'esai',
      question_text: 'Jelaskan perbedaan antara bilangan rasional dan bilangan irasional beserta contohnya masing-masing!',
      correct_answer: 'Rasional dapat dinyatakan a/b, irasional tidak.',
      explanation: 'Contoh rasional: 1/2, 0.75. Contoh irasional: akar 2, pi.',
      points: 50,
      difficulty: 'sedang',
    },
  ]);

  // Question Creator State
  const [newQType, setNewQType] = useState<QuestionType>('pilihan_ganda');
  const [newQText, setNewQText] = useState('');
  const [newQPoints, setNewQPoints] = useState(25);
  const [newQDifficulty, setNewQDifficulty] = useState<'mudah' | 'sedang' | 'sulit'>('sedang');
  const [newQSubjectId, setNewQSubjectId] = useState('sbj-mtk');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctKey, setCorrectKey] = useState('A');
  const [essayAnswerKey, setEssayAnswerKey] = useState('');

  // Essay grading modal state
  const [essayScoreInput, setEssayScoreInput] = useState<number>(45);

  // All questions in the system acting as the Question Bank
  const allBankQuestions: Question[] = quizzes.flatMap((q) => q.questions);

  // Filtered Question Bank
  const filteredBankQuestions = allBankQuestions.filter((q) => {
    if (bankSubjectFilter !== 'semua' && q.subject_id !== bankSubjectFilter) return false;
    if (bankTypeFilter !== 'semua' && q.type !== bankTypeFilter) return false;
    if (bankDifficultyFilter !== 'semua' && q.difficulty !== bankDifficultyFilter) return false;
    return true;
  });

  // Filtered Quizzes & Exams
  const filteredQuizzes = quizzes.filter((qz) => {
    if (isUjianView) return qz.type === 'ujian';
    if (isKuisView) return qz.type === 'kuis';
    if (selectedTypeFilter !== 'semua') return qz.type === selectedTypeFilter;
    return true;
  });

  const handleAddQuestionToDraft = () => {
    if (!newQText.trim()) {
      showToast('Isi pertanyaan tidak boleh kosong.', 'error');
      return;
    }

    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      subject_id: formData.subject_id,
      grade: 'VII',
      type: newQType,
      question_text: newQText.trim(),
      points: newQPoints,
      difficulty: newQDifficulty,
      options:
        newQType === 'pilihan_ganda'
          ? [
              { key: 'A', text: optA.trim() || 'Opsi A' },
              { key: 'B', text: optB.trim() || 'Opsi B' },
              { key: 'C', text: optC.trim() || 'Opsi C' },
              { key: 'D', text: optD.trim() || 'Opsi D' },
            ]
          : newQType === 'benar_salah'
          ? [
              { key: 'A', text: 'Benar' },
              { key: 'B', text: 'Salah' },
            ]
          : undefined,
      correct_answer: newQType === 'esai' ? essayAnswerKey.trim() : correctKey,
      explanation: 'Jawaban diverifikasi oleh guru pengajar.',
    };

    setQuizQuestions((prev) => [...prev, newQuestion]);
    setNewQText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setEssayAnswerKey('');
    showToast('Soal berhasil ditambahkan ke paket!', 'success');
  };

  const handleAddQuestionToBankDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim()) {
      showToast('Isi pertanyaan tidak boleh kosong.', 'error');
      return;
    }

    const createdQuestion: Question = {
      id: `q-bank-${Date.now()}`,
      subject_id: newQSubjectId,
      grade: 'VII',
      type: newQType,
      question_text: newQText.trim(),
      points: newQPoints,
      difficulty: newQDifficulty,
      options:
        newQType === 'pilihan_ganda'
          ? [
              { key: 'A', text: optA.trim() || 'Opsi A' },
              { key: 'B', text: optB.trim() || 'Opsi B' },
              { key: 'C', text: optC.trim() || 'Opsi C' },
              { key: 'D', text: optD.trim() || 'Opsi D' },
            ]
          : newQType === 'benar_salah'
          ? [
              { key: 'A', text: 'Benar' },
              { key: 'B', text: 'Salah' },
            ]
          : undefined,
      correct_answer: newQType === 'esai' ? essayAnswerKey.trim() : correctKey,
      explanation: 'Soal tersimpan di Bank Soal Sekolah.',
    };

    // Attach to the first quiz matching the subject or create/update
    const targetQuiz = quizzes.find((q) => q.subject_id === newQSubjectId) || quizzes[0];
    if (targetQuiz) {
      updateQuiz(targetQuiz.id, {
        questions: [...targetQuiz.questions, createdQuestion],
      });
      showToast('Butir soal baru berhasil disimpan ke Bank Soal!', 'success');
    } else {
      showToast('Butir soal berhasil ditambahkan ke repositori.', 'success');
    }

    setShowAddBankQuestionModal(false);
    setNewQText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setEssayAnswerKey('');
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Judul paket wajib diisi.', 'error');
      return;
    }
    if (quizQuestions.length === 0) {
      showToast('Minimal tambahkan 1 butir soal ke dalam paket.', 'error');
      return;
    }

    addQuiz({
      title: formData.title.trim(),
      type: isUjianView ? 'ujian' : isKuisView ? 'kuis' : formData.type,
      instructions: formData.instructions.trim() || 'Kerjakan dengan teliti dan jujur.',
      duration_minutes: formData.duration_minutes,
      passing_score: formData.passing_score,
      max_attempts: formData.max_attempts,
      randomize_questions: formData.randomize_questions,
      show_answers_after: formData.show_answers_after,
      class_id: formData.class_id,
      subject_id: formData.subject_id,
      teacher_id: currentUser?.id || 'usr-guru-1',
      start_time: formData.start_time,
      end_time: formData.end_time,
      status: 'active',
      questions: quizQuestions,
    });

    setShowAddModal(false);
    showToast(`Paket ${isUjianView ? 'Ujian CBT' : 'Kuis'} berhasil diterbitkan!`, 'success');
  };

  // ==========================================
  // VIEW 1: DEDICATED BANK SOAL INTERFACE
  // ==========================================
  if (isBankSoalView) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                <ClipboardList className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Bank Soal & Repositori Butir Ujian
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Koleksi butir soal pilihan ganda, benar/salah, dan esai terstandar untuk dirakit menjadi paket kuis dan ujian CBT.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddBankQuestionModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              Tambah Butir Soal
            </button>
          </div>
        </div>

        {/* Bank Soal Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 no-print">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Butir Soal</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{allBankQuestions.length}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pilihan Ganda</span>
            <p className="text-2xl font-black text-blue-700 mt-1">
              {allBankQuestions.filter((q) => q.type === 'pilihan_ganda').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Benar / Salah</span>
            <p className="text-2xl font-black text-emerald-700 mt-1">
              {allBankQuestions.filter((q) => q.type === 'benar_salah').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Soal Esai</span>
            <p className="text-2xl font-black text-purple-700 mt-1">
              {allBankQuestions.filter((q) => q.type === 'esai').length}
            </p>
          </div>
        </div>

        {/* Bank Filter Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3 no-print">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Filter Bank:
          </div>

          <select
            value={bankSubjectFilter}
            onChange={(e) => setBankSubjectFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
          >
            <option value="semua">Semua Mata Pelajaran</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>

          <select
            value={bankTypeFilter}
            onChange={(e) => setBankTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
          >
            <option value="semua">Semua Tipe Soal</option>
            <option value="pilihan_ganda">Pilihan Ganda (PG)</option>
            <option value="benar_salah">Benar / Salah</option>
            <option value="esai">Esai / Uraian</option>
          </select>

          <select
            value={bankDifficultyFilter}
            onChange={(e) => setBankDifficultyFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
          >
            <option value="semua">Semua Kesulitan</option>
            <option value="mudah">Tingkat Mudah</option>
            <option value="sedang">Tingkat Sedang</option>
            <option value="sulit">Tingkat Sulit (HOTS)</option>
          </select>

          <span className="ml-auto text-xs text-slate-400 font-medium">
            Menampilkan <strong>{filteredBankQuestions.length}</strong> butir soal
          </span>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredBankQuestions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
              Belum ada butir soal yang sesuai dengan filter. Klik tombol "Tambah Butir Soal".
            </div>
          ) : (
            filteredBankQuestions.map((q, idx) => {
              const sbj = subjects.find((s) => s.id === q.subject_id);

              return (
                <div
                  key={q.id || idx}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {sbj?.name || 'Mata Pelajaran'}
                      </span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded uppercase text-[10px] ${
                          q.type === 'pilihan_ganda'
                            ? 'bg-purple-50 text-purple-700'
                            : q.type === 'benar_salah'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {q.type.replace('_', ' ')}
                      </span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded uppercase text-[10px] ${
                          q.difficulty === 'mudah'
                            ? 'bg-emerald-100 text-emerald-800'
                            : q.difficulty === 'sulit'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {q.difficulty || 'sedang'}
                      </span>
                    </div>

                    <div className="font-bold text-slate-700">
                      Bobot: <span className="text-emerald-700 font-black">{q.points || 25} Poin</span>
                    </div>
                  </div>

                  {/* Question Text */}
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                    {q.question_text}
                  </p>

                  {/* Options */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                      {q.options.map((opt) => {
                        const isCorrect = opt.key === q.correct_answer;
                        return (
                          <div
                            key={opt.key}
                            className={`p-2.5 rounded-xl border flex items-center justify-between ${
                              isCorrect
                                ? 'bg-emerald-50/80 border-emerald-300 font-bold text-emerald-900'
                                : 'bg-slate-50/60 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span>
                              <strong>{opt.key}.</strong> {opt.text}
                            </span>
                            {isCorrect && (
                              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Kunci Jawaban
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Explanation & Key */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 flex items-start gap-2">
                    <span className="font-bold text-blue-700 shrink-0">Pembahasan / Kunci:</span>
                    <span className="flex-1">
                      Kunci: <strong>{q.correct_answer}</strong>. {q.explanation}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal: Tambah Soal ke Bank */}
        {showAddBankQuestionModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-black text-base text-slate-900">
                  Tambah Butir Soal Baru ke Bank Soal
                </h3>
                <button
                  onClick={() => setShowAddBankQuestionModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddQuestionToBankDirect} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran</label>
                    <select
                      value={newQSubjectId}
                      onChange={(e) => setNewQSubjectId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tingkat Kesulitan</label>
                    <select
                      value={newQDifficulty}
                      onChange={(e) => setNewQDifficulty(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    >
                      <option value="mudah">Mudah</option>
                      <option value="sedang">Sedang</option>
                      <option value="sulit">Sulit (HOTS)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tipe Butir Soal</label>
                    <select
                      value={newQType}
                      onChange={(e) => setNewQType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    >
                      <option value="pilihan_ganda">Pilihan Ganda (A-B-C-D)</option>
                      <option value="benar_salah">Benar / Salah</option>
                      <option value="esai">Esai / Uraian</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Bobot Poin</label>
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={newQPoints}
                      onChange={(e) => setNewQPoints(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teks Pertanyaan / Soal *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tuliskan butir soal atau stimulus bacaan..."
                    value={newQText}
                    onChange={(e) => setNewQText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                {newQType === 'pilihan_ganda' && (
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 block">Pilihan Jawaban & Kunci:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="radio"
                          name="optKeyBank"
                          checked={correctKey === 'A'}
                          onChange={() => setCorrectKey('A')}
                        />
                        <input
                          type="text"
                          placeholder="Opsi A..."
                          value={optA}
                          onChange={(e) => setOptA(e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="radio"
                          name="optKeyBank"
                          checked={correctKey === 'B'}
                          onChange={() => setCorrectKey('B')}
                        />
                        <input
                          type="text"
                          placeholder="Opsi B..."
                          value={optB}
                          onChange={(e) => setOptB(e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="radio"
                          name="optKeyBank"
                          checked={correctKey === 'C'}
                          onChange={() => setCorrectKey('C')}
                        />
                        <input
                          type="text"
                          placeholder="Opsi C..."
                          value={optC}
                          onChange={(e) => setOptC(e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="radio"
                          name="optKeyBank"
                          checked={correctKey === 'D'}
                          onChange={() => setCorrectKey('D')}
                        />
                        <input
                          type="text"
                          placeholder="Opsi D..."
                          value={optD}
                          onChange={(e) => setOptD(e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {newQType === 'esai' && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Pedoman Kunci Jawaban</label>
                    <input
                      type="text"
                      placeholder="Pedoman jawaban esai yang benar..."
                      value={essayAnswerKey}
                      onChange={(e) => setEssayAnswerKey(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddBankQuestionModal(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700"
                  >
                    Simpan ke Bank Soal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: KUIS INTERAKTIF & UJIAN ONLINE CBT
  // ==========================================
  const pageTitle = isUjianView
    ? 'Manajemen Ujian Online CBT Resmi (PTS & PAS)'
    : isKuisView
    ? 'Manajemen Kuis Interaktif & Formatif Harian'
    : 'Kuis & Ujian Online CBT (Computer-Based Test)';

  const pageSubtitle = isUjianView
    ? 'Pelaksanaan asesmen sumatif resmi dengan timer otomatis, auto-grade pilihan ganda, dan evaluasi hasil belajar.'
    : isKuisView
    ? 'Kuis latihan interaktif mandiri per bab materi untuk mengukur pemahaman peserta didik secara cepat.'
    : 'Sistem evaluasi pembelajaran berbasis komputer terpadu sekolah.';

  const actionButtonText = isUjianView
    ? 'Buat Paket Ujian CBT'
    : isKuisView
    ? 'Buat Kuis Baru'
    : 'Buat Paket CBT Baru';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className={`p-2 rounded-xl ${isUjianView ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {isUjianView ? <Award className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {pageTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{pageSubtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                type: isUjianView ? 'ujian' : 'kuis',
                duration_minutes: isUjianView ? 60 : 20,
              }));
              setShowAddModal(true);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-white rounded-xl text-xs font-bold shadow-md transition-all ${
              isUjianView
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            {actionButtonText}
          </button>
        </div>
      </div>

      {/* Quizzes / Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredQuizzes.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
            Belum ada paket {isUjianView ? 'ujian CBT' : 'kuis'}. Klik tombol "{actionButtonText}".
          </div>
        ) : (
          filteredQuizzes.map((qz) => {
            const cls = classes.find((c) => c.id === qz.class_id);
            const attempts = quizAttempts.filter((qa) => qa.quiz_id === qz.id);

            return (
              <div
                key={qz.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        qz.type === 'ujian'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {qz.type === 'ujian' ? 'Ujian CBT Resmi' : 'Kuis Interaktif'}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      Durasi: {qz.duration_minutes} Menit
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 mt-2.5 leading-snug">
                    {qz.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {qz.instructions}
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-3 gap-2 text-xs text-center">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Jumlah Soal</span>
                      <strong className="text-slate-800">{qz.questions.length} Butir</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">KKM Minimal</span>
                      <strong className="text-emerald-700">{qz.passing_score}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Siswa Ikut</span>
                      <strong className="text-indigo-700">{attempts.length} Siswa</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between no-print">
                  <button
                    onClick={() => setSelectedQuizForAttempts(qz)}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Hasil & Peserta ({attempts.length})
                  </button>
                  <button
                    onClick={() => deleteQuiz(qz.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Hapus Paket"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: View Attempts & Essay Grading */}
      {selectedQuizForAttempts && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase">
                  Hasil CBT Peserta Didik
                </span>
                <h3 className="font-black text-lg text-slate-900 mt-0.5">
                  {selectedQuizForAttempts.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuizForAttempts(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {quizAttempts.filter((a) => a.quiz_id === selectedQuizForAttempts.id).length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Belum ada peserta didik yang mengerjakan paket ini.
                </div>
              ) : (
                quizAttempts
                  .filter((a) => a.quiz_id === selectedQuizForAttempts.id)
                  .map((attempt) => {
                    const studentUser = users.find((u) => u.id === attempt.student_id);
                    const isPassed = attempt.total_score >= selectedQuizForAttempts.passing_score;

                    return (
                      <div
                        key={attempt.id}
                        className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-between gap-4 text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{studentUser?.name}</p>
                          <p className="text-slate-500 text-[11px]">
                            Diselesaikan: {attempt.submit_time} • Durasi: {Math.round(attempt.time_spent_seconds / 60)} Menit
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-bold">Total Nilai</span>
                            <span className={`text-lg font-black ${isPassed ? 'text-emerald-700' : 'text-rose-700'}`}>
                              {attempt.total_score}
                            </span>
                          </div>

                          <button
                            onClick={() => setGradingAttempt(attempt)}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            Koreksi Esai
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Grade Essay Details */}
      {gradingAttempt && selectedQuizForAttempts && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900">
                Koreksi Jawaban Peserta Didik
              </h3>
              <button onClick={() => setGradingAttempt(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedQuizForAttempts.questions.map((q, idx) => {
                const ans = gradingAttempt.answers.find((a) => a.question_id === q.id);

                return (
                  <div key={q.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Soal #{idx + 1} ({q.type})</span>
                      <span className="font-bold text-emerald-700">Maks. {q.points} Poin</span>
                    </div>
                    <p className="font-semibold text-slate-900">{q.question_text}</p>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Jawaban Siswa:</span>
                      <p className="font-medium text-slate-800 mt-0.5">{ans?.student_answer || '(Tidak dijawab)'}</p>
                    </div>

                    {q.type === 'esai' && (
                      <div className="flex items-center gap-2 pt-2">
                        <label className="font-bold text-slate-700">Input Nilai Guru:</label>
                        <input
                          type="number"
                          min={0}
                          max={q.points}
                          value={essayScoreInput}
                          onChange={(e) => setEssayScoreInput(Number(e.target.value))}
                          className="w-20 px-2.5 py-1 text-xs border border-slate-300 rounded-lg font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            gradeEssayAnswer(gradingAttempt.id, q.id, essayScoreInput, 'Koreksi guru selesai');
                            showToast('Nilai esai berhasil disimpan!', 'success');
                            setGradingAttempt(null);
                          }}
                          className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700"
                        >
                          Simpan Nilai
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Quiz / Exam */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900">
                {isUjianView ? 'Buat Paket Ujian Online CBT Resmi' : 'Buat Kuis Interaktif Baru'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul Paket *</label>
                <input
                  type="text"
                  required
                  placeholder={isUjianView ? 'Contoh: Penilaian Tengah Semester (PTS) CBT Matematika' : 'Contoh: Kuis Harian Bab 1'}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rombel Kelas</label>
                  <select
                    value={formData.class_id}
                    onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        Kelas {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Durasi Pengerjaan (Menit)</label>
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Petunjuk Pengerjaan</label>
                <textarea
                  rows={2}
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Ketik instruksi atau tata tertib pengerjaan..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Draft Questions List */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800">
                    Daftar Butir Soal ({quizQuestions.length} Soal)
                  </span>
                  <span className="text-[10px] text-slate-400">Total Poin: {quizQuestions.reduce((a, b) => a + (b.points || 0), 0)}</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {quizQuestions.map((q, idx) => (
                    <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                      <div className="truncate">
                        <span className="font-bold text-blue-700 mr-2">#{idx + 1}</span>
                        <span className="text-slate-800 font-medium">{q.question_text}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setQuizQuestions(quizQuestions.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-600 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Inline Question Creator */}
                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <span className="font-bold text-slate-700 block text-[11px]">Tambah Soal ke Paket:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newQType}
                      onChange={(e) => setNewQType(e.target.value as any)}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-xl bg-white"
                    >
                      <option value="pilihan_ganda">Pilihan Ganda (A-B-C-D)</option>
                      <option value="benar_salah">Benar / Salah</option>
                      <option value="esai">Esai</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Poin soal..."
                      value={newQPoints}
                      onChange={(e) => setNewQPoints(Number(e.target.value))}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Tuliskan teks pertanyaan soal..."
                    value={newQText}
                    onChange={(e) => setNewQText(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl bg-white"
                  />

                  {newQType === 'pilihan_ganda' && (
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        placeholder="Opsi A (Kunci)..."
                        value={optA}
                        onChange={(e) => setOptA(e.target.value)}
                        className="px-2.5 py-1 border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Opsi B..."
                        value={optB}
                        onChange={(e) => setOptB(e.target.value)}
                        className="px-2.5 py-1 border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Opsi C..."
                        value={optC}
                        onChange={(e) => setOptC(e.target.value)}
                        className="px-2.5 py-1 border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Opsi D..."
                        value={optD}
                        onChange={(e) => setOptD(e.target.value)}
                        className="px-2.5 py-1 border border-slate-200 rounded-lg"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleAddQuestionToDraft}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    + Masukkan Soal ke Daftar
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white rounded-xl font-bold shadow-md ${
                    isUjianView ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  Terbitkan Paket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
