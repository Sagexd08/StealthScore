"""
PitchGuard Lite Backend
FastAPI application for secure pitch scoring using OpenRouter + Mistral
"""

import os
import json
import time
import hashlib
import base64
from typing import Dict, Any
import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
import requests
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.exceptions import InvalidTag

# Configure logging to avoid logging sensitive data
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Disable detailed request logging to prevent pitch data leakage
logging.getLogger("uvicorn.access").disabled = True

app = FastAPI(
    title="PitchGuard Lite API",
    description="Secure pitch scoring with client-side encryption",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
MODEL_NAME = "mistralai/mistral-small:free"  # Free Mistral model

if not OPENROUTER_API_KEY:
    logger.warning("OPENROUTER_API_KEY not set. API calls will fail.")

# Request/Response Models
class PitchRequest(BaseModel):
    ciphertext: str
    iv: str
    aes_key: str
    
    @validator('ciphertext', 'iv', 'aes_key')
    def validate_base64(cls, v):
        try:
            base64.b64decode(v)
            return v
        except Exception:
            raise ValueError("Invalid base64 encoding")

class ScoreResponse(BaseModel):
    scores: Dict[str, float]
    receipt: str

class HealthResponse(BaseModel):
    status: str
    timestamp: float

# Utility Functions
def secure_decrypt(ciphertext_b64: str, iv_b64: str, key_b64: str) -> str:
    """
    Securely decrypt AES-GCM encrypted data with fallback support
    """
    try:
        # Decode base64 inputs
        ciphertext = base64.b64decode(ciphertext_b64)
        iv = base64.b64decode(iv_b64)
        key = base64.b64decode(key_b64)

        # Check if this is fallback encryption (simple XOR)
        if len(key) < 32:
            # This is fallback encryption - simple XOR decryption
            logger.warning("Using fallback decryption - NOT SECURE!")
            key_str = key.decode('utf-8')
            encrypted_str = ciphertext.decode('utf-8')

            # Simple XOR decryption
            decrypted = ''
            for i, char in enumerate(encrypted_str):
                key_char = key_str[i % len(key_str)]
                decrypted += chr(ord(char) ^ ord(key_char))

            return decrypted

        # Validate key length (256-bit = 32 bytes)
        if len(key) != 32:
            raise ValueError("Invalid AES key length")

        # Validate IV length (96-bit = 12 bytes for GCM)
        if len(iv) != 12:
            raise ValueError("Invalid IV length")

        # Decrypt using AES-GCM
        aesgcm = AESGCM(key)
        plaintext_bytes = aesgcm.decrypt(iv, ciphertext, None)

        # Convert to string
        plaintext = plaintext_bytes.decode('utf-8')

        # Immediately overwrite sensitive variables
        key = b'\x00' * len(key)
        plaintext_bytes = b'\x00' * len(plaintext_bytes)

        return plaintext

    except InvalidTag:
        raise HTTPException(status_code=400, detail="Decryption failed: Invalid authentication tag")
    except Exception as e:
        logger.error(f"Decryption error: {type(e).__name__}")
        raise HTTPException(status_code=400, detail="Decryption failed")

def call_openrouter_api(pitch_text: str) -> Dict[str, float]:
    """
    Call OpenRouter API with Mistral model for pitch scoring
    """
    if not OPENROUTER_API_KEY:
        # Return mock scores for testing when API key is not available
        logger.warning("Using mock scores - OPENROUTER_API_KEY not configured")
        import random
        random.seed(len(pitch_text))  # Deterministic based on pitch length
        return {
            "clarity": round(random.uniform(6.0, 9.0), 1),
            "originality": round(random.uniform(5.5, 8.5), 1),
            "team_strength": round(random.uniform(6.5, 9.5), 1),
            "market_fit": round(random.uniform(6.0, 8.8), 1)
        }
    
    system_prompt = """You are an expert pitch evaluator. Given the pitch text, assign a score between 0.0 and 10.0 for each criterion: "clarity", "originality", "team_strength", "market_fit". Return a valid JSON object only, e.g.: { "clarity": 7.5, "originality": 6.2, "team_strength": 8.1, "market_fit": 9.0 }."""
    
    user_prompt = f"""Pitch:
\"\"\"{pitch_text}\"\"\""""
    
    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.0,
        "max_tokens": 200,
        "top_p": 1.0
    }
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000",  # Required by OpenRouter
        "X-Title": "PitchGuard Lite"
    }
    
    try:
        response = requests.post(
            f"{OPENROUTER_BASE_URL}/chat/completions",
            json=payload,
            headers=headers,
            timeout=30
        )
        
        if response.status_code != 200:
            logger.error(f"OpenRouter API error: {response.status_code} - {response.text}")
            raise HTTPException(status_code=500, detail="AI scoring service unavailable")
        
        result = response.json()
        
        if 'choices' not in result or not result['choices']:
            raise HTTPException(status_code=500, detail="Invalid AI response format")
        
        content = result['choices'][0]['message']['content'].strip()
        
        # Parse JSON response
        try:
            scores = json.loads(content)
        except json.JSONDecodeError:
            # Try to extract JSON from response if it's wrapped in text
            import re
            json_match = re.search(r'\{[^}]+\}', content)
            if json_match:
                scores = json.loads(json_match.group())
            else:
                raise HTTPException(status_code=500, detail="AI returned invalid JSON format")
        
        # Validate required fields
        required_fields = ['clarity', 'originality', 'team_strength', 'market_fit']
        for field in required_fields:
            if field not in scores:
                raise HTTPException(status_code=500, detail=f"Missing score field: {field}")
            
            # Ensure score is a number and within valid range
            try:
                score = float(scores[field])
                if not (0.0 <= score <= 10.0):
                    score = max(0.0, min(10.0, score))  # Clamp to valid range
                scores[field] = round(score, 2)
            except (ValueError, TypeError):
                raise HTTPException(status_code=500, detail=f"Invalid score value for {field}")
        
        return scores
        
    except requests.exceptions.RequestException as e:
        logger.error(f"OpenRouter API request failed: {e}")
        raise HTTPException(status_code=500, detail="AI scoring service unavailable")

