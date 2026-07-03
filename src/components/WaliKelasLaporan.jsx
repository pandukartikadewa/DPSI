import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchKelas, fetchRekapSiswa, fetchStatistikKelas, fetchSiswa } from '../api'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'

const NAV_ITEMS = [
  { key: 'beranda', label: 'Beranda', path: '/wali-kelas', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { key: 'laporan', label: 'Laporan', path: '/wali-kelas/laporan', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { key: 'profil', label: 'Profil', path: '/wali-kelas', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
]

const COLORS = { Hadir: '#10B981', Sakit: '#3B82F6', Izin: '#F59E0B', Alpa: '#EF4444' }

export default function WaliKelasLaporan({ user }) {
  const navigate = useNavigate()
  const [kelas, setKelas] = useState([])
  const [kelasId, setKelasId] = useState(user.waliKelas || '')
  const [stat, setStat] = useState(null)
  const [rekap, setRekap] = useState([])
  const [semuaSiswa, setSemuaSiswa] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [navActive, setNavActive] = useState('laporan')

  useEffect(() => { fetchKelas().then(setKelas) }, [])

  useEffect(() => {
    if (!kelasId) return
    setLoading(true)
    Promise.all([
      fetchStatistikKelas(kelasId),
      fetchRekapSiswa(kelasId),
      fetchSiswa(),
    ]).then(([s, r, sw]) => {
      setStat(s)
      setRekap(r)
      setSemuaSiswa(sw.filter(s => s.kelasId === kelasId))
    }).finally(() => setLoading(false))
  }, [kelasId])

  const donutData = stat ? [
    { name: 'Hadir', value: stat.totalHadir, pct: stat.pctHadir },
    { name: 'Sakit', value: stat.totalSakit, pct: stat.totalSemua > 0 ? Math.round((stat.totalSakit / stat.totalSemua) * 100) : 0 },
    { name: 'Izin', value: stat.totalIzin, pct: stat.totalSemua > 0 ? Math.round((stat.totalIzin / stat.totalSemua) * 100) : 0 },
    { name: 'Alpa', value: stat.totalAlpa, pct: stat.totalSemua > 0 ? Math.round((stat.totalAlpa / stat.totalSemua) * 100) : 0 },
  ].filter(d => d.value > 0) : []

  const displayedSiswa = showAll ? rekap : rekap.slice(0, 5)
  const kelasNama = kelas.find(k => k.id === kelasId)?.nama || kelasId || '—'

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
    <div className="pb-24">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Laporan Presensi</h1>
          <p className="text-xs text-gray-400 mt-1">
            {user.waliKelas ? `Kelas ${kelasNama} – Semester Genap` : 'Pilih kelas'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Periode Laporan: 1 Mei – 31 Mei 2024
          </p>
        </div>
        {!user.waliKelas && (
          <select
            value={kelasId}
            onChange={e => setKelasId(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
          >
            <option value="">Pilih Kelas</option>
            {kelas.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-xs text-gray-400">Memuat data...</div>
      ) : stat ? (
        <>
          {/* Donut Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <h2 className="text-sm font-bold text-gray-800 tracking-wide mb-4">Distribusi Kehadiran</h2>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-48 h-48 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%" cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {donutData.map(entry => (
                        <Cell key={entry.name} fill={COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="middle"
                      align="right"
                      layout="vertical"
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => {
                        const d = donutData.find(item => item.name === value)
                        return (
                          <span className="text-xs text-gray-600">
                            {value} ({d?.pct || 0}%)
                          </span>
                        )
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-4 text-xs">
                {donutData.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[d.name] }} />
                    <span className="text-gray-500">{d.name}: <strong className="text-gray-900">{d.value}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Student Detail Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-800 tracking-wide">Detail Siswa ({rekap.length})</h2>
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-xs font-semibold text-[#10B981] hover:underline"
              >
                {showAll ? 'Tampilkan Sedikit' : 'Lihat Semua'}
              </button>
            </div>
            <div className="space-y-2">
              {displayedSiswa.map((r, i) => {
                const pct = r.total > 0 ? Math.round((r.hadir / r.total) * 100) : 0
                const siswa = semuaSiswa.find(s => s.id === r.siswaId)
                return (
                  <div key={r.siswaId} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-[#10B981] flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {siswa?.nama?.charAt(0) || r.nama?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{r.nama}</p>
                      <p className="text-[11px] text-gray-400">{r.nis}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold" style={{ color: COLORS.Hadir }}>{pct}%</p>
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        r.alpa > 0 ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400'
                      }`}>
                        Alpa: {r.alpa}
                      </span>
                    </div>
                  </div>
                )
              })}
              {rekap.length === 0 && (
                <div className="text-center py-6 text-xs text-gray-400">Belum ada data presensi.</div>
              )}
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={exportPDF}
            className="w-full py-3.5 text-sm font-semibold text-white rounded-xl transition-all duration-150 hover:shadow-lg flex items-center justify-center gap-2"
            style={{ backgroundColor: '#10B981' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#10B981'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Unduh Laporan
          </button>
        </>
      ) : (
        <div className="flex items-center justify-center py-16 text-xs text-gray-400">
          {user.waliKelas ? 'Memuat data...' : 'Pilih kelas untuk melihat laporan.'}
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => { setNavActive(item.key); navigate(item.path) }}
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
