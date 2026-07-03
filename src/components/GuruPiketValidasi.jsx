import { useState, useEffect } from 'react'
import { fetchPresensiWithFoto, fetchKelas } from '../api'

export default function GuruPiketValidasi() {
  const [records, setRecords] = useState([])
  const [kelas, setKelas] = useState([])
  const [filterKelas, setFilterKelas] = useState('')
  const [filterTanggal, setFilterTanggal] = useState('')
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState(null)

  useEffect(() => { fetchKelas().then(setKelas) }, [])

  useEffect(() => {
    setLoading(true)
    fetchPresensiWithFoto({ kelasId: filterKelas || undefined, tanggal: filterTanggal || undefined })
      .then(setRecords)
      .finally(() => setLoading(false))
  }, [filterKelas, filterTanggal])

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <h1>Log Validasi Bukti</h1>
        <span className="text-gray-400 text-xs">Review foto yang diunggah Guru Mapel</span>
      </div>

      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label>Filter Kelas</label>
            <select value={filterKelas} onChange={e => setFilterKelas(e.target.value)}>
              <option value="">Semua Kelas</option>
              {kelas.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Filter Tanggal</label>
            <input type="date" value={filterTanggal} onChange={e => setFilterTanggal(e.target.value)} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Memuat data...</div>
      ) : (
        <div className="card">
          <h2 className="mb-3">Bukti Foto Presensi ({records.length} data)</h2>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr><th>Tanggal</th><th>Jam</th><th>Kelas</th><th>Siswa</th><th>NIS</th><th>Mapel</th><th>Status</th><th>Foto Bukti</th></tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r.id}>
                    <td>{r.tanggal}</td>
                    <td>{r.jam?.slice(0, 5)}</td>
                    <td>{r.namaKelas}</td>
                    <td>{r.namaSiswa}</td>
                    <td>{r.nisSiswa}</td>
                    <td>{r.namaMapel}</td>
                    <td><span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span></td>
                    <td>
                      {r.foto ? (
                        <img src={r.foto} alt="bukti" className="photo-thumb captured cursor-pointer" onClick={() => setPreview(r.foto)} />
                      ) : (
                        <span className="text-gray-400">Tidak ada</span>
                      )}
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr><td colSpan={8}><div className="empty-state"><p>Belum ada data presensi</p></div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {preview && (
        <div className="modal-overlay" onClick={() => setPreview(null)}>
          <div className="modal max-w-[600px] text-center" onClick={e => e.stopPropagation()}>
            <h2>Bukti Foto</h2>
            <img src={preview} alt="Preview" className="max-w-full rounded mt-3" />
            <div className="mt-4">
              <button className="btn btn-outline" onClick={() => setPreview(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
