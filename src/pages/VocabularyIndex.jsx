import { Link } from 'react-router-dom'
import { ChevronRight, CheckCircle2, Circle, Bookmark, MessageCircle, Sparkles } from 'lucide-react'
import useStore from '../store/useStore'

const vocabularySets = [
  { id: 'connectors', name: 'Logical Connectors', description: '41 essential connectors for essays', count: 41 },
  { id: 'verbs', name: 'Essential Verbs', description: '80 common verbs with conjugations', count: 80 },
  { id: 'common_nouns', name: 'Common Nouns', description: '200 most used French nouns', count: 200 },
  { id: 'adjectives', name: 'Common Adjectives', description: '80 essential adjectives', count: 80 },
  { id: 'adverbs', name: 'Common Adverbs', description: '40 frequently used adverbs', count: 40 },
  { id: 'daily_phrases', name: 'Essential Daily Phrases', description: '40 must-know everyday phrases', count: 40 },
  { id: 'conversational_expressions', name: 'Conversational Expressions', description: '50 real French expressions', count: 50, hasExpressions: true },
  { id: 'idioms', name: 'French Idioms', description: '50 idiomatic expressions to sound natural', count: 50, hasIdioms: true },
  { id: 'immigration', name: 'Immigration & Citizenship', description: 'TCF Canada thematic vocabulary', count: 20 },
  { id: 'employment', name: 'Employment & Work', description: 'Professional vocabulary', count: 20 },
  { id: 'environment', name: 'Environment', description: 'Environmental topics vocabulary', count: 20 }
]

function VocabularyIndex() {
  const { vocabularyProgress, savedExpressions } = useStore()

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

      {/* Saved Expressions Link */}
      {savedExpressions && savedExpressions.length > 0 && (
        <Link
          to="/saved-expressions"
          className="block bg-gold/10 rounded-xl border border-gold/30 p-4 hover:bg-gold/20 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bookmark size={24} className="text-gold" />
              <div>
                <h3 className="font-display font-semibold text-ink">Saved Expressions</h3>
                <p className="text-sm text-ink-light">{savedExpressions.length} expressions saved for review</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gold" />
          </div>
        </Link>
      )}

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
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-ink">{set.name}</h3>
                      {set.hasExpressions && (
                        <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          <MessageCircle size={12} />
                          Conversational
                        </span>
                      )}
                      {set.hasIdioms && (
                        <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          <Sparkles size={12} />
                          Idioms
                        </span>
                      )}
                    </div>
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
          Focus on connectors first - they're essential for writing tasks. Save idioms and expressions to revisit them later!
        </p>
      </div>
    </div>
  )
}

export default VocabularyIndex
