import { Link } from 'react-router-dom'
import { TrendingUp, AlertTriangle, Target, BookOpen, Languages, FileText, Headphones, PenTool } from 'lucide-react'
import useStore from '../store/useStore'
import grammarData from '../data/grammar.json'

// NCLC 7 thresholds (minimum scores to achieve NCLC 7)
const NCLC7_THRESHOLDS = {
  listening: 458,  // 458-502 is NCLC 7
  reading: 453,    // 453-498 is NCLC 7
  writing: 10,     // 10-11 is NCLC 7
  speaking: 10     // 10-11 is NCLC 7
}

// Check if a score meets NCLC 7 threshold
const meetsNCLC7 = (type, score) => {
  if (!score) return null
  const numScore = parseInt(score)
  return numScore >= NCLC7_THRESHOLDS[type]
}

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

  // NCLC estimation based on accuracy
  const estimateNCLC = (accuracy) => {
    if (accuracy >= 90) return '10-11'
    if (accuracy >= 80) return '8-9'
    if (accuracy >= 70) return '7-8'
    if (accuracy >= 60) return '6-7'
    return '5-6'
  }

  // Writing average
  const writingAvg = writingProgress.length > 0
    ? (writingProgress.reduce((sum, w) => sum + w.nclcScore, 0) / writingProgress.length).toFixed(1)
    : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Dashboard</h1>
        <p className="text-ink-light mt-1">Track your progress toward NCLC 7+</p>
      </div>

      {/* TCF Scores */}
      {scores.lastUpdated && (
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-display font-semibold text-ink mb-4 flex items-center gap-2">
            <Target size={20} className="text-bamboo" />
            Your TCF Scores
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className={`text-center p-3 rounded-lg ${
              meetsNCLC7('listening', scores.listening) === true
                ? 'bg-green-100 border border-green-300'
                : meetsNCLC7('listening', scores.listening) === false
                  ? 'bg-red-100 border border-red-300'
                  : 'bg-sand'
            }`}>
              <p className={`text-2xl font-bold ${
                meetsNCLC7('listening', scores.listening) === true
                  ? 'text-green-700'
                  : meetsNCLC7('listening', scores.listening) === false
                    ? 'text-red-700'
                    : 'text-ink'
              }`}>{scores.listening}</p>
              <p className="text-sm text-ink-light">Listening</p>
              <p className={`text-xs ${
                meetsNCLC7('listening', scores.listening) === true
                  ? 'text-green-600'
                  : 'text-bamboo'
              }`}>Target: 458+</p>
            </div>
            <div className={`text-center p-3 rounded-lg ${
              meetsNCLC7('reading', scores.reading) === true
                ? 'bg-green-100 border border-green-300'
                : meetsNCLC7('reading', scores.reading) === false
                  ? 'bg-red-100 border border-red-300'
                  : 'bg-sand'
            }`}>
              <p className={`text-2xl font-bold ${
                meetsNCLC7('reading', scores.reading) === true
                  ? 'text-green-700'
                  : meetsNCLC7('reading', scores.reading) === false
                    ? 'text-red-700'
                    : 'text-ink'
              }`}>{scores.reading}</p>
              <p className="text-sm text-ink-light">Reading</p>
              <p className={`text-xs ${
                meetsNCLC7('reading', scores.reading) === true
                  ? 'text-green-600'
                  : 'text-bamboo'
              }`}>Target: 453+</p>
            </div>
            <div className={`text-center p-3 rounded-lg ${
              meetsNCLC7('writing', scores.writing) === true
                ? 'bg-green-100 border border-green-300'
                : meetsNCLC7('writing', scores.writing) === false
                  ? 'bg-red-100 border border-red-300'
                  : 'bg-sand'
            }`}>
              <p className={`text-2xl font-bold ${
                meetsNCLC7('writing', scores.writing) === true
                  ? 'text-green-700'
                  : meetsNCLC7('writing', scores.writing) === false
                    ? 'text-red-700'
                    : 'text-ink'
              }`}>{scores.writing}</p>
              <p className="text-sm text-ink-light">Writing</p>
              <p className={`text-xs ${
                meetsNCLC7('writing', scores.writing) === true
                  ? 'text-green-600'
                  : 'text-bamboo'
              }`}>Target: 10+</p>
            </div>
            <div className={`text-center p-3 rounded-lg ${
              meetsNCLC7('speaking', scores.speaking) === true
                ? 'bg-green-100 border border-green-300'
                : meetsNCLC7('speaking', scores.speaking) === false
                  ? 'bg-red-100 border border-red-300'
                  : 'bg-sand'
            }`}>
              <p className={`text-2xl font-bold ${
                meetsNCLC7('speaking', scores.speaking) === true
                  ? 'text-green-700'
                  : meetsNCLC7('speaking', scores.speaking) === false
                    ? 'text-red-700'
                    : 'text-ink'
              }`}>{scores.speaking}</p>
              <p className="text-sm text-ink-light">Speaking</p>
              <p className={`text-xs ${
                meetsNCLC7('speaking', scores.speaking) === true
                  ? 'text-green-600'
                  : 'text-bamboo'
              }`}>Target: 10+</p>
            </div>
          </div>
          <p className="text-xs text-ink-light mt-3 text-center">
            Last updated: {new Date(scores.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/grammar" className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
          <BookOpen size={24} className="text-bamboo mb-2" />
          <p className="text-2xl font-bold text-ink">{grammarStats.completed}</p>
          <p className="text-sm text-ink-light">Grammar exercises</p>
        </Link>
        <Link to="/vocabulary" className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
          <Languages size={24} className="text-gold mb-2" />
          <p className="text-2xl font-bold text-ink">{vocabularyProgress.mastered.length}</p>
          <p className="text-sm text-ink-light">Words mastered</p>
        </Link>
        <Link to="/reading" className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
          <FileText size={24} className="text-rust mb-2" />
          <p className="text-2xl font-bold text-ink">{readingProgress.completed.length}</p>
          <p className="text-sm text-ink-light">Passages read</p>
        </Link>
        <Link to="/listening" className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
          <Headphones size={24} className="text-ink mb-2" />
          <p className="text-2xl font-bold text-ink">{listeningProgress.completed.length}</p>
          <p className="text-sm text-ink-light">Listening done</p>
        </Link>
      </div>

      {/* Grammar Performance */}
      {grammarStats.total > 0 && (
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-display font-semibold text-ink mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-bamboo" />
            Grammar Performance
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-ink-light">Overall Accuracy</span>
                <span className={grammarAccuracy >= 70 ? 'text-bamboo' : 'text-rust'}>
                  {grammarAccuracy}%
                </span>
              </div>
              <div className="h-3 bg-sand rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${grammarAccuracy >= 70 ? 'bg-bamboo' : 'bg-rust'}`}
                  style={{ width: `${grammarAccuracy}%` }}
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-bamboo">NCLC {estimateNCLC(grammarAccuracy)}</p>
              <p className="text-xs text-ink-light">Estimated</p>
            </div>
          </div>
          <p className="text-sm text-ink-light">
            {grammarTopics.length} topics started out of 47 total
          </p>
        </div>
      )}

      {/* Weak Areas */}
      {weakTopics.length > 0 && (
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-display font-semibold text-ink mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-rust" />
            Areas Needing Practice
          </h2>
          <ul className="space-y-2">
            {weakTopics.map(({ topicId, accuracy, name }) => (
              <li key={topicId}>
                <Link
                  to={`/grammar/${topicId}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-sand transition-colors"
                >
                  <span className="text-ink">{name}</span>
                  <span className="text-rust font-medium">{accuracy}%</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Writing Progress */}
      {writingProgress.length > 0 && (
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-display font-semibold text-ink mb-4 flex items-center gap-2">
            <PenTool size={20} className="text-bamboo" />
            Writing Progress
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-bamboo">NCLC {writingAvg}</p>
              <p className="text-sm text-ink-light">Average Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-ink">{writingProgress.length}</p>
              <p className="text-sm text-ink-light">Attempts</p>
            </div>
          </div>
          <p className="text-sm text-ink-light">
            Target: NCLC 10-11 for writing tasks
          </p>
        </div>
      )}

      {/* Empty State */}
      {grammarStats.total === 0 && !scores.lastUpdated && (
        <div className="bg-sand rounded-xl p-8 text-center">
          <h2 className="font-display font-semibold text-ink mb-2">Get Started</h2>
          <p className="text-ink-light mb-4">
            Complete exercises to see your progress here
          </p>
          <Link
            to="/grammar"
            className="inline-block bg-bamboo text-white px-6 py-2 rounded-lg font-medium hover:bg-bamboo-dark transition-colors"
          >
            Start with Grammar
          </Link>
        </div>
      )}

      {/* NCLC Reference Link */}
      <Link
        to="/nclc-table"
        className="block bg-sand rounded-xl p-4 text-center hover:bg-sand/80 transition-colors"
      >
        <p className="text-ink">
          View NCLC Conversion Table →
        </p>
      </Link>
    </div>
  )
}

export default Dashboard
