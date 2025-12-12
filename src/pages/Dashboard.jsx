import { Link } from 'react-router-dom'
import useStore from '../store/useStore'
import grammarData from '../data/grammar.json'

function Dashboard() {
  const {
    scores,
    grammarProgress,
    vocabularyProgress,
    readingProgress,
    writingProgress,
    listeningProgress
  } = useStore()

  // Calculate grammar stats
  const grammarTopics = Object.keys(grammarProgress)
  const grammarStats = grammarTopics.reduce((acc, topicId) => {
    const p = grammarProgress[topicId]
    return {
      completed: acc.completed + p.completed,
      correct: acc.correct + p.correctFirst + p.correctRetry,
      total: acc.total + p.completed
    }
  }, { completed: 0, correct: 0, total: 0 })

  const grammarAccuracy = grammarStats.total > 0
    ? Math.round((grammarStats.correct / grammarStats.total) * 100)
    : 0

  // Find weak topics (< 70% accuracy)
  const weakTopics = grammarTopics
    .map(topicId => {
      const p = grammarProgress[topicId]
      const total = p.correctFirst + p.correctRetry + p.incorrect
      const accuracy = total > 0 ? Math.round(((p.correctFirst + p.correctRetry) / total) * 100) : 0
      return { topicId, accuracy, name: grammarData[topicId]?.name || topicId }
    })
    .filter(t => t.accuracy < 70 && t.accuracy > 0)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5)

  // Skills data
  const skills = [
    { name: 'Listening', clb: listeningProgress.completed.length > 0 ? 5 : 0, progress: Math.min(100, listeningProgress.completed.length * 10) },
    { name: 'Reading', clb: readingProgress.completed.length > 0 ? 6 : 0, progress: Math.min(100, readingProgress.completed.length * 10) },
    { name: 'Writing', clb: writingProgress.length > 0 ? 6 : 0, progress: Math.min(100, writingProgress.length * 20) },
    { name: 'Grammar', clb: grammarAccuracy >= 70 ? 6 : grammarAccuracy >= 50 ? 5 : 0, progress: grammarAccuracy },
  ]

  // Writing average
  const writingAvg = writingProgress.length > 0
    ? (writingProgress.reduce((sum, w) => sum + w.nclcScore, 0) / writingProgress.length).toFixed(1)
    : null

  // Stats
  const stats = [
    { label: 'Streak', value: Math.min(7, grammarTopics.length).toString(), sub: 'days' },
    { label: 'Exercises', value: grammarStats.completed.toString(), sub: 'completed' },
    { label: 'Accuracy', value: `${grammarAccuracy}%`, sub: 'overall' },
    { label: 'Hours', value: Math.floor(grammarStats.completed / 10).toString(), sub: 'studied' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-16 pb-10 border-b border-pearl">
        <p className="hero-label">Your Progress</p>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>
          Steady growth.
        </h1>
        <p className="hero-subtitle">
          Small, consistent steps lead to mastery. You're building something beautiful.
        </p>
      </div>

      {/* Stats */}
      <div className="card-grid mb-16" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {stats.map((stat, i) => (
          <div key={stat.label} className="progress-card">
            <p className="progress-card-label">{stat.label}</p>
            <p className="progress-card-value">{stat.value}</p>
            <p className="progress-card-sub">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Skills & Weak Areas */}
      <div className="card-grid mb-16" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {/* Skills */}
        <div className="bg-white p-10">
          <p className="section-title mb-8">Skills Progress</p>

          <div className="space-y-6">
            {skills.map((skill) => (
              <div key={skill.name} className="skill-progress">
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-clb">CLB {skill.clb || '—'}</span>
                </div>
                <div className="progress-track" style={{ height: '2px' }}>
                  <div
                    className="progress-fill"
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Areas */}
        <div className="bg-white p-10">
          <p className="section-title mb-8">Areas to Improve</p>

          {weakTopics.length > 0 ? (
            <div>
              {weakTopics.map((area) => (
                <Link
                  key={area.topicId}
                  to={`/grammar/${area.topicId}`}
                  className="weak-area-item hover:bg-cream transition-colors"
                >
                  <span className="weak-area-topic">{area.name}</span>
                  <span className="weak-area-accuracy">{area.accuracy}%</span>
                </Link>
              ))}
              <p className="text-caption text-grey mt-6">
                Focus here for the biggest improvement ♡
              </p>
            </div>
          ) : (
            <p className="text-sm text-grey">
              Complete more exercises to identify areas for improvement.
            </p>
          )}
        </div>
      </div>

      {/* Grammar Levels */}
      <section className="mb-16">
        <div className="section-header">
          <span className="section-title">Grammar Journey</span>
          <span className="section-count">7 levels</span>
        </div>

        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {[1, 2, 3, 4, 5, 6, 7].map((level) => {
            // Calculate level progress based on topics completed
            const levelTopics = Object.entries(grammarData)
              .filter(([_, topic]) => topic.level === level)
              .map(([id]) => id)

            const completedInLevel = levelTopics.filter(id => grammarProgress[id]?.completed > 0).length
            const levelProgress = levelTopics.length > 0
              ? Math.round((completedInLevel / levelTopics.length) * 100)
              : 0

            const isComplete = levelProgress === 100
            const inProgress = levelProgress > 0 && levelProgress < 100
            const locked = level > 3 && levelProgress === 0

            return (
              <div
                key={level}
                className={`level-card ${locked ? 'locked' : ''}`}
              >
                <p className="level-value">
                  {isComplete ? '✓' : locked ? '—' : level}
                </p>
                <p className="level-label">Level {level}</p>
                <p className="level-progress">
                  {isComplete ? '100%' : inProgress ? `${levelProgress}%` : locked ? 'Locked' : '0%'}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* TCF Scores (if available) */}
      {scores.lastUpdated && (
        <section className="mb-16">
          <div className="section-header">
            <span className="section-title">TCF Scores</span>
            <span className="section-count">
              Last updated: {new Date(scores.lastUpdated).toLocaleDateString()}
            </span>
          </div>

          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <div className="progress-card">
              <p className="progress-card-label">Listening</p>
              <p className="progress-card-value">{scores.listening || '—'}</p>
              <p className="progress-card-sub">Target: 458+</p>
            </div>
            <div className="progress-card">
              <p className="progress-card-label">Reading</p>
              <p className="progress-card-value">{scores.reading || '—'}</p>
              <p className="progress-card-sub">Target: 453+</p>
            </div>
            <div className="progress-card">
              <p className="progress-card-label">Writing</p>
              <p className="progress-card-value">{scores.writing || '—'}</p>
              <p className="progress-card-sub">Target: 10+</p>
            </div>
            <div className="progress-card">
              <p className="progress-card-label">Speaking</p>
              <p className="progress-card-value">{scores.speaking || '—'}</p>
              <p className="progress-card-sub">Target: 10+</p>
            </div>
          </div>
        </section>
      )}

      {/* Writing Progress */}
      {writingProgress.length > 0 && (
        <section className="mb-16">
          <div className="section-header">
            <span className="section-title">Writing Progress</span>
            <span className="section-count">{writingProgress.length} attempts</span>
          </div>

          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="progress-card">
              <p className="progress-card-label">Average Score</p>
              <p className="progress-card-value">NCLC {writingAvg}</p>
              <p className="progress-card-sub">Target: 10-11</p>
            </div>
            <div className="progress-card">
              <p className="progress-card-label">Attempts</p>
              <p className="progress-card-value">{writingProgress.length}</p>
              <p className="progress-card-sub">Keep practicing</p>
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {grammarStats.total === 0 && !scores.lastUpdated && (
        <section className="py-16 text-center">
          <h2 className="font-serif text-2xl text-black mb-4">Get Started</h2>
          <p className="text-stone mb-8 max-w-md mx-auto">
            Complete exercises to see your progress here. Every journey begins with a single step.
          </p>
          <Link to="/grammar" className="btn-primary inline-flex">
            Start with Grammar
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </section>
      )}

      {/* NCLC Reference Link */}
      <Link
        to="/nclc-table"
        className="block bg-cream py-6 text-center hover:bg-pearl transition-colors border border-pearl"
      >
        <p className="text-charcoal">
          View NCLC Conversion Table →
        </p>
      </Link>

      {/* Footer */}
      <footer className="footer mt-16">
        <p>Made with</p>
        <span className="footer-heart">♥</span>
        <p>for your journey</p>
      </footer>
    </div>
  )
}

export default Dashboard
