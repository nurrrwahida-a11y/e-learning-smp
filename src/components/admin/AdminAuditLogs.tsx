import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Search, Filter, Clock, Terminal, GraduationCap, UserCheck, BookOpen, User } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs, systemSettings } = useApp();
  const [searchFilter, setSearchFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<'semua' | 'admin' | 'guru' | 'murid'>('semua');

  const filtered = auditLogs.filter((log) => {
    if (roleFilter !== 'semua' && log.user_role !== roleFilter) return false;
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      log.user_name.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.user_role.toLowerCase().includes(q)
    );
  });

  const adminLogsCount = auditLogs.filter((l) => l.user_role === 'admin').length;
  const teacherLogsCount = auditLogs.filter((l) => l.user_role === 'guru').length;
  const studentLogsCount = auditLogs.filter((l) => l.user_role === 'murid').length;

  const schoolTitle = systemSettings?.schoolName || systemSettings?.school_name || 'SMP N 1 JAYA';

  return (
    <div className="space-y-6">
      {/* Top Header & Actions — Hidden on Print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Riwayat Audit Log & Keamanan Sistem
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Pencatatan real-time jejak aktivitas sistem. Jam dan tanggal disinkronkan otomatis sesuai penggunaan waktu di perangkat Anda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Waktu Perangkat Aktif</span>
          </div>
        </div>
      </div>

      {/* Stats Summary Cards — Hidden on Print */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 no-print">
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Jejak Log</p>
          <p className="text-xl font-black text-slate-900 mt-0.5">{auditLogs.length}</p>
          <span className="text-[10px] text-slate-500 font-medium">Sinkron dengan sistem</span>
        </div>
        <div className="p-3.5 bg-white rounded-2xl border border-purple-200 bg-purple-50/20 shadow-2xs">
          <p className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Aktivitas Admin</p>
          <p className="text-xl font-black text-purple-900 mt-0.5">{adminLogsCount}</p>
          <span className="text-[10px] text-purple-600 font-medium">Pengaturan & Akun</span>
        </div>
        <div className="p-3.5 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Aktivitas Guru</p>
          <p className="text-xl font-black text-emerald-900 mt-0.5">{teacherLogsCount}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Materi, Tugas, Nilai</span>
        </div>
        <div className="p-3.5 bg-white rounded-2xl border border-blue-200 bg-blue-50/20 shadow-2xs">
          <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Aktivitas Murid</p>
          <p className="text-xl font-black text-blue-900 mt-0.5">{studentLogsCount}</p>
          <span className="text-[10px] text-blue-600 font-medium">Pengumpulan & Asesmen</span>
        </div>
      </div>

      {/* Filter and Search Bar — Hidden on Print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 no-print">
        {/* Role Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setRoleFilter('semua')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              roleFilter === 'semua'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Role ({auditLogs.length})
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              roleFilter === 'admin'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Admin ({adminLogsCount})
          </button>
          <button
            onClick={() => setRoleFilter('guru')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              roleFilter === 'guru'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Guru ({teacherLogsCount})
          </button>
          <button
            onClick={() => setRoleFilter('murid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              roleFilter === 'murid'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Murid ({studentLogsCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari aksi, nama, atau detail..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Printable Area */}
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
                {schoolTitle}
              </h1>
              <p className="text-[10px] text-slate-600">
                {systemSettings?.address || 'Jl. Pendidikan Mandiri No. 45, Kebayoran Baru, Jakarta Selatan'} • Telp: {systemSettings?.phone || '(021) 7890-1234'}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-300">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
              LAPORAN AUDIT LOG & JEJAK KEAMANAN SISTEM E-LEARNING
            </h2>
            <p className="text-[11px] text-slate-500">
              Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Waktu (Jam Sistem Perangkat)</th>
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Aksi Sistem</th>
                <th className="py-3 px-4">Rincian Aktivitas</th>
                <th className="py-3 px-4">Alamat IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Tidak ada catatan aktivitas yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 font-mono text-[11px]">
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{log.timestamp}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-sans font-bold text-slate-900 whitespace-nowrap">
                      {log.user_name}
                      <span
                        className={`inline-block ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-mono uppercase ${
                          log.user_role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : log.user_role === 'guru'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {log.user_role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-700 max-w-md">
                      {log.details}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[10px] whitespace-nowrap">
                      {log.ip_address}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
