import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import GuruMapelDashboard from './components/GuruMapelDashboard'
import GuruPresensiPage from './components/GuruPresensiPage'
import GuruPresensiForm from './components/GuruPresensiForm'
import GuruPiketDashboard from './components/GuruPiketDashboard'
import GuruPiketValidasi from './components/GuruPiketValidasi'
import GuruPiketRekap from './components/GuruPiketRekap'
import WaliKelasDashboard from './components/WaliKelasDashboard'
import WaliKelasLaporan from './components/WaliKelasLaporan'
import AdminDashboard from './components/AdminDashboard'
import AdminSiswa from './components/AdminSiswa'
import AdminKurikulum from './components/AdminKurikulum'
import AdminPenempatan from './components/AdminPenempatan'
import { connectSocket, disconnectSocket } from './api/socket'

export default function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const stored = sessionStorage.getItem('absensi_user')
    if (stored) {
      try {
        const u = JSON.parse(stored)
        setUser(u)
        if (u.token) connectSocket(u.token)
      } catch { sessionStorage.removeItem('absensi_user') }
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    sessionStorage.setItem('absensi_user', JSON.stringify(userData))
    if (userData.token) connectSocket(userData.token)
    navigate(getDefaultPath(userData.role))
  }

  const handleLogout = () => {
    setUser(null)
    disconnectSocket()
    sessionStorage.removeItem('absensi_user')
    navigate('/login')
  }

  if (!user || location.pathname === '/login') {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} onLogout={handleLogout} />
      <div className="main-content">
        <Routes>
          <Route path="/guru-mapel" element={<GuruMapelDashboard user={user} />} />
          <Route path="/guru-mapel/presensi" element={<GuruPresensiPage user={user} />} />
          <Route path="/guru-mapel/presensi/:kelasId" element={<GuruPresensiForm user={user} />} />
          <Route path="/guru-piket" element={<GuruPiketDashboard />} />
          <Route path="/guru-piket/validasi" element={<GuruPiketValidasi />} />
          <Route path="/guru-piket/rekap" element={<GuruPiketRekap />} />
          <Route path="/wali-kelas" element={<WaliKelasDashboard user={user} />} />
          <Route path="/wali-kelas/laporan" element={<WaliKelasLaporan user={user} />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/siswa" element={<AdminSiswa />} />
          <Route path="/admin/kurikulum" element={<AdminKurikulum />} />
          <Route path="/admin/penempatan" element={<AdminPenempatan />} />
          <Route path="*" element={<Navigate to={getDefaultPath(user.role)} replace />} />
        </Routes>
      </div>
    </div>
  )
}

function getDefaultPath(role) {
  switch (role) {
    case 'guru_mapel': return '/guru-mapel'
    case 'guru_piket': return '/guru-piket'
    case 'wali_kelas': return '/wali-kelas'
    case 'admin': return '/admin'
    default: return '/login'
  }
}
