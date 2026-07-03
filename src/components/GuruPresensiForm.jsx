import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { fetchSiswa, fetchMapel, fetchKelas, submitPresensi } from '../api'
import CameraCapture from './CameraCapture'

const STATUSES = ['Hadir', 'Sakit', 'Izin', 'Alpa']
const STATUS_SHORT = { Hadir: 'H', Sakit: 'S', Izin: 'I', Alpa: 'A' }

export default function GuruPresensiForm({ user }) {
  const { kelasId } = useParams()
  const [searchParams] = useSearchParams()
  const mapelId = Number(searchParams.get('mapel'))
  const tingkat = searchParams.get('tingkat') || ''

  const [siswa, setSiswa] = useState([])
  const [kelas, setKelas] = useState([])
  const [mapel, setMapel] = useState([])
  const [entries, setEntries] = useState([])
  const [cameraTarget, setCameraTarget] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [validatedCount, setValidatedCount] = useState(0)

  useEffect(() => {
    Promise.all([fetchSiswa(), fetchKelas(), fetchMapel()]).then(([s, k, m]) => {
      setSiswa(s.filter(s => s.kelasId === kelasId))
      setKelas(k)
      setMapel(m)
    })
  }, [kelasId])

  useEffect(() => {
    if (siswa.length > 0) {
      setEntries(siswa.map(s => ({ siswaId: s.id, nama: s.nama, nis: s.nis, status: 'Hadir', foto: null })))
    }
  }, [siswa])

  function updateStatus(siswaId, status) {
    setEntries(prev => prev.map(e => e.siswaId === siswaId ? { ...e, status } : e))
  }

  function handleCapture(siswaId, dataUrl) {
    const wasNull = !entries.find(e => e.siswaId === siswaId)?.foto
    setEntries(prev => prev.map(e => e.siswaId === siswaId ? { ...e, foto: dataUrl } : e))
    if (wasNull) setValidatedCount(v => v + 1)
    setCameraTarget(null)
  }

  async function handleSubmit() {
    setError(''); setSuccess(''); setLoading(true)
    try {
      const res = await submitPresensi(tingkat, kelasId, mapelId, entries)
      setSuccess(`Berhasil! ${res.count} data presensi telah dikunci dan dikirim.`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const kelasNama = kelas.find(k => k.id === kelasId)?.nama || kelasId
  const mapelNama = mapel.find(m => m.id === mapelId)?.nama || '-'
  const hasFoto = entries.some(e => e.foto)

  return (
    <>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1>Form Presensi — {kelasNama}</h1>
          <p className="text-gray-400 mt-0.5">{mapelNama} {user.mapel && `• ${user.mapel}`}</p>
        </div>
        <span className={`badge ${validatedCount > 0 ? 'badge-hadir' : 'badge-sakit'}`}>
          {validatedCount}/{entries.length} foto
        </span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {entries.map((e, i) => (
        <div className="siswa-card" key={e.siswaId}>
          <div className="siswa-card-left">
            <img
              src={e.foto || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="%23f1f5f9" rx="20"/><text x="20" y="26" text-anchor="middle" font-size="18">👤</text></svg>'}
              alt="foto siswa"
              className={`photo-thumb ${e.foto ? 'captured' : ''}`}
              onClick={() => setCameraTarget(e.siswaId)}
            />
            <div>
              <div className="siswa-nama">{e.nama}</div>
              <div className="siswa-nis">NIS: {e.nis}</div>
            </div>
          </div>
          <div className="siswa-card-right">
            <div className="radio-group-h">
              {STATUSES.map(s => (
                <label key={s}>
                  <input
                    type="radio"
                    name={`status-${e.siswaId}`}
                    checked={e.status === s}
                    onChange={() => updateStatus(e.siswaId, s)}
                  />
                  <label
                    className={`${s.toLowerCase()} ${e.status === s ? 'selected' : ''}`}
                    onClick={() => updateStatus(e.siswaId, s)}
                  >
                    {STATUS_SHORT[s]}
                  </label>
                </label>
              ))}
            </div>
          </div>
          <button
            className="btn btn-sm btn-outline flex-shrink-0 ml-1"
            onClick={() => setCameraTarget(e.siswaId)}
          >
            {e.foto ? 'Ulang' : 'Foto'}
          </button>
        </div>
      ))}
      {entries.length === 0 && (
        <div className="empty-state"><p>Memuat data siswa...</p></div>
      )}

      <div className="btn-fixed-bottom">
        <button
          className="btn btn-primary mx-auto block"
          onClick={handleSubmit}
          disabled={loading || entries.length === 0 || !hasFoto}
        >
          {loading ? 'Mengirim...' : `Kunci & Kirim Data Absensi (${entries.filter(e => e.status === 'Hadir').length} Hadir)`}
        </button>
      </div>

      {cameraTarget && (
        <CameraCapture
          onCapture={(dataUrl) => handleCapture(cameraTarget, dataUrl)}
          onClose={() => setCameraTarget(null)}
        />
      )}
    </>
  )
}
