import { useState } from 'react'
import { GenderPicker } from '../components/GenderPicker'
import { KinkChecklist } from '../components/KinkChecklist'
import { availablePositions, orientations } from '../lib/catalogs'
import { useProfile } from '../lib/profile-context'
import type { OnboardingStep } from '../lib/types'

export function OnboardingPage() {
  const { profile, updateProfile } = useProfile()
  const [step, setStep] = useState<Exclude<OnboardingStep, 'complete'>>(() => {
    if (!profile.gender && !profile.hasCompletedOrientation) return 'splash'
    if (!profile.hasCompletedOrientation) return profile.gender ? 'orientation' : 'gender'
    if (!profile.hasCompletedPositions) return 'positions'
    return 'kinks'
  })
  const [gender, setGender] = useState<string | null>(profile.gender)
  const [selectedOrientations, setSelectedOrientations] = useState<string[]>(profile.orientations)
  const [name, setName] = useState(profile.name)
  const [positions, setPositions] = useState<string[]>(profile.positions)
  const [intoKinks, setIntoKinks] = useState<string[]>(profile.intoKinks)
  const [wouldTryKinks, setWouldTryKinks] = useState<string[]>(profile.wouldTryKinks)

  const toggleOrientation = (item: string) => {
    setSelectedOrientations((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    )
  }

  const togglePosition = (position: string) => {
    setPositions((current) =>
      current.includes(position) ? current.filter((item) => item !== position) : [...current, position],
    )
  }

  return (
    <div className="app-shell onboarding">
      <p className="eyebrow">Wink Kard</p>
      {step === 'splash' && (
        <>
          <h1>Welcome to Wink Kard</h1>
          <div className="card section">
            <p>All data is stored in this browser. Your card is not sent to a server.</p>
            <p>Discover and match with someone else by QR code or on this phone.</p>
            <p>Your privacy stays on this device.</p>
          </div>
          <div className="footer-action">
            <button className="primary" onClick={() => setStep('gender')} type="button">
              Get started
            </button>
          </div>
        </>
      )}
      {step !== 'splash' && (
      <>
      <div className="step-dots" aria-hidden="true">
        <i className="on" />
        <i className={step !== 'gender' ? 'on' : ''} />
        <i className={step === 'positions' || step === 'kinks' ? 'on' : ''} />
        <i className={step === 'kinks' ? 'on' : ''} />
      </div>

      {step === 'gender' && (
        <>
          <GenderPicker value={gender} onChange={setGender} />
          <div className="footer-action stack">
            <button
              className="primary"
              disabled={!gender}
              onClick={() => {
                if (!gender) return
                updateProfile({ gender })
                setStep('orientation')
              }}
              type="button"
            >
              Continue
            </button>
            <button className="ghost" onClick={() => setStep('splash')} type="button">
              Back
            </button>
          </div>
        </>
      )}

      {step === 'orientation' && (
        <>
          <h1>My sexual orientation is</h1>
          <p className="lede">Choose every option that fits.</p>
          <div className="scroll">
            {orientations.map((item) => (
              <button
                key={item}
                className={selectedOrientations.includes(item) ? 'choice selected' : 'choice'}
                onClick={() => toggleOrientation(item)}
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
              disabled={selectedOrientations.length === 0}
              onClick={() => {
                updateProfile({ orientations: selectedOrientations })
                setStep('name')
              }}
              type="button"
            >
              Continue
            </button>
            <button className="ghost" onClick={() => setStep('gender')} type="button">
              Back
            </button>
          </div>
        </>
      )}

      {step === 'name' && (
        <>
          <h1>What is your name?</h1>
          <label className="stack section">
            <span className="muted">Name on your card</span>
            <input className="field" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
          </label>
          <div className="footer-action stack">
            <button
              className="primary"
              disabled={!name.trim()}
              onClick={() => {
                updateProfile({
                  name: name.trim(),
                  orientations: selectedOrientations,
                  hasCompletedOrientation: true,
                })
                setStep('positions')
              }}
              type="button"
            >
              Continue
            </button>
            <button className="ghost" onClick={() => setStep('orientation')} type="button">
              Back
            </button>
          </div>
        </>
      )}

      {step === 'positions' && (
        <>
          <h1>Select your positions</h1>
          <p className="lede">Choose every option that fits. You can pick more than one.</p>
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
                updateProfile({
                  positions,
                  hasCompletedPositions: true,
                })
                setStep('kinks')
              }}
              type="button"
            >
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
          <h1>I am into...</h1>
          <p className="lede">Mark what you’re into, and what you’d try. Tap ? for a description.</p>
          <KinkChecklist
            intoKinks={intoKinks}
            wouldTryKinks={wouldTryKinks}
            onChange={(into, wouldTry) => {
              setIntoKinks(into)
              setWouldTryKinks(wouldTry)
            }}
          />
          <div className="footer-action stack">
            <button
              className="primary"
              onClick={() => {
                updateProfile({
                  intoKinks,
                  wouldTryKinks,
                  hasCompletedKinks: true,
                })
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
      </>
      )}
    </div>
  )
}
