import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { useDb } from '../db.js'
import { generateToken } from '../middleware/auth.js'

const router = Router()

router.post('/login', (req, res) => {
  const { username, password, role } = req.body
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Username, password, dan role wajib diisi' })
  }
  const db = useDb()
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND role = ?').get(username.toLowerCase().trim(), role)
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Username / password / role tidak sesuai' })
  }
  const token = generateToken(user)
  const { password: _, ...safe } = user
  res.json({ user: safe, token })
})

export default router
