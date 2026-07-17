# Information Architecture (IA) - Source of Truth #2

Document Version: v1.0

Project: Sistem Absensi Digital MTsN 1 Yogyakarta

Product: Aplikasi Absensi Digital Berbasis Web/Mobile dengan Modul Validasi Foto

Status: Validated / Active

Last Updated: 2026-06-26

Author: System Analyst AI

---

## 1. DOCUMENT OVERVIEW

### 1.1 Purpose

Dokumen ini mendefinisikan Arsitektur Informasi (IA) dari Sistem Absensi Digital MTsN 1 Yogyakarta, yang menggambarkan pemetaan struktur menu, navigasi hierarkis, serta alur penempatan komponen Face Recognition/Kamera dalam aplikasi. IA ini berfungsi sebagai Source of Truth #2 (SoT-2) yang diturunkan secara langsung dari SoT-1 (SRS v0.1).

Dokumen ini digunakan sebagai landasan mutlak untuk:

- Merancang High-Fidelity Prototype (SoT-5).
- Menentukan struktur halaman pada implementasi Frontend.
- Membangun navigasi antarmuka yang konsisten dan responsif untuk keempat role pengguna (Guru Mapel, Guru Piket, Wali Kelas, Admin).
- Menentukan struktur routing pada aplikasi web/mobile (URL mapping).
- Memetakan relasi antar-layar dan alur penempatan Modul Kamera/Validasi Foto secara efisien.

### 1.2 Related Sources of Truth

| Artifact | Reference | Description |
| --- | --- | --- |
| SoT-1 | SRS v0.1 | Spesifikasi Kebutuhan Perangkat Lunak dasar. |
| SoT-3 | Design System | Panduan token visual, warna, tipografi, dan komponen UI. |
| SoT-4 | User Flows | Detail langkah operasional per use-case. |
| SoT-5 | HiFi Prototype | Representasi visual interaktif akhir. |

---

## 2. PRODUCT STRUCTURE

### 2.1 Product Modules

| Module ID | Module Name | Description |
| --- | --- | --- |
| M001 | Modul Autentikasi | Mengatur keamanan akses masuk dan keluar sistem untuk seluruh aktor (Guru Mapel, Guru Piket, Wali Kelas, Admin). |
| M002 | Modul Guru Mata Pelajaran | Modul utama pencatatan presensi siswa per kelas/mata pelajaran, dilengkapi Panel Validasi Kehadiran (Kamera/Face Recognition Sederhana). |
| M003 | Modul Guru Piket | Modul pemantauan real-time keterisian absensi seluruh kelas, peninjauan bukti foto, dan pencetakan rekap harian. |
| M004 | Modul Wali Kelas | Modul pemantauan statistik kehadiran kelas binaan dan ekspor laporan akademik untuk dokumen rapor. |
| M005 | Manajemen Data Master | Modul pengelolaan akun pengguna, data siswa & kelas, serta kurikulum/mata pelajaran (akses Admin). |

### 2.2 Module Hierarchy

