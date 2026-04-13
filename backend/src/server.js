import express from "express";
import cors from "cors";
import {spawn} from "child_process"

const app = cors();
const PORT = 5000;

app.use(cors({
    origin: '*' // During dev, '*' is fine. In production, use 'chrome-extension://YOUR_ID'
}));

app.use(express.json());

app.post("/analyze", async (req, res) =>{
    const {item, price} = req.body;

    console.log(`processing ai message for ${item} - ${price}`);

    const pythonProcess = spawn("python", ["ai_logic.py", item, price.toString()]);

    let aiResponse = ""

    pythonProcess.stdout.on('data', (data) => {
        aiResponse += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            res.json({ persuasionText: aiResponse.trim() });
        } else {
            res.status(500).json({ persuasionText: "Think of the home server! You can do it!" });
        }
    });
});  

app.listen(PORT, () => {
    console.log(`🚀 AI Saver Server running at http://localhost:${PORT}`);
});