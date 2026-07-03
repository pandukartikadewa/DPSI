import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { fetchKelas, fetchSiswa, fetchPresensi, fetchMapel } from '../api'

function greeting() {
  const h = new Date().getHours()
  if (h < 10) return 'Selamat Pagi'
  if (h < 15) return 'Selamat Siang'
  return 'Selamat Sore'
}

function dayName() {
  return ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()]
}

const SCHEDULE_MOCK = [
  { id: 1, mapel: 'Matematika Wajib', jamMulai: '08:40', jamSelesai: '10:10', kelas: 'IX – Unggulan A', ruang: 'Lab MIPA 02' },
  { id: 2, mapel: 'Matematika Peminatan', jamMulai: '10:30', jamSelesai: '12:00', kelas: 'X', ruang: 'Ruang 301' },
  { id: 3, mapel: 'Informatika', jamMulai: '07:30', jamSelesai: '08:30', kelas: 'VIII – B', ruang: 'Lab Kom 01' },
]

const NAV_ITEMS = [
  { key: 'beranda', label: 'Beranda', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', path: '/guru-mapel' },
  { key: 'riwayat', label: 'Riwayat', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', path: '/guru-mapel/presensi' },
  { key: 'laporan', label: 'Laporan', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', path: '/guru-mapel/presensi' },
  { key: 'profil', label: 'Profil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', path: '/guru-mapel' },
]

export default function GuruMapelDashboard({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [kelas, setKelas] = useState([])
  const [siswa, setSiswa] = useState([])
  const [presensi, setPresensi] = useState([])
  const [filterTingkat, setFilterTingkat] = useState('')
  const [filterRuang, setFilterRuang] = useState('')
  const [filterMapel, setFilterMapel] = useState('')
  const [navActive, setNavActive] = useState('beranda')

  useEffect(() => {
    Promise.all([fetchKelas(), fetchSiswa(), fetchPresensi(), fetchMapel()]).then(([k, s, p]) => {
      setKelas(k)
      setSiswa(s)
      setPresensi(p)
    })
  }, [])

  const totalSiswa = siswa.length
  const today = new Date().toISOString().split('T')[0]
  const hadirHariIni = presensi.filter(p => p.tanggal === today && p.status === 'Hadir').length
  const belumHariIni = totalSiswa - [...new Set(presensi.filter(p => p.tanggal === today).map(p => p.siswaId))].length

  const filteredSchedule = SCHEDULE_MOCK.filter(s => {
    if (filterTingkat && !s.kelas.toLowerCase().includes(filterTingkat.toLowerCase())) return false
    if (filterRuang && !s.ruang.toLowerCase().includes(filterRuang.toLowerCase())) return false
    if (filterMapel && !s.mapel.toLowerCase().includes(filterMapel.toLowerCase())) return false
    return true
  })

  const ruangOptions = [...new Set(SCHEDULE_MOCK.map(s => s.ruang))]
  const mapelOptions = [...new Set(SCHEDULE_MOCK.map(s => s.mapel))]

  const currentSession = SCHEDULE_MOCK[0]

  function handleNavClick(item) {
    setNavActive(item.key)
    navigate(item.path)
  }

  return (
    <div className="pb-24">
      {/* Greeting Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xl font-bold text-gray-900">
            {greeting()}, {user?.name?.split(',')[0] || 'Guru'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{dayName()}, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>
          <div className="w-9 h-9 rounded-full bg-[#10B981] flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0) || 'G'}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Siswa', value: totalSiswa, color: '#10B981', bg: 'bg-emerald-50', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
          { label: 'Hadir', value: hadirHariIni, color: '#10B981', bg: 'bg-emerald-50', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Belum', value: belumHariIni < 0 ? 0 : belumHariIni, color: '#F59E0B', bg: 'bg-amber-50', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <svg className={`w-5 h-5`} fill="none" viewBox="0 0 24 24" stroke={stat.color} strokeWidth={1.5}>
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

      {/* Current Teaching Session */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-bold text-gray-800 tracking-wide">SESI MENGAJAR SAAT INI</h2>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-white bg-[#10B981] rounded-full px-2.5 py-0.5">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            LIVE
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 space-y-2">
            <p className="text-base font-bold text-gray-900">{currentSession.mapel}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {currentSession.jamMulai} – {currentSession.jamSelesai}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {currentSession.kelas}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {currentSession.ruang}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/guru-mapel/presensi')}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white rounded-xl transition-all duration-150 hover:shadow-lg shrink-0"
            style={{ backgroundColor: '#10B981' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#10B981'}
          >
            Mulai Presensi Digital
          </button>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-800 tracking-wide mb-4">JADWAL MENGAJAR LAINNYA</h2>

        {/* Filters */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <select
            value={filterTingkat}
            onChange={e => setFilterTingkat(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
          >
            <option value="">Semua Tingkat</option>
            <option value="VII">VII</option>
            <option value="VIII">VIII</option>
            <option value="IX">IX</option>
            <option value="X">X</option>
          </select>
          <select
            value={filterRuang}
            onChange={e => setFilterRuang(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
          >
            <option value="">Semua Ruang</option>
            {ruangOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select
            value={filterMapel}
            onChange={e => setFilterMapel(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
          >
            <option value="">Semua Mapel</option>
            {mapelOptions.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Schedule Cards */}
        <div className="space-y-2">
          {filteredSchedule.map(s => (
            <div
              key={s.id}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => navigate('/guru-mapel/presensi')}
            >
              <div className="w-1 h-10 rounded-full shrink-0" style={{ backgroundColor: '#10B981' }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{s.mapel}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {s.kelas} &bull; {s.jamMulai} – {s.jamSelesai} &bull; {s.ruang}
                </p>
              </div>
              <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))}
          {filteredSchedule.length === 0 && (
            <p className="text-center text-xs text-gray-400 py-6">Tidak ada jadwal yang sesuai filter.</p>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors ${
                navActive === item.key ? 'text-[#10B981]' : 'text-gray-400'
              }`}
            >
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
