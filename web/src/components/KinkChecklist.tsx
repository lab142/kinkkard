import { useMemo, useState } from 'react'
import { kinkCatalog } from '../lib/catalogs'

type KinkChecklistProps = {
  intoKinks: string[]
  wouldTryKinks: string[]
  onChange: (intoKinks: string[], wouldTryKinks: string[]) => void
}

export function KinkChecklist({ intoKinks, wouldTryKinks, onChange }: KinkChecklistProps) {
  const [search, setSearch] = useState('')
  const [infoName, setInfoName] = useState<string | null>(null)
  const info = kinkCatalog.find((kink) => kink.name === infoName)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return kinkCatalog
    return kinkCatalog.filter((kink) => kink.name.toLowerCase().includes(query))
  }, [search])

  const setBucket = (name: string, bucket: 'into' | 'wouldTry' | null) => {
    const into = intoKinks.filter((item) => item !== name)
    const wouldTry = wouldTryKinks.filter((item) => item !== name)
    if (bucket === 'into') onChange([...into, name], wouldTry)
    else if (bucket === 'wouldTry') onChange(into, [...wouldTry, name])
    else onChange(into, wouldTry)
  }

  return (
    <>
      <div className="search">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search kinks..."
          aria-label="Search kinks"
        />
      </div>
      <div className="scroll">
        {filtered.map((kink) => {
          const into = intoKinks.includes(kink.name)
          const wouldTry = wouldTryKinks.includes(kink.name)
          return (
            <div className="kink-row" key={kink.name}>
              <div className="kink-title">
                <span>{kink.name}</span>
                <button
                  className="info-btn"
                  type="button"
                  aria-label={`${kink.name} description`}
                  onClick={() => setInfoName(kink.name)}
                >
                  ?
                </button>
              </div>
              <div className="kink-actions">
                <button
                  className={into ? 'pill active-into' : 'pill'}
                  onClick={() => setBucket(kink.name, into ? null : 'into')}
                  type="button"
                  aria-pressed={into}
                >
                  Into
                </button>
                <button
                  className={wouldTry ? 'pill active-try' : 'pill'}
                  onClick={() => setBucket(kink.name, wouldTry ? null : 'wouldTry')}
                  type="button"
                  aria-pressed={wouldTry}
                >
                  Would try
                </button>
              </div>
            </div>
          )
        })}
      </div>
      {info && (
        <div className="modal-backdrop" role="presentation" onClick={() => setInfoName(null)}>
          <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="kink-info-title" onClick={(event) => event.stopPropagation()}>
            <h2 id="kink-info-title">{info.name}</h2>
            <p>{info.description}</p>
            <button className="primary" type="button" onClick={() => setInfoName(null)}>
              Close
            </button>
          </section>
        </div>
      )}
    </>
  )
}
