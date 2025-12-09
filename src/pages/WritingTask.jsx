import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Copy, Check, RefreshCw } from 'lucide-react'
import useStore from '../store/useStore'
import { FrenchKeyboard } from '../components/FrenchKeyboard'
import writingData from '../data/writing.json'

const taskConfig = {
  task_1: { name: 'Task 1: Short Message', wordLimit: 60 },
  task_2: { name: 'Task 2: Formal Letter', wordLimit: 120 },
  task_3: { name: 'Task 3: Opinion Essay', wordLimit: 180 }
}

function WritingTask() {
  const { taskId } = useParams()
  const { addWritingAttempt, setLastActivity } = useStore()

  const prompts = writingData[taskId] || []
  const config = taskConfig[taskId]

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [text, setText] = useState('')
  const [showEvalPrompt, setShowEvalPrompt] = useState(false)
  const [copied, setCopied] = useState(false)
  const [nclcScore, setNclcScore] = useState('')
  const [scoreSaved, setScoreSaved] = useState(false)

  const textareaRef = useRef(null)
  const currentPrompt = prompts[currentPromptIndex]

  useEffect(() => {
    setLastActivity('writingTask', taskId)
  }, [taskId, setLastActivity])

  if (!config || prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-ink-light">Writing task not found or no prompts available</p>
        <Link to="/writing" className="text-bamboo hover:underline mt-2 inline-block">
          Back to Writing
        </Link>
      </div>
    )
  }

  const wordCount = text.trim().split(/\s+/).filter(w => w).length

  const generateEvalPrompt = () => {
    setShowEvalPrompt(true)
  }

  const evalPromptText = `=== TCF CANADA WRITING EVALUATION ===

TASK: ${config.name}
WORD LIMIT: ${config.wordLimit}

PROMPT:
${currentPrompt.prompt}

STUDENT RESPONSE:
${text}

EVALUATION CRITERIA:
- Task completion and relevance
- Coherence and cohesion (use of connectors)
- Vocabulary range and accuracy
- Grammar accuracy and complexity
- Register appropriateness

Please provide:
1. Strengths (2-3 points)
2. Areas for improvement (2-3 points)
3. Specific corrections with explanations
4. Estimated NCLC level (4-10)

===`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(evalPromptText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const saveScore = () => {
    const score = parseInt(nclcScore)
    if (score >= 1 && score <= 10) {
      addWritingAttempt(`${taskId}_${currentPrompt.id}`, score)
      setScoreSaved(true)
    }
  }

  const newPrompt = () => {
    const nextIndex = (currentPromptIndex + 1) % prompts.length
    setCurrentPromptIndex(nextIndex)
    setText('')
    setShowEvalPrompt(false)
    setCopied(false)
    setNclcScore('')
    setScoreSaved(false)
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/writing" className="p-2 hover:bg-sand rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-ink" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold text-ink">{config.name}</h1>
          <p className="text-sm text-ink-light">Target: {config.wordLimit} words</p>
        </div>
        <button
          onClick={newPrompt}
          className="p-2 hover:bg-sand rounded-lg transition-colors text-ink-light hover:text-ink"
          title="New prompt"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Prompt */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold text-ink mb-2">Prompt:</h3>
        <p className="text-ink">{currentPrompt.prompt}</p>
      </div>

      {/* Writing Area */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-ink">Your Response:</h3>
          <span className={`text-sm ${wordCount > config.wordLimit ? 'text-rust' : 'text-ink-light'}`}>
            {wordCount}/{config.wordLimit} words
          </span>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start writing here..."
          className="w-full h-48 px-4 py-3 rounded-lg border border-border bg-white focus:border-bamboo focus:ring-1 focus:ring-bamboo outline-none transition-colors resize-none"
        />

        <FrenchKeyboard inputRef={textareaRef} />

        <button
          onClick={generateEvalPrompt}
          disabled={wordCount < 10}
          className="w-full bg-bamboo text-white py-3 rounded-lg font-medium hover:bg-bamboo-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Evaluation Prompt
        </button>
      </div>

      {/* Evaluation Prompt */}
      {showEvalPrompt && (
        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-ink">Evaluation Prompt</h3>
            <button
              onClick={copyToClipboard}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                copied
                  ? 'bg-bamboo/10 text-bamboo'
                  : 'bg-sand hover:bg-sand/80 text-ink'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="bg-sand-light rounded-lg p-4 max-h-64 overflow-y-auto">
            <pre className="text-sm text-ink whitespace-pre-wrap font-mono">{evalPromptText}</pre>
          </div>

          <p className="text-sm text-ink-light">
            Copy this text and paste it into Claude or ChatGPT to get your evaluation.
          </p>

          {/* Score Input */}
          <div className="border-t border-border pt-4 mt-4">
            <h4 className="font-semibold text-ink mb-2">Enter your NCLC score:</h4>
            <div className="flex gap-3">
              <input
                type="number"
                min="1"
                max="10"
                value={nclcScore}
                onChange={(e) => setNclcScore(e.target.value)}
                placeholder="NCLC (1-10)"
                disabled={scoreSaved}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-white focus:border-bamboo focus:ring-1 focus:ring-bamboo outline-none transition-colors disabled:bg-sand"
              />
              <button
                onClick={saveScore}
                disabled={!nclcScore || scoreSaved}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  scoreSaved
                    ? 'bg-bamboo/10 text-bamboo'
                    : 'bg-bamboo text-white hover:bg-bamboo-dark disabled:opacity-50'
                }`}
              >
                {scoreSaved ? 'Saved!' : 'Save Score'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WritingTask
