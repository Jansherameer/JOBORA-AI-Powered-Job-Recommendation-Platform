"""
Skill Extractor Module
Extracts technical and soft skills from resume text using keyword matching and spaCy NLP.
"""
import re
from typing import Dict, List

# Comprehensive skill dictionary organized by category
SKILL_DATABASE: Dict[str, List[str]] = {
    "programming_languages": [
        "python", "javascript", "typescript", "java", "c++", "c#", "ruby", "go",
        "golang", "rust", "swift", "kotlin", "php", "scala", "r", "matlab",
        "perl", "haskell", "lua", "dart", "objective-c", "shell", "bash",
        "powershell", "sql", "html", "css", "sass", "less", "graphql"
    ],
    "frameworks_libraries": [
        "react", "reactjs", "react.js", "angular", "angularjs", "vue", "vuejs",
        "vue.js", "next.js", "nextjs", "nuxt", "nuxtjs", "svelte", "express",
        "expressjs", "express.js", "django", "flask", "fastapi", "spring",
        "spring boot", "springboot", "rails", "ruby on rails", "laravel",
        "asp.net", ".net", "dotnet", "node.js", "nodejs", "node",
        "tensorflow", "pytorch", "keras", "scikit-learn", "sklearn",
        "pandas", "numpy", "scipy", "matplotlib", "seaborn", "plotly",
        "opencv", "nltk", "spacy", "hugging face", "transformers",
        "jquery", "bootstrap", "tailwind", "tailwindcss", "material-ui",
        "chakra ui", "ant design", "redux", "mobx", "zustand",
        "three.js", "d3.js", "socket.io", "electron", "react native",
        "flutter", "ionic", "xamarin", "unity", "unreal engine"
    ],
    "databases": [
        "postgresql", "postgres", "mysql", "mariadb", "sqlite", "oracle",
        "sql server", "mssql", "mongodb", "dynamodb", "cassandra",
        "couchdb", "redis", "elasticsearch", "neo4j", "firebase",
        "firestore", "supabase", "cockroachdb", "influxdb", "timescaledb"
    ],
    "cloud_devops": [
        "aws", "amazon web services", "azure", "microsoft azure",
        "google cloud", "gcp", "heroku", "vercel", "netlify",
        "digitalocean", "docker", "kubernetes", "k8s", "terraform",
        "ansible", "jenkins", "github actions", "gitlab ci", "circleci",
        "travis ci", "nginx", "apache", "linux", "ubuntu", "centos",
        "ci/cd", "ci cd", "devops", "microservices", "serverless",
        "lambda", "cloudformation", "prometheus", "grafana", "datadog",
        "new relic", "splunk", "vagrant", "puppet", "chef"
    ],
    "data_ml": [
        "machine learning", "deep learning", "artificial intelligence", "ai",
        "natural language processing", "nlp", "computer vision",
        "data science", "data analysis", "data engineering", "data mining",
        "big data", "etl", "data warehouse", "data lake", "data pipeline",
        "feature engineering", "model training", "model deployment",
        "mlops", "a/b testing", "statistical analysis", "statistics",
        "regression", "classification", "clustering", "neural network",
        "cnn", "rnn", "lstm", "transformer", "bert", "gpt",
        "reinforcement learning", "recommendation system", "time series",
        "anomaly detection", "sentiment analysis", "text mining",
        "spark", "hadoop", "hive", "kafka", "airflow", "dbt",
        "tableau", "power bi", "looker", "metabase", "superset"
    ],
    "tools_practices": [
        "git", "github", "gitlab", "bitbucket", "svn",
        "jira", "confluence", "trello", "asana", "notion",
        "figma", "sketch", "adobe xd", "photoshop", "illustrator",
        "postman", "swagger", "openapi", "rest api", "restful",
        "graphql", "grpc", "websocket", "oauth", "jwt",
        "agile", "scrum", "kanban", "waterfall", "sdlc",
        "tdd", "bdd", "unit testing", "integration testing",
        "end-to-end testing", "selenium", "cypress", "jest",
        "mocha", "pytest", "junit", "playwright",
        "webpack", "vite", "rollup", "babel", "eslint", "prettier"
    ],
    "soft_skills": [
        "leadership", "communication", "teamwork", "problem solving",
        "problem-solving", "critical thinking", "analytical",
        "project management", "time management", "mentoring",
        "collaboration", "presentation", "public speaking",
        "stakeholder management", "cross-functional", "strategic planning",
        "decision making", "conflict resolution", "adaptability",
        "creativity", "attention to detail", "innovation"
    ]
}

# Flatten all skills for quick lookup
ALL_SKILLS = {}
for category, skills in SKILL_DATABASE.items():
    for skill in skills:
        ALL_SKILLS[skill.lower()] = category


def extract_skills(text: str) -> Dict[str, List[str]]:
    """
    Extract skills from resume text using keyword matching.
    Returns skills organized by category.
    """
    text_lower = text.lower()
    # Normalize common separators
    text_normalized = re.sub(r'[/|,;•·]', ' ', text_lower)
    text_normalized = re.sub(r'\s+', ' ', text_normalized)

    found_skills: Dict[str, List[str]] = {}

    for category, skills in SKILL_DATABASE.items():
        category_matches = []
        for skill in skills:
            # Use word boundary matching for short skills to avoid false positives
            if len(skill) <= 2:
                pattern = r'\b' + re.escape(skill) + r'\b'
                if re.search(pattern, text_normalized):
                    category_matches.append(skill)
            else:
                if skill in text_normalized:
                    category_matches.append(skill)
        if category_matches:
            # Remove duplicates while preserving order
            found_skills[category] = list(dict.fromkeys(category_matches))

    return found_skills


def get_flat_skill_list(categorized_skills: Dict[str, List[str]]) -> List[str]:
    """Flatten categorized skills into a single unique list."""
    flat = []
    seen = set()
    for skills in categorized_skills.values():
        for skill in skills:
            if skill not in seen:
                flat.append(skill)
                seen.add(skill)
    return flat
