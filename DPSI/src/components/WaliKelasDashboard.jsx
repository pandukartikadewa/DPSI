import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { fetchStatistikKelas, fetchKelas, updateWaliKelas, clearAuth } from '../api'
import { getSocket } from '../api/socket'

const NAV_ITEMS = [
  { key: 'beranda', label: 'Beranda', path: '/wali-kelas', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { key: 'laporan', label: 'Laporan', path: '/wali-kelas/laporan', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { key: 'profil', label: 'Profil', path: '/wali-kelas', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
]

const COLORS = { Hadir: '#10B981', Sakit: '#3B82F6', Izin: '#F59E0B', Alpa: '#EF4444' }
const STATUS_COLORS = { Hadir: 'bg-emerald-500', Sakit: 'bg-blue-500', Izin: 'bg-amber-500', Alpa: 'bg-red-500' }

function DonutChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const [hovered, setHovered] = useState(null)
  const cx = 90, cy = 90, innerR = 55, outerR = 78

  if (total === 0) {
    return (
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="#F1F5F9" strokeWidth={outerR - innerR} />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="700" fill="#0F172A">0%</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#94A3B8">Belum ada data</text>
      </svg>
    )
  }

  const pieData = data.map(d => ({ ...d, pct: Math.round((d.value / total) * 100) }))
  const active = hovered ? pieData.find(d => d.name === hovered) : null

  return (
    <div className="relative w-[180px] h-[180px] shrink-0">
      <svg width="180" height="180" viewBox="0 0 180 180" className="drop-shadow-md">
        {pieData.map((entry, i) => {
          const prev = pieData.slice(0, i).reduce((s, d) => s + (d.value / total) * 360, 0)
          const angle = (entry.value / total) * 360
          const largeArc = angle > 180 ? 1 : 0
          const startRad = ((prev - 90) * Math.PI) / 180
          const endRad = ((prev + angle - 90) * Math.PI) / 180
          const x1 = cx + innerR * Math.cos(startRad)
          const y1 = cy + innerR * Math.sin(startRad)
          const x2 = cx + outerR * Math.cos(startRad)
          const y2 = cy + outerR * Math.sin(startRad)
          const x3 = cx + outerR * Math.cos(endRad)
          const y3 = cy + outerR * Math.sin(endRad)
          const x4 = cx + innerR * Math.cos(endRad)
          const y4 = cy + innerR * Math.sin(endRad)
          return (
            <g key={entry.name}>
              <path
                d={`M ${x2} ${y2} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1} ${y1} Z`}
                fill={COLORS[entry.name]}
                opacity={hovered && hovered !== entry.name ? 0.25 : 0.85}
                onMouseEnter={() => setHovered(entry.name)}
                onMouseLeave={() => setHovered(null)}
                className="transition-opacity duration-200 cursor-pointer"
              />
              <circle cx={cx} cy={cy} r={innerR} fill="white" />
            </g>
          )
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="20" fontWeight="700" fill="#0F172A">
          {active ? `${active.pct}%` : `${pieData[0]?.pct || 0}%`}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="#94A3B8">
          {active ? active.name : pieData[0]?.name || 'Tidak ada'}
        </text>
      </svg>
    </div>
  )
}

export default function WaliKelasDashboard({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [kelasId, setKelasId] = useState(user.waliKelas || '')
  const [kelas, setKelas] = useState([])
  const [stat, setStat] = useState(null)
  const [loading, setLoading] = useState(false)
  const [navActive, setNavActive] = useState(
    location.pathname === '/wali-kelas/laporan' ? 'laporan' : 'beranda'
  )

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(true)

  function handleLogout() {
    clearAuth()
    navigate('/login')
  }

  useEffect(() => { fetchKelas().then(setKelas) }, [])

  function handleKelasChange(newKelasId) {
    setKelasId(newKelasId)
    setSaved(newKelasId === user.waliKelas)
  }

  async function handleSimpanKelas() {
    if (!kelasId || saving) return
    setSaving(true)
    try {
      await updateWaliKelas(kelasId)
      user.waliKelas = kelasId
      setSaved(true)
    } catch (e) {
      alert('Gagal menyimpan kelas: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const loadStat = useCallback(async () => {
    if (!kelasId) return
    setLoading(true)
    try { setStat(await fetchStatistikKelas(kelasId)) } finally { setLoading(false) }
  }, [kelasId])

  useEffect(() => { loadStat() }, [loadStat])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return
    const handler = () => { if (kelasId) loadStat() }
    socket.on('presensi:baru', handler)
    socket.on('presensi:update', handler)
    return () => { socket.off('presensi:baru', handler); socket.off('presensi:update', handler) }
  }, [loadStat, kelasId])

  const donutData = stat ? [
    { name: 'Hadir', value: stat.totalHadir },
    { name: 'Sakit', value: stat.totalSakit },
    { name: 'Izin', value: stat.totalIzin },
    { name: 'Alpa', value: stat.totalAlpa },
  ].filter(d => d.value > 0) : []

  const totalPresensi = donutData.reduce((s, d) => s + d.value, 0)

  const statCards = stat ? [
    { label: 'Persentase Kehadiran', value: `${stat.pctHadir}%`, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Total Hari Presensi', value: stat.totalHari, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Total Sakit', value: stat.totalSakit, color: 'text-amber-500', bg: 'bg-amber-50', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Total Alpa', value: stat.totalAlpa, color: 'text-red-500', bg: 'bg-red-50', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z' },
  ] : []

  const kelasNama = kelas.find(k => k.id === kelasId)?.nama || kelasId || '—'

  return (
    <div className="max-w-2xl mx-auto px-4 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 -mx-4 px-4 pt-6 pb-8 rounded-b-[28px] shadow-lg relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Dasbor Kelas Binaan</h1>
              <p className="text-sm text-white/80 font-medium mt-0.5">
                Wali Kelas: {user.name || '—'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!saved && kelasId && (
                <button onClick={handleSimpanKelas} disabled={saving}
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 active:scale-95 transition-all duration-200 shadow-sm whitespace-nowrap">
                  {saving ? '...' : 'Simpan'}
                </button>
              )}
              <select value={kelasId} onChange={e => handleKelasChange(e.target.value)}
                className="px-3 py-2 text-xs border-0 rounded-xl bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm [&>option]:text-gray-800 min-w-[100px]">
                <option value="" className="text-gray-600">Pilih Kelas</option>
                {kelas.map(k => <option key={k.id} value={k.id} className="text-gray-600">{k.nama}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-xs text-gray-400 font-medium">Memuat data...</span>
        </div>
      ) : stat ? (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {statCards.map(card => (
              <div key={card.label}
                className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100 p-4 hover:shadow-md transition-all duration-200 active:scale-[0.97]">
                <div className={`w-8 h-8 ${card.bg} rounded-xl flex items-center justify-center mb-2.5`}>
                  <svg className={`w-4 h-4 ${card.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                  </svg>
                </div>
                <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Donut */}
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-gray-100 p-5 mb-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-sm font-bold text-gray-800 tracking-wide mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Distribusi Kehadiran
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <DonutChart data={donutData} />
              <div className="flex-1 w-full">
                <div className="grid grid-cols-2 gap-2">
                  {donutData.map(d => (
                    <div key={d.name} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100">
                      <span className={`w-3 h-3 rounded-full shrink-0 ${STATUS_COLORS[d.name] || 'bg-gray-300'}`} />
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-gray-500">{d.name}</p>
                        <p className="text-sm font-bold text-gray-900">{d.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between px-1">
                  <span className="text-xs text-gray-400 font-medium">Total Presensi</span>
                  <span className="text-sm font-bold text-gray-900">{totalPresensi}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5 Paling Sering Alpa */}
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-gray-100 p-5 mb-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-sm font-bold text-gray-800 tracking-wide mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              5 Siswa Paling Sering Alpa
            </h2>
            {stat.palingAlpa.filter(s => s.alpa > 0).length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-gray-400">Tidak ada data alpa</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {stat.palingAlpa.filter(s => s.alpa > 0).map((s, i) => (
                  <div key={s.siswaId}
                    className="group flex items-center gap-3.5 p-3.5 rounded-xl border border-gray-100 bg-white hover:border-red-200 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-default">
                    <span className="w-6 h-6 rounded-full bg-red-50 text-red-500 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                      {s.nama?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{s.nama}</p>
                      <p className="text-[11px] text-gray-400">{s.nis}</p>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-3">
                      <div>
                        <p className="text-sm font-bold text-red-500">{s.alpa}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Alpa</p>
                      </div>
                      <span className="inline-flex items-center text-[10px] font-semibold px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 ring-1 ring-gray-200">
                        Total: {s.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5 Paling Sering Sakit */}
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-gray-100 p-5 mb-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-sm font-bold text-gray-800 tracking-wide mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              5 Siswa Paling Sering Sakit
            </h2>
            {stat.palingSakit.filter(s => s.sakit > 0).length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-gray-400">Tidak ada data sakit</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {stat.palingSakit.filter(s => s.sakit > 0).map((s, i) => (
                  <div key={s.siswaId}
                    className="group flex items-center gap-3.5 p-3.5 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-default">
                    <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                      {s.nama?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{s.nama}</p>
                      <p className="text-[11px] text-gray-400">{s.nis}</p>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-3">
                      <div>
                        <p className="text-sm font-bold text-blue-500">{s.sakit}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Sakit</p>
                      </div>
                      <span className="inline-flex items-center text-[10px] font-semibold px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 ring-1 ring-gray-200">
                        Total: {s.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">
            Pilih kelas untuk melihat statistik
          </p>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-50">
        <div className="max-w-2xl mx-auto flex items-center px-3 py-1.5">
          <div className="flex items-center justify-around flex-1">
            {NAV_ITEMS.map(item => (
              <button key={item.key} onClick={() => { setNavActive(item.key); navigate(item.path) }}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-xl transition-all duration-200 ${
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
            className="ml-2 px-3.5 py-2 rounded-lg border border-emerald-300 bg-white text-emerald-600 text-xs font-semibold hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-200 whitespace-nowrap">
            Keluar
          </button>
        </div>
      </nav>
    </div>
  )
}
