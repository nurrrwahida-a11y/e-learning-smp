import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Plus,
  Trash2,
  Video,
  FileText,
  Eye,
  X,
  Upload,
  FileCode,
  FileSpreadsheet,
  Presentation,
  Music,
  Image as ImageIcon,
  Archive,
  Download,
  CheckCircle2,
  Paperclip,
  Search,
  FileDown,
} from 'lucide-react';
import { Lesson, AttachmentFile, AttachmentFileType } from '../../types';
import { downloadLessonPDF, downloadLessonTXT, getSchoolInfoFromSettings } from '../../utils/exportUtils';
import { MaterialDownloadDropdown } from '../common/MaterialDownloadDropdown';

export const TeacherMaterials: React.FC = () => {
  const {
    currentUser,
    teachingAssignments,
    classes,
    subjects,
    lessons,
    systemSettings,
    addLesson,
    deleteLesson,
    showToast,
  } = useApp();

  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    chapter: '',
    description: '',
    content_text: '',
    video_url: '',
    class_id: 'cls-7a',
    subject_id: 'sbj-mtk',
    status: 'published' as 'published' | 'draft',
  });

  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [newAttachmentType, setNewAttachmentType] = useState<AttachmentFileType>('pdf');
  const [newAttachmentSize, setNewAttachmentSize] = useState('2.4 MB');

  const myAllocations = teachingAssignments.filter((ta) => ta.teacher_id === currentUser?.id);
  const myClassIds = Array.from(new Set(myAllocations.map((ta) => ta.class_id)));
  const myClasses = classes.filter((c) => myClassIds.includes(c.id));

  // Lessons created by this teacher, filtered by class and real-time search
  const filteredLessons = lessons.filter((l) => {
    if (l.teacher_id !== currentUser?.id) return false;
    if (selectedClassFilter !== 'semua' && l.class_id !== selectedClassFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = l.title.toLowerCase().includes(q);
      const matchChapter = l.chapter.toLowerCase().includes(q);
      const matchDesc = l.description.toLowerCase().includes(q);
      if (!matchTitle && !matchChapter && !matchDesc) return false;
    }

    return true;
  });

  const handleAddAttachment = () => {
    if (!newAttachmentName.trim()) {
      showToast('Masukkan nama berkas lampiran terlebih dahulu.', 'error');
      return;
    }
    const newAtt: AttachmentFile = {
      id: `att-${Date.now()}`,
      name: newAttachmentName.trim(),
      file_type: newAttachmentType,
      file_size: newAttachmentSize || '1.5 MB',
      download_url: '#',
    };
    setAttachments((prev) => [...prev, newAtt]);
    setNewAttachmentName('');
    showToast('Lampiran berkas ditambahkan ke draf materi!', 'info');
  };

  const handleFileUploadSimulated = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    let detectedType: AttachmentFileType = 'other';
    if (['pdf'].includes(extension)) detectedType = 'pdf';
    else if (['doc', 'docx'].includes(extension)) detectedType = 'doc';
    else if (['ppt', 'pptx'].includes(extension)) detectedType = 'ppt';
    else if (['xls', 'xlsx', 'csv'].includes(extension)) detectedType = 'xls';
    else if (['mp4', 'mkv', 'avi', 'mov'].includes(extension)) detectedType = 'video';
    else if (['mp3', 'wav', 'aac'].includes(extension)) detectedType = 'audio';
    else if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(extension)) detectedType = 'image';
    else if (['zip', 'rar', '7z'].includes(extension)) detectedType = 'zip';

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);

    const newAtt: AttachmentFile = {
      id: `att-${Date.now()}`,
      name: file.name,
      file_type: detectedType,
      file_size: `${sizeInMb} MB`,
      download_url: '#',
    };

    setAttachments((prev) => [...prev, newAtt]);
    showToast(`Berkas "${file.name}" berhasil diunggah!`, 'success');
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const addPresetAttachment = (type: AttachmentFileType, label: string, size: string) => {
    const extMap: Record<AttachmentFileType, string> = {
      pdf: '.pdf',
      doc: '.docx',
      ppt: '.pptx',
      xls: '.xlsx',
      video: '.mp4',
      audio: '.mp3',
      image: '.png',
      zip: '.zip',
      other: '.dat',
    };
    const newAtt: AttachmentFile = {
      id: `att-${Date.now()}`,
      name: `${label}${extMap[type]}`,
      file_type: type,
      file_size: size,
      download_url: '#',
    };
    setAttachments((prev) => [...prev, newAtt]);
    showToast(`Lampiran preset ${label} ditambahkan!`, 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.chapter.trim() || !formData.content_text.trim()) {
      showToast('Judul, Bab, dan Isi Materi wajib diisi.', 'error');
      return;
    }

    addLesson({
      title: formData.title.trim(),
      chapter: formData.chapter.trim(),
      description: formData.description.trim(),
      content_text: formData.content_text.trim(),
      video_url: formData.video_url.trim() || undefined,
      attachment_name: attachments.length > 0 ? attachments[0].name : undefined,
      attachments: attachments.length > 0 ? attachments : undefined,
      class_id: formData.class_id,
      subject_id: formData.subject_id,
      teacher_id: currentUser?.id || 'usr-guru-1',
      status: formData.status,
      order_index: lessons.length + 1,
    });

    setShowAddModal(false);
    setFormData({
      title: '',
      chapter: '',
      description: '',
      content_text: '',
      video_url: '',
      class_id: myClasses[0]?.id || 'cls-7a',
      subject_id: 'sbj-mtk',
      status: 'published',
    });
    setAttachments([]);
  };

  const renderFileBadge = (type: AttachmentFileType) => {
    switch (type) {
      case 'pdf':
        return <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">PDF</span>;
      case 'ppt':
        return <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px]">PowerPoint</span>;
      case 'doc':
        return <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[10px]">Word DOC</span>;
      case 'xls':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">Excel XLS</span>;
      case 'video':
        return <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[10px]">Video MP4</span>;
      case 'audio':
        return <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[10px]">Audio MP3</span>;
      case 'image':
        return <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-200 font-bold text-[10px]">Gambar</span>;
      case 'zip':
        return <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[10px]">ZIP Arsip</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[10px]">Berkas</span>;
    }
  };

  const renderFileIcon = (type: AttachmentFileType) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-600" />;
      case 'ppt':
        return <Presentation className="w-4 h-4 text-amber-600" />;
      case 'doc':
        return <FileCode className="w-4 h-4 text-blue-600" />;
      case 'xls':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
      case 'video':
        return <Video className="w-4 h-4 text-purple-600" />;
      case 'audio':
        return <Music className="w-4 h-4 text-indigo-600" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-cyan-600" />;
      case 'zip':
        return <Archive className="w-4 h-4 text-slate-600" />;
      default:
        return <Paperclip className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Materi Pembelajaran Digital
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Publikasikan materi bab terstruktur, video pembelajaran, dan upload berkas pendukung (PDF, Word, PPT, Excel, Video, Audio, ZIP).
          </p>
        </div>

        <button
          onClick={() => {
            if (myClasses.length > 0) setFormData((prev) => ({ ...prev, class_id: myClasses[0].id }));
            setAttachments([]);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Terbitkan Materi Baru
        </button>
      </div>

      {/* Filter by class & Auto-search */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Filter Kelas Diampu:</span>
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none"
          >
            <option value="semua">Semua Kelas ({filteredLessons.length} Materi)</option>
            {myClasses.map((c) => (
              <option key={c.id} value={c.id}>
                Kelas {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi otomatis..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Lessons List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredLessons.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
            Belum ada materi yang diterbitkan pada kelas ini. Klik tombol "Terbitkan Materi Baru".
          </div>
        ) : (
          filteredLessons.map((lsn) => {
            const cls = classes.find((c) => c.id === lsn.class_id);
            const sbj = subjects.find((s) => s.id === lsn.subject_id);
            const lessonAttachments = lsn.attachments || (lsn.attachment_name ? [
              {
                id: 'att-legacy',
                name: lsn.attachment_name,
                file_type: 'pdf' as AttachmentFileType,
                file_size: '2.5 MB',
                download_url: '#',
              }
            ] : []);

            return (
              <div
                key={lsn.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                      Kelas {cls?.name} • {sbj?.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        lsn.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {lsn.status === 'published' ? 'Diterbitkan' : 'Draf'}
                    </span>
                  </div>

                  <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-wider">
                    {lsn.chapter}
                  </p>
                  <h3 className="font-extrabold text-base text-slate-900 mt-0.5 leading-snug">
                    {lsn.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {lsn.description}
                  </p>

                  {/* Multi-type file attachments preview */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    {lsn.video_url && (
                      <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold">
                        <Video className="w-3.5 h-3.5" />
                        <span>Video Terkait</span>
                      </div>
                    )}

                    {lessonAttachments.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {lessonAttachments.map((att) => (
                          <div
                            key={att.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700"
                          >
                            {renderFileIcon(att.file_type)}
                            <span className="font-medium truncate max-w-[130px]">{att.name}</span>
                            <span className="text-slate-400 text-[10px]">({att.file_size})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setViewingLesson(lsn)}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Buka Rincian
                  </button>
                  <div className="flex items-center gap-1.5">
                    <MaterialDownloadDropdown
                      lesson={lsn}
                      subjectName={sbj?.name || 'Mata Pelajaran'}
                      teacherName={currentUser?.name || 'Dewan Guru'}
                      variant="compact"
                    />
                    <button
                      onClick={() => {
                        if (window.confirm('Hapus materi pembelajaran ini?')) {
                          deleteLesson(lsn.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Hapus Materi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Add Material with Multi-type File Upload */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900">Publikasi Materi Pembelajaran</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pilih Kelas *</label>
                  <select
                    value={formData.class_id}
                    onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold bg-white"
                  >
                    {myClasses.map((c) => (
                      <option key={c.id} value={c.id}>
                        Kelas {c.name} (Jenjang {c.grade})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Publikasi</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold bg-white"
                  >
                    <option value="published">Langsung Diterbitkan (Dapat diakses murid)</option>
                    <option value="draft">Simpan Sebagai Draf</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bab / Topik Bahasan *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Bab 3: Bentuk Aljabar dan Persamaan Linier"
                  value={formData.chapter}
                  onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Materi Pertemuan *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Menyelesaikan Operasi Perkalian dan Pembagian Aljabar"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ringkasan Singkat</label>
                <input
                  type="text"
                  placeholder="Penjelasan ringkas tentang apa yang akan dipelajari murid..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Isi Materi Lengkap (Format Teks & Rangkuman) *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Ketik teks penjelasan materi secara rinci di sini..."
                  value={formData.content_text}
                  onChange={(e) => setFormData({ ...formData, content_text: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl leading-relaxed text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tautan Video Pembelajaran (YouTube / Google Drive)</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Upload Berkas Multi-Format */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-800">Unggah Lampiran Berkas Pembelajaran</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Mendukung PDF, PPT, Word, Excel, Video, MP3, ZIP</span>
                </div>

                {/* Upload Action area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-white rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUploadSimulated}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.mp4,.mp3,.zip,.rar,.png,.jpg,.jpeg"
                    />
                    <Upload className="w-5 h-5 text-blue-500 mb-1" />
                    <span className="font-bold text-slate-700 text-xs">Pilih Berkas dari Perangkat</span>
                    <span className="text-[10px] text-slate-400">Klik untuk menjelajah file lokal</span>
                  </label>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-semibold text-slate-600 text-[11px] block">Atau Tambah Preset Berkas:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => addPresetAttachment('pdf', 'Modul_Pembelajaran_Bab_Lengkap', '3.8 MB')}
                        className="px-2 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold hover:bg-rose-100"
                      >
                        + Modul PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => addPresetAttachment('ppt', 'Slide_Presentasi_Kelas', '5.2 MB')}
                        className="px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold hover:bg-amber-100"
                      >
                        + Slide PPTX
                      </button>
                      <button
                        type="button"
                        onClick={() => addPresetAttachment('doc', 'Lembar_Kerja_Peserta_Didik', '1.1 MB')}
                        className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold hover:bg-blue-100"
                      >
                        + LKPD DOCX
                      </button>
                      <button
                        type="button"
                        onClick={() => addPresetAttachment('xls', 'Tabel_Data_Latihan_Murid', '840 KB')}
                        className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold hover:bg-emerald-100"
                      >
                        + Data Excel
                      </button>
                    </div>
                  </div>
                </div>

                {/* Manual Attachment Entry */}
                <div className="flex gap-2 items-center bg-white p-2 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    placeholder="Nama file lampiran manual..."
                    value={newAttachmentName}
                    onChange={(e) => setNewAttachmentName(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                  <select
                    value={newAttachmentType}
                    onChange={(e) => setNewAttachmentType(e.target.value as AttachmentFileType)}
                    className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    <option value="pdf">PDF (.pdf)</option>
                    <option value="ppt">PowerPoint (.pptx)</option>
                    <option value="doc">Word (.docx)</option>
                    <option value="xls">Excel (.xlsx)</option>
                    <option value="video">Video (.mp4)</option>
                    <option value="audio">Audio (.mp3)</option>
                    <option value="image">Gambar (.png/.jpg)</option>
                    <option value="zip">Arsip (.zip)</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddAttachment}
                    className="px-3 py-1.5 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900"
                  >
                    Tambah
                  </button>
                </div>

                {/* Attached Files List */}
                {attachments.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="font-bold text-slate-700 text-[11px]">
                      Berkas Terlampir ({attachments.length}):
                    </span>
                    <div className="space-y-1">
                      {attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            {renderFileIcon(att.file_type)}
                            <span className="font-bold text-slate-800">{att.name}</span>
                            {renderFileBadge(att.file_type)}
                            <span className="text-slate-400 text-[10px]">({att.file_size})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(att.id)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                            title="Hapus berkas ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-md shadow-blue-500/20"
                >
                  Simpan & Terbitkan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal View Material Preview */}
      {viewingLesson && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase">{viewingLesson.chapter}</span>
                <h3 className="font-black text-xl text-slate-900 mt-1">{viewingLesson.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingLesson(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0 cursor-pointer"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 text-xs text-slate-700 leading-relaxed whitespace-pre-line border-b border-slate-100">
              {viewingLesson.content_text}
            </div>

            {viewingLesson.video_url && (
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-rose-600" />
                  <span className="font-semibold text-slate-800">Tautan Video Pembelajaran</span>
                </div>
                <a
                  href={viewingLesson.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-blue-600 hover:underline"
                >
                  {viewingLesson.video_url}
                </a>
              </div>
            )}

            {/* Single Clean Material Download Control with Format Selection */}
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                  Unduh Berkas Pembelajaran
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Format tersedia: Dokumen Modul PDF resmi, Microsoft Word (.docx), slide presentasi (.pptx), atau paket arsip.
                </p>
              </div>
              <MaterialDownloadDropdown
                lesson={viewingLesson}
                subjectName={subjects.find((s) => s.id === viewingLesson.subject_id)?.name || 'Mata Pelajaran'}
                teacherName={currentUser?.name || 'Dewan Guru'}
                variant="primary"
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingLesson(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
