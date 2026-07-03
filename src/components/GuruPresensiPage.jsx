import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchKelas, fetchMapel } from '../api'
import { TINGKAT } from '../data/mockData'

export default function GuruPresensiPage({ user }) {
  const [kelas, setKelas] = useState([])
  const [mapel, setMapel] = useState([])
  const [tingkat, setTingkat] = useState('')
  const [kelasId, setKelasId] = useState('')
  const [mapelId, setMapelId] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    fetchKelas().then(setKelas)
    fetchMapel().then(setMapel)
    const qKelas = searchParams.get('kelas')
    const qTingkat = searchParams.get('tingkat')
    if (qKelas) setKelasId(qKelas)
    if (qTingkat) setTingkat(qTingkat)
  }, [])

  const filteredKelas = tingkat ? kelas.filter(k => k.tingkat === tingkat) : []

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
            <select value={tingkat} onChange={e => { setTingkat(e.target.value); setKelasId('') }}>
              <option value="">-- Pilih Tingkat --</option>
              {TINGKAT.map(t => <option key={t} value={t}>Kelas {t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Ruang Kelas</label>
            <select value={kelasId} onChange={e => setKelasId(e.target.value)} disabled={!tingkat}>
              <option value="">-- Pilih Kelas --</option>
              {filteredKelas.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Mata Pelajaran</label>
            <select value={mapelId} onChange={e => setMapelId(e.target.value)}>
              <option value="">-- Pilih Mapel --</option>
              {mapel.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
            </select>
          </div>
          <div className="form-group flex items-end">
            <button className="btn btn-primary" onClick={handleMulai} disabled={!kelasId || !mapelId}>
              Lanjut ke Form Presensi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
