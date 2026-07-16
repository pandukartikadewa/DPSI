import { Router } from 'express'
import { useDb } from '../db.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, (req, res) => {
  try {
    const db = useDb()
    const data = db.prepare('SELECT * FROM mapel ORDER BY nama').all()
    res.json({ status: 'success', data })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.post('/', authenticate, authorize('admin'), (req, res) => {
  try {
    const { nama } = req.body
    if (!nama) return res.status(400).json({ status: 'error', message: 'Nama mapel wajib diisi' })
    const db = useDb()
    const result = db.prepare('INSERT INTO mapel (nama) VALUES (?)').run(nama)
    const data = db.prepare('SELECT * FROM mapel WHERE id = ?').get(result.lastInsertRowid)
    res.status(201).json({ status: 'success', data })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.put('/:id', authenticate, authorize('admin'), (req, res) => {
  try {
    const { nama } = req.body
    if (!nama) return res.status(400).json({ status: 'error', message: 'Nama mapel wajib diisi' })
    const db = useDb()
    db.prepare('UPDATE mapel SET nama=? WHERE id=?').run(nama, req.params.id)
    const data = db.prepare('SELECT * FROM mapel WHERE id = ?').get(req.params.id)
    if (!data) return res.status(404).json({ status: 'error', message: 'Mapel tidak ditemukan' })
    res.json({ status: 'success', data })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  try {
    const db = useDb()
    db.prepare('DELETE FROM mapel WHERE id = ?').run(req.params.id)
    res.json({ status: 'success', data: { id: Number(req.params.id) } })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

export default router
