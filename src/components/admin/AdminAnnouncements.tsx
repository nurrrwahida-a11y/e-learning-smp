import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Megaphone, Plus, Trash2, Pin, Users, GraduationCap, X } from 'lucide-react';

export const AdminAnnouncements: React.FC = () => {
  const { announcements, addAnnouncement, deleteAnnouncement, showToast } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target: 'semua' as 'semua' | 'guru' | 'murid',
    is_pinned: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      showToast('Judul dan isi pengumuman wajib diisi.', 'error');
      return;
    }

    addAnnouncement({
      title: formData.title.trim(),
      content: formData.content.trim(),
      target: formData.target,
      is_pinned: formData.is_pinned,
    });

    setShowAddModal(false);
    setFormData({
      title: '',
      content: '',
      target: 'semua',
      is_pinned: false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pengumuman Resmi Sekolah
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Publikasikan informasi penting, kalender akademik, dan surat edaran kepada dewan guru dan murid.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Buat Pengumuman
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((anc) => (
          <div
            key={anc.id}
            className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
              anc.is_pinned ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  {anc.is_pinned && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      <Pin className="w-3 h-3" />
                      Disematkan (Pinned)
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      anc.target === 'semua'
                        ? 'bg-blue-100 text-blue-700'
                        : anc.target === 'guru'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    Target: {anc.target}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mt-2">{anc.title}</h3>
              </div>

              <button
                onClick={() => deleteAnnouncement(anc.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Hapus Pengumuman"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
              {anc.content}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Dipublikasikan: {anc.published_at}</span>
              <span>Oleh: <strong>{anc.author_name}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Announcement */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Buat Pengumuman Sekolah Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Pengumuman *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Edaran Pelaksanaan PTS CBT Semester Ganjil"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Sasaran *</label>
                  <select
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="semua">Semua (Guru & Murid)</option>
                    <option value="guru">Hanya Dewan Guru</option>
                    <option value="murid">Hanya Seluruh Murid</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.is_pinned}
                      onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    Sematkan di Atas (Pin)
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Isi Lengkap Pengumuman *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tuliskan isi pengumuman atau instruksi sekolah di sini..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl leading-relaxed"
                />
              </div>

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
                  Terbitkan Pengumuman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
