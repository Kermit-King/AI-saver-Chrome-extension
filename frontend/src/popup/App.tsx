import { useState, useEffect } from 'react';

function App() {
  const [goalName, setGoalName] = useState('Home Server');
  const [targetAmount, setTargetAmount] = useState(15000);
  const [saved, setSaved] = useState(false);

  // Load existing settings when the popup opens
  useEffect(() => {
    chrome.storage.local.get(['goalName', 'targetAmount'], (result) => {
      if (result.goalName) setGoalName(result.goalName);
      if (result.targetAmount) setTargetAmount(result.targetAmount);
    });
  }, []);

  const handleSave = () => {
    chrome.storage.local.set({ goalName, targetAmount }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000); // Visual feedback
    });
  };

  return (
    <div className="w-64 p-4 bg-slate-900 text-white shadow-xl">
      <h2 className="text-lg font-bold mb-4 border-b border-slate-700 pb-2">🎯 Goal Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-slate-400 uppercase">Saving for:</label>
          <input 
            type="text" 
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 uppercase">Target Price (₱):</label>
          <input 
            type="number" 
            value={targetAmount}
            onChange={(e) => setTargetAmount(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button 
          onClick={handleSave}
          className={`w-full py-2 rounded font-semibold transition ${saved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {saved ? 'Settings Saved!' : 'Save Goal'}
        </button>
      </div>
    </div>
  );
}

export default App;