import google.generativeai as genai
import os

api_key = "AIzaSyBJ4TS2mmWv_O8yYHus9dxNUYz_LlaydTU"
os.environ["GEMINI_API_KEY"] = api_key
genai.configure(api_key=api_key)

try:
    print("Listing models...")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
    print("Success!")
except Exception as e:
    print(f"Error: {e}")
