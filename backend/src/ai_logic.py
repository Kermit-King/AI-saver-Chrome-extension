import os
import sys
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


async def generateAiResponse(item, price):

    price = float(price)





    # video_id = get_video_id(request.url)
    
    # transcript = get_transcript(video_id)
    # if not transcript:
    #     raise HTTPException(status_code=404, detail="Transcript not found for this video.")

    # summary = summarize_text(transcript)
    
    # return {
    #     "video_id": video_id,
    #     "summary": summary
    # }


if __name__ == "__main__":
    item_name = sys.argv[1]
    item_price = sys.argv[1]

    print(generateAiResponse(item_name, item_price))


# import os
# from google import genai
# from youtube_transcript_api import YouTubeTranscriptApi
# from dotenv import load_dotenv

# load_dotenv()

# # Configure Gemini
# client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# def get_video_id(url: str):
#     # Extracts ID from https://www.youtube.com/watch?v=ID or https://youtu.be/ID
#     if "v=" in url:
#         return url.split("v=")[1].split("&")[0]
#     return url.split("/")[-1]

# def get_transcript(video_id: str):
#     try:
#         print(f"DEBUG: Initializing API for video: {video_id}")
        
#         # 1. Initialize the API
#         ytt_api = YouTubeTranscriptApi()
        
#         # 2. Get the transcript list object
#         transcript_list = ytt_api.list(video_id)
        
#         # 3. Find the best transcript (English or Tagalog)
#         transcript = transcript_list.find_transcript(['en', 'tl'])
        
#         # 4. Fetch the data.
#         data_object = transcript.fetch()
        
#         # 5. Extract text — segments are FetchedTranscriptSnippet objects, use .text directly
#         transcript_text = ""
#         for segment in data_object:
#             transcript_text += segment.text + " "
            
#         if transcript_text.strip():
#             return transcript_text.strip()
#         else:
#             print("ERROR: Transcript text is empty.")
#             return None

#     except Exception as e:
#         print(f"DETAILED ERROR: {e}")
#         return None

# def summarize_text(text: str):
#     try:
#         # Use Gemini 3 Flash (the 2026 standard) or 2.5 Flash as fallback
#         # Both are significantly faster and more accurate than 1.5
#         response = client.models.generate_content(
#             model="gemini-3-flash", 
#             contents=f"Provide a concise bulleted summary of this transcript:\n\n{text}"
#         )
#         return response.text
#     except Exception as e:
#         print(f"DEBUG: Gemini 3 failed, trying 2.5 Flash: {e}")
#         # Fallback to the stable 2.5 series if 3 is in restricted preview
#         response = client.models.generate_content(
#             model="gemini-2.5-flash",
#             contents=f"Summarize this transcript:\n\n{text}"
#         )
#         return response.text