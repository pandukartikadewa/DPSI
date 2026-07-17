# UC-001: Login & Manajemen Sesi

**Aktor:** Semua Pengguna (Guru Mapel, Guru Piket, Wali Kelas, Admin)
**Halaman:** `/login`
**Pemicu:** Pengguna membuka aplikasi dan belum memiliki sesi aktif.

## Main Flow

1. Sistem menampilkan halaman login dengan formulir (Username, Password, Role dropdown).
2. Pengguna memasukkan username dan password.
3. Pengguna memilih Role dari dropdown (Guru Mapel / Guru Piket / Wali Kelas / Admin).
4. Pengguna menekan tombol "Masuk".
5. Sistem memvalidasi kredensial dan role.
6. Sistem menyimpan data sesi pengguna ke `sessionStorage`.
7. Sistem mengalihkan (redirect) ke halaman dashboard sesuai role.
8. **Postcondition:** Pengguna berada di halaman dashboard dengan sidebar navigasi sesuai role.

## Alternative Flow A1 — Kredensial Salah

1. Pada langkah 5, sistem menemukan username/password/role tidak cocok.
2. Sistem menampilkan pesan error: "Username / password / role tidak sesuai".
3. Sistem tetap di halaman login, formulir tidak direset.
4. **Postcondition:** Pengguna tetap di halaman login.

## Alternative Flow A2 — Field Kosong

1. Pengguna menekan "Masuk" tanpa mengisi username atau password.
2. Sistem menampilkan pesan: "Isi username dan password".
3. **Postcondition:** Pengguna tetap di halaman login.

## Alternative Flow A3 — Sesi Sudah Ada

1. Pengguna membuka aplikasi dan `sessionStorage` berisi data sesi valid.
2. Sistem langsung mengalihkan ke dashboard role tanpa menampilkan login.
3. **Postcondition:** Pengguna di halaman dashboard.

## Exception Flow E1 — Server Error

1. Sistem gagal memproses login karena error internal.
2. Sistem menampilkan pesan error umum.
3. **Postcondition:** Pengguna tetap di halaman login.

## Exit Point

- **Logout:** Pengguna menekan tombol "Keluar" di sidebar. Sistem menghapus `sessionStorage` dan mengalihkan ke `/login`.

## Acceptance Criteria

- AC1: Pengguna dapat login dengan kombinasi username, password, dan role yang benar.
- AC2: Sistem menolak login jika username, password, atau role tidak cocok.
- AC3: Setelah login, pengguna diarahkan ke dashboard sesuai role-nya.
- AC4: Session tersimpan hingga pengguna logout atau menutup tab.
- AC5: Sidebar hanya menampilkan menu sesuai role pengguna.
