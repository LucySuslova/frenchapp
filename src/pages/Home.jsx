import { Link } from 'react-router-dom'
import { BookOpen, Languages, FileText, Headphones, PenTool, ArrowRight } from 'lucide-react'
import useStore from '../store/useStore'

const modules = [
  {
    id: 'grammar',
    title: 'Grammar Drills',
    description: '7 levels, 47 topics covering all TCF grammar',
    icon: BookOpen,
    path: '/grammar',
    color: 'bg-bamboo'
  },
  {
    id: 'vocabulary',
    title: 'Vocabulary',
    description: 'Connectors, verbs, and thematic vocabulary',
    icon: Languages,
    path: '/vocabulary',
    color: 'bg-gold'
  },
  {
    id: 'reading',
    title: 'Reading Comprehension',
    description: 'Opinion passages on TCF topics',
    icon: FileText,
    path: '/reading',
    color: 'bg-rust'
  },
  {
    id: 'listening',
    title: 'Listening Practice',
    description: 'Curated exercises with comprehension questions',
    icon: Headphones,
    path: '/listening',
    color: 'bg-ink'
  },
  {
    id: 'writing',
    title: 'Writing Practice',
    description: 'Tasks 1, 2, 3 with AI evaluation',
    icon: PenTool,
    path: '/writing',
    color: 'bg-bamboo-dark'
  }
]

function Home() {
  const { lastActivity, grammarProgress } = useStore()

  const getQuickStartPath = (moduleId) => {
    switch (moduleId) {
      case 'grammar':
        return lastActivity.grammarTopic ? `/grammar/${lastActivity.grammarTopic}` : '/grammar'
      case 'vocabulary':
        return lastActivity.vocabularySet ? `/vocabulary/${lastActivity.vocabularySet}` : '/vocabulary'
      case 'reading':
        return lastActivity.readingPassage ? `/reading/${lastActivity.readingPassage}` : '/reading'
      case 'listening':
        return lastActivity.listeningExercise ? `/listening/${lastActivity.listeningExercise}` : '/listening'
      case 'writing':
        return lastActivity.writingTask ? `/writing/${lastActivity.writingTask}` : '/writing'
      default:
        return `/${moduleId}`
    }
  }

  const totalExercises = Object.values(grammarProgress).reduce((sum, p) => sum + p.completed, 0)
  const totalCorrect = Object.values(grammarProgress).reduce((sum, p) => sum + p.correctFirst + p.correctRetry, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl font-bold text-ink">TCF Canada Prep</h1>
        <p className="text-ink-light">Your path to NCLC 7+ in all competences</p>
      </div>

      {/* Quick Stats */}
      {totalExercises > 0 && (
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-2xl font-bold text-bamboo">{totalExercises}</p>
              <p className="text-sm text-ink-light">Exercises Done</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-bamboo">
                {totalExercises > 0 ? Math.round((totalCorrect / totalExercises) * 100) : 0}%
              </p>
              <p className="text-sm text-ink-light">Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-bamboo">
                {Object.keys(grammarProgress).length}
              </p>
              <p className="text-sm text-ink-light">Topics Started</p>
            </div>
          </div>
        </div>
      )}

      {/* Module Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map(({ id, title, description, icon: Icon, path, color }) => (
          <Link
            key={id}
            to={getQuickStartPath(id)}
            className="group bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className={`${color} text-white p-3 rounded-lg`}>
                <Icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-ink group-hover:text-bamboo transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-ink-light mt-1">{description}</p>
              </div>
              <ArrowRight size={20} className="text-ink-light group-hover:text-bamboo transition-colors mt-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Target Reminder */}
      <div className="bg-sand rounded-xl p-4 text-center">
        <p className="text-ink-light text-sm">
          <span className="font-semibold text-ink">Target:</span> NCLC 7 requires
          Listening 458-502, Reading 453-498, Writing 10-11, Speaking 10-11
        </p>
      </div>
    </div>
  )
}

export default Home
