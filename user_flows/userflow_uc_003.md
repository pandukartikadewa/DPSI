# UC-003: Rekapitulasi Otomatis Terpusat

**Aktor:** Guru Piket
**Halaman:** `/guru-piket`
**Pemicu:** Guru Piket ingin memantau keterisian absensi seluruh kelas secara real-time.

## Main Flow

1. Sistem menampilkan halaman Monitoring Real-Time.
2. Sistem menampilkan 5 stat card: Hadir, Sakit, Izin, Alpa, Belum Presensi (total seluruh kelas).
3. Sistem menampilkan tabel rekap per kelas: Kelas, Total Siswa, Hadir, Sakit, Izin, Alpa, Belum, Mata Pelajaran.
4. Sistem melakukan auto-refresh data setiap 10 detik.
5. Waktu update terakhir ditampilkan di pojok kanan atas.
6. **Postcondition:** Guru Piket melihat data presensi terkini seluruh kelas.

## Alternative Flow A1 — Data Kosong

1. Belum ada data presensi yang dicatat hari ini.
2. Tabel menampilkan baris kosong dengan pesan "Belum ada data presensi hari ini".
3. Semua stat card bernilai 0.
4. **Postcondition:** Guru Piket mengetahui bahwa belum ada presensi.

## Alternative Flow A2 — Data Bertambah Real-Time

1. Saat Guru Piket sedang melihat dashboard, Guru Mapel mengirim presensi baru.
2. Auto-refresh (10 detik) menangkap data baru.
3. Stat card dan tabel otomatis terupdate.
4. **Postcondition:** Data di dashboard selalu sinkron dengan database.

## Exit Point

- Guru Piket dapat menekan menu "Log Validasi Bukti" untuk review foto.
- Guru Piket dapat menekan menu "Cetak Rekap Harian" untuk ekspor data.

## Acceptance Criteria

- AC1: Stat card menampilkan total akumulasi seluruh kelas.
- AC2: Tabel rekap menampilkan breakdown per kelas.
- AC3: Data auto-refresh maksimal setiap 10 detik.
- AC4: Waktu update terakhir ditampilkan.
- AC5: Jika data kosong, pesan empty state ditampilkan.
