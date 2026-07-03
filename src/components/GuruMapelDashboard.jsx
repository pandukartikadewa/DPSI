import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchSiswa, fetchPresensi, fetchPenempatanSaya } from '../api'
import { getSocket } from '../api/socket'

function greeting() {
  const h = new Date().getHours()
  if (h < 10) return 'Selamat Pagi'
  if (h < 15) return 'Selamat Siang'
  return 'Selamat Sore'
}

function dayName() {
  return ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()]
}

const NAV_ITEMS = [
  { key: 'beranda', label: 'Beranda', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', path: '/guru-mapel' },
  { key: 'riwayat', label: 'Riwayat', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', path: '/guru-mapel/presensi' },
  { key: 'laporan', label: 'Laporan', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', path: '/guru-mapel/presensi' },
  { key: 'profil', label: 'Profil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', path: '/guru-mapel' },
]

export default function GuruMapelDashboard({ user }) {
  const navigate = useNavigate()
  const [siswa, setSiswa] = useState([])
  const [presensi, setPresensi] = useState([])
  const [penempatan, setPenempatan] = useState([])
  const [navActive, setNavActive] = useState('beranda')

  const loadData = useCallback(async () => {
    const [s, p, r] = await Promise.all([fetchSiswa(), fetchPresensi(), fetchPenempatanSaya()])
    setSiswa(s)
    setPresensi(p)
    setPenempatan(r)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return
    const handler = () => loadData()
    socket.on('presensi:baru', handler)
    socket.on('presensi:update', handler)
    return () => { socket.off('presensi:baru', handler); socket.off('presensi:update', handler) }
  }, [loadData])

  const totalSiswa = siswa.length
  const today = new Date().toISOString().split('T')[0]
  const hadirHariIni = presensi.filter(p => p.tanggal === today && p.status === 'Hadir').length
  const belumHariIni = totalSiswa - [...new Set(presensi.filter(p => p.tanggal === today).map(p => p.siswaId))].length

  function handleNavClick(item) {
    setNavActive(item.key)
    navigate(item.path)
  }

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xl font-bold text-gray-900">
            {greeting()}, {user?.name?.split(',')[0] || 'Guru'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{dayName()}, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#10B981] flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0) || 'G'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Siswa', value: totalSiswa, color: '#10B981', bg: 'bg-emerald-50', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
          { label: 'Hadir Hari Ini', value: hadirHariIni, color: '#10B981', bg: 'bg-emerald-50', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Belum Absen', value: belumHariIni < 0 ? 0 : belumHariIni, color: '#F59E0B', bg: 'bg-amber-50', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={stat.color} strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-bold text-gray-800 tracking-wide">PENEMPATAN SAYA</h2>
          <span className="text-[10px] font-semibold text-white bg-[#10B981] rounded-full px-2.5 py-0.5">
            {penempatan.length} Kelas
          </span>
        </div>
        {penempatan.length === 0 ? (
          <p className="text-xs text-gray-400 py-4">Belum ada penempatan untuk tahun ajaran ini.</p>
        ) : (
          <div className="space-y-2">
            {penempatan.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate(`/guru-mapel/presensi?kelas=${p.kelasId}&tingkat=${p.kelasId.charAt(0)}`)}>
                <div className="w-1 h-10 rounded-full shrink-0" style={{ backgroundColor: '#10B981' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{p.namaMapel}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Kelas {p.namaKelas}</p>
                </div>
                <button className="px-3 py-1.5 text-xs font-semibold text-white rounded-lg" style={{ backgroundColor: '#10B981' }}
                  onClick={(e) => { e.stopPropagation(); navigate(`/guru-mapel/presensi/${p.kelasId}?mapel=${p.mapelId}&tingkat=${p.kelasId.charAt(0)}`) }}>
                  Presensi
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {NAV_ITEMS.map(item => (
            <button key={item.key} onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors ${navActive === item.key ? 'text-[#10B981]' : 'text-gray-400'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={navActive === item.key ? 2.5 : 1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
