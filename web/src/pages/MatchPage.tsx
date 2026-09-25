import { Link } from 'react-router-dom'
import { calculateMatches } from '../lib/matching'
import { useProfile } from '../lib/profile-context'
import { hasGuestData } from '../lib/types'

function ChipList({ items, kind }: { items: string[]; kind: 'pos' | 'into' | 'try' | 'both' }) {
  if (items.length === 0) return <p className="empty">None found.</p>
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

export function MatchPage() {
  const { profile, guest } = useProfile()
  const results = calculateMatches(profile, guest)

  if (!hasGuestData(guest)) {
    return (
      <>
        <h1>Match results</h1>
        <p className="lede">Scan a card first to compare lists.</p>
        <Link className="primary" to="/scan" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          Go to scanner
        </Link>
      </>
    )
  }

  return (
    <div className="match-page">
      <p className="eyebrow">With {guest.name || 'Guest'}</p>
      <h1>Shared interests</h1>

      <section className="section">
        <h2>Matching positions</h2>
        <ChipList items={results.matchingPositions} kind="pos" />
      </section>
      <section className="section">
        <h2>Matching kinks</h2>
        <ChipList items={results.matchingKinks} kind="into" />
      </section>
      <section className="section">
        <h2>Would-try matches</h2>
        <p className="lede">One of you is into it, the other would try it.</p>
        <ChipList items={results.wouldTryCrossMatches} kind="try" />
      </section>
      <section className="section">
        <h2>Both would try</h2>
        <ChipList items={results.bothWouldTryMatches} kind="both" />
      </section>

      <div className="section">
        <Link className="primary" to="/scan" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          Done
        </Link>
      </div>
    </div>
  )
}
