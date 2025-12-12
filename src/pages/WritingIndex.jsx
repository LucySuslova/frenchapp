import { Link } from 'react-router-dom'
import useStore from '../store/useStore'

const writingTasks = [
  {
    id: 'task_1',
    name: 'Short Messages',
    description: 'Write 60-word messages: invitations, requests, informal notes',
    wordLimit: 60,
    nclcTarget: '7-8',
    number: '01'
  },
  {
    id: 'task_2',
    name: 'Formal Letters',
    description: 'Write 120-word formal correspondence: complaints, inquiries, applications',
    wordLimit: 120,
    nclcTarget: '8-9',
    number: '02'
  },
  {
    id: 'task_3',
    name: 'Opinion Essays',
    description: 'Write 180-word argumentative texts on social topics',
    wordLimit: 180,
    nclcTarget: '9-10',
    number: '03'
  }
]

function WritingIndex() {
  const { writingProgress } = useStore()

  const getTaskStats = (taskId) => {
    const attempts = writingProgress.filter(w => w.taskId.startsWith(taskId))
    if (attempts.length === 0) return null
    const avgScore = attempts.reduce((sum, a) => sum + a.nclcScore, 0) / attempts.length
    return { attempts: attempts.length, avgScore: avgScore.toFixed(1) }
  }

  const totalAttempts = writingProgress.length
  const avgScore = totalAttempts > 0
    ? (writingProgress.reduce((sum, w) => sum + w.nclcScore, 0) / totalAttempts).toFixed(1)
    : null

  return (
    <div>
      {/* Header */}
      <div className="mb-12 pb-8 border-b border-pearl">
        <p className="hero-label">Study</p>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>
          Writing Practice
        </h1>
        <p className="hero-subtitle">
          Practice TCF writing tasks with AI evaluation. Build your expression through structured practice.
        </p>
      </div>

      {/* Progress Stats */}
      {totalAttempts > 0 && (
        <div className="card-grid mb-10" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <div className="progress-card">
            <p className="progress-card-label">Total Attempts</p>
            <p className="progress-card-value">{totalAttempts}</p>
            <p className="progress-card-sub">writing tasks</p>
          </div>
          <div className="progress-card">
            <p className="progress-card-label">Average Score</p>
            <p className="progress-card-value">NCLC {avgScore}</p>
            <p className="progress-card-sub">Target: 10+</p>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="bg-cream py-6 px-8 border border-pearl mb-10">
        <p className="text-micro text-grey uppercase mb-3">How it works</p>
        <ol className="text-sm text-stone space-y-1">
          <li>1. Select a task type and write your response</li>
          <li>2. Click "Generate Evaluation Prompt" when done</li>
          <li>3. Copy the generated text to Claude or ChatGPT</li>
          <li>4. Enter the NCLC score you receive back ♡</li>
        </ol>
      </div>

      {/* Writing Tasks */}
      <section className="mb-10">
        <div className="section-header">
          <span className="section-title">Task Types</span>
          <span className="section-count">3 levels</span>
        </div>

        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(1, 1fr)' }}>
          {writingTasks.map((task) => {
            const stats = getTaskStats(task.id)

            return (
              <Link
                key={task.id}
                to={`/writing/${task.id}`}
                className="card"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <span className="card-number" style={{ marginBottom: 0 }}>
                      {task.number}
                    </span>
                    <div>
                      <h3 className="card-title" style={{ marginBottom: 0 }}>
                        {task.name}
                      </h3>
                      <p className="text-xs text-grey mt-1">{task.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-silver">
                        <span>{task.wordLimit} words</span>
                        <span>Target: NCLC {task.nclcTarget}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {stats && (
                      <div className="text-right">
                        <p className="text-xs text-grey">{stats.attempts} attempts</p>
                        <p className="text-sm" style={{ color: 'var(--color-blush-dark)' }}>
                          NCLC {stats.avgScore}
                        </p>
                      </div>
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

      {/* Recent Attempts */}
      {writingProgress.length > 0 && (
        <section className="mb-10">
          <div className="section-header">
            <span className="section-title">Recent Attempts</span>
            <span className="section-count">{writingProgress.length} total</span>
          </div>

          <div className="bg-white border border-pearl">
            {writingProgress.slice(-5).reverse().map((attempt, i) => (
              <div
                key={i}
                className="flex justify-between py-4 px-6 border-b border-pearl last:border-0"
              >
                <span className="text-sm text-grey">
                  {attempt.taskId.replace('_', ' ').replace('task', 'Task')} — {new Date(attempt.date).toLocaleDateString()}
                </span>
                <span className="text-sm" style={{ color: 'var(--color-blush-dark)' }}>
                  NCLC {attempt.nclcScore}
                </span>
              </div>
            ))}
          </div>
        </section>
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

export default WritingIndex
