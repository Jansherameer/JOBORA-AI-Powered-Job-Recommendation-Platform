<p align="center">
  <img src="https://img.shields.io/badge/Jobora-AI%20Job%20Matching-409ae1?style=for-the-badge&logo=sparkles&logoColor=white" alt="Jobora" />
</p>

<h1 align="center">Jobora — AI-Powered Job Recommendation Platform</h1>

<p align="center">
  <strong>Stop Hunting. Start Matching.</strong><br/>
  Intelligent resume analysis · Semantic job matching · ATS scoring — all in one platform.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4-06b6d4?style=flat-square&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-5-2d3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169e1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3.13-3776ab?style=flat-square&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

<p align="center">
  <img src="./client/public/screenshots/homepage-hero.png" alt="Jobora Platform" width="100%" />
</p>

---

## ✨ What Makes Jobora Different?

| Feature | Description |
|---------|-------------|
| 🧠 **Semantic Matching** | SBERT embeddings + cosine similarity — not just keyword matching |
| 📄 **Resume → Skills** | Upload PDF/DOCX, AI extracts skills across 7 categories automatically |
| 📊 **ATS Score** | Instant resume scoring (0-100) with breakdown, tips & strengths |
| 🔄 **Live RSS Sync** | Auto-imports jobs from external feeds via scheduled cron jobs |
| 🎯 **Match Confidence** | Each job shows a % match score with skill overlap visualization |
| 🏷️ **Modern UI** | Label-tag design system, Framer Motion animations, Open Sans typography |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React + Vite)                   │
│  ┌──────────┐ ┌───────────┐ ┌─────────┐ ┌──────────┐ ┌──────┐ │
│  │  Home    │ │ Dashboard │ │ Profile │ │  Admin   │ │ Auth │ │
│  │(Landing) │ │ (Matches) │ │(Resume) │ │(Manage) │ │      │ │
│  └──────────┘ └───────────┘ └─────────┘ └──────────┘ └──────┘ │
│  Tailwind v4 · Framer Motion · Shadcn UI · Lucide Icons        │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API (JWT Auth)
┌────────────────────────────┴────────────────────────────────────┐
│                     SERVER (Node.js + Express 5)                │
│  ┌──────────┐ ┌───────────┐ ┌─────────────┐ ┌──────────────┐  │
│  │ Auth     │ │ Profile   │ │ Jobs + RSS  │ │ Recommend    │  │
│  │ Routes   │ │ + Upload  │ │ Sync Engine │ │ Engine       │  │
│  └──────────┘ └───────────┘ └─────────────┘ └──────────────┘  │
│  Prisma ORM · Multer · node-cron · bcrypt · JWT                │
└─────────┬───────────────────────────────────┬──────────────────┘
          │                                   │
┌─────────┴─────────┐             ┌───────────┴──────────────────┐
│   PostgreSQL      │             │    AI SERVICE (FastAPI)       │
│   ┌─────────────┐ │             │  ┌────────────────────────┐  │
│   │ Users       │ │             │  │ Resume Parser (PDF/    │  │
│   │ Jobs        │ │  HTTP/REST  │  │ DOCX → Text)           │  │
│   │ Recommen-   │ │◄───────────►│  │ Skill Extractor (7     │  │
│   │ dations     │ │             │  │ categories, 200+ tags) │  │
│   └─────────────┘ │             │  │ Embedding Engine       │  │
│                    │             │  │ (SBERT → 384-dim)      │  │
│                    │             │  │ ATS Analyzer (5-dim    │  │
│                    │             │  │ scoring + tips)        │  │
│                    │             │  └────────────────────────┘  │
└────────────────────┘             └──────────────────────────────┘
```

---

## 📸 Screenshots

### 🏠 Homepage — Hero & Company Ticker
![Homepage Hero](./client/public/screenshots/homepage-hero.png)

### 🏠 Homepage — How It Works & Features
![Homepage Features](./client/public/screenshots/homepage-features.png)

### 📊 Dashboard — AI-Powered Job Recommendations
![Dashboard Main](./client/public/screenshots/dashboard-main.png)

### 📊 Dashboard — Job Cards with Match Scores
![Dashboard Jobs](./client/public/screenshots/dashboard-jobs.png)

### 📄 Profile — Resume Upload & Skill Management
![Profile Page](./client/public/screenshots/profile.png)

### 🔐 Login — Clean Auth with Label-Tag Design
![Login Page](./client/public/screenshots/login.png)

### 📝 Signup — Modern Registration
![Signup Page](./client/public/screenshots/signup.png)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.11
- **PostgreSQL** ≥ 14
- **Git**

### 1. Clone & Setup

```bash
git clone https://github.com/jansherameer/AI-Powered-Job-Recommendation-Platform.git
cd AI-Powered-Job-Recommendation-Platform
```

### 2. AI Service (Port 8000)

```bash
cd ai-service
python -m venv venv

# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m spacy download en_core_web_sm
python main.py
```

### 3. Backend Server (Port 5000)

```bash
cd ../server
npm install
```

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/jobora"
JWT_SECRET="your-secret-key-here"
AI_SERVICE_URL="http://localhost:8000"
PORT=5000
```

Then initialize the database:

