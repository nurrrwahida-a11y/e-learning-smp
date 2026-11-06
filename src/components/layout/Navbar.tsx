import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Bell,
  Menu,
  Settings,
  Search,
  BookOpen,
  FileText,
  Award,
  Layers,
  Users,
  X,
  ArrowRight,
  Megaphone,
  MessageSquare,
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    activeRole,
    systemSettings,
    notifications,
    markNotificationRead,
    setActiveTab,
    activeTab,
    subjects,
    lessons,
    assignments,
    quizzes,
    users,
    announcements,
    discussions,
  } = useApp();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setShowSearchModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const schoolTitle = systemSettings?.shortName || systemSettings?.schoolName || systemSettings?.school_name || 'SMP N 1 JAYA';
  const schoolSubtitle = `${systemSettings?.schoolName || 'SMP N 1 JAYA'} • Portal Pembelajaran`;

  // Automatic Real-Time Search Results Calculation
  const q = searchQuery.toLowerCase().trim();
  const searchResults = q
    ? [
        ...subjects
          .filter((s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q)))
          .map((s) => ({
            id: s.id,
            title: s.name,
            subtitle: `Mata Pelajaran (${s.code})`,
            type: 'mapel',
            icon: BookOpen,
            tab: activeRole === 'murid' ? 'materi_murid' : activeRole === 'guru' ? 'materi' : 'mapel',
          })),
        ...lessons
          .filter((l) => l.title.toLowerCase().includes(q) || l.chapter.toLowerCase().includes(q) || (l.description && l.description.toLowerCase().includes(q)) || (l.content_text && l.content_text.toLowerCase().includes(q)))
          .map((l) => ({
            id: l.id,
            title: l.title,
            subtitle: `Materi • ${l.chapter}`,
            type: 'materi',
            icon: BookOpen,
            tab: activeRole === 'murid' ? 'materi_murid' : 'materi',
          })),
        ...assignments
          .filter((a) => a.title.toLowerCase().includes(q) || a.chapter.toLowerCase().includes(q) || (a.instructions && a.instructions.toLowerCase().includes(q)))
          .map((a) => ({
            id: a.id,
            title: a.title,
            subtitle: `Tugas • ${a.chapter} (Tenggat: ${a.due_date})`,
            type: 'tugas',
            icon: FileText,
            tab: activeRole === 'murid' ? 'tugas_murid' : 'tugas',
          })),
        ...quizzes
          .filter((qz) => qz.title.toLowerCase().includes(q) || (qz.instructions && qz.instructions.toLowerCase().includes(q)) || qz.type.toLowerCase().includes(q))
          .map((qz) => ({
            id: qz.id,
            title: qz.title,
            subtitle: `${qz.type === 'ujian' ? 'Ujian Online CBT' : 'Kuis Harian'} • ${qz.duration_minutes} Menit`,
            type: 'kuis',
            icon: Award,
            tab:
              activeRole === 'murid'
                ? qz.type === 'ujian'
                  ? 'ujian_murid'
                  : 'kuis_murid'
                : 'kuis',
          })),
        ...announcements
          .filter((anc) => anc.title.toLowerCase().includes(q) || anc.content.toLowerCase().includes(q))
          .map((anc) => ({
            id: anc.id,
            title: anc.title,
            subtitle: `Pengumuman • Oleh ${anc.author_name}`,
            type: 'pengumuman',
            icon: Megaphone,
            tab: activeRole === 'admin' ? 'pengumuman' : 'dashboard',
          })),
        ...discussions
          .filter((disc) => disc.title.toLowerCase().includes(q) || disc.content.toLowerCase().includes(q))
          .map((disc) => ({
            id: disc.id,
            title: disc.title,
            subtitle: `Forum Diskusi • ${(disc.replies || []).length} Balasan`,
            type: 'forum',
            icon: MessageSquare,
            tab: activeRole === 'murid' ? 'forum_murid' : 'forum',
          })),
        ...(activeRole === 'admin'
          ? users
              .filter((u) => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.role.toLowerCase().includes(q))
              .map((u) => ({
                id: u.id,
                title: u.name,
                subtitle: `Pengguna (${u.role.toUpperCase()}) • @${u.username}`,
                type: 'pengguna',
                icon: Users,
                tab: 'pengguna',
              }))
          : []),
      ].slice(0, 12)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Left: Mobile hamburger & Dynamic School Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none transition-colors"
            title="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            {systemSettings?.logoUrl ? (
              <img
                src={systemSettings.logoUrl}
                alt="Logo"
                className="w-10 h-10 object-contain rounded-xl p-0.5 bg-white border border-slate-200 shadow-sm shrink-0 group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">
                  {schoolTitle}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase tracking-wider shrink-0 hidden xs:inline-block">
                  v2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium truncate max-w-xs">
                {schoolSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right Tools: Pencarian, Pengaturan (for Admin), Notifications & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Interactive Search Button */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors border border-slate-200/70"
            title="Cari Materi, Tugas, Kuis, atau Mapel (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="hidden md:inline font-medium">Pencarian...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-white rounded border border-slate-300 text-slate-500">
              Ctrl+K
            </kbd>
          </button>

          {/* Pengaturan Sistem button for Admin */}
          {activeRole === 'admin' && (
            <button
              onClick={() => setActiveTab('pengaturan')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                activeTab === 'pengaturan'
                  ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                  : 'text-slate-600 hover:bg-slate-100 border-slate-200'
              }`}
              title="Pengaturan Profil Sekolah & Landing Page"
            >
              <Settings className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="hidden md:inline">Pengaturan</span>
            </button>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-scale-up">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-800">Notifikasi Pembelajaran</h4>
                  <span className="text-xs text-blue-600 font-medium">
                    {unreadCount} Baru
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">Belum ada notifikasi</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.target_tab) setActiveTab(notif.target_tab);
                          setShowNotifDropdown(false);
                        }}
                        className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                          !notif.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="font-bold text-slate-800 flex items-center justify-between">
                          <span>{notif.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {notif.created_at.substring(11, 16)}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1 line-clamp-2">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile in Top Corner: Only Name and Role */}
          <div
            onClick={() => setActiveTab('profil')}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer select-none"
            title="Klik untuk membuka Profil Pengguna"
          >
            <UserAvatar
              src={currentUser?.avatar}
              name={currentUser?.name}
              size="sm"
              className="border border-blue-200 shrink-0"
            />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[130px] lg:max-w-[160px]">
                {currentUser?.name}
              </div>
              <span
                className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full inline-block uppercase tracking-wider ${
                  activeRole === 'admin'
                    ? 'bg-blue-100 text-blue-700'
                    : activeRole === 'guru'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {currentUser?.role === 'admin' ? 'ADMIN' : currentUser?.role === 'guru' ? 'GURU' : 'MURID'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Interactive Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-start justify-center pt-16 px-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <Search className="w-5 h-5 text-blue-600 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Cari materi, tugas, kuis, ujian, mapel, atau pengguna..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setShowSearchModal(false)}
                className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg"
              >
                ESC
              </button>
            </div>

            {/* Search Results List */}
            <div className="p-3 max-h-80 overflow-y-auto divide-y divide-slate-100">
              {!searchQuery.trim() ? (
                <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                  <p>Ketik kata kunci untuk mencari seluruh konten e-learning.</p>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[11px]">Matematika</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[11px]">IPA</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[11px]">Tugas</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[11px]">CBT</span>
                  </div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Tidak ditemukan hasil untuk "{searchQuery}".
                </div>
              ) : (
                searchResults.map((res) => {
                  const Icon = res.icon;
                  return (
                    <div
                      key={res.id}
                      onClick={() => {
                        setActiveTab(res.tab);
                        setShowSearchModal(false);
                        setSearchQuery('');
                      }}
                      className="p-3 rounded-xl hover:bg-blue-50/70 cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-600 flex items-center justify-center shrink-0 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-900 truncate">
                            {res.title}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">{res.subtitle}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
