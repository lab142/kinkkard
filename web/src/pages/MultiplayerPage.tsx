import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { allKinks, availablePositions } from '../lib/catalogs'
import { useProfile } from '../lib/profile-context'
import type { GuestProfile } from '../lib/types'

type Step = 'name' | 'positions' | 'kinks' | 'review'

export function MultiplayerPage() {
  const { setGuest } = useProfile()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('name')
  const [name, setName] = useState('')
  const [positions, setPositions] = useState<string[]>([])
  const [intoKinks, setIntoKinks] = useState<string[]>([])
  const [wouldTryKinks, setWouldTryKinks] = useState<string[]>([])

  const togglePosition = (position: string) => {
    setPositions((current) =>
      current.includes(position) ? current.filter((item) => item !== position) : [...current, position],
    )
  }

  const setKinkBucket = (kink: string, bucket: 'into' | 'wouldTry' | null) => {
    setIntoKinks((current) => current.filter((item) => item !== kink))
    setWouldTryKinks((current) => current.filter((item) => item !== kink))
    if (bucket === 'into') setIntoKinks((current) => [...current, kink])
    if (bucket === 'wouldTry') setWouldTryKinks((current) => [...current, kink])
  }

  const guest = (): GuestProfile => ({
    name: name.trim(),
    favoritePositions: positions,
    intoKinks,
    wouldTryKinks,
  })

  return (
    <div className="app-shell onboarding">
      <p className="eyebrow">Multiplayer</p>

      {step === 'name' && (
        <>
          <h1>Enter guest name</h1>
          <p className="lede">The other person fills this out on your phone. Their card is only used to compare.</p>
          <label className="stack section">
            <span className="muted">Guest’s name</span>
            <input
              className="field"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Name"
              autoFocus
            />
          </label>
          <div className="footer-action stack">
            <button className="primary" disabled={!name.trim()} onClick={() => setStep('positions')} type="button">
              Next
            </button>
            <Link className="ghost" to="/" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              Back to home
            </Link>
          </div>
        </>
      )}

      {step === 'positions' && (
        <>
          <h1>{name.trim()}’s positions</h1>
          <p className="lede">Pick every position that fits.</p>
          <div className="scroll">
            {availablePositions.map((position) => (
              <button
                key={position}
                className={positions.includes(position) ? 'choice selected' : 'choice'}
                onClick={() => togglePosition(position)}
                type="button"
              >
                {position}
                <span className="mark" />
              </button>
            ))}
          </div>
          <div className="footer-action stack">
            <button className="primary" onClick={() => setStep('kinks')} type="button">
              Next
            </button>
            <button className="ghost" onClick={() => setStep('name')} type="button">
              Back
            </button>
          </div>
        </>
      )}

      {step === 'kinks' && (
        <>
          <h1>{name.trim()}’s interests</h1>
          <p className="lede">Mark what they’re into, and what they’d try.</p>
          <div className="scroll">
            {allKinks.map((kink) => {
              const into = intoKinks.includes(kink)
              const wouldTry = wouldTryKinks.includes(kink)
              return (
                <div className="kink-row" key={kink}>
                  <span>{kink}</span>
                  <div className="kink-actions">
                    <button
                      className={into ? 'pill active-into' : 'pill'}
                      onClick={() => setKinkBucket(kink, into ? null : 'into')}
                      type="button"
                    >
                      Into
                    </button>
                    <button
                      className={wouldTry ? 'pill active-try' : 'pill'}
                      onClick={() => setKinkBucket(kink, wouldTry ? null : 'wouldTry')}
                      type="button"
                    >
                      Would try
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="footer-action stack">
            <button className="primary" onClick={() => setStep('review')} type="button">
              Next
            </button>
            <button className="ghost" onClick={() => setStep('positions')} type="button">
              Back
            </button>
          </div>
        </>
      )}

      {step === 'review' && (
        <>
          <h1>{name.trim()}</h1>
          <section className="card">
            <div className="list-block">
              <h3>Positions</h3>
              <ChipList items={positions} kind="pos" empty="No positions selected" />
            </div>
            <div className="list-block">
              <h3>Into</h3>
              <ChipList items={intoKinks} kind="into" empty="No kinks selected" />
            </div>
            <div className="list-block">
              <h3>Would try</h3>
              <ChipList items={wouldTryKinks} kind="try" empty="No kinks selected" />
            </div>
          </section>
          <div className="footer-action stack section">
            <button
              className="primary"
              onClick={() => {
                setGuest(guest())
                navigate('/match')
              }}
              type="button"
            >
              Compare kinks
            </button>
            <button className="ghost" onClick={() => setStep('kinks')} type="button">
              Back
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function ChipList({ items, kind, empty }: { items: string[]; kind: 'pos' | 'into' | 'try'; empty: string }) {
  if (items.length === 0) return <p className="empty">{empty}</p>
  return (
    <div className="chips">
      {items.map((item) => (
        <span className={`chip ${kind}`} key={item}>
          {item}
        </span>
      ))}
    </div>
  )
}
