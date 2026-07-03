import { useState, useEffect, useCallback } from 'react'
import { fetchStatistikKelas, fetchKelas } from '../api'
import { getSocket } from '../api/socket'

export default function WaliKelasDashboard({ user }) {
  const [kelasId, setKelasId] = useState(user.waliKelas || '')
  const [kelas, setKelas] = useState([])
  const [stat, setStat] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchKelas().then(setKelas) }, [])

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

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <h1>Dasbor Kelas Binaan</h1>
        {user.waliKelas && <span className="text-gray-400 text-xs">Kelas: {user.waliKelas}</span>}
      </div>

      <div className="card">
        <div className="form-group">
          <label>Pilih Kelas</label>
          <select value={kelasId} onChange={e => setKelasId(e.target.value)}>
            <option value="">-- Pilih Kelas Binaan --</option>
            {kelas.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Memuat data...</div>
      ) : stat ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="stat-card"><div className="stat-value text-emerald-600">{stat.pctHadir}%</div><div className="stat-label">Persentase Kehadiran</div></div>
            <div className="stat-card"><div className="stat-value text-primary">{stat.totalHari}</div><div className="stat-label">Total Hari Presensi</div></div>
            <div className="stat-card"><div className="stat-value text-amber-500">{stat.totalSakit}</div><div className="stat-label">Total Sakit</div></div>
            <div className="stat-card"><div className="stat-value text-red-500">{stat.totalAlpa}</div><div className="stat-label">Total Alpa</div></div>
          </div>

          <div className="card">
            <h2 className="mb-3">5 Siswa Paling Sering Alpa</h2>
            {stat.palingAlpa.filter(s => s.alpa > 0).length === 0 ? (
              <div className="empty-state"><p>Tidak ada data alpa</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table>
                  <thead><tr><th>No</th><th>NIS</th><th>Nama</th><th>Alpa</th><th>Total</th></tr></thead>
                  <tbody>
                    {stat.palingAlpa.filter(s => s.alpa > 0).map((s, i) => (
                      <tr key={s.siswaId}>
                        <td>{i + 1}</td><td>{s.nis}</td><td>{s.nama}</td>
                        <td><span className="badge badge-alpa">{s.alpa}</span></td><td>{s.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="mb-3">5 Siswa Paling Sering Sakit</h2>
            {stat.palingSakit.filter(s => s.sakit > 0).length === 0 ? (
              <div className="empty-state"><p>Tidak ada data sakit</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table>
                  <thead><tr><th>No</th><th>NIS</th><th>Nama</th><th>Sakit</th><th>Total</th></tr></thead>
                  <tbody>
                    {stat.palingSakit.filter(s => s.sakit > 0).map((s, i) => (
                      <tr key={s.siswaId}>
                        <td>{i + 1}</td><td>{s.nis}</td><td>{s.nama}</td>
                        <td><span className="badge badge-sakit">{s.sakit}</span></td><td>{s.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="empty-state"><p>Pilih kelas untuk melihat statistik</p></div>
      )}
    </div>
  )
}
