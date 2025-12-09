import { Link } from 'react-router-dom'
import { ChevronRight, PenTool } from 'lucide-react'
import useStore from '../store/useStore'

const writingTasks = [
  {
    id: 'task_1',
    name: 'Task 1: Short Messages',
    description: 'Write 60-word messages: invitations, requests, informal notes',
    wordLimit: 60,
    nclcTarget: '7-8'
  },
  {
    id: 'task_2',
    name: 'Task 2: Formal Letters',
    description: 'Write 120-word formal correspondence: complaints, inquiries, applications',
    wordLimit: 120,
    nclcTarget: '8-9'
  },
  {
    id: 'task_3',
    name: 'Task 3: Opinion Essays',
    description: 'Write 180-word argumentative texts on social topics',
    wordLimit: 180,
    nclcTarget: '9-10'
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Writing Practice</h1>
        <p className="text-ink-light mt-1">Practice TCF writing tasks with AI evaluation</p>
      </div>

      <div className="bg-sand rounded-xl p-4">
        <h3 className="font-semibold text-ink mb-2">How it works:</h3>
        <ol className="text-sm text-ink-light space-y-1 list-decimal list-inside">
          <li>Select a task type and write your response</li>
          <li>Click "Generate Evaluation Prompt" when done</li>
          <li>Copy the generated text to Claude or ChatGPT</li>
          <li>Enter the NCLC score you receive back into the app</li>
        </ol>
      </div>

      <div className="space-y-3">
        {writingTasks.map((task) => {
          const stats = getTaskStats(task.id)

          return (
            <Link
              key={task.id}
              to={`/writing/${task.id}`}
              className="block bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <PenTool size={24} className="text-bamboo mt-0.5" />
                  <div>
                    <h3 className="font-display font-semibold text-ink">{task.name}</h3>
                    <p className="text-sm text-ink-light mt-1">{task.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-ink-light">
                      <span>{task.wordLimit} words</span>
                      <span>Target: NCLC {task.nclcTarget}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {stats && (
                    <div className="text-right text-sm">
                      <p className="text-ink-light">{stats.attempts} attempts</p>
                      <p className="text-bamboo font-medium">Avg NCLC {stats.avgScore}</p>
                    </div>
                  )}
                  <ChevronRight size={20} className="text-ink-light" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {writingProgress.length > 0 && (
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="font-display font-semibold text-ink mb-3">Recent Attempts</h3>
          <div className="space-y-2">
            {writingProgress.slice(-5).reverse().map((attempt, i) => (
              <div key={i} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                <span className="text-ink-light">
                  {attempt.taskId.replace('_', ' ').toUpperCase()} - {new Date(attempt.date).toLocaleDateString()}
                </span>
                <span className="text-bamboo font-medium">NCLC {attempt.nclcScore}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default WritingIndex
