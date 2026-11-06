import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Plus,
  Users,
  UserCheck,
  ArrowRightLeft,
  X,
  GraduationCap,
  Sparkles,
  School,
  Edit2,
  Trash2,
} from 'lucide-react';
import { ClassRoom } from '../../types';

export const AdminClassManagement: React.FC = () => {
  const {
    classes,
    users,
    studentProfiles,
    teacherProfiles,
    addClass,
    updateClass,
    deleteClass,
    moveStudentClass,
    showToast,
  } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<'Semua' | 'VII' | 'VIII' | 'IX'>('Semua');
  const [selectedClassRoster, setSelectedClassRoster] = useState<ClassRoom | null>(null);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showMoveStudentModal, setShowMoveStudentModal] = useState<{ studentId: string; currentClassId: string } | null>(null);

  // New Class Form State
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState<'VII' | 'VIII' | 'IX'>('VII');
  const [newHomeroomTeacher, setNewHomeroomTeacher] = useState('');
  const [newCapacity, setNewCapacity] = useState(32);

  // Move Student State
  const [targetClassId, setTargetClassId] = useState('');

  const filteredClasses = classes.filter((c) => {
    if (selectedGrade !== 'Semua' && c.grade !== selectedGrade) return false;
    return true;
  });

  const teachers = users.filter((u) => u.role === 'guru');

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      showToast('Nama rombel wajib diisi (misal: VII-C).', 'error');
      return;
    }

    // Check duplicate class name
    if (classes.some((c) => c.name.toLowerCase() === newClassName.trim().toLowerCase())) {
      showToast(`Rombel ${newClassName} sudah ada!`, 'error');
      return;
    }

    addClass({
      name: newClassName.trim().toUpperCase(),
      grade: newClassGrade,
      homeroom_teacher_id: newHomeroomTeacher || undefined,
      academic_year_id: 'ay-1',
      capacity: newCapacity || 32,
    });

    setShowAddClassModal(false);
    setNewClassName('');
  };

  const handleExecuteMove = () => {
    if (!showMoveStudentModal || !targetClassId) return;
    if (targetClassId === showMoveStudentModal.currentClassId) {
      showToast('Siswa sudah berada di rombel ini.', 'error');
      return;
    }
    moveStudentClass(showMoveStudentModal.studentId, targetClassId);
    setShowMoveStudentModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Kelas & Rombongan Belajar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Pengelolaan jenjang kelas VII, VIII, dan IX, penetapan wali kelas, dan pembagian siswa.
          </p>
        </div>

        <button
          onClick={() => setShowAddClassModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Tambah Rombel Baru
        </button>
      </div>

      {/* Grade Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {(['Semua', 'VII', 'VIII', 'IX'] as const).map((grade) => (
          <button
            key={grade}
            onClick={() => setSelectedGrade(grade)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedGrade === grade
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {grade === 'Semua' ? 'Semua Jenjang' : `Jenjang Kelas ${grade}`}
          </button>
        ))}
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.map((cls) => {
          const studentsInClass = studentProfiles.filter((sp) => sp.class_id === cls.id);
          const homeroomTeacher = teachers.find((t) => t.id === cls.homeroom_teacher_id);
          const occupancyRate = Math.round((studentsInClass.length / cls.capacity) * 100);

          return (
            <div
              key={cls.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-black text-sm flex items-center justify-center border border-blue-200">
                      {cls.name}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">Kelas {cls.name}</h4>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Jenjang {cls.grade} SMP
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {studentsInClass.length}/{cls.capacity} Siswa
                  </span>
                </div>

                {/* Capacity Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        occupancyRate > 90 ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Wali Kelas Card */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Wali Kelas</p>
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {homeroomTeacher ? homeroomTeacher.name : 'Belum Ditentukan'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedClassRoster(cls)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  Daftar Murid ({studentsInClass.length})
                </button>
                <button
                  onClick={() => deleteClass(cls.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Hapus Rombel"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: View Roster & Move Student */}
      {selectedClassRoster && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                  {selectedClassRoster.name}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Daftar Murid Kelas {selectedClassRoster.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Total {studentProfiles.filter((s) => s.class_id === selectedClassRoster.id).length} siswa terdaftar aktif
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedClassRoster(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">No</th>
                    <th className="py-2.5 px-3">Nama Siswa</th>
                    <th className="py-2.5 px-3">NIS</th>
                    <th className="py-2.5 px-3">L/P</th>
                    <th className="py-2.5 px-3">Poin XP</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentProfiles
                    .filter((sp) => sp.class_id === selectedClassRoster.id)
                    .map((sp, idx) => {
                      const studentUser = users.find((u) => u.id === sp.user_id);
                      return (
                        <tr key={sp.user_id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900">{studentUser?.name}</div>
                            <div className="text-[10px] text-slate-400">{studentUser?.email}</div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{sp.nis}</td>
                          <td className="py-2.5 px-3 font-semibold">{sp.gender}</td>
                          <td className="py-2.5 px-3 font-bold text-indigo-600">{sp.points} XP</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                setShowMoveStudentModal({
                                  studentId: sp.user_id,
                                  currentClassId: selectedClassRoster.id,
                                });
                                setSelectedClassRoster(null);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Pindahkan siswa ke rombel lain"
                            >
                              <ArrowRightLeft className="w-3 h-3" />
                              Pindah Rombel
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedClassRoster(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Move Student to another class */}
      {showMoveStudentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 mx-auto flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h3 className="font-extrabold text-base text-slate-900">Pindahkan Siswa Rombel</h3>
              <p className="text-xs text-slate-500 mt-1">
                Siswa:{' '}
                <strong className="text-slate-800">
                  {users.find((u) => u.id === showMoveStudentModal.studentId)?.name}
                </strong>
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">Pilih Rombel Tujuan:</label>
              <select
                value={targetClassId}
                onChange={(e) => setTargetClassId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Pilih Kelas --</option>
                {classes
                  .filter((c) => c.id !== showMoveStudentModal.currentClassId)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      Kelas {c.name} (Jenjang {c.grade})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setShowMoveStudentModal(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleExecuteMove}
                disabled={!targetClassId}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Simpan Perpindahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Class */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Tambah Rombongan Belajar Baru</h3>
              <button
                onClick={() => setShowAddClassModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Jenjang Pendidikan *</label>
                <select
                  value={newClassGrade}
                  onChange={(e) => setNewClassGrade(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="VII">Kelas VII (Tujuh)</option>
                  <option value="VIII">Kelas VIII (Delapan)</option>
                  <option value="IX">Kelas IX (Sembilan)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Rombel *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: VII-C atau VIII-C"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Wali Kelas (Opsional)</label>
                <select
                  value={newHomeroomTeacher}
                  onChange={(e) => setNewHomeroomTeacher(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                >
                  <option value="">-- Belum Ditentukan --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kapasitas Maksimal Siswa</label>
                <input
                  type="number"
                  min={10}
                  max={45}
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-md"
                >
                  Simpan Rombel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
