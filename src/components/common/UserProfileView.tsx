import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  ShieldCheck,
  KeyRound,
  Phone,
  Mail,
  GraduationCap,
  Camera,
  CheckCircle2,
  Lock,
  Sparkles,
  Save,
  Upload,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const {
    currentUser,
    activeRole,
    studentProfiles,
    teacherProfiles,
    classes,
    updateUser,
    showToast,
    logAuditAction,
    setActiveTab,
  } = useApp();

  const currentStudent = studentProfiles.find((sp) => sp.user_id === currentUser?.id);
  const currentTeacher = teacherProfiles.find((tp) => tp.user_id === currentUser?.id);
  const myClass = classes.find((c) => c.id === currentStudent?.class_id);

  // Profile fields state
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [phoneInput, setPhoneInput] = useState(currentUser?.phone || '');
  const [emailInput, setEmailInput] = useState(currentUser?.email || '');
  const [bioInput, setBioInput] = useState(currentUser?.bio || '');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.avatar || '');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Role-specific avatar presets
  const studentAvatarPresets = [
    {
      label: 'Siswa Putra SMP 1',
      url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
    },
    {
      label: 'Siswi Putri SMP 1',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
    },
    {
      label: 'Siswa Putra SMP 2',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    },
    {
      label: 'Siswi Putri SMP 2',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    },
    {
      label: 'Siswa Putra Ceria',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    },
    {
      label: 'Siswi Putri Senyum',
      url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    },
  ];

  const teacherAvatarPresets = [
    {
      label: 'Guru Wanita Formal',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    },
    {
      label: 'Guru Pria Formal',
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    },
    {
      label: 'Guru Pengajar Sains',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    },
    {
      label: 'Guru Matematika',
      url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
    },
    {
      label: 'Guru Bahasa & Seni',
      url: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=200',
    },
    {
      label: 'Guru Olahraga PJOK',
      url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
    },
  ];

  const adminAvatarPresets = [
    {
      label: 'Admin Eksekutif',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    },
    {
      label: 'Admin Kepala Tata Usaha',
      url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
    },
    {
      label: 'Admin Operator IT',
      url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200',
    },
    {
      label: 'Admin Sistem Sekolah',
      url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200',
    },
  ];

  const currentRolePresets =
    activeRole === 'murid'
      ? studentAvatarPresets
      : activeRole === 'guru'
      ? teacherAvatarPresets
      : adminAvatarPresets;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!nameInput.trim()) {
      showToast('Nama lengkap tidak boleh kosong.', 'error');
      return;
    }

    updateUser(currentUser.id, {
      name: nameInput.trim(),
      phone: phoneInput.trim(),
      email: emailInput.trim(),
      bio: bioInput.trim(),
      avatar: selectedAvatar, // saves either uploaded photo data, URL, or empty string '' for empty PP
    });

    logAuditAction('PROFILE_UPDATE', `Pengguna ${currentUser.name} memperbarui data profil & foto.`);
    showToast('Profil Anda berhasil diperbarui!', 'success');
  };

  const handleApplyCustomUrl = () => {
    if (!customAvatarUrl.trim()) return;
    setSelectedAvatar(customAvatarUrl.trim());
    setCustomAvatarUrl('');
    showToast('Foto profil baru diterapkan!', 'info');
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        showToast('Ukuran gambar maksimal 3 MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedAvatar(reader.result);
          showToast(`Foto "${file.name}" berhasil dimuat! Klik Simpan Perubahan Profil untuk menyimpan.`, 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetEmptyAvatar = () => {
    setSelectedAvatar('');
    showToast('Foto profil diubah menjadi PP Kosong (Default Polos).', 'info');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Profil & Pengaturan Akun
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Ubah foto profil sesuai peran Anda ({activeRole === 'admin' ? 'Administrator' : activeRole === 'guru' ? 'Bapak/Ibu Guru' : 'Siswa SMP'}), perbarui identitas, dan atur kata sandi.
        </p>
      </div>

      {/* Main Profile Info Card with Live Avatar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="relative group shrink-0">
          {selectedAvatar ? (
            <img
              src={selectedAvatar}
              alt={currentUser?.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-lg ring-1 ring-slate-200"
              onError={() => setSelectedAvatar('')}
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-slate-200 to-slate-100 border-4 border-white shadow-lg ring-1 ring-slate-200 flex flex-col items-center justify-center text-slate-400 select-none">
              <User className="w-12 h-12 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">PP Kosong</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="absolute -bottom-2 -right-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-md border-2 border-white transition flex items-center justify-center"
            title="Ubah Foto Profil"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 truncate">
              {currentUser?.name}
            </h3>
            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                activeRole === 'admin'
                  ? 'bg-purple-100 text-purple-800'
                  : activeRole === 'guru'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              Peran: {currentUser?.role}
            </span>
          </div>

          <p className="text-xs font-mono text-slate-500">
            Username: <strong>@{currentUser?.username}</strong> • Email: {currentUser?.email}
          </p>

          {activeRole === 'murid' && currentStudent && (
            <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
              <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                NIS: <strong>{currentStudent.nis}</strong>
              </span>
              <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                NISN: <strong>{currentStudent.nisn}</strong>
              </span>
              <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                Kelas: {myClass?.name} ({myClass?.grade})
              </span>
            </div>
          )}

          {activeRole === 'guru' && currentTeacher && (
            <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
              <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                NIP: <strong>{currentTeacher.nip}</strong>
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Bidang: {currentTeacher.specialization}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Avatar Picker Drawer / Box */}
      {showAvatarPicker && (
        <div className="bg-white rounded-3xl border border-blue-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-sm text-slate-900">
                Pilih Foto Profil Sesuai Peran ({activeRole.toUpperCase()})
              </h4>
            </div>
            <button
              onClick={() => setShowAvatarPicker(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Tutup
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 block">
                Preset Foto Rekomendasi untuk {activeRole === 'murid' ? 'Siswa' : activeRole === 'guru' ? 'Guru' : 'Admin'}:
              </span>
              <button
                type="button"
                onClick={handleSetEmptyAvatar}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition"
              >
                Gunakan PP Kosong (Polos)
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {/* Option 0: PP Kosong */}
              <div
                onClick={handleSetEmptyAvatar}
                className={`cursor-pointer rounded-2xl overflow-hidden border-2 p-1 transition group text-center ${
                  !selectedAvatar
                    ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/50'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="w-full h-16 sm:h-20 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                  <User className="w-6 h-6 text-slate-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-600 line-clamp-1 mt-1 block">
                  PP Kosong
                </span>
              </div>

              {currentRolePresets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedAvatar(preset.url);
                    showToast(`Foto preset "${preset.label}" dipilih!`, 'info');
                  }}
                  className={`cursor-pointer rounded-2xl overflow-hidden border-2 p-1 transition group text-center ${
                    selectedAvatar === preset.url
                      ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-16 sm:h-20 object-cover rounded-xl"
                  />
                  <span className="text-[10px] font-medium text-slate-600 line-clamp-1 mt-1 block">
                    {preset.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Atau Masukkan URL Foto Sendiri:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://..."
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
                >
                  Terapkan
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pilih Berkas Foto dari Laptop/HP:
              </label>
              <label className="flex items-center justify-center gap-2 px-3 py-1.5 border border-dashed border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-600">
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Pilih File Gambar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSimulateUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact and Identity info update */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <h4 className="font-extrabold text-sm text-slate-900">Perbarui Profil Pribadi</h4>
            </div>
            {activeRole !== 'admin' && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Data Induk Terverifikasi
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">Nama Lengkap & Gelar *</label>
                {activeRole !== 'admin' && (
                  <span className="text-[10px] text-slate-400 font-medium">Hanya Admin yang dapat mengedit</span>
                )}
              </div>
              <input
                type="text"
                required
                readOnly={activeRole !== 'admin'}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className={`w-full px-3.5 py-2.5 border rounded-xl font-bold ${
                  activeRole !== 'admin'
                    ? 'bg-slate-100 text-slate-600 cursor-not-allowed border-slate-200'
                    : 'bg-white text-slate-800 border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">Alamat Email Resmi</label>
                {activeRole !== 'admin' && (
                  <span className="text-[10px] text-slate-400 font-medium">Hanya Admin yang dapat mengedit</span>
                )}
              </div>
              <input
                type="email"
                required
                readOnly={activeRole !== 'admin'}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className={`w-full px-3.5 py-2.5 border rounded-xl ${
                  activeRole !== 'admin'
                    ? 'bg-slate-100 text-slate-600 cursor-not-allowed border-slate-200'
                    : 'bg-white text-slate-800 border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none'
                }`}
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Bio / Catatan Pribadi</label>
              <textarea
                rows={2}
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                placeholder="Tuliskan kata motivasi atau catatan profil..."
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Simpan Perubahan Profil
            </button>
          </form>
        </div>

        {/* Security & Credential Management Policy (Admin Only Management) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h4 className="font-extrabold text-sm text-slate-900">Keamanan & Kebijakan Akun</h4>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Lock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Pengelolaan Kredensial Terpusat</span>
              </div>
              <p className="leading-relaxed text-[11px] text-slate-600">
                Untuk menjaga keabsahan data rapor, asesmen CBT, dan akun resmi sekolah, <strong>perubahan kata sandi dan kredensial akses pengguna dikelola langsung secara terpusat oleh Administrator</strong>.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-900">
                <span className="font-semibold">Status Akun Anda</span>
                <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg text-[10px] uppercase">
                  Aktif & Terdaftar
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 text-[11px]">
                <span>Tingkat Keamanan Sesi</span>
                <span className="font-mono text-slate-700 font-semibold">Tinggi (Role-Based Auth)</span>
              </div>
            </div>
          </div>

          {activeRole === 'admin' ? (
            <div className="pt-2">
              <p className="text-[11px] text-slate-500 mb-2 font-medium">
                Sebagai Administrator, Anda dapat mereset kata sandi, mengaktifkan/menonaktifkan, atau mengedit data seluruh pengguna (Guru, Murid, Admin) di menu Manajemen Pengguna.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('pengguna');
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                Buka Manajemen Pengguna & Reset Sandi
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Jika Anda lupa kata sandi atau memerlukan pembaruan nama resmi, silakan hubungi bagian Tata Usaha atau Administrator IT sekolah.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
