/**
 * SMP N 1 JAYA — Sistem Informasi E-Learning SMP
 * Aplikasi Web E-Learning Terpadu untuk Sekolah Menengah Pertama (Kelas VII, VIII, IX)
 * Role: Admin, Guru, Murid
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { LandingPage } from './components/public/LandingPage';
import { UserProfileView } from './components/common/UserProfileView';
import { DiscussionForum } from './components/common/DiscussionForum';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminUserManagement } from './components/admin/AdminUserManagement';
import { AdminClassManagement } from './components/admin/AdminClassManagement';
import { AdminSubjectManagement } from './components/admin/AdminSubjectManagement';
import { AdminTeacherAssignment } from './components/admin/AdminTeacherAssignment';
import { AdminScheduleManagement } from './components/admin/AdminScheduleManagement';
import { AdminAnnouncements } from './components/admin/AdminAnnouncements';
import { AdminReports } from './components/admin/AdminReports';
import { AdminAuditLogs } from './components/admin/AdminAuditLogs';
import { AdminSystemSettings } from './components/admin/AdminSystemSettings';

// Teacher Components
import { TeacherDashboard } from './components/guru/TeacherDashboard';
import { TeacherClasses } from './components/guru/TeacherClasses';
import { TeacherMaterials } from './components/guru/TeacherMaterials';
import { TeacherAssignments } from './components/guru/TeacherAssignments';
import { TeacherQuizzesExams } from './components/guru/TeacherQuizzesExams';
import { TeacherGrades } from './components/guru/TeacherGrades';
import { TeacherAttendance } from './components/guru/TeacherAttendance';

// Student Components
import { StudentDashboard } from './components/murid/StudentDashboard';
import { StudentSubjects } from './components/murid/StudentSubjects';
import { StudentAssignments } from './components/murid/StudentAssignments';
import { StudentExamCBT } from './components/murid/StudentExamCBT';
import { StudentGrades } from './components/murid/StudentGrades';
import { StudentGamification } from './components/murid/StudentGamification';
import { StudentSchedule } from './components/murid/StudentSchedule';

const AppContent: React.FC = () => {
  const { isLoggedIn, activeRole, activeTab } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If user navigated to public landing page or is logged out
  if (!isLoggedIn || activeTab === 'landing') {
    return (
      <>
        <LandingPage />
        <ToastContainer />
      </>
    );
  }

  // Render role-specific or shared views
  const renderMainContent = () => {
    // Shared global views
    if (activeTab === 'profil') return <UserProfileView />;

    // Admin Role Router
    if (activeRole === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'pengguna':
          return <AdminUserManagement initialRoleTab="guru" />;
        case 'guru':
          return <AdminUserManagement initialRoleTab="guru" />;
        case 'murid':
          return <AdminUserManagement initialRoleTab="murid" />;
        case 'admin':
          return <AdminUserManagement initialRoleTab="admin" />;
        case 'kelas':
          return <AdminClassManagement />;
        case 'mapel':
          return <AdminSubjectManagement />;
        case 'penugasan':
          return <AdminTeacherAssignment />;
        case 'jadwal':
          return <AdminScheduleManagement />;
        case 'pengumuman':
          return <AdminAnnouncements />;
        case 'laporan':
          return <AdminReports />;
        case 'audit':
          return <AdminAuditLogs />;
        case 'pengaturan':
          return <AdminSystemSettings />;
        default:
          return <AdminDashboard />;
      }
    }

    // Teacher Role Router
    if (activeRole === 'guru') {
      switch (activeTab) {
        case 'dashboard':
          return <TeacherDashboard />;
        case 'kelas_guru':
          return <TeacherClasses />;
        case 'materi':
          return <TeacherMaterials />;
        case 'tugas':
          return <TeacherAssignments />;
        case 'kuis':
        case 'ujian':
        case 'bank_soal':
          return <TeacherQuizzesExams />;
        case 'penilaian':
          return <TeacherGrades />;
        case 'presensi':
          return <TeacherAttendance />;
        case 'forum':
          return <DiscussionForum />;
        default:
          return <TeacherDashboard />;
      }
    }

    // Student Role Router
    if (activeRole === 'murid') {
      switch (activeTab) {
        case 'dashboard':
          return <StudentDashboard />;
        case 'mapel_murid':
        case 'materi_murid':
          return <StudentSubjects />;
        case 'tugas_murid':
          return <StudentAssignments />;
        case 'kuis_murid':
        case 'ujian_murid':
          return <StudentExamCBT />;
        case 'nilai_murid':
          return <StudentGrades />;
        case 'forum_murid':
          return <DiscussionForum />;
        case 'jadwal_murid':
          return <StudentSchedule />;
        case 'gamifikasi':
          return <StudentGamification />;
        default:
          return <StudentDashboard />;
      }
    }

    return <AdminDashboard />;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderMainContent()}</div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
