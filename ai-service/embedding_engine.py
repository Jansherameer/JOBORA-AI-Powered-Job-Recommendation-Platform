"""
Embedding Engine Module
Generates semantic embeddings using Sentence-BERT and computes cosine similarity.
"""
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Tuple

# Global model instance (loaded once)
_model = None


def get_model() -> SentenceTransformer:
    """Load the Sentence-BERT model (singleton pattern)."""
    global _model
    if _model is None:
        print("Loading Sentence-BERT model (all-MiniLM-L6-v2)...")
        _model = SentenceTransformer("all-MiniLM-L6-v2")
        print("Model loaded successfully!")
    return _model


def generate_embedding(text: str) -> List[float]:
    """
    Generate a 384-dimensional embedding for the given text.
    """
    model = get_model()
    embedding = model.encode(text, convert_to_numpy=True)
    return embedding.tolist()


def compute_cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """
    Compute cosine similarity between two vectors.
    Returns a value between -1 and 1 (higher = more similar).
    """
    a = np.array(vec_a)
    b = np.array(vec_b)
    dot_product = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(dot_product / (norm_a * norm_b))


def rank_jobs(
    user_embedding: List[float],
    jobs: List[dict],
    top_n: int = 10
) -> List[dict]:
    """
    Rank jobs by cosine similarity to the user's embedding.
    
    Args:
        user_embedding: The user's skill/resume embedding (384-dim vector)
        jobs: List of job dicts, each with 'id' and 'embedding' keys
        top_n: Number of top results to return
    
    Returns:
        List of job dicts with added 'score' key, sorted by score descending
    """
    scored_jobs = []
    for job in jobs:
        job_embedding = job.get("embedding", [])
        if not job_embedding:
            continue
        score = compute_cosine_similarity(user_embedding, job_embedding)
        # Convert to percentage (0-100) and clamp
        match_percentage = max(0, min(100, round(score * 100, 1)))
        scored_jobs.append({
            "id": job["id"],
            "score": match_percentage
        })
    
    # Sort by score descending
    scored_jobs.sort(key=lambda x: x["score"], reverse=True)
    return scored_jobs[:top_n]
