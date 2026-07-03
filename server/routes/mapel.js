import { Router } from 'express'
import { useDb } from '../db.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, (req, res) => {
  const db = useDb()
  res.json(db.prepare('SELECT * FROM mapel ORDER BY id').all())
})

router.post('/', authenticate, authorize('admin'), (req, res) => {
  const { nama } = req.body
  if (!nama) return res.status(400).json({ error: 'Nama mapel wajib diisi' })
  const db = useDb()
  const result = db.prepare('INSERT INTO mapel (nama) VALUES (?)').run(nama)
  res.status(201).json({ id: result.lastInsertRowid, nama })
})

router.put('/:id', authenticate, authorize('admin'), (req, res) => {
  const { nama } = req.body
  if (!nama) return res.status(400).json({ error: 'Nama mapel wajib diisi' })
  const db = useDb()
  db.prepare('UPDATE mapel SET nama = ? WHERE id = ?').run(nama, req.params.id)
  res.json({ id: Number(req.params.id), nama })
})

router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  const db = useDb()
  db.prepare('DELETE FROM mapel WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

export default router
