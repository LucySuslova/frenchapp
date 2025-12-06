import { Link } from 'react-router-dom'
import { ArrowLeft, Languages, RotateCcw, AlertTriangle } from 'lucide-react'
import useStore from '../store/useStore'

function Settings() {
  const { settings, updateSettings, resetProgress, failedExercises } = useStore()

  const handleToggleFrench = () => {
    updateSettings({ explanationsInFrench: !settings.explanationsInFrench })
  }

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetProgress()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/" className="p-2 hover:bg-sand rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-ink" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold text-ink">Settings</h1>
          <p className="text-sm text-ink-light">Customize your learning experience</p>
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 bg-sand border-b border-border">
          <h2 className="font-display font-semibold text-ink flex items-center gap-2">
            <Languages size={18} />
            Language & Immersion
          </h2>
        </div>

        <div className="p-4 space-y-4">
          {/* French Explanations Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-4">
              <p className="font-medium text-ink">Explain in French</p>
              <p className="text-sm text-ink-light mt-1">
                Show grammar explanations in French instead of English to accelerate immersion
              </p>
            </div>
            <button
              onClick={handleToggleFrench}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.explanationsInFrench ? 'bg-bamboo' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  settings.explanationsInFrench ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {settings.explanationsInFrench && (
            <div className="bg-bamboo/10 rounded-lg p-3 text-sm text-bamboo">
              Les explications seront affichées en français pour une immersion totale.
            </div>
          )}
        </div>
      </div>

      {/* Review Mode Stats */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 bg-sand border-b border-border">
          <h2 className="font-display font-semibold text-ink flex items-center gap-2">
            <RotateCcw size={18} />
            Review Mode
          </h2>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-ink">Exercises in Review Queue</p>
              <p className="text-sm text-ink-light mt-1">
                Items you've struggled with that need more practice
              </p>
            </div>
            <span className="text-2xl font-bold text-bamboo">{failedExercises.length}</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-rust/30 overflow-hidden">
        <div className="px-4 py-3 bg-rust/10 border-b border-rust/30">
          <h2 className="font-display font-semibold text-rust flex items-center gap-2">
            <AlertTriangle size={18} />
            Danger Zone
          </h2>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-4">
              <p className="font-medium text-ink">Reset All Progress</p>
              <p className="text-sm text-ink-light mt-1">
                Clear all scores, exercises completed, and review queue
              </p>
            </div>
            <button
              onClick={handleResetProgress}
              className="px-4 py-2 bg-rust text-white rounded-lg font-medium hover:bg-rust/90 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