```bash
npx prisma db push
npm run seed          # Seeds sample jobs
npm start             # or: npm run dev (with hot-reload)
```

### 4. Frontend Client (Port 5173)

```bash
cd ../client
npm install
npm run dev
```

Visit **http://localhost:5173** — you're live! 🎉

---

## 🧠 AI Pipeline — How It Works

```
Resume Upload (PDF/DOCX)
        │
        ▼
┌─────────────────┐
│  Text Extraction │ ← pdfplumber / python-docx
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌──────────┐
│ Skill  │ │   ATS    │
│Extract │ │ Analyze  │
│(7 cats)│ │(5 dims)  │
└───┬────┘ └────┬─────┘
    │           │
    ▼           ▼
┌────────┐  ┌──────────────────┐
│ SBERT  │  │ Score (0-100)    │
│Embeddin│  │ + Grade (A+ → F) │
│(384-d) │  │ + Tips           │
└───┬────┘  │ + Strengths      │
    │       └──────────────────┘
    ▼
┌─────────────────────────────┐
│ Cosine Similarity Ranking   │
│ User Embedding ↔ Job Pool   │
│ → Top N Matched Jobs        │
└─────────────────────────────┘
```

### ATS Scoring Breakdown

| Dimension | Max Points | Measures |
|-----------|-----------|----------|
| Skill Density | 30 | Number & diversity of recognized skills |
| Section Coverage | 25 | Contact, Summary, Experience, Education, Skills, Projects |
| Action Verbs | 15 | 70+ tracked verbs (Developed, Led, Optimized...) |
| Formatting | 15 | Word count, readability, contact info presence |
| Quantifiable Impact | 15 | Metrics, percentages, dollar amounts |

---

## 📁 Project Structure

```
AI-Powered-Job-Recommendation-Platform/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI (JobCard, FileUpload, MatchCircle)
│   │   ├── context/            # Auth context
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # API client
│   │   └── pages/              # Home, Dashboard, Profile, Login, Signup, Admin
│   ├── index.html
│   └── package.json
│
├── server/                     # Node.js Backend
│   ├── src/
│   │   ├── routes/             # auth, profile, jobs, recommend
│   │   ├── middleware/         # JWT auth middleware
│   │   ├── services/           # RSS sync, cron jobs
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Sample data seeder
│   └── package.json
│
├── ai-service/                 # Python AI Microservice
│   ├── main.py                 # FastAPI app (5 endpoints)
│   ├── resume_parser.py        # PDF/DOCX text extraction
│   ├── skill_extractor.py      # 200+ skills across 7 categories
│   ├── embedding_engine.py     # SBERT embeddings + cosine ranking
│   ├── resume_analyzer.py      # ATS scoring engine
│   └── requirements.txt
│
└── README.md
```

---

## 🔌 API Endpoints

### Server (Express)

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `POST` | `/api/auth/signup` | Register new user | ✗ |
| `POST` | `/api/auth/login` | Login & get JWT | ✗ |
| `GET` | `/api/profile` | Get user profile | ✓ |
| `PUT` | `/api/profile` | Update profile + re-embed | ✓ |
| `POST` | `/api/profile/upload-resume` | Upload resume → parse + ATS score | ✓ |
| `GET` | `/api/jobs` | List jobs (paginated, filtered) | ✓ |
| `GET` | `/api/jobs/filters` | Get filter options | ✓ |
| `POST` | `/api/jobs/admin` | Create job (admin) | ✓ |
| `DELETE` | `/api/jobs/admin/:id` | Delete job (admin) | ✓ |
| `GET` | `/api/recommend` | Get AI recommendations | ✓ |

### AI Service (FastAPI)

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/health` | Service health check |
| `POST` | `/parse-resume` | Extract text + skills + embedding from resume |
| `POST` | `/extract-skills` | Extract skills from raw text |
| `POST` | `/generate-embedding` | Generate SBERT embedding |
| `POST` | `/recommend` | Rank jobs by cosine similarity |
| `POST` | `/analyze-resume` | ATS compatibility score + tips |

---

## 🛠️ Tech Stack — Full Breakdown

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| Vite | 8 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first styling |
| Framer Motion | 12 | Animations |
| Shadcn UI | latest | Accessible component primitives |
| Lucide React | latest | Icon library |
| React Router | 7 | Client-side routing |
| Axios | 1.13 | HTTP client |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 5 | HTTP framework |
| Prisma | 5 | Database ORM |
| PostgreSQL | 14+ | Relational database |
| JWT | 9 | Authentication |
| Multer | 2 | File uploads |
| node-cron | 4 | Scheduled RSS sync |

### AI Service
| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.13 | Runtime |
| FastAPI | 0.115 | API framework |
| Sentence-Transformers | 3.4 | SBERT embeddings (384-dim) |
| spaCy | 3.8 | NLP pipeline |
| scikit-learn | 1.5+ | Cosine similarity |
| pdfplumber | 0.11 | PDF text extraction |
| python-docx | 1.1 | DOCX text extraction |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repo
2. **Create** your branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](./LICENSE) for details.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/jansherameer">jansherameer</a>
  <br/>
  <sub>If this project helped you, consider giving it a ⭐</sub>
</p>
