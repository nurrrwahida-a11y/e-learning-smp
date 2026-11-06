import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Layers,
  BookOpen,
  UserPlus,
  Calendar,
  Megaphone,
  BarChart3,
  FileText,
  HelpCircle,
  Award,
  MessageSquare,
  Clock,
  ClipboardList,
  ShieldCheck,
  Settings,
  UserCheck,
  FileSpreadsheet,
  X,
  Sparkles,
  BookmarkCheck,
  LogOut,
  GraduationCap,
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    activeRole,
    activeTab,
    setActiveTab,
    currentUser,
    systemSettings,
    logout,
    submissions,
    assignments,
    studentProfiles,
  } = useApp();

  // Dynamic school title from settings
  const schoolTitle = systemSettings?.shortName || systemSettings?.schoolName || systemSettings?.school_name || 'SMP N 1 JAYA';

  // Calculate dynamic badges SYNCHRONIZED with role & class
  const currentStudentProfile = studentProfiles.find((sp) => sp.user_id === currentUser?.id);

  // For teacher: count pending submissions only for assignments taught by this teacher
  const myTeacherAssignmentIds = assignments.filter((a) => a.teacher_id === currentUser?.id).map((a) => a.id);
  const pendingToGrade = submissions.filter(
    (s) => myTeacherAssignmentIds.includes(s.assignment_id) && (s.status === 'submitted' || s.status === 'late')
  ).length;

  // For student: strictly count unsubmitted assignments belonging to THIS student's class
  const pendingStudentTasks = assignments.filter((a) => {
    if (a.class_id !== currentStudentProfile?.class_id) return false;
    const isSubmitted = submissions.some((s) => s.assignment_id === a.id && s.student_id === currentUser?.id);
    return !isSubmitted;
  }).length;

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleLogout = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
    logout();
  };

  // Admin Navigation with unified "Manajemen Pengguna"
  const adminNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
    { id: 'pengguna', label: 'Manajemen Pengguna', icon: Users },
    { id: 'kelas', label: 'Manajemen Kelas', icon: Layers },
    { id: 'mapel', label: 'Mata Pelajaran', icon: BookOpen },
    { id: 'penugasan', label: 'Penugasan Guru', icon: UserPlus },
    { id: 'jadwal', label: 'Jadwal Pelajaran', icon: Calendar },
    { id: 'pengumuman', label: 'Pengumuman Sekolah', icon: Megaphone },
    { id: 'laporan', label: 'Laporan & Rekap', icon: BarChart3 },
    { id: 'audit', label: 'Riwayat Audit Log', icon: ShieldCheck },
    { id: 'pengaturan', label: 'Pengaturan Sistem', icon: Settings },
  ];

  const guruNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard Guru', icon: LayoutDashboard },
    { id: 'kelas_guru', label: 'Kelas Saya', icon: Layers },
    { id: 'materi', label: 'Materi Pembelajaran', icon: BookOpen },
    { id: 'tugas', label: 'Manajemen Tugas', icon: FileText, badge: pendingToGrade > 0 ? `${pendingToGrade} Perlu Nilai` : undefined, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'kuis', label: 'Kuis Interaktif', icon: HelpCircle },
    { id: 'bank_soal', label: 'Bank Soal', icon: ClipboardList },
    { id: 'ujian', label: 'Ujian Online CBT', icon: Award },
    { id: 'penilaian', label: 'Rekap Nilai Siswa', icon: FileSpreadsheet },
    { id: 'presensi', label: 'Presensi Siswa', icon: Clock },
    { id: 'forum', label: 'Forum Diskusi', icon: MessageSquare },
  ];

  const muridNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard Murid', icon: LayoutDashboard },
    { id: 'materi_murid', label: 'Materi Belajar', icon: BookOpen },
    { id: 'tugas_murid', label: 'Tugas Saya', icon: FileText, badge: pendingStudentTasks > 0 ? `${pendingStudentTasks} Belum` : undefined, badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'kuis_murid', label: 'Kuis & Latihan', icon: HelpCircle },
    { id: 'ujian_murid', label: 'Ujian CBT', icon: Award },
    { id: 'nilai_murid', label: 'Nilai Saya', icon: FileSpreadsheet },
    { id: 'forum_murid', label: 'Forum Tanya Jawab', icon: MessageSquare },
    { id: 'jadwal_murid', label: 'Jadwal & Kalender', icon: Calendar },
    { id: 'gamifikasi', label: 'Lencana & Prestasi', icon: Sparkles, badge: `${currentStudentProfile?.points || 0} XP`, badgeColor: 'bg-indigo-100 text-indigo-800' },
  ];

  const currentNav = activeRole === 'admin' ? adminNav : activeRole === 'guru' ? guruNav : muridNav;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header in Sidebar with Dynamic School Name */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5 min-w-0">
            {systemSettings?.logoUrl ? (
              <img
                src={systemSettings.logoUrl}
                alt="Logo"
                className="w-7 h-7 object-contain rounded-lg p-0.5 bg-white border border-slate-200 shrink-0"
              />
            ) : (
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  activeRole === 'admin'
                    ? 'bg-blue-600'
                    : activeRole === 'guru'
                    ? 'bg-emerald-600'
                    : 'bg-indigo-600'
                }`}
              />
            )}
            <div className="truncate">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 block truncate">
                {schoolTitle}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Panel {activeRole === 'admin' ? 'Administrator' : activeRole === 'guru' ? 'Dewan Guru' : 'Siswa SMP'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            title="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card at Top Before Menu Utama */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/60">
          <div
            onClick={() => handleNavClick('profil')}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
              activeTab === 'profil'
                ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-400/30'
                : 'bg-white hover:bg-slate-100/80 border-slate-200/80 shadow-2xs'
            }`}
            title="Buka Profil & Pengaturan Akun"
          >
            <UserAvatar
              src={currentUser?.avatar}
              name={currentUser?.name}
              size="sm"
              className="border-2 border-white shadow-2xs shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                {currentUser?.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                    activeRole === 'admin'
                      ? 'bg-blue-100 text-blue-700'
                      : activeRole === 'guru'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {currentUser?.role}
                </span>
                {activeRole === 'murid' && currentStudentProfile && (
                  <span className="text-[10px] font-bold text-indigo-600">
                    {currentStudentProfile.points} XP
                  </span>
                )}
              </div>
            </div>
            <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Utama
          </p>
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? activeRole === 'admin'
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : activeRole === 'guru'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Section: Only Logout */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/70 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80 transition-colors shadow-2xs"
            title="Keluar dari sistem"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Keluar (Logout)</span>
          </button>

          {/* Academic Year Info Footer */}
          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
            <span>T.A. 2026/2027 Ganjil</span>
            <span className="font-semibold text-slate-600">SMP (VII, VIII, IX)</span>
          </div>
        </div>
      </aside>
    </>
  );
};
