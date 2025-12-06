import { Link } from 'react-router-dom'
import { ChevronRight, CheckCircle2, Circle } from 'lucide-react'
import useStore from '../store/useStore'
import grammarData from '../data/grammar.json'

const levels = [
  { id: 1, name: 'Core Verb Foundations', topics: ['1_1_present', '1_2_passe_compose', '1_3_imparfait', '1_4_pc_vs_imparfait', '1_5_plus_que_parfait', '1_6_futur_simple', '1_7_futur_anterieur'] },
  { id: 2, name: 'Mood & Mode', topics: ['2_1_conditionnel_present', '2_2_conditionnel_passe', '2_3_subjonctif_present', '2_4_subjonctif_passe', '2_5_imperatif', '2_6_infinitif_passe', '2_7_gerondif'] },
  { id: 3, name: 'Pronouns & Agreement', topics: ['3_1_cod', '3_2_coi', '3_3_y_en', '3_4_pronoun_order', '3_5_subject_verb_agreement', '3_6_past_participle_agreement'] },
  { id: 4, name: 'Complex Sentences', topics: ['4_1_qui_que', '4_2_dont_ou', '4_3_lequel', '4_4_hypotheses_1', '4_5_hypotheses_2', '4_6_hypotheses_3', '4_7_passive_voice', '4_8_se_faire'] },
  { id: 5, name: 'Logical Connectors', topics: ['5_1_cause', '5_2_consequence', '5_3_purpose', '5_4_concession', '5_5_opposition', '5_6_condition', '5_7_enumeration', '5_8_conclusion'] },
  { id: 6, name: 'Advanced Negation', topics: ['6_1_jamais_plus_rien', '6_2_personne_aucun', '6_3_ni_ni_que', '6_4_ne_expletif'] },
  { id: 7, name: 'Style & Sophistication', topics: ['7_1_reported_speech', '7_2_inversion', '7_3_emphatic', '7_4_fronting', '7_5_nominalization', '7_6_register', '7_7_nuance'] }
]

function GrammarIndex() {
  const { grammarProgress } = useStore()

  const getTopicProgress = (topicId) => {
    const progress = grammarProgress[topicId]
    if (!progress) return { completed: 0, accuracy: 0 }
    const total = progress.correctFirst + progress.correctRetry + progress.incorrect
    const correct = progress.correctFirst + progress.correctRetry
    return {
      completed: progress.completed,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0
    }
  }

  const getTopicName = (topicId) => {
    return grammarData[topicId]?.name || topicId.split('_').slice(2).join(' ')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Grammar Drills</h1>
        <p className="text-ink-light mt-1">Master French grammar through progressive exercises</p>
      </div>

      <div className="space-y-6">
        {levels.map((level) => {
          const levelProgress = level.topics.reduce((acc, topicId) => {
            const p = getTopicProgress(topicId)
            return {
              completed: acc.completed + p.completed,
              started: acc.started + (p.completed > 0 ? 1 : 0)
            }
          }, { completed: 0, started: 0 })

          return (
            <div key={level.id} className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="bg-sand px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-semibold text-ink">
                    Level {level.id}: {level.name}
                  </h2>
                  <span className="text-sm text-ink-light">
                    {levelProgress.started}/{level.topics.length} started
                  </span>
                </div>
              </div>
              <ul className="divide-y divide-border">
                {level.topics.map((topicId) => {
                  const { completed, accuracy } = getTopicProgress(topicId)
                  const hasProgress = completed > 0

                  return (
                    <li key={topicId}>
                      <Link
                        to={`/grammar/${topicId}`}
                        className="flex items-center justify-between px-4 py-3 hover:bg-sand-light transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {hasProgress ? (
                            <CheckCircle2 size={20} className="text-bamboo" />
                          ) : (
                            <Circle size={20} className="text-ink-light" />
                          )}
                          <span className="text-ink">{getTopicName(topicId)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {hasProgress && (
                            <span className={`text-sm ${accuracy >= 70 ? 'text-bamboo' : 'text-rust'}`}>
                              {accuracy}%
                            </span>
                          )}
                          <ChevronRight size={20} className="text-ink-light" />
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GrammarIndex
