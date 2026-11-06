import {
  User,
  StudentProfile,
  TeacherProfile,
  AcademicYear,
  ClassRoom,
  Subject,
  TeachingAssignment,
  Schedule,
  Lesson,
  LessonProgress,
  Assignment,
  Submission,
  Quiz,
  Question,
  QuizAttempt,
  GradeConfig,
  Discussion,
  AttendanceSession,
  Announcement,
  NotificationItem,
  AuditLogItem,
  Badge,
  SystemSettings,
  AttachmentFile,
} from '../types';

export const initialAcademicYears: AcademicYear[] = [
  { id: 'ay-1', name: '2026/2027', semester: 'Ganjil', is_active: true },
  { id: 'ay-0', name: '2025/2026', semester: 'Genap', is_active: false },
];

export const initialClasses: ClassRoom[] = [
  { id: 'cls-7a', grade: 'VII', name: 'VII-A', homeroom_teacher_id: 'usr-guru-1', academic_year_id: 'ay-1', capacity: 32 },
  { id: 'cls-7b', grade: 'VII', name: 'VII-B', homeroom_teacher_id: 'usr-guru-4', academic_year_id: 'ay-1', capacity: 32 },
  { id: 'cls-8a', grade: 'VIII', name: 'VIII-A', homeroom_teacher_id: 'usr-guru-2', academic_year_id: 'ay-1', capacity: 32 },
  { id: 'cls-8b', grade: 'VIII', name: 'VIII-B', homeroom_teacher_id: undefined, academic_year_id: 'ay-1', capacity: 32 },
  { id: 'cls-9a', grade: 'IX', name: 'IX-A', homeroom_teacher_id: 'usr-guru-3', academic_year_id: 'ay-1', capacity: 32 },
  { id: 'cls-9b', grade: 'IX', name: 'IX-B', homeroom_teacher_id: undefined, academic_year_id: 'ay-1', capacity: 32 },
];

export const initialUsers: User[] = [
  {
    id: 'usr-admin-1',
    username: 'admin',
    name: 'Hendra Wijaya, S.Kom.',
    email: 'admin@smpn1jaya.sch.id',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '081234567890',
    created_at: '2026-07-01 08:00:00',
  },
  {
    id: 'usr-guru-1',
    username: 'siti_matematika',
    name: 'Dra. Hj. Siti Nurjanah, M.Pd.',
    email: 'siti.nurjanah@smpn1jaya.sch.id',
    role: 'guru',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '081298765432',
    created_at: '2026-07-01 08:30:00',
  },
  {
    id: 'usr-guru-2',
    username: 'budi_ipa',
    name: 'Budi Santoso, S.Pd., M.Si.',
    email: 'budi.santoso@smpn1jaya.sch.id',
    role: 'guru',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '081345678912',
    created_at: '2026-07-01 08:35:00',
  },
  {
    id: 'usr-guru-3',
    username: 'dewi_indo',
    name: 'Dewi Lestari, S.Pd.',
    email: 'dewi.lestari@smpn1jaya.sch.id',
    role: 'guru',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '081387654321',
    created_at: '2026-07-01 08:40:00',
  },
  {
    id: 'usr-guru-4',
    username: 'arif_tik',
    name: 'Arif Kurniawan, S.Kom.',
    email: 'arif.kurniawan@smpn1jaya.sch.id',
    role: 'guru',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '081277665544',
    created_at: '2026-07-01 08:45:00',
  },
  {
    id: 'usr-admin-2',
    username: 'sarah_admin',
    name: 'Sarah Oktaviani, S.Pd.',
    email: 'sarah.oktaviani@smpn1jaya.sch.id',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '081266554433',
    created_at: '2026-07-01 09:00:00',
  },
  // --- KELAS VII-A (3 Siswa) ---
  {
    id: 'usr-murid-1',
    username: 'ahmad_fauzi',
    name: 'Ahmad Fauzi Pratama',
    email: 'ahmad.fauzi@siswa.smpn1jaya.sch.id',
    role: 'murid',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '085211223344',
    created_at: '2026-07-10 09:00:00',
  },
  {
    id: 'usr-murid-2',
    username: 'bella_safitri',
    name: 'Bella Safitri Azzahra',
    email: 'bella.safitri@siswa.smpn1jaya.sch.id',
    role: 'murid',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '085222334455',
    created_at: '2026-07-10 09:05:00',
  },
  {
    id: 'usr-murid-3',
    username: 'chandra_kirana',
    name: 'Chandra Kirana Saputra',
    email: 'chandra.kirana@siswa.smpn1jaya.sch.id',
    role: 'murid',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '085233445566',
    created_at: '2026-07-10 09:10:00',
  },

  // --- KELAS VII-B (3 Siswa) ---
  {
    id: 'usr-murid-4',
    username: 'dian_wahyudi',
    name: 'Dian Wahyudi Pratama',
    email: 'dian.wahyudi@siswa.smpn1jaya.sch.id',
    role: 'murid',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '085244556677',
    created_at: '2026-07-10 09:15:00',
  },
  {
    id: 'usr-murid-5',
    username: 'eko_pratama',
    name: 'Eko Pratama Wicaksono',
    email: 'eko.pratama@siswa.smpn1jaya.sch.id',
    role: 'murid',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '085255667788',
    created_at: '2026-07-10 09:20:00',
  },
  {
    id: 'usr-murid-6',
    username: 'fitri_aisy',
    name: 'Fitri Nur Aisyah',
    email: 'fitri.aisyah@siswa.smpn1jaya.sch.id',
    role: 'murid',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '085266778899',
    created_at: '2026-07-10 09:25:00',
  },

  // --- KELAS VIII-A (3 Siswa) ---
  {
    id: 'usr-murid-7',
    username: 'gilang_rama',
    name: 'Gilang Ramadhan Santoso',
    email: 'gilang.ramadhan@siswa.smpn1jaya.sch.id',
    role: 'murid',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '085277889901',
    created_at: '2026-07-10 09:30:00',
  },
  {
    id: 'usr-murid-8',
    username: 'hesti_wulan',
    name: 'Hesti Wulandari',
    email: 'hesti.wulandari@siswa.smpn1jaya.sch.id',
    role: 'murid',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '085277889902',
    created_at: '2026-07-10 09:35:00',
  },
  {
    id: 'usr-murid-9',
    username: 'indra_kusuma',
    name: 'Indra Kusuma Wijaya',
    email: 'indra.kusuma@siswa.smpn1jaya.sch.id',
    role: 'murid',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '085277889903',
    created_at: '2026-07-10 09:40:00',
  },

  // --- KELAS VIII-B (3 Siswa) ---
  {
    id: 'usr-murid-10',
    username: 'joko_susanto',
    name: 'Joko Susanto',
    email: 'joko.susanto@siswa.smpn1jaya.sch.id',
    role: 'murid',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '085277889904',
    created_at: '2026-07-10 09:45:00',
  },
  {
    id: 'usr-murid-11',
    username: 'kania_dewi',
    name: 'Kania Dewi Lestari',
    email: 'kania.dewi@siswa.smpn1jaya.sch.id',
    role: 'murid',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '085277889905',
    created_at: '2026-07-10 09:50:00',
  },
  {
    id: 'usr-murid-12',
    username: 'luqman_hakim',
    name: 'Luqman Hakim Anshori',
    email: 'luqman.hakim@siswa.smpn1jaya.sch.id',
    role: 'murid',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '085277889906',
    created_at: '2026-07-10 09:55:00',
  },

  // --- KELAS IX-A (3 Siswa) ---
  {
    id: 'usr-murid-13',
    username: 'maya_anggraini',
    name: 'Maya Anggraini Kusuma',
    email: 'maya.anggraini@siswa.smpn1jaya.sch.id',
    role: 'murid',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '085277889907',
    created_at: '2026-07-10 10:00:00',
  },
  {
    id: 'usr-murid-14',
    username: 'naufal_rizky',
    name: 'Naufal Rizky Pratama',
    email: 'naufal.rizky@siswa.smpn1jaya.sch.id',
    role: 'murid',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '085277889908',
    created_at: '2026-07-10 10:05:00',
  },
  {
    id: 'usr-murid-15',
    username: 'olivia_putri',
    name: 'Olivia Putri Maharani',
    email: 'olivia.putri@siswa.smpn1jaya.sch.id',
    role: 'murid',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '085277889909',
    created_at: '2026-07-10 10:10:00',
  },

  // --- KELAS IX-B (3 Siswa) ---
  {
    id: 'usr-murid-16',
    username: 'pandu_sanjaya',
    name: 'Pandu Sanjaya Putra',
    email: 'pandu.sanjaya@siswa.smpn1jaya.sch.id',
    role: 'murid',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '085277889910',
    created_at: '2026-07-10 10:15:00',
  },
  {
    id: 'usr-murid-17',
    username: 'qoriatul_h',
    name: 'Qoriatul Hasanah',
    email: 'qoriatul.hasanah@siswa.smpn1jaya.sch.id',
    role: 'murid',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '085277889911',
    created_at: '2026-07-10 10:20:00',
  },
  {
    id: 'usr-murid-18',
    username: 'rizky_aditya',
    name: 'Rizky Aditya Nugroho',
    email: 'rizky.aditya@siswa.smpn1jaya.sch.id',
    role: 'murid',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    phone: '085277889912',
    created_at: '2026-07-10 10:25:00',
  },
];

export const initialTeacherProfiles: TeacherProfile[] = [
  {
    user_id: 'usr-guru-1',
    nip: '197505122002122001',
    nuptk: '8745753655300023',
    gender: 'P',
    specialization: 'Matematika',
    homeroom_class_id: 'cls-7a',
    education: 'S2 Pendidikan Matematika UNY',
  },
  {
    user_id: 'usr-guru-2',
    nip: '198008182005011004',
    nuptk: '3448758659200012',
    gender: 'L',
    specialization: 'Ilmu Pengetahuan Alam (IPA)',
    homeroom_class_id: 'cls-8a',
    education: 'S2 Biologi Terapan ITB',
  },
  {
    user_id: 'usr-guru-3',
    nip: '198411252009022003',
    nuptk: '1254762664210034',
    gender: 'P',
    specialization: 'Bahasa Indonesia',
    homeroom_class_id: 'cls-9a',
    education: 'S1 Sastra & Bahasa Indonesia UI',
  },
  {
    user_id: 'usr-guru-4',
    nip: '199003152019031008',
    nuptk: '4563768670130089',
    gender: 'L',
    specialization: 'Informatika & TIK',
    homeroom_class_id: 'cls-7b',
    education: 'S1 Teknik Informatika ITS',
  },
];

export const initialStudentProfiles: StudentProfile[] = [
  // --- KELAS VII-A ---
  {
    user_id: 'usr-murid-1',
    nis: '247001',
    nisn: '0098765432',
    class_id: 'cls-7a',
    gender: 'L',
    birth_place: 'Jakarta',
    birth_date: '2013-04-12',
    address: 'Jl. Melati No. 14, Kebayoran Baru',
    points: 480,
    completed_lessons_count: 5,
    badges: ['badge-1', 'badge-2', 'badge-3'],
  },
  {
    user_id: 'usr-murid-2',
    nis: '247002',
    nisn: '0098765433',
    class_id: 'cls-7a',
    gender: 'P',
    birth_place: 'Bogor',
    birth_date: '2013-09-21',
    address: 'Jl. Kenanga Indah No. 8',
    points: 620,
    completed_lessons_count: 7,
    badges: ['badge-1', 'badge-2', 'badge-4'],
  },
  {
    user_id: 'usr-murid-3',
    nis: '247003',
    nisn: '0098765434',
    class_id: 'cls-7a',
    gender: 'L',
    birth_place: 'Depok',
    birth_date: '2013-02-14',
    address: 'Jl. Flamboyan Blok B No. 3',
    points: 410,
    completed_lessons_count: 4,
    badges: ['badge-1', 'badge-3'],
  },

  // --- KELAS VII-B ---
  {
    user_id: 'usr-murid-4',
    nis: '247051',
    nisn: '0098765451',
    class_id: 'cls-7b',
    gender: 'L',
    birth_place: 'Tangerang',
    birth_date: '2013-05-18',
    address: 'Jl. Cendrawasih No. 11',
    points: 520,
    completed_lessons_count: 5,
    badges: ['badge-1', 'badge-2'],
  },
  {
    user_id: 'usr-murid-5',
    nis: '247052',
    nisn: '0098765452',
    class_id: 'cls-7b',
    gender: 'L',
    birth_place: 'Surabaya',
    birth_date: '2013-06-15',
    address: 'Jl. Anggrek Raya No. 12',
    points: 510,
    completed_lessons_count: 6,
    badges: ['badge-1', 'badge-2'],
  },
  {
    user_id: 'usr-murid-6',
    nis: '247053',
    nisn: '0098765453',
    class_id: 'cls-7b',
    gender: 'P',
    birth_place: 'Bekasi',
    birth_date: '2013-11-09',
    address: 'Jl. Kemuning Asri No. 9',
    points: 490,
    completed_lessons_count: 4,
    badges: ['badge-1'],
  },

  // --- KELAS VIII-A ---
  {
    user_id: 'usr-murid-7',
    nis: '238011',
    nisn: '0087654311',
    class_id: 'cls-8a',
    gender: 'L',
    birth_place: 'Bandung',
    birth_date: '2012-03-24',
    address: 'Jl. Teratai Indah No. 5',
    points: 580,
    completed_lessons_count: 6,
    badges: ['badge-1', 'badge-2'],
  },
  {
    user_id: 'usr-murid-8',
    nis: '238012',
    nisn: '0087654312',
    class_id: 'cls-8a',
    gender: 'P',
    birth_place: 'Cimahi',
    birth_date: '2012-07-16',
    address: 'Jl. Dahlia Putih No. 22',
    points: 630,
    completed_lessons_count: 7,
    badges: ['badge-1', 'badge-2', 'badge-4'],
  },
  {
    user_id: 'usr-murid-9',
    nis: '238013',
    nisn: '0087654313',
    class_id: 'cls-8a',
    gender: 'L',
    birth_place: 'Bogor',
    birth_date: '2012-10-02',
    address: 'Jl. Rajawali Mas No. 8',
    points: 460,
    completed_lessons_count: 5,
    badges: ['badge-1', 'badge-3'],
  },

  // --- KELAS VIII-B ---
  {
    user_id: 'usr-murid-10',
    nis: '238061',
    nisn: '0087654361',
    class_id: 'cls-8b',
    gender: 'L',
    birth_place: 'Yogyakarta',
    birth_date: '2012-05-20',
    address: 'Jl. Malioboro Permai No. 4',
    points: 440,
    completed_lessons_count: 4,
    badges: ['badge-1', 'badge-3'],
  },
  {
    user_id: 'usr-murid-11',
    nis: '238062',
    nisn: '0087654362',
    class_id: 'cls-8b',
    gender: 'P',
    birth_place: 'Solo',
    birth_date: '2012-08-14',
    address: 'Jl. Kasuari No. 17',
    points: 540,
    completed_lessons_count: 6,
    badges: ['badge-1', 'badge-2'],
  },
  {
    user_id: 'usr-murid-12',
    nis: '238063',
    nisn: '0087654363',
    class_id: 'cls-8b',
    gender: 'L',
    birth_place: 'Magelang',
    birth_date: '2012-12-01',
    address: 'Jl. Pandan Wangi No. 3',
    points: 490,
    completed_lessons_count: 5,
    badges: ['badge-1'],
  },

  // --- KELAS IX-A ---
  {
    user_id: 'usr-murid-13',
    nis: '229011',
    nisn: '0076543211',
    class_id: 'cls-9a',
    gender: 'P',
    birth_place: 'Semarang',
    birth_date: '2011-04-10',
    address: 'Jl. Merpati Mas No. 5',
    points: 820,
    completed_lessons_count: 9,
    badges: ['badge-1', 'badge-2', 'badge-3', 'badge-4'],
  },
  {
    user_id: 'usr-murid-14',
    nis: '229012',
    nisn: '0076543212',
    class_id: 'cls-9a',
    gender: 'L',
    birth_place: 'Kudus',
    birth_date: '2011-06-25',
    address: 'Jl. Garuda Sakti No. 12',
    points: 750,
    completed_lessons_count: 8,
    badges: ['badge-1', 'badge-2', 'badge-4'],
  },
  {
    user_id: 'usr-murid-15',
    nis: '229013',
    nisn: '0076543213',
    class_id: 'cls-9a',
    gender: 'P',
    birth_place: 'Pekalongan',
    birth_date: '2011-09-18',
    address: 'Jl. Kenanga Timur No. 15',
    points: 790,
    completed_lessons_count: 8,
    badges: ['badge-1', 'badge-2', 'badge-3'],
  },

  // --- KELAS IX-B ---
  {
    user_id: 'usr-murid-16',
    nis: '229061',
    nisn: '0076543261',
    class_id: 'cls-9b',
    gender: 'L',
    birth_place: 'Malang',
    birth_date: '2011-01-30',
    address: 'Jl. Bromo Asri No. 19',
    points: 760,
    completed_lessons_count: 8,
    badges: ['badge-1', 'badge-2', 'badge-4'],
  },
  {
    user_id: 'usr-murid-17',
    nis: '229062',
    nisn: '0076543262',
    class_id: 'cls-9b',
    gender: 'P',
    birth_place: 'Blitar',
    birth_date: '2011-08-12',
    address: 'Jl. Semeru Raya No. 24',
    points: 710,
    completed_lessons_count: 7,
    badges: ['badge-1', 'badge-2'],
  },
  {
    user_id: 'usr-murid-18',
    nis: '229063',
    nisn: '0076543263',
    class_id: 'cls-9b',
    gender: 'L',
    birth_place: 'Pasuruan',
    birth_date: '2011-12-05',
    address: 'Jl. Kawi Elok No. 7',
    points: 690,
    completed_lessons_count: 7,
    badges: ['badge-1', 'badge-3'],
  },
];

export const initialSubjects: Subject[] = [
  {
    id: 'sbj-mtk',
    code: 'MTK-SMP',
    name: 'Matematika',
    grade: 'Semua',
    description: 'Konsep aljabar, bilangan bulat, aritmetika sosial, geometri, dan statistika dasar SMP.',
    color: 'from-blue-600 to-indigo-700',
    icon: 'Calculator',
    status: 'aktif',
  },
  {
    id: 'sbj-ipa',
    code: 'IPA-SMP',
    name: 'Ilmu Pengetahuan Alam (IPA)',
    grade: 'Semua',
    description: 'Eksplorasi biologi makhluk hidup, fisika energi dan gerak, serta zat kimia dalam kehidupan.',
    color: 'from-emerald-600 to-teal-700',
    icon: 'Atom',
    status: 'aktif',
  },
  {
    id: 'sbj-indo',
    code: 'BIN-SMP',
    name: 'Bahasa Indonesia',
    grade: 'Semua',
    description: 'Literasi membaca, struktur teks deskripsi, narasi fantasi, prosedur, dan apresiasi sastra.',
    color: 'from-rose-600 to-red-700',
    icon: 'BookOpen',
    status: 'aktif',
  },
  {
    id: 'sbj-ing',
    code: 'BIG-SMP',
    name: 'Bahasa Inggris',
    grade: 'Semua',
    description: 'English for Communication, grammar dasar, reading comprehension, dan everyday conversation.',
    color: 'from-amber-600 to-orange-700',
    icon: 'Languages',
    status: 'aktif',
  },
  {
    id: 'sbj-inf',
    code: 'INF-SMP',
    name: 'Informatika',
    grade: 'Semua',
    description: 'Berpikir komputasional, algoritma dasar, jaringan komputer, literasi digital, dan etika AI.',
    color: 'from-cyan-600 to-blue-700',
    icon: 'Cpu',
    status: 'aktif',
  },
  {
    id: 'sbj-ips',
    code: 'IPS-SMP',
    name: 'Ilmu Pengetahuan Sosial (IPS)',
    grade: 'Semua',
    description: 'Kondisi geografis Indonesia, sejarah nusantara, kegiatan ekonomi, dan interaksi sosial.',
    color: 'from-purple-600 to-violet-700',
    icon: 'Globe',
    status: 'aktif',
  },
  {
    id: 'sbj-pancasila',
    code: 'PPN-SMP',
    name: 'Pendidikan Pancasila',
    grade: 'Semua',
    description: 'Nilai-nilai luhur Pancasila, UUD NRI 1945, norma hukum, dan Bhinneka Tunggal Ika.',
    color: 'from-red-600 to-amber-700',
    icon: 'ShieldCheck',
    status: 'aktif',
  },
  {
    id: 'sbj-pjok',
    code: 'PJK-SMP',
    name: 'PJOK',
    grade: 'Semua',
    description: 'Pendidikan jasmani, olahraga atletik, permainan bola besar/kecil, dan gaya hidup sehat.',
    color: 'from-lime-600 to-green-700',
    icon: 'Activity',
    status: 'aktif',
  },
];

