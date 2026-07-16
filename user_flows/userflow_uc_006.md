# UC-006: Pelaporan & Filter Laporan Akhir

**Aktor:** Wali Kelas
**Halaman:** `/wali-kelas/laporan`
**Pemicu:** Wali Kelas ingin melihat ringkasan kehadiran kelas binaan dan mengekspor laporan.

## Main Flow

1. Sistem menampilkan halaman Laporan Akademik.
2. Wali Kelas memilih Kelas dari dropdown (terisi otomatis jika memiliki kelas binaan).
3. Wali Kelas memilih **Filter Periode**: Semester Penuh / Bulanan / Tengah Semester / Kustom.
   - "Bulanan" mengisi tanggal awal = 1 bulan ini, akhir = hari ini.
   - "Semester" mengisi tanggal awal = 1 Januari tahun ini, akhir = hari ini.
   - "Kustom" membiarkan input tanggal manual.
4. Wali Kelas dapat mengubah tanggal awal/akhir secara manual.
5. Wali Kelas menekan tombol "Terapkan Filter".
6. Sistem menampilkan **grafik batang (bar chart)** kehadiran per siswa (Hadir, Sakit, Izin, Alpa).
7. Sistem menampilkan **tabel rekap** per siswa: No, NIS, Nama, Hadir, Sakit, Izin, Alpa, Total.
8. Wali Kelas dapat menekan tombol "Ekspor Excel (CSV)" untuk mengunduh file CSV.
9. Wali Kelas dapat menekan tombol "Ekspor & Cetak Laporan" untuk membuka print dialog → PDF.
10. **Postcondition:** Laporan ditampilkan dan/atau diekspor.

## Alternative Flow A1 — Data Kosong

1. Setelah filter, tidak ada data presensi yang cocok.
2. Sistem menampilkan kondisi awal (sebelum filter).
3. **Postcondition:** Wali Kelas mengetahui tidak ada data untuk filter tersebut.

## Alternative Flow A2 — Export CSV

1. Wali Kelas menekan "Ekspor Excel (CSV)".
2. Browser mengunduh file CSV dengan nama `laporan_kehadiran_{kelasId}.csv`.
3. File berisi header: NIS, Nama, Hadir, Sakit, Izin, Alpa, Total.
4. **Postcondition:** File CSV terunduh.

## Alternative Flow A3 — Cetak / PDF

1. Wali Kelas menekan "Ekspor & Cetak Laporan".
2. Tab baru terbuka dengan tampilan print-friendly.
3. Dialog print browser muncul secara otomatis.
4. Wali Kelas dapat memilih "Save as PDF".
5. Setelah print/cancel, tab tertutup otomatis.
6. **Postcondition:** Laporan tercetak atau tersimpan sebagai PDF.

## Dasbor Kelas Binaan (Halaman `/wali-kelas`)

- Sebelum masuk ke Laporan Akademik, Wali Kelas dapat melihat Dasbor Kelas Binaan:
  - Persentase kehadiran total.
  - Total hari presensi.
  - 5 siswa paling sering Alpa.
  - 5 siswa paling sering Sakit.

## Acceptance Criteria

- AC1: Wali Kelas dapat memilih kelas (terisi default jika punya kelas binaan).
- AC2: Filter periode (Semester/Bulanan/Tengah/Kustom) berfungsi dengan benar.
- AC3: Grafik batang menampilkan data per siswa setelah filter diterapkan.
- AC4: Tabel rekap menampilkan breakdown status kehadiran.
- AC5: Export CSV mengunduh file dengan data yang sesuai.
- AC6: Cetak/PDF membuka tab baru dengan tampilan print-friendly.
- AC7: Dasbor menampilkan statistik agregat dan siswa paling alpa/sakit.
