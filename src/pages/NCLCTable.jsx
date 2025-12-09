import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Info } from 'lucide-react'
import useStore from '../store/useStore'

const nclcData = [
  { nclc: 10, cefr: 'C2', listening: '549-699', reading: '549-699', writing: '16-20', speaking: '16-20' },
  { nclc: 9, cefr: 'C1', listening: '523-548', reading: '524-548', writing: '14-15', speaking: '14-15' },
  { nclc: 8, cefr: 'B2+', listening: '503-522', reading: '499-523', writing: '12-13', speaking: '12-13' },
  { nclc: 7, cefr: 'B2', listening: '458-502', reading: '453-498', writing: '10-11', speaking: '10-11' },
  { nclc: 6, cefr: 'B1+', listening: '398-457', reading: '406-452', writing: '7-9', speaking: '7-9' },
  { nclc: 5, cefr: 'B1', listening: '369-397', reading: '375-405', writing: '6', speaking: '6' },
  { nclc: 4, cefr: 'A2+', listening: '331-368', reading: '342-374', writing: '4-5', speaking: '4-5' },
]

function NCLCTable() {
  const { scores, setScores } = useStore()
  const [editing, setEditing] = useState(false)
  const [tempScores, setTempScores] = useState({ ...scores })

  const handleSave = () => {
    setScores(tempScores)
    setEditing(false)
  }

  const getNCLCLevel = (type, score) => {
    if (!score) return null
    const numScore = parseInt(score)

    for (const row of nclcData) {
      const range = row[type]
      if (range.includes('-')) {
        const [min, max] = range.split('-').map(Number)
        if (numScore >= min && numScore <= max) return row.nclc
      } else {
        if (numScore === parseInt(range)) return row.nclc
      }
    }

    // Check if above or below range
    if (type === 'listening' || type === 'reading') {
      if (numScore >= 549) return '10+'
      if (numScore < 331) return '<4'
    } else {
      if (numScore >= 16) return '10+'
      if (numScore < 4) return '<4'
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="p-2 hover:bg-sand rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-ink" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">NCLC Reference</h1>
          <p className="text-ink-light mt-1">TCF Canada to NCLC conversion table</p>
        </div>
      </div>

      {/* Score Input */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display font-semibold text-ink">Your TCF Scores</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="text-bamboo hover:underline text-sm"
            >
              Edit scores
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="bg-bamboo text-white px-3 py-1 rounded-lg text-sm hover:bg-bamboo-dark"
            >
              Save
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink-light mb-1">Listening (0-699)</label>
            {editing ? (
              <input
                type="number"
                min="0"
                max="699"
                value={tempScores.listening || ''}
                onChange={(e) => setTempScores({ ...tempScores, listening: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border focus:border-bamboo outline-none"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-ink">{scores.listening || '-'}</span>
                {scores.listening && (
                  <span className="text-sm text-bamboo">NCLC {getNCLCLevel('listening', scores.listening)}</span>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-ink-light mb-1">Reading (0-699)</label>
            {editing ? (
              <input
                type="number"
                min="0"
                max="699"
                value={tempScores.reading || ''}
                onChange={(e) => setTempScores({ ...tempScores, reading: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border focus:border-bamboo outline-none"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-ink">{scores.reading || '-'}</span>
                {scores.reading && (
                  <span className="text-sm text-bamboo">NCLC {getNCLCLevel('reading', scores.reading)}</span>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-ink-light mb-1">Writing (0-20)</label>
            {editing ? (
              <input
                type="number"
                min="0"
                max="20"
                value={tempScores.writing || ''}
                onChange={(e) => setTempScores({ ...tempScores, writing: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border focus:border-bamboo outline-none"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-ink">{scores.writing || '-'}</span>
                {scores.writing && (
                  <span className="text-sm text-bamboo">NCLC {getNCLCLevel('writing', scores.writing)}</span>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-ink-light mb-1">Speaking (0-20)</label>
            {editing ? (
              <input
                type="number"
                min="0"
                max="20"
                value={tempScores.speaking || ''}
                onChange={(e) => setTempScores({ ...tempScores, speaking: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border focus:border-bamboo outline-none"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-ink">{scores.speaking || '-'}</span>
                {scores.speaking && (
                  <span className="text-sm text-bamboo">NCLC {getNCLCLevel('speaking', scores.speaking)}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NCLC Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand border-b border-border">
                <th className="px-4 py-3 text-left font-semibold text-ink">NCLC</th>
                <th className="px-4 py-3 text-left font-semibold text-ink">CEFR</th>
                <th className="px-4 py-3 text-left font-semibold text-ink">Listening</th>
                <th className="px-4 py-3 text-left font-semibold text-ink">Reading</th>
                <th className="px-4 py-3 text-left font-semibold text-ink">Writing</th>
                <th className="px-4 py-3 text-left font-semibold text-ink">Speaking</th>
              </tr>
            </thead>
            <tbody>
              {nclcData.map((row) => (
                <tr
                  key={row.nclc}
                  className={`border-b border-border ${
                    row.nclc === 7 ? 'bg-bamboo/10' : ''
                  }`}
                >
                  <td className={`px-4 py-3 font-semibold ${
                    row.nclc === 7 ? 'text-bamboo' : 'text-ink'
                  }`}>
                    {row.nclc}
                    {row.nclc === 7 && (
                      <span className="ml-2 text-xs bg-bamboo text-white px-1.5 py-0.5 rounded">
                        Target
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink">{row.cefr}</td>
                  <td className="px-4 py-3 text-ink">{row.listening}</td>
                  <td className="px-4 py-3 text-ink">{row.reading}</td>
                  <td className="px-4 py-3 text-ink">{row.writing}</td>
                  <td className="px-4 py-3 text-ink">{row.speaking}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="bg-sand rounded-xl p-4 flex gap-3">
        <Info size={20} className="text-ink-light flex-shrink-0 mt-0.5" />
        <div className="text-sm text-ink-light">
          <p className="mb-2">
            <span className="font-semibold text-ink">NCLC 7 (highlighted)</span> is the target level,
            equivalent to CEFR B2. This is the minimum for Express Entry competitiveness.
          </p>
          <p className="mb-2">
            <span className="font-semibold text-ink">CEFR</span> (Common European Framework of Reference for Languages)
            provides a standardized way to compare language proficiency across different systems.
          </p>
          <p>
            Listening & Reading: 0-699 scale. Writing & Speaking: 0-20 scale.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NCLCTable
