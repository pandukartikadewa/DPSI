import { useState, useEffect } from 'react'
import { fetchMapel, saveMapelList } from '../api'

export default function AdminKurikulum() {
  const [list, setList] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ nama: '' })

  useEffect(() => { fetchMapel().then(setList) }, [])

  function resetForm() { setForm({ nama: '' }); setEditing(null) }
  function handleEdit(item) { setForm({ nama: item.nama }); setEditing(item.id) }

  async function handleSave() {
    if (!form.nama) return
    let updated
    if (editing) {
      updated = list.map(l => l.id === editing ? { ...l, nama: form.nama } : l)
    } else {
      updated = [...list, { id: Date.now(), nama: form.nama }]
    }
    await saveMapelList(updated)
    setList(updated)
    resetForm()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus mata pelajaran ini?')) return
    const updated = list.filter(l => l.id !== id)
    await saveMapelList(updated)
    setList(updated)
  }

  return (
    <div>
      <h1 className="mb-4">Kurikulum & Mata Pelajaran</h1>
      <div className="card">
        <h2 className="mb-3">{editing ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Nama Mata Pelajaran</label>
            <input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="Nama mapel" />
          </div>
          <div className="form-group flex items-end gap-2">
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={!form.nama}>
              {editing ? 'Simpan' : 'Tambah'}
            </button>
            {editing && <button className="btn btn-outline btn-sm" onClick={resetForm}>Batal</button>}
          </div>
        </div>
      </div>
      <div className="card">
        <h2 className="mb-3">Daftar Mata Pelajaran</h2>
        <div className="overflow-x-auto">
          <table>
            <thead><tr><th>No</th><th>Mata Pelajaran</th><th>Aksi</th></tr></thead>
            <tbody>
              {list.map((l, i) => (
                <tr key={l.id}>
                  <td>{i + 1}</td><td>{l.nama}</td>
                  <td><div className="flex gap-2">
                    <button className="btn btn-sm btn-outline" onClick={() => handleEdit(l)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(l.id)}>Hapus</button>
                  </div></td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={3}><div className="empty-state"><p>Belum ada data</p></div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