```text
Sistem Absensi Digital MTsN 1 Yogyakarta (Root)
├── M001: Modul Autentikasi
│   ├── Halaman Login (Input Username, Password & Pilihan Role)
│   └── Logout (Pembersihan Sesi/Token)
├── M002: Modul Guru Mata Pelajaran (Landing: Dasbor Guru Mapel)
│   ├── Dasbor Guru Mapel (Jadwal Mengajar Hari Ini & Notifikasi Kelas Belum Diabsen)
│   ├── Menu "Mulai Presensi"
│   │   ├── Dropdown Pilih Tingkat & Ruang Kelas (Relasi Class Kelas)
│   │   └── Dropdown Pilih Mata Pelajaran
│   └── Form Presensi & Lembar Kerja
│       ├── Daftar Siswa (Menampilkan Nama & NIS dari Class Siswa)
│       ├── Radio Button Status Kehadiran (Hadir / Sakit / Izin / Alpa)
│       ├── Panel Validasi Kehadiran
│       │   ├── Tombol "Aktifkan Kamera Validasi"
│       │   ├── Kamera Viewfinder (Menangkap Foto Siswa/Grup Siswa)
│       │   └── Indikator Status Validasi (Sukses Terbaca / Simpan Sebagai Bukti)
│       └── Tombol "Kunci & Kirim Data Absensi" (Method Simpan ke Class Absensi)
├── M003: Modul Guru Piket (Landing: Dasbor Monitoring Real-Time)
│   ├── Dasbor Monitoring Real-Time (Status Keterisian Absensi Seluruh Kelas Hari Ini)
│   ├── Log Validasi Bukti (Review Foto Wajah yang Diunggah oleh Guru Mapel)
│   └── Menu "Cetak Rekap Harian" (Otomatisasi Penggabungan Data Lembar Kerja Spreadsheet Lama)
├── M004: Modul Wali Kelas (Landing: Dasbor Kelas Binaan)
│   ├── Dasbor Kelas Binaan (Statistik Persentase Kehadiran Total, Murid Paling Sering Alfa/Sakit)
│   └── Menu Laporan Akademik
│       ├── Filter Periode (Bulanan, Tengah Semester, Semester Penuh)
│       └── Tombol "Ekspor & Cetak Laporan" (Penghasil Output PDF untuk Dokumen Rapor)
└── M005: Manajemen Data Master (Akses Admin)
    ├── Kelola Akun Pengguna (Class User: Guru Mapel, Guru Piket, Wali Kelas)
    ├── Kelola Data Siswa & Pembagian Kelas (Class Siswa & Class Kelas)
    └── Kelola Kurikulum & Mata Pelajaran
```

---

## 3. SITE MAP

### 3.1 Navigation Tree

- **PAGE-001:** Login (Tanpa Sidebar - Akses Publik / Unauthenticated)
- **PAGE-002:** Dasbor Guru Mapel (Landing Page untuk role Guru Mapel)
- **PAGE-002-SUB-01:** Mulai Presensi (Pilih Tingkat, Ruang Kelas & Mata Pelajaran)
- **PAGE-002-SUB-02:** Form Presensi & Validasi Kamera
- **PAGE-003:** Dasbor Guru Piket (Landing Page untuk role Guru Piket)
- **PAGE-003-SUB-01:** Log Validasi Bukti Foto
- **PAGE-003-SUB-02:** Cetak Rekap Harian
- **PAGE-004:** Dasbor Wali Kelas (Landing Page untuk role Wali Kelas)
- **PAGE-004-SUB-01:** Laporan Akademik
- **PAGE-005:** Manajemen Data Master (Landing Page untuk role Admin)
- **PAGE-005-SUB-01:** Kelola Akun Pengguna
- **PAGE-005-SUB-02:** Kelola Data Siswa & Kelas
- **PAGE-005-SUB-03:** Kelola Kurikulum & Mata Pelajaran

### 3.2 Navigation Type

| Navigation | Type | Behavior |
| --- | --- | --- |
| Main Menu | Sidebar Navigation | Berada permanen di sisi kiri layar pada resolusi Desktop/Tablet. Menu menyesuaikan otomatis dengan role pengguna yang login (Guru Mapel, Guru Piket, Wali Kelas, Admin). |
| User Menu | Top-Right Dropdown | Berisi informasi akun aktif dan tombol "Keluar" (Logout). |
| Mobile/Tablet Navigation | Top Hamburger Menu | Sidebar disembunyikan dan diakses via tombol hamburger pada perangkat smartphone/tablet guru jika lebar layar menyusut di bawah 768px (Responsiveness rule). |
| Breadcrumb | Enabled (Terbatas) | Diaktifkan khusus pada modul dengan struktur 2 tingkat sub-halaman (M002, M003, M005) guna membantu pengguna kembali ke halaman induk (Dasbor/Manajemen Data Master). |

