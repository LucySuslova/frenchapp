import { Link } from 'react-router-dom'
import { ChevronRight, CheckCircle2, Headphones, ExternalLink } from 'lucide-react'
import useStore from '../store/useStore'
import listeningData from '../data/listening.json'

const difficultyColors = {
  B1: 'bg-bamboo',
  B2: 'bg-gold',
  C1: 'bg-rust'
}

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
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Listening Practice</h1>
        <p className="text-ink-light mt-1">Curated exercises with comprehension questions</p>
      </div>

      <div className="bg-sand rounded-xl p-4">
        <h3 className="font-semibold text-ink mb-2">How it works:</h3>
        <ol className="text-sm text-ink-light space-y-1 list-decimal list-inside">
          <li>Click an exercise to see details and the external link</li>
          <li>Listen to the audio/video on the external site</li>
          <li>Return here to answer comprehension questions</li>
          <li>Track your scores and progress</li>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex justify-around text-center">
          <div>
            <p className="text-2xl font-bold text-bamboo">{listeningProgress.completed.length}</p>
            <p className="text-sm text-ink-light">Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-bamboo">{exercises.length}</p>
            <p className="text-sm text-ink-light">Total</p>
          </div>
        </div>
      </div>

      {['B1', 'B2', 'C1'].map((level) => {
        const levelExercises = grouped[level] || []
        if (levelExercises.length === 0) return null

        return (
          <div key={level} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-white text-sm ${difficultyColors[level]}`}>
                {level}
              </span>
              <span className="text-ink-light text-sm">
                {levelExercises.filter(e => isCompleted(e.id)).length}/{levelExercises.length} completed
              </span>
            </div>

            {levelExercises.map((exercise) => {
              const completed = isCompleted(exercise.id)
              const score = getExerciseScore(exercise.id)

              return (
                <Link
                  key={exercise.id}
                  to={`/listening/${exercise.id}`}
                  className="block bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {completed ? (
                        <CheckCircle2 size={24} className="text-bamboo mt-0.5" />
                      ) : (
                        <Headphones size={24} className="text-ink-light mt-0.5" />
                      )}
                      <div>
                        <h3 className="font-display font-semibold text-ink">{exercise.title}</h3>
                        <p className="text-sm text-ink-light mt-1">{exercise.source}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-ink-light">
                          <span>{exercise.duration}</span>
                          <span>{exercise.questions?.length || 0} questions</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {score && (
                        <span className={`text-sm font-medium ${
                          listeningProgress.scores[exercise.id]?.score >= listeningProgress.scores[exercise.id]?.total * 0.7
                            ? 'text-bamboo'
                            : 'text-rust'
                        }`}>
                          {score}
                        </span>
                      )}
                      <ChevronRight size={20} className="text-ink-light" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )
      })}

      {exercises.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-border">
          <Headphones size={48} className="mx-auto text-ink-light mb-4" />
          <p className="text-ink-light">Listening exercises coming soon</p>
        </div>
      )}
    </div>
  )
}

export default ListeningIndex
