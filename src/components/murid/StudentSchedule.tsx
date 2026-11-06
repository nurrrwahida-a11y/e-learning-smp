import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';

export const StudentSchedule: React.FC = () => {
  const { currentUser, studentProfiles, classes, schedules, subjects, users } = useApp();
  const [selectedDay, setSelectedDay] = useState<string>('Senin');

  const currentProfile = studentProfiles.find((sp) => sp.user_id === currentUser?.id);
  const myClass = classes.find((c) => c.id === currentProfile?.class_id);

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;

  const classSchedules = schedules.filter((s) => s.class_id === myClass?.id);
  const filteredDaySchedules = classSchedules.filter((s) => s.day === selectedDay);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Jadwal Pelajaran & Kalender Belajar (Kelas {myClass?.name})
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Jadwal mata pelajaran mingguan terstruktur untuk kelas {myClass?.name}.
        </p>
      </div>

      {/* Days Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {days.map((d) => {
          const count = classSchedules.filter((s) => s.day === d).length;
          return (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDay === d
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {d} ({count})
            </button>
          );
        })}
      </div>

      {/* Daily Schedules Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDaySchedules.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
            Tidak ada jadwal tatap muka untuk hari {selectedDay}.
          </div>
        ) : (
          filteredDaySchedules.map((sch) => {
            const sbj = subjects.find((s) => s.id === sch.subject_id);
            const teacher = users.find((u) => u.id === sch.teacher_id);

            return (
              <div
                key={sch.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-indigo-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                    {sch.start_time} - {sch.end_time}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {sch.room}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900">{sbj?.name}</h3>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2.5 text-xs text-slate-600">
                  <img
                    src={teacher?.avatar}
                    alt={teacher?.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <p className="font-bold text-slate-800">{teacher?.name}</p>
                    <p className="text-[10px] text-slate-400">Guru Pengampu</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
