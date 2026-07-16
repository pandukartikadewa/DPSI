import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { fetchKelas, fetchRekapSiswa, fetchStatistikKelas, fetchSiswa, clearAuth } from '../api'
import { getSocket } from '../api/socket'

const NAV_ITEMS = [
  { key: 'beranda', label: 'Beranda', path: '/wali-kelas', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { key: 'laporan', label: 'Laporan', path: '/wali-kelas/laporan', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { key: 'profil', label: 'Profil', path: '/wali-kelas', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
]

const COLORS = { Hadir: '#10B981', Sakit: '#3B82F6', Izin: '#F59E0B', Alpa: '#EF4444' }

function DonutChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const [hovered, setHovered] = useState(null)
  const cx = 90, cy = 90, innerR = 55, outerR = 78

  if (total === 0) {
    return (
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="#F1F5F9" strokeWidth={outerR - innerR} />
        <text x={cx} y={cy - 6} textAnchor="middle" className="fill-gray-900 text-lg font-bold" fontSize="22">0%</text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="fill-gray-400" fontSize="11">Belum ada data</text>
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
      {data.map(d => (
        <div key={d.name} />
      ))}
    </div>
  )
}

export default function WaliKelasLaporan({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [kelas, setKelas] = useState([])
  const [kelasId, setKelasId] = useState(user.waliKelas || '')
  const [stat, setStat] = useState(null)
  const [rekap, setRekap] = useState([])
  const [semuaSiswa, setSemuaSiswa] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [navActive, setNavActive] = useState('laporan')

  function handleLogout() {
    clearAuth()
    navigate('/login')
  }

  useEffect(() => { fetchKelas().then(setKelas) }, [])

  const loadData = useCallback(async () => {
    if (!kelasId) return
    setLoading(true)
    try {
      const [s, r, sw] = await Promise.all([
        fetchStatistikKelas(kelasId),
        fetchRekapSiswa(kelasId),
        fetchSiswa(),
      ])
      setStat(s)
      setRekap(r)
      setSemuaSiswa(sw.filter(s => s.kelasId === kelasId))
    } finally { setLoading(false) }
  }, [kelasId])

  useEffect(() => { loadData() }, [loadData])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return
    const handler = () => { if (kelasId) loadData() }
    socket.on('presensi:baru', handler)
    socket.on('presensi:update', handler)
    return () => { socket.off('presensi:baru', handler); socket.off('presensi:update', handler) }
  }, [loadData, kelasId])

  const donutData = stat ? [
    { name: 'Hadir', value: stat.totalHadir },
    { name: 'Sakit', value: stat.totalSakit },
    { name: 'Izin', value: stat.totalIzin },
    { name: 'Alpa', value: stat.totalAlpa },
  ].filter(d => d.value > 0) : []

  const totalSiswa = stat?.totalSemua || 0
  const displayedSiswa = showAll ? rekap : rekap.slice(0, 5)
  const kelasNama = kelas.find(k => k.id === kelasId)?.nama || kelasId || '—'
  const totalPresensi = donutData.reduce((s, d) => s + d.value, 0)

  function exportPDF() {
    const w = window.open('', '_blank')
    if (!w) return
    const today = new Date().toLocaleDateString('id-ID')
    w.document.write(`
      <html><head><title>Laporan Kehadiran - ${kelasNama}</title>
      <style>
        body { font-family: 'Inter','Segoe UI',sans-serif; padding: 40px; }
        h1 { font-size: 18px; margin-bottom: 4px; }
        h2 { font-size: 14px; color: #666; margin-bottom: 20px; font-weight: normal; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
        th { background: #f5f5f5; }
        .footer { margin-top: 40px; font-size: 11px; color: #999; text-align: center; }
      </style></head><body>
      <h1>Laporan Rekapitulasi Kehadiran Siswa</h1>
      <h2>Kelas: ${kelasNama}</h2>
      <table>
        <thead><tr><th>No</th><th>NIS</th><th>Nama</th><th>Hadir</th><th>Sakit</th><th>Izin</th><th>Alpa</th><th>Total</th></tr></thead>
        <tbody>
          ${rekap.map((r, i) => `<tr><td>${i+1}</td><td>${r.nis}</td><td>${r.nama}</td><td>${r.hadir}</td><td>${r.sakit}</td><td>${r.izin}</td><td>${r.alpa}</td><td>${r.total}</td></tr>`).join('')}
        </tbody>
      </table>
      <div class="footer">Dicetak: ${today} — Sistem Absensi Digital MTsN 1 Yogyakarta</div>
      <script>window.onload=function(){window.print();setTimeout(function(){window.close()},1000)}<\/script>
    </body></html>`)
    w.document.close()
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-28">
      {/* Header gradient */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 -mx-4 px-4 pt-6 pb-8 rounded-b-[28px] shadow-lg relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Laporan Presensi</h1>
              <p className="text-sm text-white/80 font-medium mt-0.5">
                Kelas {kelasNama} – Semester Genap
              </p>
              <p className="text-xs text-white/60 mt-0.5">
                Periode Laporan: 1 Mei – 31 Mei 2024
              </p>
            </div>
            {!user.waliKelas && (
              <select value={kelasId} onChange={e => setKelasId(e.target.value)}
                className="px-3 py-2 text-xs border-0 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm [&>option]:text-gray-800">
                <option value="" className="text-gray-600">Pilih Kelas</option>
                {kelas.map(k => <option key={k.id} value={k.id} className="text-gray-600">{k.nama}</option>)}
              </select>
            )}
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
          {/* Donut Card */}
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
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[d.name] }} />
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

          {/* Student Details */}
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-gray-100 p-5 mb-5 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-800 tracking-wide flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Detail Siswa
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">{rekap.length}</span>
              </h2>
              <button onClick={() => setShowAll(!showAll)}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1">
                {showAll ? 'Tampilkan Sedikit' : 'Lihat Semua'}
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className="space-y-2.5">
              {displayedSiswa.map((r, i) => {
                const pct = r.total > 0 ? Math.round((r.hadir / r.total) * 100) : 0
                const siswa = semuaSiswa.find(s => s.id === r.siswaId)
                return (
                  <div key={r.siswaId}
                    className="group flex items-center gap-3.5 p-3.5 rounded-xl border border-gray-100 bg-white hover:border-emerald-200 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-default">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                      {siswa?.nama?.charAt(0) || r.nama?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{r.nama}</p>
                      <p className="text-[11px] text-gray-400">{r.nis}</p>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-3">
                      <div>
                        <p className="text-sm font-bold text-emerald-600">{pct}%</p>
                        <p className="text-[10px] text-gray-400 font-medium">Hadir</p>
                      </div>
                      <span className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                        r.alpa > 0 ? 'bg-red-50 text-red-600 ring-1 ring-red-200' : 'bg-gray-100 text-gray-400'
                      }`}>
                        Alpa: {r.alpa}
                      </span>
                    </div>
                  </div>
                )
              })}
              {rekap.length === 0 && (
                <div className="text-center py-10">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-400">Belum ada data presensi.</p>
                </div>
              )}
            </div>
          </div>

          {/* Download Button */}
          <button onClick={exportPDF}
            className="w-full py-3.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-md hover:shadow-[0_8px_24px_rgba(16,185,129,0.35)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Unduh Laporan
          </button>
        </>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">
            {user.waliKelas ? 'Memuat data...' : 'Pilih kelas untuk melihat laporan.'}
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
