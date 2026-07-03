import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { getDb } from './db.js'

import authRoute from './routes/auth.js'
import usersRoute from './routes/users.js'
import kelasRoute from './routes/kelas.js'
import mapelRoute from './routes/mapel.js'
import siswaRoute from './routes/siswa.js'
import presensiRoute from './routes/presensi.js'
import rekapRoute from './routes/rekap.js'
import penempatanRoute from './routes/penempatan.js'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
})

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

app.set('io', io)

app.use('/api/auth', authRoute)
app.use('/api/users', usersRoute)
app.use('/api/kelas', kelasRoute)
app.use('/api/mapel', mapelRoute)
app.use('/api/siswa', siswaRoute)
app.use('/api/presensi', presensiRoute)
app.use('/api/rekap', rekapRoute)
app.use('/api/penempatan', penempatanRoute)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
  })
})

const PORT = process.env.PORT || 5000

getDb().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Absensi Backend running on http://localhost:${PORT}`)
  })
}).catch(err => {
  console.error('Failed to initialize database:', err)
  process.exit(1)
})