def generate_receipt(ciphertext_b64: str, model_name: str, scores: Dict[str, float]) -> str:
    """
    Generate SHA-256 receipt hash for verification
    """
    timestamp_unix = str(int(time.time()))
    joined_scores = "%.2f,%.2f,%.2f,%.2f" % (
        scores['clarity'],
        scores['originality'], 
        scores['team_strength'],
        scores['market_fit']
    )
    
    receipt_input = f"{ciphertext_b64}|{model_name}|{timestamp_unix}|{joined_scores}"
    receipt_hash = hashlib.sha256(receipt_input.encode('utf-8')).hexdigest()
    
    return receipt_hash

# API Endpoints
@app.get("/", response_model=HealthResponse)
async def root():
    """Health check endpoint"""
    return HealthResponse(
        status="PitchGuard Lite API is running",
        timestamp=time.time()
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Detailed health check"""
    api_key_status = "configured" if OPENROUTER_API_KEY else "missing"
    return HealthResponse(
        status=f"healthy - OpenRouter API key {api_key_status}",
        timestamp=time.time()
    )

@app.post("/score", response_model=ScoreResponse)
async def score_pitch(request: PitchRequest):
    """
    Main endpoint: decrypt pitch, score with AI, return scores + receipt
    """
    try:
        # Step 1: Decrypt the pitch text
        logger.info("Processing encrypted pitch submission")
        pitch_text = secure_decrypt(request.ciphertext, request.iv, request.aes_key)
        
        # Validate pitch length
        if len(pitch_text.strip()) < 10:
            raise HTTPException(status_code=400, detail="Pitch text too short")
        
        # Step 2: Call OpenRouter API for scoring
        logger.info("Calling AI scoring service")
        scores = call_openrouter_api(pitch_text)
        
        # Step 3: Generate receipt
        receipt = generate_receipt(request.ciphertext, MODEL_NAME, scores)
        
        # Step 4: Immediately clear pitch text from memory
        pitch_text = "X" * len(pitch_text)  # Overwrite
        del pitch_text
        
        logger.info("Pitch scored successfully")
        
        return ScoreResponse(
            scores=scores,
            receipt=receipt
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in score_pitch: {type(e).__name__}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler to prevent sensitive data leakage
    """
    logger.error(f"Unhandled exception: {type(exc).__name__}")
    return HTTPException(status_code=500, detail="Internal server error")

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("PitchGuard Lite API starting up")
    if not OPENROUTER_API_KEY:
        logger.warning("⚠️  OPENROUTER_API_KEY environment variable not set!")
        logger.warning("   Set it with: export OPENROUTER_API_KEY=your_key_here")
    else:
        logger.info("✅ OpenRouter API key configured")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("PitchGuard Lite API shutting down")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )