# System Logic: UC-002 Pencatatan Presensi & Validasi Foto

Document Version: v1.0

Use Case ID: UC-002

Use Case Name: Pencatatan Presensi & Validasi Foto

Status: Draft

Last Updated: 2026-07-09

Author: System Analyst AI

---

## 1. Overview

Dokumen ini mendefinisikan system logic untuk alur Guru Mapel dalam mencatat kehadiran siswa, termasuk pemilihan kelas/mapel, pengisian status kehadiran (H/S/I/A), pengambilan foto bukti kehadiran melalui kamera, hingga penguncian dan pengiriman data presensi.

---

## 2. Sequence Diagram

### 2.1 Muat Dasbor & Pilih Kelas

```mermaid
sequenceDiagram
    actor GuruMapel
    participant Frontend
    participant API
    participant Database

    GuruMapel->>Frontend: Navigate to /guru-mapel
    Frontend->>API: GET /api/v1/schedules/me
    API->>Database: SELECT jadwal WHERE guru_id = :id AND hari = today
    Database-->>API: Jadwal kelas hari ini
    API-->>Frontend: 200 OK + jadwal
    Frontend-->>GuruMapel: Tampilkan grid jadwal kelas + aktivitas terakhir

    GuruMapel->>Frontend: Klik kelas (misal "7A")
    Frontend->>Frontend: Redirect ke /guru-mapel/presensi?kelas=7A&tingkat=7

    Frontend->>API: GET /api/v1/subjects?tingkat=7
    API->>Database: SELECT mata_pelajaran WHERE tingkat = 7
    Database-->>API: Daftar mapel
    API-->>Frontend: 200 OK + daftar mapel
    Frontend-->>GuruMapel: Tampilkan dropdown Tingkat, Ruang Kelas, Mata Pelajaran

    GuruMapel->>Frontend: Pilih Mata Pelajaran
    GuruMapel->>Frontend: Klik "Lanjut ke Form Presensi"
    Frontend->>Frontend: Redirect ke /guru-mapel/presensi/{kelasId}?mapel={id}&tingkat={tingkat}
```

### 2.2 Muat Form Presensi

```mermaid
sequenceDiagram
    actor GuruMapel
    participant Frontend
    participant API
    participant Database

    Frontend->>API: GET /api/v1/classes/{kelasId}/students
    API->>Database: SELECT siswa WHERE kelas_id = :kelasId ORDER BY nama
    Database-->>API: Daftar siswa

    Frontend->>API: GET /api/v1/attendance/session?kelasId={kelasId}&mapelId={mapelId}&date=today
    API->>Database: Cek apakah sesi presensi sudah pernah dibuat hari ini
    Database-->>API: Status sesi (baru/lanjutan)

    API-->>Frontend: 200 OK + daftar siswa + status kehadiran default (Hadir)
    Frontend-->>GuruMapel: Tampilkan Card Data Siswa (foto placeholder, nama, NIS, radio H/S/I/A, tombol Foto)
```

### 2.3 Ambil Foto Bukti Kehadiran

```mermaid
sequenceDiagram
    actor GuruMapel
    participant Frontend
    participant Camera
    participant API
    participant Storage

    GuruMapel->>Frontend: Atur status kehadiran (radio H/S/I/A) untuk siswa
    GuruMapel->>Frontend: Klik tombol "Foto" pada Card Siswa
    Frontend->>Camera: Request akses kamera (getUserMedia)

    alt Kamera tersedia
        Camera-->>Frontend: Stream video aktif
        Frontend-->>GuruMapel: Tampilkan overlay dashed oval (Gold #D4AF37)

        GuruMapel->>Frontend: Arahkan kamera ke wajah, klik "Ambil Foto"
        Frontend->>Frontend: Capture frame ke gambar (base64/blob)
        Frontend-->>GuruMapel: Overlay berubah Hijau (#10B981) + "Foto berhasil disimpan sebagai bukti"

        alt Gunakan Foto
            GuruMapel->>Frontend: Klik "Gunakan Foto"
            Frontend->>API: POST /api/v1/attendance/photo
            API->>Storage: Simpan file foto sementara
            Storage-->>API: photo_url
            API-->>Frontend: 201 Created + photo_url
            Frontend->>Frontend: Set thumbnail bulat + border hijau pada Card Siswa
            Frontend->>Frontend: Increment counter foto validasi (N/M)
        else Ambil Ulang
            GuruMapel->>Frontend: Klik "Ambil Ulang"
            Frontend->>Frontend: Buang capture sebelumnya, kembali ke live preview
        end
    else Kamera gagal diakses
        Camera-->>Frontend: Permission denied / error
        Frontend-->>GuruMapel: "Kamera tidak dapat diakses. Periksa izin kamera."
        Frontend->>Frontend: GuruMapel tetap dapat mengisi status kehadiran tanpa foto
    end
```

### 2.4 Kunci & Kirim Data Absensi

```mermaid
sequenceDiagram
    actor GuruMapel
    participant Frontend
    participant API
    participant Database

    GuruMapel->>Frontend: Klik "Kunci & Kirim Data Absensi"
    Frontend->>Frontend: Validasi minimal 1 foto validasi telah diambil

    alt Minimal 1 foto tersedia
        Frontend->>API: POST /api/v1/attendance

        API->>Database: BEGIN TRANSACTION
        API->>Database: INSERT attendance_session (kelas, mapel, guru, tanggal, status=locked)
        API->>Database: INSERT attendance_detail per siswa (status H/S/I/A, photo_url)
        API->>Database: COMMIT

        API-->>Frontend: 201 Created + ringkasan presensi
        Frontend-->>GuruMapel: Alert "Berhasil! N data presensi telah dikunci dan dikirim."
        Frontend->>Frontend: Redirect/reset ke dasbor Guru Mapel
    else Belum ada foto
        Frontend-->>GuruMapel: Tombol "Kunci & Kirim" tetap nonaktif
    end
```

