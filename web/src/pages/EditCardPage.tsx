import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { KinkChecklist } from '../components/KinkChecklist'
import { availablePositions } from '../lib/catalogs'
import { useProfile } from '../lib/profile-context'

export function EditCardPage() {
  const { profile, updateProfile } = useProfile()
  const navigate = useNavigate()
  const [step, setStep] = useState<'positions' | 'kinks'>('positions')
  const [positions, setPositions] = useState(profile.positions)
  const [intoKinks, setIntoKinks] = useState(profile.intoKinks)
  const [wouldTryKinks, setWouldTryKinks] = useState(profile.wouldTryKinks)

  const togglePosition = (position: string) => {
    setPositions((current) =>
      current.includes(position) ? current.filter((item) => item !== position) : [...current, position],
    )
  }

  return (
    <div className="app-shell onboarding">
      {step === 'positions' ? (
        <>
          <h1>Select your favorite positions</h1>
          <div className="scroll">
            {availablePositions.map((item) => (
              <button
                key={item}
                className={positions.includes(item) ? 'choice selected' : 'choice'}
                onClick={() => togglePosition(item)}
                type="button"
              >
                {item}
                <span className="mark" />
              </button>
            ))}
          </div>
          <div className="footer-action stack">
            <button
              className="primary"
              onClick={() => {
                updateProfile({ positions })
                setStep('kinks')
              }}
              type="button"
            >
              Next
            </button>
            <Link className="ghost" to="/" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              Back
            </Link>
          </div>
        </>
      ) : (
        <>
          <h1>I am into...</h1>
          <KinkChecklist intoKinks={intoKinks} wouldTryKinks={wouldTryKinks} onChange={(into, wouldTry) => {
            setIntoKinks(into)
            setWouldTryKinks(wouldTry)
          }} />
          <div className="footer-action stack">
            <button
              className="primary"
              onClick={() => {
                updateProfile({ positions, intoKinks, wouldTryKinks })
                navigate('/')
              }}
              type="button"
            >
              Next
            </button>
            <button className="ghost" onClick={() => setStep('positions')} type="button">
              Back
            </button>
          </div>
        </>
      )}
    </div>
  )
}
