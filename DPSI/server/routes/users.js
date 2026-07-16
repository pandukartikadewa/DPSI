import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { useDb } from '../db.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, (req, res) => {
  try {
    const db = useDb()
    const data = db.prepare('SELECT id, username, name, role, mapel, waliKelas, createdAt FROM users').all()
    res.json({ status: 'success', data })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.post('/', authenticate, authorize('admin'), (req, res) => {
  try {
    const { username, password, name, role, mapel, waliKelas } = req.body
    if (!username || !password || !name || !role) {
      return res.status(400).json({ status: 'error', message: 'Data tidak lengkap' })
    }
    const db = useDb()
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
    if (existing) return res.status(400).json({ status: 'error', message: 'Username sudah ada' })
    const hash = bcrypt.hashSync(password, 10)
    const result = db.prepare('INSERT INTO users (username, password, name, role, mapel, waliKelas) VALUES (?, ?, ?, ?, ?, ?)').run(username, hash, name, role, mapel || null, waliKelas || null)
    const user = db.prepare('SELECT id, username, name, role, mapel, waliKelas, createdAt FROM users WHERE id = ?').get(result.lastInsertRowid)
    res.status(201).json({ status: 'success', data: user })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.put('/:id', authenticate, authorize('admin'), (req, res) => {
  try {
    const { id } = req.params
    const { password, name, role, mapel, waliKelas } = req.body
    const db = useDb()
    const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
    if (!existing) return res.status(404).json({ status: 'error', message: 'User tidak ditemukan' })
    let hash = existing.password
    if (password) hash = bcrypt.hashSync(password, 10)
    db.prepare('UPDATE users SET password=?, name=?, role=?, mapel=?, waliKelas=? WHERE id=?')
      .run(hash, name || existing.name, role || existing.role, mapel || null, waliKelas || null, id)
    const user = db.prepare('SELECT id, username, name, role, mapel, waliKelas, createdAt FROM users WHERE id = ?').get(id)
    res.json({ status: 'success', data: user })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  try {
    const db = useDb()
    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id)
    res.json({ status: 'success', data: { id: Number(req.params.id) } })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

export default router
