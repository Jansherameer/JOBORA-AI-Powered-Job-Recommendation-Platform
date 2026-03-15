# Jobora — AI-Powered Job Finding Platform 🚀

**Stop Hunting. Start Matching.**

Jobora is a high-performance, open-source platform designed to eliminate the "time sink" of manual job searching. By using advanced AI-powered resume analysis and semantic matching, Jobora finds high-signal opportunities that actually matter to your career.

![Jobora Home Page](https://github.com/jansherameer/AI-Powered-Job-Recommendation-Platform/raw/main/client/public/screenshot.png)

## 🌟 Why Jobora?

- **Save Hundreds of Hours:** Transition from spending 25+ hours a week on job boards to just 5 minutes of reviewing high-quality matches.
- **Semantic Intelligence:** Our AI understands technical depth and career trajectory, not just keywords.
- **Real-time Synchronization:** Live RSS syncing ensures you never miss a fresh opportunity from global feeds like Jobicy.
- **Automated Expertise Extraction:** Upload your resume and let Jobora's AI automatically build your professional profile.

## 🛠️ Tech Stack

### Frontend (Premium UI/UX)
- **React (Vite), Tailwind CSS v4, Framer Motion, Lucide React, Shadcn UI.**
- Advanced glassmorphism and animated, high-performance components.

### Backend (Robust & Scalable)
- **Node.js, Express, Prisma (ORM for PostgreSQL).**
- Secure JWT Authentication, automated cron-job synchronizers.

### AI Service (Intelligent Matching)
- **Python, FastAPI, SBERT, spaCy.**
- Sophisticated skill extraction and vector-embedding comparison.

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/jansherameer/AI-Powered-Job-Recommendation-Platform.git
cd AI-Powered-Job-Recommendation-Platform
```

### 2. AI Service Setup
```bash
cd ai-service
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m spacy download en_core_web_sm
python main.py
```

### 3. Backend Setup
```bash
cd ../server
npm install
# The .env file is provided in the repository with default local settings.
# Create a .env.example if you need to share a template without actual values.
npx prisma db push
npm run seed
npm run dev
```

### 4. Frontend Launch
```bash
cd ../client
npm install
npm run dev
```

## 🎯 How to Use
1. **Sign Up:** Create an account as a Job Seeker or Admin.
2. **Setup Profile:** Upload your resume (PDF/DOCX) or enter your skills manually.
3. **Get Matches:** The dashboard will automatically suggest jobs that match your semantic profile.
4. **Admins:** Use the admin panel to manage jobs or trigger RSS feed synchronizations.

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

## 📄 License
Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

---
Built with ❤️ by [jansherameer](https://github.com/jansherameer).
