import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/**
 * A component that hides translation text by default and reveals it on click.
 *
 * @param {string} text - The translation text to reveal
 * @param {string} label - Optional label to show before the text (e.g., "Meaning:", "Literal:")
 * @param {string} className - Additional CSS classes
 * @param {string} variant - Style variant: 'default', 'inline', 'block'
 */
function TranslationReveal({ text, label, className = '', variant = 'default' }) {
  const [isRevealed, setIsRevealed] = useState(false)

  if (!text) return null

  const handleToggle = () => {
    setIsRevealed(!isRevealed)
  }

  // Inline variant - for use within text flows
  if (variant === 'inline') {
    return (
      <span className={className}>
        {label && <span className="font-medium text-ink">{label} </span>}
        {isRevealed ? (
          <span
            onClick={handleToggle}
            className="cursor-pointer hover:text-ink transition-colors"
          >
            {text}
          </span>
        ) : (
          <button
            onClick={handleToggle}
            className="inline-flex items-center gap-1 text-bamboo hover:text-bamboo-dark transition-colors text-sm"
          >
            <Eye size={14} />
            <span>Show translation</span>
          </button>
        )}
      </span>
    )
  }

  // Block variant - for larger blocks of text like explanations
  if (variant === 'block') {
    return (
      <div className={className}>
        {isRevealed ? (
          <div
            onClick={handleToggle}
            className="cursor-pointer group"
          >
            {label && <span className="font-medium text-ink">{label} </span>}
            <span>{text}</span>
            <EyeOff size={14} className="inline ml-2 text-ink-light opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <button
            onClick={handleToggle}
            className="flex items-center gap-2 text-bamboo hover:text-bamboo-dark transition-colors text-sm py-1"
          >
            <Eye size={16} />
            <span>{label ? `Show ${label.toLowerCase().replace(':', '')}` : 'Show translation'}</span>
          </button>
        )}
      </div>
    )
  }

  // Default variant - for standard use cases
  return (
    <div className={className}>
      {isRevealed ? (
        <p
          onClick={handleToggle}
          className="cursor-pointer group flex items-center gap-2"
        >
          {label && <span className="font-medium text-ink">{label} </span>}
          <span>{text}</span>
          <EyeOff size={14} className="text-ink-light opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </p>
      ) : (
        <button
          onClick={handleToggle}
          className="flex items-center gap-2 text-bamboo hover:text-bamboo-dark transition-colors text-sm"
        >
          <Eye size={16} />
          <span>{label ? `Show ${label.toLowerCase().replace(':', '')}` : 'Show translation'}</span>
        </button>
      )}
    </div>
  )
}

export { TranslationReveal }
