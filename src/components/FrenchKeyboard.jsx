import { useRef, useEffect, useState } from 'react'
import { ArrowBigUp } from 'lucide-react'

const FRENCH_CHARS_LOWER = ['é', 'è', 'ê', 'ë', 'à', 'â', 'ù', 'û', 'ô', 'î', 'ï', 'ç', 'œ', 'æ', '«', '»']
const FRENCH_CHARS_UPPER = ['É', 'È', 'Ê', 'Ë', 'À', 'Â', 'Ù', 'Û', 'Ô', 'Î', 'Ï', 'Ç', 'Œ', 'Æ', '«', '»']

function FrenchKeyboard({ inputRef, onInsert }) {
  const [visible, setVisible] = useState(false)
  const [isUpperCase, setIsUpperCase] = useState(false)

  useEffect(() => {
    const handleFocus = () => setVisible(true)
    const handleBlur = (e) => {
      // Delay hiding to allow button clicks
      setTimeout(() => {
        if (!document.activeElement?.closest('.french-keyboard')) {
          setVisible(false)
        }
      }, 100)
    }

    const input = inputRef?.current
    if (input) {
      input.addEventListener('focus', handleFocus)
      input.addEventListener('blur', handleBlur)
      return () => {
        input.removeEventListener('focus', handleFocus)
        input.removeEventListener('blur', handleBlur)
      }
    }
  }, [inputRef])

  const insertChar = (char) => {
    if (onInsert) {
      onInsert(char)
    } else if (inputRef?.current) {
      const input = inputRef.current
      const start = input.selectionStart
      const end = input.selectionEnd
      const value = input.value
      input.value = value.substring(0, start) + char + value.substring(end)
      input.selectionStart = input.selectionEnd = start + 1
      input.focus()
      // Trigger change event
      const event = new Event('input', { bubbles: true })
      input.dispatchEvent(event)
    }
  }

  const toggleCase = () => {
    setIsUpperCase(!isUpperCase)
  }

  const chars = isUpperCase ? FRENCH_CHARS_UPPER : FRENCH_CHARS_LOWER

  if (!visible) return null

  return (
    <div className="french-keyboard fixed right-4 top-1/2 -translate-y-1/2 bg-white border border-border p-3 z-50 shadow-lg rounded-xl">
      <div className="grid grid-cols-4 gap-1.5 w-44">
        {chars.map((char, index) => (
          <button
            key={`${char}-${index}`}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => insertChar(char)}
            className="w-10 h-10 bg-sand hover:bg-bamboo hover:text-white rounded-lg font-medium text-ink transition-colors text-lg"
          >
            {char}
          </button>
        ))}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggleCase}
          className={`col-span-4 h-10 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            isUpperCase
              ? 'bg-bamboo text-white'
              : 'bg-sand hover:bg-bamboo hover:text-white text-ink'
          }`}
          title={isUpperCase ? 'Switch to lowercase' : 'Switch to uppercase'}
        >
          <ArrowBigUp size={20} className={isUpperCase ? 'fill-current' : ''} />
          <span className="text-sm">{isUpperCase ? 'ABC' : 'abc'}</span>
        </button>
      </div>
    </div>
  )
}

// Wrapper component for managing keyboard with any input
function useFrenchKeyboard() {
  const inputRef = useRef(null)
  const [value, setValue] = useState('')

  const handleInsert = (char) => {
    if (inputRef.current) {
      const input = inputRef.current
      const start = input.selectionStart
      const end = input.selectionEnd
      const newValue = value.substring(0, start) + char + value.substring(end)
      setValue(newValue)
      // Restore cursor position after React re-render
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = start + 1
        input.focus()
      }, 0)
    }
  }

  return { inputRef, value, setValue, handleInsert }
}

export { FrenchKeyboard, useFrenchKeyboard }
export default FrenchKeyboard
