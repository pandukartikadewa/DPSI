import {
  getUsers, saveUsers,
  getKelas, saveKelas,
  getMapel, saveMapel,
  getSiswa, saveSiswa,
  getPresensi, savePresensi,
} from '../data/mockData'

function delay(ms = 300) {
  return new Promise(r => setTimeout(r, ms))
}

/* ---- AUTH (FR-01) — with Role selection per IA ---- */
export async function login(username, password, role) {
  await delay()
  const users = getUsers()
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase().trim() && u.password === password && u.role === role)
  if (!user) throw new Error('Username / password / role tidak sesuai')
  const { password: _, ...safe } = user
  return safe
}

/* ---- MASTER DATA (FR-05) ---- */
export async function fetchKelas() { await delay(); return getKelas() }
export async function saveKelasList(list) { await delay(); saveKelas(list); return list }

export async function fetchMapel() { await delay(); return getMapel() }
export async function saveMapelList(list) { await delay(); saveMapel(list); return list }

export async function fetchSiswa() { await delay(); return getSiswa() }
export async function saveSiswaList(list) { await delay(); saveSiswa(list); return list }

export async function fetchUsers() { await delay(); return getUsers() }
export async function saveUserList(list) { await delay(); saveUsers(list); return list }

/* ---- PRESENSI (FR-02 / FR-03) ---- */
export async function submitPresensi(tingkat, kelasId, mapelId, entries) {
  await delay(800)
  const all = getPresensi()
  const now = new Date().toISOString()
  const records = entries.map(e => ({
    id: Date.now() + Math.random(),
    tanggal: now.split('T')[0],
    jam: now.split('T')[1].slice(0, 8),
    tingkat,
    kelasId,
    mapelId,
    siswaId: e.siswaId,
    status: e.status,
    foto: e.foto || null,
    timestamp: now,
  }))
  savePresensi([...all, ...records])
  return { success: true, count: records.length }
}

export async function fetchPresensi(params = {}) {
  await delay()
  let data = getPresensi()
  if (params.tanggal) data = data.filter(d => d.tanggal === params.tanggal)
  if (params.kelasId) data = data.filter(d => d.kelasId === params.kelasId)
  if (params.mapelId) data = data.filter(d => d.mapelId === params.mapelId)
  if (params.tingkat) data = data.filter(d => d.tingkat === params.tingkat)
  return data
}

export async function fetchRekapKelas() {
  await delay()
  const presensi = getPresensi()
  const siswa = getSiswa()
  const kelas = getKelas()
  const mapel = getMapel()
  const today = new Date().toISOString().split('T')[0]
  const hariIni = presensi.filter(p => p.tanggal === today)
  return kelas.map(k => {
    const siswaKelas = siswa.filter(s => s.kelasId === k.id)
    const presensiKelas = hariIni.filter(p => siswaKelas.some(s => s.id === p.siswaId))
    return {
      kelasId: k.id,
      namaKelas: k.nama,
      totalSiswa: siswaKelas.length,
      hadir: presensiKelas.filter(p => p.status === 'Hadir').length,
      sakit: presensiKelas.filter(p => p.status === 'Sakit').length,
      izin: presensiKelas.filter(p => p.status === 'Izin').length,
      alpa: presensiKelas.filter(p => p.status === 'Alpa').length,
      belum: siswaKelas.length - presensiKelas.length,
      mataPelajaran: [...new Set(presensiKelas.map(p => {
        const m = mapel.find(mm => mm.id === p.mapelId)
        return m ? m.nama : '-'
      }))],
    }
  })
}

export async function fetchRekapSiswa(kelasId, startDate, endDate) {
  await delay()
  const presensi = getPresensi()
  const siswa = getSiswa()
  let data = presensi
  if (kelasId) data = data.filter(p => p.kelasId === kelasId)
  if (startDate) data = data.filter(p => p.tanggal >= startDate)
  if (endDate) data = data.filter(p => p.tanggal <= endDate)
  const grouped = {}
  data.forEach(p => {
    if (!grouped[p.siswaId]) grouped[p.siswaId] = { siswaId: p.siswaId, hadir: 0, sakit: 0, izin: 0, alpa: 0, total: 0 }
    grouped[p.siswaId][p.status.toLowerCase()]++
    grouped[p.siswaId].total++
  })
  return Object.values(grouped).map(g => {
    const s = siswa.find(s => s.id === g.siswaId)
    return { ...g, nama: s ? s.nama : '-', nis: s ? s.nis : '-' }
  })
}

export async function fetchStatistikKelas(kelasId) {
  await delay()
  const presensi = getPresensi()
  const siswa = getSiswa()
  let data = presensi
  if (kelasId) data = data.filter(p => p.kelasId === kelasId)

  const grouped = {}
  data.forEach(p => {
    if (!grouped[p.siswaId]) grouped[p.siswaId] = { siswaId: p.siswaId, hadir: 0, sakit: 0, izin: 0, alpa: 0, total: 0 }
    grouped[p.siswaId][p.status.toLowerCase()]++
    grouped[p.siswaId].total++
  })

  const siswaKelas = siswa.filter(s => s.kelasId === kelasId)
  const totalHari = [...new Set(data.map(p => p.tanggal))].length || 1

  const perSiswa = Object.values(grouped).map(g => {
    const s = siswaKelas.find(s => s.id === g.siswaId)
    return { ...g, nama: s ? s.nama : '-', nis: s ? s.nis : '-' }
  })

  const totalHadir = perSiswa.reduce((a, b) => a + b.hadir, 0)
  const totalSakit = perSiswa.reduce((a, b) => a + b.sakit, 0)
  const totalIzin = perSiswa.reduce((a, b) => a + b.izin, 0)
  const totalAlpa = perSiswa.reduce((a, b) => a + b.alpa, 0)
  const totalSemua = totalHadir + totalSakit + totalIzin + totalAlpa
  const pctHadir = totalSemua > 0 ? Math.round((totalHadir / totalSemua) * 100) : 0

  const palingAlpa = [...perSiswa].sort((a, b) => b.alpa - a.alpa).slice(0, 5)
  const palingSakit = [...perSiswa].sort((a, b) => b.sakit - a.sakit).slice(0, 5)

  return { totalHadir, totalSakit, totalIzin, totalAlpa, totalSemua, pctHadir, totalHari, perSiswa, palingAlpa, palingSakit }
}

export async function fetchPresensiWithFoto(params = {}) {
  await delay()
  let data = getPresensi()
  if (params.tanggal) data = data.filter(d => d.tanggal === params.tanggal)
  if (params.kelasId) data = data.filter(d => d.kelasId === params.kelasId)
  const siswa = getSiswa()
  const mapel = getMapel()
  const kelas = getKelas()
  return data.reverse().map(p => ({
    ...p,
    namaSiswa: siswa.find(s => s.id === p.siswaId)?.nama || '-',
    nisSiswa: siswa.find(s => s.id === p.siswaId)?.nis || '-',
    namaMapel: mapel.find(m => m.id === p.mapelId)?.nama || '-',
    namaKelas: kelas.find(k => k.id === p.kelasId)?.nama || p.kelasId,
  }))
}
