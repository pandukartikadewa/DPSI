import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchKelas, fetchMapel, fetchPenempatanSaya } from '../api'
import { TINGKAT } from '../data/mockData'

export default function GuruPresensiPage({ user }) {
  const [kelas, setKelas] = useState([])
  const [mapel, setMapel] = useState([])
  const [penempatan, setPenempatan] = useState([])
  const [tingkat, setTingkat] = useState('')
  const [kelasId, setKelasId] = useState('')
  const [mapelId, setMapelId] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([fetchKelas(), fetchMapel(), fetchPenempatanSaya()]).then(([k, m, p]) => {
      setKelas(k)
      setMapel(m)
      setPenempatan(p)
    })
  }, [])

  const kelasPenempatan = penempatan.map(p => p.kelasId)
  const filteredKelas = tingkat ? kelas.filter(k => k.tingkat === tingkat && kelasPenempatan.includes(k.id)) : []

  const mapelPenempatan = kelasId ? penempatan.filter(p => p.kelasId === kelasId).map(p => p.mapelId) : []

  function handleMulai() {
    if (!kelasId || !mapelId) return
    navigate(`/guru-mapel/presensi/${kelasId}?mapel=${mapelId}&tingkat=${tingkat}`)
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <h1>Mulai Presensi</h1>
        {user.mapel && <span className="text-gray-400 text-xs">Mapel: {user.mapel}</span>}
      </div>

      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label>Tingkat Kelas</label>
            <select value={tingkat} onChange={e => { setTingkat(e.target.value); setKelasId(''); setMapelId('') }}>
              <option value="">-- Pilih Tingkat --</option>
              {TINGKAT.map(t => <option key={t} value={t}>Kelas {t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Ruang Kelas</label>
            <select value={kelasId} onChange={e => { setKelasId(e.target.value); setMapelId('') }} disabled={!tingkat}>
              <option value="">-- Pilih Kelas --</option>
              {filteredKelas.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Mata Pelajaran</label>
            <select value={mapelId} onChange={e => setMapelId(e.target.value)} disabled={!kelasId}>
              <option value="">-- Pilih Mapel --</option>
              {mapel.filter(m => mapelPenempatan.includes(m.id) || mapelPenempatan.length === 0).map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
            </select>
          </div>
          <div className="form-group flex items-end">
            <button className="btn btn-primary" onClick={handleMulai} disabled={!kelasId || !mapelId}>
              Lanjut ke Form Presensi
            </button>
          </div>
        </div>
        {penempatan.length === 0 && (
          <p className="text-xs text-amber-600 mt-3">Belum ada penempatan kelas untuk tahun ajaran ini. Hubungi admin.</p>
        )}
      </div>
    </div>
  )
}
