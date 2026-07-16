import { Router } from 'express'
import { useDb, getTahunAjaran } from '../db.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, (req, res) => {
  try {
    const db = useDb()
    const { tahunAjaran, guruId } = req.query
    let sql = `SELECT p.*, u.name as namaGuru, u.username, m.nama as namaMapel, k.nama as namaKelas
      FROM penempatan_guru p
      LEFT JOIN users u ON p.guruId = u.id
      LEFT JOIN mapel m ON p.mapelId = m.id
      LEFT JOIN kelas k ON p.kelasId = k.id
      WHERE 1=1`
    const params = []
    if (tahunAjaran) { sql += ' AND p.tahunAjaran = ?'; params.push(tahunAjaran) }
    if (guruId) { sql += ' AND p.guruId = ?'; params.push(guruId) }
    sql += ' ORDER BY p.tahunAjaran DESC, k.nama, m.nama'
    const data = db.prepare(sql).all(...params)
    res.json({ status: 'success', data })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.get('/saya', authenticate, (req, res) => {
  try {
    const db = useDb()
    const tahun = getTahunAjaran()
    const data = db.prepare(`SELECT p.*, m.nama as namaMapel, k.nama as namaKelas
      FROM penempatan_guru p
      LEFT JOIN mapel m ON p.mapelId = m.id
      LEFT JOIN kelas k ON p.kelasId = k.id
      WHERE p.guruId = ? AND p.tahunAjaran = ?
      ORDER BY k.nama`).all(req.user.id, tahun)
    res.json({ status: 'success', data })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.get('/tahun-ajaran', authenticate, (req, res) => {
  try {
    const db = useDb()
    const tahun = db.prepare('SELECT DISTINCT tahunAjaran FROM penempatan_guru ORDER BY tahunAjaran DESC').all()
    const current = getTahunAjaran()
    res.json({ status: 'success', data: { current, list: tahun.map(t => t.tahunAjaran) } })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.post('/', authenticate, authorize('admin'), (req, res) => {
  try {
    const { guruId, mapelId, kelasId, tahunAjaran } = req.body
    if (!guruId || !mapelId || !kelasId || !tahunAjaran) {
      return res.status(400).json({ status: 'error', message: 'Data tidak lengkap' })
    }
    const db = useDb()
    const result = db.prepare('INSERT INTO penempatan_guru (guruId, mapelId, kelasId, tahunAjaran) VALUES (?, ?, ?, ?)').run(guruId, mapelId, kelasId, tahunAjaran)
    const data = db.prepare(`SELECT p.*, u.name as namaGuru, m.nama as namaMapel, k.nama as namaKelas
      FROM penempatan_guru p
      LEFT JOIN users u ON p.guruId = u.id
      LEFT JOIN mapel m ON p.mapelId = m.id
      LEFT JOIN kelas k ON p.kelasId = k.id
      WHERE p.id = ?`).get(result.lastInsertRowid)
    res.status(201).json({ status: 'success', data })
  } catch (error) {
    console.log(error)
    if (error.message.includes('UNIQUE')) return res.status(400).json({ status: 'error', message: 'Penempatan sudah ada' })
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.put('/:id', authenticate, authorize('admin'), (req, res) => {
  try {
    const { hari, jamMulai, jamSelesai } = req.body
    const db = useDb()
    const existing = db.prepare('SELECT * FROM penempatan_guru WHERE id = ?').get(req.params.id)
    if (!existing) return res.status(404).json({ status: 'error', message: 'Penempatan tidak ditemukan' })
    db.runRaw('UPDATE penempatan_guru SET hari=?, jamMulai=?, jamSelesai=? WHERE id=?',
      [hari || null, jamMulai || null, jamSelesai || null, req.params.id])
    const data = db.prepare(`SELECT p.*, u.name as namaGuru, m.nama as namaMapel, k.nama as namaKelas
      FROM penempatan_guru p
      LEFT JOIN users u ON p.guruId = u.id
      LEFT JOIN mapel m ON p.mapelId = m.id
      LEFT JOIN kelas k ON p.kelasId = k.id
      WHERE p.id = ?`).get(req.params.id)
    res.json({ status: 'success', data })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  try {
    const db = useDb()
    db.prepare('DELETE FROM penempatan_guru WHERE id = ?').run(req.params.id)
    res.json({ status: 'success', data: { id: Number(req.params.id) } })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

export default router