---

## 3. API Contract

### 3.1 GET /api/v1/schedules/me

Mengambil jadwal kelas milik Guru Mapel yang sedang login untuk hari ini.

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "jadwal": [
      {
        "kelas_id": "7A",
        "tingkat": 7,
        "mata_pelajaran": "Matematika",
        "jam_ke": "3-4",
        "status_presensi": "belum_diisi"
      }
    ],
    "aktivitas_terakhir": [
      {
        "kelas_id": "7A",
        "waktu": "2026-07-09T08:15:00Z",
        "jumlah_siswa": 32
      }
    ]
  },
  "message": "Success"
}
```

---

### 3.2 GET /api/v1/classes/{kelasId}/students

Mengambil daftar siswa dalam satu kelas beserta status kehadiran default untuk sesi presensi.

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "kelas_id": "7A",
    "students": [
      {
        "id": 101,
        "nis": "2026001",
        "nama": "Ahmad Fauzi",
        "foto_profil": null,
        "status_kehadiran": "H",
        "photo_url": null
      }
    ],
    "total": 32
  },
  "message": "Success"
}
```

---

### 3.3 GET /api/v1/attendance/session

Mengecek apakah sesi presensi untuk kombinasi kelas, mapel, dan tanggal tertentu sudah pernah dibuat (mencegah duplikasi kunci).

**Query Parameters:**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| kelasId | string | Yes | ID kelas |
| mapelId | integer | Yes | ID mata pelajaran |
| date | string | No | Format YYYY-MM-DD (default: hari ini) |

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "exists": false,
    "status": "belum_dikunci"
  },
  "message": "Success"
}
```

---

### 3.4 POST /api/v1/attendance/photo

Mengunggah foto bukti kehadiran untuk satu siswa (dipanggil saat Guru Mapel menekan "Gunakan Foto").

**Request Body:**

```json
{
  "student_id": 101,
  "image_base64": "data:image/jpeg;base64,..."
}
```

**Success Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "student_id": 101,
    "photo_url": "/uploads/attendance/2026-07-09/101.jpg",
    "captured_at": "2026-07-09T08:20:00Z"
  },
  "message": "Foto berhasil disimpan sebagai bukti"
}
```

**Error Response (400 Bad Request):**

```json
{
  "success": false,
  "data": null,
  "message": "Format gambar tidak valid",
  "errors": []
}
```

---

### 3.5 POST /api/v1/attendance

Mengunci dan mengirim seluruh data presensi kelas untuk mata pelajaran dan tanggal tertentu.

**Request Body:**

```json
{
  "kelas_id": "7A",
  "mapel_id": 4,
  "tanggal": "2026-07-09",
  "entries": [
    {
      "student_id": 101,
      "status": "H",
      "photo_url": "/uploads/attendance/2026-07-09/101.jpg"
    },
    {
      "student_id": 102,
      "status": "S",
      "photo_url": null
    }
  ]
}
```

**Success Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "session_id": 5501,
    "kelas_id": "7A",
    "mapel_id": 4,
    "tanggal": "2026-07-09",
    "total_siswa": 32,
    "rekap": {
      "hadir": 28,
      "sakit": 2,
      "izin": 1,
      "alpa": 1
    },
    "locked_at": "2026-07-09T08:25:00Z"
  },
  "message": "Berhasil! 32 data presensi telah dikunci dan dikirim."
}
```

**Error Response (400 Bad Request - Foto Kurang):**

```json
{
  "success": false,
  "data": null,
  "message": "Minimal 1 foto validasi diperlukan sebelum mengunci presensi",
  "errors": []
}
```

**Error Response (409 Conflict - Sudah Dikunci):**

```json
{
  "success": false,
  "data": null,
  "message": "Presensi untuk kelas dan mata pelajaran ini sudah dikunci hari ini",
  "errors": []
}
```

**Error Response (500 Internal Server Error):**

```json
{
  "success": false,
  "data": null,
  "message": "Gagal menyimpan data presensi. Silakan coba lagi.",
  "errors": []
}
```

---

## 4. Business Rules

| Rule | Description |
| --- | --- |
| BR-001 | Status kehadiran default setiap siswa adalah "Hadir" (H) sebelum diubah |
| BR-002 | Tombol "Kunci & Kirim Data Absensi" hanya aktif jika minimal 1 foto validasi telah diambil dalam sesi tersebut |
| BR-003 | Jika kamera tidak dapat diakses, Guru Mapel tetap dapat mengisi status kehadiran tanpa foto, namun tidak dapat mengunci presensi |
| BR-004 | Satu kombinasi kelas + mata pelajaran + tanggal hanya dapat dikunci satu kali |
| BR-005 | Data presensi yang gagal disimpan (error server) tidak menghapus entri yang sudah diisi di form, Guru Mapel dapat mencoba submit ulang |
| BR-006 | Counter foto validasi (N/M) ditampilkan di header form dan diperbarui setiap kali foto berhasil digunakan |

---

## 5. Traceability

| User Flow | Requirement | API Endpoints |
| --- | --- | --- |
| userflow_uc_002.md | AC1, AC2 | GET /api/v1/schedules/me, GET /api/v1/classes/{kelasId}/students |
| userflow_uc_002.md | AC3, AC4, AC7 | POST /api/v1/attendance/photo |
| userflow_uc_002.md | AC5, AC6 | POST /api/v1/attendance |
