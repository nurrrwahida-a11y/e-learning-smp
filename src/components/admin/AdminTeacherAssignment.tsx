import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserPlus, Trash2, Plus, Users, BookOpen, Layers, X, ShieldCheck } from 'lucide-react';

export const AdminTeacherAssignment: React.FC = () => {
  const {
    teachingAssignments,
    users,
    subjects,
    classes,
    assignTeacherToSubject,
    removeTeachingAssignment,
    showToast,
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');

  const teachers = users.filter((u) => u.role === 'guru' && u.status === 'aktif');

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherId || !selectedSubjectId || !selectedClassId) {
      showToast('Pilih Guru, Mata Pelajaran, dan Rombel Kelas dengan lengkap.', 'error');
      return;
    }

    assignTeacherToSubject(selectedTeacherId, selectedSubjectId, selectedClassId);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Penugasan Mengajar Guru (Teaching Allocations)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Hubungkan guru pengampu dengan mata pelajaran dan rombongan belajar kelas yang ditugaskan.
          </p>
        </div>

        <button
          onClick={() => {
            if (teachers.length > 0) setSelectedTeacherId(teachers[0].id);
            if (subjects.length > 0) setSelectedSubjectId(subjects[0].id);
            if (classes.length > 0) setSelectedClassId(classes[0].id);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Tambah Penugasan Mengajar
        </button>
      </div>

      {/* Info card */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <strong>Prinsip Hak Akses Guru:</strong> Guru yang ditugaskan di sini secara otomatis memperoleh akses untuk mengunggah materi, membuat tugas, kuis CBT, presensi, dan menginput nilai pada rombel tersebut. Guru tidak dapat mengakses atau mengubah nilai kelas lain yang tidak diampunya.
        </div>
      </div>

      {/* Table of Assignments */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Guru Pengampu</th>
                <th className="py-3 px-4">Mata Pelajaran</th>
                <th className="py-3 px-4">Rombel Kelas</th>
                <th className="py-3 px-4">Tahun Ajaran</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachingAssignments.map((ta) => {
                const teacherObj = users.find((u) => u.id === ta.teacher_id);
                const subjectObj = subjects.find((s) => s.id === ta.subject_id);
                const classObj = classes.find((c) => c.id === ta.class_id);

                return (
                  <tr key={ta.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={teacherObj?.avatar}
                          alt={teacherObj?.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{teacherObj?.name || 'Guru Dihapus'}</p>
                          <p className="text-[11px] text-slate-400">{teacherObj?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800">{subjectObj?.name || '-'}</span>
                      <p className="text-[10px] font-mono text-slate-400">{subjectObj?.code}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200">
                        Kelas {classObj?.name || '-'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600">
                      2026/2027 Ganjil
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => removeTeachingAssignment(ta.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Penugasan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Assignment */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Tetapkan Penugasan Guru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssign} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Guru Pengajar *</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Mata Pelajaran *</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Rombongan Belajar *</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      Kelas {c.name} (Jenjang {c.grade})
                    </option>
                  ))}
                </select>
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
                  Simpan Penugasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
