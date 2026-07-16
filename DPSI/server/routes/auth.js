import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { useDb } from '../db.js'
import { generateToken } from '../middleware/auth.js'

const JWT_SECRET = process.env.JWT_SECRET || 'absensi-secret-key-2026'

const router = Router()

router.post('/login', (req, res) => {
  try {
    const { username, password, role } = req.body
    if (!username || !password || !role) {
      return res.status(400).json({ status: 'error', message: 'Username, password, dan role wajib diisi' })
    }
    const db = useDb()
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND role = ?').get(username.toLowerCase().trim(), role)
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ status: 'error', message: 'Username / password / role tidak sesuai' })
    }
    const token = generateToken(user)
    const { password: _, ...safe } = user
    res.json({ status: 'success', data: { user: safe, token } })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.put('/wali-kelas', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ status: 'error', message: 'Unauthorized' })
    let decoded
    try { decoded = jwt.verify(token, JWT_SECRET) } catch { return res.status(401).json({ status: 'error', message: 'Token invalid' }) }
    if (decoded.role !== 'wali_kelas') return res.status(403).json({ status: 'error', message: 'Hanya wali kelas' })
    const { waliKelas } = req.body
    if (!waliKelas) return res.status(400).json({ status: 'error', message: 'Kelas wajib diisi' })
    const db = useDb()
    db.runRaw('UPDATE users SET waliKelas=? WHERE id=?', [waliKelas, decoded.id])
    res.json({ status: 'success', data: { waliKelas } })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

export default router