export const initialTeachingAssignments: TeachingAssignment[] = [
  // Kelas VII-A
  { id: 'ta-1', teacher_id: 'usr-guru-1', subject_id: 'sbj-mtk', class_id: 'cls-7a', academic_year_id: 'ay-1' },
  { id: 'ta-2', teacher_id: 'usr-guru-2', subject_id: 'sbj-ipa', class_id: 'cls-7a', academic_year_id: 'ay-1' },
  { id: 'ta-3', teacher_id: 'usr-guru-3', subject_id: 'sbj-indo', class_id: 'cls-7a', academic_year_id: 'ay-1' },
  { id: 'ta-4', teacher_id: 'usr-guru-4', subject_id: 'sbj-inf', class_id: 'cls-7a', academic_year_id: 'ay-1' },

  // Kelas VII-B
  { id: 'ta-5', teacher_id: 'usr-guru-1', subject_id: 'sbj-mtk', class_id: 'cls-7b', academic_year_id: 'ay-1' },
  { id: 'ta-6', teacher_id: 'usr-guru-2', subject_id: 'sbj-ipa', class_id: 'cls-7b', academic_year_id: 'ay-1' },
  { id: 'ta-7', teacher_id: 'usr-guru-3', subject_id: 'sbj-indo', class_id: 'cls-7b', academic_year_id: 'ay-1' },
  { id: 'ta-8', teacher_id: 'usr-guru-4', subject_id: 'sbj-inf', class_id: 'cls-7b', academic_year_id: 'ay-1' },

  // Kelas VIII-A
  { id: 'ta-9', teacher_id: 'usr-guru-1', subject_id: 'sbj-mtk', class_id: 'cls-8a', academic_year_id: 'ay-1' },
  { id: 'ta-10', teacher_id: 'usr-guru-2', subject_id: 'sbj-ipa', class_id: 'cls-8a', academic_year_id: 'ay-1' },
  { id: 'ta-11', teacher_id: 'usr-guru-3', subject_id: 'sbj-indo', class_id: 'cls-8a', academic_year_id: 'ay-1' },
  { id: 'ta-12', teacher_id: 'usr-guru-4', subject_id: 'sbj-inf', class_id: 'cls-8a', academic_year_id: 'ay-1' },

  // Kelas VIII-B
  { id: 'ta-13', teacher_id: 'usr-guru-1', subject_id: 'sbj-mtk', class_id: 'cls-8b', academic_year_id: 'ay-1' },
  { id: 'ta-14', teacher_id: 'usr-guru-2', subject_id: 'sbj-ipa', class_id: 'cls-8b', academic_year_id: 'ay-1' },
  { id: 'ta-15', teacher_id: 'usr-guru-3', subject_id: 'sbj-indo', class_id: 'cls-8b', academic_year_id: 'ay-1' },
  { id: 'ta-16', teacher_id: 'usr-guru-4', subject_id: 'sbj-inf', class_id: 'cls-8b', academic_year_id: 'ay-1' },

  // Kelas IX-A
  { id: 'ta-17', teacher_id: 'usr-guru-1', subject_id: 'sbj-mtk', class_id: 'cls-9a', academic_year_id: 'ay-1' },
  { id: 'ta-18', teacher_id: 'usr-guru-2', subject_id: 'sbj-ipa', class_id: 'cls-9a', academic_year_id: 'ay-1' },
  { id: 'ta-19', teacher_id: 'usr-guru-3', subject_id: 'sbj-indo', class_id: 'cls-9a', academic_year_id: 'ay-1' },
  { id: 'ta-20', teacher_id: 'usr-guru-4', subject_id: 'sbj-inf', class_id: 'cls-9a', academic_year_id: 'ay-1' },

  // Kelas IX-B
  { id: 'ta-21', teacher_id: 'usr-guru-1', subject_id: 'sbj-mtk', class_id: 'cls-9b', academic_year_id: 'ay-1' },
  { id: 'ta-22', teacher_id: 'usr-guru-2', subject_id: 'sbj-ipa', class_id: 'cls-9b', academic_year_id: 'ay-1' },
  { id: 'ta-23', teacher_id: 'usr-guru-3', subject_id: 'sbj-indo', class_id: 'cls-9b', academic_year_id: 'ay-1' },
  { id: 'ta-24', teacher_id: 'usr-guru-4', subject_id: 'sbj-inf', class_id: 'cls-9b', academic_year_id: 'ay-1' },
];

export const initialSchedules: Schedule[] = [
  // Kelas VII-A
  { id: 'sch-1', class_id: 'cls-7a', subject_id: 'sbj-mtk', teacher_id: 'usr-guru-1', day: 'Senin', start_time: '07:30', end_time: '09:00', room: 'Ruang VII-A' },
  { id: 'sch-2', class_id: 'cls-7a', subject_id: 'sbj-ipa', teacher_id: 'usr-guru-2', day: 'Senin', start_time: '09:15', end_time: '10:45', room: 'Lab IPA 1' },
  { id: 'sch-3', class_id: 'cls-7a', subject_id: 'sbj-indo', teacher_id: 'usr-guru-3', day: 'Selasa', start_time: '07:30', end_time: '09:00', room: 'Ruang VII-A' },
  { id: 'sch-4', class_id: 'cls-7a', subject_id: 'sbj-inf', teacher_id: 'usr-guru-4', day: 'Rabu', start_time: '10:00', end_time: '11:30', room: 'Lab Komputer' },

  // Kelas VII-B
  { id: 'sch-5', class_id: 'cls-7b', subject_id: 'sbj-indo', teacher_id: 'usr-guru-3', day: 'Senin', start_time: '07:30', end_time: '09:00', room: 'Ruang VII-B' },
  { id: 'sch-6', class_id: 'cls-7b', subject_id: 'sbj-mtk', teacher_id: 'usr-guru-1', day: 'Selasa', start_time: '09:15', end_time: '10:45', room: 'Ruang VII-B' },
  { id: 'sch-7', class_id: 'cls-7b', subject_id: 'sbj-ipa', teacher_id: 'usr-guru-2', day: 'Rabu', start_time: '07:30', end_time: '09:00', room: 'Lab IPA 1' },
  { id: 'sch-8', class_id: 'cls-7b', subject_id: 'sbj-inf', teacher_id: 'usr-guru-4', day: 'Kamis', start_time: '08:00', end_time: '09:30', room: 'Lab Komputer' },

  // Kelas VIII-A
  { id: 'sch-9', class_id: 'cls-8a', subject_id: 'sbj-mtk', teacher_id: 'usr-guru-1', day: 'Senin', start_time: '10:00', end_time: '11:30', room: 'Ruang VIII-A' },
  { id: 'sch-10', class_id: 'cls-8a', subject_id: 'sbj-indo', teacher_id: 'usr-guru-3', day: 'Selasa', start_time: '09:15', end_time: '10:45', room: 'Ruang VIII-A' },
  { id: 'sch-11', class_id: 'cls-8a', subject_id: 'sbj-ipa', teacher_id: 'usr-guru-2', day: 'Rabu', start_time: '07:30', end_time: '09:00', room: 'Lab IPA 2' },
  { id: 'sch-12', class_id: 'cls-8a', subject_id: 'sbj-inf', teacher_id: 'usr-guru-4', day: 'Kamis', start_time: '10:00', end_time: '11:30', room: 'Lab Komputer' },

  // Kelas VIII-B
  { id: 'sch-13', class_id: 'cls-8b', subject_id: 'sbj-indo', teacher_id: 'usr-guru-3', day: 'Senin', start_time: '09:15', end_time: '10:45', room: 'Ruang VIII-B' },
  { id: 'sch-14', class_id: 'cls-8b', subject_id: 'sbj-ipa', teacher_id: 'usr-guru-2', day: 'Selasa', start_time: '07:30', end_time: '09:00', room: 'Lab IPA 2' },
  { id: 'sch-15', class_id: 'cls-8b', subject_id: 'sbj-mtk', teacher_id: 'usr-guru-1', day: 'Rabu', start_time: '10:00', end_time: '11:30', room: 'Ruang VIII-B' },
  { id: 'sch-16', class_id: 'cls-8b', subject_id: 'sbj-inf', teacher_id: 'usr-guru-4', day: 'Jumat', start_time: '08:00', end_time: '09:30', room: 'Lab Komputer' },

  // Kelas IX-A
  { id: 'sch-17', class_id: 'cls-9a', subject_id: 'sbj-mtk', teacher_id: 'usr-guru-1', day: 'Senin', start_time: '07:30', end_time: '09:00', room: 'Ruang IX-A' },
  { id: 'sch-18', class_id: 'cls-9a', subject_id: 'sbj-ipa', teacher_id: 'usr-guru-2', day: 'Selasa', start_time: '10:00', end_time: '11:30', room: 'Lab IPA 1' },
  { id: 'sch-19', class_id: 'cls-9a', subject_id: 'sbj-indo', teacher_id: 'usr-guru-3', day: 'Kamis', start_time: '07:30', end_time: '09:00', room: 'Ruang IX-A' },
  { id: 'sch-20', class_id: 'cls-9a', subject_id: 'sbj-inf', teacher_id: 'usr-guru-4', day: 'Jumat', start_time: '08:00', end_time: '09:30', room: 'Lab Komputer' },

  // Kelas IX-B
  { id: 'sch-21', class_id: 'cls-9b', subject_id: 'sbj-inf', teacher_id: 'usr-guru-4', day: 'Senin', start_time: '10:00', end_time: '11:30', room: 'Lab Komputer' },
  { id: 'sch-22', class_id: 'cls-9b', subject_id: 'sbj-ipa', teacher_id: 'usr-guru-2', day: 'Rabu', start_time: '09:15', end_time: '10:45', room: 'Lab IPA 2' },
  { id: 'sch-23', class_id: 'cls-9b', subject_id: 'sbj-mtk', teacher_id: 'usr-guru-1', day: 'Kamis', start_time: '10:00', end_time: '11:30', room: 'Ruang IX-B' },
  { id: 'sch-24', class_id: 'cls-9b', subject_id: 'sbj-indo', teacher_id: 'usr-guru-3', day: 'Jumat', start_time: '07:30', end_time: '09:00', room: 'Ruang IX-B' },
];

