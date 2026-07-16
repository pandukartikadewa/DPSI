import { useState, useEffect } from 'react'
import { fetchUsers, fetchKelas, fetchMapel, fetchPenempatan, createPenempatan, deletePenempatan, fetchTahunAjaran } from '../api'

export default function AdminPenempatan() {
  const [penempatan, setPenempatan] = useState([])
  const [users, setUsers] = useState([])
  const [kelas, setKelas] = useState([])
  const [mapel, setMapel] = useState([])
  const [tahunAjaran, setTahunAjaran] = useState({ current: '', list: [] })
  const [filterTahun, setFilterTahun] = useState('')
  const [form, setForm] = useState({ guruId: '', mapelId: '', kelasId: '', tahunAjaran: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [filterTahun])

  async function loadData() {
    const [kelasData, mapelData, usersData, penempatanData, tahunData] = await Promise.all([
      fetchKelas(), fetchMapel(), fetchUsers(),
      fetchPenempatan(filterTahun || undefined),
      fetchTahunAjaran()
    ])
    setKelas(kelasData)
    setMapel(mapelData)
    setUsers(usersData.filter(u => u.role === 'guru_mapel'))
    setPenempatan(penempatanData)
    setTahunAjaran(tahunData)
    if (!filterTahun) setFilterTahun(tahunData.current)
    if (!form.tahunAjaran) setForm(f => ({ ...f, tahunAjaran: tahunData.current }))
  }

  async function handleTambah() {
    if (!form.guruId || !form.mapelId || !form.kelasId || !form.tahunAjaran) {
      return alert('Semua field wajib diisi')
    }
    setLoading(true)
    try {
      await createPenempatan({
        guruId: Number(form.guruId),
        mapelId: Number(form.mapelId),
        kelasId: form.kelasId,
        tahunAjaran: form.tahunAjaran
      })
      setForm(f => ({ ...f, guruId: '', mapelId: '', kelasId: '' }))
      await loadData()
    } catch (err) {
      alert(err.message || 'Gagal menambah penempatan')
    }
    setLoading(false)
  }

  async function handleHapus(id) {
    if (!confirm('Hapus penempatan ini?')) return
    await deletePenempatan(id)
    await loadData()
  }

  return (
    <div>
      <h1 className="mb-4">Penempatan Guru di Kelas</h1>

      <div className="card mb-6">
        <h2 className="mb-3">Tambah Penempatan Baru</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Tahun Ajaran</label>
            <select value={form.tahunAjaran} onChange={e => setForm(f => ({ ...f, tahunAjaran: e.target.value }))}>
              {[tahunAjaran.current, ...tahunAjaran.list.filter(t => t !== tahunAjaran.current)].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Guru Mapel</label>
            <select value={form.guruId} onChange={e => setForm(f => ({ ...f, guruId: e.target.value }))}>
              <option value="">-- Pilih Guru --</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.mapel})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Mata Pelajaran</label>
            <select value={form.mapelId} onChange={e => setForm(f => ({ ...f, mapelId: e.target.value }))}>
              <option value="">-- Pilih Mapel --</option>
              {mapel.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Kelas</label>
            <select value={form.kelasId} onChange={e => setForm(f => ({ ...f, kelasId: e.target.value }))}>
              <option value="">-- Pilih Kelas --</option>
              {kelas.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
          </div>
          <div className="form-group flex items-end">
            <button className="btn btn-primary btn-sm" onClick={handleTambah} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Tambah'}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2>Daftar Penempatan</h2>
          <select
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50"
            value={filterTahun}
            onChange={e => setFilterTahun(e.target.value)}
          >
            <option value="">Semua Tahun</option>
            {tahunAjaran.list.map(t => <option key={t} value={t}>{t}</option>)}
            {!tahunAjaran.list.includes(tahunAjaran.current) && (
              <option value={tahunAjaran.current}>{tahunAjaran.current}</option>
            )}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr><th>No</th><th>Tahun Ajaran</th><th>Guru</th><th>Mapel</th><th>Kelas</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {penempatan.length === 0 && (
                <tr><td colSpan={6} className="text-center text-gray-400 py-8">Belum ada penempatan</td></tr>
              )}
              {penempatan.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td><span className="badge badge-info">{p.tahunAjaran}</span></td>
                  <td>{p.namaGuru}</td>
                  <td>{p.namaMapel}</td>
                  <td>{p.namaKelas}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => handleHapus(p.id)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
