import { useMemo, useState } from 'react'
import { allKinks, availablePositions, orientations } from '../lib/catalogs'
import { useProfile } from '../lib/profile-context'
import type { OnboardingStep } from '../lib/types'

export function OnboardingPage() {
  const { profile, updateProfile } = useProfile()
  const [step, setStep] = useState<Exclude<OnboardingStep, 'complete'>>(() => {
    if (!profile.hasCompletedOrientation) return 'orientation'
    if (!profile.hasCompletedPositions) return 'positions'
    return 'kinks'
  })
  const [orientation, setOrientation] = useState<string | null>(profile.orientation)
  const [positions, setPositions] = useState<string[]>(profile.positions)
  const [intoKinks, setIntoKinks] = useState<string[]>(profile.intoKinks)
  const [wouldTryKinks, setWouldTryKinks] = useState<string[]>(profile.wouldTryKinks)
  const [search, setSearch] = useState('')

  const filteredKinks = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return allKinks
    return allKinks.filter((kink) => kink.toLowerCase().includes(query))
  }, [search])

  const togglePosition = (position: string) => {
    setPositions((current) =>
      current.includes(position) ? current.filter((item) => item !== position) : [...current, position],
    )
  }

  const setKinkBucket = (kink: string, bucket: 'into' | 'wouldTry' | null) => {
    setIntoKinks((current) => current.filter((item) => item !== kink))
    setWouldTryKinks((current) => current.filter((item) => item !== kink))
    if (bucket === 'into') setIntoKinks((current) => [...current, kink])
    if (bucket === 'wouldTry') setWouldTryKinks((current) => [...current, kink])
  }

  return (
    <div className="app-shell onboarding">
      <p className="eyebrow">Wink Kard</p>
      <div className="step-dots" aria-hidden="true">
        <i className={step === 'orientation' || step === 'positions' || step === 'kinks' ? 'on' : ''} />
        <i className={step === 'positions' || step === 'kinks' ? 'on' : ''} />
        <i className={step === 'kinks' ? 'on' : ''} />
      </div>

      {step === 'orientation' && (
        <>
          <h1>Welcome to Wink Kard</h1>
          <p className="lede">Let’s start with your orientation.</p>
          <div className="scroll">
            {orientations.map((item) => (
              <button
                key={item}
                className={orientation === item ? 'choice selected' : 'choice'}
                onClick={() => setOrientation(item)}
                type="button"
              >
                {item}
                <span className="mark" />
              </button>
            ))}
          </div>
          <div className="footer-action">
            <button
              className="primary"
              disabled={!orientation}
              onClick={() => {
                if (!orientation) return
                updateProfile({
                  orientation,
                  hasCompletedOrientation: true,
                })
                setStep('positions')
              }}
              type="button"
            >
              Continue
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
          <div className="footer-action">
            <button
              className="primary"
              disabled={positions.length === 0}
              onClick={() => {
                updateProfile({
                  positions,
                  hasCompletedPositions: true,
                })
                setStep('kinks')
              }}
              type="button"
            >
              Continue
            </button>
          </div>
        </>
      )}

      {step === 'kinks' && (
        <>
          <h1>Select your interests</h1>
          <p className="lede">Mark what you’re into, and what you’d try.</p>
          <div className="search">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search kinks..."
              aria-label="Search kinks"
            />
          </div>
          <div className="scroll">
            {filteredKinks.map((kink) => {
              const into = intoKinks.includes(kink)
              const wouldTry = wouldTryKinks.includes(kink)
              return (
                <div className="kink-row" key={kink}>
                  <span>{kink}</span>
                  <div className="kink-actions">
                    <button
                      className={into ? 'pill active-into' : 'pill'}
                      onClick={() => setKinkBucket(kink, into ? null : 'into')}
                      type="button"
                      aria-pressed={into}
                      aria-label={`${kink}: into`}
                    >
                      Into
                    </button>
                    <button
                      className={wouldTry ? 'pill active-try' : 'pill'}
                      onClick={() => setKinkBucket(kink, wouldTry ? null : 'wouldTry')}
                      type="button"
                      aria-pressed={wouldTry}
                      aria-label={`${kink}: would try`}
                    >
                      Would try
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="footer-action">
            <button
              className="primary"
              disabled={intoKinks.length + wouldTryKinks.length === 0}
              onClick={() => {
                updateProfile({
                  intoKinks,
                  wouldTryKinks,
                  hasCompletedKinks: true,
                })
              }}
              type="button"
            >
              Complete setup
            </button>
          </div>
        </>
      )}
    </div>
  )
}
