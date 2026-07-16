PART 2: Arsitektur Informasi (Information Architecture)
Arsitektur Informasi berikut menggambarkan pemetaan struktur menu, navigasi hierarkis, serta alur penempatan komponen Face Recognition/Kamera dalam aplikasi:

[Sistem Absensi MTsN 1 Yogyakarta]
 │
 ├── 1. Modul Autentikasi
 │    ├── Halaman Login (Input Username, Password & Pilihan Role)
 │    └── Logout (Pembersihan Sesi/Token)
 │
 ├── 2. Modul Guru Mata Pelajaran
 │    ├── Dasbor Guru Mapel (Jadwal Mengajar Hari Ini & Notifikasi Kelas Belum Diabsen)
 │    ├── Menu "Mulai Presensi"
 │    │    ├── Dropdown Pilih Tingkat & Ruang Kelas (Relasi Class Kelas)
 │    │    └── Dropdown Pilih Mata Pelajaran
 │    └── Form Presensi & Lembar Kerja
 │         ├── Daftar Siswa (Menampilkan Nama & NIS dari Class Siswa)
 │         ├── Radio Button Status Kehadiran (Hadir / Sakit / Izin / Alpa)
 │         ├── Panel Validasi Kehadiran
 │         │    ├── Tombol "Aktifkan Kamera Validasi"
 │         │    ├── Kamera Viewfinder (Menangkap Foto Siswa/Grup Siswa)
 │         │    └── Indikator Status Validasi (Sukses Terbaca / Simpan Sebagai Bukti)
 │         └── Tombol "Kunci & Kirim Data Absensi" (Mengaktifkan method simpan ke Class Absensi)
 │
 ├── 3. Modul Guru Piket
 │    ├── Dasbor Monitoring Real-Time (Status keterisian absensi seluruh kelas hari ini)
 │    ├── Log Validasi Bukti (Review foto wajah yang diunggah oleh Guru Mapel)
 │    └── Menu "Cetak Rekap Harian" (Otomatisasi penggabungan data lembar kerja spreadsheet lama)
 │
 ├── 4. Modul Wali Kelas
 │    ├── Dasbor Kelas Binaan (Statistik persentase kehadiran total, murid paling sering alfa/sakit)
 │    └── Menu Laporan Akademik
 │         ├── Filter Periode (Bulanan, Tengah Semester, Semester Penuh)
 │         └── Tombol "Ekspor & Cetak Laporan" (Penghasil output PDF untuk Dokumen Rapor)
 │
 └── 5. Manajemen Data Master (Akses Admin)
      ├── Kelola Akun Pengguna (Class User: Guru Mapel, Guru Piket, Wali Kelas)
      ├── Kelola Data Siswa & Pembagian Kelas (Class Siswa & Class Kelas)
      └── Kelola Kurikulum & Mata Pelajaran