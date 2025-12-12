import { Link } from 'react-router-dom'
import useStore from '../store/useStore'

const vocabularySets = [
  { id: 'connectors', name: 'Logical Connectors', description: '41 essential connectors for essays', count: 41, number: '01' },
  { id: 'verbs', name: 'Essential Verbs', description: '80 common verbs with conjugations', count: 80, number: '02' },
  { id: 'common_nouns', name: 'Common Nouns', description: '200 most used French nouns', count: 200, number: '03' },
  { id: 'adjectives', name: 'Common Adjectives', description: '80 essential adjectives', count: 80, number: '04' },
  { id: 'adverbs', name: 'Common Adverbs', description: '40 frequently used adverbs', count: 40, number: '05' },
  { id: 'daily_phrases', name: 'Essential Daily Phrases', description: '40 must-know everyday phrases', count: 40, number: '06' },
  { id: 'conversational_expressions', name: 'Conversational Expressions', description: '50 real French expressions', count: 50, hasExpressions: true, number: '07' },
  { id: 'idioms', name: 'French Idioms', description: '50 idiomatic expressions to sound natural', count: 50, hasIdioms: true, number: '08' },
  { id: 'immigration', name: 'Immigration & Citizenship', description: 'TCF Canada thematic vocabulary', count: 20, number: '09' },
  { id: 'employment', name: 'Employment & Work', description: 'Professional vocabulary', count: 20, number: '10' },
  { id: 'environment', name: 'Environment', description: 'Environmental topics vocabulary', count: 20, number: '11' }
]

function VocabularyIndex() {
  const { vocabularyProgress, savedExpressions } = useStore()

  const getSetProgress = (setId) => {
    const masteredInSet = vocabularyProgress.mastered.filter(id => id.startsWith(setId)).length
    const total = vocabularySets.find(s => s.id === setId)?.count || 0
    return { mastered: masteredInSet, total }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-12 pb-8 border-b border-pearl">
        <p className="hero-label">Study</p>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>
          Vocabulary
        </h1>
        <p className="hero-subtitle">
          Build your French vocabulary systematically. Master words through spaced repetition.
        </p>
      </div>

      {/* Saved Expressions Link */}
      {savedExpressions && savedExpressions.length > 0 && (
        <section className="mb-10">
          <Link
            to="/saved-expressions"
            className="card flex items-center justify-between"
            style={{ background: 'var(--color-blush-soft)', border: '1px solid var(--color-blush)' }}
          >
            <div className="flex items-center gap-4">
              <span style={{ fontSize: '1.25rem' }}>♡</span>
              <div>
                <h3 className="card-title" style={{ marginBottom: '0.25rem' }}>
                  Saved Expressions
                </h3>
                <p className="text-xs text-grey">
                  {savedExpressions.length} expressions saved for review
                </p>
              </div>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-blush-dark"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </section>
      )}

      {/* Vocabulary Sets */}
      <section className="mb-10">
        <div className="section-header">
          <span className="section-title">Vocabulary Sets</span>
          <span className="section-count">{vocabularySets.length} sets</span>
        </div>

        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(1, 1fr)' }}>
          {vocabularySets.map((set) => {
            const { mastered, total } = getSetProgress(set.id)
            const hasProgress = mastered > 0
            const progressPercent = total > 0 ? Math.round((mastered / total) * 100) : 0

            return (
              <Link
                key={set.id}
                to={`/vocabulary/${set.id}`}
                className="card"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <span className="card-number" style={{ marginBottom: 0 }}>
                      {set.number}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="card-title" style={{ marginBottom: 0 }}>
                          {set.name}
                        </h3>
                        {set.hasExpressions && (
                          <span className="text-micro text-blush-dark uppercase">
                            Conversational
                          </span>
                        )}
                        {set.hasIdioms && (
                          <span className="text-micro text-blush-dark uppercase">
                            Idioms
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-grey mt-1">{set.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-grey">
                      {mastered}/{total}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-silver"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                {hasProgress && (
                  <div className="progress-bar">
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="progress-value">{progressPercent}%</span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </section>

      {/* Tip */}
      <div className="bg-cream py-6 px-8 border border-pearl">
        <p className="text-sm text-stone">
          <span className="text-charcoal font-medium">Tip:</span> Master an item by answering correctly 3 times.
          Focus on connectors first — they're essential for writing tasks ♡
        </p>
      </div>

      {/* Footer */}
      <footer className="footer mt-16">
        <p>Made with</p>
        <span className="footer-heart">♥</span>
        <p>for your journey</p>
      </footer>
    </div>
  )
}

export default VocabularyIndex