export const initialLessons: Lesson[] = [
  {
    id: 'lsn-1',
    subject_id: 'sbj-mtk',
    class_id: 'cls-7a',
    teacher_id: 'usr-guru-1',
    chapter: 'Bab 1: Bilangan Bulat dan Pecahan',
    title: 'Operasi Hitung Penjumlahan dan Perkalian Bilangan Negatif',
    description: 'Memahami konsep garis bilangan, aturan tanda perkalian positif dan negatif, serta penerapan dalam kehidupan sehari-hari.',
    content_text: `Selamat datang pada pertemuan pertama pembelajaran Matematika Kelas VII!

### 1. Hakikat Bilangan Bulat
Bilangan bulat terdiri atas:
- Bilangan bulat positif: {1, 2, 3, 4, ...}
- Bilangan nol: {0}
- Bilangan bulat negatif: {..., -4, -3, -2, -1}

### 2. Aturan Tanda Perkalian & Pembagian
- Positif (+) dikali Positif (+) = Positif (+)
- Positif (+) dikali Negatif (-) = Negatif (-)
- Negatif (-) dikali Positif (+) = Negatif (-)
- Negatif (-) dikali Negatif (-) = Positif (+)

**Contoh Kasus:**
Suhu di puncak gunung pada malam hari adalah -3°C. Jika suhu turun 2°C setiap 1 jam, berapakah suhunya setelah 3 jam?
Jawab: -3 + (3 × -2) = -3 + (-6) = -9°C.

Silakan pelajari video dan unduh modul rangkuman terlampir. Setelah selesai, klik tombol **Tandai Selesai** untuk mendapatkan poin XP!`,
    video_url: 'https://www.youtube.com/watch?v=k3G_y0Z91z4',
    attachment_name: 'Modul_Bab_1_Bilangan_Bulat.pdf',
    attachment_url: '#',
    attachments: [
      { id: 'att-f1', name: 'Modul_Bab_1_Bilangan_Bulat.pdf', file_type: 'pdf', file_size: '2.4 MB' },
      { id: 'att-f2', name: 'Slide_Presentasi_Operasi_Bilangan.pptx', file_type: 'ppt', file_size: '5.1 MB' },
      { id: 'att-f3', name: 'Lembar_Kerja_Latihan_Mandiri.docx', file_type: 'doc', file_size: '850 KB' },
      { id: 'att-f4', name: 'Tabel_Skor_Perhitungan_Cepat.xlsx', file_type: 'xls', file_size: '420 KB' },
    ],
    status: 'published',
    published_at: '2026-10-15 08:00:00',
    order_index: 1,
  },
  {
    id: 'lsn-2',
    subject_id: 'sbj-mtk',
    class_id: 'cls-7a',
    teacher_id: 'usr-guru-1',
    chapter: 'Bab 2: Aljabar Dasar',
    title: 'Mengenal Variabel, Koefisien, Konstanta, dan Suku Sejenis',
    description: 'Dasar pemikiran aljabar: menyederhanakan bentuk aljabar dan penjumlahan suku sejenis.',
    content_text: `### Pengenalan Aljabar
Bentuk aljabar adalah teknik matematika untuk menyajikan masalah nyata menggunakan huruf pengganti nilai yang belum diketahui.

**Komponen Aljabar: 4x + 7**
- **4** adalah Koefisien (pengali variabel)
- **x** adalah Variabel (peubah yang nilainya belum pasti)
- **7** adalah Konstanta (nilai tetap tanpa variabel)
- **4x** dan **7** masing-masing disebut Suku

**Aturan Penjumlahan:**
Hanya suku sejenis yang dapat dijumlahkan!
Contoh: 3a + 5b + 2a = (3a + 2a) + 5b = 5a + 5b.`,
    video_url: '',
    attachment_name: 'Latihan_Bentuk_Aljabar.docx',
    attachments: [
      { id: 'att-f5', name: 'Rangkuman_Aljabar_Dasar.pdf', file_type: 'pdf', file_size: '1.8 MB' },
      { id: 'att-f6', name: 'Bahan_Ajar_Interaktif.pptx', file_type: 'ppt', file_size: '4.2 MB' },
    ],
    status: 'published',
    published_at: '2026-10-22 08:00:00',
    order_index: 2,
  },
  {
    id: 'lsn-3',
    subject_id: 'sbj-ipa',
    class_id: 'cls-7a',
    teacher_id: 'usr-guru-2',
    chapter: 'Bab 1: Hakikat Sains dan Metode Ilmiah',
    title: 'Pengukuran, Besaran Pokok, dan Besaran Turunan',
    description: 'Belajar menggunakan jangka sorong, neraca, stopwatch, dan satuan internasional (SI).',
    content_text: `### Hakikat Pengukuran dalam Sains
Mengukur adalah membandingkan suatu besaran dengan besaran standar yang sejenis sebagai satuan.

**7 Besaran Pokok Sistem Internasional (SI):**
1. Panjang (meter - m)
2. Massa (kilogram - kg)
3. Waktu (sekon - s)
4. Suhu (Kelvin - K)
5. Kuat Arus Listrik (Ampere - A)
6. Intensitas Cahaya (Candela - cd)
7. Jumlah Zat (mol)`,
    attachment_name: 'Panduan_Praktikum_Pengukuran.pdf',
    status: 'published',
    published_at: '2026-10-16 09:30:00',
    order_index: 1,
  },
  {
    id: 'lsn-4',
    subject_id: 'sbj-indo',
    class_id: 'cls-7a',
    teacher_id: 'usr-guru-3',
    chapter: 'Bab 1: Menyingkap Keindahan Alam lewat Teks Deskripsi',
    title: 'Ciri-Ciri dan Struktur Teks Deskripsi yang Memikat',
    description: 'Menganalisis teks deskripsi objek wisata, budaya, dan kuliner nusantara.',
    content_text: `### Apa itu Teks Deskripsi?
Teks deskripsi adalah teks yang menggambarkan suatu objek, tempat, atau peristiwa secara jelas dan terperinci sehingga pembaca seolah-olah melihat, mendengar, atau merasakan sendiri objek tersebut.

**Struktur Teks Deskripsi:**
1. Identifikasi / Deskripsi Umum
2. Deskripsi Bagian
3. Simpulan / Kesan Umum`,
    attachment_name: 'Contoh_Analisis_Teks_Deskripsi.pdf',
    status: 'published',
    published_at: '2026-10-18 07:30:00',
    order_index: 1,
  },
  {
    id: 'lsn-5',
    subject_id: 'sbj-inf',
    class_id: 'cls-7a',
    teacher_id: 'usr-guru-4',
    chapter: 'Bab 1: Berpikir Komputasional',
    title: '4 Pilar Computational Thinking dalam Pemecahan Masalah',
    description: 'Dekomposisi, Pengenalan Pola, Abstraksi, dan Perancangan Algoritma sederhana.',
    content_text: `### 4 Pilar Berpikir Komputasional:
1. **Dekomposisi:** Memecah masalah besar menjadi bagian-bagian kecil yang lebih mudah diselesaikan.
2. **Pengenalan Pola:** Mengidentifikasi kesamaan karakteristik atau tren berulang.
3. **Abstraksi:** Menyaring informasi penting dan mengabaikan detail yang tidak relevan.
4. **Algoritma:** Menyusun instruksi langkah demi langkah yang logis dan terurut.`,
    status: 'published',
    published_at: '2026-10-19 10:00:00',
    order_index: 1,
  },
  // KELAS VII-B LESSONS
  {
    id: 'lsn-6',
    subject_id: 'sbj-mtk',
    class_id: 'cls-7b',
    teacher_id: 'usr-guru-1',
    chapter: 'Bab 1: Bilangan Bulat dan Pecahan',
    title: 'Pecahan Senilai dan Operasi Hitung Campuran Pecahan',
    description: 'Menyederhanakan pecahan biasa, campuran, desimal, dan persentase serta aturan urutan operasi matematika.',
    content_text: `### 1. Hakikat Pecahan Senilai
Pecahan senilai adalah pecahan yang memiliki nilai sama meskipun pembilang dan penyebutnya berbeda.
Contoh: 1/2 = 2/4 = 4/8 = 50/100 = 0.5 = 50%.

Untuk menentukan pecahan senilai:
- Mengalikan pembilang dan penyebut dengan angka bulat yang sama (selain 0).
- Membagi pembilang dan penyebut dengan FPB dari keduanya (menyederhanakan).

### 2. Operasi Hitung Penjumlahan & Pengurangan
Syarat utama: Samakan penyebut terlebih dahulu menggunakan Kelipatan Persekutuan Terkecil (KPK)!
Contoh: 2/3 + 1/4 = (8/12) + (3/12) = 11/12.

### 3. Operasi Perkalian & Pembagian Pecahan
- Perkalian: Langsung kalikan pembilang dengan pembilang, penyebut dengan penyebut: (a/b) × (c/d) = (a×c) / (b×d).
- Pembagian: Ubah operasi menjadi perkalian dengan membalik pecahan kedua: (a/b) ÷ (c/d) = (a/b) × (d/c).

### 4. Contoh Penerapan Sehari-hari
Ibu membeli gula pasir 2 1/2 kg. Sebanyak 3/4 kg digunakan untuk membuat kolak dan 1/2 kg untuk teh manis.
Sisa gula pasir ibu:
2 1/2 - 3/4 - 1/2 = 5/2 - 3/4 - 2/4 = 10/4 - 3/4 - 2/4 = 5/4 = 1 1/4 kg.`,
    video_url: 'https://www.youtube.com/watch?v=k3G_y0Z91z4',
    attachment_name: 'Modul_Lengkap_Pecahan_Kelas7B.pdf',
    attachments: [
      { id: 'att-7b-1', name: 'Modul_Lengkap_Pecahan_Kelas7B.pdf', file_type: 'pdf', file_size: '2.1 MB' },
      { id: 'att-7b-2', name: 'Rangkuman_Rumus_Pecahan.docx', file_type: 'doc', file_size: '720 KB' },
    ],
    status: 'published',
    published_at: '2026-10-18 08:30:00',
    order_index: 1,
  },
  {
    id: 'lsn-7',
    subject_id: 'sbj-ipa',
    class_id: 'cls-7b',
    teacher_id: 'usr-guru-2',
    chapter: 'Bab 1: Hakikat Sains & Laboratorium',
    title: 'Keselamatan Kerja di Laboratorium IPA & Penggunaan Mikroskop',
    description: 'Pedoman keselamatan, pengenalan simbol bahaya zat kimia (hazard symbol), dan tata cara mengoperasikan mikroskop cahaya.',
    content_text: `### 1. Tata Tertib dan Keselamatan di Laboratorium IPA
Laboratorium IPA adalah tempat eksplorasi sains yang menyenangkan namun memerlukan kewaspadaan tinggi.
- Wajib mengenakan jas lab berbahan katun, kacamata pelindung (goggles), dan sepatu tertutup.
- Dilarang makan, minum, atau mencicipi bahan kimia apa pun tanpa instruksi guru.
- Ketahui letak alat pemadam api ringan (APAR) dan kotak P3K di SMP N 1 JAYA.

### 2. Simbol Bahaya Kimia Utama
1. **Flammable (Mudah Terbakar):** Contoh: Alkohol, Aseton, Spiritus. Jauhkan dari api terbuka.
2. **Toxic / Beracun:** Simbol tengkorak dan tulang bersilang. Contoh: Merkuri, Sianida.
3. **Corrosive / Korosif:** Menyebabkan kerusakan jaringan kulit atau logam. Contoh: Asam Klorida (HCl), Asam Sulfat pekat.
4. **Explosive / Mudah Meledak:** Simbol ledakan. Contoh: Campuran amonium nitrat.

### 3. Bagian-Bagian Mikroskop Cahaya
- **Lensa Okuler:** Memperbesar bayangan objek dari lensa objektif (terletak dekat mata pengamat).
- **Tabung Mikroskop (Tubus):** Menghubungkan lensa okuler dan objektif.
- **Revolver:** Pengatur pembesaran lensa objektif (4x, 10x, 40x, 100x).
- **Meja Preparat:** Tempat meletakkan kaca objek dan spesimen pengamatan.
- **Diafragma & Kondensor:** Mengatur intensitas cahaya yang masuk menembus spesimen.
- **Makrometer & Mikrometer:** Pemfokus kasar dan halus agar bayangan tampak tajam.`,
    attachment_name: 'Panduan_Laboratorium_IPA_SMPN1JAYA.pdf',
    attachments: [
      { id: 'att-7b-3', name: 'Panduan_Laboratorium_IPA_SMPN1JAYA.pdf', file_type: 'pdf', file_size: '3.4 MB' },
      { id: 'att-7b-4', name: 'Atlas_Simbol_Bahaya_Kimia.pptx', file_type: 'ppt', file_size: '4.8 MB' },
    ],
    status: 'published',
    published_at: '2026-10-19 09:15:00',
    order_index: 1,
  },
  {
    id: 'lsn-8',
    subject_id: 'sbj-indo',
    class_id: 'cls-7b',
    teacher_id: 'usr-guru-3',
    chapter: 'Bab 1: Menelaah Teks Deskripsi',
    title: 'Kaidah Kebahasaan Teks Deskripsi: Kata Konkret, Majas, dan Kalimat Bermajas',
    description: 'Menganalisis penggunaan kata khusus, kata sifat, cerapan pancaindra, dan majas personifikasi dalam teks deskripsi.',
    content_text: `### 1. Ciri Kebahasaan Teks Deskripsi
Teks deskripsi memiliki kekhasan gaya bahasa yang menghidupkan imajinasi pembaca melalui:
- **Kata Khusus / Konkret:** Kata yang ruang lingkupnya sempit dan nyata (Contoh: kata umum 'melihat', kata khusus 'memandang, menatap, melirik, mengamati').
- **Kalimat yang Melibatkan Cerapan Pancaindra:**
  - *Penglihatan:* Pantai pasir putih membentang luas berpadu dengan air laut biru jernih.
  - *Pendengaran:* Desau angin berbisik di sela-sela pelepah daun kelapa yang meliuk-liuk.
  - *Penciuman:* Aroma semerbak melati menyeruak lembut memenuhi beranda rumah.
  - *Perabaan:* Hembusan angin dingin menusuk hingga ke sumsum tulang.

### 2. Penggunaan Majas Personifikasi
Majas personifikasi memperlakukan benda mati seolah-olah memiliki sifat dan perilaku layaknya manusia yang bernyawa.
Contoh: "Matahari pagi tersenyum hangat menyapa para siswa SMP N 1 JAYA yang berbaris rapi di lapangan upacara."

### 3. Langkah Menulis Teks Deskripsi
1. Tentukan topik atau objek yang menarik (gedung sekolah, ruang kelas, taman perpustakaan).
2. Kumpulkan data observasi langsung dengan mencatat detail visual, suara, dan aroma.
3. Susun kerangka karangan: Identifikasi umum -> Deskripsi bagian terperinci -> Penutup/kesan.
4. Kembangkan paragraf dengan pilihan kata yang bervariasi dan periksa tanda baca sesuai PUEBI.`,
    attachment_name: 'Modul_Kaidah_Kebahasaan_Deskripsi.pdf',
    attachments: [
      { id: 'att-7b-5', name: 'Modul_Kaidah_Kebahasaan_Deskripsi.pdf', file_type: 'pdf', file_size: '1.9 MB' },
    ],
    status: 'published',
    published_at: '2026-10-21 07:30:00',
    order_index: 1,
  },
  {
    id: 'lsn-9',
    subject_id: 'sbj-inf',
    class_id: 'cls-7b',
    teacher_id: 'usr-guru-4',
    chapter: 'Bab 1: Literasi Digital & Perangkat Komputer',
    title: 'Komponen Sistem Komputer: Hardware, Software, dan Brainware',
    description: 'Mengenal siklus pemrosesan data (Input - Process - Output - Storage) dan etika bermedia digital sehat.',
    content_text: `### 1. Trias Sistem Komputer
Sebuah sistem komputer hanya dapat bekerja jika ketiga komponen berikut saling terintegrasi:
1. **Hardware (Perangkat Keras):** Komponen fisik yang dapat disentuh dan dilihat (Motherboard, CPU, RAM, SSD, Keyboard, Monitor).
2. **Software (Perangkat Lunak):** Kumpulan instruksi atau program yang mengontrol kerja hardware (Sistem Operasi Windows/Linux, Browser Chrome, Aplikasi Perkantoran).
3. **Brainware (Pengguna Manusia):** Manusia yang mengoperasikan, memprogram, atau mengelola sistem komputer (Operator, Programmer, Siswa, Guru).

### 2. Siklus Pemrosesan Informasi (IPOS)
- **Input:** Memasukkan data ke dalam sistem (Keyboard, Mouse, Mikrofon, Scanner).
- **Processing:** Mengolah dan memanipulasi data melalui ALU (Arithmetic Logic Unit) dan CU (Control Unit) di dalam prosesor.
- **Output:** Menyajikan hasil pengolahan data kepada pengguna (Layar Monitor, Speaker, Printer).
- **Storage:** Menyimpan data secara sementara (RAM) atau permanen (SSD/Harddisk).

### 3. Etika Digital (Netiket)
Sebagai pelajar teladan SMP N 1 JAYA, terapkan selalu prinsip THINK sebelum mengunggah informasi:
- **T** - Is it True? (Apakah fakta dan bukan hoaks?)
- **H** - Is it Helpful? (Apakah bermanfaat bagi sesama?)
- **I** - Is it Inspiring? (Apakah memberi inspirasi positif?)
- **N** - Is it Necessary? (Apakah memang perlu dibagikan?)
- **K** - Is it Kind? (Apakah santun dan tidak mengandung perundungan/cyberbullying?)`,
    attachment_name: 'Modul_Sistem_Komputer_SMPN1JAYA.pdf',
    attachments: [
      { id: 'att-7b-6', name: 'Modul_Sistem_Komputer_SMPN1JAYA.pdf', file_type: 'pdf', file_size: '2.8 MB' },
    ],
    status: 'published',
    published_at: '2026-10-22 10:00:00',
    order_index: 1,
  },

  // KELAS VIII-A LESSONS
  {
    id: 'lsn-10',
    subject_id: 'sbj-mtk',
    class_id: 'cls-8a',
    teacher_id: 'usr-guru-1',
    chapter: 'Bab 1: Pola Bilangan dan Barisan',
    title: 'Menentukan Rumus Suku ke-n (Un) Barisan Aritmetika dan Geometri',
    description: 'Menganalisis barisan bilangan berpola tetap, beda barisan, rasio, dan deret aritmetika dalam kehidupan nyata.',
    content_text: `### 1. Konsep Barisan Bilangan
Barisan bilangan adalah susunan bilangan yang memiliki keteraturan atau aturan tertentu antar sukunya.
Lambang: U1, U2, U3, ..., Un. Di mana Un adalah suku ke-n.

### 2. Barisan Aritmetika
Barisan di mana selisih (beda) antara dua suku yang berurutan selalu tetap bernilai sama:
- **Beda (b)** = U2 - U1 = U3 - U2 = Un - Un-1.
- **Rumus Suku ke-n:**
  Un = a + (n - 1)b
  *(a = suku pertama, b = beda, n = urutan suku)*

**Contoh Soal:**
Tentukan suku ke-25 dari barisan aritmetika: 3, 7, 11, 15, ...
Jawab:
a = 3, b = 7 - 3 = 4
U25 = 3 + (25 - 1) × 4 = 3 + (24 × 4) = 3 + 96 = 99.

### 3. Deret Aritmetika (Jumlah n Suku Pertama)
Rumus Sn = n/2 × (2a + (n - 1)b) atau Sn = n/2 × (a + Un).

### 4. Barisan Geometri
Barisan yang perbandingan (rasio) antara dua suku berurutan selalu tetap:
- **Rasio (r)** = U2 / U1.
- **Rumus Suku ke-n:**
  Un = a × r^(n-1)`,
    video_url: 'https://www.youtube.com/watch?v=k3G_y0Z91z4',
    attachment_name: 'Modul_Pola_Bilangan_Kelas_8A.pdf',
    attachments: [
      { id: 'att-8a-1', name: 'Modul_Pola_Bilangan_Kelas_8A.pdf', file_type: 'pdf', file_size: '2.6 MB' },
      { id: 'att-8a-2', name: 'Kumpulan_Latihan_Barisan_Deret.docx', file_type: 'doc', file_size: '950 KB' },
    ],
    status: 'published',
    published_at: '2026-10-17 08:00:00',
    order_index: 1,
  },
  {
    id: 'lsn-11',
    subject_id: 'sbj-ipa',
    class_id: 'cls-8a',
    teacher_id: 'usr-guru-2',
    chapter: 'Bab 1: Sistem Gerak pada Manusia',
    title: 'Struktur Tulang, Sendi Sinovial, dan Mekanisme Kontraksi Otot',
    description: 'Menyelidiki fungsi rangka tubuh, klasifikasi sendi (engsel, peluru, pelana, putar), dan kelainan postur tubuh.',
    content_text: `### 1. Fungsi Utama Rangka Tubuh Manusia
1. Memberi bentuk tubuh dan menegakkan postur.
2. Melindungi organ-organ vital di dalam rongga tubuh (otak dilindungi tengkorak, jantung dan paru dilindungi tulang rusuk).
3. Tempat melekatnya otot lurik sebagai alat gerak aktif.
4. Tempat pembentukan sel-sel darah merah di sumsum tulang belakang (hematopoiesis).
5. Menyimpan cadangan mineral kalsium dan fosfor.

### 2. Macam-Macam Sendi Gerak (Diartrosis)
- **Sendi Peluru:** Memungkinkan gerakan ke segala arah (contoh: hubungan gelang bahu dengan tulang lengan atas).
- **Sendi Engsel:** Memungkinkan gerakan satu arah (contoh: siku dan lutut).
- **Sendi Putar:** Memungkinkan gerakan memutar poros (contoh: tulang atlas dengan tulang tengkorak).
- **Sendi Pelana:** Memungkinkan gerakan dua arah (contoh: pangkal ibu jari tangan).
- **Sendi Geser:** Memungkinkan pergeseran antartulang (contoh: persendian pergelangan tangan dan kaki).

### 3. Macam Jaringan Otot
- **Otot Lurik:** Bekerja secara sadar (volunter), bergaris melintang, cepat lelah, menempel pada rangka.
- **Otot Polos:** Bekerja secara otomatis tak sadar (involunter), berbentuk gelendong dengan 1 inti di tengah, terdapat pada lambung, usus, dan pembuluh darah.
- **Otot Jantung:** Hanya terdapat di dinding jantung, bercabang (sinsitium), bekerja terus menerus tanpa henti secara ritmis.`,
    attachment_name: 'Bahan_Ajar_Sistem_Gerak_Kelas8A.pdf',
    attachments: [
      { id: 'att-8a-3', name: 'Bahan_Ajar_Sistem_Gerak_Kelas8A.pdf', file_type: 'pdf', file_size: '3.1 MB' },
    ],
    status: 'published',
    published_at: '2026-10-18 09:30:00',
    order_index: 1,
  },
  {
    id: 'lsn-12',
    subject_id: 'sbj-indo',
    class_id: 'cls-8a',
    teacher_id: 'usr-guru-3',
    chapter: 'Bab 1: Menulis Teks Berita Aktual',
    title: 'Unsur ADiKSiMBa (5W+1H) dan Struktur Piramida Terbalik Berita',
    description: 'Menganalisis fakta objektif berita, kepala berita (lead), tubuh berita, dan verifikasi sumber kredibel.',
    content_text: `### 1. Hakikat dan Fungsi Teks Berita
Teks berita menyajikan laporan peristiwa aktual, faktual, dan memiliki nilai kepentingan umum bagi masyarakat luas.

### 2. Unsur-Unsur Pokok Berita (ADiKSiMBa)
1. **Apa (What):** Peristiwa apa yang sedang terjadi?
2. **Di mana (Where):** Di mana lokasi terjadinya peristiwa tersebut?
3. **Kapan (When):** Kapan waktu terjadinya peristiwa?
4. **Siapa (Who):** Siapa saja tokoh atau pihak yang terlibat?
5. **Mengapa (Why):** Mengapa peristiwa tersebut dapat terjadi (latar belakang)?
6. **Bagaimana (How):** Bagaimana proses kronologi atau dampak dari peristiwa tersebut?

### 3. Struktur Piramida Terbalik
- **Kepala Berita (Lead):** Memuat inti informasi terpenting yang menjawab sebagian besar unsur ADiKSiMBa di paragraf pertama.
- **Tubuh Berita (Body):** Penjelasan rinci, kutipan wawancara narasumber kredibel, dan urutan kronologis kejadian.
- **Ekor Berita (Tail):** Informasi tambahan yang bersifat pelengkap dan tidak fatal jika dihilangkan saat penyuntingan redaksi.`,
    attachment_name: 'Modul_Teks_Berita_SMPN1JAYA.pdf',
    attachments: [
      { id: 'att-8a-4', name: 'Modul_Teks_Berita_SMPN1JAYA.pdf', file_type: 'pdf', file_size: '1.7 MB' },
    ],
    status: 'published',
    published_at: '2026-10-20 07:30:00',
    order_index: 1,
  },
  {
    id: 'lsn-13',
    subject_id: 'sbj-inf',
    class_id: 'cls-8a',
    teacher_id: 'usr-guru-4',
    chapter: 'Bab 1: Jaringan Komputer & Internet',
    title: 'Arsitektur Jaringan LAN/WAN dan Keamanan Transmisi Data',
    description: 'Memahami cara kerja IP Address, DNS, Router, Switch, dan enkripsi protokol HTTPS di internet.',
    content_text: `### 1. Klasifikasi Jaringan Berdasarkan Jangkauan Geografis
- **PAN (Personal Area Network):** Jangkauan sangat dekat (Bluetooth, hotspot smartphone).
- **LAN (Local Area Network):** Jangkauan satu gedung atau ruangan laboratorium komputer SMP N 1 JAYA.
- **MAN (Metropolitan Area Network):** Jangkauan satu kota yang menghubungkan beberapa kantor cabang.
- **WAN (Wide Area Network):** Jangkauan antarnegara dan benua (Internet global).

### 2. Perangkat Jaringan Pokok
- **Router:** Mengarahkan paket data antarjaringan yang berbeda subnet.
- **Switch:** Menghubungkan banyak komputer dalam satu LAN menggunakan MAC Address.
- **Kabel UTP (Unshielded Twisted Pair) & RJ-45:** Media transmisi kabel fisik standar.
- **Access Point:** Menyebarkan koneksi jaringan tanpa kabel (Wi-Fi).

### 3. Protokol Internet & Keamanan Siber
- **DNS (Domain Name System):** Menerjemahkan nama domain (seperti smpn1jaya.sch.id) menjadi alamat numerik IP Address (misalnya 103.24.56.78).
- **HTTPS:** Hypertext Transfer Protocol Secure, mengenkripsi seluruh pertukaran kata sandi dan data pribadi pengguna agar terhindar dari penyadapan (man-in-the-middle attack).`,
    attachment_name: 'Modul_Jaringan_Internet_Kelas8.pdf',
    attachments: [
      { id: 'att-8a-5', name: 'Modul_Jaringan_Internet_Kelas8.pdf', file_type: 'pdf', file_size: '2.5 MB' },
    ],
    status: 'published',
    published_at: '2026-10-22 10:15:00',
    order_index: 1,
  },

  // KELAS VIII-B LESSONS
  {
    id: 'lsn-14',
    subject_id: 'sbj-mtk',
    class_id: 'cls-8b',
    teacher_id: 'usr-guru-1',
    chapter: 'Bab 1: Sistem Koordinat Kartesius',
    title: 'Menentukan Posisi Titik terhadap Sumbu-X, Sumbu-Y, dan Titik Asal (0,0)',
    description: 'Kuadran I, II, III, IV, jarak dua titik, dan kedudukan garis sejajar atau tegak lurus.',
    content_text: `### 1. Bidang Koordinat Kartesius
Bidang koordinat terdiri atas dua garis berpotongan tegak lurus di titik asal O(0,0):
- Sumbu mendatar disebut **Sumbu-X (Absis)**.
- Sumbu tegak disebut **Sumbu-Y (Ordinat)**.
- Setiap titik dituliskan dalam pasangan terurut **P(x, y)**.

### 2. Pembagian Kuadran
- **Kuadran I:** Nilai x positif (+), nilai y positif (+)
- **Kuadran II:** Nilai x negatif (-), nilai y positif (+)
- **Kuadran III:** Nilai x negatif (-), nilai y negatif (-)
- **Kuadran IV:** Nilai x positif (+), nilai y negatif (-)

### 3. Kedudukan Garis terhadap Sumbu Koordinat
- **Garis Sejajar Sumbu-X:** Memiliki persamaan y = c. Garis ini tegak lurus dengan sumbu-Y.
- **Garis Sejajar Sumbu-Y:** Memiliki persamaan x = k. Garis ini tegak lurus dengan sumbu-X.
- **Jarak Antara Dua Titik:** d = √((x2 - x1)² + (y2 - y1)²).`,
    attachment_name: 'Modul_Koordinat_Kartesius_Kelas8B.pdf',
    attachments: [
      { id: 'att-8b-1', name: 'Modul_Koordinat_Kartesius_Kelas8B.pdf', file_type: 'pdf', file_size: '2.0 MB' },
    ],
    status: 'published',
    published_at: '2026-10-18 08:00:00',
    order_index: 1,
  },
  {
    id: 'lsn-15',
    subject_id: 'sbj-ipa',
    class_id: 'cls-8b',
    teacher_id: 'usr-guru-2',
    chapter: 'Bab 1: Sistem Pencernaan dan Nutrisi',
    title: 'Uji Zat Makanan dan Jalur Enzim Pencernaan Manusia',
    description: 'Fungsi karbohidrat, protein, lemak, vitamin, reagen Lugol, Biuret, Benedict, serta kerja enzim amilase, pepsin, dan lipase.',
    content_text: `### 1. 6 Kebutuhan Nutrisi Pokok Tubuh
1. **Karbohidrat:** Sumber energi primer (nasi, jagung, gandum).
2. **Protein:** Zat pembangun dan perbaikan sel yang rusak (ikan, telur, tahu, tempe).
3. **Lemak:** Pelarut vitamin A, D, E, K dan cadangan energi tinggi.
4. **Vitamin & Mineral:** Pengatur fungsi biologis dan imunitas.
5. **Air:** Pelarut zat makanan dan penstabil suhu homeostasis tubuh.

### 2. Indikator Uji Zat Makanan (Praktikum Laboratorium)
- **Uji Amilum (Karbohidrat):** Menggunakan larutan **Lugol / Iodin**. Warna positif berubah menjadi **biru tua / kehitaman**.
- **Uji Glukosa:** Menggunakan reagen **Benedict + dipanaskan**. Warna positif berubah menjadi **merah bata**.
- **Uji Protein:** Menggunakan larutan **Biuret (NaOH + CuSO4)**. Warna positif berubah menjadi **ungu**.
- **Uji Lemak:** Mengoleskan pada kertas buram, jika transparan menandakan positif lemak.

### 3. Organ & Enzim Pencernaan
- **Mulut:** Pencernaan mekanik (gigi) dan kimiawi oleh enzim Ptialin/Amilase (mengubah amilum menjadi maltosa).
- **Lambung:** Menghasilkan HCl (membunuh kuman dan mengaktifkan pepsinogen), enzim Pepsin (memecah protein menjadi pepton), dan Renin.
- **Usus Halus:** Enzim Amilase, Tripsin, dan Lipase dari pankreas mencerna nutrisi hingga siap diserap vili usus.`,
    attachment_name: 'Modul_Nutrisi_Pencernaan_Kelas8B.pdf',
    attachments: [
      { id: 'att-8b-2', name: 'Modul_Nutrisi_Pencernaan_Kelas8B.pdf', file_type: 'pdf', file_size: '3.2 MB' },
    ],
    status: 'published',
    published_at: '2026-10-19 09:30:00',
    order_index: 1,
  },
  {
    id: 'lsn-16',
    subject_id: 'sbj-indo',
    class_id: 'cls-8b',
    teacher_id: 'usr-guru-3',
    chapter: 'Bab 1: Iklan, Slogan, dan Poster',
    title: 'Membedakan Ciri Teks Iklan, Slogan, dan Poster Komunikatif',
    description: 'Analisis kalimat persuasif, visual menarik, slogan motivasi, dan poster edukasi lingkungan hidup.',
    content_text: `### 1. Perbedaan Utama Iklan, Slogan, dan Poster
- **Iklan:** Teks persuasif yang memadukan unsur gambar, gerak, kata-kata, dan suara (media cetak, televisi, media sosial) untuk mempromosikan barang atau jasa.
- **Slogan:** Perkataan atau kalimat pendek yang menarik, mencolok, dan mudah diingat untuk memberitahukan atau mengiklankan suatu moto/visi organisasi.
  Contoh: "Buku adalah Jendela Dunia", "Tiada Hari Tanpa Prestasi di SMP N 1 JAYA".
- **Poster:** Plakat berupa gambar dan kata-kata yang dipasang di tempat-tempat umum untuk mengumumkan pesan penting, bersifat visual dominan.

### 2. Kaidah Kebahasaan Teks Iklan
1. Bersifat persuasif (mengajak pembaca meyakini keunggulan produk/ide).
2. Menggunakan kalimat imperatif (perintah halus: gunakan, dapatkan segera, lindungilah).
3. Berima puitis dan ringkas agar mudah terngiang di benak audiens.
4. Bersifat positif dan tidak menjatuhkan pihak lain.`,
    attachment_name: 'Bahan_Ajar_Iklan_Slogan_Poster.pdf',
    attachments: [
      { id: 'att-8b-3', name: 'Bahan_Ajar_Iklan_Slogan_Poster.pdf', file_type: 'pdf', file_size: '1.8 MB' },
    ],
    status: 'published',
    published_at: '2026-10-21 07:30:00',
    order_index: 1,
  },
  {
    id: 'lsn-17',
    subject_id: 'sbj-inf',
    class_id: 'cls-8b',
    teacher_id: 'usr-guru-4',
    chapter: 'Bab 1: Berpikir Komputasional & Struktur Data',
    title: 'Representasi Graf, Pohon (Tree), dan Penelusuran Jalur Terpendek',
    description: 'Konsep simpul (node), sisi (edge), hirarki tree, dan algoritma penentuan rute tercepat pada peta navigasi digital.',
    content_text: `### 1. Struktur Data Graf (Graph)
Graf adalah struktur data non-linear yang memodelkan hubungan antarobjek:
- **Simpul (Vertex / Node):** Merepresentasikan entitas atau lokasi kota.
- **Sisi (Edge):** Garis penghubung yang menghubungkan dua simpul, bisa memiliki bobot (jarak/waktu tempuh) atau arah.
Aplikasi nyata: Peta Google Maps menghitung rute tercepat dari rumah ke SMP N 1 JAYA dengan merepresentasikan persimpangan jalan sebagai node graf.

### 2. Struktur Data Pohon (Tree)
Pohon adalah jenis graf khusus yang tidak memiliki sirkuit tertutup (siklus):
- **Root (Akar):** Simpul paling atas tanpa orang tua (parent).
- **Child (Anak):** Simpul cabang di bawah parent.
- **Leaf (Daun):** Simpul paling ujung yang tidak memiliki anak.
Aplikasi: Struktur folder direktori di komputer (/src/components/murid).`,
    attachment_name: 'Modul_Graf_dan_Tree_Informatika.pdf',
    attachments: [
      { id: 'att-8b-4', name: 'Modul_Graf_dan_Tree_Informatika.pdf', file_type: 'pdf', file_size: '2.3 MB' },
    ],
    status: 'published',
    published_at: '2026-10-22 10:00:00',
    order_index: 1,
  },

  // KELAS IX-A LESSONS
  {
    id: 'lsn-18',
    subject_id: 'sbj-mtk',
    class_id: 'cls-9a',
    teacher_id: 'usr-guru-1',
    chapter: 'Bab 1: Perpangkatan dan Bentuk Akar',
    title: 'Sifat Operasi Hitung Bilangan Berpangkat dan Merasionalkan Penyebut',
    description: 'Pangkat bulat positif, pangkat nol, pangkat negatif, perkalian bentuk akar, dan merasionalkan a/√b serta c/(a + √b).',
    content_text: `### 1. Sifat-Sifat Perpangkatan Pokok
1. a^m × a^n = a^(m + n)
2. a^m : a^n = a^(m - n)
3. (a^m)^n = a^(m × n)
4. (a × b)^n = a^n × b^n
5. a^0 = 1 (untuk a ≠ 0)
6. a^(-n) = 1 / (a^n)

### 2. Operasi Bentuk Akar
- Menarik akar kuadrat: √(a × b) = √a × √b.
  Contoh: √75 = √(25 × 3) = 5√3.
- Penjumlahan bentuk akar: Hanya dapat dilakukan pada suku berakar sejenis!
  Contoh: 3√2 + 5√2 = (3 + 5)√2 = 8√2.

### 3. Merasionalkan Penyebut Pecahan Bentuk Akar
- Bentuk a/√b: Kalikan pembilang dan penyebut dengan √b:
  (a/√b) × (√b/√b) = (a√b) / b.
- Bentuk c / (a + √b): Kalikan dengan bentuk sekawannya (a - √b):
  (c / (a + √b)) × ((a - √b) / (a - √b)) = c(a - √b) / (a² - b).`,
    attachment_name: 'Modul_Perpangkatan_Bentuk_Akar_Kelas9.pdf',
    attachments: [
      { id: 'att-9a-1', name: 'Modul_Perpangkatan_Bentuk_Akar_Kelas9.pdf', file_type: 'pdf', file_size: '2.7 MB' },
    ],
    status: 'published',
    published_at: '2026-10-16 08:00:00',
    order_index: 1,
  },
  {
    id: 'lsn-19',
    subject_id: 'sbj-ipa',
    class_id: 'cls-9a',
    teacher_id: 'usr-guru-2',
    chapter: 'Bab 1: Sistem Reproduksi Manusia',
    title: 'Pembelahan Sel (Mitosis & Meiosis) dan Kesehatan Reproduksi',
    description: 'Tahapan profase, metafase, anafase, telofase, spermatogenesis, oogenesis, dan pencegahan penyakit menular PMS.',
    content_text: `### 1. Pembelahan Sel: Mitosis vs Meiosis
- **Mitosis:**
  - Terjadi pada sel tubuh (somatis) untuk pertumbuhan dan regenerasi jaringan rusak.
  - Menghasilkan 2 sel anak identik diploid (2n).
  - Melalui 4 fase: Profase -> Metafase -> Anafase -> Telofase.
- **Meiosis:**
  - Terjadi pada organ reproduksi (gonad) untuk pembentukan sel gamet (sperma dan ovum).
  - Menghasilkan 4 sel anak haploid (n) dengan variasi genetik akibat crossing over.

### 2. Organ Reproduksi & Siklus Menstruasi
- Organ reproduksi pria memproduksi sperma di testis yang dikendalikan hormon testosteron.
- Organ reproduksi wanita menghasilkan ovum di ovarium secara berkala.
- Siklus menstruasi dipengaruhi hormon FSH, LH, Estrogen, dan Progesteron yang mengatur penebalan dinding endometrium rahim.`,
    attachment_name: 'Modul_Sistem_Reproduksi_Kelas9A.pdf',
    attachments: [
      { id: 'att-9a-2', name: 'Modul_Sistem_Reproduksi_Kelas9A.pdf', file_type: 'pdf', file_size: '3.5 MB' },
    ],
    status: 'published',
    published_at: '2026-10-17 09:30:00',
    order_index: 1,
  },
  {
    id: 'lsn-20',
    subject_id: 'sbj-indo',
    class_id: 'cls-9a',
    teacher_id: 'usr-guru-3',
    chapter: 'Bab 1: Teks Laporan Percobaan Ilmiah',
    title: 'Sistematika Penulisan Hasil Eksperimen Sains dan Tata Bahasa Baku',
    description: 'Menyusun laporan percobaan ilmiah: judul, tujuan, landasan teori, alat dan bahan, langkah kerja, data pengamatan, dan kesimpulan.',
    content_text: `### 1. Struktur Standar Teks Laporan Percobaan
1. **Judul Percobaan:** Jelas, ringkas, dan mencerminkan variabel penelitian.
2. **Tujuan:** Alasan mengapa percobaan sains dilaksanakan.
3. **Kajian Teori / Hipotesis:** Konsep ilmiah dasar yang melandasi eksperimen.
4. **Alat dan Bahan:** Daftar peralatan dan kuantitas bahan yang digunakan.
5. **Langkah Kerja:** Ditulis menggunakan kalimat imperatif atau pasif berurutan.
6. **Hasil Pengamatan & Pembahasan:** Tabel angka, grafik, dan analisis data.
7. **Simpulan:** Jawaban ringkas atas tujuan berdasarkan data nyata.

### 2. Ciri Bahasa Teks Laporan Percobaan
- Menggunakan kata kerja aktif dan pasif formal.
- Banyak memuat istilah teknis keilmuan (fotosintesis, larutan elektrolit, kapilaritas).
- Objektif dan tidak memasukkan opini subjektif tanpa dasar data teruji.`,
    attachment_name: 'Panduan_Teks_Laporan_Percobaan_Kelas9.pdf',
    attachments: [
      { id: 'att-9a-3', name: 'Panduan_Teks_Laporan_Percobaan_Kelas9.pdf', file_type: 'pdf', file_size: '2.1 MB' },
    ],
    status: 'published',
    published_at: '2026-10-19 07:30:00',
    order_index: 1,
  },
  {
    id: 'lsn-21',
    subject_id: 'sbj-inf',
    class_id: 'cls-9a',
    teacher_id: 'usr-guru-4',
    chapter: 'Bab 1: Analisis Data Lanjut',
    title: 'Pengolahan Dataset Besar dengan Spreadsheet dan Formula Statistik',
    description: 'Penerapan rumus VLOOKUP, HLOOKUP, IF bertingkat, COUNTIF, dan pivot table untuk pengambilan keputusan berbasis data.',
    content_text: `### 1. Penggunaan Formula Statistik Spreadsheet
- **SUM, AVERAGE, MIN, MAX:** Menghitung total, rata-rata, nilai terendah, dan nilai tertinggi kumpulan data.
- **COUNTIF(range, criteria):** Menghitung banyaknya sel yang memenuhi syarat tertentu (misal: jumlah siswa SMP N 1 JAYA yang nilainya di atas KKM 75).
- **IF Bertingkat:** =IF(A1>=90; "A"; IF(A1>=80; "B"; "C")).

### 2. Lookup & Referensi Data
- **VLOOKUP(lookup_value, table_array, col_index, [range_lookup]):** Mencari nilai pada kolom paling kiri dari tabel dan mengembalikan nilai di kolom yang ditentukan.
- **Pivot Table:** Meringkas ribuan baris data transaksi sekolah menjadi ringkasan interaktif hitungan detik.`,
    attachment_name: 'Modul_Analisis_Data_Spreadsheet_Kelas9.pdf',
    attachments: [
      { id: 'att-9a-4', name: 'Modul_Analisis_Data_Spreadsheet_Kelas9.pdf', file_type: 'pdf', file_size: '2.9 MB' },
    ],
    status: 'published',
    published_at: '2026-10-21 10:00:00',
    order_index: 1,
  },

  // KELAS IX-B LESSONS
  {
    id: 'lsn-22',
    subject_id: 'sbj-mtk',
    class_id: 'cls-9b',
    teacher_id: 'usr-guru-1',
    chapter: 'Bab 1: Persamaan Kuadrat',
    title: 'Menentukan Akar-Akar Persamaan Kuadrat dengan Faktorisasi dan Rumus ABC',
    description: 'Bentuk umum ax² + bx + c = 0, diskriminan (D = b² - 4ac), dan jenis-jenis akar real atau imajiner.',
    content_text: `### 1. Bentuk Umum Persamaan Kuadrat
ax² + bx + c = 0, di mana a ≠ 0 dan a, b, c adalah bilangan real.
- x disebut variabel.
- a disebut koefisien x².
- b disebut koefisien x.
- c disebut konstanta.

### 2. Metode Penyelesaian Akar Persamaan Kuadrat
1. **Faktorisasi:** Mencari dua bilangan p dan q sehingga p + q = b dan p × q = a × c.
   Contoh: x² - 5x + 6 = 0 -> (x - 2)(x - 3) = 0 -> x1 = 2 atau x2 = 3.
2. **Melengkapkan Kuadrat Sempurna.**
3. **Rumus Kuadratik (Rumus ABC):**
   x1,2 = (-b ± √(b² - 4ac)) / (2a)

### 3. Nilai Diskriminan (D = b² - 4ac)
- Jika D > 0: Memiliki dua akar real yang berbeda.
- Jika D = 0: Memiliki dua akar real yang kembar (sama).
- Jika D < 0: Tidak memiliki akar real (akar imajiner).`,
    attachment_name: 'Modul_Persamaan_Kuadrat_Kelas9B.pdf',
    attachments: [
      { id: 'att-9b-1', name: 'Modul_Persamaan_Kuadrat_Kelas9B.pdf', file_type: 'pdf', file_size: '2.4 MB' },
    ],
    status: 'published',
    published_at: '2026-10-18 08:00:00',
    order_index: 1,
  },
  {
    id: 'lsn-23',
    subject_id: 'sbj-ipa',
    class_id: 'cls-9b',
    teacher_id: 'usr-guru-2',
    chapter: 'Bab 1: Pewarisan Sifat (Genetika)',
    title: 'Hukum Mendel I dan II: Persilangan Monohibrid dan Dihibrid',
    description: 'Genotipe, fenotipe, dominan, resesif, intermediat, diagram Punnett, dan rasio perbandingan filial.',
    content_text: `### 1. Istilah-Istilah Pokok Genetika
- **Genotipe:** Komposisi genetik suatu individu yang tidak tampak dari luar (disimbolkan huruf, misal BB, Bb, bb).
- **Fenotipe:** Sifat fisik yang tampak dan dapat diamati (bunga merah, biji bulat, rambut ikal).
- **Dominan:** Sifat yang menutupi sifat pasangannya (huruf kapital).
- **Resesif:** Sifat yang tertutupi oleh sifat dominan (huruf kecil).
- **Homozigot:** Pasangan alel sama (BB atau bb).
- **Heterozigot:** Pasangan alel berbeda (Bb).

### 2. Persilangan Monohibrid (Hukum Mendel I / Segregasi Bebas)
Persilangan dengan satu sifat beda.
Contoh: Tanaman ercis berbunga merah dominan (MM) disilangkan dengan ercis berbunga putih (mm).
- F1: 100% Berbunga Merah (Mm).
- F2 (Mm × Mm): Rasio Genotipe MM : Mm : mm = 1 : 2 : 1. Rasio Fenotipe Merah : Putih = 3 : 1.

### 3. Persilangan Dihibrid (Hukum Mendel II / Asortasi Bebas)
Persilangan dengan dua sifat beda (misal: bentuk biji dan warna biji).
Rasio fenotipe F2 pada persilangan dihibrid heterozigot: 9 : 3 : 3 : 1.`,
    attachment_name: 'Modul_Pewarisan_Sifat_Kelas9B.pdf',
    attachments: [
      { id: 'att-9b-2', name: 'Modul_Pewarisan_Sifat_Kelas9B.pdf', file_type: 'pdf', file_size: '3.3 MB' },
    ],
    status: 'published',
    published_at: '2026-10-19 09:15:00',
    order_index: 1,
  },
  {
    id: 'lsn-24',
    subject_id: 'sbj-indo',
    class_id: 'cls-9b',
    teacher_id: 'usr-guru-3',
    chapter: 'Bab 1: Menyampaikan Pidato Persuasif',
    title: 'Struktur Pidato Persuasif: Etika, Emosi, dan Logika',
    description: 'Menyusun naskah pidato oratoris dengan teknik persuasi etika (ethos), emosional (pathos), dan logika ilmiah (logos).',
    content_text: `### 1. Hakikat Pidato Persuasif
Pidato persuasif bertujuan meyakinkan dan mengajak pendengar (audiens) agar menyetujui gagasan atau melakukan tindakan nyata sesuai yang disampaikan pembicara.

### 2. Tiga Pilar Pendekatan Persuasi Aristoteles
1. **Etika (Ethos):** Membangun kredibilitas dan karakter integritas orator sebagai sosok yang jujur dan patut dipercaya.
2. **Emosi (Pathos):** Membangkitkan rasa empati, haru, semangat patriotik, atau kebersamaan pendengar melalui analogi menyentuh.
3. **Logika (Logos):** Menyajikan argumen berbasis data statistik, bukti faktual, dan alur sebab-akibat yang rasional.

### 3. Struktur Teks Pidato Persuasif
1. **Pembukaan:** Salam pembuka, sapaan hormat (audiens), rasa syukur kepada Tuhan YME, dan pengantar topik.
2. **Isi Pidato:** Pernyataan posisi orator, deretan argumen pendukung logis, dan sanggahan terhadap keraguan.
3. **Penutup:** Simpulan inti ajakan, permohonan maaf atas khilaf kata, ucapan terima kasih, dan salam penutup.`,
    attachment_name: 'Naskah_Pidato_Persuasif_SMPN1JAYA.pdf',
    attachments: [
      { id: 'att-9b-3', name: 'Naskah_Pidato_Persuasif_SMPN1JAYA.pdf', file_type: 'pdf', file_size: '1.9 MB' },
    ],
    status: 'published',
    published_at: '2026-10-21 07:30:00',
    order_index: 1,
  },
  {
    id: 'lsn-25',
    subject_id: 'sbj-inf',
    class_id: 'cls-9b',
    teacher_id: 'usr-guru-4',
    chapter: 'Bab 1: Algoritma & Pemrograman Lanjut',
    title: 'Merancang Algoritma Percabangan (If-Else) dan Looping dengan Pseudocode',
    description: 'Penerapan logika kondisional bersarang, perulangan for / while, dan penelusuran alur logika (dry-run trace table).',
    content_text: `### 1. Konsep Algoritma Terstruktur
Algoritma adalah deretan langkah komputasi terdefinisi jelas yang menerima masukan dan menghasilkan keluaran yang valid.

### 2. Struktur Percabangan (Kondisional)
Percabangan digunakan ketika komputer harus mengambil keputusan berdasarkan kondisi benar (true) atau salah (false).
Contoh Pseudocode:
\`\`\`
JIKA nilai_ujian >= 75 MAKA
    TAMPILKAN "Selamat, Anda Lulus KKM SMP N 1 JAYA!"
SELAIN ITU
    TAMPILKAN "Silakan ikuti sesi remedial terpadu."
AKHIR-JIKA
\`\`\`

### 3. Struktur Perulangan (Looping)
- **FOR Loop:** Digunakan saat jumlah putaran sudah diketahui secara pasti (misal mencetak angka 1 sampai 100).
- **WHILE Loop:** Digunakan saat putaran berlangsung selama suatu kondisi masih bernilai benar.

### 4. Trace Table (Tabel Uji Alur)
Teknik menguji logika program di atas kertas sebelum menulis kode nyata untuk memastikan tidak terjadi infinite loop atau kesalahan logika (bug).`,
    attachment_name: 'Modul_Algoritma_Pseudocode_Kelas9B.pdf',
    attachments: [
      { id: 'att-9b-4', name: 'Modul_Algoritma_Pseudocode_Kelas9B.pdf', file_type: 'pdf', file_size: '2.6 MB' },
    ],
    status: 'published',
    published_at: '2026-10-22 10:00:00',
    order_index: 1,
  },
];

