# Software Requirements Specification (SRS)

Document Version: v0.1

Project: Sistem Absensi Digital MTsN 1 Yogyakarta

Product: Aplikasi Absensi Digital Berbasis Web/Mobile dengan Modul Validasi Foto

Status: Draft

Last Updated: 2026-06-26

Author: System Analyst AI

# 1. INTRODUCTION

## 1.1 Purpose

Dokumen ini mendefinisikan spesifikasi kebutuhan perangkat lunak untuk Sistem Absensi Digital MTsN 1 Yogyakarta. Berdasarkan analisis masalah dari dokumen Fase 1, aplikasi absensi lama sering mengalami error teknis sehingga para guru harus kembali menggunakan metode manual (pencatatan spreadsheet dan pelaporan via grup WhatsApp). Proses manual ini mengakibatkan keterlambatan rekapitulasi data harian oleh Guru Piket, risiko tinggi duplikasi data, kesalahan pencatatan, serta ketidakefisienan saat Wali Kelas membutuhkan data presensi yang akurat untuk laporan akhir pembagian rapor. Dokumen ini berfungsi sebagai *source of truth* tunggal (SoT-1) yang melandasi pembuatan artefak pengembangan berikutnya seperti User Flows, Arsitektur, Model Data, dan API Contracts.

## 1.2 Scope

### Business Goals

* Menghilangkan proses pencatatan absensi manual (spreadsheet dan grup WhatsApp) yang rentan error, duplikasi data, dan keterlambatan rekapitulasi.
* Menyediakan validasi kehadiran siswa yang objektif melalui Modul Kamera/Validasi Foto guna mencegah manipulasi data.
* Mempercepat proses rekapitulasi data kehadiran harian oleh Guru Piket secara real-time tanpa media pihak ketiga.
* Menyediakan laporan kehadiran yang akurat dan siap ekspor bagi Wali Kelas untuk kebutuhan dokumen pembagian rapor.

### In Scope

* Autentikasi & manajemen sesi pengguna berbasis role (Guru Mapel, Guru Piket, Wali Kelas, Admin).
* Pencatatan presensi siswa oleh Guru Mapel berdasarkan Tingkat Kelas, Ruang Kelas, dan Mata Pelajaran yang diampu.
* **Modul Kamera/Validasi Foto (Face Recognition Sederhana) sebagai konfirmasi kehadiran fisik siswa dan pencegahan manipulasi data.**
* Rekapitulasi otomatis dan real-time status kehadiran siswa (Hadir, Sakit, Izin, Alpa) ke dasbor Guru Piket.
* Manajemen data master (data murid, relasi kelas, data mata pelajaran, dan data akun pengguna).
* Pelaporan dan filter laporan akhir kehadiran (grafik per siswa/kelas, filter periode, ekspor PDF/Excel).

### Out of Scope

* Integrasi otomatis dengan sistem akademik/rapor digital pihak ketiga di luar ekspor PDF/Excel.
* Manajemen absensi untuk staf/karyawan non-guru (sistem hanya mencakup kehadiran siswa).
* Pengenalan wajah (face recognition) tingkat lanjut yang memerlukan pelatihan model machine learning khusus, di luar pencocokan dasar/penyimpanan berkas foto sebagai bukti kehadiran.

## 1.3 Stakeholders

| Stakeholder | Role | Responsibility |
| --- | --- | --- |
| Administrasi Madrasah (Bapak Atok) | Project Sponsor / Narasumber | Memberikan arahan kebutuhan bisnis berdasarkan hasil wawancara dan menyetujui hasil akhir sistem. |
| Guru Mata Pelajaran (Mapel) | End User | Melakukan pencatatan kehadiran siswa secara langsung di setiap jam pelajaran/pertemuan. |
| Guru Piket | End User | Memantau keterisian absensi harian dari seluruh kelas secara terpusat dan melakukan rekapitulasi otomatis. |
| Wali Kelas | End User | Memantau statistik kehadiran kelas binaannya serta mencetak laporan periodik sebagai lampiran buku rapor. |
| System Analyst | Author | Menyusun dan memperbarui dokumentasi *Source of Truth* (SoT). |

