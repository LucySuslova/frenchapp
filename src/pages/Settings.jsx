import { Link } from 'react-router-dom'
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react'
import useStore from '../store/useStore'

function Settings() {
  const { settings, toggleExplainInFrench } = useStore()

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

      {/* Settings Cards */}
      <div className="space-y-4">
        {/* Language Settings */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-bamboo/10 rounded-lg">
              <SettingsIcon size={20} className="text-bamboo" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-ink">Language Preferences</h2>
              <p className="text-sm text-ink-light mt-1">Control how explanations are displayed</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Explain in French Toggle */}
            <div className="flex items-center justify-between p-4 bg-sand rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-ink">Explain in French</h3>
                <p className="text-sm text-ink-light mt-1">
                  See explanations in French instead of English to accelerate immersion
                </p>
              </div>
              <button
                onClick={toggleExplainInFrench}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-bamboo focus:ring-offset-2 ${
                  settings.explainInFrench ? 'bg-bamboo' : 'bg-border'
                }`}
                role="switch"
                aria-checked={settings.explainInFrench}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.explainInFrench ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Status Message */}
            {settings.explainInFrench && (
              <div className="p-3 bg-bamboo/10 border border-bamboo/20 rounded-lg">
                <p className="text-sm text-bamboo">
                  <span className="font-medium">Immersion mode active:</span> Grammar explanations will now appear in French
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-sand rounded-xl p-4">
          <p className="text-sm text-ink-light">
            <span className="font-semibold text-ink">Tip:</span> Toggle between French and English explanations
            anytime to find the right balance for your learning level.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Settings
