import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Plus, Edit2, CheckCircle2, X, Trash2, Layers } from 'lucide-react';
import { Subject } from '../../types';

export const AdminSubjectManagement: React.FC = () => {
  const { subjects, addSubject, updateSubject, teachingAssignments, showToast } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    grade: 'Semua' as 'Semua' | 'VII' | 'VIII' | 'IX',
    description: '',
    color: 'from-blue-600 to-indigo-700',
    icon: 'BookOpen',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      showToast('Kode dan Nama Mata Pelajaran wajib diisi.', 'error');
      return;
    }

    addSubject({
      code: formData.code.toUpperCase().trim(),
      name: formData.name.trim(),
      grade: formData.grade,
      description: formData.description || 'Mata pelajaran kurikulum standar SMP.',
      color: formData.color,
      icon: formData.icon,
      status: 'aktif',
    });

    setShowAddModal(false);
    setFormData({
      code: '',
      name: '',
      grade: 'Semua',
      description: '',
      color: 'from-blue-600 to-indigo-700',
      icon: 'BookOpen',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Mata Pelajaran (Kurikulum SMP)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftar mata pelajaran pokok, muatan lokal, dan penetapan status aktif.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Tambah Mata Pelajaran
        </button>
      </div>

      {/* Grid of Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((subj) => {
          const assignedCount = teachingAssignments.filter((ta) => ta.subject_id === subj.id).length;

          return (
            <div
              key={subj.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    {subj.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      subj.status === 'aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {subj.status.toUpperCase()}
                  </span>
                </div>

                <h4 className="font-extrabold text-base text-slate-900 mt-2">{subj.name}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {subj.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Jenjang: <strong>{subj.grade}</strong>
                  </span>
                  <span className="text-blue-600 font-semibold">
                    {assignedCount} Penugasan Guru
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setEditingSubject(subj)}
                  className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Detail
                </button>
                <button
                  onClick={() => {
                    const newStatus = subj.status === 'aktif' ? 'nonaktif' : 'aktif';
                    updateSubject(subj.id, { status: newStatus });
                  }}
                  className="text-[11px] font-semibold text-slate-400 hover:text-slate-700"
                >
                  {subj.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Subject */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Tambah Mata Pelajaran</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Mapel *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: IPA-SMP"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tingkat Jenjang</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Semua">Semua Jenjang</option>
                    <option value="VII">Kelas VII Saja</option>
                    <option value="VIII">Kelas VIII Saja</option>
                    <option value="IX">Kelas IX Saja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Mata Pelajaran *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Seni Budaya & Prakarya"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Silabus Singkat</label>
                <textarea
                  rows={3}
                  placeholder="Ringkasan kompetensi dasar mata pelajaran ini..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
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
                  Simpan Mapel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Subject */}
      {editingSubject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Edit Mata Pelajaran</h3>
              <button onClick={() => setEditingSubject(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateSubject(editingSubject.id, {
                  name: editingSubject.name,
                  description: editingSubject.description,
                  grade: editingSubject.grade,
                });
                setEditingSubject(null);
              }}
              className="space-y-4 mt-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Mata Pelajaran</label>
                <input
                  type="text"
                  required
                  value={editingSubject.name}
                  onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Jenjang</label>
                <select
                  value={editingSubject.grade}
                  onChange={(e) => setEditingSubject({ ...editingSubject, grade: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="Semua">Semua Jenjang</option>
                  <option value="VII">Kelas VII</option>
                  <option value="VIII">Kelas VIII</option>
                  <option value="IX">Kelas IX</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi</label>
                <textarea
                  rows={3}
                  value={editingSubject.description}
                  onChange={(e) => setEditingSubject({ ...editingSubject, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
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
    </div>
  );
};
