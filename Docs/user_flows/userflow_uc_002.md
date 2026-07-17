# UC-002: Pencatatan Presensi & Validasi Foto

**Aktor:** Guru Mapel
**Halaman:** `/guru-mapel` → `/guru-mapel/presensi` → `/guru-mapel/presensi/{kelasId}`
**Pemicu:** Guru Mapel ingin mencatat kehadiran siswa di kelas yang diampu.

## Main Flow

1. Sistem menampilkan Dasbor Guru Mapel dengan jadwal kelas (grid button) dan aktivitas terakhir.
2. Guru Mapel menekan tombol kelas (misal: "7A") pada grid jadwal.
3. Sistem mengalihkan ke halaman `/guru-mapel/presensi?kelas=7A&tingkat=7`.
4. Halaman menampilkan dropdown Tingkat, Ruang Kelas (terisi otomatis), dan Mata Pelajaran.
5. Guru Mapel memilih Mata Pelajaran dari dropdown.
6. Guru Mapel menekan tombol "Lanjut ke Form Presensi".
7. Sistem mengalihkan ke `/guru-mapel/presensi/{kelasId}?mapel={id}&tingkat={tingkat}`.
8. Sistem menampilkan **Card Data Siswa** untuk setiap siswa:
   - Sisi kiri: foto profil (placeholder), nama, NIS.
   - Sisi kanan: radio button horizontal **H** (Hadir) / **S** (Sakit) / **I** (Izin) / **A** (Alpa).
   - Tombol "Foto" untuk mengaktifkan kamera.
9. Guru Mapel mengatur status kehadiran setiap siswa melalui radio button.
10. Untuk setiap siswa, Guru Mapel menekan tombol "Foto".
11. Sistem membuka **jendela kamera** dengan overlay dashed oval (warna Gold `#D4AF37`).
12. Guru Mapel mengarahkan kamera ke wajah siswa dan menekan "Ambil Foto".
13. Overlay berubah warna menjadi Hijau `#10B981`. Muncul indikator "Foto berhasil disimpan sebagai bukti".
14. Guru Mapel menekan "Gunakan Foto".
15. Foto tersimpan di entry siswa, thumbnail membulat muncul dengan border hijau.
16. Setelah semua siswa terisi, Guru Mapel menekan tombol **"Kunci & Kirim Data Absensi"** di fixed bottom.
17. Sistem memproses dan menyimpan data presensi ke database (localStorage).
18. Sistem menampilkan alert sukses: "Berhasil! N data presensi telah dikunci dan dikirim."
19. **Postcondition:** Data presensi tersimpan, Guru Piket melihat update real-time.

## Alternative Flow A1 — Memulai dari Menu "Mulai Presensi"

1. Guru Mapel menekan menu "Mulai Presensi" di sidebar.
2. Langsung ke langkah 3 di atas (tanpa melalui dasbor).

## Alternative Flow A2 — Kamera Tidak Tersedia / Ditolak

1. Pada langkah 11, sistem gagal mengakses kamera.
2. Sistem menampilkan pesan: "Kamera tidak dapat diakses. Periksa izin kamera."
3. Guru Mapel tetap dapat mengisi status kehadiran tanpa foto.
4. Tombol "Kunci & Kirim" tetap nonaktif karena belum ada foto validasi.
5. **Postcondition:** Presensi tidak dapat dikirim tanpa minimal 1 foto.

## Alternative Flow A3 — Foto Diambil Ulang

1. Pada langkah 14, Guru Mapel memilih "Ambil Ulang" bukan "Gunakan Foto".
2. Kembali ke langkah 11 untuk mengambil foto baru.

## Exception Flow E1 — Gagal Menyimpan Data

1. Pada langkah 17, sistem gagal menyimpan data.
2. Sistem menampilkan alert error.
3. Data entries tetap ada di form, Guru Mapel dapat mencoba lagi.
4. **Postcondition:** Data tidak hilang, pengguna dapat mengulang submit.

## Acceptance Criteria

- AC1: Guru Mapel dapat memilih kelas dan mapel untuk memulai presensi.
- AC2: Setiap siswa ditampilkan dalam Card Data Siswa dengan radio button H/S/I/A.
- AC3: Kamera dapat diaktifkan untuk mengambil foto wajah siswa.
- AC4: Overlay kamera berubah dari Gold ke Hijau setelah foto diambil.
- AC5: Tombol "Kunci & Kirim" hanya aktif jika minimal 1 foto telah diambil.
- AC6: Data presensi tersimpan dan muncul di dashboard Guru Piket.
- AC7: Counter foto validasi (N/M) ditampilkan di header form.
