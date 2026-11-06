import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  ChevronDown,
  FileText,
  FileCode,
  FileSpreadsheet,
  Archive,
  Check,
  Sparkles,
} from 'lucide-react';
import { Lesson, AttachmentFile, SystemSettings } from '../../types';
import {
  downloadLessonPDF,
  downloadLessonDocx,
  downloadLessonPptx,
  downloadLessonTXT,
  getSchoolInfoFromSettings,
} from '../../utils/exportUtils';
import { useApp } from '../../context/AppContext';

interface MaterialDownloadDropdownProps {
  lesson: Lesson;
  subjectName?: string;
  teacherName?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'compact';
  onDownloaded?: (fileName: string) => void;
}

export const MaterialDownloadDropdown: React.FC<MaterialDownloadDropdownProps> = ({
  lesson,
  subjectName = 'Mata Pelajaran',
  teacherName = 'Guru Pengampu',
  className = '',
  variant = 'primary',
  onDownloaded,
}) => {
  const { systemSettings, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const schoolInfo = getSchoolInfoFromSettings(systemSettings);

  const attachments: AttachmentFile[] =
    lesson.attachments && lesson.attachments.length > 0
      ? lesson.attachments
      : lesson.attachment_name
      ? [
          {
            id: 'att-default',
            name: lesson.attachment_name,
            file_type: 'pdf',
            file_size: '2.5 MB',
          },
        ]
      : [];

  const handleDownloadPDF = () => {
    setIsOpen(false);
    downloadLessonPDF(lesson, subjectName, teacherName, schoolInfo);
    showToast(`Mengunduh modul "${lesson.title}" format PDF resmi...`, 'success');
    onDownloaded?.(`${lesson.title}.pdf`);
  };

  const handleDownloadDOCX = () => {
    setIsOpen(false);
    downloadLessonDocx(lesson, subjectName, teacherName, schoolInfo.name);
    showToast(`Mengunduh modul "${lesson.title}" format Word (.docx)...`, 'success');
    onDownloaded?.(`${lesson.title}.docx`);
  };

  const handleDownloadPPTX = () => {
    setIsOpen(false);
    downloadLessonPptx(lesson, subjectName);
    showToast(`Mengunduh bahan ajar slide "${lesson.title}" format PowerPoint (.pptx)...`, 'success');
    onDownloaded?.(`${lesson.title}.pptx`);
  };

  const handleDownloadTXT = () => {
    setIsOpen(false);
    downloadLessonTXT(lesson, subjectName, teacherName, schoolInfo.name);
    showToast(`Mengunduh rangkuman teks "${lesson.title}"...`, 'success');
    onDownloaded?.(`${lesson.title}.txt`);
  };

  const handleDownloadAttachment = (att: AttachmentFile) => {
    setIsOpen(false);
    if (att.file_type === 'pdf') {
      downloadLessonPDF(lesson, subjectName, teacherName, schoolInfo);
    } else if (att.file_type === 'doc') {
      downloadLessonDocx(lesson, subjectName, teacherName, schoolInfo.name);
    } else if (att.file_type === 'ppt') {
      downloadLessonPptx(lesson, subjectName);
    } else {
      downloadLessonTXT(lesson, subjectName, teacherName, schoolInfo.name);
    }
    showToast(`Mengunduh berkas "${att.name}" (${att.file_size})...`, 'info');
    onDownloaded?.(att.name);
  };

  const handleDownloadAllZip = () => {
    setIsOpen(false);
    downloadLessonPDF(lesson, subjectName, teacherName, schoolInfo);
    setTimeout(() => {
      downloadLessonDocx(lesson, subjectName, teacherName, schoolInfo.name);
    }, 400);
    showToast(`Mengunduh paket berkas lengkap (PDF + DOCX) materi "${lesson.title}"...`, 'success');
    onDownloaded?.(`paket_${lesson.title}.zip`);
  };

  // Button styles
  const buttonStyle =
    variant === 'compact'
      ? 'px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 shadow-2xs'
      : variant === 'secondary'
      ? 'px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs'
      : 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs';

  return (
    <div className={`relative inline-block text-left no-print ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 transition-all cursor-pointer ${buttonStyle}`}
        title="Pilih versi unduhan materi (PDF, DOCX, PPTX, dll)"
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span>Unduh Materi</span>
        <span className="hidden sm:inline-block text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-black/10">
          {attachments.length > 0 ? `${attachments.length} Versi` : 'Pilihan'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white shadow-2xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3.5 py-2 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Pilih Versi / Format Berkas
              </p>
              <span className="text-[10px] text-blue-600 font-bold">1 Tombol Praktis</span>
            </div>
            <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{lesson.title}</p>
          </div>

          <div className="p-1.5 space-y-1 max-h-80 overflow-y-auto">
            {/* Primary Format: PDF Resmi */}
            <button
              type="button"
              role="menuitem"
              onClick={handleDownloadPDF}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50/80 flex items-center justify-between transition-colors group cursor-pointer border border-transparent hover:border-rose-200"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-rose-900 truncate">
                      Dokumen Modul PDF Resmi
                    </p>
                    <span className="text-[9px] font-extrabold px-1 rounded bg-rose-100 text-rose-700 shrink-0">
                      Utama
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">Siap cetak, kop sekolah, & arsip (.pdf)</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 shrink-0">2.5 MB</span>
            </button>

            {/* Word / DOCX Format */}
            <button
              type="button"
              role="menuitem"
              onClick={handleDownloadDOCX}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50/80 flex items-center justify-between transition-colors group cursor-pointer border border-transparent hover:border-blue-200"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileCode className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-blue-900 truncate">
                    Microsoft Word (.docx)
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight">Dapat diedit & disunting guru/siswa</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 shrink-0">1.8 MB</span>
            </button>

            {/* PowerPoint / PPTX Format */}
            <button
              type="button"
              role="menuitem"
              onClick={handleDownloadPPTX}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-amber-50/80 flex items-center justify-between transition-colors group cursor-pointer border border-transparent hover:border-amber-200"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-amber-900 truncate">
                    Bahan Tayang Slide (.pptx)
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight">Garis besar materi untuk presentasi</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 shrink-0">3.2 MB</span>
            </button>

            {/* Custom Attachments from Teacher if present */}
            {attachments.length > 0 && (
              <div className="pt-1.5 mt-1 border-t border-slate-100">
                <p className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Lampiran Khusus Guru Pengampu ({attachments.length}):
                </p>
                {attachments.map((att) => (
                  <button
                    key={att.id}
                    type="button"
                    role="menuitem"
                    onClick={() => handleDownloadAttachment(att)}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 flex items-center justify-between transition-colors text-xs text-slate-700 group cursor-pointer"
                  >
                    <span className="truncate font-semibold max-w-[190px]">{att.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">({att.file_size})</span>
                  </button>
                ))}
              </div>
            )}

            {/* Package Download */}
            <div className="pt-1.5 mt-1 border-t border-slate-100">
              <button
                type="button"
                role="menuitem"
                onClick={handleDownloadAllZip}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 text-indigo-700 flex items-center gap-2.5 transition-colors font-bold text-xs group cursor-pointer border border-slate-200 hover:border-indigo-200"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Archive className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-indigo-900">Unduh Paket Lengkap (.ZIP)</p>
                  <p className="text-[10px] text-indigo-600 font-normal">Semua versi materi dalam satu unduhan</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