## 1.4 Definitions

| Term | Definition |
| --- | --- |
| MTsN | Madrasah Tsanawiyah Negeri, jenjang pendidikan formal setingkat SMP di bawah naungan Kementerian Agama. |
| Guru Piket | Guru yang bertugas memantau dan merekapitulasi kehadiran siswa secara terpusat pada hari tertentu. |
| Wali Kelas | Guru yang bertanggung jawab memantau perkembangan dan kehadiran siswa di kelas binaannya. |
| Face Recognition Sederhana | Modul validasi foto wajah siswa untuk mengonfirmasi kehadiran fisik secara valid dan mencegah manipulasi data absensi. |
| NIS | Nomor Induk Siswa, kode unik identitas siswa. |

## 1.5 References

* Dokumen Analisis Masalah Fase 1 (hasil wawancara dengan pihak administrasi madrasah).
* `Software Requirements Specification.txt` (Template Utama).

# 2. PRODUCT OVERVIEW

## 2.1 Product Summary

Sistem Absensi Digital MTsN 1 Yogyakarta memfasilitasi tiga aktor utama yang diidentifikasi dari hasil wawancara dengan pihak administrasi madrasah (Bapak Atok): Guru Mata Pelajaran (mencatat kehadiran siswa langsung di setiap jam pelajaran), Guru Piket (memantau keterisian absensi harian seluruh kelas secara terpusat dan melakukan rekapitulasi otomatis), dan Wali Kelas (memantau statistik kehadiran kelas binaan serta mencetak laporan periodik sebagai lampiran buku rapor). Sebagai tambahan kendali mutu (validasi objektif), sistem ini dilengkapi Modul Kamera/Validasi Foto (Face Recognition Sederhana) yang mewajibkan pengambilan sampel foto wajah siswa saat absensi diproses, guna mengonfirmasi kehadiran fisik secara valid dan mencegah manipulasi data. Sistem ini dirancang terintegrasi penuh guna menyelesaikan permasalahan absensi manual secara digital, mutakhir, dan transparan.

## 2.2 User Types

| User Type | Description |
| --- | --- |
| Guru Mata Pelajaran (Mapel) | Pengguna yang melakukan pencatatan kehadiran siswa secara langsung di setiap jam pelajaran/pertemuan, termasuk mengaktifkan modul kamera/validasi foto. |
| Guru Piket | Pengguna yang memantau keterisian absensi harian dari seluruh kelas secara terpusat melalui dasbor rekapitulasi otomatis. |
| Wali Kelas | Pengguna yang memantau statistik kehadiran kelas binaannya serta mencetak/mengekspor laporan periodik sebagai lampiran buku rapor. |
| Admin | Pengguna yang mengelola data master sistem (data murid, kelas, mata pelajaran, dan akun pengguna). |

## 2.3 User Goals

### User Type: Guru Mata Pelajaran (Mapel)

* Dapat memilih Tingkat Kelas, Ruang Kelas, dan Mata Pelajaran yang diampu dengan cepat dan mudah.
* Dapat mencatat kehadiran siswa (Hadir, Sakit, Izin, Alpa) secara langsung di setiap jam pelajaran.
* Dapat mengaktifkan kamera perangkat untuk mengambil foto validasi wajah siswa sebagai bukti kehadiran yang sah.

### User Type: Guru Piket

* Dapat memantau keterisian absensi harian seluruh kelas secara terpusat tanpa perlu media kirim pihak ketiga (grup chat).
* Dapat melihat status kehadiran siswa terekap secara otomatis dan real-time segera setelah Guru Mapel mengirim data.

### User Type: Wali Kelas

* Dapat melihat ringkasan grafik kehadiran per siswa atau per kelas binaannya.
* Dapat memfilter data kehadiran berdasarkan rentang tanggal/periode tertentu.
* Dapat mengekspor data kehadiran ke format PDF/Excel untuk kebutuhan dokumen pembagian rapor.

## 2.4 Operating Environment

