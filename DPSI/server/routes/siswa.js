import { Router } from 'express'
import { useDb } from '../db.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, (req, res) => {
  try {
    const db = useDb()
    const { kelasId } = req.query
    let sql = 'SELECT * FROM siswa'
    const params = []
    if (kelasId) { sql += ' WHERE kelasId = ?'; params.push(kelasId) }
    sql += ' ORDER BY id'
    const data = db.prepare(sql).all(...params)
    res.json({ status: 'success', data })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.post('/', authenticate, authorize('admin'), (req, res) => {
  try {
    const { nis, nama, kelasId } = req.body
    if (!nis || !nama || !kelasId) return res.status(400).json({ status: 'error', message: 'Data tidak lengkap' })
    const db = useDb()
    const result = db.prepare('INSERT INTO siswa (nis, nama, kelasId) VALUES (?, ?, ?)').run(nis, nama, kelasId)
    const data = db.prepare('SELECT * FROM siswa WHERE id = ?').get(result.lastInsertRowid)
    res.status(201).json({ status: 'success', data })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.put('/:id', authenticate, authorize('admin'), (req, res) => {
  try {
    const { nis, nama, kelasId } = req.body
    if (!nis || !nama || !kelasId) return res.status(400).json({ status: 'error', message: 'Data tidak lengkap' })
    const db = useDb()
    db.prepare('UPDATE siswa SET nis=?, nama=?, kelasId=? WHERE id=?').run(nis, nama, kelasId, req.params.id)
    const data = db.prepare('SELECT * FROM siswa WHERE id = ?').get(req.params.id)
    if (!data) return res.status(404).json({ status: 'error', message: 'Siswa tidak ditemukan' })
    res.json({ status: 'success', data })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  try {
    const db = useDb()
    db.prepare('DELETE FROM siswa WHERE id = ?').run(req.params.id)
    res.json({ status: 'success', data: { id: Number(req.params.id) } })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

export default router
