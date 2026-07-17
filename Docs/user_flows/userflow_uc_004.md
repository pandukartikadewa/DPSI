# UC-004: Kelola Data Siswa & Kelas

**Aktor:** Admin
**Halaman:** `/admin/siswa`
**Pemicu:** Admin ingin mengelola data siswa dan pembagian kelas.

## Main Flow — Tambah Siswa Baru

1. Admin membuka halaman `/admin/siswa`.
2. Sistem menampilkan dua tab: "Data Siswa" (default) dan "Data Kelas".
3. Admin melihat form tambah siswa: NIS, Nama, Kelas (dropdown).
4. Admin mengisi NIS, Nama, memilih Kelas dari dropdown.
5. Admin menekan tombol "Tambah".
6. Sistem menyimpan data siswa baru ke database.
7. Tabel daftar siswa langsung terupdate.
8. Form dikosongkan kembali.
9. **Postcondition:** Data siswa baru tersimpan.

## Main Flow — Edit Siswa

1. Admin menekan tombol "Edit" pada baris siswa yang ingin diubah.
2. Form terisi dengan data siswa tersebut. Tombol berubah menjadi "Simpan".
3. Admin mengubah data dan menekan "Simpan".
4. Sistem menyimpan perubahan.
5. **Postcondition:** Data siswa terupdate.

## Main Flow — Hapus Siswa

1. Admin menekan tombol "Hapus" pada baris siswa.
2. Sistem menampilkan konfirmasi: "Hapus siswa ini?"
3. Admin menekan "OK".
4. Sistem menghapus data siswa.
5. Tabel terupdate.
6. **Postcondition:** Data siswa terhapus.

## Alternative Flow A1 — Tab Data Kelas

1. Admin menekan tab "Data Kelas".
2. Sistem menampilkan form tambah kelas: ID Kelas, Tingkat, Nama Kelas.
3. Flow CRUD sama seperti Data Siswa.
4. **Postcondition:** Data kelas tersimpan.

## Exception Flow E1 — Duplicate ID Kelas

1. Admin mencoba menambah kelas dengan ID yang sudah ada.
2. Sistem menampilkan alert: "ID kelas sudah ada".
3. Data tidak tersimpan.
4. **Postcondition:** Tidak ada perubahan data.

## Acceptance Criteria

- AC1: Admin dapat menambah, mengedit, dan menghapus data siswa.
- AC2: Admin dapat menambah, mengedit, dan menghapus data kelas.
- AC3: Form memiliki validasi field wajib (NIS, Nama, Kelas).
- AC4: Konfirmasi muncul sebelum menghapus data.
- AC5: Tabel selalu menampilkan data terkini setelah operasi CRUD.
