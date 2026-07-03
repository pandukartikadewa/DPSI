import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { useDb } from '../db.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, (req, res) => {
  const db = useDb()
  const users = db.prepare('SELECT id, username, name, role, mapel, waliKelas, createdAt FROM users').all()
  res.json(users)
})

router.post('/', authenticate, authorize('admin'), (req, res) => {
  const { username, password, name, role, mapel, waliKelas } = req.body
  if (!username || !password || !name || !role) {
    return res.status(400).json({ error: 'Data tidak lengkap' })
  }
  const db = useDb()
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
  if (existing) return res.status(400).json({ error: 'Username sudah ada' })
  const hash = bcrypt.hashSync(password, 10)
  const result = db.prepare('INSERT INTO users (username, password, name, role, mapel, waliKelas) VALUES (?, ?, ?, ?, ?, ?)').run(username, hash, name, role, mapel || null, waliKelas || null)
  const user = db.prepare('SELECT id, username, name, role, mapel, waliKelas, createdAt FROM users WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(user)
})

router.put('/:id', authenticate, authorize('admin'), (req, res) => {
  const { id } = req.params
  const { password, name, role, mapel, waliKelas } = req.body
  const db = useDb()
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
  if (!existing) return res.status(404).json({ error: 'User tidak ditemukan' })
  let hash = existing.password
  if (password) hash = bcrypt.hashSync(password, 10)
  db.prepare('UPDATE users SET password=?, name=?, role=?, mapel=?, waliKelas=? WHERE id=?')
    .run(hash, name || existing.name, role || existing.role, mapel || null, waliKelas || null, id)
  const user = db.prepare('SELECT id, username, name, role, mapel, waliKelas, createdAt FROM users WHERE id = ?').get(id)
  res.json(user)
})

router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  const db = useDb()
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

export default router
