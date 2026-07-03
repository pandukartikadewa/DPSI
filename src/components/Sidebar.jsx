import { NavLink, useLocation } from 'react-router-dom'

const roleLabel = {
  guru_mapel: 'Guru Mapel',
  guru_piket: 'Guru Piket',
  wali_kelas: 'Wali Kelas',
  admin: 'Admin',
}

const menuByRole = {
  guru_mapel: [
    { to: '/guru-mapel', label: 'Dasbor Guru Mapel', icon: '📊' },
    { to: '/guru-mapel/presensi', label: 'Mulai Presensi', icon: '📝' },
  ],
  guru_piket: [
    { to: '/guru-piket', label: 'Monitoring Real-Time', icon: '📡' },
    { to: '/guru-piket/validasi', label: 'Log Validasi Bukti', icon: '🖼️' },
    { to: '/guru-piket/rekap', label: 'Cetak Rekap Harian', icon: '🖨️' },
  ],
  wali_kelas: [
    { to: '/wali-kelas', label: 'Dasbor Kelas Binaan', icon: '📈' },
    { to: '/wali-kelas/laporan', label: 'Laporan Akademik', icon: '📋' },
  ],
  admin: [
    { to: '/admin', label: 'Kelola Akun Pengguna', icon: '👤' },
    { to: '/admin/siswa', label: 'Data Siswa & Kelas', icon: '👨‍🎓' },
    { to: '/admin/kurikulum', label: 'Kurikulum & Mapel', icon: '📚' },
  ],
}

export default function Sidebar({ user, onLogout }) {
  const location = useLocation()
  const menus = menuByRole[user.role] || []

  const isActive = (to) => {
    if (['/guru-mapel', '/guru-piket', '/wali-kelas', '/admin'].includes(to)) {
      return location.pathname === to
    }
    return location.pathname.startsWith(to)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="text-white">Absensi Digital</h1>
        <p className="text-white/75 text-[11px] font-medium mt-0.5">MTsN 1 Yogyakarta</p>
      </div>
      <div className="sidebar-user">
        <strong className="block text-xs font-semibold">{user.name}</strong>
        <span className="text-white/65 text-[11px] font-medium">{roleLabel[user.role] || user.role}</span>
      </div>
      <nav className="sidebar-nav">
        {menus.map(m => (
          <NavLink
            key={m.to}
            to={m.to}
            end={['/guru-mapel', '/guru-piket', '/wali-kelas', '/admin'].includes(m.to)}
            className={isActive(m.to) ? 'active' : ''}
          >
            <span>{m.icon}</span>
            <span>{m.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="btn-logout" onClick={onLogout}>Keluar</button>
      </div>
    </aside>
  )
}
