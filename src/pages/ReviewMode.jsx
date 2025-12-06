import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, X, RotateCcw, ArrowRight, RefreshCw, AlertTriangle, Trophy } from 'lucide-react'
import useStore from '../store/useStore'
import { FrenchKeyboard } from '../components/FrenchKeyboard'
import grammarData from '../data/grammar.json'

function ReviewMode() {
  const navigate = useNavigate()
  const {
    grammarProgress,
    failedExercises,
    recordFailedExercise,
    recordReviewSuccess
  } = useStore()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [hasRetried, setHasRetried] = useState(false)
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 })
  const [sessionComplete, setSessionComplete] = useState(false)

  const inputRef = useRef(null)

  // Build review queue: combine weak topic exercises + recently failed exercises
  const reviewQueue = useMemo(() => {
    const queue = []
    const addedExerciseIds = new Set()

    // 1. Add recently failed exercises with higher weight (add them first, possibly multiple times)
    const sortedFailed = [...failedExercises].sort((a, b) => {
      // Weight by: recency of failure + number of failures
      const aScore = a.failCount * 2 + (Date.now() - new Date(a.lastFailedAt).getTime()) / (1000 * 60 * 60 * 24)
      const bScore = b.failCount * 2 + (Date.now() - new Date(b.lastFailedAt).getTime()) / (1000 * 60 * 60 * 24)
      // Lower score = higher priority (more recent, more failures)
      return aScore - bScore
    })

    // Add failed exercises (they get priority)
    sortedFailed.forEach(failed => {
      if (failed.exerciseData) {
        queue.push({
          ...failed.exerciseData,
          topicId: failed.topicId,
          topicName: grammarData[failed.topicId]?.name || 'Unknown Topic',
          source: 'failed',
          priority: failed.failCount
        })
        addedExerciseIds.add(failed.exerciseId)
      }
    })

    // 2. Add exercises from weak topics (accuracy < 70%)
    Object.entries(grammarProgress).forEach(([topicId, progress]) => {
      const total = progress.correctFirst + progress.correctRetry + progress.incorrect
      if (total === 0) return

      const accuracy = ((progress.correctFirst + progress.correctRetry) / total) * 100

      if (accuracy < 70) {
        const topic = grammarData[topicId]
        if (!topic?.exercises) return

        // Add exercises from this weak topic
        topic.exercises.forEach(exercise => {
          if (!addedExerciseIds.has(exercise.id)) {
            queue.push({
              ...exercise,
              topicId,
              topicName: topic.name,
              source: 'weak_topic',
              accuracy: accuracy.toFixed(0)
            })
            addedExerciseIds.add(exercise.id)
          }
        })
      }
    })

    // Shuffle weak topic exercises but keep failed ones at the front
    const failedExercisesQueue = queue.filter(e => e.source === 'failed')
    const weakTopicExercises = queue.filter(e => e.source === 'weak_topic')

    // Shuffle weak topic exercises
    for (let i = weakTopicExercises.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [weakTopicExercises[i], weakTopicExercises[j]] = [weakTopicExercises[j], weakTopicExercises[i]]
    }

    // Interleave: 1 failed, then 2 weak topic exercises
    const interleaved = []
    let failedIdx = 0
    let weakIdx = 0
    let pattern = 0

    while (failedIdx < failedExercisesQueue.length || weakIdx < weakTopicExercises.length) {
      if (pattern === 0 && failedIdx < failedExercisesQueue.length) {
        interleaved.push(failedExercisesQueue[failedIdx++])
        pattern = 1
      } else if (weakIdx < weakTopicExercises.length) {
        interleaved.push(weakTopicExercises[weakIdx++])
        if (pattern >= 2) pattern = 0
        else pattern++
      } else if (failedIdx < failedExercisesQueue.length) {
        interleaved.push(failedExercisesQueue[failedIdx++])
      }
    }

    // Limit to 20 exercises per session
    return interleaved.slice(0, 20)
  }, [grammarProgress, failedExercises])

  const currentExercise = reviewQueue[currentIndex]

  useEffect(() => {
    // Reset state when exercise changes
    setUserAnswer('')
    setSelectedOption(null)
    setShowResult(false)
    setIsCorrect(false)
    setHasRetried(false)
  }, [currentIndex])

  // No exercises to review
  if (reviewQueue.length === 0 && !sessionComplete) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-sand rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-ink" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-bold text-ink">Review Mode</h1>
            <p className="text-sm text-ink-light">Spaced repetition for weak areas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-bamboo/10 rounded-full flex items-center justify-center mx-auto">
            <Trophy size={32} className="text-bamboo" />
          </div>
          <h2 className="font-display text-lg font-bold text-ink">Nothing to Review!</h2>
          <p className="text-ink-light max-w-md mx-auto">
            Great job! You don't have any weak areas to review right now.
            Keep practicing grammar topics to build your skills, and any exercises
            you struggle with will appear here for extra practice.
          </p>
          <div className="pt-4 space-y-2">
            <Link
              to="/grammar"
              className="block w-full bg-bamboo text-white py-3 rounded-lg font-medium hover:bg-bamboo-dark transition-colors"
            >
              Practice Grammar
            </Link>
            <Link
              to="/dashboard"
              className="block w-full border border-border text-ink py-3 rounded-lg font-medium hover:bg-sand transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Session complete
  if (sessionComplete) {
    const totalAnswered = sessionStats.correct + sessionStats.incorrect
    const accuracy = totalAnswered > 0 ? (sessionStats.correct / totalAnswered * 100).toFixed(0) : 0

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-sand rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-ink" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-bold text-ink">Review Complete!</h1>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-bamboo/10 rounded-full flex items-center justify-center mx-auto">
            <Trophy size={40} className="text-bamboo" />
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-ink mb-2">Session Stats</h2>
            <p className="text-ink-light">You reviewed {totalAnswered} exercises</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-sand rounded-lg p-4">
              <p className="text-2xl font-bold text-bamboo">{sessionStats.correct}</p>
              <p className="text-sm text-ink-light">Correct</p>
            </div>
            <div className="bg-sand rounded-lg p-4">
              <p className="text-2xl font-bold text-rust">{sessionStats.incorrect}</p>
              <p className="text-sm text-ink-light">Incorrect</p>
            </div>
            <div className="bg-sand rounded-lg p-4">
              <p className="text-2xl font-bold text-ink">{accuracy}%</p>
              <p className="text-sm text-ink-light">Accuracy</p>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <button
              onClick={() => {
                setCurrentIndex(0)
                setSessionStats({ correct: 0, incorrect: 0 })
                setSessionComplete(false)
              }}
              className="w-full bg-bamboo text-white py-3 rounded-lg font-medium hover:bg-bamboo-dark transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Start New Session
            </button>
            <Link
              to="/dashboard"
              className="block w-full border border-border text-ink py-3 rounded-lg font-medium hover:bg-sand transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const checkAnswer = () => {
    const answer = currentExercise.type === 'multiple_choice'
      ? selectedOption
      : userAnswer.trim().toLowerCase()
    const correct = currentExercise.answer.toLowerCase()
    const isMatch = answer === correct

    setIsCorrect(isMatch)
    setShowResult(true)
  }

  const handleRetry = () => {
    setShowResult(false)
    setUserAnswer('')
    setSelectedOption(null)
    setHasRetried(true)
  }

  const handleNext = () => {
    // Update stats and record progress
    if (isCorrect) {
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }))
      // Record success in review mode - helps remove from queue after 2 successes
      if (currentExercise.source === 'failed') {
        recordReviewSuccess(currentExercise.id)
      }
    } else {
      setSessionStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }))
      // Record the failure for future review
      recordFailedExercise(currentExercise.id, currentExercise.topicId, {
        id: currentExercise.id,
        type: currentExercise.type,
        instruction: currentExercise.instruction,
        question: currentExercise.question,
        options: currentExercise.options,
        answer: currentExercise.answer,
        explanation: currentExercise.explanation
      })
    }

    if (currentIndex < reviewQueue.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setSessionComplete(true)
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
        <Link to="/" className="p-2 hover:bg-sand rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-ink" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold text-ink">Review Mode</h1>
          <p className="text-sm text-ink-light">
            Exercise {currentIndex + 1} of {reviewQueue.length}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-ink-light">Session Score</p>
          <p className="font-medium">
            <span className="text-bamboo">{sessionStats.correct}</span>
            {' / '}
            <span className="text-rust">{sessionStats.incorrect}</span>
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-sand rounded-full overflow-hidden">
        <div
          className="h-full bg-bamboo transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / reviewQueue.length) * 100}%` }}
        />
      </div>

      {/* Source Badge */}
      <div className="flex items-center gap-2">
        {currentExercise.source === 'failed' ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-rust/10 text-rust text-xs rounded-full">
            <AlertTriangle size={12} />
            Previously Failed ({currentExercise.priority}x)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gold/20 text-gold text-xs rounded-full">
            Weak Topic ({currentExercise.accuracy}% accuracy)
          </span>
        )}
        <span className="text-sm text-ink-light">{currentExercise.topicName}</span>
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
            <div className="space-y-2">
              <p className="text-ink">
                <span className="text-ink-light">Answer: </span>
                <span className="font-medium">{currentExercise.answer}</span>
              </p>
              <p className="text-ink-light text-sm">{currentExercise.explanation}</p>
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
          ) : isCorrect || hasRetried ? (
            <button
              onClick={handleNext}
              className="flex-1 bg-bamboo text-white py-3 rounded-lg font-medium hover:bg-bamboo-dark transition-colors flex items-center justify-center gap-2"
            >
              {currentIndex < reviewQueue.length - 1 ? (
                <>
                  Next Exercise
                  <ArrowRight size={20} />
                </>
              ) : (
                'Finish Review'
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

export default ReviewMode
