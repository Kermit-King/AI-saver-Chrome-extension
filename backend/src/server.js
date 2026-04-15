import express from "express";
import cors from "cors";
import { execSync } from "child_process";

const app = express();
const PORT = Number(process.env.PORT) || 5050;

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());

// function toNumber(value, fallback = 0) {
//   const parsed = Number(value);
//   return Number.isFinite(parsed) ? parsed : fallback;
// }

// function buildFallbackMessage({ item, price, userGoal, userTarget, savedAmount }) {
//   const safeItem = item?.toString().trim() || "this purchase";
//   const safeGoal = userGoal?.toString().trim() || "your savings goal";
//   const target = toNumber(userTarget, 0);
//   const saved = toNumber(savedAmount, 0);
//   const cost = toNumber(price, 0);

//   const remaining = Math.max(target - saved, 0);
//   const afterBuyRemaining = Math.max(target - (saved + cost), 0);

//   if (target > 0) {
//     return `If you skip ${safeItem}, that ${cost.toLocaleString()} can move you closer to ${safeGoal}. Remaining after saving now: ${afterBuyRemaining.toLocaleString()} (from ${remaining.toLocaleString()}).`;
//   }

//   return `Pause for 10 seconds before buying ${safeItem}. Small delays help prevent impulse spending.`;
// }

async function handleAnalyze(req, res) {
  const { price, userGoal, userTarget, savedAmount } = req.body ?? {};

  try {
    const persuasionText = execSync(`python ./ai_logic.py "${userGoal}" "${userTarget}" "${price}" "${savedAmount}"`, { encoding: 'utf8' }).trim();

    return res.json({ persuasionText });
  } catch (error) {
    res.json({ persuasionText: "Focus on your savings goal!" });
  }
}

// Keep both routes for frontend compatibility
app.post("/analyze", handleAnalyze);
app.post("/analyze-impulse", handleAnalyze);

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "ai-saver-backend" });
});

app.listen(PORT, () => {
  console.log(`AI Saver Server running at http://localhost:${PORT}`);
});
