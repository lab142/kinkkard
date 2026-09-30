import { Link } from 'react-router-dom'

export function PrivacyPolicyPage() {
  return (
    <div className="app-shell onboarding">
      <h1>Privacy policy</h1>
      <div className="card section stack">
        <p>All data stored in Wink Kard remains in this browser and is not shared with a server.</p>
        <p>We do not collect personal data.</p>
        <p>QR codes are only used to share a card with another person.</p>
        <p>You can delete your card at any time from settings.</p>
        <p>By using this site, you agree to this policy.</p>
      </div>
      <div className="footer-action">
        <Link className="ghost" to="/settings" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          Back
        </Link>
      </div>
    </div>
  )
}

export function AboutPage() {
  return (
    <div className="app-shell onboarding">
      <h1>About Wink Kard</h1>
      <div className="card section stack">
        <p>Wink Kard helps people explore their preferences and share them in a direct way.</p>
        <p>Kink cards: create a card and share it with a QR code.</p>
        <p>Multiplayer: find shared interests with someone on this phone.</p>
        <p>Shake to play: the game picks one thing you both matched on.</p>
      </div>
      <div className="footer-action">
        <Link className="ghost" to="/settings" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          Back
        </Link>
      </div>
    </div>
  )
}