export const initialLessonProgresses: LessonProgress[] = [
  // Kelas VII-A
  { id: 'lp-1', lesson_id: 'lsn-1', student_id: 'usr-murid-1', completed: true, completed_at: '2026-10-17 14:20:00' },
  { id: 'lp-2', lesson_id: 'lsn-3', student_id: 'usr-murid-1', completed: true, completed_at: '2026-10-18 16:10:00' },
  { id: 'lp-3', lesson_id: 'lsn-4', student_id: 'usr-murid-1', completed: true, completed_at: '2026-10-20 11:00:00' },
  { id: 'lp-4', lesson_id: 'lsn-1', student_id: 'usr-murid-2', completed: true, completed_at: '2026-10-16 19:40:00' },
  { id: 'lp-5', lesson_id: 'lsn-2', student_id: 'usr-murid-2', completed: true, completed_at: '2026-10-23 20:15:00' },
  { id: 'lp-6', lesson_id: 'lsn-3', student_id: 'usr-murid-2', completed: true, completed_at: '2026-10-17 10:30:00' },
  { id: 'lp-7', lesson_id: 'lsn-4', student_id: 'usr-murid-2', completed: true, completed_at: '2026-10-19 15:45:00' },
  { id: 'lp-8', lesson_id: 'lsn-5', student_id: 'usr-murid-2', completed: true, completed_at: '2026-10-21 13:20:00' },

  // Kelas VII-B
  { id: 'lp-9', lesson_id: 'lsn-6', student_id: 'usr-murid-4', completed: true, completed_at: '2026-10-19 14:10:00' },
  { id: 'lp-10', lesson_id: 'lsn-7', student_id: 'usr-murid-4', completed: true, completed_at: '2026-10-20 15:30:00' },
  { id: 'lp-11', lesson_id: 'lsn-8', student_id: 'usr-murid-4', completed: true, completed_at: '2026-10-22 09:15:00' },
  { id: 'lp-12', lesson_id: 'lsn-6', student_id: 'usr-murid-5', completed: true, completed_at: '2026-10-19 16:45:00' },

  // Kelas VIII-A
  { id: 'lp-13', lesson_id: 'lsn-10', student_id: 'usr-murid-7', completed: true, completed_at: '2026-10-18 11:20:00' },
  { id: 'lp-14', lesson_id: 'lsn-11', student_id: 'usr-murid-7', completed: true, completed_at: '2026-10-19 13:40:00' },
  { id: 'lp-15', lesson_id: 'lsn-12', student_id: 'usr-murid-7', completed: true, completed_at: '2026-10-21 10:00:00' },
  { id: 'lp-16', lesson_id: 'lsn-10', student_id: 'usr-murid-8', completed: true, completed_at: '2026-10-18 15:00:00' },

  // Kelas VIII-B
  { id: 'lp-17', lesson_id: 'lsn-14', student_id: 'usr-murid-10', completed: true, completed_at: '2026-10-19 10:30:00' },
  { id: 'lp-18', lesson_id: 'lsn-15', student_id: 'usr-murid-10', completed: true, completed_at: '2026-10-20 14:15:00' },
  { id: 'lp-19', lesson_id: 'lsn-16', student_id: 'usr-murid-10', completed: true, completed_at: '2026-10-22 11:45:00' },
  { id: 'lp-20', lesson_id: 'lsn-14', student_id: 'usr-murid-11', completed: true, completed_at: '2026-10-20 09:00:00' },

  // Kelas IX-A
  { id: 'lp-21', lesson_id: 'lsn-18', student_id: 'usr-murid-13', completed: true, completed_at: '2026-10-17 16:00:00' },
  { id: 'lp-22', lesson_id: 'lsn-19', student_id: 'usr-murid-13', completed: true, completed_at: '2026-10-18 17:20:00' },
  { id: 'lp-23', lesson_id: 'lsn-20', student_id: 'usr-murid-13', completed: true, completed_at: '2026-10-20 13:10:00' },
  { id: 'lp-24', lesson_id: 'lsn-18', student_id: 'usr-murid-14', completed: true, completed_at: '2026-10-18 10:00:00' },

  // Kelas IX-B
  { id: 'lp-25', lesson_id: 'lsn-22', student_id: 'usr-murid-16', completed: true, completed_at: '2026-10-19 11:30:00' },
  { id: 'lp-26', lesson_id: 'lsn-23', student_id: 'usr-murid-16', completed: true, completed_at: '2026-10-20 15:50:00' },
  { id: 'lp-27', lesson_id: 'lsn-24', student_id: 'usr-murid-16', completed: true, completed_at: '2026-10-22 14:00:00' },
  { id: 'lp-28', lesson_id: 'lsn-22', student_id: 'usr-murid-17', completed: true, completed_at: '2026-10-20 12:30:00' },
];