---

## 4. PAGE INVENTORY

| Page ID | Page Name | Module | Access Role | URL Path |
| --- | --- | --- | --- | --- |
| PAGE-001 | Login | M001 | Tamu / Guest | /login |
| PAGE-002 | Dasbor Guru Mapel | M002 | Guru Mapel (Authenticated) | /mapel |
| PAGE-002-SUB-01 | Mulai Presensi | M002 | Guru Mapel (Authenticated) | /mapel/mulai-presensi |
| PAGE-002-SUB-02 | Form Presensi & Validasi Kamera | M002 | Guru Mapel (Authenticated) | /mapel/presensi |
| PAGE-003 | Dasbor Guru Piket (Monitoring Real-Time) | M003 | Guru Piket (Authenticated) | /piket |
| PAGE-003-SUB-01 | Log Validasi Bukti Foto | M003 | Guru Piket (Authenticated) | /piket/validasi-bukti |
| PAGE-003-SUB-02 | Cetak Rekap Harian | M003 | Guru Piket (Authenticated) | /piket/cetak-rekap |
| PAGE-004 | Dasbor Wali Kelas (Kelas Binaan) | M004 | Wali Kelas (Authenticated) | /wali-kelas |
| PAGE-004-SUB-01 | Laporan Akademik | M004 | Wali Kelas (Authenticated) | /wali-kelas/laporan |
| PAGE-005 | Manajemen Data Master | M005 | Admin (Authenticated) | /admin |
| PAGE-005-SUB-01 | Kelola Akun Pengguna | M005 | Admin (Authenticated) | /admin/akun |
| PAGE-005-SUB-02 | Kelola Data Siswa & Kelas | M005 | Admin (Authenticated) | /admin/siswa-kelas |
| PAGE-005-SUB-03 | Kelola Kurikulum & Mata Pelajaran | M005 | Admin (Authenticated) | /admin/kurikulum |

---

## 5. PAGE DEFINITIONS

### Page ID: PAGE-001

**Page Name:** Login

**Purpose:** Memverifikasi identitas pengguna beserta role (Guru Mapel, Guru Piket, Wali Kelas, Admin) untuk mencegah akses tidak sah ke sistem.

**Entry Points:**

- Mengakses URL utama aplikasi / pertama kali tanpa sesi login aktif.
- Mengakses URL /login secara langsung.

**Exit Points:**

- Berhasil login -> diarahkan otomatis sesuai role: Guru Mapel ke /mapel (PAGE-002), Guru Piket ke /piket (PAGE-003), Wali Kelas ke /wali-kelas (PAGE-004), Admin ke /admin (PAGE-005).

**Related User Flows:** UC-001: Login Multi-Role

**Child Pages:** None.

**Required Permissions:** Publik / Tanpa Autentikasi.

**Notes:** Layar minimalis tanpa sidebar menu. Menampilkan form input username, password, dan pilihan role.

---

### Page ID: PAGE-002

**Page Name:** Dasbor Guru Mapel

**Purpose:** Menyediakan ringkasan jadwal mengajar hari ini dan notifikasi kelas yang belum diabsen bagi Guru Mapel.

**Entry Points:**

- Setelah sukses login dari PAGE-001 (role Guru Mapel).
- Klik menu "Dasbor" pada Sidebar.

**Exit Points:**

- Klik "Mulai Presensi" -> PAGE-002-SUB-01.
- Klik "Keluar" di User Menu -> diarahkan ke /login (PAGE-001).

**Related User Flows:** UC-002: Pencatatan Presensi oleh Guru Mapel

**Child Pages:**

- PAGE-002-SUB-01: Mulai Presensi.
- PAGE-002-SUB-02: Form Presensi & Validasi Kamera.

**Required Permissions:** Guru Mapel (ALLOWED).

**Notes:** Menampilkan daftar jadwal mengajar hari ini beserta status (Sudah/Belum Diabsen) untuk masing-masing kelas.

