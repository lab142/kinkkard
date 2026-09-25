import { useState } from 'react'
import { mainGenders, moreGenders } from '../lib/catalogs'

export function GenderPicker({
  value,
  onChange,
}: {
  value: string | null
  onChange: (gender: string) => void
}) {
  const [showMore, setShowMore] = useState(
    value != null && (moreGenders as readonly string[]).includes(value),
  )

  return (
    <>
      <h1>I am a</h1>
      <div className="scroll">
        {mainGenders.map((gender) => (
          <button
            key={gender}
            className={value === gender ? 'choice selected' : 'choice'}
            onClick={() => onChange(gender)}
            type="button"
          >
            {gender}
            <span className="mark" />
          </button>
        ))}
        <button className="choice" onClick={() => setShowMore((open) => !open)} type="button">
          More
        </button>
        {showMore &&
          moreGenders.map((gender) => (
            <button
              key={gender}
              className={value === gender ? 'choice selected' : 'choice'}
              onClick={() => onChange(gender)}
              type="button"
            >
              {gender}
              <span className="mark" />
            </button>
          ))}
      </div>
    </>
  )
}
