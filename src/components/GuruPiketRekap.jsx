import { useState, useEffect } from 'react'
import { fetchRekapKelas } from '../api'

export default function GuruPiketRekap() {
  const [rekap, setRekap] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchRekapKelas().then(d => { setRekap(d); setLoading(false) }) }, [])

  function exportCSV() {
    const header = 'Kelas,Total Siswa,Hadir,Sakit,Izin,Alpa,Belum\n'
    const rows = rekap.map(r => `${r.namaKelas},${r.totalSiswa},${r.hadir},${r.sakit},${r.izin},${r.alpa},${r.belum}`).join('\n')
    const blob = new Blob(['\ufeff' + header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `rekap_harian_${new Date().toISOString().split('T')[0]}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  function cetak() {
    const w = window.open('', '_blank')
    if (!w) return
    const today = new Date().toLocaleDateString('id-ID')
    w.document.write(`
      <html><head><title>Rekap Harian</title>
      <style>
        body { font-family: 'Inter','Segoe UI',sans-serif; padding: 40px; }
        h1 { font-size: 18px; margin-bottom: 4px; }
        h2 { font-size: 14px; color: #666; margin-bottom: 20px; font-weight: normal; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
        th { background: #f5f5f5; }
        .footer { margin-top: 40px; font-size: 11px; color: #999; text-align: center; }
      </style></head><body>
      <h1>Rekapitulasi Presensi Harian</h1>
      <h2>MTsN 1 Yogyakarta — ${today}</h2>
      <table>
        <thead><tr><th>Kelas</th><th>Total Siswa</th><th>Hadir</th><th>Sakit</th><th>Izin</th><th>Alpa</th><th>Belum</th></tr></thead>
        <tbody>
          ${rekap.map(r => `<tr><td><strong>${r.namaKelas}</strong></td><td>${r.totalSiswa}</td><td>${r.hadir}</td><td>${r.sakit}</td><td>${r.izin}</td><td>${r.alpa}</td><td>${r.belum}</td></tr>`).join('')}
        </tbody>
      </table>
      <div class="footer">Dicetak: ${today} — Sistem Absensi Digital MTsN 1 Yogyakarta</div>
      <script>window.onload=function(){window.print();setTimeout(function(){window.close()},1000)}<\/script>
    </body></html>`)
    w.document.close()
  }

  if (loading) return <div className="loading-state">Memuat...</div>

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <h1>Cetak Rekap Harian</h1>
        <div className="flex gap-2">
          <button className="btn btn-sm btn-outline" onClick={exportCSV}>Export CSV</button>
          <button className="btn btn-sm btn-primary" onClick={cetak}>Cetak / PDF</button>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-3">Rekap Harian — {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr><th>Kelas</th><th>Total Siswa</th><th>Hadir</th><th>Sakit</th><th>Izin</th><th>Alpa</th><th>Belum</th></tr>
            </thead>
            <tbody>
              {rekap.map(r => (
                <tr key={r.kelasId}>
                  <td><strong>{r.namaKelas}</strong></td>
                  <td>{r.totalSiswa}</td>
                  <td><span className="badge badge-hadir">{r.hadir}</span></td>
                  <td><span className="badge badge-sakit">{r.sakit}</span></td>
                  <td><span className="badge badge-izin">{r.izin}</span></td>
                  <td><span className="badge badge-alpa">{r.alpa}</span></td>
                  <td>{r.belum}</td>
                </tr>
              ))}
              {rekap.length === 0 && (
                <tr><td colSpan={7}><div className="empty-state"><p>Belum ada data</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
