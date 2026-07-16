import { Router } from 'express'
import { useDb, persistDb } from '../db.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.post('/', authenticate, (req, res) => {
  try {
    const { tingkat, kelasId, mapelId, entries } = req.body
    if (!tingkat || !kelasId || !mapelId || !entries?.length) {
      return res.status(400).json({ status: 'error', message: 'Data tidak lengkap' })
    }
    const db = useDb()
    const now = new Date()
    const tanggal = now.toISOString().split('T')[0]
    const jam = now.toTimeString().split(' ')[0]
    const sql = 'INSERT INTO presensi (tanggal, jam, tingkat, kelasId, mapelId, siswaId, status, foto, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'

    db.execRaw('BEGIN TRANSACTION')
    try {
      for (const e of entries) {
        db.runRaw(sql, [tanggal, jam, tingkat, kelasId, mapelId, e.siswaId, e.status, e.foto || null, req.user.id])
      }
      db.execRaw('COMMIT')
      persistDb()
    } catch (e) {
      db.execRaw('ROLLBACK')
      throw e
    }

    const records = entries.map(e => ({
      tanggal, jam, tingkat, kelasId, mapelId, siswaId: e.siswaId, status: e.status, foto: e.foto || null, userId: req.user.id
    }))

    if (req.app.get('io')) {
      req.app.get('io').emit('presensi:baru', { kelasId, mapelId, tingkat, records, userId: req.user.id })
    }

    res.status(201).json({ status: 'success', data: { count: entries.length } })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.get('/', authenticate, (req, res) => {
  try {
    const db = useDb()
    const { tanggal, kelasId, mapelId, tingkat } = req.query
    let sql = 'SELECT p.*, s.nama as namaSiswa, s.nis as nisSiswa, m.nama as namaMapel, k.nama as namaKelas FROM presensi p LEFT JOIN siswa s ON p.siswaId = s.id LEFT JOIN mapel m ON p.mapelId = m.id LEFT JOIN kelas k ON p.kelasId = k.id WHERE 1=1'
    const params = []
    if (tanggal) { sql += ' AND p.tanggal = ?'; params.push(tanggal) }
    if (kelasId) { sql += ' AND p.kelasId = ?'; params.push(kelasId) }
    if (mapelId) { sql += ' AND p.mapelId = ?'; params.push(mapelId) }
    if (tingkat) { sql += ' AND p.tingkat = ?'; params.push(tingkat) }
    sql += ' ORDER BY p.id DESC'
    const data = db.prepare(sql).all(...params)
    res.json({ status: 'success', data })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.get('/foto', authenticate, (req, res) => {
  try {
    const db = useDb()
    const { tanggal, kelasId } = req.query
    let sql = `SELECT p.id, p.tanggal, p.jam, p.status, p.foto, p.kelasId, p.mapelId, p.siswaId,
      s.nama as namaSiswa, s.nis as nisSiswa, m.nama as namaMapel, k.nama as namaKelas
      FROM presensi p
      LEFT JOIN siswa s ON p.siswaId = s.id
      LEFT JOIN mapel m ON p.mapelId = m.id
      LEFT JOIN kelas k ON p.kelasId = k.id
      WHERE p.foto IS NOT NULL`
    const params = []
    if (tanggal) { sql += ' AND p.tanggal = ?'; params.push(tanggal) }
    if (kelasId) { sql += ' AND p.kelasId = ?'; params.push(kelasId) }
    sql += ' ORDER BY p.id DESC'
    const data = db.prepare(sql).all(...params)
    res.json({ status: 'success', data })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

export default router
