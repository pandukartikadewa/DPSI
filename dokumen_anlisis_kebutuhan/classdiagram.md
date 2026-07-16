LAPORAN  CLASS DIAGRAM 
ANALISIS KEBUTUHAN  MTSN 1 YOGYAKARTA



Disusun oleh : 
Kesya Aletta Arizona (2400016051)
M.Raihan Najwa (2400016052)
Pandu Kartika Dewa (2400016053)
Moh Dzikry Pradana (2300016137)
Jhoyce Augusthia Rhaffael (2300016157)

       

PROGRAM STUDI SISTEM INFORMASI
FAKULTAS SAINS & TEKNOLOGI TERAPAN
UNIVERSITAS AHMAD DAHLAN
YOGYAKARTA
2026




A.     Studi Kasus
Judul Studi Kasus: Sistem Absensi MTSN 1 Yogyakarta
 
Deskripsi Singkat Sistem:
Sistem Absensi MTsN 1 Yogyakarta merupakan sistem informasi yang digunakan untuk membantu proses pencatatan dan pengelolaan kehadiran siswa secara digital. Sistem ini dibuat untuk mengatasi permasalahan absensi manual yang sebelumnya dilakukan menggunakan spreadsheet dan grup komunikasi sehingga sering terjadi keterlambatan rekap data, kesalahan pencatatan, dan duplikasi data.
Sistem ini memungkinkan guru mata pelajaran untuk menginput absensi siswa secara langsung pada setiap pertemuan. Data absensi kemudian dapat diakses oleh guru piket untuk direkap secara otomatis dan terpusat. Selain itu, wali kelas dapat memantau rekap kehadiran siswa dan mencetak laporan absensi yang digunakan sebagai bahan laporan akademik atau pembagian rapor.
 
B.     Identifikasi Class
No
Nama Class
Deskripsi
1
 User 
Menyimpan data pengguna sistem seperti guru mapel, guru piket, dan wali kelas 
2
 Siswa 
Menyimpan data siswa yang mengikuti absensi 
3
 Kelas 
menyimpan data kelas siswa
4
 Absensi 
Menyimpan data kehadiran siswa  
5
 Laporan 
Mengelola laporan rekap absensi siswa 

 
 
C.     Detail Class
1.      Class: user
 
Atribut
       No
Nama Atribut
Tipe Data
Keterangan
1
idUser  
String  
ID pengguna  
2
namaUser 
String  
Nama pengguna  
3
username 
String  
Username login 
4 
password 
String 
Password login 
5
role 
String 
Hak akses pengguna 

 
Method
No
Nama Method
Keterangan
1
login()  
Proses login pengguna  
2
logout()  
Keluar dari sistem  
3
kelolaData()  
Mengelola data sistem  

 
 
 
 
2.      Class: Siswa 
 
Atribut
No
Nama Atribut
Tipe Data
Keterangan
1
nis  
String  
Nomor induk siswa  
2
namaSiswa  
String  
Nama siswa  
3
jenisKelamin  
String  
Jenis kelamin siswa  
4
alamat 
String 
Alamat siswa 
5
idKelas 
String 
ID kelas siswa 

 
Method
No
Nama Method
Keterangan
1
lihatData()  
       Melihat data siswa  
2
updateData()  
       Mengubah data siswa  
3
lihatAbsensi()  
       Melihat riwayat absensi  

 
3.      Class: Kelas
 
Atribut
No
Nama Atribut
Tipe Data
Keterangan
1
idKelas 
String
ID kelas  
2
namaKelas  
String 
Nama kelas  
3
tingkat  
String 
Tingkatan kelas  
4
waliKelas 
String
Nama wali kelas 

 
Method
No
Nama Method
Keterangan
1
tambahKelas() 
Menambahkan data kelas  
2
ubahKelas()  
Mengubah Kelas data 
3
hapusKelas()  
Menghapus data kelas  

 
 4.  Class: Absensi 


Atribut
No
Nama Atribut
Tipe Data
Keterangan
1
idAbsensi
String
ID absensi 
2
tanggal  
date 
Tanggal absensi  
3
status hadir
String 
Status kehadiran siswa  
4
nis 
String
ID siswa 
5
idUser 
String
ID guru penginput 



Method
No
Nama Method
Keterangan
1
inputAbsensi() 
Menginput absensi siswa 
2
ubahAbsensi() 
Mengubah data absensi 
3
hapusAbsensi()  
Menghapus data absensi 
4
rekapAbsensi() 
Merekap data absensi 


 
 5. Class: Laporan 

Atribut
No
Nama Atribut
Tipe Data
Keterangan
1
idLaporan 
String
ID laporan 
2
periode  
String 
Periode laporan 
3
tanggalCetak 
date
Tanggal cetak laporan  
4
totalHadir 
integer
Jumlah hadir 
5
totalTidakHadir 
integer
Jumlah tidak hadir 



Method
No
Nama Method
Keterangan
1
generateLaporan() 
Membuat laporan absensi 
2
cetakLaporan() 
Mencetak laporan 
3
lihatLaporan() 
Menampilkan laporan 


 
D.     Relasi Antar Class
No
Class 1
Relasi
Class 2
Keterangan
1
User  
Association  
Absensi  
 User menginput data absensi 
2
Siswa
      Association 
Absensi 
Siswa memiliki data absensi  
3
Kelas  
      Association 
Siswa  
Satu kelas memiliki banyak siswa  
4
Absensi 
Association  
      Laporan
Satu kelas memiliki banyak siswa  
5
User 
Association 
Laporan





User dapat melihat laporan




  
 


 
Keterangan:

Class diagram di atas menggambarkan struktur Sistem Absensi MTsN 1 Yogyakarta yang terdiri dari lima class utama yaitu User, Siswa, Kelas, Absensi, dan Laporan. Setiap class memiliki atribut dan method yang digunakan untuk mendukung proses absensi siswa. Relasi antar class menunjukkan hubungan antar data dalam sistem, seperti guru yang menginput absensi, siswa yang memiliki data absensi, serta laporan yang dihasilkan dari data absensi siswa. 
 
 
 
 
 
 
F.      Penjelasan Diagram
 
Tuliskan penjelasan singkat mengenai class diagram yang dibuat.
 
Contoh:
Pada class diagram Sistem Absensi MTsN 1 Yogyakarta, class User digunakan untuk menyimpan data pengguna sistem seperti guru mata pelajaran, guru piket, dan wali kelas. Class Siswa digunakan untuk menyimpan informasi siswa yang mengikuti kegiatan belajar mengajar. Class Kelas menyimpan data kelas dan hubungan siswa dalam setiap kelas.
Class Absensi berfungsi untuk mencatat data kehadiran siswa setiap pertemuan yang diinput oleh guru. Data absensi tersebut kemudian digunakan oleh class Laporan untuk membuat rekapitulasi dan laporan kehadiran siswa. Relasi antar class menunjukkan bahwa satu guru dapat menginput banyak data absensi, satu kelas memiliki banyak siswa, dan data absensi dapat digunakan untuk menghasilkan laporan absensi siswa.

