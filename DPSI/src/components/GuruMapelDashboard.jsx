import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchSiswa, fetchPresensi, fetchPenempatanSaya, fetchMapel, clearAuth } from '../api'
import { getSocket } from '../api/socket'

const NAV_ITEMS = [
  { key: 'beranda', label: 'Beranda', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', path: '/guru-mapel' },
  { key: 'riwayat', label: 'Riwayat', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', path: '/guru-mapel/presensi' },
  { key: 'laporan', label: 'Laporan', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', path: '/guru-mapel/presensi' },
  { key: 'profil', label: 'Profil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', path: '/guru-mapel' },
]

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']
const DAY_LABELS = { 'Senin': 'Senin', 'Selasa': 'Selasa', 'Rabu': 'Rabu', 'Kamis': 'Kamis', 'Jumat': 'Jumat' }

function greeting() {
  const h = new Date().getHours()
  if (h < 10) return 'Selamat Pagi'
  if (h < 15) return 'Selamat Siang'
  return 'Selamat Sore'
}

function dayName() {
  return ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()]
}

function getGreetingName(name) {
  if (!name) return 'Guru'
  const base = name.split(',')[0]?.trim() || name
  return `Bpk. ${base}`
}

export default function GuruMapelDashboard({ user }) {
  const navigate = useNavigate()
  const [siswa, setSiswa] = useState([])
  const [presensi, setPresensi] = useState([])
  const [penempatan, setPenempatan] = useState([])
  const [mapel, setMapel] = useState([])
  const [navActive, setNavActive] = useState('beranda')
  const [filterHari, setFilterHari] = useState('')

  const loadData = useCallback(async () => {
    const [s, p, r, m] = await Promise.all([fetchSiswa(), fetchPresensi(), fetchPenempatanSaya(), fetchMapel()])
    setSiswa(s)
    setPresensi(p)
    setPenempatan(r)
    setMapel(m)
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
  const sudahAbsen = [...new Set(presensi.filter(p => p.tanggal === today).map(p => p.siswaId))].length
  const belumHariIni = Math.max(0, totalSiswa - sudahAbsen)

  const todayName = new Date().toLocaleDateString('id-ID', { weekday: 'long' })
  const todayCapitalized = todayName.charAt(0).toUpperCase() + todayName.slice(1)
  const currentSession = penempatan.find(p => p.hari?.toLowerCase() === todayName.toLowerCase())
  const otherSessions = penempatan.filter(p => p.hari?.toLowerCase() !== todayName.toLowerCase())

  const scheduleByDay = {}
  DAYS.forEach(d => { scheduleByDay[d] = [] })
  penempatan.forEach(p => {
    const day = p.hari || 'Lainnya'
    if (!scheduleByDay[day]) scheduleByDay[day] = []
    scheduleByDay[day].push(p)
  })

  const filteredDays = filterHari
    ? { [filterHari]: scheduleByDay[filterHari] || [] }
    : scheduleByDay

  function handleLogout() {
    clearAuth()
    navigate('/login')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-28">
      {/* Header Greeting */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xl font-bold text-gray-900">
            {greeting()}, {getGreetingName(user?.name)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">
            {dayName()}, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 relative">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {user?.name?.charAt(0) || 'G'}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total Siswa', value: totalSiswa, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
          { label: 'Hadir', value: hadirHariIni, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Belum', value: belumHariIni, color: 'text-amber-500', bg: 'bg-amber-50', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        ].map(stat => (
          <div key={stat.label}
            className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100 p-4 hover:shadow-md transition-all duration-200 active:scale-[0.97]">
            <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-2.5`}>
              <svg className={`w-4.5 h-4.5 ${stat.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
              </svg>
            </div>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Today's Session */}
      <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-gray-100 p-5 mb-5 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-bold text-gray-800 tracking-wide">SESI MENGAJAR HARI INI</h2>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-emerald-500 rounded-full px-2.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {todayCapitalized}
          </span>
        </div>
        {(() => {
          const todaySessions = penempatan.filter(p => p.hari?.toLowerCase() === todayName.toLowerCase())
          if (todaySessions.length === 0) {
            return (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-gray-400">Tidak ada jadwal hari ini</p>
              </div>
            )
          }
          return (
            <div className="space-y-3">
              {todaySessions.map((p, i) => (
                <div key={i}
                  className="relative pl-4 border-l-2 border-emerald-200 cursor-pointer hover:border-emerald-500 transition-colors"
                  onClick={() => navigate(`/guru-mapel/presensi/${p.kelasId}?mapel=${p.mapelId}&tingkat=${p.kelasId?.charAt(0)}`)}>
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-base font-bold text-gray-900">{p.namaMapel}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{p.jamMulai || '—'} – {p.jamSelesai || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>Kelas {p.namaKelas}</span>
                    </div>
                  </div>
                  {i < todaySessions.length - 1 && (
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/guru-mapel/presensi/${p.kelasId}?mapel=${p.mapelId}&tingkat=${p.kelasId?.charAt(0)}`) }}
                      className="mt-2 w-full py-2 text-xs font-semibold text-white rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-sm active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                      Mulai Presensi
                    </button>
                  )}
                </div>
              ))}
            </div>
          )
        })()}
      </div>

      {/* Full Weekly Schedule */}
      <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-gray-100 p-5 mb-5 hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-sm font-bold text-gray-800 tracking-wide mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          JADWAL MENGAJAR MINGGUAN
        </h2>

        <select value={filterHari} onChange={e => setFilterHari(e.target.value)}
          className="mb-4 px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-600 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30">
          <option value="">Semua Hari</option>
          {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        {penempatan.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-xs font-medium text-gray-400">Belum ada jadwal mengajar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(filteredDays).map(([day, sessions]) =>
              sessions.length > 0 && (
                <div key={day}>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${day === todayCapitalized ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    {day}
                    {day === todayCapitalized && <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Hari Ini</span>}
                  </h3>
                  <div className="space-y-2">
                    {sessions.map((p, i) => (
                      <div key={i}
                        className="group flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-white hover:border-emerald-200 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                        onClick={() => navigate(`/guru-mapel/presensi/${p.kelasId}?mapel=${p.mapelId}&tingkat=${p.kelasId?.charAt(0)}`)}>
                        <div className={`w-1 h-10 rounded-full shrink-0 ${day === todayCapitalized ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{p.namaMapel}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Kelas {p.namaKelas}
                            {p.jamMulai && <span> &middot; {p.jamMulai} – {p.jamSelesai || '—'}</span>}
                          </p>
                        </div>
                        <svg className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-50">
        <div className="max-w-2xl mx-auto flex items-center px-3 py-1.5">
          <div className="flex items-center justify-around flex-1">
            {NAV_ITEMS.map(item => (
              <button key={item.key} onClick={() => { setNavActive(item.key); navigate(item.path) }}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200 ${
                  navActive === item.key
                    ? 'text-emerald-600 bg-emerald-50/80'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={navActive === item.key ? 2.5 : 1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span className={`text-[10px] font-semibold ${navActive === item.key ? 'text-emerald-600' : 'text-gray-400'}`}>{item.label}</span>
              </button>
            ))}
          </div>
          <button onClick={handleLogout}
            className="ml-2 px-3 py-2 rounded-lg border border-emerald-300 bg-white text-emerald-600 text-xs font-semibold hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-200 whitespace-nowrap">
            Keluar
          </button>
        </div>
      </nav>
    </div>
  )
}
