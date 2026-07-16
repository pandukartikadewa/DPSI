import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchRekapKelas, fetchKelas } from '../api'
import { getSocket } from '../api/socket'

const NAV_ITEMS_GURU_PIKET = [
  { key: 'monitoring', label: 'Monitoring', path: '/guru-piket', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { key: 'presensi', label: 'Presensi', path: '/guru-piket/validasi', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { key: 'profil', label: 'Profil', path: '/guru-piket/rekap', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
]

const FILTERS = ['Semua', 'Hadir Semua', 'Ada Alpa/Sakit']

export default function GuruPiketDashboard({ user }) {
  const navigate = useNavigate()
  const [rekap, setRekap] = useState([])
  const [kelas, setKelas] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [navActive, setNavActive] = useState('monitoring')

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [data, k] = await Promise.all([fetchRekapKelas(), fetchKelas()])
      setRekap(data)
      setKelas(k)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return
    const handler = () => { loadData() }
    socket.on('presensi:baru', handler)
    socket.on('presensi:update', handler)
    return () => { socket.off('presensi:baru', handler); socket.off('presensi:update', handler) }
  }, [loadData])

  const totals = rekap.reduce((acc, r) => ({
    totalSiswa: acc.totalSiswa + r.totalSiswa,
    hadir: acc.hadir + r.hadir,
    sakit: acc.sakit + r.sakit,
    izin: acc.izin + r.izin,
    alpa: acc.alpa + r.alpa,
    belum: acc.belum + r.belum,
  }), { totalSiswa: 0, hadir: 0, sakit: 0, izin: 0, alpa: 0, belum: 0 })

  const kelasTerdaftar = rekap.filter(r => r.totalSiswa > 0 && r.belum < r.totalSiswa).length
  const totalKelas = kelas.length
  const pctKelas = totalKelas > 0 ? Math.round((kelasTerdaftar / totalKelas) * 100) : 0

  const filteredRekap = rekap.filter(r => {
    if (search && !r.namaKelas.toLowerCase().includes(search.toLowerCase())) return false
    if (activeFilter === 'Hadir Semua' && r.belum > 0) return false
    if (activeFilter === 'Ada Alpa/Sakit' && r.alpa === 0 && r.sakit === 0) return false
    return true
  })

  return (
    <div className="pb-24">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Monitoring Presensi Harian</h1>
        <p className="text-xs text-gray-400 mt-1">Guru Piket: {user?.name || 'Petugas Piket'}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()]}, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#10B981" strokeWidth="3"
                strokeDasharray={`${pctKelas * 0.97} ${100 - pctKelas * 0.97}`}
                strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">{pctKelas}%</span>
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-gray-900">{kelasTerdaftar}/{totalKelas}</p>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Kelas Terisi</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{totals.hadir}</p>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Siswa Hadir</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#EF4444" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{totals.alpa}</p>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Siswa Alpa</p>
          </div>
        </div>
      </div>

      <div className="mb-4 space-y-3">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari kelas..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20" />
        </div>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${activeFilter === f ? 'bg-[#10B981] text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-xs text-gray-400">Memuat data...</div>
      ) : (
        <div className="space-y-2">
          {filteredRekap.map((r, i) => {
            const belumAdaPresensi = r.belum === r.totalSiswa
            const semuaHadir = r.belum === 0 && r.alpa === 0 && r.sakit === 0 && r.izin === 0
            const adaMasalah = r.alpa > 0 || r.sakit > 0
            return (
              <div key={i} className="flex items-center gap-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/guru-piket/validasi?kelas=${r.kelasId}`)}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${semuaHadir ? 'bg-emerald-50' : belumAdaPresensi ? 'bg-red-50' : 'bg-amber-50'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={semuaHadir ? '#10B981' : belumAdaPresensi ? '#EF4444' : '#F59E0B'} strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">Kelas {r.namaKelas}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {r.hadir} Hadir &middot; {r.sakit} Sakit &middot; {r.izin} Izin &middot; {r.alpa} Alpa
                    {r.belum > 0 && <span className="text-amber-500"> &middot; {r.belum} belum</span>}
                  </p>
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${semuaHadir ? 'bg-emerald-50 text-[#10B981]' : belumAdaPresensi ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
                  {semuaHadir ? 'Lengkap' : belumAdaPresensi ? 'Kosong' : adaMasalah ? 'Ada masalah' : 'Sebagian'}
                </span>
                <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )
          })}
          {filteredRekap.length === 0 && (
            <div className="text-center py-10 text-xs text-gray-400">Tidak ada kelas yang sesuai.</div>
          )}
        </div>
      )}

      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {NAV_ITEMS_GURU_PIKET.map(item => (
            <button key={item.key} onClick={() => { setNavActive(item.key); navigate(item.path) }}
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
