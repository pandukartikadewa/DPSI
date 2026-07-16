import { useRef, useState, useEffect } from 'react'

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [captured, setCaptured] = useState(null)
  const [error, setError] = useState('')
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  async function startCamera() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      })
      setStream(s)
      if (videoRef.current) videoRef.current.srcObject = s
    } catch {
      setError('Kamera tidak dapat diakses. Periksa izin kamera.')
    }
  }

  function stopCamera() {
    if (stream) stream.getTracks().forEach(t => t.stop())
    setStream(null)
  }

  function handleCapture() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
    setCaptured(dataUrl)
    setVerified(true)
    stopCamera()
  }

  function handleRetake() {
    setCaptured(null)
    setVerified(false)
    startCamera()
  }

  function handleConfirm() {
    if (captured) onCapture(captured)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-[560px]" onClick={e => e.stopPropagation()}>
        <h2>Validasi Foto Wajah</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="text-center">
          {!captured ? (
            <>
              <div className="relative inline-block">
                <video ref={videoRef} autoPlay playsInline muted className="max-w-full rounded mb-2" />
                <div className={`camera-overlay ${verified ? 'verified' : ''}`} />
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex justify-center gap-2 mt-2">
                <button className="btn btn-primary" onClick={handleCapture}>Ambil Foto</button>
                <button className="btn btn-outline" onClick={onClose}>Batal</button>
              </div>
            </>
          ) : (
            <>
              <img src={captured} alt="Foto ditangkap" className="max-w-full rounded mb-2" />
              <div className="mb-2">
                <span className="badge badge-hadir">Foto berhasil disimpan sebagai bukti</span>
              </div>
              <div className="flex justify-center gap-2">
                <button className="btn btn-success" onClick={handleConfirm}>Gunakan Foto</button>
                <button className="btn btn-outline" onClick={handleRetake}>Ambil Ulang</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
