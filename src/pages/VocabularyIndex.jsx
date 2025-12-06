import { Link } from 'react-router-dom'
import { ChevronRight, CheckCircle2, Circle } from 'lucide-react'
import useStore from '../store/useStore'

const vocabularySets = [
  { id: 'connectors', name: 'Logical Connectors', description: '41 essential connectors for essays', count: 41 },
  { id: 'verbs', name: 'Top Verbs', description: '80+ common verbs with conjugations', count: 80 },
  { id: 'immigration', name: 'Immigration & Citizenship', description: 'TCF Canada thematic vocabulary', count: 20 },
  { id: 'employment', name: 'Employment & Work', description: 'Professional vocabulary', count: 20 },
  { id: 'environment', name: 'Environment', description: 'Environmental topics vocabulary', count: 20 }
]

function VocabularyIndex() {
  const { vocabularyProgress } = useStore()

  const getSetProgress = (setId) => {
    const masteredInSet = vocabularyProgress.mastered.filter(id => id.startsWith(setId)).length
    const total = vocabularySets.find(s => s.id === setId)?.count || 0
    return { mastered: masteredInSet, total }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Vocabulary</h1>
        <p className="text-ink-light mt-1">Build your French vocabulary systematically</p>
      </div>

      <div className="space-y-3">
        {vocabularySets.map((set) => {
          const { mastered, total } = getSetProgress(set.id)
          const hasProgress = mastered > 0

          return (
            <Link
              key={set.id}
              to={`/vocabulary/${set.id}`}
              className="block bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {hasProgress ? (
                    <CheckCircle2 size={24} className="text-bamboo" />
                  ) : (
                    <Circle size={24} className="text-ink-light" />
                  )}
                  <div>
                    <h3 className="font-display font-semibold text-ink">{set.name}</h3>
                    <p className="text-sm text-ink-light">{set.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-ink-light">
                    {mastered}/{total} mastered
                  </span>
                  <ChevronRight size={20} className="text-ink-light" />
                </div>
              </div>
              {hasProgress && (
                <div className="mt-3 h-1.5 bg-sand rounded-full overflow-hidden">
                  <div
                    className="h-full bg-bamboo transition-all"
                    style={{ width: `${(mastered / total) * 100}%` }}
                  />
                </div>
              )}
            </Link>
          )
        })}
      </div>

      <div className="bg-sand rounded-xl p-4">
        <p className="text-sm text-ink-light">
          <span className="font-semibold text-ink">Tip:</span> Master an item by answering correctly 3 times.
          Focus on connectors first - they're essential for writing tasks.
        </p>
      </div>
    </div>
  )
}

export default VocabularyIndex
