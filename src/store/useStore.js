import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      // TCF Scores
      scores: {
        listening: 0,
        reading: 0,
        writing: 0,
        speaking: 0,
        lastUpdated: null
      },
      setScores: (scores) => set({
        scores: { ...scores, lastUpdated: new Date().toISOString() }
      }),

      // Grammar Progress
      grammarProgress: {},
      updateGrammarProgress: (topicId, result) => {
        const current = get().grammarProgress[topicId] || {
          completed: 0,
          correctFirst: 0,
          correctRetry: 0,
          incorrect: 0,
          lastPracticed: null
        }

        set({
          grammarProgress: {
            ...get().grammarProgress,
            [topicId]: {
              completed: current.completed + 1,
              correctFirst: current.correctFirst + (result === 'correctFirst' ? 1 : 0),
              correctRetry: current.correctRetry + (result === 'correctRetry' ? 1 : 0),
              incorrect: current.incorrect + (result === 'incorrect' ? 1 : 0),
              lastPracticed: new Date().toISOString()
            }
          }
        })
      },

      // Vocabulary Progress
      vocabularyProgress: {
        mastered: [],
        needsReview: [],
        attempts: {}
      },
      updateVocabularyAttempt: (itemId, correct) => {
        const current = get().vocabularyProgress
        const attempts = current.attempts[itemId] || { correct: 0, incorrect: 0 }

        const newAttempts = {
          ...current.attempts,
          [itemId]: {
            correct: attempts.correct + (correct ? 1 : 0),
            incorrect: attempts.incorrect + (correct ? 0 : 1)
          }
        }

        const newCorrectCount = newAttempts[itemId].correct
        const mastered = newCorrectCount >= 3
          ? [...new Set([...current.mastered, itemId])]
          : current.mastered.filter(id => id !== itemId)

        const needsReview = newCorrectCount < 3 && newAttempts[itemId].incorrect > 0
          ? [...new Set([...current.needsReview, itemId])]
          : current.needsReview.filter(id => id !== itemId)

        set({
          vocabularyProgress: {
            mastered,
            needsReview,
            attempts: newAttempts
          }
        })
      },

      // Reading Progress
      readingProgress: {
        completed: [],
        scores: {}
      },
      updateReadingProgress: (passageId, score, total) => {
        const current = get().readingProgress
        set({
          readingProgress: {
            completed: [...new Set([...current.completed, passageId])],
            scores: {
              ...current.scores,
              [passageId]: { score, total }
            }
          }
        })
      },

      // Writing Progress
      writingProgress: [],
      addWritingAttempt: (taskId, clbScore) => {
        set({
          writingProgress: [
            ...get().writingProgress,
            { taskId, clbScore, date: new Date().toISOString() }
          ]
        })
      },

      // Listening Progress
      listeningProgress: {
        completed: [],
        scores: {}
      },
      updateListeningProgress: (exerciseId, score, total) => {
        const current = get().listeningProgress
        set({
          listeningProgress: {
            completed: [...new Set([...current.completed, exerciseId])],
            scores: {
              ...current.scores,
              [exerciseId]: { score, total }
            }
          }
        })
      },

      // Last Activity (for quick-start)
      lastActivity: {
        grammarTopic: null,
        vocabularySet: null,
        readingPassage: null,
        listeningExercise: null,
        writingTask: null
      },
      setLastActivity: (type, id) => {
        set({
          lastActivity: {
            ...get().lastActivity,
            [type]: id
          }
        })
      },

      // Reset all progress
      resetProgress: () => set({
        scores: { listening: 0, reading: 0, writing: 0, speaking: 0, lastUpdated: null },
        grammarProgress: {},
        vocabularyProgress: { mastered: [], needsReview: [], attempts: {} },
        readingProgress: { completed: [], scores: {} },
        writingProgress: [],
        listeningProgress: { completed: [], scores: {} },
        lastActivity: { grammarTopic: null, vocabularySet: null, readingPassage: null, listeningExercise: null, writingTask: null }
      })
    }),
    {
      name: 'tcf-canada-storage'
    }
  )
)

export default useStore
