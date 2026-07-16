import { Router } from 'express'
import { useDb } from '../db.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.get('/kelas', authenticate, (req, res) => {
  try {
    const db = useDb()
    const today = new Date().toISOString().split('T')[0]
    const kelas = db.prepare('SELECT * FROM kelas ORDER BY nama').all()
    const siswa = db.prepare('SELECT * FROM siswa').all()
    const presensiHariIni = db.prepare('SELECT * FROM presensi WHERE tanggal = ?').all(today)
    const mapel = db.prepare('SELECT * FROM mapel').all()

    const result = kelas.map(k => {
      const siswaKelas = siswa.filter(s => s.kelasId === k.id)
      const presensiKelas = presensiHariIni.filter(p => siswaKelas.some(s => s.id === p.siswaId))
      const mapelTerisi = [...new Set(presensiKelas.map(p => {
        const m = mapel.find(mm => mm.id === p.mapelId)
        return m ? m.nama : '-'
      }))]
      return {
        kelasId: k.id,
        namaKelas: k.nama,
        totalSiswa: siswaKelas.length,
        hadir: presensiKelas.filter(p => p.status === 'Hadir').length,
        sakit: presensiKelas.filter(p => p.status === 'Sakit').length,
        izin: presensiKelas.filter(p => p.status === 'Izin').length,
        alpa: presensiKelas.filter(p => p.status === 'Alpa').length,
        belum: siswaKelas.length - presensiKelas.length,
        mataPelajaran: mapelTerisi,
      }
    })
    res.json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.get('/siswa/:kelasId', authenticate, (req, res) => {
  try {
    const db = useDb()
    const { kelasId } = req.params
    const { startDate, endDate } = req.query
    let sql = 'SELECT * FROM presensi WHERE kelasId = ?'
    const params = [kelasId]
    if (startDate) { sql += ' AND tanggal >= ?'; params.push(startDate) }
    if (endDate) { sql += ' AND tanggal <= ?'; params.push(endDate) }
    const presensi = db.prepare(sql).all(...params)
    const siswa = db.prepare('SELECT * FROM siswa WHERE kelasId = ?').all(kelasId)

    const grouped = {}
    presensi.forEach(p => {
      if (!grouped[p.siswaId]) grouped[p.siswaId] = { siswaId: p.siswaId, hadir: 0, sakit: 0, izin: 0, alpa: 0, total: 0 }
      grouped[p.siswaId][p.status.toLowerCase()]++
      grouped[p.siswaId].total++
    })

    const result = Object.values(grouped).map(g => {
      const s = siswa.find(s => s.id === g.siswaId)
      return { ...g, nama: s ? s.nama : '-', nis: s ? s.nis : '-' }
    })
    res.json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.get('/statistik/:kelasId', authenticate, (req, res) => {
  try {
    const db = useDb()
    const { kelasId } = req.params
    const presensi = db.prepare('SELECT * FROM presensi WHERE kelasId = ?').all(kelasId)
    const siswa = db.prepare('SELECT * FROM siswa WHERE kelasId = ?').all(kelasId)

    const grouped = {}
    presensi.forEach(p => {
      if (!grouped[p.siswaId]) grouped[p.siswaId] = { siswaId: p.siswaId, hadir: 0, sakit: 0, izin: 0, alpa: 0, total: 0 }
      grouped[p.siswaId][p.status.toLowerCase()]++
      grouped[p.siswaId].total++
    })

    const totalHari = [...new Set(presensi.map(p => p.tanggal))].length || 1

    const perSiswa = Object.values(grouped).map(g => {
      const s = siswa.find(s => s.id === g.siswaId)
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

    res.json({ status: 'success', data: { totalHadir, totalSakit, totalIzin, totalAlpa, totalSemua, pctHadir, totalHari, perSiswa, palingAlpa, palingSakit } })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

export default router
