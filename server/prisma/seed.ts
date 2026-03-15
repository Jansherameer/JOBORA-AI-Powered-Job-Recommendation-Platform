import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

interface JobSeed {
  title: string;
  company: string;
  description: string;
  location: string;
  category: string;
  experienceLevel: string;
  requiredSkills: string[];
}

const jobSeeds: JobSeed[] = [
  {
    title: "Senior Full Stack Developer",
    company: "TechVault Inc.",
    description: "We're looking for a Senior Full Stack Developer to build scalable web applications using React, Node.js, and PostgreSQL. You'll architect microservices, lead code reviews, implement CI/CD pipelines, and mentor junior developers. Experience with cloud platforms (AWS/Azure) and containerization (Docker/Kubernetes) is essential.",
    location: "San Francisco, CA",
    category: "Software Engineering",
    experienceLevel: "Senior",
    requiredSkills: ["react", "node.js", "typescript", "postgresql", "docker", "kubernetes", "aws", "git", "ci/cd", "rest api"]
  },
  {
    title: "Machine Learning Engineer",
    company: "DataMind AI",
    description: "Join our AI team to develop and deploy production machine learning models. You'll work on NLP, computer vision, and recommendation systems using PyTorch and TensorFlow. Strong Python skills, experience with MLOps, and deep understanding of statistical methods required.",
    location: "New York, NY",
    category: "Data Science",
    experienceLevel: "Mid-Level",
    requiredSkills: ["python", "pytorch", "tensorflow", "machine learning", "deep learning", "nlp", "computer vision", "docker", "sql", "git"]
  },
  {
    title: "Frontend Developer (React)",
    company: "PixelForge Studio",
    description: "Create beautiful, performant user interfaces for our SaaS platform. You'll work with React, TypeScript, and Tailwind CSS to build responsive, accessible components. Knowledge of state management (Redux/Zustand), testing (Jest/Cypress), and design systems is a plus.",
    location: "Remote",
    category: "Software Engineering",
    experienceLevel: "Mid-Level",
    requiredSkills: ["react", "typescript", "javascript", "tailwindcss", "css", "html", "redux", "jest", "git", "figma"]
  },
  {
    title: "DevOps Engineer",
    company: "CloudScale Systems",
    description: "Design and maintain cloud infrastructure on AWS. You'll implement Infrastructure as Code with Terraform, manage Kubernetes clusters, build CI/CD pipelines with GitHub Actions, and ensure 99.99% uptime. Strong Linux administration and networking skills required.",
    location: "Seattle, WA",
    category: "DevOps",
    experienceLevel: "Senior",
    requiredSkills: ["aws", "terraform", "kubernetes", "docker", "linux", "github actions", "ci/cd", "nginx", "prometheus", "python"]
  },
  {
    title: "Data Analyst",
    company: "InsightFlow Analytics",
    description: "Transform raw data into actionable business insights. You'll write complex SQL queries, build dashboards in Tableau/Power BI, perform statistical analysis, and present findings to stakeholders. Strong communication skills and business acumen are essential.",
    location: "Chicago, IL",
    category: "Data Science",
    experienceLevel: "Entry-Level",
    requiredSkills: ["sql", "python", "tableau", "power bi", "statistical analysis", "data analysis", "excel", "communication", "presentation"]
  },
  {
    title: "Backend Engineer (Python)",
    company: "APIForge Labs",
    description: "Build robust backend services using Python, FastAPI/Django, and PostgreSQL. You'll design RESTful APIs, implement authentication systems, optimize database queries, and write comprehensive tests. Experience with Redis, message queues, and microservices architecture preferred.",
    location: "Austin, TX",
    category: "Software Engineering",
    experienceLevel: "Mid-Level",
    requiredSkills: ["python", "django", "fastapi", "postgresql", "redis", "rest api", "docker", "git", "sql", "unit testing"]
  },
  {
    title: "UX/UI Designer",
    company: "DesignCraft Co.",
    description: "Create user-centered designs for web and mobile applications. You'll conduct user research, create wireframes and prototypes in Figma, collaborate with developers, and maintain our design system. Strong portfolio demonstrating problem-solving through design is required.",
    location: "Los Angeles, CA",
    category: "Design",
    experienceLevel: "Mid-Level",
    requiredSkills: ["figma", "adobe xd", "photoshop", "illustrator", "css", "html", "communication", "presentation", "creativity"]
  },
  {
    title: "Mobile Developer (React Native)",
    company: "AppVenture Mobile",
    description: "Build cross-platform mobile applications using React Native and TypeScript. You'll implement complex UI animations, integrate with REST APIs, manage app state with Redux, and publish to App Store and Google Play. Experience with native modules is a plus.",
    location: "Denver, CO",
    category: "Software Engineering",
    experienceLevel: "Mid-Level",
    requiredSkills: ["react native", "typescript", "javascript", "react", "redux", "rest api", "git", "ios", "android"]
  },
  {
    title: "Data Engineer",
    company: "PipelineHQ",
    description: "Design and build scalable data pipelines using Spark, Airflow, and cloud data warehouses. You'll process terabytes of data, implement ETL workflows, optimize query performance, and ensure data quality. Experience with Kafka, dbt, and data modeling is essential.",
    location: "Remote",
    category: "Data Science",
    experienceLevel: "Senior",
    requiredSkills: ["python", "spark", "airflow", "sql", "kafka", "dbt", "aws", "docker", "data pipeline", "etl"]
  },
  {
    title: "Cybersecurity Analyst",
    company: "SecureNet Defense",
    description: "Protect our organization's digital assets by monitoring security systems, conducting vulnerability assessments, and responding to incidents. You'll implement security policies, perform penetration testing, and ensure compliance with industry standards (SOC 2, ISO 27001).",
    location: "Washington, DC",
    category: "Security",
    experienceLevel: "Mid-Level",
    requiredSkills: ["linux", "python", "networking", "sql", "git", "analytical", "problem solving", "communication"]
  },
  {
    title: "Product Manager",
    company: "LaunchPad Products",
    description: "Drive product strategy and roadmap for our B2B SaaS platform. You'll conduct market research, define user stories, prioritize features, and work closely with engineering and design teams. Strong analytical skills and experience with agile methodologies required.",
    location: "Boston, MA",
    category: "Product Management",
    experienceLevel: "Senior",
    requiredSkills: ["agile", "scrum", "jira", "communication", "leadership", "analytical", "strategic planning", "stakeholder management", "presentation"]
  },
  {
    title: "Junior Web Developer",
    company: "WebStart Academy",
    description: "Join our team as a junior developer and grow your skills. You'll work on front-end and back-end tasks using HTML, CSS, JavaScript, and Node.js. We provide mentorship and a structured learning environment. Perfect for recent bootcamp or CS graduates.",
    location: "Remote",
    category: "Software Engineering",
    experienceLevel: "Entry-Level",
    requiredSkills: ["html", "css", "javascript", "node.js", "git", "sql", "react", "rest api"]
  },
  {
    title: "Cloud Solutions Architect",
    company: "NimbusTech Solutions",
    description: "Design enterprise cloud architectures on AWS and Azure. You'll evaluate technical requirements, create architecture diagrams, lead migration projects, and optimize cloud spending. AWS Solutions Architect certification and hands-on experience with serverless preferred.",
    location: "San Jose, CA",
    category: "DevOps",
    experienceLevel: "Senior",
    requiredSkills: ["aws", "azure", "terraform", "kubernetes", "docker", "serverless", "lambda", "microservices", "linux", "leadership"]
  },
  {
    title: "AI/NLP Researcher",
    company: "LingualAI Labs",
    description: "Push the boundaries of Natural Language Processing. You'll research and implement transformer-based models, develop novel approaches to text understanding, and publish papers. Deep knowledge of attention mechanisms, BERT/GPT architectures, and PyTorch required.",
    location: "Cambridge, MA",
    category: "Data Science",
    experienceLevel: "Senior",
    requiredSkills: ["python", "pytorch", "nlp", "transformers", "bert", "deep learning", "machine learning", "neural network", "numpy", "hugging face"]
  },
  {
    title: "QA Automation Engineer",
    company: "QualityFirst Tech",
    description: "Build and maintain automated testing frameworks for web and mobile applications. You'll write end-to-end tests with Cypress/Playwright, API tests, and performance tests. Experience with CI/CD integration, BDD methodology, and strong debugging skills required.",
    location: "Portland, OR",
    category: "Software Engineering",
    experienceLevel: "Mid-Level",
    requiredSkills: ["cypress", "playwright", "javascript", "typescript", "selenium", "jest", "git", "ci/cd", "agile", "tdd"]
  },
  {
    title: "Database Administrator",
    company: "DataVault Solutions",
    description: "Manage and optimize PostgreSQL and MySQL databases for high-traffic applications. You'll handle replication, backups, performance tuning, query optimization, and disaster recovery. Experience with cloud databases (RDS, Cloud SQL) and monitoring tools preferred.",
    location: "Dallas, TX",
    category: "DevOps",
    experienceLevel: "Mid-Level",
    requiredSkills: ["postgresql", "mysql", "sql", "linux", "aws", "docker", "python", "monitoring", "analytical", "problem solving"]
  },
  {
    title: "Blockchain Developer",
    company: "ChainForge Labs",
    description: "Develop smart contracts and decentralized applications on Ethereum and Solana. You'll write Solidity contracts, build Web3 frontends with React, implement token standards, and audit contract security. Strong understanding of DeFi protocols required.",
    location: "Miami, FL",
    category: "Software Engineering",
    experienceLevel: "Mid-Level",
    requiredSkills: ["javascript", "typescript", "react", "node.js", "python", "git", "sql", "rest api"]
  },
  {
    title: "Technical Writer",
    company: "DocuPro Solutions",
    description: "Create clear, comprehensive technical documentation for our developer platform. You'll write API docs, tutorials, getting-started guides, and architecture overviews. Strong understanding of software development concepts and excellent writing skills required.",
    location: "Remote",
    category: "Product Management",
    experienceLevel: "Mid-Level",
    requiredSkills: ["html", "css", "git", "communication", "attention to detail", "markdown", "rest api"]
  },
  {
    title: "Embedded Systems Engineer",
    company: "IoTech Devices",
    description: "Design firmware and embedded software for IoT devices. You'll program in C/C++ for microcontrollers, implement communication protocols (MQTT, BLE), and optimize for power consumption. Experience with RTOS, hardware debugging, and PCB design is a plus.",
    location: "Austin, TX",
    category: "Software Engineering",
    experienceLevel: "Senior",
    requiredSkills: ["c++", "python", "linux", "git", "problem solving", "analytical", "communication"]
  },
  {
    title: "Site Reliability Engineer",
    company: "UptimeMax Inc.",
    description: "Ensure reliability and performance of our distributed systems. You'll build monitoring solutions with Prometheus/Grafana, implement auto-scaling policies, conduct incident post-mortems, and optimize system performance. Strong Linux and scripting skills essential.",
    location: "San Francisco, CA",
    category: "DevOps",
    experienceLevel: "Senior",
    requiredSkills: ["linux", "kubernetes", "docker", "prometheus", "grafana", "aws", "python", "terraform", "ci/cd", "git"]
  },
  {
    title: "Business Intelligence Analyst",
    company: "DataDriven Corp",
    description: "Translate business needs into data solutions. You'll build interactive dashboards, develop KPI frameworks, perform ad-hoc analysis, and automate reporting workflows. Proficiency in SQL, Tableau/Looker, and understanding of data warehousing concepts required.",
    location: "Minneapolis, MN",
    category: "Data Science",
    experienceLevel: "Entry-Level",
    requiredSkills: ["sql", "tableau", "power bi", "data analysis", "statistical analysis", "communication", "presentation", "analytical"]
  },
  {
    title: "Game Developer (Unity)",
    company: "PixelDream Games",
    description: "Create immersive gaming experiences using Unity and C#. You'll implement game mechanics, physics systems, AI behaviors, and multiplayer networking. Experience with shader programming, animation systems, and mobile game optimization is a plus.",
    location: "Los Angeles, CA",
    category: "Software Engineering",
    experienceLevel: "Mid-Level",
    requiredSkills: ["c#", "unity", "git", "javascript", "problem solving", "creativity", "teamwork"]
  },
  {
    title: "API Integration Specialist",
    company: "ConnectHub Technologies",
    description: "Design and implement API integrations for enterprise clients. You'll work with REST and GraphQL APIs, build middleware solutions, handle authentication flows (OAuth, JWT), and ensure data consistency across systems. Node.js and Python expertise required.",
    location: "Remote",
    category: "Software Engineering",
    experienceLevel: "Mid-Level",
    requiredSkills: ["node.js", "python", "rest api", "graphql", "javascript", "typescript", "jwt", "oauth", "git", "sql"]
  },
  {
    title: "Computer Vision Engineer",
    company: "VisionAI Systems",
    description: "Develop production-grade computer vision models for autonomous systems. You'll work with CNNs, object detection (YOLO, Faster R-CNN), image segmentation, and real-time video processing. Experience with OpenCV, TensorFlow/PyTorch, and edge deployment required.",
    location: "Pittsburgh, PA",
    category: "Data Science",
    experienceLevel: "Senior",
    requiredSkills: ["python", "pytorch", "tensorflow", "opencv", "computer vision", "deep learning", "machine learning", "docker", "linux", "numpy"]
  },
  {
    title: "Scrum Master",
    company: "AgilePro Consulting",
    description: "Facilitate agile ceremonies, remove team impediments, and coach product teams on Scrum best practices. You'll manage sprint planning, retrospectives, and stakeholder communications. Certified Scrum Master preferred with 3+ years experience.",
    location: "Charlotte, NC",
    category: "Product Management",
    experienceLevel: "Mid-Level",
    requiredSkills: ["agile", "scrum", "jira", "confluence", "leadership", "communication", "teamwork", "problem solving", "stakeholder management"]
  }
];

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/generate-embedding`, { text });
    return response.data.embedding;
  } catch (error) {
    console.warn('Could not generate embedding via AI service. Using empty array.');
    return [];
  }
}

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  await prisma.recommendation.deleteMany();
  await prisma.job.deleteMany();
  console.log('✅ Cleared existing jobs and recommendations.\n');

  // Seed jobs
  let seeded = 0;
  for (const jobData of jobSeeds) {
    const skillsText = jobData.requiredSkills.join(', ');
    const textForEmbedding = `${jobData.title}. ${jobData.description}. Required skills: ${skillsText}`;

    console.log(`  📌 Seeding: ${jobData.title} at ${jobData.company}...`);
    const embedding = await generateEmbedding(textForEmbedding);

    await prisma.job.create({
      data: {
        ...jobData,
        embedding
      }
    });
    seeded++;
  }

  console.log(`\n✅ Seeded ${seeded} jobs.`);

  // Create admin user if not exists
  const bcrypt = await import('bcryptjs');
  const adminEmail = 'admin@jobplatform.com';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: adminEmail,
        hashedPassword,
        role: 'admin',
        skills: []
      }
    });
    console.log(`✅ Created admin user: ${adminEmail} / admin123`);
  } else {
    console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
  }

  console.log('\n🎉 Seed completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
