import { useEffect, useMemo, useState } from 'react'

interface StorageData {
  goalName?: string
  targetAmount?: number
  savedAmount?: number
  blockedCount?: number
}

function App() {
  const [goalName, setGoalName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [savedAmount, setSavedAmount] = useState('')
  const [blockedCount, setBlockedCount] = useState(0)
  const [toastVisible, setToastVisible] = useState(false)

  useEffect(() => {
    const syncState = (result: StorageData) => {
      setGoalName(result.goalName ?? '')
      setTargetAmount(result.targetAmount != null ? String(result.targetAmount) : '')
      setSavedAmount(result.savedAmount != null ? String(result.savedAmount) : '')
      setBlockedCount(result.blockedCount ?? 0)
    }

    chrome.storage.local.get(
      ['goalName', 'targetAmount', 'savedAmount', 'blockedCount'],
      syncState,
    )

    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string,
    ) => {
      if (areaName !== 'local') return
      if (changes.goalName) setGoalName(changes.goalName.newValue as any ?? '')
      if (changes.targetAmount) setTargetAmount(changes.targetAmount.newValue != null ? String(changes.targetAmount.newValue) : '')
      if (changes.savedAmount) setSavedAmount(changes.savedAmount.newValue != null ? String(changes.savedAmount.newValue) : '')
      if (changes.blockedCount) setBlockedCount(changes.blockedCount.newValue as any?? 0)
    }

    chrome.storage.onChanged.addListener(handleStorageChange)
    return () => chrome.storage.onChanged.removeListener(handleStorageChange)
  }, [])

  const targetAmountValue = Number(targetAmount) || 0
  const savedAmountValue = Number(savedAmount) || 0

  const progressPercent = useMemo(() => {
    if (targetAmountValue <= 0) return 0
    return Math.min(Math.round((savedAmountValue / targetAmountValue) * 100), 100)
  }, [savedAmountValue, targetAmountValue])

  const formatMoney = (value: number) => `$${value.toLocaleString()}`

  const handleSave = () => {
    const parsedTargetAmount = Number(targetAmount) || 0
    const parsedSavedAmount = Number(savedAmount) || 0

    chrome.storage.local.set(
      {
        goalName,
        targetAmount: parsedTargetAmount,
        savedAmount: parsedSavedAmount,
        blockedCount,
      },
      () => {
        setToastVisible(true)
        window.setTimeout(() => setToastVisible(false), 2000)
      },
    )
  }

  const handleReset = () => {
    setSavedAmount('')
    setBlockedCount(0)
    chrome.storage.local.set({
      savedAmount: 0,
      blockedCount: 0
    })
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
            {formatMoney(savedAmountValue)} / {formatMoney(targetAmountValue)}
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
            placeholder="e.g. 15000"
            onChange={(e) => setTargetAmount(e.target.value)}
          />
        </div>

        <div className="popup-input-group">
          <label className="popup-input-label" htmlFor="savedAmount">Already Saved ($)</label>
          <input
            id="savedAmount"
            type="number"
            value={savedAmount}
            placeholder="e.g. 200"
            onChange={(e) => setSavedAmount(e.target.value)}
          />
        </div>

        <button className="popup-save-btn" type="button" onClick={handleSave}>Save Goal</button>
        <button className="popup-reset-btn" type="button" onClick={handleReset}>Reset progress</button>
      </section>

      <footer className="popup-impulses-blocked">
        <span>{blockedCount}</span> impulse purchases blocked
      </footer>

      <div className={`popup-toast ${toastVisible ? 'show' : ''}`}>Goal saved!</div>
    </div>
  )
}

export default App