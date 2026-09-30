import { useState } from 'react'
import { Link } from 'react-router-dom'
import { kinkCatalog } from '../lib/catalogs'
import { useProfile } from '../lib/profile-context'

export function DiscoverPage() {
  const { profile, updateProfile } = useProfile()
  const [index, setIndex] = useState(0)
  const kink = kinkCatalog[index]
  const done = index >= kinkCatalog.length

  const advance = () => setIndex((current) => current + 1)

  const save = (bucket: 'into' | 'wouldTry') => {
    if (!kink) return
    const into = profile.intoKinks.filter((item) => item !== kink.name)
    const wouldTry = profile.wouldTryKinks.filter((item) => item !== kink.name)
    updateProfile(
      bucket === 'into'
        ? { intoKinks: [...into, kink.name], wouldTryKinks: wouldTry }
        : { wouldTryKinks: [...wouldTry, kink.name], intoKinks: into },
    )
    advance()
  }

  return (
    <div className="app-shell onboarding">
      <p className="eyebrow">Discover</p>
      <h1>Discover kinks</h1>
      {done || !kink ? (
        <p className="lede">You've explored all kinks.</p>
      ) : (
        <section className="card section">
          <h2>{kink.name}</h2>
          <p className="lede">{kink.description}</p>
          <div className="stack section">
            <button className="ghost" onClick={advance} type="button">
              Skip
            </button>
            <button className="primary" onClick={() => save('wouldTry')} type="button">
              Curious
            </button>
            <button className="primary" onClick={() => save('into')} type="button">
              Favorite
            </button>
          </div>
        </section>
      )}
      <div className="footer-action">
        <Link className="ghost" to="/" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          I am finished
        </Link>
      </div>
    </div>
  )
}
