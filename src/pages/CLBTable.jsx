import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Info } from 'lucide-react'
import useStore from '../store/useStore'

const clbData = [
  { clb: 12, listening: '549-699', reading: '549-699', writing: '18-20', speaking: '18-20' },
  { clb: 11, listening: '523-548', reading: '524-548', writing: '14-17', speaking: '14-17' },
  { clb: 10, listening: '503-522', reading: '499-523', writing: '12-13', speaking: '12-13' },
  { clb: 9, listening: '458-502', reading: '453-498', writing: '10-11', speaking: '10-11' },
  { clb: 8, listening: '398-457', reading: '406-452', writing: '7-9', speaking: '7-9' },
  { clb: 7, listening: '369-397', reading: '375-405', writing: '6', speaking: '6' },
  { clb: 6, listening: '331-368', reading: '342-374', writing: '5', speaking: '5' },
  { clb: 5, listening: '298-330', reading: '306-341', writing: '4', speaking: '4' },
  { clb: 4, listening: '248-297', reading: '217-305', writing: '3', speaking: '3' },
]

function CLBTable() {
  const { scores, setScores } = useStore()
  const [editing, setEditing] = useState(false)
  const [tempScores, setTempScores] = useState({ ...scores })

  const handleSave = () => {
    setScores(tempScores)
    setEditing(false)
  }

  const getCLBLevel = (type, score) => {
    if (!score) return null
    const numScore = parseInt(score)

    for (const row of clbData) {
      const range = row[type]
      if (range.includes('-')) {
        const [min, max] = range.split('-').map(Number)
        if (numScore >= min && numScore <= max) return row.clb
      } else {
        if (numScore === parseInt(range)) return row.clb
      }
    }

    // Check if above or below range
    if (type === 'listening' || type === 'reading') {
      if (numScore >= 549) return '12+'
      if (numScore < 248) return '<4'
    } else {
      if (numScore >= 18) return '12+'
      if (numScore < 3) return '<4'
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
          <h1 className="font-display text-2xl font-bold text-ink">CLB Reference</h1>
          <p className="text-ink-light mt-1">TCF Canada to CLB conversion table</p>
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
                  <span className="text-sm text-bamboo">CLB {getCLBLevel('listening', scores.listening)}</span>
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
                  <span className="text-sm text-bamboo">CLB {getCLBLevel('reading', scores.reading)}</span>
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
                  <span className="text-sm text-bamboo">CLB {getCLBLevel('writing', scores.writing)}</span>
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
                  <span className="text-sm text-bamboo">CLB {getCLBLevel('speaking', scores.speaking)}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CLB Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand border-b border-border">
                <th className="px-4 py-3 text-left font-semibold text-ink">CLB</th>
                <th className="px-4 py-3 text-left font-semibold text-ink">Listening</th>
                <th className="px-4 py-3 text-left font-semibold text-ink">Reading</th>
                <th className="px-4 py-3 text-left font-semibold text-ink">Writing</th>
                <th className="px-4 py-3 text-left font-semibold text-ink">Speaking</th>
              </tr>
            </thead>
            <tbody>
              {clbData.map((row) => (
                <tr
                  key={row.clb}
                  className={`border-b border-border ${
                    row.clb === 9 ? 'bg-bamboo/10' : ''
                  }`}
                >
                  <td className={`px-4 py-3 font-semibold ${
                    row.clb === 9 ? 'text-bamboo' : 'text-ink'
                  }`}>
                    {row.clb}
                    {row.clb === 9 && (
                      <span className="ml-2 text-xs bg-bamboo text-white px-1.5 py-0.5 rounded">
                        Target
                      </span>
                    )}
                  </td>
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
            <span className="font-semibold text-ink">CLB 9 (highlighted)</span> is the target for TCF Canada,
            equivalent to CLB 7 for immigration purposes. This is the minimum for Express Entry competitiveness.
          </p>
          <p>
            Listening & Reading: 0-699 scale. Writing & Speaking: 0-20 scale.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CLBTable
