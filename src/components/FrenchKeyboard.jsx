import { useRef, useEffect, useState } from 'react'

const FRENCH_CHARS = ['é', 'è', 'ê', 'ë', 'à', 'â', 'ù', 'û', 'ô', 'î', 'ï', 'ç', 'œ', 'æ', '«', '»']

function FrenchKeyboard({ inputRef, onInsert }) {
  const [visible, setVisible] = useState(false)

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

  if (!visible) return null

  return (
    <div className="french-keyboard fixed bottom-0 left-0 right-0 bg-white border-t border-border p-2 z-50 shadow-lg">
      <div className="flex flex-wrap justify-center gap-1 max-w-lg mx-auto">
        {FRENCH_CHARS.map((char) => (
          <button
            key={char}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => insertChar(char)}
            className="w-9 h-9 bg-sand hover:bg-bamboo hover:text-white rounded-lg font-medium text-ink transition-colors"
          >
            {char}
          </button>
        ))}
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
