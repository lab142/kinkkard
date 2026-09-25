import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { calculateMatches } from '../lib/matching'
import { useProfile } from '../lib/profile-context'

type MotionEventWithPermission = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<PermissionState | 'granted' | 'denied'>
}

export function GamePage() {
  const { profile, guest } = useProfile()
  const results = calculateMatches(profile, guest)
  const pool = [
    ...results.matchingPositions,
    ...results.matchingKinks,
    ...results.wouldTryCrossMatches,
  ]
  const [pick, setPick] = useState<string | null>(null)
  const [spinning, setSpinning] = useState(false)
  const [empty, setEmpty] = useState(false)
  const usedRef = useRef<Set<string>>(new Set())
  const spinningRef = useRef(false)
  const listeningRef = useRef(false)
  const playRef = useRef<() => void>(() => undefined)

  const play = () => {
    if (spinningRef.current) return
    if (pool.length === 0) {
      setEmpty(true)
      return
    }

    let available = pool.filter((item) => !usedRef.current.has(item))
    if (available.length === 0) {
      usedRef.current.clear()
      available = pool
    }

    spinningRef.current = true
    setSpinning(true)
    setEmpty(false)
    navigator.vibrate?.(40)

    window.setTimeout(() => {
      const next = available[Math.floor(Math.random() * available.length)]
      usedRef.current.add(next)
      setPick(next)
      setSpinning(false)
      spinningRef.current = false
    }, 1000)
  }

  playRef.current = play

  const enableShake = async () => {
    const motion = DeviceMotionEvent as MotionEventWithPermission
    if (typeof motion.requestPermission === 'function') {
      const status = await motion.requestPermission()
      if (status !== 'granted') return
    }
    if (listeningRef.current) return
    listeningRef.current = true
    window.addEventListener('devicemotion', (event) => {
      const acc = event.acceleration
      if (!acc) return
      const threshold = 15
      if (
        Math.abs(acc.x ?? 0) > threshold ||
        Math.abs(acc.y ?? 0) > threshold ||
        Math.abs(acc.z ?? 0) > threshold
      ) {
        playRef.current()
      }
    })
  }

  return (
    <div className="app-shell game-page">
      <p className="eyebrow">With {guest.name || 'Guest'}</p>
      <h1>Shake to play</h1>
      <button
        className={spinning ? 'devil spinning' : 'devil'}
        type="button"
        aria-label="Pick a shared interest"
        onClick={() => {
          void enableShake()
          play()
        }}
      >
        😈
      </button>
      {pick ? <p className="game-pick">{pick}</p> : <p className="lede">Shake your phone or tap the devil.</p>}
      {empty && <p className="lede">There are no shared kinks or positions to play with.</p>}
      <div className="footer-action">
        <Link className="primary" to="/match" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          Back to matches
        </Link>
      </div>
    </div>
  )
}
