import { Router } from 'express'
import { useDb } from '../db.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, (req, res) => {
  const db = useDb()
  res.json(db.prepare('SELECT * FROM kelas ORDER BY nama').all())
})

router.post('/', authenticate, authorize('admin'), (req, res) => {
  const { id, tingkat, nama } = req.body
  if (!id || !tingkat || !nama) return res.status(400).json({ error: 'Data tidak lengkap' })
  const db = useDb()
  db.prepare('INSERT INTO kelas (id, tingkat, nama) VALUES (?, ?, ?)').run(id, tingkat, nama)
  res.status(201).json({ id, tingkat, nama })
})

router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  const db = useDb()
  db.prepare('DELETE FROM kelas WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

export default router
