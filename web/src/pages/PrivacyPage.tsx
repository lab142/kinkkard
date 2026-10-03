import { useState } from 'react'
import { Link } from 'react-router-dom'

const PRIVACY_KEY = 'winkkard.allowDataCollection'

export function PrivacyPage() {
  const [allowData, setAllowData] = useState(() => localStorage.getItem(PRIVACY_KEY) === 'true')

  return (
    <div className="app-shell onboarding">
      <h1>Privacy and security</h1>
      <label className="choice section">
        <span>Allow data collection</span>
        <input
          type="checkbox"
          checked={allowData}
          onChange={(event) => {
            setAllowData(event.target.checked)
            localStorage.setItem(PRIVACY_KEY, String(event.target.checked))
          }}
        />
      </label>
      <p className="lede">This stays on this browser. The site does not upload your card.</p>
      <div className="footer-action">
        <Link className="ghost" to="/settings" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          Back
        </Link>
      </div>
    </div>
  )
}
