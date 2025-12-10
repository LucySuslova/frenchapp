import { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronUp, BookOpen, Info, Star, AlertTriangle } from 'lucide-react'
import conjugationsData from '../data/conjugations.json'

const tenseOrder = [
  'present',
  'passeCompose',
  'imparfait',
  'plusQueParfait',
  'futurSimple',
  'futurAnterieur',
  'conditionnelPresent',
  'conditionnelPasse',
  'subjonctifPresent',
  'subjonctifPasse',
  'imperatif',
  'passeSimple'
]

const pronouns = ['je', 'tu', 'il/elle/on', 'nous', 'vous', 'ils/elles']

function ConjugationCheatsheet() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [selectedTense, setSelectedTense] = useState('all')
  const [expandedVerb, setExpandedVerb] = useState(null)
  const [activeTab, setActiveTab] = useState('search') // 'search', 'tenses', 'groups', 'etre'

  const { tenses, verbGroups, conjugations, etreVerbs, stemChanges } = conjugationsData

  // Get all verbs from conjugations data
  const allVerbs = useMemo(() => {
    return Object.entries(conjugations).map(([key, data]) => ({
      id: key,
      ...data
    }))
  }, [])

  // Filter verbs based on search and group
  const filteredVerbs = useMemo(() => {
    return allVerbs.filter(verb => {
      const matchesSearch = searchTerm === '' ||
        verb.infinitive.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verb.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (verb.similarVerbs && verb.similarVerbs.some(v => v.toLowerCase().includes(searchTerm.toLowerCase())))

      const matchesGroup = selectedGroup === 'all' || verb.group === parseInt(selectedGroup)

      return matchesSearch && matchesGroup
    })
  }, [allVerbs, searchTerm, selectedGroup])

  // Render conjugation table for a verb
  const renderConjugationTable = (verb) => {
    const tensesToShow = selectedTense === 'all'
      ? tenseOrder.filter(t => verb.tenses[t])
      : [selectedTense].filter(t => verb.tenses[t])

    return (
      <div className="space-y-4">
        {tensesToShow.map(tenseKey => {
          const tenseData = verb.tenses[tenseKey]
          const tenseInfo = tenses[tenseKey]

          if (!tenseData || tenseData.note) {
            return (
              <div key={tenseKey} className="border border-border rounded-lg p-4">
                <h4 className="font-medium text-ink mb-2">{tenseInfo?.name || tenseKey}</h4>
                <p className="text-sm text-ink-light italic">{tenseData?.note || 'No conjugation available'}</p>
              </div>
            )
          }

          return (
            <div key={tenseKey} className="border border-border rounded-lg overflow-hidden">
              <div className="bg-sand px-4 py-2 border-b border-border">
                <h4 className="font-medium text-ink">{tenseInfo?.name} ({tenseInfo?.nameEn})</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border">
                {(tenseKey === 'imperatif' ? ['tu', 'nous', 'vous'] : pronouns).map(pronoun => {
                  const form = tenseData[pronoun]
                  if (!form) return null
                  return (
                    <div key={pronoun} className="bg-white p-3">
                      <span className="text-ink-light text-sm">{pronoun}</span>
                      <p className="text-ink font-medium">{form}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Render verb card
  const renderVerbCard = (verb) => {
    const isExpanded = expandedVerb === verb.id

    return (
      <div key={verb.id} className="border border-border rounded-xl overflow-hidden bg-white">
        <button
          onClick={() => setExpandedVerb(isExpanded ? null : verb.id)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-sand-light transition-colors"
        >
          <div className="flex items-center gap-3">
            <div>
              <span className="font-display font-semibold text-lg text-ink">{verb.infinitive}</span>
              <span className="ml-2 text-ink-light">— {verb.meaning}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              verb.group === 1 ? 'bg-green-100 text-green-700' :
              verb.group === 2 ? 'bg-blue-100 text-blue-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {verb.group}e groupe
            </span>
            {verb.irregular && (
              <span className="text-xs px-2 py-1 rounded-full bg-rust/20 text-rust">
                irrégulier
              </span>
            )}
            {verb.reflexive && (
              <span className="text-xs px-2 py-1 rounded-full bg-gold/20 text-gold">
                réflexif
              </span>
            )}
          </div>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {isExpanded && (
          <div className="px-4 py-4 border-t border-border bg-sand-light">
            {/* Verb info */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <div>
                <span className="text-ink-light">Auxiliaire:</span>{' '}
                <span className="font-medium text-ink">{verb.auxiliary}</span>
              </div>
              <div>
                <span className="text-ink-light">Participe passé:</span>{' '}
                <span className="font-medium text-ink">{verb.pastParticiple}</span>
              </div>
              <div>
                <span className="text-ink-light">Participe présent:</span>{' '}
                <span className="font-medium text-ink">{verb.presentParticiple}</span>
              </div>
            </div>

            {verb.note && (
              <div className="flex items-start gap-2 mb-4 p-3 bg-gold/10 rounded-lg">
                <AlertTriangle size={16} className="text-gold mt-0.5" />
                <p className="text-sm text-ink">{verb.note}</p>
              </div>
            )}

            {verb.similarVerbs && verb.similarVerbs.length > 0 && (
              <div className="mb-4 p-3 bg-bamboo/10 rounded-lg">
                <p className="text-sm text-ink">
                  <span className="font-medium">Verbes similaires:</span>{' '}
                  {verb.similarVerbs.join(', ')}
                </p>
              </div>
            )}

            {/* Conjugation tables */}
            {renderConjugationTable(verb)}
          </div>
        )}
      </div>
    )
  }

  // Render tenses reference tab
  const renderTensesTab = () => (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-ink mb-4">French Tenses Reference</h2>
      <div className="space-y-4">
        {tenseOrder.map(tenseKey => {
          const tense = tenses[tenseKey]
          if (!tense) return null
          return (
            <div key={tenseKey} className="border border-border rounded-xl p-4 bg-white">
              <h3 className="font-display font-semibold text-lg text-ink">
                {tense.name} <span className="text-ink-light font-normal">({tense.nameEn})</span>
              </h3>
              <p className="text-ink-light text-sm mt-1 mb-3">{tense.usage}</p>
              <div className="bg-sand-light rounded-lg p-3 text-sm">
                <p className="font-medium text-ink mb-2">Formation:</p>
                {Object.entries(tense.formation).map(([key, value]) => (
                  <p key={key} className="text-ink-light">
                    <span className="text-ink capitalize">{key}:</span> {value}
                  </p>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // Render verb groups tab
  const renderGroupsTab = () => (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-semibold text-ink mb-4">The Three Verb Groups</h2>

      {Object.entries(verbGroups).map(([key, group]) => (
        <div key={key} className="border border-border rounded-xl overflow-hidden bg-white">
          <div className={`px-4 py-3 ${
            key === 'group1' ? 'bg-green-50' :
            key === 'group2' ? 'bg-blue-50' :
            'bg-purple-50'
          }`}>
            <h3 className="font-display font-semibold text-lg text-ink">
              {group.name} ({group.ending})
            </h3>
            <p className="text-sm text-ink-light">{group.nameEn}</p>
          </div>
          <div className="p-4">
            <p className="text-ink mb-3">{group.description}</p>
            <div className="bg-sand-light rounded-lg p-3 mb-3">
              <p className="text-sm">
                <span className="font-medium text-ink">Pattern:</span>{' '}
                <span className="text-ink-light">{group.pattern}</span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-ink mb-2">Examples:</p>
              <div className="flex flex-wrap gap-2">
                {group.examples.map(verb => (
                  <button
                    key={verb}
                    onClick={() => {
                      setSearchTerm(verb)
                      setActiveTab('search')
                    }}
                    className="text-sm px-3 py-1 bg-sand hover:bg-bamboo hover:text-white rounded-full transition-colors"
                  >
                    {verb}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Stem Changes Section */}
      <div className="border border-border rounded-xl overflow-hidden bg-white mt-8">
        <div className="px-4 py-3 bg-gold/10">
          <h3 className="font-display font-semibold text-lg text-ink flex items-center gap-2">
            <AlertTriangle size={20} className="text-gold" />
            {stemChanges.title}
          </h3>
        </div>
        <div className="p-4 space-y-4">
          {stemChanges.patterns.map((pattern, idx) => (
            <div key={idx} className="border-b border-border last:border-0 pb-4 last:pb-0">
              <h4 className="font-medium text-ink">{pattern.type}</h4>
              <p className="text-sm text-ink-light mt-1">{pattern.rule}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {pattern.examples.map((ex, i) => (
                  <span key={i} className="text-sm bg-sand px-2 py-1 rounded">{ex}</span>
                ))}
              </div>
              <p className="text-xs text-ink-light mt-2">
                Affected tenses: {pattern.affectedTenses.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Render être verbs tab
  const renderEtreTab = () => (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-semibold text-ink mb-4">Verbs Using Être</h2>

      <div className="border border-border rounded-xl overflow-hidden bg-white">
        <div className="px-4 py-3 bg-bamboo/10">
          <h3 className="font-display font-semibold text-lg text-ink flex items-center gap-2">
            <Star size={20} className="text-bamboo" />
            {etreVerbs.mnemonic}
          </h3>
          <p className="text-sm text-ink-light mt-1">{etreVerbs.description}</p>
        </div>
        <div className="p-4">
          <div className="grid gap-2">
            {etreVerbs.verbs.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-2 rounded-lg hover:bg-sand-light">
                <span className="w-8 h-8 flex items-center justify-center bg-bamboo text-white rounded-full font-bold">
                  {item.letter}
                </span>
                <div className="flex-1">
                  <button
                    onClick={() => {
                      setSearchTerm(item.verb.toLowerCase())
                      setActiveTab('search')
                    }}
                    className="font-medium text-ink hover:text-bamboo transition-colors"
                  >
                    {item.verb}
                  </button>
                  <span className="text-ink-light ml-2">— {item.meaning}</span>
                </div>
                <span className="text-sm text-ink-light bg-sand px-2 py-1 rounded">
                  {item.pastParticiple}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-gold/10 rounded-lg">
            <p className="text-sm text-ink flex items-start gap-2">
              <Info size={16} className="mt-0.5 text-gold" />
              {etreVerbs.note}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  // Render search tab
  const renderSearchTab = () => (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search verb (e.g., parler, finir, être)..."
            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-bamboo"
          />
        </div>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-bamboo bg-white"
        >
          <option value="all">All Groups</option>
          <option value="1">1er groupe (-ER)</option>
          <option value="2">2e groupe (-IR)</option>
          <option value="3">3e groupe (Irregular)</option>
        </select>
        <select
          value={selectedTense}
          onChange={(e) => setSelectedTense(e.target.value)}
          className="px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-bamboo bg-white"
        >
          <option value="all">All Tenses</option>
          {tenseOrder.map(tenseKey => (
            <option key={tenseKey} value={tenseKey}>{tenses[tenseKey]?.name || tenseKey}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-ink-light">
        {filteredVerbs.length} verb{filteredVerbs.length !== 1 ? 's' : ''} found
      </p>

      {/* Verb list */}
      <div className="space-y-3">
        {filteredVerbs.length > 0 ? (
          filteredVerbs.map(verb => renderVerbCard(verb))
        ) : (
          <div className="text-center py-8 text-ink-light">
            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p>No verbs found matching your search.</p>
            <p className="text-sm mt-2">Try a different search term or filter.</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">French Conjugation Cheatsheet</h1>
        <p className="text-ink-light mt-1">Complete reference for French verb conjugations</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        {[
          { id: 'search', label: 'Search Verbs', icon: Search },
          { id: 'tenses', label: 'Tenses', icon: BookOpen },
          { id: 'groups', label: 'Verb Groups', icon: Info },
          { id: 'etre', label: 'Être Verbs', icon: Star }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-bamboo text-white'
                : 'text-ink hover:bg-sand'
            }`}
          >
            <tab.icon size={18} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'search' && renderSearchTab()}
      {activeTab === 'tenses' && renderTensesTab()}
      {activeTab === 'groups' && renderGroupsTab()}
      {activeTab === 'etre' && renderEtreTab()}
    </div>
  )
}

export default ConjugationCheatsheet