export const initialAssignments: Assignment[] = [
  // Kelas VII-A
  {
    id: 'asg-1',
    subject_id: 'sbj-mtk',
    class_id: 'cls-7a',
    teacher_id: 'usr-guru-1',
    chapter: 'Bab 1: Bilangan Bulat',
    title: 'Tugas 1: Menyelesaikan 5 Soal Cerita Operasi Bilangan Negatif',
    instructions: `Kerjakan 5 soal cerita operasi bilangan bulat pada lembar jawaban atau ketik langsung di kolom teks. Jika ditulis tangan di buku tulis bergaris, foto atau scan dalam format PDF/JPG yang jelas dan unggah sebelum batas waktu berakhir.

Soal:
1. Suhu di dalam lemari es mula-mula -4°C. Saat listrik padam selama 2 jam, suhu naik 3°C per jam. Berapa suhu sekarang?
2. Kapal selam berada 120 meter di bawah permukaan laut. Kemudian naik 45 meter. Tentukan kedudukan kapal selam sekarang!
3. Hitunglah nilai dari: (-15) × 4 + (-80) : (-8) = ...`,
    start_date: '2026-10-20 08:00',
    due_date: '2026-11-05 23:59',
    max_score: 100,
    submission_type: 'both',
    attachment_name: 'Lembar_Soal_Tugas_1_MTK.pdf',
    status: 'published',
    created_at: '2026-10-20 08:00:00',
  },
  {
    id: 'asg-2',
    subject_id: 'sbj-ipa',
    class_id: 'cls-7a',
    teacher_id: 'usr-guru-2',
    chapter: 'Bab 1: Pengukuran',
    title: 'Tugas Proyek Mandiri: Laporan Pengukuran Benda Rumah Tangga',
    instructions: 'Lakukan pengukuran terhadap minimal 3 benda di rumah Anda menggunakan alat ukur yang tersedia (penggaris, timbangan dapur, pita ukur). Tuliskan nama benda, besaran yang diukur, nilai dan satuan, serta kemungkinan kesalahan pengukuran.',
    start_date: '2026-10-22 08:00',
    due_date: '2026-11-02 23:59',
    max_score: 100,
    submission_type: 'file',
    status: 'published',
    created_at: '2026-10-22 08:00:00',
  },
  {
    id: 'asg-3',
    subject_id: 'sbj-indo',
    class_id: 'cls-7a',
    teacher_id: 'usr-guru-3',
    chapter: 'Bab 1: Teks Deskripsi',
    title: 'Menulis Teks Deskripsi: Keindahan Objek Budaya / Wisata Lokal',
    instructions: 'Buatlah karangan teks deskripsi sepanjang 3-4 paragraf yang memuat deskripsi umum, deskripsi bagian, dan penutup mengenai tempat wisata atau kesenian tradisional di daerah Anda.',
    start_date: '2026-10-25 08:00',
    due_date: '2026-11-10 18:00',
    max_score: 100,
    submission_type: 'text',
    status: 'published',
    created_at: '2026-10-25 08:00:00',
  },

  // Kelas VII-B
  {
    id: 'asg-4',
    subject_id: 'sbj-mtk',
    class_id: 'cls-7b',
    teacher_id: 'usr-guru-1',
    chapter: 'Bab 1: Pecahan',
    title: 'Tugas Latihan: Pecahan Senilai dan Operasi Hitung Campuran',
    instructions: 'Selesaikan 4 soal cerita operasi pecahan dan sederhanakan ke bentuk paling sederhana. Tuliskan langkah pengerjaan dengan rapi.',
    start_date: '2026-10-20 08:00',
    due_date: '2026-11-12 23:59',
    max_score: 100,
    submission_type: 'both',
    attachment_name: 'Lembar_Kerja_Pecahan_Kelas7B.pdf',
    status: 'published',
    created_at: '2026-10-20 08:00:00',
  },
  {
    id: 'asg-5',
    subject_id: 'sbj-ipa',
    class_id: 'cls-7b',
    teacher_id: 'usr-guru-2',
    chapter: 'Bab 1: Keselamatan Kerja Lab',
    title: 'Laporan Identifikasi 5 Simbol Bahaya Bahan Kimia Laboratorium',
    instructions: 'Gambarkan atau lampirkan 5 simbol bahaya zat kimia laboratorium IPA, sebutkan artinya, berikan contoh bahannya, dan tindakan pencegahan keamanannya.',
    start_date: '2026-10-21 08:00',
    due_date: '2026-11-14 23:59',
    max_score: 100,
    submission_type: 'file',
    status: 'published',
    created_at: '2026-10-21 08:00:00',
  },
  {
    id: 'asg-6',
    subject_id: 'sbj-indo',
    class_id: 'cls-7b',
    teacher_id: 'usr-guru-3',
    chapter: 'Bab 1: Kaidah Kebahasaan Deskripsi',
    title: 'Menelaah Majas Personifikasi dan Kata Konkret dalam Cerita',
    instructions: 'Temukan minimal 3 kalimat bermajas personifikasi dan 5 kata cerapan pancaindra dari kutipan teks deskripsi terlampir.',
    start_date: '2026-10-22 08:00',
    due_date: '2026-11-15 18:00',
    max_score: 100,
    submission_type: 'text',
    status: 'published',
    created_at: '2026-10-22 08:00:00',
  },

  // Kelas VIII-A
  {
    id: 'asg-7',
    subject_id: 'sbj-mtk',
    class_id: 'cls-8a',
    teacher_id: 'usr-guru-1',
    chapter: 'Bab 1: Pola Bilangan',
    title: 'Tugas Barisan Aritmetika: Menentukan Suku ke-n dan Jumlah Deret',
    instructions: 'Tentukan suku ke-50 dan jumlah 20 suku pertama dari barisan bilangan aritmetika yang diberikan pada lembar soal.',
    start_date: '2026-10-20 08:00',
    due_date: '2026-11-10 23:59',
    max_score: 100,
    submission_type: 'both',
    attachment_name: 'Soal_Tugas_Pola_Bilangan_8A.pdf',
    status: 'published',
    created_at: '2026-10-20 08:00:00',
  },
  {
    id: 'asg-8',
    subject_id: 'sbj-ipa',
    class_id: 'cls-8a',
    teacher_id: 'usr-guru-2',
    chapter: 'Bab 1: Sistem Gerak Manusia',
    title: 'Analisis Gangguan Tulang & Upaya Menjaga Kesehatan Rangka Tubuh',
    instructions: 'Buatlah makalah ringkas (2 halaman) mengenai perbedaan kifosis, lordosis, skoliosis, dan osteoporosis serta cara pencegahannya sejak remaja.',
    start_date: '2026-10-21 08:00',
    due_date: '2026-11-12 23:59',
    max_score: 100,
    submission_type: 'file',
    status: 'published',
    created_at: '2026-10-21 08:00:00',
  },
  {
    id: 'asg-9',
    subject_id: 'sbj-indo',
    class_id: 'cls-8a',
    teacher_id: 'usr-guru-3',
    chapter: 'Bab 1: Menulis Teks Berita',
    title: 'Identifikasi Unsur ADiKSiMBa dari Artikel Berita Sekolah SMP N 1 JAYA',
    instructions: 'Bacalah artikel kegiatan perkemahan Pramuka SMP N 1 JAYA, lalu petakan unsur 5W+1H dan tentukan bagian kepala serta tubuh beritanya.',
    start_date: '2026-10-22 08:00',
    due_date: '2026-11-14 18:00',
    max_score: 100,
    submission_type: 'text',
    status: 'published',
    created_at: '2026-10-22 08:00:00',
  },

  // Kelas VIII-B
  {
    id: 'asg-10',
    subject_id: 'sbj-mtk',
    class_id: 'cls-8b',
    teacher_id: 'usr-guru-1',
    chapter: 'Bab 1: Koordinat Kartesius',
    title: 'Menggambar Titik Koordinat dan Menentukan Luas Bangun Datar',
    instructions: 'Gambarkan titik A(-3, 2), B(5, 2), C(5, -4), dan D(-3, -4) pada bidang kartesius, lalu hitung keliling dan luas bangun datar yang terbentuk!',
    start_date: '2026-10-20 08:00',
    due_date: '2026-11-11 23:59',
    max_score: 100,
    submission_type: 'both',
    attachment_name: 'Kertas_Grafik_Koordinat_8B.pdf',
    status: 'published',
    created_at: '2026-10-20 08:00:00',
  },
  {
    id: 'asg-11',
    subject_id: 'sbj-ipa',
    class_id: 'cls-8b',
    teacher_id: 'usr-guru-2',
    chapter: 'Bab 1: Nutrisi & Pencernaan',
    title: 'Laporan Analisis Menu Makanan Bergizi Seimbang untuk Pelajar',
    instructions: 'Catat menu sarapan, makan siang, dan makan malam Anda selama 2 hari. Analisis kandungan gizi karbohidrat, protein, lemak, dan seratnya.',
    start_date: '2026-10-21 08:00',
    due_date: '2026-11-13 23:59',
    max_score: 100,
    submission_type: 'file',
    status: 'published',
    created_at: '2026-10-21 08:00:00',
  },
  {
    id: 'asg-12',
    subject_id: 'sbj-indo',
    class_id: 'cls-8b',
    teacher_id: 'usr-guru-3',
    chapter: 'Bab 1: Iklan, Slogan, Poster',
    title: 'Membuat Slogan Kreatif dan Poster Layanan Masyarakat Hemat Energi',
    instructions: 'Buatlah rancangan poster layanan masyarakat atau slogan motivasi belajar di SMP N 1 JAYA lengkap dengan ilustrasi visual dan teks ajakan persuasif.',
    start_date: '2026-10-22 08:00',
    due_date: '2026-11-16 18:00',
    max_score: 100,
    submission_type: 'both',
    status: 'published',
    created_at: '2026-10-22 08:00:00',
  },

  // Kelas IX-A
  {
    id: 'asg-13',
    subject_id: 'sbj-mtk',
    class_id: 'cls-9a',
    teacher_id: 'usr-guru-1',
    chapter: 'Bab 1: Perpangkatan & Bentuk Akar',
    title: 'Latihan Operasi Bentuk Akar dan Merasionalkan Penyebut Pecahan',
    instructions: 'Sederhanakan 5 bentuk pecahan akar bilangan kuadrat menjadi bentuk rasional. Tunjukkan rumus sekawan yang digunakan.',
    start_date: '2026-10-20 08:00',
    due_date: '2026-11-09 23:59',
    max_score: 100,
    submission_type: 'both',
    attachment_name: 'Tugas_Rasionalisasi_Akar_9A.pdf',
    status: 'published',
    created_at: '2026-10-20 08:00:00',
  },
  {
    id: 'asg-14',
    subject_id: 'sbj-ipa',
    class_id: 'cls-9a',
    teacher_id: 'usr-guru-2',
    chapter: 'Bab 1: Pembelahan Sel & Reproduksi',
    title: 'Bagan Alur Tahapan Pembelahan Sel Mitosis dan Meiosis',
    instructions: 'Buatlah diagram atau poster skematis yang menjelaskan fase profase, metafase, anafase, dan telofase serta perbedaannya dengan meiosis.',
    start_date: '2026-10-21 08:00',
    due_date: '2026-11-11 23:59',
    max_score: 100,
    submission_type: 'file',
    status: 'published',
    created_at: '2026-10-21 08:00:00',
  },
  {
    id: 'asg-15',
    subject_id: 'sbj-indo',
    class_id: 'cls-9a',
    teacher_id: 'usr-guru-3',
    chapter: 'Bab 1: Laporan Percobaan',
    title: 'Menyusun Format Laporan Praktikum Sains IPA Terpadu Baku',
    instructions: 'Susunlah teks laporan percobaan berdasarkan data eksperimen uji fotosintesis Ingenhousz yang telah dilakukan di laboratorium sekolah.',
    start_date: '2026-10-23 08:00',
    due_date: '2026-11-15 18:00',
    max_score: 100,
    submission_type: 'text',
    status: 'published',
    created_at: '2026-10-23 08:00:00',
  },

  // Kelas IX-B
  {
    id: 'asg-16',
    subject_id: 'sbj-mtk',
    class_id: 'cls-9b',
    teacher_id: 'usr-guru-1',
    chapter: 'Bab 1: Persamaan Kuadrat',
    title: 'Menentukan Akar-Akar Persamaan Kuadrat dengan Rumus Kuadratik (ABC)',
    instructions: 'Hitunglah nilai diskriminan dan tentukan himpunan penyelesaian dari 4 persamaan kuadrat yang tertera pada lembar tugas.',
    start_date: '2026-10-20 08:00',
    due_date: '2026-11-10 23:59',
    max_score: 100,
    submission_type: 'both',
    attachment_name: 'Tugas_Persamaan_Kuadrat_9B.pdf',
    status: 'published',
    created_at: '2026-10-20 08:00:00',
  },
  {
    id: 'asg-17',
    subject_id: 'sbj-ipa',
    class_id: 'cls-9b',
    teacher_id: 'usr-guru-2',
    chapter: 'Bab 1: Pewarisan Sifat',
    title: 'Diagram Kotak Punnett Persilangan Dihibrid Kacang Ercis Mendel',
    instructions: 'Buatlah bagan persilangan dihibrid antara tanaman ercis berbiji bulat kuning (BbKk) dengan sesamanya. Tentukan rasio fenotipe keturunannya!',
    start_date: '2026-10-22 08:00',
    due_date: '2026-11-12 23:59',
    max_score: 100,
    submission_type: 'file',
    status: 'published',
    created_at: '2026-10-22 08:00:00',
  },
  {
    id: 'asg-18',
    subject_id: 'sbj-indo',
    class_id: 'cls-9b',
    teacher_id: 'usr-guru-3',
    chapter: 'Bab 1: Naskah Pidato Persuasif',
    title: 'Menulis Teks Pidato Persuasif: Meneladani Semangat Juang Pelajar Pancasila',
    instructions: 'Tuliskan naskah pidato persuasif sepanjang 300-400 kata dengan memadukan unsur etika (ethos), sentuhan emosi (pathos), dan logika (logos).',
    start_date: '2026-10-24 08:00',
    due_date: '2026-11-15 18:00',
    max_score: 100,
    submission_type: 'text',
    status: 'published',
    created_at: '2026-10-24 08:00:00',
  },
];

