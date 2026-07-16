const API = import.meta.env.VITE_API_URL || '/api'

export function setToken(token) {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}

export function getToken() {
  return localStorage.getItem('token') || null
}

export function clearAuth() {
  localStorage.removeItem('token')
  localStorage.removeItem('absensi_user')
  sessionStorage.removeItem('absensi_user')
}

async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  const opts = { method, headers }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(`${API}${path}`, opts)
  if (res.status === 401) {
    const data = await res.json().catch(() => ({}))
    clearAuth()
    window.location.href = '/login'
    throw new Error(data.message || 'Sesi habis, silakan login ulang')
  }
  let json
  try { json = await res.json() } catch { json = null }
  if (!json) {
    const text = await res.text().catch(() => '')
    console.error(`[API] Non-JSON response ${method} ${path} ${res.status}:`, text.slice(0, 300))
    throw new Error(res.status === 500
      ? 'Server error (500) — Pastikan backend sedang berjalan'
      : `Server returned ${res.status} ${res.statusText}`)
  }
  if (!res.ok) throw new Error(json.message || json.error || `Request failed (${res.status})`)
  if (json && typeof json === 'object' && json.status === 'success' && 'data' in json) return json.data
  return json
}

function get(path) { return request('GET', path) }
function post(path, body) { return request('POST', path, body) }
function put(path, body) { return request('PUT', path, body) }
function del(path) { return request('DELETE', path) }

export async function login(username, password, role) {
  const data = await post('/auth/login', { username, password, role })
  if (data.token) setToken(data.token)
  return { ...data.user, token: data.token }
}

export async function fetchKelas() { return get('/kelas') }
export async function saveKelasList(list) {
  const existing = await get('/kelas')
  const newItems = list.filter(l => !existing.some(e => e.id === l.id))
  for (const k of newItems) await post('/kelas', { id: k.id, tingkat: k.tingkat, nama: k.nama })
  return get('/kelas')
}

export async function fetchMapel() { return get('/mapel') }
export async function saveMapelList(list) {
  const existing = await get('/mapel')
  for (const m of list) {
    const found = existing.find(e => e.nama === m.nama)
    if (found) await put(`/mapel/${found.id}`, { nama: m.nama })
    else await post('/mapel', { nama: m.nama })
  }
  return get('/mapel')
}

export async function fetchSiswa(params) {
  const q = params?.kelasId ? `?kelasId=${params.kelasId}` : ''
  return get(`/siswa${q}`)
}
export async function saveSiswaList(list) {
  const existing = await get('/siswa')
  for (const s of list) {
    const found = existing.find(e => e.id === s.id)
    if (found) {
      await put(`/siswa/${s.id}`, { nis: s.nis, nama: s.nama, kelasId: s.kelasId })
    } else {
      await post('/siswa', { nis: s.nis, nama: s.nama, kelasId: s.kelasId })
    }
  }
  return get('/siswa')
}

export async function fetchUsers() { return get('/users') }
export async function saveUserList(list) {
  const existing = await get('/users')
  for (const u of list) {
    const found = existing.find(e => e.id === u.id)
    if (found) {
      await put(`/users/${u.id}`, { name: u.name, role: u.role, mapel: u.mapel, waliKelas: u.waliKelas, password: u.password || undefined })
    } else {
      await post('/users', u)
    }
  }
  return get('/users')
}

export async function submitPresensi(tingkat, kelasId, mapelId, entries) {
  return post('/presensi', { tingkat, kelasId, mapelId, entries })
}

export async function fetchPresensi(params = {}) {
  const q = new URLSearchParams()
  if (params.tanggal) q.set('tanggal', params.tanggal)
  if (params.kelasId) q.set('kelasId', params.kelasId)
  if (params.mapelId) q.set('mapelId', params.mapelId)
  if (params.tingkat) q.set('tingkat', params.tingkat)
  return get(`/presensi?${q.toString()}`)
}

export async function fetchRekapKelas() { return get('/rekap/kelas') }

export async function fetchRekapSiswa(kelasId, startDate, endDate) {
  const q = new URLSearchParams()
  if (startDate) q.set('startDate', startDate)
  if (endDate) q.set('endDate', endDate)
  return get(`/rekap/siswa/${kelasId}?${q.toString()}`)
}

export async function fetchStatistikKelas(kelasId) {
  return get(`/rekap/statistik/${kelasId}`)
}

export async function fetchPresensiWithFoto(params = {}) {
  const q = new URLSearchParams()
  if (params.tanggal) q.set('tanggal', params.tanggal)
  if (params.kelasId) q.set('kelasId', params.kelasId)
  return get(`/presensi/foto?${q.toString()}`)
}

export async function fetchPenempatan(tahunAjaran) {
  const q = new URLSearchParams()
  if (tahunAjaran) q.set('tahunAjaran', tahunAjaran)
  return get(`/penempatan?${q.toString()}`)
}

export async function fetchPenempatanSaya() {
  return get('/penempatan/saya')
}

export async function fetchTahunAjaran() {
  return get('/penempatan/tahun-ajaran')
}

export async function createPenempatan(data) {
  return post('/penempatan', data)
}

export async function updatePenempatanJadwal(id, data) {
  return put(`/penempatan/${id}`, data)
}

export async function deletePenempatan(id) {
  return del(`/penempatan/${id}`)
}

export async function updateWaliKelas(kelasId) {
  return put('/auth/wali-kelas', { waliKelas: kelasId })
}
