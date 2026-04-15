// alert("CONTENT SCRIPT LOADED");

import { useEffect, useState } from "react";

// console.log("IF YOU SEE THIS, IT WORKS");
const overlayStyles = `
    #ai-saver-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        backdrop-filter: blur(0px);
        animation: overlayIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes overlayIn {
        to {
            background: rgba(10, 10, 20, 0.82);
            backdrop-filter: blur(12px);
        }
    }

    #ai-saver-card {
        background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 24px;
        padding: 48px 40px 40px;
        max-width: 420px;
        width: 90%;
        text-align: center;
        box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.05),
            0 25px 60px -12px rgba(0, 0, 0, 0.5),
            0 0 120px -20px rgba(0, 200, 150, 0.15);
        transform: scale(0.9) translateY(20px);
        opacity: 0;
        animation: cardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
    }

    @keyframes cardIn {
        to {
            transform: scale(1) translateY(0);
            opacity: 1;
        }
    }

    .saver-icon-ring {
        width: 72px;
        height: 72px;
        margin: 0 auto 24px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00c896, #00b4d8);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 30px rgba(0, 200, 150, 0.3);
        animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% {
            box-shadow: 0 0 30px rgba(0, 200, 150, 0.3);
        }
        50% {
            box-shadow: 0 0 50px rgba(0, 200, 150, 0.5);
        }
    }

    .saver-icon-ring svg {
        width: 36px;
        height: 36px;
        color: white;
    }

    .saver-icon-ring img {
        width: 44px;
        height: 44px;
        object-fit: contain;
        display: block;
    }

    .saver-title {
        color: #ffffff;
        font-size: 24px;
        font-weight: 800;
        margin: 0 0 8px;
        letter-spacing: -0.02em;
        line-height: 1.2;
    }

    .saver-subtitle {
        color: rgba(255, 255, 255, 0.5);
        font-size: 13px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin: 0 0 20px;
    }

    #ai-message {
        color: rgba(255, 255, 255, 0.8);
        font-size: 15px;
        line-height: 1.6;
        margin: 0 0 32px;
        min-height: 48px;
    }

    .saver-goal-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(0, 200, 150, 0.12);
        border: 1px solid rgba(0, 200, 150, 0.2);
        border-radius: 100px;
        padding: 6px 16px;
        margin-bottom: 28px;
        color: #00c896;
        font-size: 13px;
        font-weight: 600;
    }

    .saver-btn-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    #cancel-btn {
        all: unset;
        cursor: pointer;
        padding: 14px 24px;
        border-radius: 14px;
        background: linear-gradient(135deg, #00c896, #00b4d8);
        color: white;
        font-size: 15px;
        font-weight: 700;
        font-family: inherit;
        letter-spacing: -0.01em;
        transition: all 0.2s ease;
        box-shadow: 0 4px 16px rgba(0, 200, 150, 0.3);
    }

    #cancel-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 24px rgba(0, 200, 150, 0.45);
    }

    #continue-btn {
        all: unset;
        cursor: pointer;
        padding: 12px 24px;
        border-radius: 14px;
        color: rgba(255, 255, 255, 0.35);
        font-size: 13px;
        font-weight: 500;
        font-family: inherit;
        transition: color 0.2s ease;
    }

    #continue-btn:hover {
        color: rgba(255, 255, 255, 0.55);
    }
`;

function ensureOverlayStyles() {
    if (document.getElementById("ai-saver-style")) return;

    const style = document.createElement("style");
    style.id = "ai-saver-style";
    style.textContent = overlayStyles;
    document.head.appendChild(style);
}

const handleImpulse = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    console.log("DEBUG: You actually touched a:", target.tagName);
    // 1. Specifically look for a button, even if you click the background
    const btn = target.closest("button");

    // 2. If 'btn' is null, they clicked the background/white space
    if (!btn) {
        console.log("You clicked the background, not a button.");
        return;
    }

    // 3. Now we know they clicked a button, check the text
    const text = btn.innerText.toLowerCase();
    if (text.includes("check out") || text.includes("checkout")) {
        console.log("Success! Button logic triggered.");
        injectOverlay();
    }
};

