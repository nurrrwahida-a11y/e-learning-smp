import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { SystemSettings } from '../types';

export interface ReportSchoolInfo {
  name: string;
  address: string;
  phone: string;
  email?: string;
  npsn?: string;
  accreditation?: string;
  headmaster?: string;
  headmasterNip?: string;
}

export const getSchoolInfoFromSettings = (settings?: SystemSettings): ReportSchoolInfo => {
  return {
    name: settings?.schoolName || settings?.school_name || 'SMP N 1 JAYA',
    address: settings?.address || settings?.school_address || 'Jl. Pendidikan Mandiri No. 45, Kebayoran Baru, Jakarta Selatan',
    phone: settings?.phone || settings?.school_phone || '(021) 7890-1234',
    email: settings?.email || settings?.school_email || 'info@smpn1jaya.sch.id',
    npsn: settings?.npsn || settings?.school_npsn || '20104589',
    accreditation: settings?.accreditation || settings?.school_accreditation || 'A (Unggul)',
    headmaster: settings?.headmasterName || settings?.headmaster_name || 'Drs. H. Mulyadi Kusuma, M.Pd.',
    headmasterNip: settings?.headmasterNip || settings?.headmaster_nip || '196803121994031005',
  };
};

/**
 * Generate and download an Excel (.xlsx) file
 */
export const downloadExcel = (
  filename: string,
  sheetName: string,
  headers: string[],
  rows: (string | number)[][]
) => {
  const wb = XLSX.utils.book_new();
  const wsData = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  const colWidths = headers.map((h, i) => {
    let maxLen = h.length;
    rows.forEach((r) => {
      const valStr = r[i] !== undefined && r[i] !== null ? String(r[i]) : '';
      if (valStr.length > maxLen) maxLen = valStr.length;
    });
    return { wch: Math.min(Math.max(maxLen + 3, 10), 40) };
  });
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
  const safeFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  XLSX.writeFile(wb, safeFilename);
};

/**
 * Generate and download an Admin Academic Report PDF
 */
