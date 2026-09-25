import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../lib/profile-context'
import { decodePayload, payloadToGuest } from '../lib/share'

export function ImportPage() {
  const { setGuest, isComplete } = useProfile()
  const navigate = useNavigate()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    const encoded = window.location.hash.replace(/^#/, '')
    const payload = encoded ? decodePayload(encoded) : null
    if (payload) setGuest(payloadToGuest(payload))
    navigate(isComplete && payload ? '/match' : '/', { replace: true })
  }, [isComplete, navigate, setGuest])

  return (
    <div className="app-shell">
      <h1>Opening card…</h1>
    </div>
  )
}
