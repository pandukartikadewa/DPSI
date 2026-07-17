# Design System (DS) - Source of Truth #3

Document Version: v1.0

Project: Sistem Absensi Digital MTsN 1 Yogyakarta

Product: Aplikasi Absensi Digital Berbasis Web/Mobile dengan Modul Validasi Foto

Status: Validated / Active

Last Updated: 2026-06-26

Author: System Analyst AI

---

## 1. DOCUMENT OVERVIEW

### 1.1 Purpose

Dokumen ini mendefinisikan bahasa visual, standar interaksi, dan komponen UI yang dapat digunakan kembali (reusable UI components) pada seluruh antarmuka Sistem Absensi Digital MTsN 1 Yogyakarta. Sistem Desain ini dikembangkan berdasarkan karakteristik formal institusi MTsN 1 Yogyakarta (di bawah naungan Kementerian Agama RI) yang bernuansa islami, edukatif, dan profesional, sekaligus dirancang ergonomis agar para guru nyaman menggunakannya setiap hari.

Sebagai Source of Truth #3 (SoT-3), dokumen ini diturunkan langsung dari SoT-1 (SRS v0.1) dan SoT-2 (Information Architecture v1.0), serta akan digunakan sebagai landasan mutlak untuk:

- Pembuatan High-Fidelity Prototype (SoT-5).
- Panduan penulisan kode komponen Frontend (React, HTML/CSS).
- Menjaga konsistensi pengalaman pengguna (UX) di seluruh layar aplikasi untuk keempat role pengguna.
- Mempercepat waktu pelatihan Guru Mapel, Guru Piket, dan Wali Kelas melalui pola interaksi yang konsisten dan intuitif.

### 1.2 Related Sources of Truth

| Artifact | Reference | Description |
| --- | --- | --- |
| SoT-1 | SRS v0.1 | Spesifikasi Kebutuhan Perangkat Lunak dasar. |
| SoT-2 | Information Architecture v1.0 | Struktur navigasi, peta situs, dan pemetaan routing. |
| SoT-4 | User Flows | Rangkaian langkah interaksi pengguna per use-case. |
| SoT-5 | HiFi Prototype | Representasi visual interaktif akhir. |

---

## 2. DESIGN PRINCIPLES

### 2.1 Design Goals

- **Formal & Terpercaya (Institutional Trust):** Struktur visual kokoh dan bersih yang mencerminkan identitas institusi pendidikan resmi di bawah naungan Kementerian Agama RI.
- **Ergonomi Harian (Nyaman Digunakan Guru):** Palet latar belakang off-white lembut dirancang agar guru nyaman memeriksa daftar siswa yang panjang setiap hari tanpa cepat lelah mata.
- **Kejelasan Status Instan (Visual Clarity):** Status kehadiran (Hadir, Izin, Sakit, Alpa) serta hasil validasi wajah harus dapat dikenali guru secara instan melalui kode warna yang konsisten.

### 2.2 UX Principles

- **Umpan Balik Instan pada Validasi Wajah (Instant Feedback):** Garis panduan oval pada viewfinder kamera berubah warna secara langsung begitu wajah siswa berhasil diverifikasi oleh algoritma face recognition.
- **Aksi Utama Selalu Terjangkau (Persistent Primary Action):** Tombol "Kirim Absensi" menetap di area bawah layar (fixed bottom navigation) agar selalu mudah dijangkau guru saat mengisi presensi.
- **Pengiriman Bertahap/Terjaga (Guarded Submission):** Tombol aksi utama hanya aktif (enabled) setelah input kehadiran lengkap dan minimal satu foto validasi diambil, untuk mencegah pengiriman data presensi yang tidak lengkap.

---

## 3. BRAND FOUNDATION

### 3.1 Brand Personality

- **Islami & Bermartabat:** Warna hijau khas Madrasah Tsanawiyah dan Kementerian Agama yang melambangkan pertumbuhan, kedamaian, dan nilai-nilai islami.
- **Berprestasi & Berkualitas:** Aksen emas yang mengacu pada warna resmi komponen logo MTsN Yogyakarta, melambangkan prestasi tinggi, kemuliaan, dan kualitas edukasi.
- **Formal & Edukatif:** Struktur layout yang bersih dan profesional, selaras dengan citra institusi pendidikan resmi.