function handleItemSave(overlay: HTMLElement, itemName: string, itemPrice: number) {
    overlay.remove();

    // const itemName =
    //     document.getElementById("item-name")?.innerText || "Unknown Item";
    // const priceRaw = document.getElementById("item-price")?.innerText || "0";

    // const itemPrice = parseFloat(priceRaw.replace(/[^\d.]/g, ""));

    chrome.storage.local.get(
        ["purchaseHistory", "savedAmount", "blockedCount"],
        (result) => {
            const history = (result.purchaseHistory as any[]) || [];
            const saved = result.savedAmount || 0;
            const currentCount = result.blockedCount || 0;
            const updatedCount = Number(currentCount) + 1;

            const newItem = {
                id: Date.now(),
                name: itemName,
                price: itemPrice,
                date: new Date().toLocaleDateString(),
                status: "interupted",
            };

            chrome.storage.local.set(
                {
                    purchaseHistory: [newItem, ...history],
                    savedAmount: Number(saved) + itemPrice,
                    blockedCount: updatedCount,
                },
                () => {
                    console.log("Item added to history log.");
                },
            );
        },
    );
}

function injectOverlay() {
    ensureOverlayStyles();

    const itemName =
        document.getElementById("item-name")?.innerText || "Unknown Item";
    const priceRaw = document.getElementById("item-price")?.innerText || "0";
    const itemPrice = parseFloat(priceRaw.replace(/[^\d.]/g, ""));

    const overlay = document.createElement("div");
    overlay.id = "ai-saver-overlay";

    overlay.innerHTML = `
        <div id="ai-saver-card">
            <div class="saver-icon-ring" aria-hidden="true">
                <img src="${chrome.runtime.getURL("icon.png")}" alt="Impulse Saver wallet icon" />
            </div>
            <h1 class="saver-title">Wait! Do you really need this?</h1>
            <p class="saver-subtitle">Impulse check</p>
            <div class="saver-goal-badge">Protect your savings goal</div>
      <p id="ai-message">Consulting your financial goals...</p>
            <div class="saver-btn-group">
                <button id="cancel-btn">I'll save instead</button>
                <button id="continue-btn">I really need it</button>
      </div>
    </div>
  `;

    document.body.appendChild(overlay);

    // Logic to fetch AI message from your Node.js/Home Server
    fetchAIMessage(itemName, itemPrice);

    document
        .getElementById("cancel-btn")
        ?.addEventListener("click", () => handleItemSave(overlay, itemName, itemPrice));
    document.getElementById("continue-btn")?.addEventListener("click", () => {
        alert("Moving funds to savings simulator...");
        overlay.remove();
        // Here you would trigger the actual checkout if they insist
    });
}

document.addEventListener("click", handleImpulse, true);

async function fetchAIMessage(itemName: string, itemPrice: number) {
    const messageElement = document.getElementById("ai-message");

    // 1. Get the user's specific goal from storage
    chrome.storage.local.get(
        ["goalName", "targetAmount", "savedAmount"],
        async (result) => {
            const goal = result.goalName || "Home Server";
            const target = result.targetAmount || 15000;
            const savedAmount = result.savedAmount || 0;

            try {
                // 2. Send these personalized goal details to your Node.js backend
                const response = await fetch(
                    "http://localhost:5050/analyze-impulse",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            item: itemName,
                            price: itemPrice,
                            userGoal: goal,
                            userTarget: target,
                            savedAmount,
                        }),
                    },
                );
                const data = await response.json();

                if(response.ok){
                    console.log("ai responded")
                }
                if (messageElement)
                    messageElement.innerText = data.persuasionText;
            } catch (err) {
                if (messageElement)
                    messageElement.innerText = `Think of your ${goal}!`;
            }
        },
    );
}
