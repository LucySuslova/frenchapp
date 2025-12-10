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

      // Grammar Session State (for continuing where user left off)
      grammarSessions: {},
      updateGrammarSession: (topicId, currentIndex, shuffledOrder = null) => {
        set({
          grammarSessions: {
            ...get().grammarSessions,
            [topicId]: {
              currentIndex,
              shuffledOrder,
              lastUpdated: new Date().toISOString()
            }
          }
        })
      },
      clearGrammarSession: (topicId) => {
        const sessions = { ...get().grammarSessions }
        delete sessions[topicId]
        set({ grammarSessions: sessions })
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
      addWritingAttempt: (taskId, nclcScore) => {
        set({
          writingProgress: [
            ...get().writingProgress,
            { taskId, nclcScore, date: new Date().toISOString() }
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

      // Settings
      settings: {
        explainInFrench: false
      },
      toggleExplainInFrench: () => {
        set({
          settings: {
            ...get().settings,
            explainInFrench: !get().settings.explainInFrench
          }
        })
      },

      // Saved Expressions (for idioms and conversational expressions)
      savedExpressions: [],
      saveExpression: (expression) => {
        const current = get().savedExpressions
        // Don't add duplicates
        if (!current.find(e => e.id === expression.id)) {
          set({
            savedExpressions: [
              ...current,
              { ...expression, savedAt: new Date().toISOString() }
            ]
          })
        }
      },
      removeExpression: (expressionId) => {
        set({
          savedExpressions: get().savedExpressions.filter(e => e.id !== expressionId)
        })
      },
      isExpressionSaved: (expressionId) => {
        return get().savedExpressions.some(e => e.id === expressionId)
      },
      clearSavedExpressions: () => {
        set({ savedExpressions: [] })
      },

      // Failed Exercises for Review Mode (spaced repetition)
      failedExercises: [],
      recordFailedExercise: (exerciseId, topicId, exerciseData) => {
        const current = get().failedExercises
        const existing = current.find(e => e.exerciseId === exerciseId)

        if (existing) {
          // Update existing entry - increment fail count and update timestamp
          set({
            failedExercises: current.map(e =>
              e.exerciseId === exerciseId
                ? {
                    ...e,
                    failCount: e.failCount + 1,
                    lastFailedAt: new Date().toISOString(),
                    // Reset success count on new failure
                    successCount: 0
                  }
                : e
            )
          })
        } else {
          // Add new failed exercise
          set({
            failedExercises: [
              ...current,
              {
                exerciseId,
                topicId,
                exerciseData,
                failCount: 1,
                successCount: 0,
                lastFailedAt: new Date().toISOString(),
                addedAt: new Date().toISOString()
              }
            ]
          })
        }
      },
      recordReviewSuccess: (exerciseId) => {
        const current = get().failedExercises
        set({
          failedExercises: current.map(e =>
            e.exerciseId === exerciseId
              ? { ...e, successCount: e.successCount + 1, lastReviewedAt: new Date().toISOString() }
              : e
          ).filter(e =>
            // Remove from review queue after 2 consecutive successes
            !(e.exerciseId === exerciseId && e.successCount >= 2)
          )
        })
      },
      removeFromReview: (exerciseId) => {
        set({
          failedExercises: get().failedExercises.filter(e => e.exerciseId !== exerciseId)
        })
      },
      clearReviewQueue: () => {
        set({ failedExercises: [] })
      },

      // Reset all progress
      resetProgress: () => set({
        scores: { listening: 0, reading: 0, writing: 0, speaking: 0, lastUpdated: null },
        grammarProgress: {},
        grammarSessions: {},
        vocabularyProgress: { mastered: [], needsReview: [], attempts: {} },
        readingProgress: { completed: [], scores: {} },
        writingProgress: [],
        listeningProgress: { completed: [], scores: {} },
        lastActivity: { grammarTopic: null, vocabularySet: null, readingPassage: null, listeningExercise: null, writingTask: null },
        failedExercises: [],
        savedExpressions: [],
        settings: { explainInFrench: false }
      })
    }),
    {
      name: 'tcf-canada-storage'
    }
  )
)

export default useStore
