import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  Search,
  Plus,
  Download,
  Upload,
  KeyRound,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Filter,
  X,
  Phone,
  Mail,
  AlertCircle,
  Shield,
} from 'lucide-react';
import { Role, User, StudentProfile, TeacherProfile } from '../../types';
import { UserAvatar } from '../common/UserAvatar';

interface AdminUserManagementProps {
  initialRoleTab?: 'guru' | 'murid' | 'admin';
}

export const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ initialRoleTab = 'guru' }) => {
  const {
    users,
    studentProfiles,
    teacherProfiles,
    classes,
    addUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
    showToast,
    logAuditAction,
    systemSettings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'guru' | 'murid' | 'admin'>(initialRoleTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'semua' | 'aktif' | 'nonaktif'>('semua');
  const [classFilter, setClassFilter] = useState<string>('semua');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<User | null>(null);
  const [showResetModal, setShowResetModal] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<User | null>(null);

  // Form State for Adding
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    nipNis: '',
    nuptkNisn: '',
    gender: 'L' as 'L' | 'P',
    classId: 'cls-7a',
    specialization: 'Matematika',
    education: 'S1 Pendidikan',
    birthPlace: 'Jakarta',
    birthDate: '2013-05-10',
  });

  const filteredUsers = users.filter((u) => {
    if (u.role !== activeTab) return false;
    if (statusFilter !== 'semua' && u.status !== statusFilter) return false;

    // Class filter for students
    if (activeTab === 'murid' && classFilter !== 'semua') {
      const sp = studentProfiles.find((p) => p.user_id === u.id);
      if (sp?.class_id !== classFilter) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchUsername = u.username.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);

      let matchIdNumber = false;
      if (activeTab === 'guru') {
        const tp = teacherProfiles.find((p) => p.user_id === u.id);
        matchIdNumber = !!tp?.nip.toLowerCase().includes(q);
      } else if (activeTab === 'murid') {
        const sp = studentProfiles.find((p) => p.user_id === u.id);
        matchIdNumber = !!sp?.nis.toLowerCase().includes(q) || !!sp?.nisn.toLowerCase().includes(q);
      }

      return matchName || matchUsername || matchEmail || matchIdNumber;
    }

    return true;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.username) {
      showToast('Nama dan Username wajib diisi.', 'error');
      return;
    }

    // Check duplicate username
    if (users.some((u) => u.username.toLowerCase() === formData.username.trim().toLowerCase())) {
      showToast('Username sudah digunakan, silakan pilih yang lain.', 'error');
      return;
    }

    if (activeTab === 'admin') {
      addUser({
        name: formData.name,
        username: formData.username.trim(),
        email: formData.email || `${formData.username}@smpn1jaya.sch.id`,
        role: 'admin',
        phone: formData.phone || '0812000000',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      });
    } else if (activeTab === 'guru') {
      addUser(
        {
          name: formData.name,
          username: formData.username.trim(),
          email: formData.email || `${formData.username}@smpn1jaya.sch.id`,
          role: 'guru',
          phone: formData.phone || '08123456789',
        },
        {
          nip: formData.nipNis || `1985${Date.now().toString().slice(-8)}`,
          nuptk: formData.nuptkNisn,
          gender: formData.gender,
          specialization: formData.specialization,
          education: formData.education,
        }
      );
    } else {
      addUser(
        {
          name: formData.name,
          username: formData.username.trim(),
          email: formData.email || `${formData.username}@siswa.smpn1jaya.sch.id`,
          role: 'murid',
          phone: formData.phone || '0852000000',
        },
        {
          nis: formData.nipNis || `${Date.now().toString().slice(-6)}`,
          nisn: formData.nuptkNisn || `00${Date.now().toString().slice(-8)}`,
          class_id: formData.classId,
          gender: formData.gender,
          birth_place: formData.birthPlace,
          birth_date: formData.birthDate,
        }
      );
    }

    setShowAddModal(false);
    setFormData({
      name: '',
      username: '',
      email: '',
      phone: '',
      nipNis: '',
      nuptkNisn: '',
      gender: 'L',
      classId: 'cls-7a',
      specialization: 'Matematika',
      education: 'S1 Pendidikan',
      birthPlace: 'Jakarta',
      birthDate: '2013-05-10',
    });
  };

  const handleExportCSV = () => {
    let csvContent = 'ID,Username,Nama,Email,Role,Status,No_Identitas,Kelas_Keahlian\n';
    filteredUsers.forEach((u) => {
      let idNum = '';
      let extra = '';
      if (u.role === 'admin') {
        idNum = 'ADMINISTRATOR';
        extra = 'Akses Penuh Sistem';
      } else if (u.role === 'guru') {
        const tp = teacherProfiles.find((p) => p.user_id === u.id);
        idNum = tp ? `NIP: ${tp.nip}` : '';
        extra = tp?.specialization || '';
      } else {
        const sp = studentProfiles.find((p) => p.user_id === u.id);
        const cls = classes.find((c) => c.id === sp?.class_id);
        idNum = sp ? `NIS: ${sp.nis}` : '';
        extra = cls?.name || '';
      }
      csvContent += `"${u.id}","${u.username}","${u.name}","${u.email}","${u.role}","${u.status}","${idNum}","${extra}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `data_${activeTab}_smp_n_1_jaya.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Data ${activeTab} berhasil diekspor ke CSV!`, 'success');
  };

  const handleSimulateImport = () => {
    const randomId = Date.now().toString().slice(-4);
    if (activeTab === 'guru') {
      addUser(
        {
          name: `Guru Tamu ${randomId}, S.Pd.`,
          username: `guru_import_${randomId}`,
          email: `guru${randomId}@smpn1jaya.sch.id`,
          role: 'guru',
          phone: '08129999000',
        },
        {
          nip: `1989010120200${randomId}`,
          specialization: 'Seni Budaya',
          education: 'S1 Pendidikan Seni',
        }
      );
    } else {
      addUser(
        {
          name: `Siswa Baru ${randomId}`,
          username: `siswa_import_${randomId}`,
          email: `siswa${randomId}@siswa.smpn1jaya.sch.id`,
          role: 'murid',
          phone: '08529999000',
        },
        {
          nis: `247${randomId}`,
          nisn: `009${randomId}111`,
          class_id: 'cls-7b',
          gender: 'L',
        }
      );
    }
    showToast(`Impor CSV berhasil: 1 data ${activeTab} baru telah ditambahkan!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Pengguna Sekolah
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola kredensial akun, data profil, status aktif/nonaktif, dan penempatan rombel.
          </p>
        </div>

        {/* Role Toggle Switch */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('guru')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'guru'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Data Guru ({users.filter((u) => u.role === 'guru').length})
          </button>
          <button
            onClick={() => setActiveTab('murid')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'murid'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Data Murid ({users.filter((u) => u.role === 'murid').length})
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'admin'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            Data Admin ({users.filter((u) => u.role === 'admin').length})
          </button>
        </div>
      </div>

      {/* Action Toolbar: Search, Filters, Add, Import, Export */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={`Cari nama, username, email, atau ${activeTab === 'guru' ? 'NIP' : activeTab === 'murid' ? 'NIS' : 'admin'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'murid' && (
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="semua">Semua Rombel</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Kelas {c.name}
                </option>
              ))}
            </select>
          )}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="semua">Semua Status</option>
            <option value="aktif">Status: Aktif</option>
            <option value="nonaktif">Status: Nonaktif</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
            title="Ekspor Data Pengguna ke CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ekspor CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white shadow-md transition-all ${
              activeTab === 'guru'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : activeTab === 'admin'
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            Tambah {activeTab === 'guru' ? 'Guru' : activeTab === 'admin' ? 'Admin' : 'Murid'}
          </button>
        </div>
      </div>

      {/* Users Table / Printable Area */}
      <div className="print-area bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden print:border-none print:shadow-none">
        {/* Official Kop Surat for Print */}
        <div className="hidden print:block border-b-2 border-slate-900 pb-4 text-center mb-6">
          <div className="flex items-center justify-center gap-4">
            {systemSettings?.logoUrl ? (
              <img
                src={systemSettings.logoUrl}
                alt="Logo"
                className="w-14 h-14 object-contain rounded-xl p-0.5 bg-white border border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold shrink-0">
                <GraduationCap className="w-7 h-7" />
              </div>
            )}
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                Pemerintah Daerah Dinas Pendidikan & Kebudayaan
              </p>
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {systemSettings?.schoolName || systemSettings?.school_name || 'SMP N 1 JAYA'}
              </h1>
              <p className="text-[10px] text-slate-600">
                {systemSettings?.address || 'Jl. Pendidikan Mandiri No. 45, Kebayoran Baru, Jakarta Selatan'} • Telp: {systemSettings?.phone || '(021) 7890-1234'}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-300">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
              DAFTAR DATA {activeTab === 'guru' ? 'DEWAN GURU' : activeTab === 'murid' ? 'PESERTA DIDIK (SISWA)' : 'PENGELOLA ADMINISTRATOR'}
            </h2>
            <p className="text-[11px] text-slate-500">
              Tahun Ajaran 2026/2027 • Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">{activeTab === 'guru' ? 'NIP / NUPTK' : activeTab === 'murid' ? 'NIS / NISN' : 'Peran & Akses'}</th>
                <th className="py-3 px-4">{activeTab === 'guru' ? 'Spesialisasi' : activeTab === 'murid' ? 'Rombel Kelas' : 'Wewenang'}</th>
                <th className="py-3 px-4">Kontak</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada data pengguna yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const teacherProf = teacherProfiles.find((tp) => tp.user_id === u.id);
                  const studentProf = studentProfiles.find((sp) => sp.user_id === u.id);
                  const studentClass = classes.find((c) => c.id === studentProf?.class_id);

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            src={u.avatar}
                            name={u.name}
                            size="sm"
                            className="border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{u.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">@{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {activeTab === 'admin' ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                              <Shield className="w-3 h-3" />
                              Administrator
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5">Pengelola Sistem</p>
                          </div>
                        ) : activeTab === 'guru' ? (
                          <div>
                            <p className="font-semibold text-slate-800">{teacherProf?.nip || '-'}</p>
                            <p className="text-[10px] text-slate-400">NUPTK: {teacherProf?.nuptk || '-'}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-semibold text-slate-800">NIS: {studentProf?.nis || '-'}</p>
                            <p className="text-[10px] text-slate-400">NISN: {studentProf?.nisn || '-'}</p>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {activeTab === 'admin' ? (
                          <span className="text-slate-700 font-medium text-xs">
                            Akses Penuh Master
                          </span>
                        ) : activeTab === 'guru' ? (
                          <div>
                            <span className="font-semibold text-slate-800">
                              {teacherProf?.specialization || 'Umum'}
                            </span>
                            <p className="text-[10px] text-slate-400">{teacherProf?.education || '-'}</p>
                          </div>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-md font-bold text-blue-700 bg-blue-50 border border-blue-200">
                            Kelas {studentClass?.name || 'Belum Ada'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <p className="truncate max-w-[150px]">{u.email}</p>
                        <p className="text-[10px] text-slate-400">{u.phone || '-'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                            u.status === 'aktif'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                          title="Klik untuk ubah status akun"
                        >
                          {u.status === 'aktif' ? (
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-rose-600" />
                          )}
                          <span className="capitalize">{u.status}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setShowResetModal(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Reset Kata Sandi"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowEditModal(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit Data"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus Akun"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add User */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                Tambah {activeTab === 'guru' ? 'Guru Pengajar' : 'Peserta Didik (Murid)'} Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  placeholder={activeTab === 'guru' ? 'Misal: Ahmad Santoso, S.Pd.' : 'Misal: Muhammad Rizky'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Username Login *</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: ahmad_santoso"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Sekolah</label>
                  <input
                    type="email"
                    placeholder="nama@smpn1jaya.sch.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
                  <input
                    type="text"
                    placeholder="08123456789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {activeTab === 'admin' ? (
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Shield className="w-4 h-4 text-purple-700" />
                    <span>Akun Administrator Baru</span>
                  </div>
                  <p className="text-[11px] text-purple-700">
                    Administrator memiliki akses penuh ke manajemen pengguna, jadwal, kelas, audit log, dan pengaturan sistem.
                  </p>
                </div>
              ) : activeTab === 'guru' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NIP (Nomor Induk Pegawai)</label>
                      <input
                        type="text"
                        placeholder="198501012010..."
                        value={formData.nipNis}
                        onChange={(e) => setFormData({ ...formData, nipNis: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NUPTK (Opsional)</label>
                      <input
                        type="text"
                        placeholder="87457536..."
                        value={formData.nuptkNisn}
                        onChange={(e) => setFormData({ ...formData, nuptkNisn: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran Spesialisasi</label>
                    <input
                      type="text"
                      placeholder="Misal: Matematika, IPA Terpadu"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NIS (Nomor Induk Siswa) *</label>
                      <input
                        type="text"
                        required
                        placeholder="247005"
                        value={formData.nipNis}
                        onChange={(e) => setFormData({ ...formData, nipNis: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NISN</label>
                      <input
                        type="text"
                        placeholder="0098765432"
                        value={formData.nuptkNisn}
                        onChange={(e) => setFormData({ ...formData, nuptkNisn: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Penempatan Kelas / Rombel *</label>
                    <select
                      value={formData.classId}
                      onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                    >
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          Kelas {cls.name} (Jenjang {cls.grade})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

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
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-md"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit User */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Edit Data Pengguna</h3>
              <button
                onClick={() => setShowEditModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateUser(showEditModal.id, {
                  name: showEditModal.name,
                  email: showEditModal.email,
                  phone: showEditModal.phone,
                  status: showEditModal.status,
                });
                setShowEditModal(null);
              }}
              className="space-y-4 mt-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={showEditModal.name}
                  onChange={(e) => setShowEditModal({ ...showEditModal, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={showEditModal.email}
                  onChange={(e) => setShowEditModal({ ...showEditModal, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor Telepon</label>
                <input
                  type="text"
                  value={showEditModal.phone || ''}
                  onChange={(e) => setShowEditModal({ ...showEditModal, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Status Akun</label>
                <select
                  value={showEditModal.status}
                  onChange={(e) => setShowEditModal({ ...showEditModal, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="aktif">Aktif (Dapat Login)</option>
                  <option value="nonaktif">Nonaktif (Akses Dicegah)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-md"
                >
                  Perbarui
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reset Password */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Reset Kata Sandi Akun</h3>
              <p className="text-xs text-slate-500 mt-1">
                Kata sandi untuk <strong className="text-slate-800">{showResetModal.name}</strong> akan direset ke kata sandi default <code>123456</code>.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-700">
              Password Baru: <strong>123456</strong>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  logAuditAction('PASSWORD_RESET', `Reset kata sandi pengguna ${showResetModal.username}`);
                  showToast(`Kata sandi ${showResetModal.name} berhasil direset menjadi "123456"!`, 'success');
                  setShowResetModal(null);
                }}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Konfirmasi Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete User Confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Hapus Akun Pengguna?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Apakah Anda yakin ingin menghapus akun <strong className="text-slate-800">{showDeleteConfirm.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteUser(showDeleteConfirm.id);
                  setShowDeleteConfirm(null);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
