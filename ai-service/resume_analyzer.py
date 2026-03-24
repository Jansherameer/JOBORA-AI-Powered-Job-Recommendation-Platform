"""
ATS Resume Analyzer Module
Computes an ATS (Applicant Tracking System) compatibility score with actionable improvement tips.
"""
import re
from typing import Dict, List, Any

from skill_extractor import extract_skills, get_flat_skill_list

# ──── Scoring Constants ────

# Key resume sections an ATS looks for
ATS_SECTIONS = {
    "contact": [
        r"\b(email|e-mail|phone|tel|mobile|linkedin|github|portfolio|website|address)\b"
    ],
    "summary": [
        r"\b(summary|objective|profile|about\s+me|professional\s+summary|career\s+objective)\b"
    ],
    "experience": [
        r"\b(experience|work\s+history|employment|professional\s+experience|work\s+experience)\b"
    ],
    "education": [
        r"\b(education|academic|degree|university|college|school|bachelor|master|phd|diploma|certification)\b"
    ],
    "skills": [
        r"\b(skills|technical\s+skills|competencies|technologies|tools|proficiencies|expertise)\b"
    ],
    "projects": [
        r"\b(projects|portfolio|personal\s+projects|key\s+projects|side\s+projects)\b"
    ],
}

# Strong action verbs that ATS systems favor
ACTION_VERBS = [
    "achieved", "administered", "analyzed", "architected", "automated",
    "built", "collaborated", "configured", "coordinated", "created",
    "debugged", "delivered", "deployed", "designed", "developed",
    "drove", "engineered", "enhanced", "established", "executed",
    "facilitated", "implemented", "improved", "increased", "integrated",
    "launched", "led", "maintained", "managed", "mentored",
    "migrated", "monitored", "negotiated", "optimized", "orchestrated",
    "organized", "participated", "performed", "pioneered", "planned",
    "presented", "produced", "programmed", "proposed", "published",
    "reduced", "refactored", "resolved", "restructured", "reviewed",
    "scaled", "secured", "simplified", "spearheaded", "streamlined",
    "supervised", "tested", "trained", "transformed", "troubleshot",
    "upgraded", "utilized", "validated", "wrote",
]

# Categories of quantifiable metrics
METRICS_PATTERNS = [
    r"\d+\s*%",            # Percentages (e.g., "improved by 30%")
    r"\$[\d,]+",           # Dollar amounts
    r"\d+\s*\+?\s*(users|customers|clients|projects|applications|services|teams|members)",
    r"(increased|reduced|improved|saved|grew|cut)\s.*?\d+",
]


