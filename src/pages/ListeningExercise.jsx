import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Check, X, ArrowRight, Play } from 'lucide-react'
import useStore from '../store/useStore'
import listeningData from '../data/listening.json'

function ListeningExercise() {
  const { exerciseId } = useParams()
  const navigate = useNavigate()
  const { updateListeningProgress, setLastActivity } = useStore()

  const exercise = listeningData.exercises?.find(e => e.id === exerciseId)
  const questions = exercise?.questions || []

  const [hasListened, setHasListened] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    setLastActivity('listeningExercise', exerciseId)
  }, [exerciseId, setLastActivity])

  if (!exercise) {
    return (
      <div className="text-center py-12">
        <p className="text-ink-light">Exercise not found</p>
        <Link to="/listening" className="text-bamboo hover:underline mt-2 inline-block">
          Back to Listening
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
      updateListeningProgress(exerciseId, score + (selectedAnswer === currentQ.answer ? 1 : 0), questions.length)
      navigate('/listening')
    } else {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const openExternalLink = () => {
    window.open(exercise.url, '_blank')
    setHasListened(true)
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/listening" className="p-2 hover:bg-sand rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-ink" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold text-ink">{exercise.title}</h1>
          <p className="text-sm text-ink-light">{exercise.source} - {exercise.duration}</p>
        </div>
      </div>

      {/* External Link Card */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-white text-sm ${
              exercise.difficulty === 'B1' ? 'bg-bamboo' :
              exercise.difficulty === 'B2' ? 'bg-gold' : 'bg-rust'
            }`}>
              {exercise.difficulty}
            </span>
            <span className="text-ink-light text-sm">{exercise.duration}</span>
          </div>
          {hasListened && (
            <span className="text-sm text-bamboo flex items-center gap-1">
              <Check size={16} />
              Listened
            </span>
          )}
        </div>

        <button
          onClick={openExternalLink}
          className="w-full bg-bamboo text-white py-3 rounded-lg font-medium hover:bg-bamboo-dark transition-colors flex items-center justify-center gap-2"
        >
          <Play size={20} />
          Open Audio ({exercise.source})
          <ExternalLink size={16} />
        </button>

        <p className="text-sm text-ink-light mt-3 text-center">
          Listen to the audio, then return here to answer questions
        </p>
      </div>

      {/* Questions Section */}
      {hasListened && questions.length > 0 && (
        <>
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
        </>
      )}

      {hasListened && questions.length === 0 && (
        <div className="bg-sand rounded-xl p-6 text-center">
          <p className="text-ink-light">No comprehension questions available for this exercise yet.</p>
          <Link to="/listening" className="text-bamboo hover:underline mt-2 inline-block">
            Back to Listening
          </Link>
        </div>
      )}

      {!hasListened && (
        <div className="bg-sand rounded-xl p-6 text-center">
          <p className="text-ink-light">Click the button above to listen to the audio first.</p>
        </div>
      )}
    </div>
  )
}

export default ListeningExercise