export const initialSubmissions: Submission[] = [
  // Submissions VII-A
  {
    id: 'sub-1',
    assignment_id: 'asg-1',
    student_id: 'usr-murid-1',
    submitted_at: '2026-10-24 16:35:10',
    text_answer: `Jawaban Soal Tugas 1:
1. Suhu awal = -4°C. Kenaikan = 2 jam × 3°C = +6°C. Suhu akhir = -4 + 6 = 2°C.
2. Kedudukan awal = -120 meter. Naik = +45 meter. Kedudukan akhir = -120 + 45 = -75 meter (75 meter di bawah permukaan laut).
3. (-15) × 4 + (-80) : (-8) = -60 + 10 = -50.`,
    file_name: 'Jawaban_Ahmad_Fauzi_Tugas1_MTK.pdf',
    file_url: '#',
    score: 95,
    feedback: 'Pekerjaan sangat rapi dan langkah-langkah pengerjaannya sistematis! Bagus sekali Ahmad.',
    graded_at: '2026-10-25 09:15:00',
    status: 'graded',
  },
  {
    id: 'sub-2',
    assignment_id: 'asg-1',
    student_id: 'usr-murid-2',
    submitted_at: '2026-10-23 20:10:00',
    text_answer: `Jawaban Bella:
1. -4 + (2x3) = 2°C
2. -120 + 45 = -75 m
3. -60 + 10 = -50. Lengkap dengan cara perhitungan di file lampiran.`,
    file_name: 'Tugas1_Bella_Safitri.pdf',
    score: 100,
    feedback: 'Sempurna! Semua nomor dijawab dengan tepat dan rapi.',
    graded_at: '2026-10-24 10:00:00',
    status: 'graded',
  },
  {
    id: 'sub-3',
    assignment_id: 'asg-2',
    student_id: 'usr-murid-2',
    submitted_at: '2026-10-26 14:00:00',
    file_name: 'Laporan_Praktikum_Mandiri_Bella.pdf',
    file_url: '#',
    score: 90,
    feedback: 'Analisis ketidakpastian pengukurannya sangat cermat.',
    graded_at: '2026-10-27 11:30:00',
    status: 'graded',
  },

  // Submissions VII-B
  {
    id: 'sub-4',
    assignment_id: 'asg-4',
    student_id: 'usr-murid-4',
    submitted_at: '2026-10-24 14:20:00',
    text_answer: `Jawaban Doni Firmansyah (Kelas VII-B):
1. 2/3 + 1/4 = 8/12 + 3/12 = 11/12
2. 5/6 - 1/2 = 5/6 - 3/6 = 2/6 = 1/3
3. Sisa gula ibu = 2 1/2 - 3/4 - 1/2 = 5/4 = 1 1/4 kg
4. 3/5 x 15/9 = 45/45 = 1.`,
    file_name: 'Jawaban_Doni_Pecahan_7B.pdf',
    file_url: '#',
    score: 92,
    feedback: 'Penyelesaian pecahan sangat teliti dan penyederhanaan sudah tepat!',
    graded_at: '2026-10-25 10:30:00',
    status: 'graded',
  },

  // Submissions VIII-A
  {
    id: 'sub-5',
    assignment_id: 'asg-7',
    student_id: 'usr-murid-7',
    submitted_at: '2026-10-23 18:30:00',
    text_answer: `Jawaban Gilang Ramadan (Kelas VIII-A):
Barisan: 5, 9, 13, 17, ...
a = 5, b = 4
U50 = a + (50 - 1)b = 5 + 49 x 4 = 5 + 196 = 201.
S20 = 20/2 x (2(5) + 19(4)) = 10 x (10 + 76) = 10 x 86 = 860.`,
    file_name: 'Tugas_Gilang_Barisan_Deret.pdf',
    file_url: '#',
    score: 98,
    feedback: 'Luar biasa Gilang! Perhitungan suku ke-50 dan jumlah 20 suku pertama tepat 100%.',
    graded_at: '2026-10-24 11:00:00',
    status: 'graded',
  },

  // Submissions VIII-B
  {
    id: 'sub-6',
    assignment_id: 'asg-10',
    student_id: 'usr-murid-10',
    submitted_at: '2026-10-24 16:15:00',
    text_answer: `Jawaban Joko Prasetyo (Kelas VIII-B):
Titik A(-3, 2), B(5, 2), C(5, -4), D(-3, -4)
Panjang AB = 5 - (-3) = 8 satuan
Lebar BC = 2 - (-4) = 6 satuan
Bangun yang terbentuk adalah Persegi Panjang.
Keliling = 2 x (8 + 6) = 28 satuan panjang.
Luas = 8 x 6 = 48 satuan luas.`,
    file_name: 'Gambar_Koordinat_Joko_8B.pdf',
    file_url: '#',
    score: 96,
    feedback: 'Analisis bidang koordinat sangat akurat dan gambar plot sangat rapi.',
    graded_at: '2026-10-25 08:45:00',
    status: 'graded',
  },

  // Submissions IX-A
  {
    id: 'sub-7',
    assignment_id: 'asg-13',
    student_id: 'usr-murid-13',
    submitted_at: '2026-10-22 19:40:00',
    text_answer: `Jawaban M. Rizky Pratama (Kelas IX-A):
1. 8 / √2 = (8√2) / 2 = 4√2
2. 6 / (3 + √3) = 6(3 - √3) / (9 - 3) = 6(3 - √3) / 6 = 3 - √3
3. √75 + √48 - √12 = 5√3 + 4√3 - 2√3 = 7√3.`,
    file_name: 'Tugas_Rasionalisasi_Rizky_9A.pdf',
    file_url: '#',
    score: 94,
    feedback: 'Bagus sekali Rizky! Pemahaman bentuk sekawan rasionalisasi penyebut sudah mantap.',
    graded_at: '2026-10-23 14:00:00',
    status: 'graded',
  },

  // Submissions IX-B
  {
    id: 'sub-8',
    assignment_id: 'asg-16',
    student_id: 'usr-murid-16',
    submitted_at: '2026-10-23 20:00:00',
    text_answer: `Jawaban Putri Rahayu (Kelas IX-B):
Persamaan: 2x² - 5x - 3 = 0
a = 2, b = -5, c = -3
D = b² - 4ac = (-5)² - 4(2)(-3) = 25 + 24 = 49 (D > 0, dua akar real berlainan)
x1,2 = (-(-5) ± √49) / (2 x 2) = (5 ± 7) / 4
x1 = (5 + 7)/4 = 12/4 = 3
x2 = (5 - 7)/4 = -2/4 = -1/2.
Himpunan Penyelesaian = {-1/2, 3}.`,
    file_name: 'Jawaban_Putri_Rumus_ABC_9B.pdf',
    file_url: '#',
    score: 100,
    feedback: 'Sempurna! Langkah demi langkah faktorisasi dan rumus ABC ditulis dengan sangat runtut.',
    graded_at: '2026-10-24 13:20:00',
    status: 'graded',
  },
];

