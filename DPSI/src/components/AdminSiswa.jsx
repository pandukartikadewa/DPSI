import { useState, useEffect } from 'react'
import { fetchSiswa, saveSiswaList, fetchKelas, saveKelasList } from '../api'
import { TINGKAT } from '../data/mockData'

export default function AdminSiswa() {
  const [tab, setTab] = useState('siswa')

  return (
    <div>
      <h1 className="mb-4">Data Siswa & Pembagian Kelas</h1>
      <div className="flex gap-2 mb-4">
        <button className={`btn btn-sm ${tab === 'siswa' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('siswa')}>Data Siswa</button>
        <button className={`btn btn-sm ${tab === 'kelas' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('kelas')}>Data Kelas</button>
      </div>
      {tab === 'siswa' ? <SiswaPanel /> : <KelasPanel />}
    </div>
  )
}

function SiswaPanel() {
  const [list, setList] = useState([])
  const [kelas, setKelas] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ nis: '', nama: '', kelasId: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSiswa().then(d => { setList(d); setLoading(false) })
    fetchKelas().then(setKelas)
  }, [])

  function resetForm() { setForm({ nis: '', nama: '', kelasId: '' }); setEditing(null) }
  function handleEdit(item) { setForm({ nis: item.nis, nama: item.nama, kelasId: item.kelasId }); setEditing(item.id) }

  async function handleSave() {
    if (!form.nis || !form.nama || !form.kelasId) return
    let updated
    if (editing) {
      updated = list.map(l => l.id === editing ? { ...l, ...form } : l)
    } else {
      updated = [...list, { ...form, id: Date.now() }]
    }
    await saveSiswaList(updated)
    setList(updated)
    resetForm()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus siswa ini?')) return
    const updated = list.filter(l => l.id !== id)
    await saveSiswaList(updated)
    setList(updated)
  }

  if (loading) return <div className="loading-state">Memuat...</div>

  return (
    <div className="card">
      <h2 className="mb-3">{editing ? 'Edit Siswa' : 'Tambah Siswa Baru'}</h2>
      <div className="form-row">
        <div className="form-group">
          <label>NIS</label>
          <input value={form.nis} onChange={e => setForm(f => ({ ...f, nis: e.target.value }))} placeholder="NIS" />
        </div>
        <div className="form-group">
          <label>Nama</label>
          <input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="Nama lengkap" />
        </div>
        <div className="form-group">
          <label>Kelas</label>
          <select value={form.kelasId} onChange={e => setForm(f => ({ ...f, kelasId: e.target.value }))}>
            <option value="">-- Pilih Kelas --</option>
            {kelas.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </select>
        </div>
        <div className="form-group flex items-end gap-2">
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={!form.nis || !form.nama || !form.kelasId}>
            {editing ? 'Simpan' : 'Tambah'}
          </button>
          {editing && <button className="btn btn-outline btn-sm" onClick={resetForm}>Batal</button>}
        </div>
      </div>
      <div className="overflow-x-auto mt-4">
        <table>
          <thead><tr><th>No</th><th>NIS</th><th>Nama</th><th>Kelas</th><th>Aksi</th></tr></thead>
          <tbody>
            {list.map((l, i) => (
              <tr key={l.id}>
                <td>{i + 1}</td><td>{l.nis}</td><td>{l.nama}</td><td>{l.kelasId}</td>
                <td><div className="flex gap-2">
                  <button className="btn btn-sm btn-outline" onClick={() => handleEdit(l)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(l.id)}>Hapus</button>
                </div></td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5}><div className="empty-state"><p>Belum ada data</p></div></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function KelasPanel() {
  const [list, setList] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ id: '', tingkat: '', nama: '' })

  useEffect(() => { fetchKelas().then(setList) }, [])

  function resetForm() { setForm({ id: '', tingkat: '', nama: '' }); setEditing(null) }
  function handleEdit(item) { setForm({ id: item.id, tingkat: item.tingkat, nama: item.nama }); setEditing(item.id) }

  async function handleSave() {
    if (!form.id || !form.tingkat || !form.nama) return
    let updated
    if (editing) {
      updated = list.map(l => l.id === editing ? { ...form } : l)
    } else {
      if (list.some(l => l.id === form.id)) { alert('ID kelas sudah ada'); return }
      updated = [...list, { ...form }]
    }
    await saveKelasList(updated)
    setList(updated)
    resetForm()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus kelas ini?')) return
    const updated = list.filter(l => l.id !== id)
    await saveKelasList(updated)
    setList(updated)
  }

  return (
    <div className="card">
      <h2 className="mb-3">{editing ? 'Edit Kelas' : 'Tambah Kelas Baru'}</h2>
      <div className="form-row">
        <div className="form-group">
          <label>ID Kelas</label>
          <input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} placeholder="cth: 7A" disabled={!!editing} />
        </div>
        <div className="form-group">
          <label>Tingkat</label>
          <select value={form.tingkat} onChange={e => setForm(f => ({ ...f, tingkat: e.target.value }))}>
            <option value="">-- Pilih --</option>
            {TINGKAT.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Nama Kelas</label>
          <input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="cth: 7A" />
        </div>
        <div className="form-group flex items-end gap-2">
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={!form.id || !form.tingkat || !form.nama}>
            {editing ? 'Simpan' : 'Tambah'}
          </button>
          {editing && <button className="btn btn-outline btn-sm" onClick={resetForm}>Batal</button>}
        </div>
      </div>
      <div className="overflow-x-auto mt-4">
        <table>
          <thead><tr><th>No</th><th>ID</th><th>Tingkat</th><th>Nama</th><th>Aksi</th></tr></thead>
          <tbody>
            {list.map((l, i) => (
              <tr key={l.id}>
                <td>{i + 1}</td><td>{l.id}</td><td>Kelas {l.tingkat}</td><td>{l.nama}</td>
                <td><div className="flex gap-2">
                  <button className="btn btn-sm btn-outline" onClick={() => handleEdit(l)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(l.id)}>Hapus</button>
                </div></td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5}><div className="empty-state"><p>Belum ada data</p></div></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