* **Frontend:** Aplikasi berbasis web/mobile yang responsif, dapat diakses melalui smartphone/tablet milik guru.
* **Backend:** REST API dengan seluruh transmisi data dienkripsi menggunakan protokol HTTPS (SSL/TLS).
* **Database:** Basis data relasional untuk menyimpan data murid, kelas, mata pelajaran, akun pengguna, dan riwayat presensi.
* **Modul Kamera:** Memanfaatkan kamera internal perangkat (smartphone/tablet) untuk menangkap foto wajah siswa.
* **Jaringan:** Kondisi jaringan internet standar (3G/4G) selama jam operasional sekolah.

## 2.5 Assumptions

* Perangkat guru (smartphone/tablet) memiliki kamera internal yang berfungsi baik serta koneksi internet standar (3G/4G) selama jam operasional sekolah (06.30–16.00 WIB).
* Data profil foto siswa (jika digunakan untuk proses face matching) telah tersedia di basis data sistem.

## 2.6 Constraints

* Sistem harus tetap stabil dan tidak mengalami crash/freeze saat modul kamera aktif, khususnya pada perangkat berspesifikasi rendah/menengah milik guru.
* Waktu operasional sistem terbatas pada jam sekolah (06.30–16.00 WIB) dengan target ketersediaan minimal 99.5% pada rentang waktu tersebut.

# 3. SYSTEM FEATURES

---

## Feature ID: F001
Feature Name: Autentikasi & Manajemen Sesi

### Description

Fitur ini memvalidasi identitas pengguna saat login dan membatasi hak akses menu sesuai dengan role masing-masing pengguna (Guru Mapel, Guru Piket, Wali Kelas, Admin).

### Requirements

* Sistem harus mampu memvalidasi login pengguna dengan mencocokkan username, password, dan role.
* Sistem harus membatasi hak akses menu sesuai dengan role pengguna yang login.

### Business Rules

* Hak akses fitur ditentukan sepenuhnya berdasarkan role yang melekat pada akun pengguna.

---

## Feature ID: F002
Feature Name: Pencatatan Presensi

### Description

Fitur ini memfasilitasi Guru Mapel untuk memilih kelas dan mata pelajaran yang diampu, lalu menampilkan daftar siswa untuk dicatat kehadirannya pada setiap jam pelajaran/pertemuan.

### Requirements

* Sistem harus menyediakan menu bagi Guru Mapel untuk memilih Tingkat Kelas, Ruang Kelas, dan Mata Pelajaran yang diampu.
* Sistem harus menampilkan daftar siswa pada kelas yang telah dipilih.

### Business Rules

* Hanya Guru Mapel yang berwenang mencatat presensi untuk mata pelajaran yang diampunya.

---

## Feature ID: F003
Feature Name: Validasi Foto (Face Recognition Sederhana)

### Description

Fitur ini mengaktifkan kamera internal perangkat untuk menangkap foto wajah siswa sebagai kendali mutu (validasi objektif) atas kehadiran fisik, guna mencegah manipulasi data absensi.

### Requirements

* Sistem harus dapat mengaktifkan kamera internal perangkat (smartphone/tablet) untuk menangkap foto wajah siswa.
* Sistem harus memproses pencocokan wajah (face matching) dengan basis data foto profil siswa, atau minimal menyimpan foto tersebut ke peladen (server) sebagai berkas bukti digital kehadiran yang sah.

### Business Rules

* Setiap proses absensi wajib disertai pengambilan sampel foto wajah siswa sebagai konfirmasi kehadiran fisik.
* Foto yang berhasil diunggah tetap disimpan sebagai berkas bukti digital kehadiran meskipun proses face matching otomatis tidak berhasil dilakukan.

---

## Feature ID: F004
Feature Name: Rekapitulasi Otomatis Terpusat

### Description

Fitur ini secara otomatis merangkum dan memperbarui status kehadiran siswa ke dasbor Guru Piket segera setelah data dikirim oleh Guru Mapel, tanpa memerlukan media kirim pihak ketiga.

### Requirements

* Sistem harus secara otomatis merangkum dan memperbarui (real-time) status kehadiran siswa (Hadir, Sakit, Izin, Alpa) ke dalam dasbor Guru Piket.

