import { Router } from 'express'
import { useDb } from '../db.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, (req, res) => {
  const db = useDb()
  const { kelasId } = req.query
  let sql = 'SELECT * FROM siswa'
  const params = []
  if (kelasId) { sql += ' WHERE kelasId = ?'; params.push(kelasId) }
  sql += ' ORDER BY id'
  res.json(db.prepare(sql).all(...params))
})

router.post('/', authenticate, authorize('admin'), (req, res) => {
  const { nis, nama, kelasId } = req.body
  if (!nis || !nama || !kelasId) return res.status(400).json({ error: 'Data tidak lengkap' })
  const db = useDb()
  const result = db.prepare('INSERT INTO siswa (nis, nama, kelasId) VALUES (?, ?, ?)').run(nis, nama, kelasId)
  res.status(201).json({ id: result.lastInsertRowid, nis, nama, kelasId })
})

router.put('/:id', authenticate, authorize('admin'), (req, res) => {
  const { nis, nama, kelasId } = req.body
  if (!nis || !nama || !kelasId) return res.status(400).json({ error: 'Data tidak lengkap' })
  const db = useDb()
  db.prepare('UPDATE siswa SET nis=?, nama=?, kelasId=? WHERE id=?').run(nis, nama, kelasId, req.params.id)
  res.json({ id: Number(req.params.id), nis, nama, kelasId })
})

router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  const db = useDb()
  db.prepare('DELETE FROM siswa WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

export default router
