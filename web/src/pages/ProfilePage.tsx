import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProfile } from '../lib/profile-context'
import { kinkCardText } from '../lib/share'

export function ProfilePage() {
  const { profile, resetOnboarding } = useProfile()
  const [shared, setShared] = useState(false)

  const shareCard = async () => {
    const text = kinkCardText(profile)
    if (navigator.share) {
      try {
        await navigator.share({ text, title: 'Wink Kard' })
        setShared(true)
        window.setTimeout(() => setShared(false), 1600)
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }
    await navigator.clipboard.writeText(text)
    setShared(true)
    window.setTimeout(() => setShared(false), 1600)
  }

  return (
    <>
      <p className="eyebrow">Your card</p>
      <h1 className="wordmark">Wink Kard</h1>
      <p className="lede">Saved on this browser. Sign-in sync comes later.</p>

      <section className="card section">
        {profile.gender && (
          <div className="list-block">
            <h3>I am a</h3>
            <div className="chips">
              <span className="chip muted">{profile.gender}</span>
            </div>
          </div>
        )}
        {profile.orientations.length > 0 && (
          <div className="list-block">
            <h3>Orientation</h3>
            <div className="chips">
              {profile.orientations.map((item) => (
                <span className="chip muted" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="list-block">
          <h3>Positions</h3>
          <ChipList items={profile.positions} kind="pos" empty="No positions selected" />
        </div>
        <div className="list-block">
          <h3>Into</h3>
          <ChipList items={profile.intoKinks} kind="into" empty="No kinks selected" />
        </div>
        <div className="list-block">
          <h3>Would try</h3>
          <ChipList items={profile.wouldTryKinks} kind="try" empty="No kinks selected" />
        </div>
      </section>

      <div className="section stack">
        <Link className="ghost" to="/edit" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          Edit card
        </Link>
        <button className="primary" onClick={() => void shareCard()} type="button">
          {shared ? 'Shared' : 'Share card'}
        </button>
        <Link className="primary" to="/multiplayer" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          Multiplayer
        </Link>
        <Link className="ghost" to="/discover" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          Kink discovery
        </Link>
        <Link className="ghost" to="/settings" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          Settings
        </Link>
        <button className="danger" onClick={resetOnboarding} type="button">
          Reset onboarding
        </button>
      </div>
    </>
  )
}

function ChipList({ items, kind, empty }: { items: string[]; kind: string; empty: string }) {
  if (items.length === 0) return <p className="muted">{empty}</p>
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
