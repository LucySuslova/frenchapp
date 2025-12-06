import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, X, ArrowRight } from 'lucide-react'
import useStore from '../store/useStore'
import readingData from '../data/reading.json'

function ReadingPassage() {
  const { passageId } = useParams()
  const navigate = useNavigate()
  const { updateReadingProgress, setLastActivity } = useStore()

  const passage = readingData.passages?.find(p => p.id === passageId)
  const questions = passage?.questions || []

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [showPassage, setShowPassage] = useState(true)

  useEffect(() => {
    setLastActivity('readingPassage', passageId)
  }, [passageId, setLastActivity])

  if (!passage) {
    return (
      <div className="text-center py-12">
        <p className="text-ink-light">Passage not found</p>
        <Link to="/reading" className="text-bamboo hover:underline mt-2 inline-block">
          Back to Reading
        </Link>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const isLastQuestion = currentQuestion === questions.length - 1

  const checkAnswer = () => {
    const isCorrect = selectedAnswer === currentQ.answer
    if (isCorrect) setScore(score + 1)
    setShowResult(true)
  }

  const handleNext = () => {
    if (isLastQuestion) {
      // Save progress and show final score
      updateReadingProgress(passageId, score + (selectedAnswer === currentQ.answer ? 1 : 0), questions.length)
      navigate('/reading')
    } else {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/reading" className="p-2 hover:bg-sand rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-ink" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold text-ink">{passage.title}</h1>
          <p className="text-sm text-ink-light">{passage.topic}</p>
        </div>
      </div>

      {/* Passage Toggle */}
      <button
        onClick={() => setShowPassage(!showPassage)}
        className="w-full text-left bg-sand rounded-lg px-4 py-2 text-sm text-ink-light hover:bg-sand/80 transition-colors"
      >
        {showPassage ? 'Hide passage' : 'Show passage'}
      </button>

      {/* Passage */}
      {showPassage && (
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="prose prose-sm max-w-none text-ink leading-relaxed whitespace-pre-wrap">
            {passage.content}
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-ink-light">
        <span>Question {currentQuestion + 1} of {questions.length}</span>
        <span>Score: {score}/{currentQuestion + (showResult ? 1 : 0)}</span>
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-4">
        <p className="text-lg text-ink font-medium">{currentQ.question}</p>

        <div className="grid gap-2">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && setSelectedAnswer(index)}
              disabled={showResult}
              className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                showResult
                  ? index === currentQ.answer
                    ? 'border-bamboo bg-bamboo/10 text-bamboo'
                    : index === selectedAnswer
                    ? 'border-rust bg-rust/10 text-rust'
                    : 'border-border text-ink-light'
                  : selectedAnswer === index
                  ? 'border-bamboo bg-bamboo/5'
                  : 'border-border hover:border-bamboo/50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`flex items-center gap-2 ${selectedAnswer === currentQ.answer ? 'text-bamboo' : 'text-rust'}`}>
            {selectedAnswer === currentQ.answer ? <Check size={20} /> : <X size={20} />}
            <span className="font-medium">
              {selectedAnswer === currentQ.answer ? 'Correct!' : 'Incorrect'}
            </span>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {!showResult ? (
            <button
              onClick={checkAnswer}
              disabled={selectedAnswer === null}
              className="flex-1 bg-bamboo text-white py-3 rounded-lg font-medium hover:bg-bamboo-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 bg-bamboo text-white py-3 rounded-lg font-medium hover:bg-bamboo-dark transition-colors flex items-center justify-center gap-2"
            >
              {isLastQuestion ? 'Finish' : 'Next Question'}
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReadingPassage
