import { useState } from 'react'
import { login } from '../api'
import { resetData } from '../data/mockData'

const ROLE_OPTIONS = [
  { value: 'guru_mapel', label: 'Guru Mapel' },
  { value: 'guru_piket', label: 'Guru Piket' },
  { value: 'wali_kelas', label: 'Wali Kelas' },
  { value: 'admin', label: 'Admin' },
]

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('guru_mapel')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!username || !password) { setError('Isi username dan password'); return }
    setLoading(true)
    try {
      const user = await login(username, password, role)
      onLogin(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#047857] to-[#022C22] p-4">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-2xl px-8 py-10">
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-14 h-14 bg-[#10B981] rounded-2xl flex items-center justify-center shadow-lg shadow-[#10B981]/20">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-gray-900">Absensi Digital</h1>
          <p className="text-sm font-medium text-gray-500 mt-0.5">MTsN 1 Yogyakarta</p>
        </div>

        {/* Subtitle */}
        <p className="text-xs text-gray-400 text-center leading-relaxed mb-6">
          Silakan masuk untuk mencatat kehadiran dan melihat laporan harian Anda.
        </p>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-4 py-3 mb-5">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Username / NIS
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Masukkan username"
              autoFocus
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 transition-all duration-150 focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Kata Sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 transition-all duration-150 focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Masuk Sebagai
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 transition-all duration-150 focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
            >
              {ROLE_OPTIONS.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Forgot link */}
          <div className="text-right -mt-3">
            <button type="button" className="text-[11px] text-gray-400 hover:text-[#10B981] transition-colors">
              Lupa Kata Sandi?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-semibold text-white rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#10B981' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#10B981'}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Belum punya akun? <span className="text-[#10B981] font-medium">Hubungi Admin</span>
        </p>

        {/* Version */}
        <p className="text-center text-[10px] text-gray-300 mt-4">
          VERSION 2.4.0 &copy; 2024
        </p>

        {/* Reset */}
        <div className="text-center mt-2">
          <button
            type="button"
            className="text-[10px] text-gray-300 hover:text-red-400 transition-colors"
            onClick={() => { if (confirm('Reset semua data ke bawaan?')) { resetData(); window.location.reload() } }}
          >
            Reset data demo
          </button>
        </div>
      </div>
    </div>
  )
}
