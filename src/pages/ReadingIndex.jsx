import { Link } from 'react-router-dom'
import { ChevronRight, CheckCircle2, Circle, FileText } from 'lucide-react'
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
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Reading Comprehension</h1>
        <p className="text-ink-light mt-1">Practice with opinion passages on TCF topics</p>
      </div>

      <div className="bg-sand rounded-xl p-4">
        <p className="text-sm text-ink-light">
          <span className="font-semibold text-ink">Progress:</span>{' '}
          {readingProgress.completed.length} of {passages.length} passages completed
        </p>
      </div>

      <div className="space-y-3">
        {passages.map((passage) => {
          const completed = isCompleted(passage.id)
          const score = getPassageScore(passage.id)

          return (
            <Link
              key={passage.id}
              to={`/reading/${passage.id}`}
              className="block bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {completed ? (
                    <CheckCircle2 size={24} className="text-bamboo mt-0.5" />
                  ) : (
                    <FileText size={24} className="text-ink-light mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-display font-semibold text-ink">{passage.title}</h3>
                    <p className="text-sm text-ink-light mt-1">{passage.topic}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-ink-light">
                      <span>{passage.wordCount} words</span>
                      <span>{passage.questions?.length || 0} questions</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {score && (
                    <span className={`text-sm font-medium ${
                      readingProgress.scores[passage.id]?.score >= readingProgress.scores[passage.id]?.total * 0.7
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

        {passages.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-border">
            <FileText size={48} className="mx-auto text-ink-light mb-4" />
            <p className="text-ink-light">Reading passages coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReadingIndex
