import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import {
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
  Sparkles,
  RotateCcw,
  BookOpen,
  X,
  Search,
} from 'lucide-react';
import { Quiz, Question, QuizAttempt } from '../../types';

export const StudentExamCBT: React.FC = () => {
  const {
    currentUser,
    studentProfiles,
    classes,
    quizzes,
    quizAttempts,
    submitQuizAttempt,
    showToast,
    activeTab,
    setActiveTab,
  } = useApp();

  const currentProfile = studentProfiles.find((sp) => sp.user_id === currentUser?.id);
  const myClass = classes.find((c) => c.id === currentProfile?.class_id);

  // Active exam session state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [studentAnswers, setStudentAnswers] = useState<{ [qId: string]: string }>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [finishedAttemptResult, setFinishedAttemptResult] = useState<QuizAttempt | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter based on activeTab (kuis_murid vs ujian_murid)
  const isKuisMode = activeTab === 'kuis_murid';
  const isUjianMode = activeTab === 'ujian_murid';

  // Available quizzes for my class, filtered by active tab and search query
  const classQuizzes = quizzes.filter((q) => {
    if (q.class_id !== myClass?.id || q.status !== 'active') return false;
    if (isKuisMode && q.type !== 'kuis') return false;
    if (isUjianMode && q.type !== 'ujian') return false;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = q.title.toLowerCase().includes(query);
      const matchInstructions = q.instructions.toLowerCase().includes(query);
      if (!matchTitle && !matchInstructions) return false;
    }

    return true;
  });

  // Start exam session
  const startExam = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setStudentAnswers({});
    setSecondsRemaining(quiz.duration_minutes * 60);
    setShowConfirmModal(false);
    setFinishedAttemptResult(null);
  };

  // Countdown Timer
  useEffect(() => {
    if (!activeQuiz || secondsRemaining <= 0 || finishedAttemptResult) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, secondsRemaining, finishedAttemptResult]);

  const handleSelectAnswer = (questionId: string, answer: string) => {
    setStudentAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleFinalSubmit = (isTimeOut: boolean = false) => {
    if (!activeQuiz || !currentUser) return;

    const answersArray = activeQuiz.questions.map((q) => ({
      question_id: q.id,
      student_answer: studentAnswers[q.id] || '',
    }));

    const timeSpent = activeQuiz.duration_minutes * 60 - secondsRemaining;
    const attemptResult = submitQuizAttempt(
      activeQuiz.id,
      currentUser.id,
      answersArray,
      Math.max(timeSpent, 10)
    );

    setFinishedAttemptResult(attemptResult);
    setShowConfirmModal(false);

    // Trigger celebratory confetti if passed
    if (attemptResult.total_score >= activeQuiz.passing_score) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }

    if (isTimeOut) {
      showToast('Waktu ujian telah berakhir! Jawaban otomatis dikumpulkan.', 'info');
    } else {
      showToast('Ujian CBT berhasil diselesaikan dan dikumpulkan!', 'success');
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // If exam is currently active
  if (activeQuiz && !finishedAttemptResult) {
    const currentQ = activeQuiz.questions[currentQuestionIndex];
    const answeredCount = Object.keys(studentAnswers).filter((k) => studentAnswers[k]).length;
    const isWarningTime = secondsRemaining < 300; // < 5 minutes

    return (
      <div className="space-y-4 max-w-5xl mx-auto">
        {/* CBT Floating Header */}
        <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
              CBT — {activeQuiz.type}
            </span>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 line-clamp-1 mt-0.5">
              {activeQuiz.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-sm font-black border transition-all ${
                isWarningTime
                  ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-slate-900 text-white border-slate-800'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kumpulkan Jawaban</span>
            </button>
          </div>
        </div>

        {/* Main Exam Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Question Box */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                Soal Nomor {currentQuestionIndex + 1} dari {activeQuiz.questions.length}
              </span>
              <span className="text-xs font-bold text-slate-500">
                Bobot: {currentQ?.points} Poin
              </span>
            </div>

            {/* Question Text */}
            <div className="text-sm font-semibold text-slate-900 leading-relaxed">
              {currentQ?.question_text}
            </div>

            {/* Answer Options */}
            <div className="space-y-3 pt-2">
              {currentQ?.type === 'pilihan_ganda' &&
                currentQ.options?.map((opt) => {
                  const isChecked = studentAnswers[currentQ.id] === opt.key;
                  return (
                    <label
                      key={opt.key}
                      onClick={() => handleSelectAnswer(currentQ.id, opt.key)}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-300 font-bold text-blue-950'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center shrink-0 border ${
                          isChecked
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {opt.key}
                      </div>
                      <span className="leading-relaxed mt-0.5">{opt.text}</span>
                    </label>
                  );
                })}

              {currentQ?.type === 'benar_salah' && (
                <div className="grid grid-cols-2 gap-3">
                  {(['A', 'B'] as const).map((key) => {
                    const label = key === 'A' ? 'Benar' : 'Salah';
                    const isChecked = studentAnswers[currentQ.id] === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectAnswer(currentQ.id, key)}
                        className={`p-4 rounded-2xl border text-xs font-bold transition-all ${
                          isChecked
                            ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-300'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQ?.type === 'isian' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Jawaban Singkat Anda:</label>
                  <input
                    type="text"
                    placeholder="Ketik jawaban singkat atau angka..."
                    value={studentAnswers[currentQ.id] || ''}
                    onChange={(e) => handleSelectAnswer(currentQ.id, e.target.value)}
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl font-bold font-mono"
                  />
                </div>
              )}

              {currentQ?.type === 'esai' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Jawaban Esai Uraian Anda:</label>
                  <textarea
                    rows={6}
                    placeholder="Tuliskan uraian penjelasan dan langkah penyelesaian Anda secara lengkap..."
                    value={studentAnswers[currentQ.id] || ''}
                    onChange={(e) => handleSelectAnswer(currentQ.id, e.target.value)}
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl leading-relaxed"
                  />
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </button>

              <button
                type="button"
                disabled={currentQuestionIndex === activeQuiz.questions.length - 1}
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(prev + 1, activeQuiz.questions.length - 1)
                  )
                }
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold disabled:opacity-40"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Index Palette */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900">Navigasi Nomor Soal</h4>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Terjawab: {answeredCount}</span>
              <span>Sisa: {activeQuiz.questions.length - answeredCount}</span>
            </div>

            {/* Grid of question buttons */}
            <div className="grid grid-cols-5 gap-2 pt-2">
              {activeQuiz.questions.map((q, idx) => {
                const isCurrent = currentQuestionIndex === idx;
                const isAnswered = !!studentAnswers[q.id];

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-10 rounded-xl text-xs font-black transition-all border ${
                      isCurrent
                        ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300'
                        : isAnswered
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-4 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-600" />
                <span>Soal Sedang Aktif</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span>Sudah Dijawab</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-200" />
                <span>Belum Dijawab</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Confirm Submission */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Kumpulkan Ujian CBT?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Anda telah menjawab{' '}
                  <strong className="text-slate-900">
                    {answeredCount} dari {activeQuiz.questions.length} soal
                  </strong>
                  . Waktu yang tersisa {formatTimer(secondsRemaining)}.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
                >
                  Cek Ulang
                </button>
                <button
                  onClick={() => handleFinalSubmit(false)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Ya, Kumpulkan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If exam finished and showing results
  if (finishedAttemptResult && activeQuiz) {
    const isPassed = finishedAttemptResult.total_score >= activeQuiz.passing_score;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl text-center space-y-5">
          <div
            className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
              isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 uppercase">
              Hasil CBT Selesai
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">{activeQuiz.title}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Jawaban Anda telah tersimpan dengan aman di server sistem sekolah.
            </p>
          </div>

          {/* Score Display Card */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-3 text-center">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Nilai CBT</span>
              <strong className="text-3xl font-black text-slate-900">
                {finishedAttemptResult.total_score}
              </strong>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">KKM Minimal</span>
              <strong className="text-3xl font-black text-slate-700">{activeQuiz.passing_score}</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Status</span>
              <strong
                className={`text-sm block mt-2 font-black ${
                  isPassed ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {isPassed ? 'LULUS KKM' : 'REMIDIAL'}
              </strong>
            </div>
          </div>

          {/* Answers Review */}
          {activeQuiz.show_answers_after && (
            <div className="text-left space-y-3 pt-4 border-t border-slate-100">
              <h4 className="font-extrabold text-sm text-slate-900">Pembahasan Jawaban:</h4>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {activeQuiz.questions.map((q, idx) => {
                  const studentAns = finishedAttemptResult.answers.find((a) => a.question_id === q.id);
                  const isCorrect = studentAns?.is_correct;

                  return (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Soal #{idx + 1}</span>
                        <span
                          className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${
                            isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isCorrect ? 'Jawaban Tepat (+Poin)' : 'Jawaban Salah (0)'}
                        </span>
                      </div>
                      <p className="text-slate-800">{q.question_text}</p>
                      <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                        <p>
                          <strong>Jawaban Anda:</strong> {studentAns?.student_answer || '(Tidak dijawab)'}
                        </p>
                        <p className="text-emerald-700 font-semibold mt-0.5">
                          <strong>Kunci Benar:</strong> {q.correct_answer}
                        </p>
                        {q.explanation && (
                          <p className="text-slate-500 mt-1 italic text-[10px]">
                            Penjelasan: {q.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => {
                setActiveQuiz(null);
                setFinishedAttemptResult(null);
              }}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              Kembali ke Daftar Ujian
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default List of CBT Quizzes for Student
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                isKuisMode
                  ? 'bg-emerald-100 text-emerald-800'
                  : isUjianMode
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {isKuisMode ? 'Kuis Interaktif' : isUjianMode ? 'Ujian Online CBT' : 'Asesmen Siswa'}
            </span>
            <span className="text-xs font-bold text-slate-400">Kelas: {myClass?.name || 'VII'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            {isKuisMode
              ? 'Kuis & Latihan Interaktif Harian'
              : isUjianMode
              ? 'Ujian Online CBT (Computer-Based Test)'
              : 'Kuis & Ujian Online CBT'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isKuisMode
              ? 'Latihan mandiri untuk menguji pemahaman materi harian dengan hasil skor instan dan pembahasan lengkap.'
              : isUjianMode
              ? 'Penilaian Tengah Semester (PTS) dan Akhir Semester (PAS) terjadwal resmi dengan sistem pengatur waktu otomatis.'
              : 'Asesmen terjadwal dengan sistem timer resmi, navigasi soal dinamis, dan hasil evaluasi transparan.'}
          </p>
        </div>

        {/* Quick Mode Switcher & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kuis / ujian..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('kuis_murid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isKuisMode
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kuis Harian
            </button>
            <button
              onClick={() => setActiveTab('ujian_murid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isUjianMode
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ujian CBT (PTS/PAS)
            </button>
          </div>
        </div>
      </div>

      {/* Quizzes List */}
      {classQuizzes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-extrabold text-base text-slate-800">
              {isKuisMode
                ? 'Belum Ada Kuis Aktif untuk Kelas Ini'
                : 'Belum Ada Jadwal Ujian CBT Aktif'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Guru mata pelajaran belum mempublikasikan {isKuisMode ? 'kuis latihan baru' : 'jadwal ujian CBT'} untuk rombongan belajar Anda saat ini.
            </p>
          </div>
          <button
            onClick={() => setActiveTab(isKuisMode ? 'ujian_murid' : 'kuis_murid')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Lihat {isKuisMode ? 'Ujian CBT' : 'Kuis Harian'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {classQuizzes.map((qz) => {
            const myAttempts = quizAttempts.filter((qa) => qa.quiz_id === qz.id && qa.student_id === currentUser?.id);
            const hasAttempted = myAttempts.length > 0;
            const bestScore = hasAttempted ? Math.max(...myAttempts.map((a) => a.total_score)) : 0;

            return (
              <div
                key={qz.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        qz.type === 'ujian' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {qz.type === 'ujian' ? 'Ujian CBT Resmi (PTS/PAS)' : 'Kuis Harian Interaktif'}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      {qz.duration_minutes} Menit
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 mt-3 leading-snug">
                    {qz.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {qz.instructions}
                  </p>

                  <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-3 gap-2 text-xs text-center">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Jumlah Soal</span>
                      <strong className="text-slate-800">{qz.questions.length} Butir</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">KKM Minimal</span>
                      <strong className="text-emerald-700">{qz.passing_score}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Skor Terbaik</span>
                      <strong className="text-indigo-700">{hasAttempted ? bestScore : '-'}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {hasAttempted
                      ? `Sudah dikerjakan (${myAttempts.length}x)`
                      : 'Belum pernah dikerjakan'}
                  </span>
                  <button
                    onClick={() => startExam(qz)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                      qz.type === 'ujian'
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {hasAttempted ? 'Mulai Ujian Lagi' : 'Mulai Sesi CBT'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
