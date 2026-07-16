PART 3: Design System (Sistem Desain)
Sistem Desain ini dikembangkan berdasarkan karakteristik formal institusi MTsN 1 Yogyakarta (di bawah naungan Kementerian Agama RI) yang bernuansa islami, edukatif, dan profesional, sekaligus dirancang ergonomis agar para guru nyaman menggunakannya setiap hari.

3.1 Aturan Warna (Color Palette)
Kategori Warna	Kode Hex	Implementasi Antarmuka	Filosofi Desain
Primary Green	#005A36	Warna utama pada Header, bilah navigasi atas, dan tombol utama aplikasi.	Representasi warna hijau khas Madrasah Tsanawiyah dan Kementerian Agama yang melambangkan pertumbuhan, kedamaian, dan nilai Islami.
Secondary Gold	#D4AF37	Digunakan untuk aksen, warna border aktif, ikon penting, dan garis pembatas card.	Mengacu pada warna emas resmi pada komponen logo MTsN Yogyakarta yang melambangkan prestasi tinggi, kemuliaan, dan kualitas edukasi.
Status Gold (Warning)	#F59E0B	Label indikator untuk status siswa yang berhalangan dengan keterangan "Izin" atau "Sakit".	Warna kuning/oranye yang memberikan tanda perhatian tanpa kesan darurat.
Status Red (Danger)	#DC2626	Digunakan untuk indikator status "Alpa" atau peringatan kegagalan validasi wajah (Face Mis-match).	Warna merah tegas untuk menarik perhatian guru terhadap ketidakhadiran tanpa keterangan atau error perangkat.
Status Green (Success)	#10B981	Digunakan untuk indikator status "Hadir" dan tanda kotak pemandu kamera (bounding box) ketika wajah sukses terverifikasi.	Warna hijau cerah yang memberikan konfirmasi kepastian dan keberhasilan proses.
Neutral Background	#F8FAFC	Warna latar belakang seluruh halaman aplikasi.	Putih abu-abu lembut (off-white) yang bertujuan mengurangi kelelahan pada mata (eye strain) guru saat memeriksa daftar siswa yang panjang.
3.2 Tipografi (Typography)
Aplikasi ini menggunakan jenis huruf (font) tunggal yang memiliki tingkat keterbacaan (readability) tinggi pada berbagai resolusi layar gawai:

Font Family: Inter atau Plus Jakarta Sans (Sans-Serif).

Heading 1 (Judul Halaman Utama): 22px, Bold, Warna Deep Charcoal (#1E293B).

Heading 2 (Nama Kelas/Sub-Seksi): 16px, Semi-Bold, Warna Primary Green (#005A36).

Body Text (Nama Siswa & NIS): 14px, Regular, Warna Dark Slate (#334155).

Micro Text (Label Status / Keterangan Waktu): 11px, Medium, Warna kontras (Putih #FFFFFF di atas latar warna status).

3.3 Komponen Antarmuka Khusus (UI Components)
Card Data Siswa:
Komponen persegi panjang dengan sudut melengkung (border-radius: 8px) berwarna latar putih bersih. Sisi kiri menampilkan foto profil kecil siswa, nama lengkap, dan NIS. Sisi kanan memuat baris tombol opsi lingkaran (radio buttons) horizontal untuk pilihan H, I, S, dan A secara ringkas.

Jendela Kamera & Overlay Face Recognition:
Komponen penangkap gambar berbentuk kotak dengan sudut membulat (viewfinder) atau lingkaran di bagian tengah bawah form presensi. Komponen ini memiliki overlay garis putus-putus berbentuk oval di dalamnya sebagai panduan bagi posisi wajah siswa. Ketika algoritma face recognition mendeteksi wajah manusia secara benar, garis putus-putus tersebut otomatis berubah warna dari Secondary Gold (#D4AF37) menjadi Status Green (#10B981).

Tombol Aksi Utama (Action Button):
Tombol "Kirim Absensi" diposisikan menetap di area bawah layar (fixed bottom navigation). Berukuran besar (full-width mobile padding), menggunakan warna dasar Primary Green (#005A36) dengan teks putih tebal. Tombol ini hanya akan aktif (enabled) apabila Guru Mapel telah melengkapi input kehadiran dan minimal mengambil satu foto validasi kelas sebagai lampiran berkas penunjang.

PART 4: Penyesuaian Struktur Class Data (SOT Class Diagram)
Untuk merealisasikan fitur penangkapan kamera dan validasi face recognition ke dalam arsitektur kode program yang telah direncanakan di dokumen Class Diagram asli Anda, struktur Class Absensi diperluas dengan menambahkan atribut dan metode operasi (method) sebagai berikut:

Atribut Tambahan pada Class Absensi:

fotoBukti: String (Menyimpan path direktori lokal atau URL penyimpanan cloud tempat file gambar wajah hasil jepretan kamera disimpan).

isVerified: Boolean (Menyimpan status boolean true/false apakah wajah yang difoto lolos verifikasi pencocokan wajah atau berhasil tersimpan sebagai bukti absensi).

Method Tambahan pada Class Absensi:

bukaKamera(): Void (Fungsi untuk memicu API internal sistem operasi gawai guna menyalakan kamera depan/belakang perangkat).

validasiWajah(foto: String): Boolean (Fungsi/prosedur yang memproses ekstraksi fitur gambar wajah yang diambil lalu mencocokkannya dengan templat wajah siswa pada data master untuk mengonfirmasi keabsahan data sebelum disimpan ke database).