
const handleImpulse = (event: MouseEvent) => {
  // Check if the user is clicking a 'Checkout' or 'Place Order' button
  const target = event.target as HTMLElement;
  const isCheckoutBtn = target.innerText?.toLowerCase().includes('check out') || 
                        target.innerText?.toLowerCase().includes('place order');

  if (isCheckoutBtn) {
    event.preventDefault(); // Stop the purchase!
    event.stopPropagation();
    
    injectOverlay();
  }
};

function injectOverlay() {
  const overlay = document.createElement('div');
  overlay.id = "ai-saver-overlay";
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.85); z-index: 99999;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    color: white; font-family: sans-serif;
  `;

  overlay.innerHTML = `
    <div style="text-align: center; max-width: 400px; padding: 20px;">
      <h1>Wait! Do you really need this?</h1>
      <p id="ai-message">Consulting your financial goals...</p>
      <div style="margin-top: 20px;">
        <button id="cancel-btn" style="padding: 10px 20px; margin-right: 10px;">I'll save instead</button>
        <button id="continue-btn" style="background: transparent; color: gray; border: none;">I really need it</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Logic to fetch AI message from your Node.js/Home Server
  fetchAIMessage();

  document.getElementById('cancel-btn')?.addEventListener('click', () => overlay.remove());
  document.getElementById('continue-btn')?.addEventListener('click', () => {
    alert("Moving funds to savings simulator...");
    overlay.remove();
    // Here you would trigger the actual checkout if they insist
  });
}

document.addEventListener('click', handleImpulse, true);


async function fetchAIMessage() {
  const messageElement = document.getElementById('ai-message');
  
  // 1. Get the user's specific goal from storage
  chrome.storage.local.get(['goalName', 'targetAmount'], async (result) => {
    const goal = result.goalName || "Home Server";
    const target = result.targetAmount || 15000;

    try {
      // 2. Send these personalized goal details to your Node.js backend
      const response = await fetch('http://localhost:5000/analyze-impulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          item: "Product Name", 
          price: 2500,
          userGoal: goal,     // New field
          userTarget: target  // New field
        })
      });
      const data = await response.json();
      if (messageElement) messageElement.innerText = data.persuasionText;
    } catch (err) {
      if (messageElement) messageElement.innerText = `Think of your ${goal}!`;
    }
  });
}