### Business Rules

* Rekapitulasi terpicu secara otomatis sesaat setelah Guru Mapel menekan tombol kirim data, tanpa memerlukan media kirim pihak ketiga (grup chat).

---

## Feature ID: F005
Feature Name: Manajemen Data Master

### Description

Fitur ini memungkinkan pengelolaan data inti sistem, meliputi data murid, relasi kelas, mata pelajaran, dan akun pengguna.

### Requirements

* Sistem harus mampu mengelola data murid (NIS, Nama).
* Sistem harus mampu mengelola relasi kelas (setiap kelas memiliki banyak siswa).
* Sistem harus mampu mengelola data mata pelajaran.
* Sistem harus mampu mengelola data akun pengguna (User).

### Business Rules

* Pengelolaan data master hanya dapat dilakukan oleh pengguna dengan role Admin.

---

## Feature ID: F006
Feature Name: Pelaporan & Filter Laporan Akhir

### Description

Fitur ini memfasilitasi Wali Kelas untuk melihat ringkasan grafik kehadiran, memfilter data berdasarkan periode tertentu, serta mengekspor laporan untuk kebutuhan dokumen pembagian rapor.

### Requirements

* Sistem harus memfasilitasi Wali Kelas untuk melihat ringkasan grafik kehadiran per siswa atau per kelas.
* Sistem harus menyediakan filter berdasarkan rentang tanggal/periode tertentu.
* Sistem harus dapat mengekspor data ke format PDF/Excel.

### Business Rules

* Laporan hasil ekspor ditujukan khusus untuk kebutuhan dokumen pembagian rapor.

# 4. DATA REQUIREMENTS

## 4.1 Core Business Objects

| Object | Description |
| --- | --- |
| Siswa | Menyimpan data murid meliputi NIS dan Nama. |
| Kelas | Menyimpan data kelas beserta relasinya dengan siswa (satu kelas memiliki banyak siswa). |
| MataPelajaran | Menyimpan data mata pelajaran yang diampu oleh Guru Mapel. |
| User | Menyimpan data akun pengguna beserta role (Guru Mapel, Guru Piket, Wali Kelas, Admin). |
| Presensi | Menyimpan data kehadiran siswa per pertemuan meliputi status (Hadir, Sakit, Izin, Alpa) dan berkas foto validasi. |

## 4.2 Ownership Rules

| Object | Owner |
| --- | --- |
| Presensi | Guru Mapel (memiliki akses untuk membuat dan mengirim data kehadiran). |
| Siswa, Kelas, MataPelajaran, User | Admin (memiliki akses kelola penuh data master). |

## 4.3 Data Retention Rules

* Data presensi beserta berkas foto validasi wajib disimpan sebagai arsip digital untuk keperluan laporan akhir/pembagian rapor pada tahun ajaran berjalan.

## 4.4 Data Validation Rules

* Status kehadiran siswa harus berupa salah satu dari nilai baku: Hadir, Sakit, Izin, atau Alpa.
* Kredensial login (username, password) dan role pengguna wajib divalidasi sebelum akses ke sistem diberikan.
* Kata sandi pengguna wajib dienkripsi satu arah menggunakan algoritma aman (misal: BCrypt) sebelum disimpan ke basis data.

# 5. EXTERNAL INTERFACES

## 5.1 User Interface Requirements

* Antarmuka dioptimalkan untuk perangkat smartphone/tablet yang digunakan guru di lapangan.
* Navigasi dan menu dibatasi sesuai role pengguna yang login (Guru Mapel, Guru Piket, Wali Kelas, Admin).

## 5.2 External Systems

| System | Purpose |
| --- | --- |
| Modul Kamera Perangkat (Smartphone/Tablet) | Menangkap foto wajah siswa untuk keperluan validasi kehadiran (Face Recognition Sederhana). |

## 5.3 Communication Requirements

### Protocols

* HTTPS (SSL/TLS) untuk seluruh transmisi data, termasuk kredensial login dan berkas foto wajah (image payload).

### Formats

* Image payload (berkas foto wajah siswa).
* PDF/Excel (format ekspor laporan akhir kehadiran).