### 3.2 Visual Characteristics

- **Bentuk Sudut:** Membulat sedang (border-radius 8px) pada Card Data Siswa dan komponen jendela kamera, memberi kesan modern namun tetap rapi dan formal.
- **Kedalaman Visual:** Komponen mengambang seperti Card Data Siswa ditegaskan dengan latar putih bersih di atas latar belakang off-white aplikasi, menjaga tampilan tetap ringan dan tidak berlebihan agar fokus guru tetap pada data kehadiran.

---

## 4. COLOR SYSTEM

Skema warna dirancang agar nyaman di mata guru untuk penggunaan jangka panjang saat memeriksa daftar siswa yang panjang, sekaligus merepresentasikan identitas formal-islami institusi.

### 4.1 Primary Colors (Hijau Khas Madrasah)

Digunakan untuk elemen tindakan utama dan identitas merek aplikasi.

| Token | Hex Value | Tailwind Class | Usage | Filosofi Desain |
| --- | --- | --- | --- | --- |
| color-primary | #005A36 | bg-[#005A36] | Warna utama pada Header, bilah navigasi atas, dan tombol utama aplikasi. | Representasi warna hijau khas Madrasah Tsanawiyah dan Kementerian Agama yang melambangkan pertumbuhan, kedamaian, dan nilai islami. |

### 4.2 Secondary Colors (Emas Aksen)

Digunakan untuk elemen aksen, border aktif, dan penanda komponen penting.

| Token | Hex Value | Tailwind Class | Usage | Filosofi Desain |
| --- | --- | --- | --- | --- |
| color-secondary | #D4AF37 | bg-[#D4AF37] | Aksen, warna border aktif, ikon penting, dan garis pembatas card. | Mengacu pada warna emas resmi pada komponen logo MTsN Yogyakarta yang melambangkan prestasi tinggi, kemuliaan, dan kualitas edukasi. |

### 4.3 Semantic Colors (Status Kehadiran & Alerts)

| Token | Hex Value | Tailwind Class | Usage | Filosofi Desain |
| --- | --- | --- | --- | --- |
| color-success | #10B981 | bg-[#10B981] | Indikator status "Hadir" dan tanda kotak pemandu kamera (bounding box) ketika wajah sukses terverifikasi. | Warna hijau cerah yang memberikan konfirmasi kepastian dan keberhasilan proses. |
| color-warning | #F59E0B | bg-[#F59E0B] | Label indikator untuk status siswa berhalangan dengan keterangan "Izin" atau "Sakit". | Warna kuning/oranye yang memberikan tanda perhatian tanpa kesan darurat. |
| color-error | #DC2626 | bg-[#DC2626] | Indikator status "Alpa" atau peringatan kegagalan validasi wajah (Face Mis-match). | Warna merah tegas untuk menarik perhatian guru terhadap ketidakhadiran tanpa keterangan atau error perangkat. |

### 4.4 Neutral Colors (Backgrounds & Text)

| Token | Hex Value | Tailwind Class | Usage |
| --- | --- | --- | --- |
| color-bg-app | #F8FAFC | bg-[#F8FAFC] | Warna latar belakang seluruh halaman aplikasi (putih abu-abu lembut/off-white) untuk mengurangi kelelahan mata (eye strain) guru saat memeriksa daftar siswa yang panjang. |
| color-text-heading | #1E293B | text-[#1E293B] | Warna teks Heading 1 (Judul Halaman Utama) - Deep Charcoal. |
| color-text-body | #334155 | text-[#334155] | Warna teks Body (Nama Siswa & NIS) - Dark Slate. |

---

## 5. TYPOGRAPHY

Aplikasi menggunakan jenis huruf (font) tunggal yang memiliki tingkat keterbacaan (readability) tinggi pada berbagai resolusi layar gawai: Inter atau Plus Jakarta Sans (Sans-Serif).

