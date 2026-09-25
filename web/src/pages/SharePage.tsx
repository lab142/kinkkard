import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { useProfile } from '../lib/profile-context'
import { toQrJson } from '../lib/share'

export function SharePage() {
  const { profile, updateProfile } = useProfile()
  const [qrSrc, setQrSrc] = useState('')
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState(profile.name)
  const qrJson = toQrJson({ ...profile, name })

  useEffect(() => {
    let cancelled = false
    QRCode.toDataURL(qrJson, {
      width: 520,
      margin: 1,
      color: { dark: '#140c10', light: '#ffffff' },
    }).then((url) => {
      if (!cancelled) setQrSrc(url)
    })
    return () => {
      cancelled = true
    }
  }, [qrJson])

  const persistName = () => {
    const trimmed = name.trim()
    if (trimmed !== profile.name) updateProfile({ name: trimmed })
  }

  return (
    <>
      <p className="eyebrow">Share</p>
      <h1>My QR code</h1>
      <p className="lede">This code is the same JSON the iPhone app scans. Point the Wink Kard camera at it to compare.</p>

      <label className="stack section">
        <span className="muted">Name on your card</span>
        <input
          className="field"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={persistName}
          placeholder="Optional"
        />
      </label>

      <div className="qr-wrap">{qrSrc ? <img src={qrSrc} alt="Your Wink Kard QR code" /> : <p>Making QR…</p>}</div>

      <div className="stack">
        <button
          className="primary"
          onClick={async () => {
            persistName()
            await navigator.clipboard.writeText(qrJson)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1600)
          }}
          type="button"
        >
          {copied ? 'Card copied' : 'Copy card JSON'}
        </button>
      </div>
    </>
  )
}
