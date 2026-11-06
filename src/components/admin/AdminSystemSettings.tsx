import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building2,
  Sparkles,
  UserCheck,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  RotateCcw,
  CheckCircle2,
  Eye,
  Plus,
  Trash2,
  Image as ImageIcon,
  BookOpen,
  Upload,
} from 'lucide-react';
import { defaultSystemSettings } from '../../data/initialData';

export const AdminSystemSettings: React.FC = () => {
  const { systemSettings, updateSystemSettings, resetDatabase, showToast } = useApp();

  const [formData, setFormData] = useState(systemSettings);
  const [activeSubTab, setActiveSubTab] = useState<'profil' | 'kepsek' | 'visi' | 'landing'>('profil');
  const [newMissionItem, setNewMissionItem] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings(formData);
  };

  const handleResetSettingsOnly = () => {
    setFormData(defaultSystemSettings);
    updateSystemSettings(defaultSystemSettings);
    setShowResetModal(false);
    showToast('Pengaturan profil sekolah berhasil direset ke setelan awal bawaan.', 'success');
  };

  const handleResetEntireSystem = () => {
    resetDatabase();
    setFormData(defaultSystemSettings);
    setShowResetModal(false);
    showToast('Seluruh sistem & setelan telah direset ke setelan awal pabrik.', 'success');
  };

  const addMissionPoint = () => {
    if (!newMissionItem.trim()) return;
    setFormData((prev) => ({
      ...prev,
      mission: [...(prev.mission || []), newMissionItem.trim()],
    }));
    setNewMissionItem('');
  };

  const removeMissionPoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      mission: (prev.mission || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Pengaturan Sistem & Profil Sekolah</h1>
              <p className="text-sm text-slate-500">
                Kelola identitas SMP N 1 JAYA, profil sekolah, sambutan kepala sekolah, visi-misi, dan konten landing page.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            <Eye className="w-4 h-4 text-slate-600" />
            Lihat Ringkasan
          </button>
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition cursor-pointer"
            title="Reset Pengaturan ke Setelan Awal"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            Reset Bawaan
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 sm:px-6 pt-3 rounded-t-2xl overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveSubTab('profil')}
          className={`pb-3 px-4 font-semibold text-sm border-b-2 transition flex items-center gap-2 ${
            activeSubTab === 'profil'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Identitas & Kontak
        </button>
        <button
          onClick={() => setActiveSubTab('kepsek')}
          className={`pb-3 px-4 font-semibold text-sm border-b-2 transition flex items-center gap-2 ${
            activeSubTab === 'kepsek'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Kepala Sekolah
        </button>
        <button
          onClick={() => setActiveSubTab('visi')}
          className={`pb-3 px-4 font-semibold text-sm border-b-2 transition flex items-center gap-2 ${
            activeSubTab === 'visi'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Visi & Misi
        </button>
        <button
          onClick={() => setActiveSubTab('landing')}
          className={`pb-3 px-4 font-semibold text-sm border-b-2 transition flex items-center gap-2 ${
            activeSubTab === 'landing'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          Konten Landing Page
        </button>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSave} className="bg-white rounded-b-2xl border border-t-0 border-slate-200/80 p-6 space-y-6">
        {/* SUBTAB 1: IDENTITAS & KONTAK */}
        {activeSubTab === 'profil' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-800">Identitas Sekolah</h2>
              <p className="text-xs text-slate-500">Informasi nama resmi, akreditasi, dan logo institusi.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Resmi Sekolah</label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => handleInputChange('schoolName', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  placeholder="Contoh: SMP N 1 JAYA"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Singkatan / Brand</label>
                <input
                  type="text"
                  value={formData.shortName}
                  onChange={(e) => handleInputChange('shortName', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  placeholder="Contoh: SMP N 1 JAYA"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Motto / Slogan</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  placeholder="Motto pembelajaran"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NPSN</label>
                  <input
                    type="text"
                    value={formData.npsn}
                    onChange={(e) => handleInputChange('npsn', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Akreditasi</label>
                  <input
                    type="text"
                    value={formData.accreditation}
                    onChange={(e) => handleInputChange('accreditation', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Logo Resmi Sekolah</label>
                  <span className="text-[11px] text-blue-600 font-medium">
                    Tampil di Landing Page, Navbar, Sidebar & Kop Surat PDF
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <input
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                    placeholder="URL gambar logo sekolah (https://...)"
                  />

                  {/* Local file upload for logo */}
                  <label className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition border border-slate-200 shrink-0">
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>Unggah File Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            showToast('Ukuran logo maksimal 2MB', 'error');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              handleInputChange('logoUrl', reader.result);
                              showToast(`Logo "${file.name}" berhasil dimuat!`, 'success');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {formData.logoUrl && (
                    <div className="flex items-center gap-2">
                      <img
                        src={formData.logoUrl}
                        alt="Logo Preview"
                        className="w-11 h-11 object-contain rounded-xl border border-slate-200 p-1 bg-white shadow-xs"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleInputChange('logoUrl', '')}
                        className="text-xs text-rose-500 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>

                {/* Preset Logo Buttons */}
                <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs">
                  <span className="text-slate-400 font-medium">Pilihan Preset Cepat:</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange(
                        'logoUrl',
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB_pRDivsZnjON4DrCfkzpuHSheZxCqe7iZmNBGUHt1w&s'
                      )
                    }
                    className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 font-bold border border-blue-300"
                  >
                    ⭐ Logo Tut Wuri Handayani Resmi
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange(
                        'logoUrl',
                        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&auto=format&fit=crop&q=80'
                      )
                    }
                    className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold"
                  >
                    Emblem Sekolah Emas
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange(
                        'logoUrl',
                        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&auto=format&fit=crop&q=80'
                      )
                    }
                    className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold"
                  >
                    Logo Smart Junior High
                  </button>
                </div>
              </div>
            </div>

            <div className="border-b border-slate-100 pb-3 pt-4">
              <h2 className="text-base font-semibold text-slate-800">Kontak & Alamat</h2>
              <p className="text-xs text-slate-500">Informasi kontak yang ditampilkan di footer landing page.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email Resmi
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  Website Sekolah
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Alamat Lengkap
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: KEPALA SEKOLAH */}
        {activeSubTab === 'kepsek' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-800">Profil Kepala Sekolah</h2>
              <p className="text-xs text-slate-500">Data dan sambutan resmi kepala sekolah pada landing page.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="flex flex-col items-center bg-slate-50 p-5 rounded-2xl border border-slate-200/80 text-center">
                <img
                  src={formData.headmasterAvatar}
                  alt={formData.headmasterName}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md mb-3"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200';
                  }}
                />
                <h4 className="font-bold text-slate-800 text-sm">{formData.headmasterName}</h4>
                <p className="text-xs text-blue-600 font-medium">Kepala Sekolah</p>
                <p className="text-xs text-slate-400 mt-1">NIP. {formData.headmasterNip}</p>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                    <input
                      type="text"
                      value={formData.headmasterName}
                      onChange={(e) => handleInputChange('headmasterName', e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
                    <input
                      type="text"
                      value={formData.headmasterNip}
                      onChange={(e) => handleInputChange('headmasterNip', e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">URL Foto Kepala Sekolah</label>
                  <input
                    type="url"
                    value={formData.headmasterAvatar}
                    onChange={(e) => handleInputChange('headmasterAvatar', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleInputChange(
                          'headmasterAvatar',
                          'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300'
                        )
                      }
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Gunakan Foto Pria Formal
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleInputChange(
                          'headmasterAvatar',
                          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300'
                        )
                      }
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Gunakan Foto Wanita Formal
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sambutan Kepala Sekolah</label>
                  <textarea
                    rows={4}
                    value={formData.headmasterMessage}
                    onChange={(e) => handleInputChange('headmasterMessage', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                    placeholder="Tuliskan kata sambutan hangat dari kepala sekolah..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: VISI & MISI */}
        {activeSubTab === 'visi' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-800">Visi & Misi Sekolah</h2>
              <p className="text-xs text-slate-500">Landasan filosofis pembelajaran di SMP N 1 JAYA.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Visi Sekolah</label>
              <textarea
                rows={3}
                value={formData.vision}
                onChange={(e) => handleInputChange('vision', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition font-medium text-slate-800"
                placeholder="Visi sekolah..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Daftar Misi Sekolah</label>
              <div className="space-y-2 mb-3">
                {(formData.mission || []).map((item: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm group"
                  >
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const updated = [...(formData.mission || [])];
                        updated[idx] = e.target.value;
                        setFormData((prev) => ({ ...prev, mission: updated }));
                      }}
                      className="flex-1 bg-transparent border-0 focus:ring-0 p-0 text-slate-800 text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeMissionPoint(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 opacity-70 group-hover:opacity-100 transition"
                      title="Hapus poin misi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add mission point */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMissionItem}
                  onChange={(e) => setNewMissionItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addMissionPoint();
                    }
                  }}
                  placeholder="Ketik poin misi baru lalu tekan Tambah..."
                  className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                />
                <button
                  type="button"
                  onClick={addMissionPoint}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Poin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: KONTEN LANDING PAGE */}
        {activeSubTab === 'landing' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-800">Hero Section Landing Page</h2>
              <p className="text-xs text-slate-500">Tampilan utama yang pertama kali dilihat siswa dan guru saat membuka sistem.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Teks Hero</label>
                <input
                  type="text"
                  value={formData.landingHeroBadge}
                  onChange={(e) => handleInputChange('landingHeroBadge', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  placeholder="Contoh: 🚀 Platform Digital Kurikulum Merdeka SMP"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Hero (Heading)</label>
                <input
                  type="text"
                  value={formData.landingHeroTitle}
                  onChange={(e) => handleInputChange('landingHeroTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  placeholder="Judul besar landing page"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subjudul / Deskripsi Hero</label>
                <textarea
                  rows={2}
                  value={formData.landingHeroSubtitle}
                  onChange={(e) => handleInputChange('landingHeroSubtitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  placeholder="Deskripsi singkat yang menggugah semangat belajar..."
                  required
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                    URL Gambar Banner Hero
                  </label>
                  <span className="text-[11px] text-blue-600 font-medium">
                    Tampil langsung di Hero Section Landing Page Depan
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <input
                    type="url"
                    value={formData.landingHeroImage}
                    onChange={(e) => handleInputChange('landingHeroImage', e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                    placeholder="https://... (URL gambar banner sekolah)"
                  />

                  {/* Local file upload for banner */}
                  <label className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition border border-slate-200 shrink-0">
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>Unggah Banner</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 4 * 1024 * 1024) {
                            showToast('Ukuran gambar banner maksimal 4MB', 'error');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              handleInputChange('landingHeroImage', reader.result);
                              showToast(`Banner "${file.name}" berhasil dimuat!`, 'success');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Preset Banner Buttons */}
                <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs">
                  <span className="text-slate-400 font-medium">Pilihan Preset Cepat:</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange(
                        'landingHeroImage',
                        'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80'
                      )
                    }
                    className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold"
                  >
                    Gedung Sekolah SMP Modern
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange(
                        'landingHeroImage',
                        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=80'
                      )
                    }
                    className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold"
                  >
                    Laboratorium Komputer Digital
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange(
                        'landingHeroImage',
                        'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80'
                      )
                    }
                    className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold"
                  >
                    Siswa Aktif Belajar
                  </button>
                </div>

                {formData.landingHeroImage && (
                  <div className="mt-3 relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                    <img
                      src={formData.landingHeroImage}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-4">
                      <span className="text-white text-xs font-bold drop-shadow-sm">
                        Pratinjau Banner Hero: {formData.schoolName || 'SMP N 1 JAYA'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleInputChange('landingHeroImage', '')}
                        className="px-2 py-1 rounded bg-black/60 text-white text-[10px] hover:bg-rose-600 transition"
                      >
                        Hapus Banner
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-blue-500/20 transition active:scale-[0.99]"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </button>
        </div>
      </form>

      {/* MODAL PREVIEW RINGKASAN */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-base">Pratinjau Identitas Sekolah</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕ Tutup
              </button>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 space-y-2">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">{formData.shortName}</span>
              <h2 className="text-xl font-bold text-slate-900">{formData.schoolName}</h2>
              <p className="text-xs text-slate-600 italic">"{formData.tagline}"</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white text-blue-700 font-semibold text-xs border border-blue-200">
                  NPSN: {formData.npsn}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs">
                  Akreditasi {formData.accreditation}
                </span>
              </div>
            </div>

            <div className="border border-slate-100 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase">Sambutan Kepala Sekolah</h4>
              <div className="flex items-start gap-3">
                <img
                  src={formData.headmasterAvatar}
                  alt={formData.headmasterName}
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />
                <div>
                  <h5 className="font-bold text-slate-800 text-sm">{formData.headmasterName}</h5>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-3">
                    "{formData.headmasterMessage}"
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-slate-100 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase">Visi & Misi</h4>
              <p className="text-xs text-slate-700 font-medium italic">"{formData.vision}"</p>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside pt-1">
                {(formData.mission || []).map((m: string, i: number) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
              >
                Selesai Melihat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RESET KE SETELAN AWAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Reset ke Setelan Awal</h3>
                  <p className="text-xs text-slate-500">Pilih opsi pengembalian setelan sistem atau data awal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Anda dapat mengembalikan seluruh pengaturan sekolah ke nilai awal (bawaan) sistem, atau mereset seluruh database simulasi ke kondisi awal instalasi.
            </p>

            <div className="space-y-3 pt-1">
              {/* Option 1: Reset Pengaturan Sekolah Sahaja */}
              <button
                type="button"
                onClick={handleResetSettingsOnly}
                className="w-full text-left p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all flex items-start gap-3 group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900">
                    Reset Setelan Awal Profil Sekolah
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Kembalikan nama sekolah (SMP N 1 JAYA), logo resmi, visi misi, kontak, dan sambutan kepala sekolah ke default bawaan.
                  </p>
                </div>
              </button>

              {/* Option 2: Reset Seluruh Sistem & Database */}
              <button
                type="button"
                onClick={handleResetEntireSystem}
                className="w-full text-left p-3.5 rounded-2xl border border-rose-200 hover:border-rose-400 hover:bg-rose-50/40 transition-all flex items-start gap-3 group"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-rose-900">
                    Reset Seluruh Data & Setelan Pabrik
                  </h4>
                  <p className="text-[11px] text-rose-600 mt-0.5">
                    Reset total: hapus riwayat perubahan lokal dan kembalikan seluruh akun pengguna, kelas, mapel, materi, tugas, dan nilai ke setelan awal bawaan.
                  </p>
                </div>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
