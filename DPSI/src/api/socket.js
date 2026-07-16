import { io as socketIO } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

let socket = null

export function connectSocket(token) {
  if (socket?.connected) return socket
  socket = socketIO(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
  })
  socket.on('connect', () => console.log('Socket connected'))
  socket.on('connect_error', (err) => console.warn('Socket connection error:', err.message))
  return socket
}

export function getSocket() {
  return socket
}

export function disconnectSocket() {
  if (socket) { socket.disconnect(); socket = null }
}
