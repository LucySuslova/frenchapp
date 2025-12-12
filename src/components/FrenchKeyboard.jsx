import { useRef, useEffect, useState } from 'react'

const FRENCH_CHARS_LOWER = ['é', 'è', 'ê', 'ë', 'à', 'â', 'ù', 'û', 'ô', 'î', 'ï', 'ç', 'œ', 'æ']
const FRENCH_CHARS_UPPER = ['É', 'È', 'Ê', 'Ë', 'À', 'Â', 'Ù', 'Û', 'Ô', 'Î', 'Ï', 'Ç', 'Œ', 'Æ']

function FrenchKeyboard({ inputRef, onInsert, visible: controlledVisible }) {
  const [internalVisible, setInternalVisible] = useState(false)
  const [isUpperCase, setIsUpperCase] = useState(false)

  const visible = controlledVisible !== undefined ? controlledVisible : internalVisible

  useEffect(() => {
    if (controlledVisible !== undefined) return

    const handleFocus = () => setInternalVisible(true)
    const handleBlur = (e) => {
      setTimeout(() => {
        if (!document.activeElement?.closest('.french-keyboard')) {
          setInternalVisible(false)
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
  }, [inputRef, controlledVisible])

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
    <div className="french-keyboard">
      {chars.map((char, index) => (
        <button
          key={`${char}-${index}`}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => insertChar(char)}
          className="keyboard-key"
        >
          {char}
        </button>
      ))}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={toggleCase}
        className="keyboard-key"
        style={{
          width: '3.5rem',
          background: isUpperCase ? 'var(--color-blush-soft)' : 'var(--color-white)',
          borderColor: isUpperCase ? 'var(--color-blush)' : 'var(--color-pearl)'
        }}
        title={isUpperCase ? 'Switch to lowercase' : 'Switch to uppercase'}
      >
        {isUpperCase ? 'ABC' : 'abc'}
      </button>
    </div>
  )
}

// Wrapper hook for managing keyboard with any input
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
