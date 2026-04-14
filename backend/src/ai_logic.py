import os
import sys
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


async def generateAiResponse(goalItem, goalPrice, item, price, savedAmount):
    try:
        # Use the .aio attribute for asynchronous calls
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash", # Note: Standard 2026 stable model
            contents=f"In one short sentence, convince me not to buy {item} that costs {price}. I am looking to save up for a {goalItem} which costs {goalPrice}. I have already saved {savedAmount}."
        )
        return response.text
    except Exception as e:
        # Print the error to console so you can see WHY it failed
        print(f"Error: {e}") 
        return f"Think of your {goalItem}!"


if __name__ == "__main__":
    goalItem = sys.argv[1]
    goalPrice = sys.argv[2]
    item = sys.argv[3]
    price = sys.argv[4]
    savedAmount = sys.argv[5]
    
    import asyncio
    result = asyncio.run(generateAiResponse(goalItem, goalPrice, item, price, savedAmount))
    print(result)
