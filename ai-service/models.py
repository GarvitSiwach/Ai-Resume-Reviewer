from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class VerifyRequest(BaseModel):
    text: str
    entities: str  # JSON string or structured object

class VerifyResponse(BaseModel):
    skillConsistency: float
    projectConsistency: float
    timelineConsistency: float
    educationCredibility: float
    questionConfidence: float
    suspiciousPoints: List[str]
    followupQuestions: List[str]
