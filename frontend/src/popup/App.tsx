import { useEffect, useMemo, useState } from 'react'

interface StorageData {
  goalName?: string
  targetAmount?: number
  savedAmount?: number
  blockedCount?: number
}

function App() {
  const [goalName, setGoalName] = useState('')
  const [targetAmount, setTargetAmount] = useState(0)
  const [savedAmount, setSavedAmount] = useState(0)
  const [blockedCount, setBlockedCount] = useState(0)
  const [toastVisible, setToastVisible] = useState(false)

  useEffect(() => {
    chrome.storage.local.get(
      ['goalName', 'targetAmount', 'savedAmount', 'blockedCount'],
      (result: StorageData) => {
        setGoalName(result.goalName ?? '')
        setTargetAmount(result.targetAmount ?? 0)
        setSavedAmount(result.savedAmount ?? 0)
        setBlockedCount(result.blockedCount ?? 0)
      },
    )
  }, [])

  const progressPercent = useMemo(() => {
    if (targetAmount <= 0) return 0
    return Math.min(Math.round((savedAmount / targetAmount) * 100), 100)
  }, [savedAmount, targetAmount])

  const formatMoney = (value: number) => `$${value.toLocaleString()}`

  const handleSave = () => {
    chrome.storage.local.set(
      {
        goalName,
        targetAmount,
        savedAmount,
      },
      () => {
        setToastVisible(true)
        window.setTimeout(() => setToastVisible(false), 2000)
      },
    )
  }

  return (
    <div className="popup-shell">
      <header className="popup-header">
        <div className="popup-logo" aria-hidden="true">
          <img src="/icon.png" alt="Impulse Saver wallet icon" />
        </div>
        <div className="popup-app-name">Impulse Saver</div>
        <p className="popup-tagline">You a bum chud if you don't save up</p>
      </header>

      <section className="popup-stats-section">
        <div className="popup-stat-card">
          <div className="popup-stat-label">Your Goal</div>
          <div className="popup-stat-value">{goalName || '—'}</div>
          <p className="popup-stat-sub">
            {formatMoney(savedAmount)} / {formatMoney(targetAmount)}
          </p>
          <div className="popup-progress-track" aria-label="Goal progress">
            <div className="popup-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </section>

      <section className="popup-form-section">
        <h2 className="popup-section-title">Configure Your Goal</h2>

        <div className="popup-input-group">
          <label className="popup-input-label" htmlFor="goalName">Goal Name</label>
          <input
            id="goalName"
            type="text"
            value={goalName}
            placeholder="e.g. Home Server, Vacation"
            onChange={(e) => setGoalName(e.target.value)}
          />
        </div>

        <div className="popup-input-group">
          <label className="popup-input-label" htmlFor="targetAmount">Target Amount ($)</label>
          <input
            id="targetAmount"
            type="number"
            value={targetAmount}
            placeholder="15000"
            onChange={(e) => setTargetAmount(Number(e.target.value) || 0)}
          />
        </div>

        <div className="popup-input-group">
          <label className="popup-input-label" htmlFor="savedAmount">Already Saved ($)</label>
          <input
            id="savedAmount"
            type="number"
            value={savedAmount}
            placeholder="0"
            onChange={(e) => setSavedAmount(Number(e.target.value) || 0)}
          />
        </div>

        <button className="popup-save-btn" type="button" onClick={handleSave}>Save Goal</button>
      </section>

      <footer className="popup-impulses-blocked">
        <span>{blockedCount}</span> impulse purchases blocked
      </footer>

      <div className={`popup-toast ${toastVisible ? 'show' : ''}`}>Goal saved!</div>
    </div>
  )
}

export default App