export const downloadAdminReportPDF = (
  schoolInfo: ReportSchoolInfo,
  selectedClassName: string,
  studentsData: Array<{
    no: number;
    nis: string;
    name: string;
    className: string;
    completedLessons: number;
    assignmentsCount: number;
    avgScore: number;
    quizScore: number;
    overallScore: number;
    predikat: string;
  }>
) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Kop Surat
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('PEMERINTAH DAERAH DINAS PENDIDIKAN & KEBUDAYAAN', 148.5, 14, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(schoolInfo.name.toUpperCase(), 148.5, 21, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`${schoolInfo.address} • Telp: ${schoolInfo.phone} • Email: ${schoolInfo.email}`, 148.5, 26, { align: 'center' });

  // Divider Line
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.6);
  doc.line(14, 29, 283, 29);
  doc.setLineWidth(0.2);
  doc.line(14, 30, 283, 30);

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('REKAPITULASI LAPORAN HASIL BELAJAR SISWA', 148.5, 37, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const filterLabel = selectedClassName === 'semua' ? 'Semua Rombongan Belajar (Kelas VII - IX)' : `Kelas ${selectedClassName}`;
  doc.text(`${filterLabel} • Semester Ganjil TA 2026/2027 • Kurikulum SMP Merdeka`, 148.5, 42, { align: 'center' });

  // Table Data
  const tableHeaders = [
    ['No', 'NIS', 'Nama Peserta Didik', 'Rombel', 'Materi Tuntas', 'Tugas Dikumpul', 'Rerata Tugas', 'Skor CBT', 'Predikat']
  ];

  const tableBody = studentsData.map((s) => [
    s.no,
    s.nis,
    s.name,
    s.className,
    `${s.completedLessons} Bab`,
    `${s.assignmentsCount} Tugas`,
    s.avgScore > 0 ? s.avgScore : '-',
    s.quizScore > 0 ? s.quizScore : '-',
    s.predikat,
  ]);

  autoTable(doc, {
    startY: 46,
    head: tableHeaders,
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 58, 138], // Navy
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'center', cellWidth: 22 },
      2: { cellWidth: 65, fontStyle: 'bold' },
      3: { halign: 'center', cellWidth: 26 },
      4: { halign: 'center', cellWidth: 28 },
      5: { halign: 'center', cellWidth: 28 },
      6: { halign: 'center', cellWidth: 28 },
      7: { halign: 'center', cellWidth: 28 },
      8: { halign: 'center', cellWidth: 36, fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  // Footer / Signatures
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  if (finalY < 185) {
    const printDate = new Date().toLocaleDateString('id-ID', { dateStyle: 'long' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);

    doc.text('Mengetahui,', 220, finalY);
    doc.text(`Jakarta, ${printDate}`, 220, finalY + 4);
    doc.text('Kepala Sekolah / Administrator', 220, finalY + 8);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(schoolInfo.headmaster || 'Drs. H. Mulyadi Kusuma, M.Pd.', 220, finalY + 28);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`NIP. ${schoolInfo.headmasterNip || '196803121994031005'}`, 220, finalY + 32);

    doc.text(`Dicetak otomatis dari Sistem E-Learning ${schoolInfo.name || 'SMP N 1 JAYA'}`, 14, finalY + 32);
  }

  doc.save('laporan_rekapitulasi_akademik_smp.pdf');
};

/**
 * Generate and download a Teacher Grade Recap PDF
 */
export const downloadTeacherGradesPDF = (
  schoolInfo: ReportSchoolInfo,
  teacherName: string,
  className: string,
  gradeConfig: { tugas_weight: number; kuis_weight: number; ujian_weight: number },
  studentsData: Array<{
    no: number;
    nis: string;
    name: string;
    tugasAvg: number;
    kuisAvg: number;
    ujianScore: number;
    finalScore: number;
    predikat: string;
    status: string;
  }>
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Kop Surat
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('PEMERINTAH DAERAH DINAS PENDIDIKAN & KEBUDAYAAN', 105, 12, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(schoolInfo.name.toUpperCase(), 105, 18, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`${schoolInfo.address} • Telp: ${schoolInfo.phone}`, 105, 22, { align: 'center' });

  // Divider Line
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.6);
  doc.line(14, 25, 196, 25);
  doc.setLineWidth(0.2);
  doc.line(14, 26, 196, 26);

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`REKAPITULASI NILAI AKADEMIK SISWA — KELAS ${className}`, 105, 33, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Guru Pengajar: ${teacherName} • Bobot: ${gradeConfig.tugas_weight}% Tugas, ${gradeConfig.kuis_weight}% Kuis, ${gradeConfig.ujian_weight}% Ujian • KKM: 75`, 105, 38, { align: 'center' });

  // Table Data
  const tableHeaders = [
    ['No', 'NIS', 'Nama Peserta Didik', `Tugas\n(${gradeConfig.tugas_weight}%)`, `Kuis\n(${gradeConfig.kuis_weight}%)`, `Ujian\n(${gradeConfig.ujian_weight}%)`, 'Nilai\nAkhir', 'Pred', 'Status']
  ];

  const tableBody = studentsData.map((s) => [
    s.no,
    s.nis,
    s.name,
    s.tugasAvg,
    s.kuisAvg,
    s.ujianScore,
    s.finalScore,
    s.predikat,
    s.status,
  ]);

  autoTable(doc, {
    startY: 42,
    head: tableHeaders,
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [16, 185, 129], // Emerald
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { halign: 'center', cellWidth: 18 },
      2: { cellWidth: 52, fontStyle: 'bold' },
      3: { halign: 'center', cellWidth: 18 },
      4: { halign: 'center', cellWidth: 18 },
      5: { halign: 'center', cellWidth: 18 },
      6: { halign: 'center', cellWidth: 18, fontStyle: 'bold' },
      7: { halign: 'center', cellWidth: 14, fontStyle: 'bold' },
      8: { halign: 'center', cellWidth: 20 },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  // Signatures
  const finalY = (doc as any).lastAutoTable.finalY + 12;
  if (finalY < 250) {
    const printDate = new Date().toLocaleDateString('id-ID', { dateStyle: 'long' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);

    doc.text(`Jakarta, ${printDate}`, 145, finalY);
    doc.text('Guru Mata Pelajaran,', 145, finalY + 4);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(teacherName, 145, finalY + 22);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Mengetahui, Kepala Sekolah', 20, finalY + 4);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(schoolInfo.headmaster || 'Drs. H. Mulyadi Kusuma, M.Pd.', 20, finalY + 22);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`NIP. ${schoolInfo.headmasterNip || '196803121994031005'}`, 20, finalY + 26);
  }

  doc.save(`rekap_nilai_kelas_${className.replace(/\s+/g, '_')}.pdf`);
};

/**
 * Generate and download Student Grade Report (Rapor Nilai Siswa) PDF
 */
export const downloadStudentGradesPDF = (
  schoolInfo: ReportSchoolInfo,
  studentName: string,
  nis: string,
  nisn: string,
  className: string,
  homeroomTeacher: { name: string; nip: string },
  gradesData: Array<{
    no: number;
    subjectName: string;
    subjectCode: string;
    kkm: number;
    tugasAvg: number;
    kuisAvg: number;
    ujianScore: number;
    finalScore: number;
    letterGrade: string;
    isPassed: boolean;
  }>,
  averageFinalScore: number,
  overallLetter: string
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Kop Surat
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('PEMERINTAH DAERAH DINAS PENDIDIKAN & KEBUDAYAAN', 105, 12, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(schoolInfo.name.toUpperCase(), 105, 18, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`${schoolInfo.address} • Telp: ${schoolInfo.phone} • Email: ${schoolInfo.email}`, 105, 22, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`NPSN: ${schoolInfo.npsn} • Akreditasi: ${schoolInfo.accreditation}`, 105, 26, { align: 'center' });

  // Divider Line
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.6);
  doc.line(14, 28, 196, 28);
  doc.setLineWidth(0.2);
  doc.line(14, 29, 196, 29);

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('TRANSKRIP CAPAIAN HASIL BELAJAR SISWA (RAPOR SEMENTARA)', 105, 36, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Tahun Ajaran 2026/2027 Semester Ganjil • Kurikulum SMP Merdeka Belajar', 105, 41, { align: 'center' });

  // Student Identity Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 45, 182, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Nama Siswa', 18, 50);
  doc.text('NIS / NISN', 18, 57);

  doc.text('Rombel (Kelas)', 110, 50);
  doc.text('Status Kelayakan', 110, 57);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`:  ${studentName}`, 38, 50);
  doc.text(`:  ${nis} / ${nisn}`, 38, 57);

  doc.text(`:  Kelas ${className}`, 135, 50);
  doc.setTextColor(5, 150, 105); // Emerald
  doc.text(':  MEMENUHI KKM (LULUS)', 135, 57);

  // Grades Table
  const tableHeaders = [
    ['No', 'Mata Pelajaran', 'KKM', 'Tugas', 'Kuis', 'Ujian', 'Nilai Akhir', 'Pred', 'Keterangan']
  ];

  const tableBody = gradesData.map((g) => [
    g.no,
    `${g.subjectName} (${g.subjectCode})`,
    g.kkm,
    g.tugasAvg,
    g.kuisAvg,
    g.ujianScore,
    g.finalScore,
    g.letterGrade,
    g.isPassed ? 'Tuntas KKM' : 'Remidial',
  ]);

  // Add summary row
  tableBody.push([
    '',
    'RATA-RATA NILAI KESELURUHAN',
    '75',
    '-',
    '-',
    '-',
    String(averageFinalScore),
    overallLetter,
    'LULUS / BAIK',
  ]);

  autoTable(doc, {
    startY: 67,
    head: tableHeaders,
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [29, 78, 216], // Blue-700
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { cellWidth: 54, fontStyle: 'bold' },
      2: { halign: 'center', cellWidth: 14 },
      3: { halign: 'center', cellWidth: 16 },
      4: { halign: 'center', cellWidth: 16 },
      5: { halign: 'center', cellWidth: 16 },
      6: { halign: 'center', cellWidth: 20, fontStyle: 'bold' },
      7: { halign: 'center', cellWidth: 14, fontStyle: 'bold' },
      8: { halign: 'center', cellWidth: 24 },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  // Signatures (Orang Tua, Wali Kelas, Kepala Sekolah)
  const finalY = (doc as any).lastAutoTable.finalY + 14;
  if (finalY < 255) {
    const printDate = new Date().toLocaleDateString('id-ID', { dateStyle: 'long' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);

    // Left: Orang Tua
    doc.text('Mengetahui,', 20, finalY);
    doc.text('Orang Tua / Wali Siswa,', 20, finalY + 4);
    doc.text('........................................', 20, finalY + 22);

    // Center: Wali Kelas
    doc.text(`Wali Kelas ${className},`, 85, finalY);
    doc.text('Guru Pembimbing Akademik,', 85, finalY + 4);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(homeroomTeacher.name, 85, finalY + 22);
    doc.setFont('helvetica', 'normal');
    doc.text(`NIP. ${homeroomTeacher.nip}`, 85, finalY + 26);

    // Right: Kepala Sekolah
    doc.setTextColor(71, 85, 105);
    doc.text(`Jakarta, ${printDate}`, 150, finalY);
    doc.text(`Kepala Sekolah ${schoolInfo.name},`, 150, finalY + 4);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(schoolInfo.headmaster || 'Drs. H. Mulyadi Kusuma, M.Pd.', 150, finalY + 22);
    doc.setFont('helvetica', 'normal');
    doc.text(`NIP. ${schoolInfo.headmasterNip || '196803121994031005'}`, 150, finalY + 26);
  }

  const safeFilename = `rapor_nilai_${nis}_${studentName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
  doc.save(safeFilename);
};

/**
 * Generate and download a complete Lesson / Materi PDF document
 */
export const downloadLessonPDF = (
  lesson: {
    title: string;
    chapter: string;
    description: string;
    content_text: string;
    published_at: string;
  },
  subjectName: string,
  teacherName: string,
  schoolInfo: ReportSchoolInfo
) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Kop Surat
  doc.setFillColor(30, 58, 138); // blue-900
  doc.rect(0, 0, 210, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 58, 138);
  doc.text(schoolInfo.name || 'SMP N 1 JAYA', 105, 17, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`${schoolInfo.address} • Telp: ${schoolInfo.phone} • Email: ${schoolInfo.email || 'info@smpn1jaya.sch.id'}`, 105, 22, { align: 'center' });

  doc.setLineWidth(0.6);
  doc.setDrawColor(30, 58, 138);
  doc.line(14, 26, 196, 26);
  doc.setLineWidth(0.2);
  doc.line(14, 27.5, 196, 27.5);

  // Lesson Header Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 32, 182, 30, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 32, 182, 30, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(2, 132, 199); // sky-600
  doc.text(`${subjectName.toUpperCase()} — ${lesson.chapter.toUpperCase()}`, 18, 39);

  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(lesson.title, 18, 47);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Guru Pengampu: ${teacherName}  •  Tanggal Terbit: ${lesson.published_at.substring(0, 10)}  •  Kurikulum Merdeka SMP N 1 JAYA`, 18, 56);

  // Body Content Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 58, 138);
  doc.text('URAIAN LENGKAP MATERI PEMBELAJARAN:', 14, 70);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  // Clean markdown syntax for plain text PDF reading
  const cleanContent = lesson.content_text
    .replace(/^### /gm, '\n▶ ')
    .replace(/^## /gm, '\n■ ')
    .replace(/\*\*/g, '')
    .trim();

  const splitText = doc.splitTextToSize(cleanContent, 182);
  doc.text(splitText, 14, 76);

  // Footer on bottom of page
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.line(14, pageHeight - 14, 196, pageHeight - 14);

  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`Bahan Ajar Resmi E-Learning ${schoolInfo.name || 'SMP N 1 JAYA'} — Hak Cipta Dilindungi`, 14, pageHeight - 9);
  doc.text('Dokumen Digital Terverifikasi', 196, pageHeight - 9, { align: 'right' });

  const cleanTitle = lesson.title.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
  doc.save(`materi_${cleanTitle}_smp_n_1_jaya.pdf`);
};

/**
 * Download lesson summary as .txt file
 */
export const downloadLessonTXT = (
  lesson: {
    title: string;
    chapter: string;
    description: string;
    content_text: string;
    published_at: string;
  },
  subjectName: string,
  teacherName: string,
  schoolName: string
) => {
  const content = `=====================================================
${schoolName.toUpperCase()} — SISTEM INFORMASI E-LEARNING
MODUL MATERI PEMBELAJARAN LENGKAP
=====================================================

Mata Pelajaran : ${subjectName}
Bab / Unit     : ${lesson.chapter}
Judul Materi   : ${lesson.title}
Guru Pengampu  : ${teacherName}
Tanggal Rilis  : ${lesson.published_at}

Deskripsi Singkat:
${lesson.description}

-----------------------------------------------------
URAIAN MATERI:
-----------------------------------------------------

${lesson.content_text}

=====================================================
Hak Cipta © 2026 ${schoolName}
=====================================================`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const cleanTitle = lesson.title.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
  link.setAttribute('download', `materi_${cleanTitle}_smp_n_1_jaya.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate and download Attendance Session Report PDF
 */
export const downloadAttendancePDF = (
  schoolInfo: ReportSchoolInfo,
  className: string,
  meetingNo: number,
  topic: string,
  date: string,
  teacherName: string,
  records: Array<{
    no: number;
    nis: string;
    name: string;
    status: string;
    note: string;
  }>
) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Kop Surat
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('PEMERINTAH DAERAH DINAS PENDIDIKAN & KEBUDAYAAN', 105, 14, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(schoolInfo.name.toUpperCase(), 105, 20, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`${schoolInfo.address} • Telp: ${schoolInfo.phone}`, 105, 25, { align: 'center' });

  doc.setLineWidth(0.6);
  doc.setDrawColor(30, 41, 59);
  doc.line(14, 28, 196, 28);
  doc.setLineWidth(0.2);
  doc.line(14, 29.2, 196, 29.2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`DAFTAR PRESENSI KEHADIRAN SISWA — PERTEMUAN KE-${meetingNo}`, 105, 36, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Kelas: ${className}   |   Tanggal: ${date}   |   Topik: "${topic}"`, 105, 41, { align: 'center' });

  const tableRows = records.map((r) => [
    r.no,
    r.nis,
    r.name,
    r.status.toUpperCase(),
    r.note || '-',
  ]);

  autoTable(doc, {
    startY: 46,
    head: [['No', 'NIS', 'Nama Lengkap Siswa', 'Status', 'Catatan / Alasan']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { halign: 'center', cellWidth: 24 },
      2: { cellWidth: 65 },
      3: { halign: 'center', cellWidth: 24 },
      4: { cellWidth: 65 },
    },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 160;

  // Signatures
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Jakarta, ${date}`, 145, finalY + 12);
  doc.text('Guru Mata Pelajaran,', 145, finalY + 17);
  doc.setFont('helvetica', 'bold');
  doc.text(teacherName, 145, finalY + 35);
  doc.setFont('helvetica', 'normal');
  doc.text('NIP. Guru Pengampu', 145, finalY + 39);

  const safeClassName = className.toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`presensi_${safeClassName}_pertemuan_${meetingNo}.pdf`);
};

/**
 * Download lesson in Microsoft Word (.docx format)
 */
export const downloadLessonDocx = (
  lesson: {
    title: string;
    chapter: string;
    description: string;
    content_text: string;
  },
  subjectName: string,
  teacherName: string,
  schoolName: string
) => {
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${lesson.title}</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 24px; }
      h1 { color: #1e3a8a; font-size: 18pt; border-bottom: 2px solid #1e3a8a; padding-bottom: 6px; }
      h2 { color: #0369a1; font-size: 13pt; margin-top: 15px; }
      .meta { background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 10pt; }
      p { font-size: 11pt; }
    </style></head>
    <body>
      <h1>${schoolName.toUpperCase()} — MODUL MATERI AJAR</h1>
      <div class="meta">
        <p><strong>Mata Pelajaran:</strong> ${subjectName}</p>
        <p><strong>Capaian / Bab:</strong> ${lesson.chapter}</p>
        <p><strong>Judul Materi:</strong> ${lesson.title}</p>
        <p><strong>Guru Pengampu:</strong> ${teacherName}</p>
        <p><strong>Kurikulum:</strong> Kurikulum Merdeka Sekolah Menengah Pertama</p>
      </div>
      <h2>Deskripsi Ringkas:</h2>
      <p>${lesson.description}</p>
      <h2>Uraian Materi Pembelajaran:</h2>
      <div>${lesson.content_text.replace(/\n/g, '<br/>')}</div>
    </body>
    </html>
  `;
  const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const cleanTitle = lesson.title.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
  link.setAttribute('download', `modul_${cleanTitle}.docx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Download lesson slide notes in PowerPoint (.pptx format)
 */
export const downloadLessonPptx = (
  lesson: {
    title: string;
    chapter: string;
    description: string;
    content_text: string;
  },
  subjectName: string
) => {
  const content = `MATA PELAJARAN: ${subjectName}
BAB: ${lesson.chapter}
JUDUL SLIDE: ${lesson.title}

===========================
SLIDE 1: JUDUL & TUJUAN
===========================
${lesson.title}
${lesson.description}

===========================
SLIDE 2: MATERI INTI
===========================
${lesson.content_text}

===========================
SLIDE 3: KESIMPULAN & REFLEKSI
===========================
- Pahami konsep dasar materi
- Diskusikan di forum belajar jika terdapat kendala
- Selesaikan tugas dan evaluasi formatif`;

  const blob = new Blob([content], { type: 'application/vnd.ms-powerpoint;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const cleanTitle = lesson.title.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
  link.setAttribute('download', `slide_presentasi_${cleanTitle}.pptx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
