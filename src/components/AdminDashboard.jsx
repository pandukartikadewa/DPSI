import { useState, useEffect } from 'react'
import { fetchUsers, saveUserList, fetchKelas, fetchMapel } from '../api'

const ROLE_OPTIONS = [
  { value: 'guru_mapel', label: 'Guru Mapel' },
  { value: 'guru_piket', label: 'Guru Piket' },
  { value: 'wali_kelas', label: 'Wali Kelas' },
  { value: 'admin', label: 'Admin' },
]

export default function AdminDashboard() {
  const [list, setList] = useState([])
  const [kelas, setKelas] = useState([])
  const [mapel, setMapel] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ username: '', password: '', name: '', role: 'guru_mapel', mapel: '', waliKelas: '' })

  useEffect(() => {
    fetchUsers().then(setList)
    fetchKelas().then(setKelas)
    fetchMapel().then(setMapel)
  }, [])

  function resetForm() { setForm({ username: '', password: '', name: '', role: 'guru_mapel', mapel: '', waliKelas: '' }); setEditing(null) }

  function handleEdit(item) {
    setForm({ username: item.username, password: '', name: item.name, role: item.role, mapel: item.mapel || '', waliKelas: item.waliKelas || '' })
    setEditing(item.id)
  }

  async function handleSave() {
    if (!form.username || !form.name) return
    let updated
    if (editing) {
      const existing = list.find(l => l.id === editing)
      updated = list.map(l => l.id === editing ? { ...l, ...form, password: form.password || existing.password } : l)
    } else {
      if (!form.password) { alert('Password wajib diisi'); return }
      if (list.some(l => l.username === form.username)) { alert('Username sudah ada'); return }
      updated = [...list, { ...form, id: Date.now() }]
    }
    await saveUserList(updated)
    setList(updated)
    resetForm()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus pengguna ini?')) return
    const updated = list.filter(l => l.id !== id)
    await saveUserList(updated)
    setList(updated)
  }

  return (
    <div>
      <h1 className="mb-4">Kelola Akun Pengguna</h1>
      <div className="card">
        <h2 className="mb-3">{editing ? 'Edit Akun' : 'Tambah Akun Baru'}</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Username</label>
            <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="username" disabled={!!editing} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder={editing ? 'Kosongkan jika tidak diubah' : 'Password'} />
          </div>
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nama" />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value, mapel: '', waliKelas: '' }))}>
              {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          {form.role === 'guru_mapel' && (
            <div className="form-group">
              <label>Mata Pelajaran</label>
              <select value={form.mapel} onChange={e => setForm(f => ({ ...f, mapel: e.target.value }))}>
                <option value="">-- Pilih --</option>
                {mapel.map(m => <option key={m.id} value={m.nama}>{m.nama}</option>)}
              </select>
            </div>
          )}
          {form.role === 'wali_kelas' && (
            <div className="form-group">
              <label>Kelas Binaan</label>
              <select value={form.waliKelas} onChange={e => setForm(f => ({ ...f, waliKelas: e.target.value }))}>
                <option value="">-- Pilih --</option>
                {kelas.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
              </select>
            </div>
          )}
          <div className="form-group flex items-end gap-2">
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={!form.username || !form.name}>
              {editing ? 'Simpan' : 'Tambah'}
            </button>
            {editing && <button className="btn btn-outline btn-sm" onClick={resetForm}>Batal</button>}
          </div>
        </div>
      </div>
      <div className="card">
        <h2 className="mb-3">Daftar Akun</h2>
        <div className="overflow-x-auto">
          <table>
            <thead><tr><th>No</th><th>Username</th><th>Nama</th><th>Role</th><th>Keterangan</th><th>Aksi</th></tr></thead>
            <tbody>
              {list.map((l, i) => (
                <tr key={l.id}>
                  <td>{i + 1}</td>
                  <td>{l.username}</td>
                  <td>{l.name}</td>
                  <td><span className="badge badge-izin">{ROLE_OPTIONS.find(r => r.value === l.role)?.label || l.role}</span></td>
                  <td className="text-gray-400">{l.mapel || l.waliKelas || '-'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-outline" onClick={() => handleEdit(l)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(l.id)}>Hapus</button>
                    </div>
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