---

### Page ID: PAGE-002-SUB-01

**Page Name:** Mulai Presensi

**Purpose:** Memungkinkan Guru Mapel memilih Tingkat Kelas, Ruang Kelas, dan Mata Pelajaran sebelum masuk ke sesi presensi.

**Entry Points:**

- Klik tombol "Mulai Presensi" dari PAGE-002.

**Exit Points:**

- Klik "Lanjutkan" -> PAGE-002-SUB-02 (Form Presensi & Validasi Kamera) sesuai kelas dan mata pelajaran yang dipilih.

**Related User Flows:** UC-002

**Child Pages:** None.

**Required Permissions:** Guru Mapel (ALLOWED).

**Notes:** Berisi dua dropdown berurutan: Pilih Tingkat & Ruang Kelas, kemudian Pilih Mata Pelajaran.

---

### Page ID: PAGE-002-SUB-02

**Page Name:** Form Presensi & Validasi Kamera

**Purpose:** Menjadi lembar kerja utama Guru Mapel untuk mencatat status kehadiran siswa dan mengambil bukti foto validasi.

**Entry Points:**

- Setelah memilih kelas & mata pelajaran dari PAGE-002-SUB-01.

**Exit Points:**

- Klik "Kunci & Kirim Data Absensi" -> data tersimpan dan kembali ke PAGE-002 (Dasbor diperbarui).

**Related User Flows:** UC-002, UC-003: Validasi Foto (Face Recognition Sederhana)

**Child Pages:** None (Panel Validasi Kamera ditampilkan langsung di halaman ini, bukan sebagai halaman terpisah).

**Required Permissions:** Guru Mapel (ALLOWED).

**Notes:** Menampilkan daftar siswa (Nama & NIS) dengan radio button status kehadiran (Hadir/Sakit/Izin/Alpa), serta Panel Validasi Kehadiran berisi tombol "Aktifkan Kamera Validasi", kamera viewfinder, dan indikator status validasi (Sukses Terbaca / Simpan Sebagai Bukti).

---

### Page ID: PAGE-003

**Page Name:** Dasbor Guru Piket (Monitoring Real-Time)

**Purpose:** Menampilkan status keterisian absensi seluruh kelas secara real-time bagi Guru Piket.

**Entry Points:**

- Setelah sukses login dari PAGE-001 (role Guru Piket).
- Klik menu "Dasbor" pada Sidebar.

**Exit Points:**

- Klik menu "Log Validasi Bukti" -> PAGE-003-SUB-01.
- Klik menu "Cetak Rekap Harian" -> PAGE-003-SUB-02.
- Klik "Keluar" di User Menu -> diarahkan ke /login (PAGE-001).

**Related User Flows:** UC-004: Monitoring & Rekapitulasi Otomatis oleh Guru Piket

**Child Pages:**

- PAGE-003-SUB-01: Log Validasi Bukti Foto.
- PAGE-003-SUB-02: Cetak Rekap Harian.

**Required Permissions:** Guru Piket (ALLOWED).

**Notes:** Menampilkan status keterisian absensi tiap kelas secara real-time tanpa perlu media kirim pihak ketiga (grup chat).

---

### Page ID: PAGE-003-SUB-01

**Page Name:** Log Validasi Bukti Foto

**Purpose:** Memungkinkan Guru Piket meninjau foto wajah siswa yang diunggah oleh Guru Mapel sebagai bukti kehadiran.

**Entry Points:**

- Klik menu "Log Validasi Bukti" dari PAGE-003.

**Exit Points:**

- Klik menu lain di Sidebar.

**Related User Flows:** UC-003, UC-004

**Child Pages:** None.

**Required Permissions:** Guru Piket (ALLOWED).

**Notes:** Menampilkan daftar foto validasi beserta status pencocokan (Sukses Terbaca / Tersimpan Sebagai Bukti).

