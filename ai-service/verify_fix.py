import os
from dotenv import load_dotenv
import google.generativeai as genai
from models import VerifyRequest

# Load env
load_dotenv()

# Mock request
request = VerifyRequest(
    text="Experienced Software Engineer with 5 years of experience in Python and Java. Worked at Google and Facebook.",
    entities="{}"
)

# Import the function to test
from main import call_gemini

try:
    print("Testing call_gemini...")
    response = call_gemini(request)
    print("Success!")
    print(f"Truth Score: {response.skillConsistency}")
    print(f"Suspicious Points: {response.suspiciousPoints}")
except Exception as e:
    print(f"Failed: {e}")
    import traceback
    traceback.print_exc()
