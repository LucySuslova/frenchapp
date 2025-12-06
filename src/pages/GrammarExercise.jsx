import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Check, X, RotateCcw, ArrowRight } from 'lucide-react'
import useStore from '../store/useStore'
import { FrenchKeyboard } from '../components/FrenchKeyboard'
import grammarData from '../data/grammar.json'

function GrammarExercise() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const { updateGrammarProgress, setLastActivity, recordFailedExercise } = useStore()

  const topic = grammarData[topicId]
  const exercises = topic?.exercises || []

  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [hasRetried, setHasRetried] = useState(false)
  const [wasCorrectFirst, setWasCorrectFirst] = useState(false)

  const inputRef = useRef(null)

  const currentExercise = exercises[currentIndex]

  useEffect(() => {
    setLastActivity('grammarTopic', topicId)
  }, [topicId, setLastActivity])

  useEffect(() => {
    // Reset state when exercise changes
    setUserAnswer('')
    setSelectedOption(null)
    setShowResult(false)
    setIsCorrect(false)
    setHasRetried(false)
    setWasCorrectFirst(false)
  }, [currentIndex])

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

    if (isMatch && !hasRetried) {
      setWasCorrectFirst(true)
    }
  }

  const handleRetry = () => {
    setShowResult(false)
    setUserAnswer('')
    setSelectedOption(null)
    setHasRetried(true)
  }

  const handleNext = () => {
    // Record progress
    let result = 'incorrect'
    if (isCorrect && wasCorrectFirst) {
      result = 'correctFirst'
    } else if (isCorrect) {
      result = 'correctRetry'
    }
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
        explanation: currentExercise.explanation
      })
    }

    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
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

    // Fill in the blank
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
          </p>
        </div>
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
                  <span className="font-semibold text-rust">
                    {hasRetried ? 'Incorrect' : 'Not quite right'}
                  </span>
                </>
              )}
            </div>
            {(!isCorrect || showResult) && (
              <div className="space-y-2">
                <p className="text-ink">
                  <span className="text-ink-light">Answer: </span>
                  <span className="font-medium">{currentExercise.answer}</span>
                </p>
                <p className="text-ink-light text-sm">{currentExercise.explanation}</p>
              </div>
            )}
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
          ) : isCorrect || hasRetried ? (
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
          ) : (
            <button
              onClick={handleRetry}
              className="flex-1 bg-gold text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default GrammarExercise
