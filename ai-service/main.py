import os
import json
import random
from fastapi import FastAPI, HTTPException
from models import VerifyRequest, VerifyResponse
from typing import List

app = FastAPI()

import google.generativeai as genai
from fastapi.encoders import jsonable_encoder

def call_gemini(request: VerifyRequest) -> VerifyResponse:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    prompt = f"""
    You are an expert Resume Verifier and Lie Detector. Your job is to analyze the following resume text and extracted entities to identify inconsistencies, exaggerations, or false claims.
    
    RESUME TEXT:
    {request.text}
    
    EXTRACTED ENTITIES:
    {request.entities}
    
    Analyze the resume for:
    1. Skill Consistency: Do the listed skills match the project descriptions?
    2. Project Authenticity: Do the projects sound realistic for the experience level?
    3. Timeline Validity: Are there gaps or overlapping dates that don't make sense?
    4. Education Credibility: Does the education match the career path?
    
    Output strictly in JSON format matching this structure:
    {{
        "skillConsistency": float (0.0-1.0),
        "projectConsistency": float (0.0-1.0),
        "timelineConsistency": float (0.0-1.0),
        "educationCredibility": float (0.0-1.0),
        "questionConfidence": float (0.0-1.0),
        "suspiciousPoints": ["point 1", "point 2"],
        "followupQuestions": ["question 1", "question 2"]
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        cleaned_response = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(cleaned_response)
        
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
        print(f"Error calling Gemini: {e}")
        # Return error as response to make it visible in UI
        return VerifyResponse(
            skillConsistency=0.0,
            projectConsistency=0.0,
            timelineConsistency=0.0,
            educationCredibility=0.0,
            questionConfidence=0.0,
            suspiciousPoints=[f"AI Error: {str(e)}"],
            followupQuestions=["Please check backend logs."]
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
