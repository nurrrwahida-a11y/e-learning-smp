import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, Users, GraduationCap, BookOpen, Clock, ChevronRight } from 'lucide-react';

export const TeacherClasses: React.FC = () => {
  const {
    currentUser,
    teachingAssignments,
    classes,
    subjects,
    studentProfiles,
    users,
    setActiveTab,
  } = useApp();

  const myAllocations = teachingAssignments.filter((ta) => ta.teacher_id === currentUser?.id);
  const myClassIds = Array.from(new Set(myAllocations.map((ta) => ta.class_id)));
  const myClasses = classes.filter((c) => myClassIds.includes(c.id));

  const [selectedClassId, setSelectedClassId] = useState<string>(myClasses[0]?.id || 'cls-7a');

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const studentsInSelectedClass = studentProfiles.filter((sp) => sp.class_id === selectedClassId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Kelas Binaan & Rombongan Belajar Saya
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Daftar rombel yang ditugaskan kepada Anda sesuai Surat Keputusan Pembagian Tugas Mengajar.
        </p>
      </div>

      {/* Class Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {myClasses.map((cls) => {
          const studentsCount = studentProfiles.filter((sp) => sp.class_id === cls.id).length;
          const isSelected = selectedClassId === cls.id;

          return (
            <div
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-200 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center">
                  {cls.name}
                </span>
                <span className="text-xs font-bold text-slate-600">
                  {studentsCount}/{cls.capacity} Siswa
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mt-3">
                Kelas {cls.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Jenjang Kelas {cls.grade} SMP</p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold">
                  {isSelected ? 'Sedang Ditampilkan' : 'Pilih Rombel'}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Students in Selected Class */}
      {selectedClass && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Daftar Peserta Didik — Kelas {selectedClass.name}
              </h3>
              <p className="text-xs text-slate-500">
                Tahun Ajaran 2026/2027 Ganjil ({studentsInSelectedClass.length} Siswa)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[11px]">
                  <th className="py-2.5 px-3">No</th>
                  <th className="py-2.5 px-4">Nama Lengkap Siswa</th>
                  <th className="py-2.5 px-3">NIS</th>
                  <th className="py-2.5 px-3">NISN</th>
                  <th className="py-2.5 px-3">L/P</th>
                  <th className="py-2.5 px-3">Poin XP</th>
                  <th className="py-2.5 px-3">Materi Tuntas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentsInSelectedClass.map((sp, idx) => {
                  const studentUser = users.find((u) => u.id === sp.user_id);

                  return (
                    <tr key={sp.user_id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{studentUser?.name}</p>
                        <p className="text-[10px] text-slate-400">{studentUser?.email}</p>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">{sp.nis}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{sp.nisn}</td>
                      <td className="py-3 px-3 font-semibold">{sp.gender}</td>
                      <td className="py-3 px-3 font-bold text-indigo-600">{sp.points} XP</td>
                      <td className="py-3 px-3 font-semibold text-emerald-600">
                        {sp.completed_lessons_count} Bab
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
