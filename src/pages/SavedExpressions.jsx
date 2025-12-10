import { Link } from 'react-router-dom'
import { ArrowLeft, Trash2, MessageCircle, Sparkles, BookmarkX } from 'lucide-react'
import useStore from '../store/useStore'

function SavedExpressions() {
  const { savedExpressions, removeExpression, clearSavedExpressions } = useStore()

  const idioms = savedExpressions.filter(e => e.type === 'idiom')
  const expressions = savedExpressions.filter(e => e.type === 'expression')

  if (savedExpressions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/vocabulary" className="p-2 hover:bg-sand rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-ink" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Saved Expressions</h1>
            <p className="text-ink-light mt-1">Your collection of idioms and expressions</p>
          </div>
        </div>

        <div className="bg-sand rounded-xl p-8 text-center">
          <BookmarkX size={48} className="text-ink-light mx-auto mb-4" />
          <h2 className="font-display font-semibold text-ink mb-2">No saved expressions yet</h2>
          <p className="text-ink-light mb-4">
            When you find idioms or conversational expressions you want to remember,
            click the "Save" button to add them here.
          </p>
          <Link
            to="/vocabulary/idioms"
            className="inline-block bg-bamboo text-white px-6 py-2 rounded-lg font-medium hover:bg-bamboo-dark transition-colors"
          >
            Explore Idioms
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/vocabulary" className="p-2 hover:bg-sand rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-ink" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-ink">Saved Expressions</h1>
          <p className="text-ink-light mt-1">{savedExpressions.length} expressions saved for review</p>
        </div>
        {savedExpressions.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all saved expressions?')) {
                clearSavedExpressions()
              }
            }}
            className="text-rust hover:bg-rust/10 px-3 py-2 rounded-lg text-sm transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Idioms Section */}
      {idioms.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display font-semibold text-ink flex items-center gap-2">
            <Sparkles size={20} className="text-amber-600" />
            Idioms ({idioms.length})
          </h2>
          <div className="space-y-3">
            {idioms.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-border p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        Idiom
                      </span>
                    </div>
                    <p className="text-lg font-medium text-ink">{item.french}</p>
                    <p className="text-ink-light">{item.english}</p>
                    {item.literal && (
                      <p className="text-sm text-ink-light mt-1">
                        <span className="font-medium text-ink">Literal: </span>
                        {item.literal}
                      </p>
                    )}
                    {item.example && (
                      <p className="text-sm text-ink-light mt-2 italic border-l-2 border-sand pl-3">
                        {item.example}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeExpression(item.id)}
                    className="p-2 text-ink-light hover:text-rust hover:bg-rust/10 rounded-lg transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conversational Expressions Section */}
      {expressions.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display font-semibold text-ink flex items-center gap-2">
            <MessageCircle size={20} className="text-purple-600" />
            Conversational Expressions ({expressions.length})
          </h2>
          <div className="space-y-3">
            {expressions.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-border p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        Conversational
                      </span>
                    </div>
                    <p className="text-lg font-medium text-ink">{item.french}</p>
                    <p className="text-ink-light">{item.english}</p>
                    {item.example && (
                      <p className="text-sm text-ink-light mt-2 italic border-l-2 border-sand pl-3">
                        {item.example}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeExpression(item.id)}
                    className="p-2 text-ink-light hover:text-rust hover:bg-rust/10 rounded-lg transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-sand rounded-xl p-4">
        <p className="text-sm text-ink-light">
          <span className="font-semibold text-ink">Tip:</span> Review these expressions regularly
          to commit them to memory. Idioms and conversational phrases are key to sounding natural in French!
        </p>
      </div>
    </div>
  )
}

export default SavedExpressions