---

### Page ID: PAGE-003-SUB-02

**Page Name:** Cetak Rekap Harian

**Purpose:** Menyediakan rekap gabungan data absensi harian untuk dicetak oleh Guru Piket.

**Entry Points:**

- Klik menu "Cetak Rekap Harian" dari PAGE-003.

**Exit Points:**

- Klik menu lain di Sidebar.

**Related User Flows:** UC-004

**Child Pages:** None.

**Required Permissions:** Guru Piket (ALLOWED).

**Notes:** Mengotomatisasi penggabungan data lembar kerja spreadsheet lama menjadi satu rekap harian yang siap cetak.

---

### Page ID: PAGE-004

**Page Name:** Dasbor Wali Kelas (Kelas Binaan)

**Purpose:** Menampilkan statistik kehadiran kelas binaan bagi Wali Kelas.

**Entry Points:**

- Setelah sukses login dari PAGE-001 (role Wali Kelas).
- Klik menu "Dasbor" pada Sidebar.

**Exit Points:**

- Klik menu "Laporan Akademik" -> PAGE-004-SUB-01.
- Klik "Keluar" di User Menu -> diarahkan ke /login (PAGE-001).

**Related User Flows:** UC-005: Pelaporan & Ekspor oleh Wali Kelas

**Child Pages:**

- PAGE-004-SUB-01: Laporan Akademik.

**Required Permissions:** Wali Kelas (ALLOWED).

**Notes:** Menampilkan statistik persentase kehadiran total kelas binaan serta daftar murid paling sering alfa/sakit.

---

### Page ID: PAGE-004-SUB-01

**Page Name:** Laporan Akademik

**Purpose:** Memfasilitasi Wali Kelas memfilter dan mengekspor laporan kehadiran untuk kebutuhan dokumen rapor.

**Entry Points:**

- Klik menu "Laporan Akademik" dari PAGE-004.

**Exit Points:**

- Klik menu lain di Sidebar.

**Related User Flows:** UC-005

**Child Pages:** None.

**Required Permissions:** Wali Kelas (ALLOWED).

**Notes:** Dilengkapi filter periode (Bulanan, Tengah Semester, Semester Penuh) dan tombol "Ekspor & Cetak Laporan" (output PDF untuk dokumen rapor).

---

### Page ID: PAGE-005

**Page Name:** Manajemen Data Master

**Purpose:** Menjadi halaman induk pengelolaan data master sistem bagi Admin.

**Entry Points:**

- Setelah sukses login dari PAGE-001 (role Admin).
- Klik menu "Manajemen Data Master" pada Sidebar.

**Exit Points:**

- Klik salah satu sub-menu (Kelola Akun Pengguna / Kelola Data Siswa & Kelas / Kelola Kurikulum & Mata Pelajaran).
- Klik "Keluar" di User Menu -> diarahkan ke /login (PAGE-001).

**Related User Flows:** UC-006: Manajemen Data Master oleh Admin

**Child Pages:**

- PAGE-005-SUB-01: Kelola Akun Pengguna.
- PAGE-005-SUB-02: Kelola Data Siswa & Kelas.
- PAGE-005-SUB-03: Kelola Kurikulum & Mata Pelajaran.

**Required Permissions:** Admin (ALLOWED).

**Notes:** Menampilkan ringkasan jumlah akun, siswa, kelas, dan mata pelajaran yang terdaftar di sistem.

---

### Page ID: PAGE-005-SUB-01

**Page Name:** Kelola Akun Pengguna

**Purpose:** Mengelola akun pengguna sistem (Guru Mapel, Guru Piket, Wali Kelas).

**Entry Points:**

- Klik sub-menu "Kelola Akun Pengguna" dari PAGE-005.

**Exit Points:**

- Klik menu lain di Sidebar.

**Related User Flows:** UC-006

**Child Pages:** None.

**Required Permissions:** Admin (ALLOWED).

