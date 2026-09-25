import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../lib/profile-context'
import { parseScannedText, payloadToGuest } from '../lib/share'
import { hasGuestData } from '../lib/types'

const SAMPLE_CARD = JSON.stringify({
  name: 'Alex',
  favoritePositions: ['Missionary', 'Cowgirl'],
  intoKinks: ['Bondage', 'Roleplay'],
  wouldTryKinks: ['Spanking', 'Handcuffs'],
})

export function ScanPage() {
  const { guest, setGuest } = useProfile()
  const navigate = useNavigate()
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const [paste, setPaste] = useState('')
  const scannerRef = useRef<{ stop: () => Promise<void>; clear: () => void } | null>(null)
  const importedRef = useRef(false)

  const importText = useCallback(
    (text: string) => {
      const payload = parseScannedText(text)
      if (!payload) {
        setError('Could not read that card. Try the QR or paste the JSON / link.')
        return false
      }
      setGuest(payloadToGuest(payload))
      setError('')
      navigate('/match')
      return true
    },
    [navigate, setGuest],
  )

  useEffect(() => {
    if (!scanning) return
    importedRef.current = false
    let cancelled = false

    import('html5-qrcode').then(({ Html5Qrcode }) => {
      if (cancelled) return
      const scanner = new Html5Qrcode('wink-scanner')
      scannerRef.current = scanner

      return scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decoded) => {
          if (importedRef.current) return
          if (importText(decoded)) {
            importedRef.current = true
            scanner.stop().catch(() => undefined)
            setScanning(false)
          }
        },
        () => undefined,
      )
    }).catch(() => {
      if (!cancelled) {
        setScanning(false)
        setError('Camera is blocked or unavailable. Paste a link instead, or use the sample card.')
      }
    })

    return () => {
      cancelled = true
      scannerRef.current?.stop().catch(() => undefined)
      scannerRef.current?.clear()
      scannerRef.current = null
    }
  }, [importText, scanning])

  return (
    <>
      <p className="eyebrow">Compare</p>
      <h1>Scan a card</h1>
      <p className="lede">Scan another person’s QR code, or paste their share link, to find matches.</p>

      {scanning && <div id="wink-scanner" className="scanner-box section" />}

      {!scanning ? (
        <div className="stack section">
          <button className="primary" onClick={() => setScanning(true)} type="button">
            Start scanning
          </button>
          <button className="ghost" onClick={() => importText(SAMPLE_CARD)} type="button">
            Load sample card
          </button>
        </div>
      ) : (
        <div className="section">
          <button className="ghost" onClick={() => setScanning(false)} type="button">
            Stop camera
          </button>
        </div>
      )}

      {error && <p className="lede">{error}</p>}

      <label className="stack section">
        <span className="muted">Paste a link or JSON</span>
        <input
          className="field"
          value={paste}
          onChange={(event) => setPaste(event.target.value)}
          placeholder="https://…/m#… or { … }"
        />
        <button className="ghost" disabled={!paste.trim()} onClick={() => importText(paste)} type="button">
          Import
        </button>
      </label>

      {hasGuestData(guest) && (
        <div className="card section">
          <p className="muted">Last scanned</p>
          <h2>{guest.name || 'Guest'}</h2>
          <div className="section">
            <button className="primary" onClick={() => navigate('/match')} type="button">
              View matches
            </button>
          </div>
        </div>
      )}
    </>
  )
}
