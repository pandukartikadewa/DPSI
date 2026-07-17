# System Logic Specifications

Document Version: v1.0

Project: Sistem Absensi Digital MTsN 1 Yogyakarta

Product: Web-Based Attendance Management System

Status: Draft

Last Updated: 2026-07-09

Author: System Analyst AI

---

## 1. PURPOSE

Dokumen ini menjadi master index untuk seluruh System Logic Specification pada Sistem Absensi Digital MTsN 1 Yogyakarta.

Setiap System Logic memuat sequence diagram dan API contract yang diturunkan dari User Flow terkait.

---

## 2. FILE STRUCTURE

```text
system_logics/
├── index.md
├── sys_uc_001.md
├── sys_uc_002.md
├── sys_uc_003.md
├── sys_uc_004.md
├── sys_uc_005.md
└── sys_uc_006.md
```

---

## 3. SYSTEM LOGIC CATALOG

| Use Case ID | Use Case Name | Aktor | File Path | Status |
| --- | --- | --- | --- | --- |
| UC-001 | Login & Manajemen Sesi | Semua Pengguna | ./sys_uc_001.md | Draft |
| UC-002 | Pencatatan Presensi & Validasi Foto | Guru Mapel | ./sys_uc_002.md | Draft |
| UC-003 | Rekapitulasi Otomatis Terpusat | Guru Piket | ./sys_uc_003.md | Draft |
| UC-004 | Kelola Data Siswa & Kelas | Admin | ./sys_uc_004.md | Draft |
| UC-005 | Kelola Akun & Mata Pelajaran | Admin | ./sys_uc_005.md | Draft |
| UC-006 | Pelaporan & Filter Laporan Akhir | Wali Kelas | ./sys_uc_006.md | Draft |

---

## 4. USER FLOW → SYSTEM LOGIC MAPPING

| User Flow | System Logic | Description |
| --- | --- | --- |
| userflow_uc_001.md | sys_uc_001.md | Alur autentikasi, penyimpanan sesi, dan logout |
| userflow_uc_002.md | sys_uc_002.md | Alur pencatatan presensi, validasi foto kamera, dan penguncian data |
| userflow_uc_003.md | sys_uc_003.md | Alur monitoring real-time rekapitulasi seluruh kelas |
| userflow_uc_004.md | sys_uc_004.md | Alur CRUD data siswa dan data kelas |
| userflow_uc_005.md | sys_uc_005.md | Alur CRUD akun pengguna dan mata pelajaran |
| userflow_uc_006.md | sys_uc_006.md | Alur dasbor kelas binaan, filter laporan, dan ekspor CSV/PDF |

---

## 5. API OVERVIEW

### Base URL

```text
/api/v1
```

### Authentication

Seluruh endpoint (kecuali login) memerlukan Bearer token pada header Authorization:

```text
Authorization: Bearer <session_token>
```

Token disimpan di sisi klien melalui `sessionStorage` setelah login berhasil (lihat sys_uc_001.md).

### Common Response Format

```json
{
  "success": true,
  "data": {},
  "message": "Success",
  "errors": []
}
```

### HTTP Status Codes

| Code | Description |
| --- | --- |
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 404 | Not Found |
| 409 | Conflict (duplikasi data) |
| 500 | Internal Server Error |

### Role & Endpoint Access Summary

| Role | Halaman Utama | Endpoint Utama |
| --- | --- | --- |
| Semua Pengguna | /login | /auth/login, /auth/logout, /auth/me |
| Guru Mapel | /guru-mapel, /guru-mapel/presensi/{kelasId} | /schedules/me, /classes/{id}/students, /attendance, /attendance/photo |
| Guru Piket | /guru-piket | /reports/realtime |
| Admin | /admin/siswa, /admin, /admin/kurikulum | /students, /classes, /accounts, /subjects |
| Wali Kelas | /wali-kelas, /wali-kelas/laporan | /homeroom/dashboard, /classes/homeroom, /reports/attendance, /reports/attendance/export |

---

## 6. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-07-09 | System Analyst AI | Initial Draft berdasarkan userflow_uc_001 s.d. userflow_uc_006 |
