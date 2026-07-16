import { Router } from 'express'
import { useDb } from '../db.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, (req, res) => {
  try {
    const db = useDb()
    const data = db.prepare('SELECT * FROM kelas ORDER BY nama').all()
    res.json({ status: 'success', data })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.post('/', authenticate, authorize('admin'), (req, res) => {
  try {
    const { nama, tingkat } = req.body
    if (!nama || !tingkat) return res.status(400).json({ status: 'error', message: 'Data tidak lengkap' })
    const db = useDb()
    const id = tingkat + nama
    db.runRaw('INSERT INTO kelas (id, tingkat, nama) VALUES (?, ?, ?)', [id, tingkat, nama])
    const data = db.prepare('SELECT * FROM kelas WHERE id = ?').get(id)
    res.status(201).json({ status: 'success', data })
  } catch (error) {
    console.log(error)
    if (error.message.includes('UNIQUE')) return res.status(400).json({ status: 'error', message: 'Kelas sudah ada' })
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.put('/:id', authenticate, authorize('admin'), (req, res) => {
  try {
    const { nama, tingkat } = req.body
    if (!nama || !tingkat) return res.status(400).json({ status: 'error', message: 'Data tidak lengkap' })
    const db = useDb()
    db.runRaw('UPDATE kelas SET tingkat=?, nama=? WHERE id=?', [tingkat, nama, req.params.id])
    const data = db.prepare('SELECT * FROM kelas WHERE id = ?').get(req.params.id)
    if (!data) return res.status(404).json({ status: 'error', message: 'Kelas tidak ditemukan' })
    res.json({ status: 'success', data })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  try {
    const db = useDb()
    db.prepare('DELETE FROM kelas WHERE id = ?').run(req.params.id)
    res.json({ status: 'success', data: { id: Number(req.params.id) } })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

export default router
