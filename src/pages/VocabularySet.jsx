import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Check, X, ArrowRight, Lightbulb, Bookmark, BookmarkCheck, MessageCircle, Sparkles, RotateCcw, Trophy } from 'lucide-react'
import useStore from '../store/useStore'
import { FrenchKeyboard } from '../components/FrenchKeyboard'
import vocabularyData from '../data/vocabulary.json'

function VocabularySet() {
  const { setId } = useParams()
  const { updateVocabularyAttempt, setLastActivity, vocabularyProgress, saveExpression, removeExpression, savedExpressions } = useStore()

  const vocabSet = vocabularyData[setId]
  const items = vocabSet?.items || []

  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [mode, setMode] = useState('translate') // 'translate' or 'fill'
  const [showHint, setShowHint] = useState(false)
  const [hintLevel, setHintLevel] = useState(0)

  // Session stats tracking
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 })
  const [showCompletionStats, setShowCompletionStats] = useState(false)

  const inputRef = useRef(null)
  const currentItem = items[currentIndex]

  useEffect(() => {
    setLastActivity('vocabularySet', setId)
    // Reset session stats when changing vocabulary set
    setCurrentIndex(0)
    setSessionStats({ correct: 0, incorrect: 0 })
    setShowCompletionStats(false)
  }, [setId, setLastActivity])

  useEffect(() => {
    setUserAnswer('')
    setShowResult(false)
    setIsCorrect(false)
    setShowHint(false)
    setHintLevel(0)
    // Randomize mode
    setMode(Math.random() > 0.5 ? 'translate' : 'fill')
  }, [currentIndex])

  // Generate progressive hints for vocabulary
  const getHint = () => {
    const answer = currentItem.french

    if (hintLevel === 0) {
      return `${answer.length} characters`
    } else if (hintLevel === 1) {
      return `Starts with "${answer[0]}"`
    } else if (hintLevel === 2) {
      // Show first and last letter
      if (answer.length > 2) {
        return `${answer[0]}${'_'.repeat(answer.length - 2)}${answer[answer.length - 1]}`
      }
      return `${answer[0]}_`
    } else {
      // Show every other letter
      return answer.split('').map((char, i) => {
        if (char === ' ') return ' '
        return i % 2 === 0 ? char : '_'
      }).join('')
    }
  }

  const handleShowHint = () => {
    if (!showHint) {
      setShowHint(true)
    } else {
      setHintLevel(prev => Math.min(prev + 1, 3))
    }
  }

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
    const correct = currentItem.french.toLowerCase()

    // Allow some flexibility in answers
    const isMatch = answer === correct ||
      answer === correct.replace(/[éèêë]/g, 'e').replace(/[àâ]/g, 'a').replace(/[ùû]/g, 'u').replace(/[ôö]/g, 'o').replace(/[îï]/g, 'i').replace('ç', 'c')

    setIsCorrect(isMatch)
    setShowResult(true)
    updateVocabularyAttempt(`${setId}_${currentItem.id}`, isMatch)

    // Update session stats
    setSessionStats(prev => ({
      correct: prev.correct + (isMatch ? 1 : 0),
      incorrect: prev.incorrect + (isMatch ? 0 : 1)
    }))
  }

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Show completion stats when section is finished
      setShowCompletionStats(true)
    }
  }

  const handleRestartSession = () => {
    setCurrentIndex(0)
    setSessionStats({ correct: 0, incorrect: 0 })
    setShowCompletionStats(false)
    setUserAnswer('')
    setShowResult(false)
    setIsCorrect(false)
    setShowHint(false)
    setHintLevel(0)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !showResult) {
      checkAnswer()
    }
  }

  const isMastered = (itemId) => {
    return vocabularyProgress.mastered.includes(`${setId}_${itemId}`)
  }

  const isItemSaved = (itemId) => {
    return savedExpressions?.some(e => e.id === `${setId}_${itemId}`)
  }

  const handleSaveExpression = () => {
    const expressionData = {
      id: `${setId}_${currentItem.id}`,
      setId,
      french: currentItem.french,
      english: currentItem.english,
      example: currentItem.example,
      type: currentItem.type,
      literal: currentItem.literal
    }

    if (isItemSaved(currentItem.id)) {
      removeExpression(`${setId}_${currentItem.id}`)
    } else {
      saveExpression(expressionData)
    }
  }

  // Check if current item is an idiom or expression
  const isIdiomOrExpression = currentItem?.type === 'idiom' || currentItem?.type === 'expression'

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
        {/* Status badges row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {isMastered(currentItem.id) && (
              <div className="flex items-center gap-1 text-bamboo text-sm">
                <Check size={16} />
                <span>Mastered</span>
              </div>
            )}
            {currentItem.type === 'expression' && (
              <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                <MessageCircle size={14} />
                Conversational
              </span>
            )}
            {currentItem.type === 'idiom' && (
              <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                <Sparkles size={14} />
                Idiom
              </span>
            )}
          </div>
          {isIdiomOrExpression && (
            <button
              onClick={handleSaveExpression}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isItemSaved(currentItem.id)
                  ? 'bg-gold/20 text-gold'
                  : 'bg-sand hover:bg-sand/80 text-ink-light'
              }`}
            >
              {isItemSaved(currentItem.id) ? (
                <>
                  <BookmarkCheck size={16} />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark size={16} />
                  Save
                </>
              )}
            </button>
          )}
        </div>

        {mode === 'translate' ? (
          <div className="space-y-2">
            <p className="text-ink-light">Translate to French:</p>
            <div className="bg-sand/50 p-4 rounded-lg">
              <p className="text-2xl font-display text-ink">{currentItem.english}</p>
            </div>
            {currentItem.category && (
              <span className="inline-block text-xs bg-sand px-2 py-1 rounded text-ink-light">
                {currentItem.category}
              </span>
            )}
          </div>
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
          placeholder="Type the French word..."
          className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:border-bamboo focus:ring-1 focus:ring-bamboo outline-none transition-colors disabled:bg-sand"
        />

        <FrenchKeyboard inputRef={inputRef} />

        {/* Hint section */}
        {!showResult && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleShowHint}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-gold/20 text-gold hover:bg-gold/30 transition-colors"
            >
              <Lightbulb size={16} />
              {showHint ? 'More Hints' : 'Show Hint'}
            </button>
            {showHint && (
              <span className="text-sm text-ink-light italic">
                Hint: {getHint()}
              </span>
            )}
          </div>
        )}

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
            <p className="text-ink-light text-sm mt-1">
              <span className="font-medium text-ink">Meaning: </span>
              {currentItem.english}
            </p>
            {currentItem.literal && (
              <p className="text-ink-light text-sm mt-1">
                <span className="font-medium text-ink">Literal: </span>
                {currentItem.literal}
              </p>
            )}
            {currentItem.example && (
              <p className="text-ink-light text-sm mt-2 italic border-l-2 border-sand pl-3">{currentItem.example}</p>
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
              {currentIndex < items.length - 1 ? 'Next Item' : 'Finish'}
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Completion Stats Modal */}
      {showCompletionStats && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-6">
            {/* Header with trophy */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/20 rounded-full mb-4">
                <Trophy size={32} className="text-gold" />
              </div>
              <h2 className="font-display text-2xl font-bold text-ink">Section Complete!</h2>
              <p className="text-ink-light mt-1">{vocabSet.name}</p>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              {/* Score percentage */}
              <div className="text-center">
                <div className="text-4xl font-bold text-ink">
                  {items.length > 0 ? Math.round((sessionStats.correct / items.length) * 100) : 0}%
                </div>
                <p className="text-ink-light text-sm">Overall Score</p>
              </div>

              {/* Correct/Incorrect breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bamboo/10 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Check size={20} className="text-bamboo" />
                    <span className="text-2xl font-bold text-bamboo">{sessionStats.correct}</span>
                  </div>
                  <p className="text-sm text-ink-light">Correct</p>
                </div>
                <div className="bg-rust/10 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <X size={20} className="text-rust" />
                    <span className="text-2xl font-bold text-rust">{sessionStats.incorrect}</span>
                  </div>
                  <p className="text-sm text-ink-light">Incorrect</p>
                </div>
              </div>

              {/* Total items */}
              <div className="text-center text-sm text-ink-light">
                {items.length} items completed
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleRestartSession}
                className="w-full flex items-center justify-center gap-2 bg-bamboo text-white py-3 rounded-lg font-medium hover:bg-bamboo-dark transition-colors"
              >
                <RotateCcw size={20} />
                Practice Again
              </button>
              <Link
                to="/vocabulary"
                className="w-full flex items-center justify-center gap-2 bg-sand text-ink py-3 rounded-lg font-medium hover:bg-sand/80 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Vocabulary
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VocabularySet
