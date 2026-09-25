import { Link } from 'react-router-dom'
import { useProfile } from '../lib/profile-context'

export function ProfilePage() {
  const { profile, resetOnboarding } = useProfile()

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
        {profile.orientation && (
          <div className="list-block">
            <h3>Orientation</h3>
            <div className="chips">
              <span className="chip muted">{profile.orientation}</span>
            </div>
          </div>
        )}
        {profile.positions.length > 0 && (
          <div className="list-block">
            <h3>Positions</h3>
            <div className="chips">
              {profile.positions.map((item) => (
                <span className="chip pos" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
        {profile.intoKinks.length > 0 && (
          <div className="list-block">
            <h3>Into</h3>
            <div className="chips">
              {profile.intoKinks.map((item) => (
                <span className="chip into" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
        {profile.wouldTryKinks.length > 0 && (
          <div className="list-block">
            <h3>Would try</h3>
            <div className="chips">
              {profile.wouldTryKinks.map((item) => (
                <span className="chip try" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="section stack">
        <Link className="primary" to="/multiplayer" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          Multiplayer
        </Link>
        <button className="danger" onClick={resetOnboarding} type="button">
          Reset onboarding
        </button>
      </div>
    </>
  )
}
