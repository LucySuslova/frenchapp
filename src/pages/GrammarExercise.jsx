import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Check, X, ArrowRight, Shuffle, RotateCcw, Lightbulb, Volume2 } from 'lucide-react'
import useStore from '../store/useStore'
import { FrenchKeyboard } from '../components/FrenchKeyboard'
import grammarData from '../data/grammar.json'

// Fisher-Yates shuffle
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function GrammarExercise() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const {
    updateGrammarProgress,
    setLastActivity,
    recordFailedExercise,
    settings,
    grammarSessions,
    updateGrammarSession,
    clearGrammarSession
  } = useStore()

  const topic = grammarData[topicId]
  const exercises = topic?.exercises || []

  // Get saved session or initialize
  const savedSession = grammarSessions[topicId]

  const [isShuffled, setIsShuffled] = useState(savedSession?.shuffledOrder !== null)
  const [exerciseOrder, setExerciseOrder] = useState(() => {
    if (savedSession?.shuffledOrder) {
      return savedSession.shuffledOrder
    }
    return exercises.map((_, i) => i)
  })
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (savedSession?.currentIndex !== undefined && savedSession.currentIndex < exercises.length) {
      return savedSession.currentIndex
    }
    return 0
  })
  const [userAnswer, setUserAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintLevel, setHintLevel] = useState(0)

  const inputRef = useRef(null)

  // Get current exercise based on order
  const currentExerciseIndex = exerciseOrder[currentIndex]
  const currentExercise = exercises[currentExerciseIndex]

  // Save session when index or order changes
  useEffect(() => {
    if (exercises.length > 0) {
      updateGrammarSession(topicId, currentIndex, isShuffled ? exerciseOrder : null)
    }
  }, [currentIndex, exerciseOrder, isShuffled, topicId, exercises.length])

  useEffect(() => {
    setLastActivity('grammarTopic', topicId)
  }, [topicId, setLastActivity])

  useEffect(() => {
    // Reset state when exercise changes
    setUserAnswer('')
    setSelectedOption(null)
    setShowResult(false)
    setIsCorrect(false)
    setShowHint(false)
    setHintLevel(0)
  }, [currentIndex])

  // Generate progressive hints for translation exercises
  const getHint = () => {
    const answer = currentExercise.answer
    const hints = currentExercise.hints || []

    if (hints.length > 0 && hintLevel < hints.length) {
      return hints[hintLevel]
    }

    // Generate automatic hints based on answer
    if (hintLevel === 0) {
      return `${answer.length} characters`
    } else if (hintLevel === 1) {
      return `Starts with "${answer[0]}"`
    } else if (hintLevel === 2) {
      // Show first and last letter
      return `${answer[0]}${'_'.repeat(answer.length - 2)}${answer[answer.length - 1]}`
    } else {
      // Show every other letter
      return answer.split('').map((char, i) => i % 2 === 0 ? char : '_').join('')
    }
  }

  const handleShowHint = () => {
    if (!showHint) {
      setShowHint(true)
    } else {
      setHintLevel(prev => prev + 1)
    }
  }

  const handleShuffle = () => {
    if (isShuffled) {
      // Reset to sequential order
      setExerciseOrder(exercises.map((_, i) => i))
      setIsShuffled(false)
    } else {
      // Shuffle exercises
      const shuffled = shuffleArray(exercises.map((_, i) => i))
      setExerciseOrder(shuffled)
      setIsShuffled(true)
    }
    // Reset to beginning when toggling shuffle
    setCurrentIndex(0)
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    clearGrammarSession(topicId)
  }

  if (!topic) {
    return (
      <div className="text-center py-12">
        <p className="text-ink-light">Topic not found</p>
        <Link to="/grammar" className="text-bamboo hover:underline mt-2 inline-block">
          Back to Grammar
        </Link>
      </div>
    )
  }

  if (exercises.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-ink-light">No exercises available for this topic yet</p>
        <Link to="/grammar" className="text-bamboo hover:underline mt-2 inline-block">
          Back to Grammar
        </Link>
      </div>
    )
  }

  const checkAnswer = () => {
    const answer = currentExercise.type === 'multiple_choice' ? selectedOption : userAnswer.trim().toLowerCase()
    const correct = currentExercise.answer.toLowerCase()
    const isMatch = answer === correct

    setIsCorrect(isMatch)
    setShowResult(true)
  }

  const handleNext = () => {
    // Record progress - no retry, so correct means correctFirst
    const result = isCorrect ? 'correctFirst' : 'incorrect'
    updateGrammarProgress(topicId, result)

    // Record failed exercises for Review Mode (spaced repetition)
    if (result === 'incorrect') {
      recordFailedExercise(currentExercise.id, topicId, {
        id: currentExercise.id,
        type: currentExercise.type,
        instruction: currentExercise.instruction,
        question: currentExercise.question,
        options: currentExercise.options,
        answer: currentExercise.answer,
        explanation: currentExercise.explanation,
        explanationFr: currentExercise.explanationFr
      })
    }

    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Clear session when topic is completed
      clearGrammarSession(topicId)
      navigate('/grammar')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !showResult) {
      checkAnswer()
    }
  }

  const renderQuestion = () => {
    const { question, type, options } = currentExercise

    if (type === 'multiple_choice') {
      return (
        <div className="space-y-4">
          <p className="text-lg text-ink">{question}</p>
          <div className="grid gap-2">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && setSelectedOption(option)}
                disabled={showResult}
                className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                  showResult
                    ? option === currentExercise.answer
                      ? 'border-bamboo bg-bamboo/10 text-bamboo'
                      : option === selectedOption
                      ? 'border-rust bg-rust/10 text-rust'
                      : 'border-border text-ink-light'
                    : selectedOption === option
                    ? 'border-bamboo bg-bamboo/5'
                    : 'border-border hover:border-bamboo/50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )
    }

    // Translation exercise (English to French)
    if (type === 'translation') {
      return (
        <div className="space-y-4">
          <div className="bg-sand/50 p-4 rounded-lg">
            <p className="text-sm text-ink-light mb-1">Translate to French:</p>
            <p className="text-xl font-medium text-ink">{question}</p>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={showResult}
            placeholder="Type the French translation..."
            className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:border-bamboo focus:ring-1 focus:ring-bamboo outline-none transition-colors disabled:bg-sand"
          />
          <FrenchKeyboard inputRef={inputRef} />

          {/* Hint section */}
          {!showResult && (
            <div className="flex items-center gap-2">
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
        </div>
      )
    }

    // Fill in the blank (default)
    return (
      <div className="space-y-4">
        <p className="text-lg text-ink">{question}</p>
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

        {/* Hint section for fill_blank too */}
        {!showResult && currentExercise.hints && (
          <div className="flex items-center gap-2">
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
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/grammar" className="p-2 hover:bg-sand rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-ink" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold text-ink">{topic.name}</h1>
          <p className="text-sm text-ink-light">
            Exercise {currentIndex + 1} of {exercises.length}
            {isShuffled && <span className="ml-2 text-bamboo">(Shuffled)</span>}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={handleShuffle}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isShuffled
              ? 'bg-bamboo text-white'
              : 'bg-sand text-ink hover:bg-sand/80'
          }`}
        >
          <Shuffle size={16} />
          {isShuffled ? 'Shuffled' : 'Shuffle'}
        </button>
        {currentIndex > 0 && (
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-sand text-ink hover:bg-sand/80 transition-colors"
          >
            <RotateCcw size={16} />
            Restart
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-sand rounded-full overflow-hidden">
        <div
          className="h-full bg-bamboo transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
        />
      </div>

      {/* Exercise Card */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-6">
        {/* Instruction */}
        <p className="text-ink-light italic">{currentExercise.instruction}</p>

        {/* Question */}
        {renderQuestion()}

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
            <div className="space-y-2">
              {/* Show answer with pronunciation when correct, or just answer when incorrect */}
              {isCorrect && currentExercise.pronunciation ? (
                <div className="flex items-center gap-3 bg-white/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Volume2 size={18} className="text-bamboo" />
                    <span className="font-medium text-ink">{currentExercise.answer}</span>
                  </div>
                  <span className="text-ink-light">/</span>
                  <span className="font-mono text-bamboo-dark">[{currentExercise.pronunciation}]</span>
                </div>
              ) : !isCorrect && (
                <p className="text-ink">
                  <span className="text-ink-light">Answer: </span>
                  <span className="font-medium">{currentExercise.answer}</span>
                  {currentExercise.pronunciation && (
                    <span className="ml-2 font-mono text-ink-light">[{currentExercise.pronunciation}]</span>
                  )}
                </p>
              )}
              <p className="text-ink-light text-sm">
                {/* Always show French explanation when incorrect, otherwise follow user settings */}
                {!isCorrect || settings.explainInFrench
                  ? (currentExercise.explanationFr || currentExercise.explanation)
                  : currentExercise.explanation}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!showResult ? (
            <button
              onClick={checkAnswer}
              disabled={currentExercise.type === 'multiple_choice' ? !selectedOption : !userAnswer.trim()}
              className="flex-1 bg-bamboo text-white py-3 rounded-lg font-medium hover:bg-bamboo-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 bg-bamboo text-white py-3 rounded-lg font-medium hover:bg-bamboo-dark transition-colors flex items-center justify-center gap-2"
            >
              {currentIndex < exercises.length - 1 ? (
                <>
                  Next Exercise
                  <ArrowRight size={20} />
                </>
              ) : (
                'Finish Topic'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default GrammarExercise