# 6. NON-FUNCTIONAL REQUIREMENTS

## 6.1 Performance

* Waktu respons sistem untuk mengunggah satu berkas foto validasi beserta data status absensi sekelompok siswa ke peladen tidak boleh melebihi 3 detik pada kondisi jaringan internet standar (3G/4G).

## 6.2 Security

* Semua transmisi data, termasuk kredensial login dan berkas foto wajah (image payload), wajib dilindungi menggunakan enkripsi protokol HTTPS (SSL/TLS).
* Atribut kata sandi pengguna di dalam basis data harus dienkripsi satu arah menggunakan algoritma aman (misal: BCrypt).

## 6.3 Availability

* Sistem harus memastikan tingkat ketersediaan (*availability*) minimal 99.5% pada jam operasional sekolah (06.30–16.00 WIB).

## 6.4 Reliability

* Sistem harus menangani alokasi memori saat modul kamera aktif agar tidak terjadi crash atau freeze pada perangkat berspesifikasi rendah/menengah milik guru.

## 6.5 Scalability

* Struktur basis data harus mampu menangani pertumbuhan data presensi harian dari seluruh kelas di MTsN 1 Yogyakarta tanpa penurunan performa yang signifikan.

## 6.6 Maintainability

* Source code aplikasi wajib ditulis menggunakan standar penamaan yang bersih dan modular guna memudahkan pengembangan fitur baru di masa mendatang.

## 6.7 Usability

* Antarmuka pencatatan presensi harus mudah dioperasikan oleh guru dengan tingkat literasi teknologi yang bervariasi, khususnya saat pengisian dilakukan di sela jam mengajar.

# 7. PERMISSIONS AND ACCESS CONTROL

| Capability | Guru Mapel | Guru Piket | Wali Kelas | Admin |
| --- | --- | --- | --- | --- |
| Mencatat Presensi Siswa | **AKSI (ALLOWED)** | DITOLAK (DENIED) | DITOLAK (DENIED) | DITOLAK (DENIED) |
| **Mengaktifkan Modul Kamera/Validasi Foto** | **AKSI (ALLOWED)** | DITOLAK (DENIED) | DITOLAK (DENIED) | DITOLAK (DENIED) |
| Melihat Rekapitulasi Harian (Dasbor) | DITOLAK (DENIED) | **AKSI (ALLOWED)** | DITOLAK (DENIED) | **AKSI (ALLOWED)** |
| Melihat Laporan & Filter Periode | DITOLAK (DENIED) | **AKSI (ALLOWED)** | **AKSI (ALLOWED)** | **AKSI (ALLOWED)** |
| Mengekspor Laporan (PDF/Excel) | DITOLAK (DENIED) | DITOLAK (DENIED) | **AKSI (ALLOWED)** | **AKSI (ALLOWED)** |
| Mengelola Data Master (Siswa, Kelas, Mapel, User) | DITOLAK (DENIED) | DITOLAK (DENIED) | DITOLAK (DENIED) | **AKSI (ALLOWED)** |

# 8. FEATURE INVENTORY

| Feature ID | Feature Name | Priority |
| --- | --- | --- |
| F001 | Autentikasi & Manajemen Sesi | High |
| F002 | Pencatatan Presensi | High |
| F003 | Validasi Foto (Face Recognition Sederhana) | High |
| F004 | Rekapitulasi Otomatis Terpusat | High |
| F005 | Manajemen Data Master | Medium |
| F006 | Pelaporan & Filter Laporan Akhir | Medium |

# 9. OPEN QUESTIONS

* *Belum ada pertanyaan terbuka saat ini.*

# 10. FUTURE CONSIDERATIONS

* Pengembangan face recognition tingkat lanjut dengan model machine learning untuk pencocokan wajah otomatis penuh.
* Integrasi dengan sistem akademik/rapor digital pusat di luar mekanisme ekspor PDF/Excel.

# 11. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 0.1 | 2026-07-17 | System Analyst AI | Initial Draft (Dokumen Dasar SoT-1) berdasarkan hasil analisis masalah Fase 1. |
