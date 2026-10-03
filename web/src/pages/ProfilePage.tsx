import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProfile } from '../lib/profile-context'
import { cardImageBlob, kinkCardText } from '../lib/share'

export function ProfilePage() {
  const { profile, resetOnboarding } = useProfile()
  const [shared, setShared] = useState(false)
  const [imageShared, setImageShared] = useState(false)

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

  const shareCardImage = async () => {
    const blob = await cardImageBlob(profile)
    const file = new File([blob], 'wink-kard.png', { type: 'image/png' })
    const payload = { files: [file], title: 'Wink Kard' }
    if (navigator.canShare?.(payload)) {
      try {
        await navigator.share(payload)
        setImageShared(true)
        window.setTimeout(() => setImageShared(false), 1600)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
      return
    }
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'wink-kard.png'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000)
    setImageShared(true)
    window.setTimeout(() => setImageShared(false), 1600)
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
        <button className="ghost" onClick={() => void shareCardImage()} type="button">
          {imageShared ? 'Shared' : 'Share card image'}
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