export const initialQuizzes: Quiz[] = [
  {
    id: 'qz-1',
    type: 'kuis',
    subject_id: 'sbj-mtk',
    class_id: 'cls-7a',
    teacher_id: 'usr-guru-1',
    title: 'Kuis Harian 1: Pemahaman Operasi Bilangan Bulat',
    instructions: 'Kuis terdiri dari 5 soal pilihan ganda dan isian singkat. Durasi waktu 20 menit. Pastikan koneksi stabil sebelum memulai!',
    duration_minutes: 20,
    start_time: '2026-10-20 00:00',
    end_time: '2026-11-15 23:59',
    max_attempts: 2,
    randomize_questions: true,
    show_answers_after: true,
    passing_score: 75,
    status: 'active',
    created_at: '2026-10-20 08:00:00',
    questions: [
      {
        id: 'q-101',
        quiz_id: 'qz-1',
        subject_id: 'sbj-mtk',
        grade: 'VII',
        type: 'pilihan_ganda',
        question_text: 'Hasil dari (-12) + 7 × (-3) adalah...',
        options: [
          { key: 'A', text: '-33' },
          { key: 'B', text: '-15' },
          { key: 'C', text: '9' },
          { key: 'D', text: '33' },
        ],
        correct_answer: 'A',
        explanation: 'Dahulukan perkalian: 7 × (-3) = -21. Kemudian: (-12) + (-21) = -33.',
        points: 20,
        difficulty: 'sedang',
      },
      {
        id: 'q-102',
        quiz_id: 'qz-1',
        subject_id: 'sbj-mtk',
        grade: 'VII',
        type: 'pilihan_ganda',
        question_text: 'Suhu di kota London adalah -2°C, sedangkan suhu di kota Tokyo adalah 15°C. Selisih suhu kedua kota tersebut adalah...',
        options: [
          { key: 'A', text: '13°C' },
          { key: 'B', text: '17°C' },
          { key: 'C', text: '-17°C' },
          { key: 'D', text: '-13°C' },
        ],
        correct_answer: 'B',
        explanation: 'Selisih suhu = Nilai tertinggi - Nilai terendah = 15 - (-2) = 15 + 2 = 17°C.',
        points: 20,
        difficulty: 'mudah',
      },
      {
        id: 'q-103',
        quiz_id: 'qz-1',
        subject_id: 'sbj-mtk',
        grade: 'VII',
        type: 'benar_salah',
        question_text: 'Pernyataan berikut: "Hasil dari bilangan bulat negatif dipangkatkan bilangan bulat genap positif selalu menghasilkan bilangan positif." Benar atau Salah?',
        options: [
          { key: 'A', text: 'Benar' },
          { key: 'B', text: 'Salah' },
        ],
        correct_answer: 'A',
        explanation: 'Contoh: (-2)^2 = 4 (positif), (-3)^4 = 81 (positif). Maka pernyataan adalah BENAR.',
        points: 20,
        difficulty: 'sedang',
      },
      {
        id: 'q-104',
        quiz_id: 'qz-1',
        subject_id: 'sbj-mtk',
        grade: 'VII',
        type: 'pilihan_ganda',
        question_text: 'Dalam kompetisi matematika, setiap jawaban benar diberi nilai 4, salah diberi nilai -2, dan tidak dijawab 0. Dari 25 soal, Rian menjawab benar 18 soal dan tidak menjawab 3 soal. Total skor Rian adalah...',
        options: [
          { key: 'A', text: '72' },
          { key: 'B', text: '68' },
          { key: 'C', text: '64' },
          { key: 'D', text: '60' },
        ],
        correct_answer: 'C',
        explanation: 'Soal salah = 25 - 18 - 3 = 4 soal. Skor = (18 × 4) + (4 × -2) + (3 × 0) = 72 - 8 = 64.',
        points: 20,
        difficulty: 'sedang',
      },
      {
        id: 'q-105',
        quiz_id: 'qz-1',
        subject_id: 'sbj-mtk',
        grade: 'VII',
        type: 'isian',
        question_text: 'Berapakah nilai dari: 100 : (-5) + 30?',
        correct_answer: '10',
        explanation: '100 : (-5) = -20. Kemudian -20 + 30 = 10.',
        points: 20,
        difficulty: 'mudah',
      },
    ],
  },
  {
    id: 'qz-2',
    type: 'ujian',
    subject_id: 'sbj-mtk',
    class_id: 'cls-7a',
    teacher_id: 'usr-guru-1',
    title: 'Penilaian Tengah Semester (PTS) CBT Matematika Kelas VII',
    instructions: 'Ujian Terjadwal Resmi. Mode CBT dengan timer otomatis dan anti-curang. Nilai kelulusan KKM adalah 75.',
    duration_minutes: 45,
    start_time: '2026-10-28 07:00',
    end_time: '2026-11-20 23:59',
    max_attempts: 1,
    randomize_questions: false,
    show_answers_after: false,
    passing_score: 75,
    status: 'active',
    created_at: '2026-10-25 09:00:00',
    questions: [
      {
        id: 'q-201',
        quiz_id: 'qz-2',
        subject_id: 'sbj-mtk',
        grade: 'VII',
        type: 'pilihan_ganda',
        question_text: 'FPB dan KPK dari 24 dan 36 berturut-turut adalah...',
        options: [
          { key: 'A', text: '6 dan 72' },
          { key: 'B', text: '12 dan 72' },
          { key: 'C', text: '12 dan 144' },
          { key: 'D', text: '24 dan 72' },
        ],
        correct_answer: 'B',
        explanation: '24 = 2^3 × 3; 36 = 2^2 × 3^2. FPB = 2^2 × 3 = 12. KPK = 2^3 × 3^2 = 72.',
        points: 25,
        difficulty: 'sedang',
      },
      {
        id: 'q-202',
        quiz_id: 'qz-2',
        subject_id: 'sbj-mtk',
        grade: 'VII',
        type: 'pilihan_ganda',
        question_text: 'Urutan pecahan 2/3, 3/5, 5/6 dari yang terkecil hingga terbesar adalah...',
        options: [
          { key: 'A', text: '3/5, 2/3, 5/6' },
          { key: 'B', text: '2/3, 3/5, 5/6' },
          { key: 'C', text: '5/6, 2/3, 3/5' },
          { key: 'D', text: '3/5, 5/6, 2/3' },
        ],
        correct_answer: 'A',
        explanation: 'Samakan penyebut (KPK 30): 2/3 = 20/30; 3/5 = 18/30; 5/6 = 25/30. Urutan: 18/30 < 20/30 < 25/30.',
        points: 25,
        difficulty: 'sedang',
      },
      {
        id: 'q-203',
        quiz_id: 'qz-2',
        subject_id: 'sbj-mtk',
        grade: 'VII',
        type: 'pilihan_ganda',
        question_text: 'Bentuk sederhana dari 3(2x - 4) + 5(x + 2) adalah...',
        options: [
          { key: 'A', text: '11x - 2' },
          { key: 'B', text: '11x + 2' },
          { key: 'C', text: 'x - 2' },
          { key: 'D', text: '11x - 22' },
        ],
        correct_answer: 'A',
        explanation: '6x - 12 + 5x + 10 = (6x + 5x) + (-12 + 10) = 11x - 2.',
        points: 25,
        difficulty: 'sedang',
      },
      {
        id: 'q-204',
        quiz_id: 'qz-2',
        subject_id: 'sbj-mtk',
        grade: 'VII',
        type: 'esai',
        question_text: 'Pak Budi membeli 3 karung beras seberat total 150 kg dengan tara 2%. Tentukan neto (berat bersih) beras yang dibeli Pak Budi!',
        correct_answer: '147 kg',
        explanation: 'Tara = 2% × 150 kg = 3 kg. Neto = Bruto - Tara = 150 - 3 = 147 kg.',
        points: 25,
        difficulty: 'sedang',
      },
    ],
  },
  {
    id: 'qz-3',
    type: 'kuis',
    subject_id: 'sbj-mtk',
    class_id: 'cls-7b',
    teacher_id: 'usr-guru-1',
    title: 'Kuis Harian: Bilangan Bulat & Pecahan (Kelas VII-B)',
    instructions: 'Kuis formatif harian. Kerjakan 5 butir soal secara mandiri.',
    duration_minutes: 15,
    start_time: '2026-10-20 08:00',
    end_time: '2026-11-20 23:59',
    max_attempts: 3,
    randomize_questions: true,
    show_answers_after: true,
    passing_score: 75,
    status: 'active',
    created_at: '2026-10-20 08:00:00',
    questions: [
      {
        id: 'q-301',
        quiz_id: 'qz-3',
        subject_id: 'sbj-mtk',
        grade: 'VII',
        type: 'pilihan_ganda',
        question_text: 'Hasil dari 15 - (-8) + (-12) adalah...',
        options: [
          { key: 'A', text: '11' },
          { key: 'B', text: '-5' },
          { key: 'C', text: '35' },
          { key: 'D', text: '-11' },
        ],
        correct_answer: 'A',
        explanation: '15 + 8 - 12 = 23 - 12 = 11.',
        points: 50,
        difficulty: 'mudah',
      },
      {
        id: 'q-302',
        quiz_id: 'qz-3',
        subject_id: 'sbj-mtk',
        grade: 'VII',
        type: 'benar_salah',
        question_text: 'Nilai dari 3/4 senilai dengan 75%. Benar atau Salah?',
        options: [
          { key: 'A', text: 'Benar' },
          { key: 'B', text: 'Salah' },
        ],
        correct_answer: 'A',
        explanation: '3/4 = 0.75 = 75%. Benar.',
        points: 50,
        difficulty: 'mudah',
      },
    ],
  },
  {
    id: 'qz-4',
    type: 'ujian',
    subject_id: 'sbj-ipa',
    class_id: 'cls-8a',
    teacher_id: 'usr-guru-2',
    title: 'Penilaian Tengah Semester (PTS) CBT IPA Terpadu Kelas VIII-A',
    instructions: 'Ujian resmi CBT Sistem Pencernaan dan Gerak Benda. Waktu pengerjaan 40 menit.',
    duration_minutes: 40,
    start_time: '2026-10-28 07:00',
    end_time: '2026-11-20 23:59',
    max_attempts: 1,
    randomize_questions: false,
    show_answers_after: false,
    passing_score: 75,
    status: 'active',
    created_at: '2026-10-25 09:00:00',
    questions: [
      {
        id: 'q-401',
        quiz_id: 'qz-4',
        subject_id: 'sbj-ipa',
        grade: 'VIII',
        type: 'pilihan_ganda',
        question_text: 'Organ pencernaan manusia yang berfungsi menyerap sari-sari makanan adalah...',
        options: [
          { key: 'A', text: 'Lambung' },
          { key: 'B', text: 'Usus Halus' },
          { key: 'C', text: 'Usus Besar' },
          { key: 'D', text: 'Kerongkongan' },
        ],
        correct_answer: 'B',
        explanation: 'Penyerapan sari makanan terjadi di usus halus (jejunum dan ileum).',
        points: 50,
        difficulty: 'mudah',
      },
      {
        id: 'q-402',
        quiz_id: 'qz-4',
        subject_id: 'sbj-ipa',
        grade: 'VIII',
        type: 'pilihan_ganda',
        question_text: 'Hukum Newton II menyatakan bahwa percepatan berbanding lurus dengan...',
        options: [
          { key: 'A', text: 'Massa benda' },
          { key: 'B', text: 'Gaya yang bekerja' },
          { key: 'C', text: 'Kecepatan awal' },
          { key: 'D', text: 'Jarak tempuh' },
        ],
        correct_answer: 'B',
        explanation: 'F = m . a, maka a = F / m (berbanding lurus dengan gaya F).',
        points: 50,
        difficulty: 'sedang',
      },
    ],
  },
  {
    id: 'qz-5',
    type: 'kuis',
    subject_id: 'sbj-ipa',
    class_id: 'cls-8b',
    teacher_id: 'usr-guru-2',
    title: 'Kuis Harian: Sistem Ekskresi & Nutrisi (Kelas VIII-B)',
    instructions: 'Kuis pemahaman cepat materi nutrisi makanan seimbang dan ginjal.',
    duration_minutes: 20,
    start_time: '2026-10-20 08:00',
    end_time: '2026-11-20 23:59',
    max_attempts: 2,
    randomize_questions: true,
    show_answers_after: true,
    passing_score: 75,
    status: 'active',
    created_at: '2026-10-20 08:00:00',
    questions: [
      {
        id: 'q-501',
        quiz_id: 'qz-5',
        subject_id: 'sbj-ipa',
        grade: 'VIII',
        type: 'pilihan_ganda',
        question_text: 'Zat makanan yang berfungsi sebagai pembangun jaringan tubuh yang rusak adalah...',
        options: [
          { key: 'A', text: 'Karbohidrat' },
          { key: 'B', text: 'Protein' },
          { key: 'C', text: 'Lemak' },
          { key: 'D', text: 'Vitamin' },
        ],
        correct_answer: 'B',
        explanation: 'Protein adalah zat pembangun dan perbaikan sel tubuh yang rusak.',
        points: 50,
        difficulty: 'mudah',
      },
      {
        id: 'q-502',
        quiz_id: 'qz-5',
        subject_id: 'sbj-ipa',
        grade: 'VIII',
        type: 'benar_salah',
        question_text: 'Organ ginjal menghasilkan zat sisa berupa keringat. Benar atau Salah?',
        options: [
          { key: 'A', text: 'Benar' },
          { key: 'B', text: 'Salah' },
        ],
        correct_answer: 'B',
        explanation: 'Ginjal menghasilkan urine, sedangkan keringat diekskresikan oleh kulit.',
        points: 50,
        difficulty: 'mudah',
      },
    ],
  },
  {
    id: 'qz-6',
    type: 'ujian',
    subject_id: 'sbj-indo',
    class_id: 'cls-9a',
    teacher_id: 'usr-guru-3',
    title: 'Penilaian Akhir Semester (PAS) CBT Bahasa Indonesia Kelas IX-A',
    instructions: 'Ujian CBT Literasi Kritis, Teks Laporan Percobaan, dan Pidato Persuasif.',
    duration_minutes: 60,
    start_time: '2026-10-28 07:00',
    end_time: '2026-11-20 23:59',
    max_attempts: 1,
    randomize_questions: false,
    show_answers_after: false,
    passing_score: 75,
    status: 'active',
    created_at: '2026-10-25 09:00:00',
    questions: [
      {
        id: 'q-601',
        quiz_id: 'qz-6',
        subject_id: 'sbj-indo',
        grade: 'IX',
        type: 'pilihan_ganda',
        question_text: 'Bagian pidato yang memuat salam pembuka, ucapan syukur, dan penghormatan disebut...',
        options: [
          { key: 'A', text: 'Pendahuluan' },
          { key: 'B', text: 'Isi Pidato' },
          { key: 'C', text: 'Penutup' },
          { key: 'D', text: 'Simpulan' },
        ],
        correct_answer: 'A',
        explanation: 'Bagian pendahuluan memuat salam pembuka, sapaan hormat, dan rasa syukur.',
        points: 50,
        difficulty: 'mudah',
      },
      {
        id: 'q-602',
        quiz_id: 'qz-6',
        subject_id: 'sbj-indo',
        grade: 'IX',
        type: 'pilihan_ganda',
        question_text: 'Ciri utama kalimat persuasif dalam teks pidato adalah...',
        options: [
          { key: 'A', text: 'Berisi ajakan atau bujukan dengan kata "mari", "ayo"' },
          { key: 'B', text: 'Mendeskripsikan objek secara rinci' },
          { key: 'C', text: 'Memuat alur waktu kronologis' },
          { key: 'D', text: 'Menjelaskan langkah kerja suatu alat' },
        ],
        correct_answer: 'A',
        explanation: 'Persuasif bertujuan mempengaruhi dan mengajak pembaca/pendengar.',
        points: 50,
        difficulty: 'mudah',
      },
    ],
  },
  {
    id: 'qz-7',
    type: 'kuis',
    subject_id: 'sbj-indo',
    class_id: 'cls-9b',
    teacher_id: 'usr-guru-3',
    title: 'Kuis Harian: Cerpen & Unsur Intrinsik (Kelas IX-B)',
    instructions: 'Kuis latihan pemahaman tema, tokoh, penokohan, dan amanat cerpen.',
    duration_minutes: 20,
    start_time: '2026-10-20 08:00',
    end_time: '2026-11-20 23:59',
    max_attempts: 2,
    randomize_questions: true,
    show_answers_after: true,
    passing_score: 75,
    status: 'active',
    created_at: '2026-10-20 08:00:00',
    questions: [
      {
        id: 'q-701',
        quiz_id: 'qz-7',
        subject_id: 'sbj-indo',
        grade: 'IX',
        type: 'pilihan_ganda',
        question_text: 'Pesan moral atau nasihat yang ingin disampaikan pengarang melalui cerita disebut...',
        options: [
          { key: 'A', text: 'Amanat' },
          { key: 'B', text: 'Latar' },
          { key: 'C', text: 'Alur' },
          { key: 'D', text: 'Sudut Pandang' },
        ],
        correct_answer: 'A',
        explanation: 'Amanat adalah pesan moral dalam karya sastra.',
        points: 50,
        difficulty: 'mudah',
      },
      {
        id: 'q-702',
        quiz_id: 'qz-7',
        subject_id: 'sbj-indo',
        grade: 'IX',
        type: 'benar_salah',
        question_text: 'Tokoh antagonis adalah tokoh yang selalu mendukung dan searah dengan tujuan tokoh utama. Benar atau Salah?',
        options: [
          { key: 'A', text: 'Benar' },
          { key: 'B', text: 'Salah' },
        ],
        correct_answer: 'B',
        explanation: 'Tokoh antagonis adalah penentang atau oposisi tokoh protagonis (utama).',
        points: 50,
        difficulty: 'mudah',
      },
    ],
  },
  // KELAS VII-B UJIAN CBT
  {
    id: 'qz-8',
    type: 'ujian',
    subject_id: 'sbj-mtk',
    class_id: 'cls-7b',
    teacher_id: 'usr-guru-1',
    title: 'Penilaian Tengah Semester (PTS) CBT Matematika Kelas VII-B',
    instructions: 'Ujian Terjadwal Resmi PTS Ganjil. Materi: Bilangan Bulat dan Pecahan Senilai. Durasi 45 menit.',
    duration_minutes: 45,
    start_time: '2026-10-28 07:00',
    end_time: '2026-11-20 23:59',
    max_attempts: 1,
    randomize_questions: false,
    show_answers_after: false,
    passing_score: 75,
    status: 'active',
    created_at: '2026-10-25 09:00:00',
    questions: [
      {
        id: 'q-801',
        quiz_id: 'qz-8',
        subject_id: 'sbj-mtk',
        grade: 'VII',
        type: 'pilihan_ganda',
        question_text: 'Bentuk paling sederhana dari pecahan 48/72 adalah...',
        options: [
          { key: 'A', text: '2/3' },
          { key: 'B', text: '3/4' },
          { key: 'C', text: '4/6' },
          { key: 'D', text: '1/2' },
        ],
        correct_answer: 'A',
        explanation: 'Bagi pembilang dan penyebut dengan FPB(48, 72) = 24. 48:24 / 72:24 = 2/3.',
        points: 50,
        difficulty: 'mudah',
      },
      {
        id: 'q-802',
        quiz_id: 'qz-8',
        subject_id: 'sbj-mtk',
        grade: 'VII',
        type: 'pilihan_ganda',
        question_text: 'Hasil dari 2 1/2 + 1 3/4 - 1/2 adalah...',
        options: [
          { key: 'A', text: '3 3/4' },
          { key: 'B', text: '3 1/2' },
          { key: 'C', text: '4' },
          { key: 'D', text: '3 1/4' },
        ],
        correct_answer: 'A',
        explanation: '2 1/2 - 1/2 = 2. Kemudian 2 + 1 3/4 = 3 3/4.',
        points: 50,
        difficulty: 'sedang',
      },
    ],
  },
  // KELAS VIII-A KUIS
  {
    id: 'qz-9',
    type: 'kuis',
    subject_id: 'sbj-ipa',
    class_id: 'cls-8a',
    teacher_id: 'usr-guru-2',
    title: 'Kuis Harian: Sistem Rangka & Sendi Manusia (Kelas VIII-A)',
    instructions: 'Kuis pemahaman cepat struktur tulang dan persendian. Waktu 20 menit.',
    duration_minutes: 20,
    start_time: '2026-10-20 08:00',
    end_time: '2026-11-20 23:59',
    max_attempts: 2,
    randomize_questions: true,
    show_answers_after: true,
    passing_score: 75,
    status: 'active',
    created_at: '2026-10-20 08:00:00',
    questions: [
      {
        id: 'q-901',
        quiz_id: 'qz-9',
        subject_id: 'sbj-ipa',
        grade: 'VIII',
        type: 'pilihan_ganda',
        question_text: 'Sendi yang memungkinkan pergerakan ke segala arah adalah...',
        options: [
          { key: 'A', text: 'Sendi Peluru' },
          { key: 'B', text: 'Sendi Engsel' },
          { key: 'C', text: 'Sendi Putar' },
          { key: 'D', text: 'Sendi Pelana' },
        ],
        correct_answer: 'A',
        explanation: 'Sendi peluru menghubungkan tulang lengan atas dengan gelang bahu, memungkinkan gerak ke segala arah.',
        points: 50,
        difficulty: 'mudah',
      },
      {
        id: 'q-902',
        quiz_id: 'qz-9',
        subject_id: 'sbj-ipa',
        grade: 'VIII',
        type: 'benar_salah',
        question_text: 'Otot lurik bekerja di bawah kesadaran (volunter) dan menempel pada rangka. Benar atau Salah?',
        options: [
          { key: 'A', text: 'Benar' },
          { key: 'B', text: 'Salah' },
        ],
        correct_answer: 'A',
        explanation: 'Otot lurik adalah otot sadar yang menempel pada tulang rangka.',
        points: 50,
        difficulty: 'mudah',
      },
    ],
  },
  // KELAS VIII-B UJIAN CBT
  {
    id: 'qz-10',
    type: 'ujian',
    subject_id: 'sbj-ipa',
    class_id: 'cls-8b',
    teacher_id: 'usr-guru-2',
    title: 'Penilaian Tengah Semester (PTS) CBT IPA Terpadu Kelas VIII-B',
    instructions: 'Ujian Resmi CBT IPA: Sistem Pencernaan, Nutrisi, dan Zat Aditif Makanan.',
    duration_minutes: 45,
    start_time: '2026-10-28 07:00',
    end_time: '2026-11-20 23:59',
    max_attempts: 1,
    randomize_questions: false,
    show_answers_after: false,
    passing_score: 75,
    status: 'active',
    created_at: '2026-10-25 09:00:00',
    questions: [
      {
        id: 'q-1001',
        quiz_id: 'qz-10',
        subject_id: 'sbj-ipa',
        grade: 'VIII',
        type: 'pilihan_ganda',
        question_text: 'Reagen Biuret yang diteteskan pada putih telur akan menghasilkan perubahan warna menjadi...',
        options: [
          { key: 'A', text: 'Ungu' },
          { key: 'B', text: 'Biru Kehitaman' },
          { key: 'C', text: 'Merah Bata' },
          { key: 'D', text: 'Kuning Terang' },
        ],
        correct_answer: 'A',
        explanation: 'Reagen Biuret menguji ikatan peptida protein dan berubah menjadi warna ungu.',
        points: 50,
        difficulty: 'mudah',
      },
      {
        id: 'q-1002',
        quiz_id: 'qz-10',
        subject_id: 'sbj-ipa',
        grade: 'VIII',
        type: 'pilihan_ganda',
        question_text: 'Enzim yang dihasilkan oleh lambung untuk membunuh kuman penyakit adalah...',
        options: [
          { key: 'A', text: 'Asam Klorida (HCl)' },
          { key: 'B', text: 'Ptialin' },
          { key: 'C', text: 'Tripsin' },
          { key: 'D', text: 'Lipase' },
        ],
        correct_answer: 'A',
        explanation: 'HCl lambung menciptakan suasana sangat asam yang mematikan mikroorganisme berbahaya.',
        points: 50,
        difficulty: 'mudah',
      },
    ],
  },
  // KELAS IX-A KUIS
  {
    id: 'qz-11',
    type: 'kuis',
    subject_id: 'sbj-indo',
    class_id: 'cls-9a',
    teacher_id: 'usr-guru-3',
    title: 'Kuis Harian: Sistematika Teks Laporan Percobaan (Kelas IX-A)',
    instructions: 'Kuis formatif struktur teks laporan percobaan sains. Waktu 20 menit.',
    duration_minutes: 20,
    start_time: '2026-10-20 08:00',
    end_time: '2026-11-20 23:59',
    max_attempts: 2,
    randomize_questions: true,
    show_answers_after: true,
    passing_score: 75,
    status: 'active',
    created_at: '2026-10-20 08:00:00',
    questions: [
      {
        id: 'q-1101',
        quiz_id: 'qz-11',
        subject_id: 'sbj-indo',
        grade: 'IX',
        type: 'pilihan_ganda',
        question_text: 'Bagian yang memuat dugaan sementara atau hipotesis sebelum percobaan dimulai adalah...',
        options: [
          { key: 'A', text: 'Landasan Teori / Hipotesis' },
          { key: 'B', text: 'Simpulan Akhir' },
          { key: 'C', text: 'Daftar Pustaka' },
          { key: 'D', text: 'Pembahasan Data' },
        ],
        correct_answer: 'A',
        explanation: 'Hipotesis dirumuskan di awal berdasarkan kajian teori sebelum pengujian lapangan.',
        points: 50,
        difficulty: 'mudah',
      },
      {
        id: 'q-1102',
        quiz_id: 'qz-11',
        subject_id: 'sbj-indo',
        grade: 'IX',
        type: 'benar_salah',
        question_text: 'Teks laporan percobaan harus bersifat objektif dan dapat dibuktikan kebenarannya melalui replikasi eksperimen. Benar atau Salah?',
        options: [
          { key: 'A', text: 'Benar' },
          { key: 'B', text: 'Salah' },
        ],
        correct_answer: 'A',
        explanation: 'Ciri utama laporan ilmiah adalah objektivitas dan verifikatif.',
        points: 50,
        difficulty: 'mudah',
      },
    ],
  },
  // KELAS IX-B UJIAN CBT
  {
    id: 'qz-12',
    type: 'ujian',
    subject_id: 'sbj-indo',
    class_id: 'cls-9b',
    teacher_id: 'usr-guru-3',
    title: 'Penilaian Akhir Semester (PAS) CBT Bahasa Indonesia Kelas IX-B',
    instructions: 'Ujian Terjadwal Resmi PAS Ganjil. Materi: Pidato Persuasif dan Teks Cerpen.',
    duration_minutes: 60,
    start_time: '2026-10-28 07:00',
    end_time: '2026-11-20 23:59',
    max_attempts: 1,
    randomize_questions: false,
    show_answers_after: false,
    passing_score: 75,
    status: 'active',
    created_at: '2026-10-25 09:00:00',
    questions: [
      {
        id: 'q-1201',
        quiz_id: 'qz-12',
        subject_id: 'sbj-indo',
        grade: 'IX',
        type: 'pilihan_ganda',
        question_text: 'Tiga pilar pendekatan persuasi menurut Aristoteles adalah...',
        options: [
          { key: 'A', text: 'Ethos, Pathos, dan Logos' },
          { key: 'B', text: 'Tema, Alur, dan Amanat' },
          { key: 'C', text: 'Fakta, Opini, dan Hipotesis' },
          { key: 'D', text: 'Subjek, Predikat, dan Objek' },
        ],
        correct_answer: 'A',
        explanation: 'Tiga pilar retorika Aristoteles: Ethos (karakter/etika), Pathos (emosi), dan Logos (logika).',
        points: 50,
        difficulty: 'sedang',
      },
      {
        id: 'q-1202',
        quiz_id: 'qz-12',
        subject_id: 'sbj-indo',
        grade: 'IX',
        type: 'pilihan_ganda',
        question_text: 'Kalimat yang menggunakan kata emotif untuk membangkitkan kepedulian adalah...',
        options: [
          { key: 'A', text: '"Mari bersama-sama kita ulurkan tangan demi menyelamatkan masa depan generasi penerus bangsa!"' },
          { key: 'B', text: '"Kegiatan upacara dilaksanakan pada pukul 07.00 WIB di lapangan sekolah."' },
          { key: 'C', text: '"SMP N 1 JAYA didirikan pada tahun 1985."' },
          { key: 'D', text: '"Panjang meja laboratorium adalah dua meter."' },
        ],
        correct_answer: 'A',
        explanation: 'Kalimat A menggugah perasaan dan rasa tanggung jawab sosial secara persuasif.',
        points: 50,
        difficulty: 'mudah',
      },
    ],
  },
];

export const initialQuizAttempts: QuizAttempt[] = [
  // VII-A
  {
    id: 'qa-1',
    quiz_id: 'qz-1',
    student_id: 'usr-murid-2',
    start_time: '2026-10-21 14:00:00',
    submit_time: '2026-10-21 14:14:22',
    time_spent_seconds: 862,
    answers: [
      { question_id: 'q-101', student_answer: 'A', is_correct: true, earned_score: 20 },
      { question_id: 'q-102', student_answer: 'B', is_correct: true, earned_score: 20 },
      { question_id: 'q-103', student_answer: 'A', is_correct: true, earned_score: 20 },
      { question_id: 'q-104', student_answer: 'C', is_correct: true, earned_score: 20 },
      { question_id: 'q-105', student_answer: '10', is_correct: true, earned_score: 20 },
    ],
    auto_score: 100,
    essay_score: 0,
    total_score: 100,
    status: 'graded',
  },
  // VII-B
  {
    id: 'qa-2',
    quiz_id: 'qz-3',
    student_id: 'usr-murid-4',
    start_time: '2026-10-22 10:00:00',
    submit_time: '2026-10-22 10:12:30',
    time_spent_seconds: 750,
    answers: [
      { question_id: 'q-301', student_answer: 'A', is_correct: true, earned_score: 50 },
      { question_id: 'q-302', student_answer: 'A', is_correct: true, earned_score: 50 },
    ],
    auto_score: 100,
    essay_score: 0,
    total_score: 100,
    status: 'graded',
  },
  // VIII-A
  {
    id: 'qa-3',
    quiz_id: 'qz-9',
    student_id: 'usr-murid-7',
    start_time: '2026-10-22 11:00:00',
    submit_time: '2026-10-22 11:15:00',
    time_spent_seconds: 900,
    answers: [
      { question_id: 'q-901', student_answer: 'A', is_correct: true, earned_score: 50 },
      { question_id: 'q-902', student_answer: 'A', is_correct: true, earned_score: 50 },
    ],
    auto_score: 100,
    essay_score: 0,
    total_score: 100,
    status: 'graded',
  },
  // VIII-B
  {
    id: 'qa-4',
    quiz_id: 'qz-5',
    student_id: 'usr-murid-10',
    start_time: '2026-10-23 09:30:00',
    submit_time: '2026-10-23 09:42:00',
    time_spent_seconds: 720,
    answers: [
      { question_id: 'q-501', student_answer: 'B', is_correct: true, earned_score: 50 },
      { question_id: 'q-502', student_answer: 'B', is_correct: true, earned_score: 50 },
    ],
    auto_score: 100,
    essay_score: 0,
    total_score: 100,
    status: 'graded',
  },
  // IX-A
  {
    id: 'qa-5',
    quiz_id: 'qz-11',
    student_id: 'usr-murid-13',
    start_time: '2026-10-23 13:00:00',
    submit_time: '2026-10-23 13:14:00',
    time_spent_seconds: 840,
    answers: [
      { question_id: 'q-1101', student_answer: 'A', is_correct: true, earned_score: 50 },
      { question_id: 'q-1102', student_answer: 'A', is_correct: true, earned_score: 50 },
    ],
    auto_score: 100,
    essay_score: 0,
    total_score: 100,
    status: 'graded',
  },
  // IX-B
  {
    id: 'qa-6',
    quiz_id: 'qz-7',
    student_id: 'usr-murid-16',
    start_time: '2026-10-23 15:00:00',
    submit_time: '2026-10-23 15:11:30',
    time_spent_seconds: 690,
    answers: [
      { question_id: 'q-701', student_answer: 'A', is_correct: true, earned_score: 50 },
      { question_id: 'q-702', student_answer: 'B', is_correct: true, earned_score: 50 },
    ],
    auto_score: 100,
    essay_score: 0,
    total_score: 100,
    status: 'graded',
  },
];

