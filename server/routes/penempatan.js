import { Router } from 'express'
import { useDb, getTahunAjaran } from '../db.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, (req, res) => {
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
  res.json(db.prepare(sql).all(...params))
})

router.get('/saya', authenticate, (req, res) => {
  const db = useDb()
  const tahun = getTahunAjaran()
  const data = db.prepare(`SELECT p.*, m.nama as namaMapel, k.nama as namaKelas
    FROM penempatan_guru p
    LEFT JOIN mapel m ON p.mapelId = m.id
    LEFT JOIN kelas k ON p.kelasId = k.id
    WHERE p.guruId = ? AND p.tahunAjaran = ?
    ORDER BY k.nama`).all(req.user.id, tahun)
  res.json(data)
})

router.get('/tahun-ajaran', authenticate, (req, res) => {
  const db = useDb()
  const tahun = db.prepare('SELECT DISTINCT tahunAjaran FROM penempatan_guru ORDER BY tahunAjaran DESC').all()
  const current = getTahunAjaran()
  res.json({ current, list: tahun.map(t => t.tahunAjaran) })
})

router.post('/', authenticate, authorize('admin'), (req, res) => {
  const { guruId, mapelId, kelasId, tahunAjaran } = req.body
  if (!guruId || !mapelId || !kelasId || !tahunAjaran) {
    return res.status(400).json({ error: 'Data tidak lengkap' })
  }
  const db = useDb()
  try {
    const result = db.prepare('INSERT INTO penempatan_guru (guruId, mapelId, kelasId, tahunAjaran) VALUES (?, ?, ?, ?)').run(guruId, mapelId, kelasId, tahunAjaran)
    const inserted = db.prepare(`SELECT p.*, u.name as namaGuru, m.nama as namaMapel, k.nama as namaKelas
      FROM penempatan_guru p
      LEFT JOIN users u ON p.guruId = u.id
      LEFT JOIN mapel m ON p.mapelId = m.id
      LEFT JOIN kelas k ON p.kelasId = k.id
      WHERE p.id = ?`).get(result.lastInsertRowid)
    res.status(201).json(inserted)
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'Penempatan sudah ada' })
    throw err
  }
})

router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  const db = useDb()
  db.prepare('DELETE FROM penempatan_guru WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

export default router