def analyze_resume(text: str) -> Dict[str, Any]:
    """
    Analyze resume text and compute an ATS compatibility score.
    
    Returns dict with:
      - score: int (0-100)
      - grade: str (A+, A, B+, B, C, D, F)
      - breakdown: dict of category scores
      - tips: list of improvement suggestions
      - strengths: list of things done well
    """
    text_lower = text.lower()
    words = text.split()
    word_count = len(words)
    lines = text.strip().split('\n')
    line_count = len(lines)

    # ──── 1. SKILL DENSITY SCORE (max 30) ────
    categorized_skills = extract_skills(text)
    flat_skills = get_flat_skill_list(categorized_skills)
    skill_count = len(flat_skills)
    category_count = len(categorized_skills)

    # Score: 0-5 skills = low, 6-10 = medium, 11-15 = good, 16+ = excellent
    if skill_count >= 16:
        skill_score = 30
    elif skill_count >= 11:
        skill_score = 25
    elif skill_count >= 6:
        skill_score = 18
    elif skill_count >= 3:
        skill_score = 12
    else:
        skill_score = 5

    # Bonus for diversity (multiple categories)
    if category_count >= 4:
        skill_score = min(30, skill_score + 3)

    # ──── 2. SECTION COVERAGE SCORE (max 25) ────
    sections_found = {}
    for section_name, patterns in ATS_SECTIONS.items():
        found = False
        for pattern in patterns:
            if re.search(pattern, text_lower):
                found = True
                break
        sections_found[section_name] = found

    sections_present = sum(1 for v in sections_found.values() if v)
    total_sections = len(ATS_SECTIONS)
    section_score = round((sections_present / total_sections) * 25)

    # ──── 3. ACTION VERBS SCORE (max 15) ────
    verbs_found = []
    for verb in ACTION_VERBS:
        pattern = r'\b' + re.escape(verb) + r'(d|ed|ing|s)?\b'
        if re.search(pattern, text_lower):
            verbs_found.append(verb)

    verb_count = len(verbs_found)
    if verb_count >= 12:
        verb_score = 15
    elif verb_count >= 8:
        verb_score = 12
    elif verb_count >= 5:
        verb_score = 9
    elif verb_count >= 2:
        verb_score = 5
    else:
        verb_score = 2

    # ──── 4. FORMATTING SCORE (max 15) ────
    formatting_score = 0

    # Good word count (300-1200 words is ideal for 1-2 page resume)
    if 300 <= word_count <= 1200:
        formatting_score += 5
    elif 200 <= word_count <= 1500:
        formatting_score += 3
    elif word_count < 100:
        formatting_score += 0
    else:
        formatting_score += 1

    # Reasonable line density
    if line_count >= 20:
        formatting_score += 3
    elif line_count >= 10:
        formatting_score += 2

    # Not too many special characters (ATS parsers struggle with them)
    special_chars = len(re.findall(r'[^\w\s.,;:\'\"()\-/&@#]', text))
    special_ratio = special_chars / max(word_count, 1)
    if special_ratio < 0.05:
        formatting_score += 4
    elif special_ratio < 0.1:
        formatting_score += 2

    # Has email or phone (parseable contact)
    has_email = bool(re.search(r'[\w.+-]+@[\w-]+\.[\w.-]+', text))
    has_phone = bool(re.search(r'[\+]?[\d\s\-().]{7,15}', text))
    if has_email or has_phone:
        formatting_score += 3

    formatting_score = min(15, formatting_score)

    # ──── 5. KEYWORD OPTIMIZATION SCORE (max 15) ────
    # Measures quantifiable achievements and metrics
    metrics_found = 0
    for pattern in METRICS_PATTERNS:
        matches = re.findall(pattern, text_lower)
        metrics_found += len(matches)

    if metrics_found >= 5:
        keyword_score = 15
    elif metrics_found >= 3:
        keyword_score = 12
    elif metrics_found >= 1:
        keyword_score = 8
    else:
        keyword_score = 3

    # ──── TOTAL SCORE ────
    total_score = min(100, skill_score + section_score + verb_score + formatting_score + keyword_score)

    # ──── GRADE ────
    if total_score >= 90:
        grade = "A+"
    elif total_score >= 80:
        grade = "A"
    elif total_score >= 70:
        grade = "B+"
    elif total_score >= 60:
        grade = "B"
    elif total_score >= 50:
        grade = "C"
    elif total_score >= 35:
        grade = "D"
    else:
        grade = "F"

    # ──── GENERATE TIPS ────
    tips = []

    if not sections_found.get("summary"):
        tips.append({
            "category": "section",
            "priority": "high",
            "tip": "Add a Professional Summary section at the top — ATS systems use this to quickly categorize your profile."
        })

    if not sections_found.get("skills"):
        tips.append({
            "category": "section",
            "priority": "high",
            "tip": "Include a dedicated 'Skills' section with your technical and soft skills listed clearly."
        })

    if not sections_found.get("projects"):
        tips.append({
            "category": "section",
            "priority": "medium",
            "tip": "Add a 'Projects' section to showcase hands-on work — this differentiates you from other candidates."
        })

    if not sections_found.get("education"):
        tips.append({
            "category": "section",
            "priority": "medium",
            "tip": "Include an Education section with your degree, institution, and graduation year."
        })

    if skill_count < 6:
        tips.append({
            "category": "skills",
            "priority": "high",
            "tip": f"Only {skill_count} technical skills detected. Most competitive resumes list 10-20 relevant skills. Add more specific technologies."
        })

    if category_count < 3:
        tips.append({
            "category": "skills",
            "priority": "medium",
            "tip": "Your skills lack diversity. Consider adding skills from different areas (e.g., cloud, databases, tools) to show breadth."
        })

    if verb_count < 5:
        tips.append({
            "category": "language",
            "priority": "high",
            "tip": "Use more action verbs like 'Developed', 'Implemented', 'Led', 'Optimized', 'Architected' to describe your achievements."
        })

    if metrics_found < 2:
        tips.append({
            "category": "impact",
            "priority": "high",
            "tip": "Add quantifiable metrics — e.g., 'Reduced load time by 40%', 'Managed team of 8', 'Processed 1M+ records daily'."
        })

    if word_count < 200:
        tips.append({
            "category": "content",
            "priority": "high",
            "tip": "Your resume seems too short. Aim for 300-800 words. Add more detail to your experience and projects."
        })
    elif word_count > 1500:
        tips.append({
            "category": "content",
            "priority": "medium",
            "tip": "Your resume may be too long. Keep it concise — 1-2 pages max. Focus on the most relevant and recent experience."
        })

    if not has_email:
        tips.append({
            "category": "contact",
            "priority": "high",
            "tip": "No email address detected. Make sure your contact information is clearly visible and in plain text."
        })

    if special_ratio >= 0.1:
        tips.append({
            "category": "formatting",
            "priority": "medium",
            "tip": "Too many special characters detected. ATS parsers may fail on fancy formatting. Use simple bullet points and standard characters."
        })

    # ──── GENERATE STRENGTHS ────
    strengths = []

    if skill_count >= 10:
        strengths.append(f"Strong technical profile — {skill_count} relevant skills detected across {category_count} categories.")
    elif skill_count >= 6:
        strengths.append(f"Good skill coverage with {skill_count} recognized technical skills.")

    if verb_count >= 8:
        strengths.append(f"Excellent use of {verb_count} action verbs — your experience descriptions are impactful.")
    elif verb_count >= 5:
        strengths.append(f"Good use of {verb_count} action verbs to describe achievements.")

    if sections_present >= 5:
        strengths.append("Resume has comprehensive section coverage — ATS systems will parse this well.")
    elif sections_present >= 4:
        strengths.append("Good section structure with key resume sections present.")

    if metrics_found >= 3:
        strengths.append(f"Great job quantifying impact — {metrics_found} measurable achievements found.")

    if 300 <= word_count <= 1200:
        strengths.append("Resume length is ideal for ATS processing and recruiter scanning.")

    if has_email and has_phone:
        strengths.append("Contact information is clearly present and machine-readable.")
    
    # Ensure at least one strength
    if not strengths:
        strengths.append("Your resume has been submitted — follow the tips below to improve your ATS score.")

    return {
        "score": total_score,
        "grade": grade,
        "breakdown": {
            "skillDensity": {"score": skill_score, "max": 30, "label": "Skill Density"},
            "sectionCoverage": {"score": section_score, "max": 25, "label": "Section Coverage"},
            "actionVerbs": {"score": verb_score, "max": 15, "label": "Action Verbs"},
            "formatting": {"score": formatting_score, "max": 15, "label": "Formatting"},
            "keywordOptimization": {"score": keyword_score, "max": 15, "label": "Quantifiable Impact"},
        },
        "tips": tips,
        "strengths": strengths,
        "stats": {
            "wordCount": word_count,
            "skillCount": skill_count,
            "categoryCount": category_count,
            "actionVerbCount": verb_count,
            "metricsCount": metrics_found,
            "sectionsFound": sections_present,
            "sectionsTotal": total_sections,
        }
    }
