# UC-005: Kelola Akun & Mata Pelajaran

**Aktor:** Admin
**Halaman:** `/admin` (Akun Pengguna), `/admin/kurikulum` (Mata Pelajaran)
**Pemicu:** Admin ingin mengelola akun pengguna atau daftar mata pelajaran.

## Main Flow — Tambah Akun Pengguna

1. Admin membuka halaman `/admin`.
2. Sistem menampilkan form tambah akun: Username, Password, Nama Lengkap, Role.
3. Jika Role "Guru Mapel" dipilih, muncul dropdown Mata Pelajaran.
4. Jika Role "Wali Kelas" dipilih, muncul dropdown Kelas Binaan.
5. Admin mengisi data dan menekan "Tambah".
6. Sistem validasi: username unik, password tidak kosong.
7. Sistem menyimpan akun baru (password disimpan dalam bentuk teks untuk prototipe).
8. Tabel daftar akun terupdate.
9. **Postcondition:** Akun baru dapat digunakan untuk login.

## Main Flow — Edit Akun Pengguna

1. Admin menekan "Edit" pada baris akun.
2. Form terisi, password dikosongkan (tidak diubah jika tidak diisi).
3. Admin mengubah data, menekan "Simpan".
4. **Postcondition:** Data akun terupdate.

## Main Flow — Hapus Akun Pengguna

1. Admin menekan "Hapus", konfirmasi muncul.
2. Admin konfirmasi, akun dihapus.
3. **Postcondition:** Akun tidak bisa digunakan login lagi.

## Main Flow — Kelola Mata Pelajaran

1. Admin membuka halaman `/admin/kurikulum`.
2. Sistem menampilkan form dan tabel mata pelajaran.
3. Admin dapat tambah, edit, hapus mata pelajaran.
4. **Postcondition:** Daftar mapel tersimpan.

## Exception Flow E1 — Username Duplicate

1. Admin mencoba tambah akun dengan username yang sudah ada.
2. Sistem alert: "Username sudah ada".
3. **Postcondition:** Akun tidak tersimpan.

## Acceptance Criteria

- AC1: Admin dapat CRUD akun pengguna (Admin, Guru Mapel, Guru Piket, Wali Kelas).
- AC2: Field tambahan (Mapel / Kelas Binaan) muncul sesuai role yang dipilih.
- AC3: Username bersifat unik.
- AC4: Admin dapat CRUD mata pelajaran di halaman `/admin/kurikulum`.
