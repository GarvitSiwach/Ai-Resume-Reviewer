import os
import json
import random
from fastapi import FastAPI, HTTPException
from models import VerifyRequest, VerifyResponse
from typing import List

app = FastAPI()

import google.generativeai as genai
from fastapi.encoders import jsonable_encoder
from dotenv import load_dotenv

load_dotenv()

def call_gemini(request: VerifyRequest) -> VerifyResponse:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not configured")
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    prompt = f"""You are an expert Resume Verifier and Lie Detector. Analyze this resume and identify inconsistencies, exaggerations, or false claims.

RESUME TEXT:
{request.text}

EXTRACTED ENTITIES:
{request.entities}

Analyze for:
1. Skill Consistency: Do listed skills match project descriptions?
2. Project Authenticity: Do projects sound realistic for the experience level?
3. Timeline Validity: Are there gaps or overlapping dates?
4. Education Credibility: Does education match the career path?

You MUST provide at least 3-5 suspicious points and 3-5 follow-up questions.

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{{
    "skillConsistency": 0.85,
    "projectConsistency": 0.75,
    "timelineConsistency": 0.90,
    "educationCredibility": 0.95,
    "questionConfidence": 0.80,
    "suspiciousPoints": [
        "Specific concern about skill X",
        "Timeline gap between Y and Z",
        "Project claim seems exaggerated"
    ],
    "followupQuestions": [
        "Can you explain specific details about project X?",
        "How did you use technology Y in role Z?",
        "What were the measurable outcomes of achievement A?"
    ]
}}"""
    
    try:
        print(f"Calling Gemini with prompt length: {len(prompt)}")
        response = model.generate_content(prompt)
        print(f"Gemini raw response: {response.text[:500]}")
        
        cleaned_response = response.text.replace("```json", "").replace("```", "").strip()
        if cleaned_response.startswith("json"):
             cleaned_response = cleaned_response[4:].strip()
        print(f"Cleaned response: {cleaned_response[:500]}")
        
        data = json.loads(cleaned_response)
        
        # Ensure we have data
        if not data.get("suspiciousPoints"):
            data["suspiciousPoints"] = ["No specific concerns identified, but manual review recommended."]
        if not data.get("followupQuestions"):
            data["followupQuestions"] = ["Please provide more details about your key achievements."]
        
        print(f"Parsed data: {data}")
        
        return VerifyResponse(
            skillConsistency=data.get("skillConsistency", 0.5),
            projectConsistency=data.get("projectConsistency", 0.5),
            timelineConsistency=data.get("timelineConsistency", 0.5),
            educationCredibility=data.get("educationCredibility", 0.5),
            questionConfidence=data.get("questionConfidence", 0.5),
            suspiciousPoints=data.get("suspiciousPoints", []),
            followupQuestions=data.get("followupQuestions", [])
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"ERROR calling Gemini: {e}")
        # Return meaningful fallback
        return VerifyResponse(
            skillConsistency=0.7,
            projectConsistency=0.7,
            timelineConsistency=0.8,
            educationCredibility=0.8,
            questionConfidence=0.7,
            suspiciousPoints=[
                "Unable to perform AI analysis. Using fallback analysis.",
                "Please verify all claims manually.",
                f"Technical error: {str(e)[:100]}"
            ],
            followupQuestions=[
                "Can you provide references for your work experience?",
                "Please elaborate on your key technical achievements.",
                "What were the measurable outcomes of your projects?"
            ]
        )

@app.post("/verify", response_model=VerifyResponse)
async def verify_resume(request: VerifyRequest):
    print(f"Received request with text length: {len(request.text)}")
    if os.getenv("GEMINI_API_KEY"):
        return call_gemini(request)
    return simulate_analysis(request.text)

def simulate_analysis(text: str) -> VerifyResponse:
    # deterministic randomness based on text length
    random.seed(len(text))
    
    skill_consistency = round(random.uniform(0.7, 1.0), 2)
    project_consistency = round(random.uniform(0.6, 0.95), 2)
    timeline_consistency = round(random.uniform(0.8, 1.0), 2)
    education_credibility = round(random.uniform(0.9, 1.0), 2)
    question_confidence = round(random.uniform(0.8, 0.95), 2)
    
    suspicious_points = [
        "The duration of the 'Senior Developer' role seems short for the claimed achievements.",
        "Skill 'Kubernetes' is listed but not mentioned in any project descriptions."
    ]
    
    followup_questions = [
        "Can you explain the specific architecture challenges you faced in the E-commerce project?",
        "How did you utilize 'Advanced AI Algorithms' in your internship? Please provide specific examples."
    ]
    
    return VerifyResponse(
        skillConsistency=skill_consistency,
        projectConsistency=project_consistency,
        timelineConsistency=timeline_consistency,
        educationCredibility=education_credibility,
        questionConfidence=question_confidence,
        suspiciousPoints=suspicious_points,
        followupQuestions=followup_questions
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