export const initialDiscussions: Discussion[] = [
  {
    id: 'disc-1',
    subject_id: 'sbj-mtk',
    class_id: 'cls-7a',
    user_id: 'usr-guru-1',
    user_name: 'Dra. Hj. Siti Nurjanah, M.Pd.',
    user_role: 'guru',
    user_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    title: '📌 Forum Tanya Jawab Bab 1: Bilangan Bulat',
    content: 'Silakan ajukan pertanyaan jika ada bagian dari materi Bab 1 atau soal latihan yang masih membingungkan. Mari kita diskusikan bersama!',
    is_pinned: true,
    created_at: '2026-10-16 08:30:00',
    replies: [
      {
        id: 'rep-1',
        discussion_id: 'disc-1',
        user_id: 'usr-murid-1',
        user_name: 'Ahmad Fauzi Pratama',
        user_role: 'murid',
        user_avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        content: 'Ibu guru, apakah jika bilangan minus dikalikan tiga kali berturut-turut hasilnya tetap minus?',
        is_helpful: false,
        created_at: '2026-10-16 10:15:00',
      },
      {
        id: 'rep-2',
        discussion_id: 'disc-1',
        user_id: 'usr-guru-1',
        user_name: 'Dra. Hj. Siti Nurjanah, M.Pd.',
        user_role: 'guru',
        user_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        content: 'Benar sekali Ahmad! Karena (-) × (-) = (+), lalu (+) × (-) = (-). Secara umum, bilangan negatif yang dipangkatkan bilangan ganjil selalu menghasilkan nilai negatif.',
        is_helpful: true,
        created_at: '2026-10-16 11:00:00',
      },
    ],
  },
  {
    id: 'disc-2',
    subject_id: 'sbj-mtk',
    class_id: 'cls-7b',
    user_id: 'usr-guru-1',
    user_name: 'Dra. Hj. Siti Nurjanah, M.Pd.',
    user_role: 'guru',
    user_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    title: '📌 Diskusi Bab 1: Menyederhanakan Pecahan Campuran (VII-B)',
    content: 'Anak-anak kelas VII-B, jangan lupa bahwa sebelum mengalikan pecahan campuran, harus diubah dulu menjadi pecahan biasa ya. Jika ada kesulitan, tanyakan di sini.',
    is_pinned: true,
    created_at: '2026-10-18 09:00:00',
    replies: [
      {
        id: 'rep-3',
        discussion_id: 'disc-2',
        user_id: 'usr-murid-4',
        user_name: 'Doni Firmansyah',
        user_role: 'murid',
        user_avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        content: 'Terima kasih Bu Siti, saya sudah mencobanya untuk tugas nomor 3 dan hasilnya pas 1 1/4 kg.',
        is_helpful: true,
        created_at: '2026-10-18 10:20:00',
      },
    ],
  },
  {
    id: 'disc-3',
    subject_id: 'sbj-ipa',
    class_id: 'cls-8a',
    user_id: 'usr-guru-2',
    user_name: 'Budi Santoso, S.Pd., M.Si.',
    user_role: 'guru',
    user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: '📌 Forum Tanya Jawab Sistem Rangka & Otot Manusia (VIII-A)',
    content: 'Silakan diskusikan jenis-jenis sendi diartrosis dan mekanismenya pada tubuh manusia.',
    is_pinned: true,
    created_at: '2026-10-19 13:00:00',
    replies: [
      {
        id: 'rep-4',
        discussion_id: 'disc-3',
        user_id: 'usr-murid-7',
        user_name: 'Gilang Ramadan',
        user_role: 'murid',
        user_avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
        content: 'Pak Budi, kenapa sendi peluru memiliki sudut putar paling fleksibel dibandingkan sendi engsel?',
        is_helpful: false,
        created_at: '2026-10-19 14:15:00',
      },
      {
        id: 'rep-5',
        discussion_id: 'disc-3',
        user_id: 'usr-guru-2',
        user_name: 'Budi Santoso, S.Pd., M.Si.',
        user_role: 'guru',
        user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: 'Pertanyaan bagus Gilang! Karena bentuk bonggolnya bulat seperti bola yang masuk ke dalam mangkok sendi berlekuk, sehingga dapat berputar bebas 360 derajat.',
        is_helpful: true,
        created_at: '2026-10-19 15:00:00',
      },
    ],
  },
  {
    id: 'disc-4',
    subject_id: 'sbj-mtk',
    class_id: 'cls-8b',
    user_id: 'usr-guru-1',
    user_name: 'Dra. Hj. Siti Nurjanah, M.Pd.',
    user_role: 'guru',
    user_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    title: '📌 Forum Koordinat Kartesius & Jarak Titik (VIII-B)',
    content: 'Apakah kalian sudah bisa menentukan letak kuadran untuk titik yang bernilai x negatif dan y positif?',
    is_pinned: true,
    created_at: '2026-10-19 10:00:00',
    replies: [],
  },
  {
    id: 'disc-5',
    subject_id: 'sbj-indo',
    class_id: 'cls-9a',
    user_id: 'usr-guru-3',
    user_name: 'Dewi Lestari, S.Pd.',
    user_role: 'guru',
    user_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: '📌 Konsultasi Judul Laporan Percobaan Sains (IX-A)',
    content: 'Tuliskan judul laporan percobaan yang kalian rencanakan untuk tugas Bab 1 di sini sebelum memulai penulisan lengkap.',
    is_pinned: true,
    created_at: '2026-10-20 08:30:00',
    replies: [],
  },
  {
    id: 'disc-6',
    subject_id: 'sbj-indo',
    class_id: 'cls-9b',
    user_id: 'usr-guru-3',
    user_name: 'Dewi Lestari, S.Pd.',
    user_role: 'guru',
    user_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: '📌 Diskusi Teknik Oratoris & Intonasi Pidato (IX-B)',
    content: 'Saat menyampaikan pidato persuasif, jangan lupa jeda dan kontak mata dengan audiens ya anak-anak!',
    is_pinned: true,
    created_at: '2026-10-20 09:15:00',
    replies: [],
  },
];

export const initialAttendances: AttendanceSession[] = [
  {
    id: 'att-1',
    class_id: 'cls-7a',
    subject_id: 'sbj-mtk',
    teacher_id: 'usr-guru-1',
    date: '2026-10-27',
    meeting_number: 1,
    topic: 'Operasi Bilangan Bulat Negatif',
    records: [
      { student_id: 'usr-murid-1', status: 'hadir', note: 'Aktif bertanya di kelas' },
      { student_id: 'usr-murid-2', status: 'hadir', note: 'Tepat waktu dan fokus' },
      { student_id: 'usr-murid-3', status: 'hadir', note: 'Hadir tepat waktu' },
    ],
  },
  {
    id: 'att-2',
    class_id: 'cls-7b',
    subject_id: 'sbj-inf',
    teacher_id: 'usr-guru-4',
    date: '2026-10-28',
    meeting_number: 1,
    topic: 'Pengenalan Algoritma & Perangkat Komputer',
    records: [
      { student_id: 'usr-murid-4', status: 'hadir', note: 'Praktik lab lancar' },
      { student_id: 'usr-murid-5', status: 'hadir', note: 'Tepat waktu' },
      { student_id: 'usr-murid-6', status: 'izin', note: 'Izin kegiatan UKS' },
    ],
  },
  {
    id: 'att-3',
    class_id: 'cls-8a',
    subject_id: 'sbj-ipa',
    teacher_id: 'usr-guru-2',
    date: '2026-10-29',
    meeting_number: 1,
    topic: 'Sistem Gerak pada Manusia dan Hewan',
    records: [
      { student_id: 'usr-murid-7', status: 'hadir', note: 'Aktif menjawab pertanyaan' },
      { student_id: 'usr-murid-8', status: 'hadir', note: 'Tepat waktu' },
      { student_id: 'usr-murid-9', status: 'sakit', note: 'Surat dokter terlampir' },
    ],
  },
  {
    id: 'att-4',
    class_id: 'cls-8b',
    subject_id: 'sbj-mtk',
    teacher_id: 'usr-guru-1',
    date: '2026-10-29',
    meeting_number: 1,
    topic: 'Pola Bilangan dan Barisan Aritmetika',
    records: [
      { student_id: 'usr-murid-10', status: 'hadir', note: 'Hadir tepat waktu' },
      { student_id: 'usr-murid-11', status: 'hadir', note: 'Mengerjakan latihan di papan' },
      { student_id: 'usr-murid-12', status: 'hadir', note: 'Hadir tepat waktu' },
    ],
  },
  {
    id: 'att-5',
    class_id: 'cls-9a',
    subject_id: 'sbj-indo',
    teacher_id: 'usr-guru-3',
    date: '2026-10-30',
    meeting_number: 1,
    topic: 'Teks Laporan Percobaan Ilmiah',
    records: [
      { student_id: 'usr-murid-13', status: 'hadir', note: 'Membaca presentasi kelompok' },
      { student_id: 'usr-murid-14', status: 'hadir', note: 'Hadir tepat waktu' },
      { student_id: 'usr-murid-15', status: 'hadir', note: 'Diskusi sangat antusias' },
    ],
  },
  {
    id: 'att-6',
    class_id: 'cls-9b',
    subject_id: 'sbj-indo',
    teacher_id: 'usr-guru-3',
    date: '2026-10-30',
    meeting_number: 1,
    topic: 'Menulis Pidato Persuasif',
    records: [
      { student_id: 'usr-murid-16', status: 'hadir', note: 'Hadir tepat waktu' },
      { student_id: 'usr-murid-17', status: 'hadir', note: 'Keterangan lengkap' },
      { student_id: 'usr-murid-18', status: 'hadir', note: 'Aktif merangkum materi' },
    ],
  },
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'anc-1',
    title: 'Pelaksanaan Penilaian Tengah Semester (PTS) Ganjil 2026/2027',
    content: 'Diberitahukan kepada seluruh peserta didik kelas VII, VIII, dan IX bahwa PTS Ganjil berbasis Computer-Based Test (CBT) akan dilaksanakan serentak mulai tanggal 28 Oktober 2026. Harap memastikan akun E-Learning SMP N 1 JAYA dan jaringan internet dalam kondisi optimal.',
    target: 'semua',
    author_name: 'Hendra Wijaya, S.Kom. (Administrator)',
    published_at: '2026-10-25 09:00:00',
    is_pinned: true,
  },
  {
    id: 'anc-2',
    title: 'Batas Akhir Penginputan Nilai Harian Guru Semester Ganjil',
    content: 'Bapak/Ibu Dewan Guru dimohon untuk menyelesaikan koreksi tugas dan kuis harian pada modul penilaian E-Learning paling lambat Jumat pekan depan.',
    target: 'guru',
    author_name: 'Hendra Wijaya, S.Kom. (Administrator)',
    published_at: '2026-10-26 14:00:00',
    is_pinned: false,
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    user_id: 'usr-murid-1',
    title: 'Nilai Tugas Telah Diterbitkan',
    message: 'Ibu Siti telah menilai Tugas 1 Matematika dengan skor 95.',
    type: 'nilai',
    target_tab: 'tugas',
    read: false,
    created_at: '2026-10-25 09:15:00',
  },
  {
    id: 'notif-2',
    user_id: 'usr-murid-1',
    title: 'Ujian CBT Tersedia',
    message: 'Penilaian Tengah Semester (PTS) CBT Matematika Kelas VII telah dibuka.',
    type: 'ujian',
    target_tab: 'ujian',
    read: false,
    created_at: '2026-10-28 07:00:00',
  },
];

export const initialAuditLogs: AuditLogItem[] = [
  {
    id: 'log-1',
    timestamp: '2026-11-04 09:15:22',
    user_name: 'Hendra Wijaya, S.Kom.',
    user_role: 'admin',
    action: 'SETTINGS_UPDATE',
    details: 'Memperbarui identitas resmi sekolah menjadi SMP N 1 JAYA dan banner kurikulum merdeka.',
    ip_address: '192.168.1.10',
  },
  {
    id: 'log-2',
    timestamp: '2026-11-04 08:30:10',
    user_name: 'Hendra Wijaya, S.Kom.',
    user_role: 'admin',
    action: 'LOGIN_SUCCESS',
    details: 'Login Administrator berhasil masuk ke panel sistem.',
    ip_address: '192.168.1.10',
  },
  {
    id: 'log-3',
    timestamp: '2026-11-03 14:22:05',
    user_name: 'Dra. Hj. Siti Nurjanah, M.Pd.',
    user_role: 'guru',
    action: 'LESSON_CREATE',
    details: 'Menerbitkan modul materi: Pengenalan Aljabar & Variabel Matematika (Kelas VII-A & VII-B).',
    ip_address: '192.168.1.45',
  },
  {
    id: 'log-4',
    timestamp: '2026-11-03 10:15:00',
    user_name: 'Dra. Hj. Siti Nurjanah, M.Pd.',
    user_role: 'guru',
    action: 'GRADE_SUBMISSION',
    details: 'Menilai pengumpulan tugas siswa Ahmad Fauzi Pratama (Skor: 95).',
    ip_address: '192.168.1.45',
  },
  {
    id: 'log-5',
    timestamp: '2026-11-02 11:00:30',
    user_name: 'Budi Santoso, S.Pd., M.Si.',
    user_role: 'guru',
    action: 'ATTENDANCE_RECORD',
    details: 'Merekam kehadiran tatap muka kelas VIII-A Pertemuan 3 (32 siswa hadir).',
    ip_address: '192.168.1.52',
  },
  {
    id: 'log-6',
    timestamp: '2026-11-02 09:40:12',
    user_name: 'Ahmad Fauzi Pratama',
    user_role: 'murid',
    action: 'SUBMISSION_SUBMIT',
    details: 'Mengirim lembar jawaban Tugas 1 Aljabar Dasar Kelas VII-A.',
    ip_address: '192.168.1.108',
  },
  {
    id: 'log-7',
    timestamp: '2026-11-01 13:20:00',
    user_name: 'Dewi Lestari, S.Pd.',
    user_role: 'guru',
    action: 'QUIZ_CREATE',
    details: 'Membuat paket bank soal CBT: Ujian Tengah Semester Bahasa Indonesia Kelas IX.',
    ip_address: '192.168.1.61',
  },
  {
    id: 'log-8',
    timestamp: '2026-11-01 08:05:44',
    user_name: 'Arif Kurniawan, S.Kom.',
    user_role: 'guru',
    action: 'LESSON_CREATE',
    details: 'Mengunggah materi Pemrograman Blok Dasar Scratch Informatika Kelas VII.',
    ip_address: '192.168.1.70',
  },
];

export const initialBadges: Badge[] = [
  {
    id: 'badge-1',
    title: 'Pelajar Pemula',
    description: 'Menyelesaikan login pertama dan membaca panduan E-Learning',
    icon: 'Sparkles',
    color: 'from-amber-400 to-yellow-500',
    category: 'prestasi',
  },
  {
    id: 'badge-2',
    title: 'Penuntas Materi',
    description: 'Menyelesaikan minimal 3 materi pembelajaran secara tuntas',
    icon: 'BookCheck',
    color: 'from-emerald-400 to-green-600',
    category: 'tugas',
  },
  {
    id: 'badge-3',
    title: 'Jagoan Kuis',
    description: 'Mendapatkan nilai sempurna (100) pada salah satu kuis online',
    icon: 'Trophy',
    color: 'from-blue-400 to-indigo-600',
    category: 'kuis',
  },
  {
    id: 'badge-4',
    title: 'Disiplin Waktu',
    description: 'Mengumpulkan tugas sebelum tenggat waktu berakhir selama 3 kali berturut-turut',
    icon: 'ClockCheck',
    color: 'from-purple-400 to-pink-600',
    category: 'tugas',
  },
];

export const defaultGradeConfig: GradeConfig = {
  tugas_weight: 30,
  kuis_weight: 30,
  ujian_weight: 40,
};

export const defaultSystemSettings: SystemSettings = {
  school_name: 'SMP N 1 JAYA',
  school_tagline: 'Unggul dalam Prestasi, Berkarakter Luhur, dan Berdaya Saing Digital',
  school_npsn: '20104589',
  school_accreditation: 'A (Unggul)',
  headmaster_name: 'Drs. H. Mulyadi Kusuma, M.Pd.',
  headmaster_nip: '196803121994031005',
  headmaster_message: 'Selamat datang di portal Sistem Informasi E-Learning SMP N 1 JAYA. Kami berkomitmen menyelenggarakan pembelajaran inovatif berbasis teknologi demi mencetak generasi pelajar yang cerdas, kreatif, dan berintegritas.',
  headmaster_avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
  school_vision: 'Mewujudkan insan pembelajar SMP N 1 JAYA yang berakhlak mulia, berprestasi gemilang, terampil teknologi informasi, dan berwawasan global.',
  school_mission: [
    'Menyelenggarakan proses belajar mengajar interaktif berbasis platform digital modern di SMP N 1 JAYA.',
    'Menumbuhkembangkan potensi akademik dan nonakademik siswa kelas VII, VIII, dan IX secara optimal.',
    'Menginternalisasikan nilai-nilai Profil Pelajar Pancasila dalam keseharian.',
    'Mewujudkan tata kelola sekolah yang transparan, akuntabel, dan ramah anak.',
  ],
  school_address: 'Jl. Pendidikan Mandiri No. 45, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12150',
  school_phone: '(021) 7890-1234',
  school_email: 'info@smpn1jaya.sch.id',
  school_website: 'https://smpn1jaya.sch.id',
  hero_title: 'Belajar Interaktif, Terstruktur, dan Terpadu di SMP N 1 JAYA',
  hero_subtitle: 'Platform E-Learning Sekolah Menengah Pertama untuk Kelas VII, VIII, dan IX di SMP N 1 JAYA. Menghubungkan pengelola sekolah, dewan guru, dan peserta didik dalam satu ekosistem pendidikan digital modern.',
  hero_badge: 'Sistem Informasi Pembelajaran SMP N 1 JAYA Berbasis Web',
  hero_image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
  academic_year: '2026/2027',
  semester: 'Ganjil',

  // CamelCase equivalents
  schoolName: 'SMP N 1 JAYA',
  shortName: 'SMP N 1 JAYA',
  tagline: 'Unggul dalam Prestasi, Berkarakter Luhur, dan Berdaya Saing Digital',
  npsn: '20104589',
  accreditation: 'A (Unggul)',
  headmasterName: 'Drs. H. Mulyadi Kusuma, M.Pd.',
  headmasterNip: '196803121994031005',
  headmasterMessage: 'Selamat datang di portal Sistem Informasi E-Learning SMP N 1 JAYA. Kami berkomitmen menyelenggarakan pembelajaran inovatif berbasis teknologi demi mencetak generasi pelajar yang cerdas, kreatif, dan berintegritas.',
  headmasterAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
  vision: 'Mewujudkan insan pembelajar SMP N 1 JAYA yang berakhlak mulia, berprestasi gemilang, terampil teknologi informasi, dan berwawasan global.',
  mission: [
    'Menyelenggarakan proses belajar mengajar interaktif berbasis platform digital modern di SMP N 1 JAYA.',
    'Menumbuhkembangkan potensi akademik dan nonakademik siswa kelas VII, VIII, dan IX secara optimal.',
    'Menginternalisasikan nilai-nilai Profil Pelajar Pancasila dalam keseharian.',
    'Mewujudkan tata kelola sekolah yang transparan, akuntabel, dan ramah anak.',
  ],
  address: 'Jl. Pendidikan Mandiri No. 45, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12150',
  phone: '(021) 7890-1234',
  email: 'info@smpn1jaya.sch.id',
  website: 'https://smpn1jaya.sch.id',
  logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB_pRDivsZnjON4DrCfkzpuHSheZxCqe7iZmNBGUHt1w&s',
  landingHeroTitle: 'Sistem Informasi Pembelajaran Terpadu SMP N 1 JAYA',
  landingHeroSubtitle: 'Platform E-Learning sekolah menengah pertama untuk kelas VII, VIII, dan IX di SMP N 1 JAYA. Menghubungkan Administrator, Guru, dan Murid dalam satu ekosistem pendidikan digital modern.',
  landingHeroBadge: '🚀 Platform Digital Kurikulum Merdeka SMP N 1 JAYA',
  landingHeroImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
};

