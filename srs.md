PART 1: Software Requirements Specification (SRS)
1.1 Pendahuluan
Dokumen SRS ini mendefinisikan spesifikasi kebutuhan perangkat lunak untuk Sistem Absensi Digital MTsN 1 Yogyakarta. Berdasarkan analisis masalah dari dokumen Fase 1, aplikasi absensi lama sering mengalami error teknis sehingga para guru harus kembali menggunakan metode manual (pencatatan spreadsheet dan pelaporan via grup WhatsApp). Proses manual ini mengakibatkan keterlambatan rekapitulasi data harian oleh Guru Piket, risiko tinggi duplikasi data, kesalahan pencatatan, serta ketidakefisienan saat Wali Kelas membutuhkan data presensi yang akurat untuk laporan akhir pembagian rapor. Sistem baru ini dirancang terintegrasi penuh guna menyelesaikan permasalahan tersebut secara digital, mutakhir, dan transparan.

1.2 Deskripsi Umum Sistem
Sistem Absensi Digital MTsN 1 Yogyakarta memfasilitasi tiga aktor utama yang diidentifikasi dari hasil wawancara dengan pihak administrasi madrasah (Bapak Atok):

Guru Mata Pelajaran (Mapel): Melakukan pencatatan kehadiran siswa secara langsung di setiap jam pelajaran/pertemuan.

Guru Piket: Memantau keterisian absensi harian dari seluruh kelas secara terpusat dan melakukan rekapitulasi otomatis.

Wali Kelas: Memantau statistik kehadiran kelas binaannya serta mencetak laporan periodik sebagai lampiran buku rapor.

Sebagai tambahan kendali mutu (validasi objektif), sistem ini ditambahkan Modul Kamera/Validasi Foto (Face Recognition Sederhana). Fitur ini mewajibkan pengambilan sampel foto wajah siswa saat absensi diproses untuk mengonfirmasi kehadiran fisik secara valid dan mencegah manipulasi data.

1.3 Kebutuhan Fungsional (Functional Requirements)
FR-01 (Autentikasi & Manajemen Sesi):
Sistem harus mampu memvalidasi login pengguna dengan mencocokkan username, password, dan role (Guru Mapel, Guru Piket, Wali Kelas, Admin). Sistem harus membatasi hak akses menu sesuai dengan role tersebut.

FR-02 (Pencatatan Presensi & Aktivasi Modul Kamera):
Sistem harus menyediakan menu bagi Guru Mapel untuk memilih Tingkat Kelas, Ruang Kelas, dan Mata Pelajaran yang diampu, serta menampilkan daftar siswa di kelas tersebut.

FR-03 (Validasi Foto / Face Recognition Sederhana):
Sistem harus dapat mengaktifkan kamera internal perangkat (smartphone/tablet) untuk menangkap foto wajah siswa. Sistem akan memproses pencocokan wajah (face matching) dengan basis data foto profil siswa, atau minimal menyimpan foto tersebut ke peladen (server) sebagai berkas bukti digital kehadiran yang sah.

FR-04 (Rekapitulasi Otomatis Terpusat):
Sistem harus secara otomatis merangkum dan memperbarui (real-time) status kehadiran siswa (Hadir, Sakit, Izin, Alpa) ke dalam dasbor Guru Piket sesaat setelah Guru Mapel menekan tombol kirim data, tanpa memerlukan media kirim pihak ketiga (grup chat).

FR-05 (Manajemen Data Master):
Sistem harus mampu mengelola data murid (NIS, Nama), relasi kelas (setiap kelas memiliki banyak siswa), data mata pelajaran, dan data akun pengguna (User).

FR-06 (Pelaporan & Filter Laporan Akhir):
Sistem harus memfasilitasi Wali Kelas untuk melihat ringkasan grafik kehadiran per siswa atau per kelas, melakukan filter berdasarkan rentang rentang tanggal/periode tertentu, serta mengekspor data ke format PDF/Excel untuk kebutuhan dokumen pembagian rapor.

1.4 Kebutuhan Non-Fungsional (Non-Functional Requirements)
Security (Keamanan):
Semua transmisi data, termasuk kredensial login dan berkas foto wajah (image payload), wajib dilindungi menggunakan enkripsi protokol HTTPS (SSL/TLS). Atribut kata sandi pengguna di dalam basis data harus dienkripsi satu arah menggunakan algoritma aman (misal: BCrypt).

Reliability (Keandalan):
Sistem harus menangani alokasi memori saat modul kamera aktif agar tidak terjadi crash atau freeze pada perangkat berspesifikasi rendah/menengah milik guru, memastikan tingkat ketersediaan (availability) sistem minimal 99.5% pada jam operasional sekolah (06.30 - 16.00 WIB).

Performance (Performa):
Waktu respons sistem untuk mengunggah satu berkas foto validasi beserta data status absensi sekelompok siswa ke peladen tidak boleh melebihi 3 detik pada kondisi jaringan internet standar (3G/4G).