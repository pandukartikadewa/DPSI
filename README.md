# Sistem Absensi Digital MTsN 1 Yogyakarta

Aplikasi berbasis web untuk pencatatan kehadiran siswa secara real-time di MTsN 1 Yogyakarta. Guru Mapel mengisi presensi per kelas dengan bukti foto via webcam, Guru Piket memonitor dan memvalidasi langsung, Wali Kelas melihat rekap dan statistik siswa binaan, serta Admin mengelola seluruh data master (user, kelas, mapel, penempatan guru per tahun ajaran). Semua pembaruan masuk secara live melalui WebSocket tanpa perlu refresh halaman.

## Anggota Kelompok

| No | Nama | NIM |
|----|------|-----|
| 1 | Moh Dzikry Pradana | 2300016137 |
| 2 | Jhoyce Augusthia Rhaffael | 2300016157 |
| 3 | Kesya Aletta Arizona | 2400016051 |
| 4 | M. Raihan Najwa | 2400016052 |
| 5 | Pandu Kartika Dewa | 2400016053 |

## Pembagian Tugas

| No | Nama | Tugas |
|----|------|-------|
| 1 | Moh Dzikry Pradana | - |
| 2 | Jhoyce Augusthia Rhaffael | - |
| 3 | Kesya Aletta Arizona | Membuat dokumen SOT, Frontend, dan Backend |
| 4 | M. Raihan Najwa | Membuat dokumen SPT, Deploy aplikasi dan Integrasi dengan backend |
| 5 | Pandu Kartika Dewa | Membuat dokumen SOT dan Frontend |

## Teknologi yang Digunakan

### Frontend
- **React 18** — UI library
- **React Router DOM 6** — Routing
- **Recharts** — Grafik dan donut chart
- **Socket.io Client** — Koneksi WebSocket real-time
- **Tailwind CSS 3** — Styling utility-first
- **Vite 5** — Bundler dan dev server

### Backend
- **Node.js** (ES Modules)
- **Express 4** — REST API server
- **Socket.io 4** — WebSocket real-time
- **sql.js** — SQLite via WebAssembly (tanpa native module)
- **bcryptjs** — Hash password
- **jsonwebtoken** — JWT authentication

### Database
- **SQLite** — File-based persistence (`server/data.db`)

## Cara Menjalankan Aplikasi

### Prasyarat
- Node.js v18 atau lebih baru
- npm

### Langkah-langkah

1. **Clone repositori**
   ```bash
   git clone https://github.com/pandukartikadewa/DPSI.git
   cd DPSI
   ```

2. **Install dependensi frontend**
   ```bash
   npm install
   ```

3. **Install dependensi backend**
   ```bash
   cd server
   npm install
   ```

4. **Jalankan backend**
   ```bash
   cd server
   npm run dev
   ```
   Server backend berjalan di `http://localhost:5000`.

5. **Jalankan frontend** (di terminal terpisah)
   ```bash
   npm run dev
   ```
   Aplikasi frontend berjalan di `http://localhost:3000`.

6. **Login Akun Demo**
   Gunakan kredensial berikut untuk mengakses aplikasi:

   | Role | Username | Password |
   |------|----------|----------|
   | Admin | `admin` | `123` |
   | Guru Mapel | `guru.mapel` | `123` |
   | Guru Piket | `guru.piket` | `123` |
   | Wali Kelas | `wali.kelas` | `123` |

## Fitur Utama

- Autentikasi dengan 4 level role (Admin, Guru Mapel, Guru Piket, Wali Kelas)
- Presensi siswa dengan bukti foto via webcam
- Real-time monitoring dan validasi oleh Guru Piket
- Rekap dan statistik kehadiran per kelas/siswa
- Penempatan guru mapel ke kelas berdasarkan tahun ajaran
- CRUD data master (user, siswa, kelas, mapel)
- Role Admin dapat membuat user baru

## URL Aplikasi 
proyek-akhir-dpsi-eight.vercel.app 

## URL Repository Github
https://github.com/pandukartikadewa/DPSI 
