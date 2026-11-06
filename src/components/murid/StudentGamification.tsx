import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Award,
  Sparkles,
  BookCheck,
  Timer,
  CheckCircle,
  Star,
  Flame,
  ShieldCheck,
  Target,
} from 'lucide-react';

export const StudentGamification: React.FC = () => {
  const { currentUser, studentProfiles, badges, users, classes } = useApp();

  const currentProfile = studentProfiles.find((sp) => sp.user_id === currentUser?.id);
  const myClass = classes.find((c) => c.id === currentProfile?.class_id);

  const points = currentProfile?.points || 0;
  const level = Math.floor(points / 200) + 1;
  const nextLevelXp = level * 200;
  const progressInLevel = Math.round(((points % 200) / 200) * 100);

  // Leaderboard in the same class
  const classLeaderboard = studentProfiles
    .filter((sp) => sp.class_id === myClass?.id)
    .sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Lencana Prestasi & Gamifikasi Belajar
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Kumpulkan poin XP dan lencana penghargaan dengan menyelesaikan materi dan kuis tepat waktu.
        </p>
      </div>

      {/* Main Level Progress Card */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/20 text-white uppercase tracking-wider backdrop-blur-md">
            Tingkat Prestasi Siswa
          </span>
          <h3 className="text-2xl sm:text-3xl font-black mt-2">
            Level {level}: {level >= 3 ? 'Bintang Cendekia' : 'Pelajar Berbakat'}
          </h3>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
            Tuntaskan 1 materi lagi atau selesaikan kuis harian untuk naik ke Level {level + 1}!
          </p>

          {/* Level Progress Bar */}
          <div className="mt-5 max-w-md">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span>{points} Total XP</span>
              <span>{nextLevelXp} XP (Level {level + 1})</span>
            </div>
            <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-white h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressInLevel}%` }}
              />
            </div>
          </div>
        </div>

        <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 shadow-lg">
          <Trophy className="w-12 h-12 text-white drop-shadow-md" />
        </div>
      </div>

      {/* Grid: Badges Showcase & Class Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Badges Collection */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Galeri Lencana Penghargaan</h3>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {currentProfile?.badges.length || 0} dari {badges.length} Diraih
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {badges.map((b) => {
              const isEarned = currentProfile?.badges.includes(b.id);

              return (
                <div
                  key={b.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    isEarned
                      ? 'bg-gradient-to-br from-indigo-50/70 to-blue-50/50 border-indigo-200 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 opacity-60'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 font-bold shadow-md bg-gradient-to-tr ${
                      isEarned ? b.color : 'from-slate-400 to-slate-500'
                    }`}
                  >
                    {b.id === 'badge-1' && <Sparkles className="w-5 h-5" />}
                    {b.id === 'badge-2' && <BookCheck className="w-5 h-5" />}
                    {b.id === 'badge-3' && <Trophy className="w-5 h-5" />}
                    {b.id === 'badge-4' && <Timer className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-xs text-slate-900">{b.title}</h4>
                      {isEarned && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                          Diraih
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Friendly Class Leaderboard */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Peringkat Kelas {myClass?.name}</h3>
            </div>
            <span className="text-[11px] font-bold text-indigo-600">Top Pelajar</span>
          </div>

          <div className="space-y-2.5">
            {classLeaderboard.map((sp, idx) => {
              const u = users.find((user) => user.id === sp.user_id);
              const isMe = sp.user_id === currentUser?.id;

              return (
                <div
                  key={sp.user_id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    isMe
                      ? 'bg-indigo-50/80 border-indigo-300 font-bold'
                      : 'bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] shrink-0 ${
                        idx === 0
                          ? 'bg-amber-400 text-white'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-700'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="truncate text-slate-900">
                      {u?.name} {isMe && '(Anda)'}
                    </span>
                  </div>
                  <span className="font-mono font-black text-indigo-700 shrink-0">
                    {sp.points} XP
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[10px] text-slate-500 text-center leading-relaxed">
            Gamifikasi didesain untuk memicu motivasi belajar positif dan keaktifan murid di kelas tanpa mendiskriminasi.
          </div>
        </div>
      </div>
    </div>
  );
};
