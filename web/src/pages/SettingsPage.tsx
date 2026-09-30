import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProfile } from '../lib/profile-context'

const PRIVACY_KEY = 'winkkard.allowDataCollection'

export function SettingsPage() {
  const { profile, updateProfile, resetOnboarding } = useProfile()
  const navigate = useNavigate()
  const [name, setName] = useState(profile.name)
  const [allowData, setAllowData] = useState(() => localStorage.getItem(PRIVACY_KEY) === 'true')
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="app-shell onboarding">
      <p className="eyebrow">Settings</p>
      <h1>User profile</h1>
      <div className="stack section">
        <Link className="choice" to="/">
          View your kink card
        </Link>
        <label className="stack">
          <span className="muted">Edit name</span>
          <input
            className="field"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => updateProfile({ name: name.trim() })}
          />
        </label>
        <Link className="choice" to="/privacy-policy">
          Privacy policy
        </Link>
        <Link className="choice" to="/about">
          About Wink Kard
        </Link>
      </div>
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
      {!confirmDelete ? (
        <button className="danger section" onClick={() => setConfirmDelete(true)} type="button">
          Delete all data
        </button>
      ) : (
        <section className="card section">
          <h2>Are you sure?</h2>
          <p className="lede">This erases your card and resets the site on this browser.</p>
          <div className="stack">
            <button
              className="danger"
              onClick={() => {
                localStorage.removeItem(PRIVACY_KEY)
                resetOnboarding()
                navigate('/')
              }}
              type="button"
            >
              Yes, delete everything
            </button>
            <button className="ghost" onClick={() => setConfirmDelete(false)} type="button">
              Cancel
            </button>
          </div>
        </section>
      )}
      <div className="footer-action">
        <Link className="ghost" to="/" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          Back
        </Link>
      </div>
    </div>
  )
}
