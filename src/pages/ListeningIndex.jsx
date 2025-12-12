import { Link } from 'react-router-dom'
import useStore from '../store/useStore'
import listeningData from '../data/listening.json'

function ListeningIndex() {
  const { listeningProgress } = useStore()

  const exercises = listeningData.exercises || []

  const getExerciseScore = (exerciseId) => {
    const score = listeningProgress.scores[exerciseId]
    if (!score) return null
    return `${score.score}/${score.total}`
  }

  const isCompleted = (exerciseId) => {
    return listeningProgress.completed.includes(exerciseId)
  }

  // Group by difficulty
  const grouped = exercises.reduce((acc, ex) => {
    const level = ex.difficulty || 'B1'
    if (!acc[level]) acc[level] = []
    acc[level].push(ex)
    return acc
  }, {})

  return (
    <div>
      {/* Header */}
      <div className="mb-12 pb-8 border-b border-pearl">
        <p className="hero-label">Study</p>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>
          Listening Practice
        </h1>
        <p className="hero-subtitle">
          Curated exercises with comprehension questions. Train your ear for natural French speech.
        </p>
      </div>

      {/* Progress Stats */}
      <div className="card-grid mb-10" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="progress-card">
          <p className="progress-card-label">Completed</p>
          <p className="progress-card-value">{listeningProgress.completed.length}</p>
          <p className="progress-card-sub">exercises</p>
        </div>
        <div className="progress-card">
          <p className="progress-card-label">Total Available</p>
          <p className="progress-card-value">{exercises.length}</p>
          <p className="progress-card-sub">exercises</p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-cream py-6 px-8 border border-pearl mb-10">
        <p className="text-micro text-grey uppercase mb-3">How it works</p>
        <ol className="text-sm text-stone space-y-1">
          <li>1. Click an exercise to see details and the external link</li>
          <li>2. Listen to the audio/video on the external site</li>
          <li>3. Return here to answer comprehension questions</li>
          <li>4. Track your scores and progress ♡</li>
        </ol>
      </div>

      {/* Exercises by Level */}
      {['B1', 'B2', 'C1'].map((level) => {
        const levelExercises = grouped[level] || []
        if (levelExercises.length === 0) return null

        const completedCount = levelExercises.filter(e => isCompleted(e.id)).length

        return (
          <section key={level} className="mb-10">
            <div className="section-header">
              <span className="section-title">Level {level}</span>
              <span className="section-count">
                {completedCount}/{levelExercises.length} completed
              </span>
            </div>

            <div className="card-grid" style={{ gridTemplateColumns: 'repeat(1, 1fr)' }}>
              {levelExercises.map((exercise, index) => {
                const completed = isCompleted(exercise.id)
                const score = getExerciseScore(exercise.id)
                const scoreObj = listeningProgress.scores[exercise.id]
                const isGoodScore = scoreObj && scoreObj.score >= scoreObj.total * 0.7

                return (
                  <Link
                    key={exercise.id}
                    to={`/listening/${exercise.id}`}
                    className="card"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <span className="card-number" style={{ marginBottom: 0 }}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3 className="card-title" style={{ marginBottom: 0 }}>
                            {exercise.title}
                          </h3>
                          <p className="text-xs text-grey mt-1">{exercise.source}</p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-silver">
                            <span>{exercise.duration}</span>
                            <span>{exercise.questions?.length || 0} questions</span>
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
            </div>
          </section>
        )
      })}

      {exercises.length === 0 && (
        <div className="bg-white p-12 text-center border border-pearl">
          <p className="text-grey">Listening exercises coming soon</p>
        </div>
      )}

      {/* Footer */}
      <footer className="footer mt-16">
        <p>Made with</p>
        <span className="footer-heart">♥</span>
        <p>for your journey</p>
      </footer>
    </div>
  )
}

export default ListeningIndex