**Notes:** Menyediakan tabel akun pengguna beserta role masing-masing dan aksi tambah/ubah/nonaktifkan akun.

---

### Page ID: PAGE-005-SUB-02

**Page Name:** Kelola Data Siswa & Kelas

**Purpose:** Mengelola data murid dan pembagian kelas.

**Entry Points:**

- Klik sub-menu "Kelola Data Siswa & Kelas" dari PAGE-005.

**Exit Points:**

- Klik menu lain di Sidebar.

**Related User Flows:** UC-006

**Child Pages:** None.

**Required Permissions:** Admin (ALLOWED).

**Notes:** Menyediakan tabel data siswa (NIS, Nama) beserta relasi penempatan kelas.

---

### Page ID: PAGE-005-SUB-03

**Page Name:** Kelola Kurikulum & Mata Pelajaran

**Purpose:** Mengelola data mata pelajaran yang tersedia di sistem.

**Entry Points:**

- Klik sub-menu "Kelola Kurikulum & Mata Pelajaran" dari PAGE-005.

**Exit Points:**

- Klik menu lain di Sidebar.

**Related User Flows:** UC-006

**Child Pages:** None.

**Required Permissions:** Admin (ALLOWED).

**Notes:** Menyediakan tabel daftar mata pelajaran beserta aksi tambah/ubah/hapus data.

---

## 6. USER NAVIGATION FLOWS

### Flow NF-001: Alur Presensi & Validasi Kamera oleh Guru Mapel

**Entry Page:** PAGE-002 (Dasbor Guru Mapel)

**Navigation Path:**

1. PAGE-002 (Lihat Jadwal Mengajar Hari Ini)
2. Klik "Mulai Presensi" -> PAGE-002-SUB-01
3. PAGE-002-SUB-01 (Pilih Tingkat & Ruang Kelas, Pilih Mata Pelajaran)
4. Klik "Lanjutkan" -> PAGE-002-SUB-02
5. PAGE-002-SUB-02 (Tandai Status Kehadiran per Siswa)
6. PAGE-002-SUB-02 (Klik "Aktifkan Kamera Validasi" & Ambil Foto)
7. PAGE-002-SUB-02 (Klik "Kunci & Kirim Data Absensi")
8. PAGE-002 (Dasbor Diperbarui, Notifikasi Kelas Sudah Diabsen)

**Exit Page:** PAGE-002 (Siap untuk sesi presensi kelas berikutnya)

**Related User Flows:** UC-002, UC-003

---

### Flow NF-002: Alur Monitoring & Rekapitulasi oleh Guru Piket

**Entry Page:** PAGE-003 (Dasbor Guru Piket)

**Navigation Path:**

1. PAGE-003 (Memantau Status Keterisian Absensi Real-Time)
2. Sidebar Navigation (Klik Log Validasi Bukti) -> PAGE-003-SUB-01
3. PAGE-003-SUB-01 (Meninjau Foto Wajah yang Diunggah Guru Mapel)
4. Sidebar Navigation (Klik Cetak Rekap Harian) -> PAGE-003-SUB-02
5. PAGE-003-SUB-02 (Mencetak Rekap Data Absensi Harian)

**Exit Page:** PAGE-003 (Dasbor Guru Piket)

**Related User Flows:** UC-004

---

### Flow NF-003: Alur Pelaporan & Ekspor Rapor oleh Wali Kelas

**Entry Page:** PAGE-004 (Dasbor Wali Kelas)

**Navigation Path:**

1. PAGE-004 (Melihat Statistik Kehadiran Kelas Binaan)
2. Sidebar Navigation (Klik Laporan Akademik) -> PAGE-004-SUB-01
3. PAGE-004-SUB-01 (Pilih Filter Periode: Bulanan/Tengah Semester/Semester Penuh)
4. Klik "Ekspor & Cetak Laporan" (Output PDF Dokumen Rapor)

**Exit Page:** PAGE-004-SUB-01 (Laporan Akademik)

