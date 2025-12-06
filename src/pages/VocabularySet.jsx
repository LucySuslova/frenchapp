import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Check, X, RotateCcw, ArrowRight } from 'lucide-react'
import useStore from '../store/useStore'
import { FrenchKeyboard } from '../components/FrenchKeyboard'
import vocabularyData from '../data/vocabulary.json'

function VocabularySet() {
  const { setId } = useParams()
  const { updateVocabularyAttempt, setLastActivity, vocabularyProgress } = useStore()

  const vocabSet = vocabularyData[setId]
  const items = vocabSet?.items || []

  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [mode, setMode] = useState('translate') // 'translate' or 'fill'

  const inputRef = useRef(null)
  const currentItem = items[currentIndex]

  useEffect(() => {
    setLastActivity('vocabularySet', setId)
  }, [setId, setLastActivity])

  useEffect(() => {
    setUserAnswer('')
    setShowResult(false)
    setIsCorrect(false)
    // Randomize mode
    setMode(Math.random() > 0.5 ? 'translate' : 'fill')
  }, [currentIndex])

  if (!vocabSet || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-ink-light">Vocabulary set not found or empty</p>
        <Link to="/vocabulary" className="text-bamboo hover:underline mt-2 inline-block">
          Back to Vocabulary
        </Link>
      </div>
    )
  }

  const checkAnswer = () => {
    const answer = userAnswer.trim().toLowerCase()
    const correct = mode === 'translate'
      ? currentItem.french.toLowerCase()
      : currentItem.french.toLowerCase()

    // Allow some flexibility in answers
    const isMatch = answer === correct ||
      answer === correct.replace(/[éèêë]/g, 'e').replace(/[àâ]/g, 'a').replace(/[ùû]/g, 'u').replace(/[ôö]/g, 'o').replace(/[îï]/g, 'i').replace('ç', 'c')

    setIsCorrect(isMatch)
    setShowResult(true)
    updateVocabularyAttempt(`${setId}_${currentItem.id}`, isMatch)
  }

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Shuffle and restart
      setCurrentIndex(0)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !showResult) {
      checkAnswer()
    }
  }

  const isMastered = (itemId) => {
    return vocabularyProgress.mastered.includes(`${setId}_${itemId}`)
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/vocabulary" className="p-2 hover:bg-sand rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-ink" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold text-ink">{vocabSet.name}</h1>
          <p className="text-sm text-ink-light">
            Item {currentIndex + 1} of {items.length}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-sand rounded-full overflow-hidden">
        <div
          className="h-full bg-bamboo transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
        />
      </div>

      {/* Exercise Card */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-6">
        {isMastered(currentItem.id) && (
          <div className="flex items-center gap-2 text-bamboo text-sm">
            <Check size={16} />
            <span>Mastered</span>
          </div>
        )}

        {mode === 'translate' ? (
          <>
            <p className="text-ink-light">Translate to French:</p>
            <p className="text-2xl font-display text-ink">{currentItem.english}</p>
            {currentItem.category && (
              <span className="inline-block text-xs bg-sand px-2 py-1 rounded text-ink-light">
                {currentItem.category}
              </span>
            )}
          </>
        ) : (
          <>
            <p className="text-ink-light">Complete the sentence with the correct word:</p>
            <p className="text-lg text-ink">{currentItem.example?.replace(currentItem.french, '_____') || `Use: ${currentItem.english}`}</p>
          </>
        )}

        <input
          ref={inputRef}
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={showResult}
          placeholder="Type your answer..."
          className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:border-bamboo focus:ring-1 focus:ring-bamboo outline-none transition-colors disabled:bg-sand"
        />

        <FrenchKeyboard inputRef={inputRef} />

        {/* Result */}
        {showResult && (
          <div className={`p-4 rounded-lg ${isCorrect ? 'bg-bamboo/10' : 'bg-rust/10'}`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <>
                  <Check size={20} className="text-bamboo" />
                  <span className="font-semibold text-bamboo">Correct!</span>
                </>
              ) : (
                <>
                  <X size={20} className="text-rust" />
                  <span className="font-semibold text-rust">Incorrect</span>
                </>
              )}
            </div>
            <p className="text-ink">
              <span className="text-ink-light">Answer: </span>
              <span className="font-medium">{currentItem.french}</span>
            </p>
            {currentItem.example && (
              <p className="text-ink-light text-sm mt-1 italic">{currentItem.example}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!showResult ? (
            <button
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
              className="flex-1 bg-bamboo text-white py-3 rounded-lg font-medium hover:bg-bamboo-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 bg-bamboo text-white py-3 rounded-lg font-medium hover:bg-bamboo-dark transition-colors flex items-center justify-center gap-2"
            >
              Next Item
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default VocabularySet