| Text Style | Font Family | Weight | Size (px/rem) | Line Height | Usage |
| --- | --- | --- | --- | --- | --- |
| Heading 1 | Inter / Plus Jakarta Sans | Bold (700) | 22px (1.375rem) | 1.3 | Judul halaman utama, warna Deep Charcoal (#1E293B). |
| Heading 2 | Inter / Plus Jakarta Sans | SemiBold (600) | 16px (1rem) | 1.4 | Nama kelas/sub-seksi, warna Primary Green (#005A36). |
| Body Text | Inter / Plus Jakarta Sans | Regular (400) | 14px (0.875rem) | 1.5 | Nama Siswa & NIS pada Card Data Siswa, warna Dark Slate (#334155). |
| Micro Text | Inter / Plus Jakarta Sans | Medium (500) | 11px (0.6875rem) | 1.4 | Label Status/Keterangan Waktu, warna kontras (putih #FFFFFF di atas latar warna status). |

---

## 6. ELEVATION & SHADOWS

Sistem Desain ini didominasi tampilan datar (flat) dengan aksen border warna Secondary Gold, alih-alih bayangan berlapis, guna menjaga kesan formal dan bersih khas institusi pendidikan.

- **Shadow None:** Digunakan pada Card Data Siswa (latar putih bersih tanpa bayangan tebal, sudut membulat border-radius 8px).
- **Shadow Small:** Diterapkan tipis pada Jendela Kamera & Overlay Face Recognition untuk menegaskan komponen tersebut sebagai fokus aktif di bagian bawah form presensi.

---

## 7. GRID & LAYOUT

Aplikasi dioptimalkan mobile-first untuk perangkat smartphone/tablet milik guru sebagai perangkat kerja utama, dengan tetap mendukung akses desktop untuk peran monitoring/administratif.

### 7.1 Mobile/Tablet Grid (Perangkat Utama Guru Mapel)

- **Layout Style:** Satu kolom (single column), mengikuti pola akses guru di lapangan via smartphone/tablet.
- **Main Container:** Lebar penuh (100vw) dengan padding aman untuk layar kecil.
- **Tombol Aksi Utama:** Menetap di area bawah layar (fixed bottom navigation), lebar penuh (full-width padding).

### 7.2 Desktop Grid (Dasbor Guru Piket, Wali Kelas & Admin)

- **Layout Style:** Sidebar + Content Area, mengikuti struktur navigasi role-based pada Information Architecture (SoT-2).
- **Sidebar Width:** Menetap permanen pada resolusi Desktop, dapat diciutkan menjadi bentuk ikon (mengacu pada perilaku navigasi SoT-2).

---

## 8. ICONOGRAPHY

Aplikasi menggunakan pustaka ikon Lucide React (atau inline SVG yang setara) dengan gaya ikon Outline yang konsisten, dipetakan mengikuti struktur menu pada Information Architecture (SoT-2).

| Icon Function | Lucide Icon Name | Visual Representation |
| --- | --- | --- |
| Menu Presensi (Guru Mapel) | ClipboardCheck | Ikon Papan Presensi Bercentang |
| Validasi Kamera / Face Recognition | Camera | Ikon Kamera |
| Dasbor Monitoring (Guru Piket) | LayoutDashboard | Ikon Dasbor |
| Log Validasi Bukti Foto | ShieldCheck | Ikon Perisai Centang (Validasi) |
| Cetak Rekap Harian | FileText | Ikon Dokumen/Berkas |
| Laporan Akademik (Wali Kelas) | BarChart3 | Ikon Grafik Batang |
| Kelola Akun Pengguna & Data Siswa | Users | Ikon Kelompok Orang |
| Kelola Kurikulum & Mata Pelajaran | BookOpen | Ikon Buku Terbuka |
| Keluar Aplikasi (Logout) | LogOut | Ikon Pintu Keluar dengan Panah |
| Status Hadir | CheckCircle2 | Ikon Centang Bulat |
| Status Alpa | XCircle | Ikon Silang Bulat |

---

## 9. COMPONENT LIBRARY

### 9.1 Card Data Siswa

Komponen persegi panjang dengan sudut melengkung (border-radius: 8px) berwarna latar putih bersih.

- **Sisi Kiri:** Foto profil kecil siswa, nama lengkap, dan NIS.
- **Sisi Kanan:** Baris tombol opsi lingkaran (radio buttons) horizontal untuk pilihan H, I, S, dan A secara ringkas.

### 9.2 Jendela Kamera & Overlay Face Recognition

Komponen penangkap gambar berbentuk kotak dengan sudut membulat (viewfinder) atau lingkaran di bagian tengah bawah form presensi. Komponen ini memiliki overlay garis putus-putus berbentuk oval di dalamnya sebagai panduan posisi wajah siswa.

**States Representation**

| State | Visual |
| --- | --- |
| [Default / Guiding] | Garis putus-putus oval berwarna Secondary Gold (#D4AF37) sebagai panduan posisi wajah siswa. |
| [Success / Verified] | Garis putus-putus otomatis berubah warna menjadi Status Green (#10B981) ketika algoritma face recognition mendeteksi wajah manusia secara benar. |

### 9.3 Tombol Aksi Utama (Action Button)

Tombol "Kirim Absensi" diposisikan menetap di area bawah layar (fixed bottom navigation). Berukuran besar (full-width mobile padding), menggunakan warna dasar Primary Green (#005A36) dengan teks putih tebal.

**States Representation**

| State | Visual |
| --- | --- |
| [Disabled] | Nonaktif selama Guru Mapel belum melengkapi input kehadiran seluruh siswa dan belum mengambil minimal satu foto validasi kelas sebagai lampiran berkas penunjang. |
| [Enabled / Default] | bg Primary Green (#005A36), teks putih tebal — aktif setelah seluruh syarat input terpenuhi. |

---

## 10. FORM DESIGN RULES

- **Status Kehadiran Wajib Dipilih:** Setiap siswa pada Card Data Siswa wajib memiliki satu status kehadiran terpilih (H, I, S, atau A) melalui radio button sebelum data dapat dikirim.
- **Validasi Foto Wajib Dilampirkan:** Minimal satu foto/frame validasi kelas wajib diambil melalui Jendela Kamera sebagai lampiran berkas penunjang sebelum tombol "Kirim Absensi" dapat ditekan.
- **Guarded Submission:** Alih-alih menampilkan pesan error setelah kegagalan submit, sistem menonaktifkan (disabled) tombol "Kirim Absensi" beserta indikator visualnya selama salah satu syarat di atas belum terpenuhi.

---

## 11. INTERACTION PATTERNS

### 11.1 Real-Time Validation Feedback (Live State pada Kamera)

Ketika algoritma face recognition mendeteksi wajah siswa secara benar pada Jendela Kamera, garis panduan oval otomatis berubah warna dari Secondary Gold (#D4AF37) menjadi Status Green (#10B981) secara langsung tanpa perlu aksi tambahan dari guru.

### 11.2 Guarded Submission (Aktivasi Bertahap Tombol Kirim)

Tombol "Kirim Absensi" tetap non-aktif hingga Guru Mapel melengkapi input status kehadiran seluruh siswa di kelas tersebut dan mengambil minimal satu foto validasi sebagai bukti kehadiran.

### 11.3 Loading State (Unggah Data ke Peladen)

Saat sistem mengunggah data status absensi beserta berkas foto validasi ke peladen (server), tombol "Kirim Absensi" menampilkan animasi spinner dan dinonaktifkan sementara untuk mencegah pengiriman ganda (double submit) selagi proses unggah berlangsung.

---

## 12. RESPONSIVE BEHAVIOR

Sistem ini didesain sepenuhnya responsif untuk menjamin kenyamanan akses guru baik menggunakan smartphone/tablet di lapangan (Guru Mapel) maupun monitor komputer di ruang kerja (Guru Piket, Wali Kelas, Admin).

**[Viewport: Mobile/Tablet (< 768px) — Perangkat Utama Guru Mapel]**

- Sidebar disembunyikan total (hanya dapat diakses melalui drawer hamburger menu, mengacu pada Information Architecture SoT-2).
- Form Presensi tampil satu kolom penuh dengan Tombol Aksi Utama menetap di bagian bawah layar.

**[Viewport: Desktop (>= 1024px) — Dasbor Guru Piket, Wali Kelas & Admin]**

- Sidebar terbuka lebar penuh secara permanen, menampilkan menu sesuai role pengguna yang login.
- Dasbor dan tabel data master ditampilkan dalam layout multi-kolom yang proporsional.

---

## 13. ACCESSIBILITY (a11y)

- **Contrast Ratio:** Teks Heading dan label status harus memiliki kontras tinggi terhadap latar belakang off-white (#F8FAFC) agar mudah dipindai guru saat memeriksa daftar siswa yang panjang.
- **Kejelasan Indikator Status:** Warna status kehadiran (Success/Warning/Error) pada Card Data Siswa dan overlay kamera harus tetap dapat dibedakan meskipun dilihat sekilas, mengingat guru sering mengisi presensi di sela jam mengajar yang terbatas.

---

## 14. DESIGN TOKENS TABLE

| Token Name | Token Category | Token Value | Mapped CSS / Tailwind |
| --- | --- | --- | --- |
| token-font-main | Typography | Inter / Plus Jakarta Sans | font-sans |
| token-color-primary | Color | #005A36 | bg-[#005A36] |
| token-color-secondary | Color | #D4AF37 | bg-[#D4AF37] |
| token-color-success | Color | #10B981 | bg-[#10B981] |
| token-color-warning | Color | #F59E0B | bg-[#F59E0B] |
| token-color-error | Color | #DC2626 | bg-[#DC2626] |
| token-color-bg-app | Color | #F8FAFC | bg-[#F8FAFC] |
| token-border-radius | Layout | 8px | rounded-lg |

---

## 15. TRACEABILITY MATRIX (SRS v0.1 → DS v1.0)

Setiap elemen visual dan aturan komponen dalam sistem ini diturunkan untuk menjamin terpenuhinya spesifikasi fungsional dari dokumen dasar.

| Feature ID | Feature Name | Design System Target Components | Applied Design / Interaction Rules |
| --- | --- | --- | --- |
| F001 | Autentikasi & Manajemen Sesi | Halaman Login, Role Selector. | Warna Primary Green (#005A36) pada tombol utama dan header, kontras tinggi pada label form. |
| F002 | Pencatatan Presensi | Card Data Siswa, Radio Button Status (H/I/S/A). | Sudut membulat 8px, layout dua sisi (foto & nama di kiri, radio button status di kanan). |
| F003 | Validasi Foto (Face Recognition Sederhana) | Jendela Kamera & Overlay Face Recognition, Tombol Aksi Utama. | Overlay oval Secondary Gold (#D4AF37) berubah menjadi Status Green (#10B981) saat wajah terverifikasi; tombol kirim ter-guarded hingga foto validasi terlampir. |
| F004 | Rekapitulasi Otomatis Terpusat | Dasbor Monitoring Real-Time, Log Validasi Bukti. | Kode warna status (Success/Warning/Error) sebagai indikator visual instan bagi Guru Piket. |
| F005 | Manajemen Data Master | Tabel Kelola Akun, Siswa & Kelas, Kurikulum. | Tipografi Body Text dan Neutral Colors untuk kejelasan data tabular bagi Admin. |
| F006 | Pelaporan & Filter Laporan Akhir | Filter Bar, Tombol "Ekspor & Cetak Laporan". | Warna Primary Green pada tombol ekspor, tipografi Heading 2 untuk judul laporan akademik. |

---

## APPENDIX: PENYESUAIAN STRUKTUR CLASS DATA (SOT CLASS DIAGRAM)

Catatan: Bagian ini merupakan konten struktur data (Class Diagram) dari dokumen asli yang berada di luar cakupan template Design System, namun tetap disertakan agar tidak ada isi yang hilang dari dokumen sumber. Bagian ini sebaiknya dipindahkan ke dokumen Data Model/Class Diagram pada revisi berikutnya.

Untuk merealisasikan fitur penangkapan kamera dan validasi face recognition ke dalam arsitektur kode program yang telah direncanakan di dokumen Class Diagram asli, struktur Class Absensi diperluas dengan menambahkan atribut dan metode operasi (method) sebagai berikut:

**Atribut Tambahan pada Class Absensi:**

- `fotoBukti: String` — Menyimpan path direktori lokal atau URL penyimpanan cloud tempat file gambar wajah hasil jepretan kamera disimpan.
- `isVerified: Boolean` — Menyimpan status boolean true/false apakah wajah yang difoto lolos verifikasi pencocokan wajah atau berhasil tersimpan sebagai bukti absensi.

**Method Tambahan pada Class Absensi:**

- `bukaKamera(): Void` — Fungsi untuk memicu API internal sistem operasi gawai guna menyalakan kamera depan/belakang perangkat.
- `validasiWajah(foto: String): Boolean` — Fungsi/prosedur yang memproses ekstraksi fitur gambar wajah yang diambil lalu mencocokkannya dengan templat wajah siswa pada data master untuk mengonfirmasi keabsahan data sebelum disimpan ke database.
