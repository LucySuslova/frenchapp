import { Link } from 'react-router-dom'
import useStore from '../store/useStore'
import readingData from '../data/reading.json'

function ReadingIndex() {
  const { readingProgress } = useStore()

  const passages = readingData.passages || []

  const getPassageScore = (passageId) => {
    const score = readingProgress.scores[passageId]
    if (!score) return null
    return `${score.score}/${score.total}`
  }

  const isCompleted = (passageId) => {
    return readingProgress.completed.includes(passageId)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-12 pb-8 border-b border-pearl">
        <p className="hero-label">Study</p>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>
          Reading Comprehension
        </h1>
        <p className="hero-subtitle">
          Advanced C1-C2 level texts based on TCF exam patterns. Build your understanding through careful reading.
        </p>
      </div>

      {/* Progress Stats */}
      <div className="card-grid mb-10" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="progress-card">
          <p className="progress-card-label">Completed</p>
          <p className="progress-card-value">{readingProgress.completed.length}</p>
          <p className="progress-card-sub">of {passages.length} passages</p>
        </div>
        <div className="progress-card">
          <p className="progress-card-label">Target Level</p>
          <p className="progress-card-value">C1-C2</p>
          <p className="progress-card-sub">NCLC 9-10+</p>
        </div>
      </div>

      {/* Passages */}
      <section className="mb-10">
        <div className="section-header">
          <span className="section-title">Reading Passages</span>
          <span className="section-count">{passages.length} texts</span>
        </div>

        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(1, 1fr)' }}>
          {passages.map((passage, index) => {
            const completed = isCompleted(passage.id)
            const score = getPassageScore(passage.id)
            const scoreObj = readingProgress.scores[passage.id]
            const isGoodScore = scoreObj && scoreObj.score >= scoreObj.total * 0.7

            return (
              <Link
                key={passage.id}
                to={`/reading/${passage.id}`}
                className="card"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <span className="card-number" style={{ marginBottom: 0 }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="card-title" style={{ marginBottom: 0 }}>
                          {passage.title}
                        </h3>
                        {passage.level && (
                          <span className="text-micro text-blush-dark uppercase">
                            {passage.level}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-grey mt-1">{passage.topic}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-silver">
                        <span>{passage.wordCount} words</span>
                        <span>{passage.questions?.length || 0} questions</span>
                        {completed && <span>✓ completed</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {score && (
                      <span
                        className="text-sm"
                        style={{ color: isGoodScore ? 'var(--color-blush-dark)' : 'var(--color-grey)' }}
                      >
                        {score}
                      </span>
                    )}
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
              </Link>
            )
          })}

          {passages.length === 0 && (
            <div className="bg-white p-12 text-center">
              <p className="text-grey">Reading passages coming soon</p>
            </div>
          )}
        </div>
      </section>

      {/* Tip */}
      <div className="bg-cream py-6 px-8 border border-pearl">
        <p className="text-sm text-stone">
          <span className="text-charcoal font-medium">TCF Canada Preparation:</span> These passages feature complex argumentative texts with sophisticated vocabulary, designed to prepare you for NCLC 9-10+ reading comprehension ♡
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

export default ReadingIndex
