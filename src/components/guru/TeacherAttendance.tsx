import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  CheckCircle2,
  UserCheck,
  Edit2,
  Trash2,
  FileText,
  Clock,
  X,
  Save,
  AlertCircle,
} from 'lucide-react';
import { AttendanceRecord, AttendanceSession } from '../../types';
import { PrintExportDropdown } from '../common/PrintExportDropdown';
import { downloadAttendancePDF, downloadExcel, getSchoolInfoFromSettings } from '../../utils/exportUtils';

export const TeacherAttendance: React.FC = () => {
  const {
    currentUser,
    teachingAssignments,
    classes,
    users,
    studentProfiles,
    attendances,
    saveAttendanceSession,
    updateAttendanceSession,
    deleteAttendanceSession,
    showToast,
    systemSettings,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>('cls-7a');
  const [meetingNumber, setMeetingNumber] = useState(2);
  const [meetingTopic, setMeetingTopic] = useState('Pembahasan Latihan Soal Bilangan Bulat Negatif');
  const [attendanceDate, setAttendanceDate] = useState('2026-10-29');

  // Editing past session modal state
  const [editingSession, setEditingSession] = useState<AttendanceSession | null>(null);

  const myAllocations = teachingAssignments.filter((ta) => ta.teacher_id === currentUser?.id);
  const myClassIds = Array.from(new Set(myAllocations.map((ta) => ta.class_id)));
  const myClasses = classes.filter((c) => myClassIds.includes(c.id));

  const studentsInClass = studentProfiles.filter((sp) => sp.class_id === selectedClassId);

  // Current session attendance map
  const [records, setRecords] = useState<{
    [studentId: string]: {
      status: 'hadir' | 'izin' | 'sakit' | 'alpa';
      note: string;
    };
  }>(() => {
    const map: any = {};
    studentProfiles.forEach((sp) => {
      map[sp.user_id] = { status: 'hadir', note: '' };
    });
    return map;
  });

  const handleSetAllPresent = () => {
    const map: any = { ...records };
    studentsInClass.forEach((sp) => {
      map[sp.user_id] = { status: 'hadir', note: '' };
    });
    setRecords(map);
    showToast('Semua murid berhasil ditandai HADIR.', 'info');
  };

  const handleStatusChange = (studentId: string, status: 'hadir' | 'izin' | 'sakit' | 'alpa') => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        status,
        note: prev[studentId]?.note || (status === 'hadir' ? '' : status === 'izin' ? 'Izin keperluan keluarga' : status === 'sakit' ? 'Sakit demam' : 'Tanpa surat keterangan'),
      },
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || 'hadir',
        note,
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTopic.trim()) {
      showToast('Topik pertemuan wajib diisi.', 'error');
      return;
    }

    const recArray: AttendanceRecord[] = studentsInClass.map((sp) => ({
      student_id: sp.user_id,
      status: records[sp.user_id]?.status || 'hadir',
      note: records[sp.user_id]?.note?.trim() || undefined,
    }));

    saveAttendanceSession({
      class_id: selectedClassId,
      subject_id: 'sbj-mtk',
      teacher_id: currentUser?.id || 'usr-guru-1',
      date: attendanceDate,
      meeting_number: meetingNumber,
      topic: meetingTopic.trim(),
      records: recArray,
    });
  };

  const mySavedAttendances = attendances.filter(
    (a) => a.teacher_id === currentUser?.id || a.class_id === selectedClassId
  );

  // Edit past session handler
  const handleOpenEditSession = (session: AttendanceSession) => {
    setEditingSession(JSON.parse(JSON.stringify(session)));
  };

  const handleSaveEditedSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;
    updateAttendanceSession(editingSession.id, {
      meeting_number: editingSession.meeting_number,
      topic: editingSession.topic,
      date: editingSession.date,
      records: editingSession.records,
    });
    setEditingSession(null);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm('Hapus sesi presensi pertemuan ini? Data tidak dapat dikembalikan.')) {
      deleteAttendanceSession(sessionId);
      if (editingSession?.id === sessionId) setEditingSession(null);
    }
  };

  const handleExportPDF = () => {
    const schoolInfo = getSchoolInfoFromSettings(systemSettings);
    const selectedClassName = classes.find((c) => c.id === selectedClassId)?.name || selectedClassId;
    const formattedRecords = studentsInClass.map((sp, idx) => {
      const u = users.find((user) => user.id === sp.user_id);
      const studentRec = records[sp.user_id];
      return {
        no: idx + 1,
        nis: sp.nis,
        name: u?.name || 'Siswa',
        status: studentRec?.status || 'hadir',
        note: studentRec?.note || '-',
      };
    });
    downloadAttendancePDF(
      schoolInfo,
      selectedClassName,
      meetingNumber,
      meetingTopic,
      attendanceDate,
      currentUser?.name || 'Dewan Guru SMP N 1 JAYA',
      formattedRecords
    );
    showToast(`Dokumen presensi kelas ${selectedClassName} berhasil diunduh format PDF.`, 'success');
  };

  const handleExportExcel = () => {
    const selectedClassName = classes.find((c) => c.id === selectedClassId)?.name || selectedClassId;
    const headers = ['No', 'NIS', 'Nama Siswa', 'Status Kehadiran', 'Catatan / Alasan'];
    const rows = studentsInClass.map((sp, idx) => {
      const u = users.find((user) => user.id === sp.user_id);
      const studentRec = records[sp.user_id];
      return [
        idx + 1,
        sp.nis,
        u?.name || 'Siswa',
        (studentRec?.status || 'hadir').toUpperCase(),
        studentRec?.note || '',
      ];
    });
    downloadExcel(
      `presensi_${selectedClassName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_pertemuan_${meetingNumber}`,
      'Presensi Kehadiran',
      headers,
      rows
    );
    showToast(`Data presensi kelas ${selectedClassName} berhasil diunduh format Excel.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Presensi Kehadiran Pembelajaran
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Catat kehadiran murid setiap pertemuan dengan keterangan/alasan izin, sakit, maupun dispensasi yang dapat diedit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <PrintExportDropdown
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            onDirectPrint={() => window.print()}
            variant="slate"
            tooltip="Cetak Langsung Presensi atau Unduh PDF / Excel"
          />
          <button
            onClick={handleSetAllPresent}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            Set Semua Hadir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Form / Printable Area */}
        <div className="print-area lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5 print:border-none print:shadow-none print:p-0">
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
                  <Calendar className="w-7 h-7" />
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
                DAFTAR PRESENSI KEHADIRAN SISWA — PERTEMUAN KE-{meetingNumber}
              </h2>
              <p className="text-[11px] text-slate-500">
                Topik: "{meetingTopic}" • Tanggal: {attendanceDate} • Kelas {classes.find((c) => c.id === selectedClassId)?.name}
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Rombel Kelas</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold bg-white"
                >
                  {myClasses.map((c) => (
                    <option key={c.id} value={c.id}>
                      Kelas {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pertemuan Ke-</label>
                <input
                  type="number"
                  min={1}
                  value={meetingNumber}
                  onChange={(e) => setMeetingNumber(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 mb-1">Materi / Topik Pembelajaran Hari Ini *</label>
              <input
                type="text"
                required
                value={meetingTopic}
                onChange={(e) => setMeetingTopic(e.target.value)}
                placeholder="Misal: Operasi Perkalian Bilangan Negatif"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>

            {/* Students Attendance Table with Editable Keterangan */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden mt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[550px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Nama Siswa</th>
                    <th className="py-2.5 px-3">NIS</th>
                    <th className="py-2.5 px-3 text-center">Status Kehadiran</th>
                    <th className="py-2.5 px-3">Keterangan / Alasan (Bisa Diedit)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentsInClass.map((sp) => {
                    const studentUser = users.find((u) => u.id === sp.user_id);
                    const currentStatus = records[sp.user_id]?.status || 'hadir';
                    const currentNote = records[sp.user_id]?.note || '';

                    return (
                      <tr key={sp.user_id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3">
                          <p className="font-bold text-slate-900">{studentUser?.name}</p>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{sp.nis}</td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                            {(['hadir', 'izin', 'sakit', 'alpa'] as const).map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleStatusChange(sp.user_id, st)}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                  currentStatus === st
                                    ? st === 'hadir'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : st === 'izin'
                                      ? 'bg-blue-600 text-white shadow-xs'
                                      : st === 'sakit'
                                      ? 'bg-amber-600 text-white shadow-xs'
                                      : 'bg-rose-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            placeholder={
                              currentStatus === 'hadir'
                                ? 'Hadir tepat waktu'
                                : currentStatus === 'sakit'
                                ? 'Alasan sakit / surat dokter'
                                : currentStatus === 'izin'
                                ? 'Alasan izin / dispensasi'
                                : 'Keterangan alpa'
                            }
                            value={currentNote}
                            onChange={(e) => handleNoteChange(sp.user_id, e.target.value)}
                            className={`w-full px-2.5 py-1 text-xs border rounded-lg focus:outline-none focus:ring-1 ${
                              currentStatus === 'sakit'
                                ? 'border-amber-300 bg-amber-50/40 text-amber-900 focus:ring-amber-500'
                                : currentStatus === 'izin'
                                ? 'border-blue-300 bg-blue-50/40 text-blue-900 focus:ring-blue-500'
                                : currentStatus === 'alpa'
                                ? 'border-rose-300 bg-rose-50/40 text-rose-900 focus:ring-rose-500'
                                : 'border-slate-200 bg-white text-slate-700 focus:ring-slate-400'
                            }`}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Simpan Presensi Pertemuan
              </button>
            </div>
          </form>
        </div>

        {/* History of Saved Sessions */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="font-extrabold text-sm text-slate-900">Riwayat Presensi</h3>
          </div>

          <div className="space-y-3">
            {mySavedAttendances.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada sesi presensi tersimpan.</p>
            ) : (
              mySavedAttendances.map((att) => {
                const presentCount = att.records.filter((r) => r.status === 'hadir').length;
                const withNotes = att.records.filter((r) => r.note && r.note.trim().length > 0);

                return (
                  <div key={att.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-700">Pertemuan #{att.meeting_number}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{att.date}</span>
                    </div>
                    <p className="font-bold text-slate-800">{att.topic}</p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                      <span className="text-slate-500">Kehadiran:</span>
                      <strong className="text-emerald-700">
                        {presentCount}/{att.records.length} Siswa Hadir
                      </strong>
                    </div>

                    {withNotes.length > 0 && (
                      <div className="text-[10px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-700 block mb-1">Catatan Keterangan Siswa:</span>
                        {withNotes.map((rec) => {
                          const student = users.find((u) => u.id === rec.student_id);
                          return (
                            <div key={rec.student_id} className="truncate">
                              <span className="font-medium text-slate-800">{student?.name}:</span>{' '}
                              <span className="italic text-slate-600">[{rec.status.toUpperCase()}] {rec.note}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditSession(att)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold"
                      >
                        <Edit2 className="w-3 h-3 text-blue-600" />
                        Edit Presensi
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSession(att.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Hapus sesi ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal Edit Past Attendance Session */}
      {editingSession && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Edit Presensi Pertemuan #{editingSession.meeting_number}
                </h3>
              </div>
              <button onClick={() => setEditingSession(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedSession} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pertemuan Ke-</label>
                  <input
                    type="number"
                    min={1}
                    value={editingSession.meeting_number}
                    onChange={(e) =>
                      setEditingSession({ ...editingSession, meeting_number: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={editingSession.date}
                    onChange={(e) => setEditingSession({ ...editingSession, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Topik Pembelajaran</label>
                <input
                  type="text"
                  required
                  value={editingSession.topic}
                  onChange={(e) => setEditingSession({ ...editingSession, topic: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              {/* Table of records */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <th className="py-2 px-3">Nama Siswa</th>
                      <th className="py-2 px-3 text-center">Status</th>
                      <th className="py-2 px-3">Keterangan / Alasan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {editingSession.records.map((rec, idx) => {
                      const studentUser = users.find((u) => u.id === rec.student_id);

                      return (
                        <tr key={rec.student_id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-semibold text-slate-800">
                            {studentUser?.name || rec.student_id}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <div className="inline-flex gap-1 bg-slate-100 p-0.5 rounded-lg">
                              {(['hadir', 'izin', 'sakit', 'alpa'] as const).map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => {
                                    const updatedRecs = [...editingSession.records];
                                    updatedRecs[idx] = { ...updatedRecs[idx], status: st };
                                    setEditingSession({ ...editingSession, records: updatedRecs });
                                  }}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    rec.status === st
                                      ? 'bg-blue-600 text-white shadow-xs'
                                      : 'text-slate-600 hover:text-slate-900'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={rec.note || ''}
                              placeholder="Keterangan..."
                              onChange={(e) => {
                                const updatedRecs = [...editingSession.records];
                                updatedRecs[idx] = { ...updatedRecs[idx], note: e.target.value };
                                setEditingSession({ ...editingSession, records: updatedRecs });
                              }}
                              className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleDeleteSession(editingSession.id)}
                  className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold"
                >
                  Hapus Sesi Ini
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingSession(null)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
