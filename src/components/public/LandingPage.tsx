import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Users,
  Layers,
  BookOpen,
  Award,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Sparkles,
  School,
  Lock,
  User,
  ChevronRight,
  Building2,
  Phone,
  Mail,
  MapPin,
  Quote,
} from 'lucide-react';
import { Role } from '../../types';
import { UserAvatar } from '../common/UserAvatar';

export const LandingPage: React.FC = () => {
  const { login, switchUserById, users, studentProfiles, teacherProfiles, classes, systemSettings } = useApp();
  const [selectedRoleTab, setSelectedRoleTab] = useState<Role>('murid');
  const [studentClassFilter, setStudentClassFilter] = useState<'semua' | 'VII' | 'VIII' | 'IX'>('semua');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!usernameInput.trim()) {
      setLoginError('Silakan masukkan username atau nama lengkap Anda.');
      return;
    }
    const success = login(usernameInput.trim(), passwordInput);
    if (!success) {
      setLoginError('Akun tidak ditemukan atau nonaktif. Periksa ejaan nama atau username.');
    }
  };

  const getFilteredUsers = () => {
    let list = users.filter((u) => u.role === selectedRoleTab);
    if (selectedRoleTab === 'murid' && studentClassFilter !== 'semua') {
      list = list.filter((u) => {
        const sp = studentProfiles.find((p) => p.user_id === u.id);
        const cls = classes.find((c) => c.id === sp?.class_id);
        return cls?.grade === studentClassFilter;
      });
    }
    return list;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/20 to-white flex flex-col justify-between">
      {/* Top Header */}
      <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {systemSettings.logoUrl ? (
              <img
                src={systemSettings.logoUrl}
                alt={systemSettings.schoolName || 'Logo SMP N 1 JAYA'}
                className="w-10 h-10 object-contain rounded-xl p-0.5 bg-white border border-slate-200 shadow-sm shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <span className="font-extrabold text-base sm:text-lg text-blue-900 tracking-tight truncate block max-w-[150px] xs:max-w-none">
                {systemSettings.shortName || systemSettings.schoolName || 'SMP N 1 JAYA'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 hidden sm:inline-block">
                Akreditasi {systemSettings.accreditation || 'A (Unggul)'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="#profil-sekolah"
              className="text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors hidden xs:inline-block"
            >
              Profil Sekolah
            </a>
            <a
              href="#login-portal"
              className="text-xs font-bold px-3.5 sm:px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
            >
              Masuk Sistem
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Text & Banner Image Showcase */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              {systemSettings.landingHeroBadge || '🚀 Platform E-Learning SMP N 1 JAYA Berbasis Kurikulum Merdeka'}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {systemSettings.landingHeroTitle || `Sistem Informasi Pembelajaran Terpadu ${systemSettings.schoolName || 'SMP N 1 JAYA'}`}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              {systemSettings.landingHeroSubtitle ||
                'Menghubungkan Administrator, Guru, dan Murid dalam satu ekosistem terpadu untuk kegiatan belajar mengajar online dan pendukung tatap muka di kelas VII, VIII, dan IX.'}
            </p>

            {/* School Hero Banner Image from Settings */}
            {(systemSettings.landingHeroImage || systemSettings.hero_image) && (
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-md group">
                <img
                  src={systemSettings.landingHeroImage || systemSettings.hero_image}
                  alt={systemSettings.schoolName || 'Banner SMP N 1 JAYA'}
                  className="w-full h-48 sm:h-60 object-cover group-hover:scale-101 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
                  <div className="flex items-center gap-3">
                    {systemSettings.logoUrl && (
                      <img
                        src={systemSettings.logoUrl}
                        alt="Logo"
                        className="w-11 h-11 object-contain rounded-xl bg-white p-1 shadow-md shrink-0 border border-white/50"
                      />
                    )}
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600/90 text-white uppercase tracking-wider mb-1 inline-block">
                        Gedung & Sekolah Digital SMP
                      </span>
                      <p className="text-sm sm:text-base font-black tracking-tight drop-shadow-sm">
                        {systemSettings.schoolName || 'SMP N 1 JAYA'}
                      </p>
                      <p className="text-[11px] text-blue-200 font-medium line-clamp-1 drop-shadow-sm italic">
                        "{systemSettings.tagline || 'Unggul dalam Prestasi, Berkarakter Luhur'}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* School Motto banner */}
            <div className="p-3.5 rounded-2xl bg-white border border-blue-100 shadow-xs flex items-center gap-3">
              <Building2 className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">{systemSettings.schoolName || 'SMP N 1 JAYA'}</p>
                <p className="text-[11px] text-slate-500 italic">Motto: "{systemSettings.tagline}"</p>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kelas VII, VIII & IX</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ujian CBT & Timer</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Multi-Format Materi</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Gamifikasi XP & Badge</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Forum & Presensi Siswa</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Rekap Nilai Otomatis</span>
              </div>
            </div>

            {/* Quick Stat Bar */}
            <div className="flex items-center gap-6 sm:gap-8 pt-4 border-t border-slate-200 text-center sm:text-left">
              <div>
                <p className="text-2xl font-black text-slate-900">3</p>
                <p className="text-xs text-slate-500 font-medium">Peran Pengguna</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-black text-slate-900">6</p>
                <p className="text-xs text-slate-500 font-medium">Rombel Belajar</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-black text-slate-900">10+</p>
                <p className="text-xs text-slate-500 font-medium">Mata Pelajaran</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-black text-slate-900">{systemSettings.npsn}</p>
                <p className="text-xs text-slate-500 font-medium">NPSN Sekolah</p>
              </div>
            </div>
          </div>

          {/* Right Login Portal Box */}
          <div id="login-portal" className="lg:col-span-5">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">Portal Masuk E-Learning</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Pilih role atau klik salah satu akun demo untuk langsung masuk ke sistem.
                </p>
              </div>

              {/* Role Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRoleTab('murid');
                    setStudentClassFilter('semua');
                  }}
                  className={`py-2 px-1 text-xs font-bold rounded-lg transition-all text-center ${
                    selectedRoleTab === 'murid'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="sm:hidden">Murid (18)</span>
                  <span className="hidden sm:inline">Murid (18 Siswa)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRoleTab('guru')}
                  className={`py-2 px-1 text-xs font-bold rounded-lg transition-all text-center ${
                    selectedRoleTab === 'guru'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="sm:hidden">Guru (4)</span>
                  <span className="hidden sm:inline">Guru (4 Guru)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRoleTab('admin')}
                  className={`py-2 px-1 text-xs font-bold rounded-lg transition-all text-center ${
                    selectedRoleTab === 'admin'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="sm:hidden">Admin (2)</span>
                  <span className="hidden sm:inline">Admin (2 Akun)</span>
                </button>
              </div>

              {/* Sub-filter for students by class */}
              {selectedRoleTab === 'murid' && (
                <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setStudentClassFilter('semua')}
                    className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                      studentClassFilter === 'semua'
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentClassFilter('VII')}
                    className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                      studentClassFilter === 'VII'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Kelas 7 (A & B)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentClassFilter('VIII')}
                    className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                      studentClassFilter === 'VIII'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Kelas 8 (A & B)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentClassFilter('IX')}
                    className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                      studentClassFilter === 'IX'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Kelas 9 (A & B)
                  </button>
                </div>
              )}

              {/* 1-Click Fast Login List with Smooth Scrolling (Di Roll) */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  <span>Pilih Akun Demo (Gulir / Scroll):</span>
                  <span className="text-[10px] text-blue-600 lowercase font-medium">
                    {getFilteredUsers().length} akun
                  </span>
                </div>

                <div className="max-h-60 sm:max-h-64 overflow-y-auto pr-1 space-y-1.5 rounded-2xl border border-slate-200/80 p-2 bg-slate-50/50">
                  {getFilteredUsers().map((u) => {
                    const studentProf = studentProfiles.find((sp) => sp.user_id === u.id);
                    const studentClass = classes.find((c) => c.id === studentProf?.class_id);
                    const teacherProf = teacherProfiles.find((tp) => tp.user_id === u.id);

                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => switchUserById(u.id)}
                        className="w-full flex items-center justify-between p-2 rounded-xl border border-slate-200/80 bg-white hover:border-blue-400 hover:bg-blue-50/60 transition-all text-left group shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <UserAvatar src={u.avatar} name={u.name} size="sm" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 truncate leading-tight">
                              {u.name}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                              <span className="font-mono text-slate-400 truncate">@{u.username}</span>
                              {studentClass && (
                                <span className="font-extrabold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700">
                                  {studentClass.name}
                                </span>
                              )}
                              {teacherProf && (
                                <span className="font-semibold text-emerald-700 truncate max-w-[110px]">
                                  {teacherProf.specialization}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Manual Form Login by Username OR Full Name */}
              <form onSubmit={handleManualLogin} className="space-y-3 pt-3 border-t border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Atau Masuk dengan Kredensial (Username / Nama):
                </p>
                {loginError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
                    {loginError}
                  </div>
                )}
                <div>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Username atau Nama Lengkap (cth: ahmad_fauzi / Ahmad Fauzi)..."
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      placeholder="Kata sandi (cth: 123456 / bebas untuk demo)..."
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Masuk Sekarang
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: PROFIL SEKOLAH & SAMBUTAN KEPALA SEKOLAH */}
      <section id="profil-sekolah" className="bg-white border-t border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            {systemSettings.logoUrl && (
              <img
                src={systemSettings.logoUrl}
                alt={systemSettings.schoolName || 'Logo SMP N 1 JAYA'}
                className="w-16 h-16 object-contain mx-auto rounded-2xl p-1.5 bg-white border border-slate-200 shadow-md"
              />
            )}
            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase inline-block">
                Profil Lembaga Pendidikan
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {systemSettings.schoolName || 'SMP N 1 JAYA'}
            </h2>
            <p className="text-sm text-slate-500 italic">
              "{systemSettings.tagline || 'Unggul dalam Prestasi, Berkarakter Luhur'}"
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sambutan Kepala Sekolah Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-blue-50/80 to-slate-50 p-6 sm:p-8 rounded-3xl border border-blue-100 shadow-xs space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={systemSettings.headmasterAvatar}
                  alt={systemSettings.headmasterName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
                />
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">{systemSettings.headmasterName}</h4>
                  <p className="text-xs text-blue-600 font-semibold">Kepala Sekolah</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">NIP. {systemSettings.headmasterNip}</p>
                </div>
              </div>

              <div className="relative pt-2">
                <Quote className="w-8 h-8 text-blue-200 absolute -top-1 -left-2 -z-0 opacity-40" />
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic relative z-10">
                  "{systemSettings.headmasterMessage}"
                </p>
              </div>
            </div>

            {/* Visi dan Misi */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider">Visi Sekolah</h4>
                <p className="text-base font-bold text-slate-800 leading-snug">
                  "{systemSettings.vision}"
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider">Misi Sekolah</h4>
                <div className="space-y-2.5">
                  {(systemSettings.mission || []).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Alamat Sekolah SMP</p>
                <p className="text-slate-500 text-[11px] mt-0.5">{systemSettings.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <Phone className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Telepon Resmi</p>
                <p className="text-slate-500 text-[11px] mt-0.5">{systemSettings.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <Mail className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Email Sekolah</p>
                <p className="text-slate-500 text-[11px] mt-0.5">{systemSettings.email}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 {systemSettings.schoolName || 'SMP N 1 JAYA'} — {systemSettings.tagline || 'Unggul dalam Prestasi, Berkarakter Luhur'}</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Platform E-Learning SMP Berbasis Web</span>
            <span>•</span>
            <span>Kurikulum Merdeka Indonesia</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
