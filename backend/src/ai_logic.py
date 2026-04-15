import os
import sys
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


async def generateAiResponse(goalItem, goalPrice, price, savedAmount):
    fallback = f"Keep your eyes on the prize: your {goalItem} is waiting!"
    
    try:
        response = await client.aio.models.generate_content(model="gemini-2.0-flash", 
            contents=(
                f"In one short sentence, convince me not to buy an item that costs {price}. "
                f"I am saving for a {goalItem} which costs {goalPrice}. "
                f"I have already saved {savedAmount}."
            )
        )
        if response and response.text:
            return response.text.strip()
        return fallback
        
    except Exception as e:
        # This prints to the terminal/Node log, NOT the extension overlay
        print(f"DEBUG (AI Error): {e}", file=sys.stderr) 
        
        # This is what gets sent back to Node's 'stdout'
        return fallback


if __name__ == "__main__":
    goalItem = sys.argv[1]
    goalPrice = sys.argv[2]
    price = sys.argv[3]
    savedAmount = sys.argv[4]
    
    import asyncio
    result = asyncio.run(generateAiResponse(goalItem, goalPrice, price, savedAmount))
    print(result)
