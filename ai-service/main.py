"""
AI-Powered Job Recommendation Platform — AI Microservice
FastAPI application providing resume parsing, skill extraction, and job matching endpoints.
"""
import os
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from resume_parser import parse_resume
from skill_extractor import extract_skills, get_flat_skill_list
from embedding_engine import generate_embedding, rank_jobs
from resume_analyzer import analyze_resume

app = FastAPI(
    title="Job Recommendation AI Service",
    description="Resume parsing, skill extraction, and semantic job matching",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──── Request / Response Models ────


class TextInput(BaseModel):
    text: str


class EmbeddingRequest(BaseModel):
    text: str


class JobEmbedding(BaseModel):
    id: int
    embedding: List[float]


class RecommendRequest(BaseModel):
    user_embedding: List[float]
    jobs: List[JobEmbedding]
    top_n: Optional[int] = 10


class SkillsResponse(BaseModel):
    skills: dict
    flat_skills: List[str]


class EmbeddingResponse(BaseModel):
    embedding: List[float]
    dimensions: int


class ResumeParseResponse(BaseModel):
    text: str
    skills: dict
    flat_skills: List[str]
    embedding: List[float]


class RecommendResponse(BaseModel):
    recommendations: List[dict]


class ATSReportResponse(BaseModel):
    score: int
    grade: str
    breakdown: dict
    tips: List[dict]
    strengths: List[str]
    stats: dict


# ──── Endpoints ────


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "ai-service"}


@app.post("/parse-resume", response_model=ResumeParseResponse)
async def parse_resume_endpoint(file: UploadFile = File(...)):
    """
    Parse a resume file (PDF or DOCX), extract skills, and generate embedding.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    allowed_extensions = (".pdf", ".docx")
    if not file.filename.lower().endswith(allowed_extensions):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Use: {', '.join(allowed_extensions)}"
        )

    try:
        file_bytes = await file.read()
        # Extract text
        text = parse_resume(file_bytes, file.filename)
        if not text or not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from resume")

        # Extract skills
        categorized_skills = extract_skills(text)
        flat_skills = get_flat_skill_list(categorized_skills)

        # Generate embedding from the full resume text
        embedding = generate_embedding(text)

        return ResumeParseResponse(
            text=text,
            skills=categorized_skills,
            flat_skills=flat_skills,
            embedding=embedding
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")


@app.post("/extract-skills", response_model=SkillsResponse)
async def extract_skills_endpoint(input_data: TextInput):
    """Extract skills from raw text."""
    categorized = extract_skills(input_data.text)
    flat = get_flat_skill_list(categorized)
    return SkillsResponse(skills=categorized, flat_skills=flat)


@app.post("/generate-embedding", response_model=EmbeddingResponse)
async def generate_embedding_endpoint(input_data: EmbeddingRequest):
    """Generate a Sentence-BERT embedding for the given text."""
    embedding = generate_embedding(input_data.text)
    return EmbeddingResponse(embedding=embedding, dimensions=len(embedding))


@app.post("/recommend", response_model=RecommendResponse)
async def recommend_endpoint(request: RecommendRequest):
    """
    Compute job recommendations based on cosine similarity
    between user embedding and job embeddings.
    """
    jobs_data = [{"id": j.id, "embedding": j.embedding} for j in request.jobs]
    results = rank_jobs(request.user_embedding, jobs_data, request.top_n)
    return RecommendResponse(recommendations=results)


@app.post("/analyze-resume", response_model=ATSReportResponse)
async def analyze_resume_endpoint(file: UploadFile = File(...)):
    """
    Analyze a resume file for ATS compatibility and return a score with tips.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    allowed_extensions = (".pdf", ".docx")
    if not file.filename.lower().endswith(allowed_extensions):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Use: {', '.join(allowed_extensions)}"
        )

    try:
        file_bytes = await file.read()
        text = parse_resume(file_bytes, file.filename)
        if not text or not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from resume")

        report = analyze_resume(text)
        return ATSReportResponse(**report)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing resume: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