**Related User Flows:** UC-005

---

### Flow NF-004: Alur Login Multi-Role & Manajemen Data Master oleh Admin

**Entry Page:** PAGE-001 (Login)

**Navigation Path:**

1. PAGE-001 (Input Username, Password, Pilih Role: Admin)
2. Redirect Otomatis -> PAGE-005 (Manajemen Data Master)
3. Sidebar Navigation (Klik Kelola Akun Pengguna) -> PAGE-005-SUB-01
4. Sidebar Navigation (Klik Kelola Data Siswa & Kelas) -> PAGE-005-SUB-02
5. Sidebar Navigation (Klik Kelola Kurikulum & Mata Pelajaran) -> PAGE-005-SUB-03
6. Top-Right User Menu (Klik Dropdown)
7. Klik "Keluar"
8. PAGE-001 (Kembali ke Halaman Login)

**Exit Page:** PAGE-001 (Login)

**Related User Flows:** UC-001, UC-006

---

## 7. CONTENT HIERARCHY

### 7.1 Module: Guru Mata Pelajaran (Presensi & Validasi Foto)

**Level 1 (Dasbor & Navigasi Awal):**

- Dasbor Guru Mapel (Jadwal Mengajar Hari Ini & Notifikasi Kelas Belum Diabsen).
- Menu "Mulai Presensi".

**Level 2 (Seleksi & Lembar Kerja):**

- Dropdown Pilih Tingkat & Ruang Kelas.
- Dropdown Pilih Mata Pelajaran.
- Daftar Siswa (Nama & NIS).
- Radio Button Status Kehadiran (Hadir/Sakit/Izin/Alpa).

**Level 3 (Validasi & Aksi Akhir):**

- Panel Validasi Kehadiran (Tombol "Aktifkan Kamera Validasi", Kamera Viewfinder, Indikator Status Validasi).
- Tombol "Kunci & Kirim Data Absensi".

---

### 7.2 Module: Guru Piket

**Level 1 (Dasbor Monitoring):**

- Dasbor Monitoring Real-Time (Status Keterisian Absensi Seluruh Kelas Hari Ini).

**Level 2 (Validasi & Rekap):**

- Log Validasi Bukti (Review Foto Wajah yang Diunggah Guru Mapel).
- Menu "Cetak Rekap Harian".

**Level 3 (Detail Rekap):**

- Rekap Gabungan Data Lembar Kerja Spreadsheet Lama yang Siap Cetak.

---

### 7.3 Module: Wali Kelas

**Level 1 (Dasbor Kelas Binaan):**

- Statistik Persentase Kehadiran Total.
- Daftar Murid Paling Sering Alfa/Sakit.

**Level 2 (Laporan Akademik):**

- Filter Periode (Bulanan, Tengah Semester, Semester Penuh).

**Level 3 (Ekspor):**

- Tombol "Ekspor & Cetak Laporan" (Output PDF untuk Dokumen Rapor).

---

### 7.4 Module: Manajemen Data Master (Admin)

**Level 1 (Ringkasan Data Master):**

- Ringkasan Jumlah Akun, Siswa, Kelas, dan Mata Pelajaran yang Terdaftar.

**Level 2 (Tabel Kelola Data):**

- Kelola Akun Pengguna (Guru Mapel, Guru Piket, Wali Kelas).
- Kelola Data Siswa & Pembagian Kelas.
- Kelola Kurikulum & Mata Pelajaran.

**Level 3 (Aksi CRUD):**

- Tombol Tambah/Ubah/Nonaktifkan pada setiap tabel data master.

---

## 8. ROUTING CONVENTIONS

Sistem menggunakan Client-Side Routing yang bersih dan ramah pengguna (human-readable URLs).

| Page ID | Route | Access Type | Fallback/Redirect Rules |
| --- | --- | --- | --- |
| PAGE-001 | /login | Public / Guest | Jika sudah login, mengakses /login akan redirect otomatis sesuai role: Guru Mapel -> /mapel, Guru Piket -> /piket, Wali Kelas -> /wali-kelas, Admin -> /admin. |
| PAGE-002 | /mapel | Authenticated (Guru Mapel) | Jika sesi habis atau tidak valid, redirect otomatis ke /login. |
| PAGE-002-SUB-01 | /mapel/mulai-presensi | Authenticated (Guru Mapel) | Jika sesi habis atau tidak valid, redirect otomatis ke /login. |
| PAGE-002-SUB-02 | /mapel/presensi | Authenticated (Guru Mapel) | Jika sesi habis atau tidak valid, redirect otomatis ke /login. |
| PAGE-003 | /piket | Authenticated (Guru Piket) | Jika sesi habis atau tidak valid, redirect otomatis ke /login. |
| PAGE-003-SUB-01 | /piket/validasi-bukti | Authenticated (Guru Piket) | Jika sesi habis atau tidak valid, redirect otomatis ke /login. |
| PAGE-003-SUB-02 | /piket/cetak-rekap | Authenticated (Guru Piket) | Jika sesi habis atau tidak valid, redirect otomatis ke /login. |
| PAGE-004 | /wali-kelas | Authenticated (Wali Kelas) | Jika sesi habis atau tidak valid, redirect otomatis ke /login. |
| PAGE-004-SUB-01 | /wali-kelas/laporan | Authenticated (Wali Kelas) | Jika sesi habis atau tidak valid, redirect otomatis ke /login. |
| PAGE-005 | /admin | Authenticated (Admin) | Jika sesi habis atau tidak valid, redirect otomatis ke /login. |
| PAGE-005-SUB-01 | /admin/akun | Authenticated (Admin) | Jika sesi habis atau tidak valid, redirect otomatis ke /login. |
| PAGE-005-SUB-02 | /admin/siswa-kelas | Authenticated (Admin) | Jika sesi habis atau tidak valid, redirect otomatis ke /login. |
| PAGE-005-SUB-03 | /admin/kurikulum | Authenticated (Admin) | Jika sesi habis atau tidak valid, redirect otomatis ke /login. |
| - | /redirector | - | Jika ada sesi aktif -> diarahkan ke halaman landing sesuai role, jika tidak ada -> /login. |
| - | * (Any other) | 404 Page | Menampilkan pesan "Halaman Tidak Ditemukan" dan menyediakan tombol kembali ke halaman landing sesuai role. |

---

## 9. TRACEABILITY MATRIX (SRS v0.1 → IA v1.0)

Untuk menjamin kepatuhan Chain of Truth, setiap komponen arsitektur informasi dipetakan kembali ke ID Fitur dari spesifikasi kebutuhan sistem.

| Feature ID | Feature Name | Mapped Page ID | Mapped Navigation / Route |
| --- | --- | --- | --- |
| F001 | Autentikasi & Manajemen Sesi | PAGE-001 | /login |
| F002 | Pencatatan Presensi | PAGE-002, PAGE-002-SUB-01, PAGE-002-SUB-02 | /mapel, /mapel/mulai-presensi, /mapel/presensi |
| F003 | Validasi Foto (Face Recognition Sederhana) | PAGE-002-SUB-02, PAGE-003-SUB-01 | /mapel/presensi, /piket/validasi-bukti |
| F004 | Rekapitulasi Otomatis Terpusat | PAGE-003, PAGE-003-SUB-02 | /piket, /piket/cetak-rekap |
| F005 | Manajemen Data Master | PAGE-005, PAGE-005-SUB-01, PAGE-005-SUB-02, PAGE-005-SUB-03 | /admin, /admin/akun, /admin/siswa-kelas, /admin/kurikulum |
| F006 | Pelaporan & Filter Laporan Akhir | PAGE-004, PAGE-004-SUB-01 | /wali-kelas, /wali-kelas/laporan |
