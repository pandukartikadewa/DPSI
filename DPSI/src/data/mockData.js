const now = new Date()
const today = now.toISOString().split('T')[0]

const initialUsers = [
  { id: 1, username: 'guru.mapel', password: '123', name: 'Ahmad Fauzi, S.Pd.', role: 'guru_mapel', mapel: 'Matematika' },
  { id: 2, username: 'guru.piket', password: '123', name: 'Siti Rahma, S.Pd.', role: 'guru_piket' },
  { id: 3, username: 'wali.kelas', password: '123', name: 'Dewi Sartika, S.Pd.', role: 'wali_kelas', waliKelas: '7A' },
  { id: 4, username: 'admin', password: '123', name: 'Administrator', role: 'admin' },
]

const initialKelas = [
  { id: '7A', tingkat: '7', nama: '7A' },
  { id: '7B', tingkat: '7', nama: '7B' },
  { id: '8A', tingkat: '8', nama: '8A' },
  { id: '8B', tingkat: '8', nama: '8B' },
  { id: '9A', tingkat: '9', nama: '9A' },
  { id: '9B', tingkat: '9', nama: '9B' },
]

const initialMapel = [
  { id: 1, nama: 'Matematika' },
  { id: 2, nama: 'Bahasa Indonesia' },
  { id: 3, nama: 'Bahasa Inggris' },
  { id: 4, nama: 'IPA' },
  { id: 5, nama: 'IPS' },
  { id: 6, nama: 'Pendidikan Agama Islam' },
  { id: 7, nama: 'PKN' },
]

const initialSiswa = [
  { id: 1, nis: '1234561', nama: 'Adi Pratama', kelasId: '7A' },
  { id: 2, nis: '1234562', nama: 'Budi Santoso', kelasId: '7A' },
  { id: 3, nis: '1234563', nama: 'Citra Dewi', kelasId: '7A' },
  { id: 4, nis: '1234564', nama: 'Dian Permata', kelasId: '7A' },
  { id: 5, nis: '1234565', nama: 'Eko Prasetyo', kelasId: '7A' },
  { id: 6, nis: '1234566', nama: 'Fitri Handayani', kelasId: '7B' },
  { id: 7, nis: '1234567', nama: 'Galih Saputra', kelasId: '7B' },
  { id: 8, nis: '1234568', nama: 'Hesti Purnama', kelasId: '7B' },
  { id: 9, nis: '1234569', nama: 'Indra Wijaya', kelasId: '7B' },
  { id: 10, nis: '1234570', nama: 'Joko Susilo', kelasId: '7B' },
  { id: 11, nis: '1234571', nama: 'Kartika Sari', kelasId: '8A' },
  { id: 12, nis: '1234572', nama: 'Luki Hermawan', kelasId: '8A' },
  { id: 13, nis: '1234573', nama: 'Maya Anggraini', kelasId: '8A' },
  { id: 14, nis: '1234574', nama: 'Nanda Putra', kelasId: '8A' },
  { id: 15, nis: '1234575', nama: 'Oki Firmansyah', kelasId: '8A' },
  { id: 16, nis: '1234576', nama: 'Putri Ayu', kelasId: '8B' },
  { id: 17, nis: '1234577', nama: 'Rizky Ramadhan', kelasId: '8B' },
  { id: 18, nis: '1234578', nama: 'Sari Wulandari', kelasId: '8B' },
  { id: 19, nis: '1234579', nama: 'Teguh Pratomo', kelasId: '8B' },
  { id: 20, nis: '1234580', nama: 'Umi Kalsum', kelasId: '8B' },
  { id: 21, nis: '1234581', nama: 'Vina Amalia', kelasId: '9A' },
  { id: 22, nis: '1234582', nama: 'Wahyu Nugroho', kelasId: '9A' },
  { id: 23, nis: '1234583', nama: 'Xena Yunita', kelasId: '9A' },
  { id: 24, nis: '1234584', nama: 'Yoga Aditya', kelasId: '9A' },
  { id: 25, nis: '1234585', nama: 'Zara Azizah', kelasId: '9A' },
  { id: 26, nis: '1234586', nama: 'Agus Setiawan', kelasId: '9B' },
  { id: 27, nis: '1234587', nama: 'Bella Octavia', kelasId: '9B' },
  { id: 28, nis: '1234588', nama: 'Candra Gunawan', kelasId: '9B' },
  { id: 29, nis: '1234589', nama: 'Dini Apriani', kelasId: '9B' },
  { id: 30, nis: '1234590', nama: 'Erik Susanto', kelasId: '9B' },
]

function load(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch { return fallback }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function getUsers() { return load('absensi_users', initialUsers) }
export function saveUsers(u) { save('absensi_users', u) }

export function getKelas() { return load('absensi_kelas', initialKelas) }
export function saveKelas(k) { save('absensi_kelas', k) }

export function getMapel() { return load('absensi_mapel', initialMapel) }
export function saveMapel(m) { save('absensi_mapel', m) }

export function getSiswa() { return load('absensi_siswa', initialSiswa) }
export function saveSiswa(s) { save('absensi_siswa', s) }

export function getPresensi() { return load('absensi_presensi', []) }
export function savePresensi(p) { save('absensi_presensi', p) }

export function resetData() {
  const keys = ['absensi_users', 'absensi_kelas', 'absensi_mapel', 'absensi_siswa', 'absensi_presensi']
  keys.forEach(k => localStorage.removeItem(k))
}

export const STATUS_ABSEN = ['Hadir', 'Sakit', 'Izin', 'Alpa']
export const TINGKAT = ['7', '8', '9']
