/*
 * BASE DE VIDEOS (YouTube)
 * Todos os itens abaixo sao embeds/links do YouTube, validados via oEmbed antes de serem
 * adicionados (nenhum video e hospedado ou baixado). Prioriza canais oficiais da AWS
 * (AWS Events, Amazon Web Services, AWS Developers LATAM) e criadores publicos reconhecidos
 * (freeCodeCamp, Stephane Maarek, etc.), com uma parcela de conteudo em PT-BR.
 */
window.AWSPREP = window.AWSPREP || {};
AWSPREP.add("videos", [

  /* ===================== CLOUD PRACTITIONER (CLF) ===================== */
  { id: "yt-7HKot-brXFE", yt: "7HKot-brXFE", title: "AWS Certified Cloud Practitioner Certification Course 2026 (CLF-C02) - Pass the Exam!",
    ch: "freeCodeCamp.org", lang: "en", dur: 840, kind: "course", lvl: 1, y: 2026,
    dom: { clf: [1, 2, 3, 4] }, svc: ["ec2", "s3", "rds", "lambda", "vpc", "iam"], top: ["cloud-concepts", "shared-responsibility", "pricing-models", "billing"] },

  { id: "yt-NhDYbskXRgc", yt: "NhDYbskXRgc", title: "AWS Certified Cloud Practitioner Certification Course (CLF-C02) - Pass the Exam!",
    ch: "freeCodeCamp.org", lang: "en", dur: 820, kind: "course", lvl: 1, y: 2023,
    dom: { clf: [1, 2, 3, 4] }, svc: ["ec2", "s3", "iam", "vpc"], top: ["cloud-concepts", "shared-responsibility", "billing"] },

  { id: "yt-3hLmDS179YE", yt: "3hLmDS179YE", title: "AWS Certified Cloud Practitioner Training 2020 - Full Course",
    ch: "freeCodeCamp.org", lang: "en", dur: 240, kind: "course", lvl: 1, y: 2020,
    dom: { clf: [1, 2, 3, 4] }, svc: ["ec2", "s3", "iam"], top: ["cloud-concepts", "pricing-models"] },

  { id: "yt-XjPUyGKRjZs", yt: "XjPUyGKRjZs", title: "AWS Cloud Practitioner | AWS Certified Cloud Practitioner - Full Course | AWS Training",
    ch: "edureka!", lang: "en", dur: 180, kind: "course", lvl: 1, y: 2023,
    dom: { clf: [1, 2, 3, 4] }, svc: ["ec2", "s3", "vpc"], top: ["cloud-concepts", "shared-responsibility"] },

  { id: "yt-KznNbxKRXXs", yt: "KznNbxKRXXs", title: "AWS Certified Cloud Practitioner (CLF-C02) Certification Exam Practice Questions",
    ch: "Tech With Shapingpixel", lang: "en", dur: 90, kind: "explainer", lvl: 1, y: 2024,
    dom: { clf: [1, 2, 3, 4] }, svc: [], top: ["exam-strategy"] },

  { id: "yt-bGZXVslod5E", yt: "bGZXVslod5E", title: "Curso: AWS Cloud Practitioner - parte 1/3 (ft. Thauany Moedano)",
    ch: "Zappts", lang: "pt", dur: 90, kind: "course", lvl: 1, y: 2021,
    dom: { clf: [1, 2] }, svc: ["iam", "ec2"], top: ["cloud-concepts", "shared-responsibility"] },

  { id: "yt-NXcvR5TV_Jw", yt: "NXcvR5TV_Jw", title: "Curso: AWS Cloud Practitioner - parte 2/3 (ft. Thauany Moedano)",
    ch: "Zappts", lang: "pt", dur: 90, kind: "course", lvl: 1, y: 2021,
    dom: { clf: [3] }, svc: ["s3", "rds", "vpc"], top: ["cloud-concepts", "storage-choice", "database-choice"] },

  { id: "yt-v3D6B_8RYZU", yt: "v3D6B_8RYZU", title: "Curso: AWS Cloud Practitioner - parte 3/3 (ft. Thauany Moedano)",
    ch: "Zappts", lang: "pt", dur: 90, kind: "course", lvl: 1, y: 2021,
    dom: { clf: [4] }, svc: [], top: ["billing", "pricing-models", "support-plans"] },

  { id: "yt-keHP-56Bifo", yt: "keHP-56Bifo", title: "AWS Certified Cloud Practitioner | Aula 1",
    ch: "Canal da Cloud", lang: "pt", dur: 50, kind: "course", lvl: 1, y: 2023,
    dom: { clf: [1] }, svc: [], top: ["cloud-concepts"] },

  /* ===================== SOLUTIONS ARCHITECT ASSOCIATE (SAA) ===================== */
  { id: "yt-c3Cn4xYfxJY", yt: "c3Cn4xYfxJY", title: "AWS Solutions Architect Associate Certification (SAA-C03) - Full Course to PASS the Exam",
    ch: "freeCodeCamp.org", lang: "en", dur: 780, kind: "course", lvl: 2, y: 2023,
    dom: { saa: [1, 2, 3, 4] }, svc: ["ec2", "s3", "vpc", "iam", "rds", "lambda"], top: ["well-architected", "high-availability", "scalability", "cost-optimization"] },

  { id: "yt-FoBcdIsDzww", yt: "FoBcdIsDzww", title: "AWS Certified Solutions Architect Associate 2024 (Full Free AWS course!) Day One",
    ch: "Go Cloud Architects", lang: "en", dur: 300, kind: "course", lvl: 2, y: 2024,
    dom: { saa: [1, 2, 3, 4] }, svc: ["ec2", "vpc", "iam"], top: ["well-architected", "network-design"] },

  { id: "yt-PUVV9Q2oVX0", yt: "PUVV9Q2oVX0", title: "AWS Certified Solutions Architect Associate 2024 (Full Free AWS course!) Day Six",
    ch: "Go Cloud Architects", lang: "en", dur: 300, kind: "course", lvl: 2, y: 2024,
    dom: { saa: [2, 3, 4] }, svc: ["rds", "dynamodb", "s3"], top: ["database-choice", "high-availability", "cost-optimization"] },

  { id: "yt-1eZBD5i6CXw", yt: "1eZBD5i6CXw", title: "Master AWS Solutions Architect Associate (SAA-C03) - Day 1 | Full Course",
    ch: "K21Academy", lang: "en", dur: 300, kind: "course", lvl: 2, y: 2026,
    dom: { saa: [1, 2, 3, 4] }, svc: ["ec2", "s3", "vpc"], top: ["well-architected", "cloud-concepts"] },

  { id: "yt-ZK5ppb9rzSo", yt: "ZK5ppb9rzSo", title: "AWS Certified Solutions Architect Associate (SAA-C03) - Full Course | Day 1 Live",
    ch: "I-MEDITA (IT Training Academy)", lang: "en", dur: 300, kind: "course", lvl: 2, y: 2026,
    dom: { saa: [1, 2, 3, 4] }, svc: ["ec2", "iam", "vpc"], top: ["well-architected", "cloud-concepts"] },

  { id: "yt-CfvfLlH-8Bg", yt: "CfvfLlH-8Bg", title: "AWS Certified Solutions Architect Associate (SAA-C03) Full Crash Course & 800+ Exam Practice Q&A",
    ch: "Tech With Shapingpixel", lang: "en", dur: 300, kind: "course", lvl: 2, y: 2025,
    dom: { saa: [1, 2, 3, 4] }, svc: [], top: ["exam-strategy", "well-architected"] },

  /* ===================== DEVELOPER ASSOCIATE (DVA) ===================== */
  { id: "yt-TTcyhhH2FWE", yt: "TTcyhhH2FWE", title: "AWS Certified Developer Associate (DVA-C02) Certification Course - Prepare For and Pass the Exam",
    ch: "freeCodeCamp.org", lang: "en", dur: 600, kind: "course", lvl: 2, y: 2024,
    dom: { dva: [1, 2, 3, 4] }, svc: ["lambda", "dynamodb", "api-gateway", "cloudformation", "s3"], top: ["serverless", "ci-cd", "api-design"] },

  { id: "yt-GWAWfu-R-PU", yt: "GWAWfu-R-PU", title: "AWS DevOps CodePipeline Deep Dive | Stages, Manual Approval, Artifact Flow & Full CI/CD Pipeline Demo",
    ch: "DheerajTechInsight", lang: "en", dur: 45, kind: "deepdive", lvl: 2, y: 2024,
    dom: { dva: [3], dop: [1] }, svc: ["codepipeline", "codebuild", "codedeploy"], top: ["ci-cd", "deployment-strategies"] },

  { id: "yt-FLC4Eu_VFao", yt: "FLC4Eu_VFao", title: "AWS - Amazon Messaging Services (SQS) & (SNS) - 007",
    ch: "Cloud Simplified", lang: "en", dur: 20, kind: "explainer", lvl: 2, y: 2022,
    dom: { dva: [1], saa: [3] }, svc: ["sqs", "sns"], top: ["loose-coupling", "event-driven"] },

  { id: "yt-C7HUkG_tu90", yt: "C7HUkG_tu90", title: "AWS re:Invent 2023 - Deep dive into Amazon ECS resilience and availability (CON401)",
    ch: "AWS Events", lang: "en", dur: 55, kind: "deepdive", lvl: 3, y: 2023,
    dom: { dva: [3], soa: [2], saa: [2] }, svc: ["ecs"], top: ["containers", "high-availability", "fault-tolerance"] },

  { id: "yt-cipDJwDWWbY", yt: "cipDJwDWWbY", title: "AWS re:Invent 2021 - Deep dive on Amazon EKS",
    ch: "AWS Events", lang: "en", dur: 55, kind: "deepdive", lvl: 3, y: 2021,
    dom: { dva: [3], saa: [3] }, svc: ["eks"], top: ["containers", "scalability"] },

  { id: "yt-f-BYvQPqOvE", yt: "f-BYvQPqOvE", title: "Introducao ao AWS Lambda",
    ch: "Augusto Galego", lang: "pt", dur: 20, kind: "explainer", lvl: 1, y: 2020,
    dom: { clf: [3], dva: [1] }, svc: ["lambda"], top: ["serverless"] },

  /* ===================== CLOUDOPS ENGINEER / SYSOPS ASSOCIATE (SOA) ===================== */
  { id: "yt-5JTBS09e7ew", yt: "5JTBS09e7ew", title: "AWS CloudOps Engineer Associate (SOA-C03) Certification Course - Pass the Exam!",
    ch: "freeCodeCamp.org", lang: "en", dur: 660, kind: "course", lvl: 2, y: 2025,
    dom: { soa: [1, 2, 3, 4, 5] }, svc: ["ec2", "rds", "dynamodb", "cloudwatch", "ssm"], top: ["monitoring", "automation", "high-availability"] },

  { id: "yt-PBoG050GRpQ", yt: "PBoG050GRpQ", title: "AWS Certified CloudOps Engineer Associate (SOA-C03) Full Crash Course | Part 1 | Compute",
    ch: "Tech With Shapingpixel", lang: "en", dur: 120, kind: "course", lvl: 2, y: 2024,
    dom: { soa: [1] }, svc: ["ec2", "auto-scaling"], top: ["performance", "scalability"] },

  { id: "yt-AaI2xkW85yE", yt: "AaI2xkW85yE", title: "AWS re:Invent 2020: Automate anything with AWS Systems Manager",
    ch: "AWS Events", lang: "en", dur: 55, kind: "deepdive", lvl: 2, y: 2020,
    dom: { soa: [3], dop: [2] }, svc: ["ssm"], top: ["automation", "patching"] },

  { id: "yt-dQPXBohP0hw", yt: "dQPXBohP0hw", title: "AWS CloudWatch Tutorial for Beginners | Metrics, Alarms, Dashboards & Logs Explained",
    ch: "DheerajTechInsight", lang: "en", dur: 35, kind: "explainer", lvl: 2, y: 2025,
    dom: { soa: [1], dva: [4] }, svc: ["cloudwatch"], top: ["monitoring", "logging"] },

  { id: "yt-Gd7U-zGeZEo", yt: "Gd7U-zGeZEo", title: "AWS re:Invent 2024 - Backup and disaster recovery strategies for increased resilience (COP319)",
    ch: "AWS Events", lang: "en", dur: 55, kind: "deepdive", lvl: 2, y: 2024,
    dom: { soa: [2], sap: [2], clf: [3] }, svc: ["backup", "drs"], top: ["disaster-recovery", "backup-restore", "high-availability"] },

  /* ===================== DATA ENGINEER ASSOCIATE (DEA) ===================== */
  { id: "yt-6G0bLDIcO7Y", yt: "6G0bLDIcO7Y", title: "AWS Certified Data Engineer - Associate (DEA-C01) [Full Course In 285min]",
    ch: "Johnny Chivers", lang: "en", dur: 285, kind: "course", lvl: 2, y: 2024,
    dom: { dea: [1, 2, 3, 4] }, svc: ["glue", "redshift", "athena", "kinesis", "s3"], top: ["etl", "data-lake", "streaming"] },

  { id: "yt-iA4XVaAUTWw", yt: "iA4XVaAUTWw", title: "AWS Data Engineering Associate Certification Preparation Guide | How I cleared in 3 DAYS?",
    ch: "Darshil Parmar", lang: "en", dur: 40, kind: "explainer", lvl: 2, y: 2024,
    dom: { dea: [1, 2, 3, 4] }, svc: [], top: ["exam-strategy"] },

  { id: "yt-eQBHIINW8VY", yt: "eQBHIINW8VY", title: "AWS re:Invent 2017: Building Serverless ETL Pipelines with AWS Glue (ABD315)",
    ch: "Amazon Web Services", lang: "en", dur: 55, kind: "deepdive", lvl: 2, y: 2017,
    dom: { dea: [1] }, svc: ["glue"], top: ["etl", "serverless"] },

  { id: "yt-4N_ktE4NFIk", yt: "4N_ktE4NFIk", title: "AWS re:Invent 2016: NEW LAUNCH! Introduction to AWS Glue: A Fully Managed ETL Service (BDA209)",
    ch: "Amazon Web Services", lang: "en", dur: 50, kind: "deepdive", lvl: 2, y: 2016,
    dom: { dea: [1] }, svc: ["glue"], top: ["etl"] },

  { id: "yt-lj8oaSpCFTc", yt: "lj8oaSpCFTc", title: "AWS re:Invent 2019: Deep dive and best practices for Amazon Redshift (ANT418)",
    ch: "AWS Events", lang: "en", dur: 55, kind: "deepdive", lvl: 2, y: 2019,
    dom: { dea: [2] }, svc: ["redshift"], top: ["data-lake", "sql-tuning", "performance"] },

  { id: "yt-ri90WLI5R5A", yt: "ri90WLI5R5A", title: "Amazon Athena Tutorial: Serverless SQL Queries on S3 Data",
    ch: "CodeLucky", lang: "en", dur: 25, kind: "explainer", lvl: 2, y: 2025,
    dom: { dea: [1, 3] }, svc: ["athena", "s3"], top: ["etl", "batch-processing"] },

  /* ===================== ML ENGINEER ASSOCIATE (MLA) ===================== */
  { id: "yt-bUHJ8IPakQY", yt: "bUHJ8IPakQY", title: "AWS Certified Machine Learning Engineer - Associate (MLA-C01) [Full Course In 205min]",
    ch: "Johnny Chivers", lang: "en", dur: 205, kind: "course", lvl: 2, y: 2024,
    dom: { mla: [1, 2, 3, 4] }, svc: ["sagemaker", "bedrock"], top: ["feature-engineering", "mlops", "model-deployment"] },

  { id: "yt-ylZH9RLHGyw", yt: "ylZH9RLHGyw", title: "Everything You Need to Know About AWS Machine Learning Associate Certification (MLA-C01)",
    ch: "K21Academy", lang: "en", dur: 35, kind: "explainer", lvl: 2, y: 2024,
    dom: { mla: [1, 2, 3, 4] }, svc: [], top: ["exam-strategy"] },

  { id: "yt-1bt11sLo5Pw", yt: "1bt11sLo5Pw", title: "Introduction to SageMaker AI | Amazon Web Services",
    ch: "Amazon Web Services", lang: "en", dur: 10, kind: "explainer", lvl: 2, y: 2024,
    dom: { mla: [2], aif: [3] }, svc: ["sagemaker"], top: ["model-deployment", "ai-ml-basics"] },

  { id: "yt-8ZpE-9LnaJk", yt: "8ZpE-9LnaJk", title: "AWS re:Invent 2020: Implementing MLOps practices with Amazon SageMaker",
    ch: "AWS Events", lang: "en", dur: 55, kind: "deepdive", lvl: 3, y: 2020,
    dom: { mla: [3, 4] }, svc: ["sagemaker", "sm-pipelines", "model-registry"], top: ["mlops", "model-monitoring"] },

  /* ===================== DEVOPS ENGINEER PROFESSIONAL (DOP) ===================== */
  { id: "yt-JmGYKAofqY8", yt: "JmGYKAofqY8", title: "AWS Certified DevOps Engineer Professional Masterclass (DOP-C02) | The Certification Podcast",
    ch: "Ved Prajapati", lang: "en", dur: 60, kind: "course", lvl: 3, y: 2024,
    dom: { dop: [1, 2, 3, 4, 5, 6] }, svc: ["codepipeline", "cloudformation", "cloudwatch"], top: ["ci-cd", "iac", "monitoring"] },

  { id: "yt-5Bx7f_e4dDM", yt: "5Bx7f_e4dDM", title: "AWS re:Invent 2024 - Respond and recover faster with AWS Security Incident Response (SEC360-NEW)",
    ch: "AWS Events", lang: "en", dur: 55, kind: "deepdive", lvl: 3, y: 2024,
    dom: { dop: [5], scs: [2] }, svc: ["security-hub", "guardduty"], top: ["incident-response", "threat-detection"] },

  /* ===================== SECURITY SPECIALTY (SCS) ===================== */
  { id: "yt-ub-7Kkgl02I", yt: "ub-7Kkgl02I", title: "AWS Certified Security - Specialty (SCS-C03) Full Course [12 Hours] - Pass on Your First Try",
    ch: "sthithapragna", lang: "en", dur: 720, kind: "course", lvl: 3, y: 2024,
    dom: { scs: [1, 2, 3, 4, 5, 6] }, svc: ["iam", "kms", "guardduty", "security-hub"], top: ["threat-detection", "identity-access", "encryption"] },

  { id: "yt-b6UiR1qx8Po", yt: "b6UiR1qx8Po", title: "Cybr's AWS Security Specialty (SCS-C03) Course (Watch First)",
    ch: "Cybr", lang: "en", dur: 20, kind: "course", lvl: 3, y: 2024,
    dom: { scs: [1, 2, 3, 4, 5, 6] }, svc: [], top: ["exam-strategy"] },

  { id: "yt-3fR2PMtW7fs", yt: "3fR2PMtW7fs", title: "AWS re:Invent 2024 - Uncovering sophisticated cloud threats with Amazon GuardDuty (SEC219)",
    ch: "AWS Events", lang: "en", dur: 55, kind: "deepdive", lvl: 3, y: 2024,
    dom: { scs: [1] }, svc: ["guardduty"], top: ["threat-detection"] },

  { id: "yt-Imjbh0WPSR4", yt: "Imjbh0WPSR4", title: "AWS re:Invent 2017: NEW LAUNCH! Introduction to Amazon GuardDuty (SID218)",
    ch: "Amazon Web Services", lang: "en", dur: 45, kind: "deepdive", lvl: 3, y: 2017,
    dom: { scs: [1], clf: [2] }, svc: ["guardduty"], top: ["threat-detection"] },

  { id: "yt-so0W0BMLZUQ", yt: "so0W0BMLZUQ", title: "AWS KMS Tutorial: Key Management Service Explained for Beginners | AWS Security Series",
    ch: "CodeLucky", lang: "en", dur: 20, kind: "explainer", lvl: 2, y: 2024,
    dom: { scs: [5], clf: [2], saa: [1] }, svc: ["kms"], top: ["encryption", "key-management"] },

  { id: "yt-rxPEPpKb670", yt: "rxPEPpKb670", title: "AWS Security Hub Deep Dive",
    ch: "Stephane Maarek", lang: "en", dur: 25, kind: "deepdive", lvl: 3, y: 2023,
    dom: { scs: [1, 6] }, svc: ["security-hub", "config"], top: ["compliance", "governance"] },

  { id: "yt-2wRgvTCyesw", yt: "2wRgvTCyesw", title: "AWS Security Deep Dive: Protecting Your Apps with WAF and Shield",
    ch: "dotnetist prometheus", lang: "en", dur: 30, kind: "deepdive", lvl: 3, y: 2025,
    dom: { scs: [3], saa: [1] }, svc: ["waf", "shield"], top: ["network-security"] },

  { id: "yt-GseJ2wkhrs0", yt: "GseJ2wkhrs0", title: "AWS Shared Responsibility Model Explained | Cloud Security Shared Responsibility Model in Action",
    ch: "Go Cloud Architects", lang: "en", dur: 15, kind: "explainer", lvl: 1, y: 2024,
    dom: { scs: [6], clf: [2] }, svc: [], top: ["shared-responsibility"] },

  { id: "yt-o13js0hIO_o", yt: "o13js0hIO_o", title: "Simplify the AWS Shared Responsibility Model | Amazon Web Services",
    ch: "Amazon Web Services", lang: "en", dur: 8, kind: "explainer", lvl: 1, y: 2023,
    dom: { scs: [6], clf: [2], aif: [5] }, svc: [], top: ["shared-responsibility", "compliance"] },

  /* ===================== SOLUTIONS ARCHITECT PROFESSIONAL (SAP) ===================== */
  { id: "yt-hyEw7dQ9-JE", yt: "hyEw7dQ9-JE", title: "AWS Solutions Architect Professional (SAP-C02) Certification Course - Pass the Exam!",
    ch: "freeCodeCamp.org", lang: "en", dur: 900, kind: "course", lvl: 3, y: 2023,
    dom: { sap: [1, 2, 3, 4] }, svc: ["ec2", "s3", "vpc", "organizations", "mgn"], top: ["well-architected", "migration-strategies", "multi-account"] },

  { id: "yt-n55lGQ5AyI8", yt: "n55lGQ5AyI8", title: "AWS Organizations & Control Tower Explained | Multi-Account Management in AWS",
    ch: "Everything at Cloud", lang: "en", dur: 20, kind: "explainer", lvl: 3, y: 2025,
    dom: { sap: [1], scs: [6] }, svc: ["organizations", "control-tower"], top: ["multi-account", "governance"] },

  { id: "yt-a55Iud-66q0", yt: "a55Iud-66q0", title: "A Deep Dive into AWS Transit Gateway",
    ch: "LearnCantrill", lang: "en", dur: 35, kind: "deepdive", lvl: 3, y: 2023,
    dom: { sap: [2], ans: [1, 2] }, svc: ["transit-gateway"], top: ["network-design", "hybrid-connectivity"] },

  { id: "yt-OXfOwjDd6lY", yt: "OXfOwjDd6lY", title: "AWS re:Invent 2025 - Hybrid connectivity at scale: A deep dive into AWS Direct Connect (NET403)",
    ch: "AWS Events", lang: "en", dur: 51, kind: "deepdive", lvl: 3, y: 2025,
    dom: { sap: [2], ans: [1, 2] }, svc: ["direct-connect"], top: ["hybrid-connectivity", "network-design"] },

  /* ===================== GENERATIVE AI DEVELOPER PROFESSIONAL (AIP) ===================== */
  { id: "yt-rB7JkxM3D-w", yt: "rB7JkxM3D-w", title: "AWS Generative AI Developer - Professional AIP-C01 Full Course [9+ Hours] - Pass on Your First Try",
    ch: "sthithapragna", lang: "en", dur: 560, kind: "course", lvl: 3, y: 2025,
    dom: { aip: [1, 2, 3, 4, 5] }, svc: ["bedrock", "bedrock-agents", "bedrock-kb"], top: ["generative-ai", "rag", "prompt-engineering"] },

  { id: "yt-OjkD42VwBkc", yt: "OjkD42VwBkc", title: "AWS Certified Generative AI Developer Professional Course | AIP-C01 Training",
    ch: "Architecture Bytes - AI", lang: "en", dur: 240, kind: "course", lvl: 3, y: 2025,
    dom: { aip: [1, 2, 3, 4, 5] }, svc: ["bedrock", "sagemaker"], top: ["generative-ai", "mlops"] },

  { id: "yt-Pnjo3sfiY-c", yt: "Pnjo3sfiY-c", title: "The NEW AWS Certified Generative AI Developer Professional Certificate",
    ch: "Digital Cloud Training", lang: "en", dur: 15, kind: "explainer", lvl: 3, y: 2025,
    dom: { aip: [1] }, svc: ["bedrock"], top: ["generative-ai", "exam-strategy"] },

  { id: "yt-jSlNfr8Uuco", yt: "jSlNfr8Uuco", title: "AWS re:Invent 2024 - Build scalable RAG applications using Amazon Bedrock Knowledge Bases (AIM305)",
    ch: "AWS Events", lang: "en", dur: 55, kind: "deepdive", lvl: 3, y: 2024,
    dom: { aip: [2], mla: [2] }, svc: ["bedrock", "bedrock-kb"], top: ["rag"] },

  { id: "yt-hOqqcYpE8Rg", yt: "hOqqcYpE8Rg", title: "AWS re:Invent 2023: AWS On Air ft. Agents for Amazon Bedrock",
    ch: "AWS Events", lang: "en", dur: 40, kind: "deepdive", lvl: 3, y: 2023,
    dom: { aip: [2], mla: [3] }, svc: ["bedrock-agents"], top: ["agents-ai", "generative-ai"] },

  { id: "yt-oZWjM4kr-Oc", yt: "oZWjM4kr-Oc", title: "AWS re:Invent 2025 - Building AI Agents with Kiro, MCP, and Amazon Bedrock AgentCore (DEV331)",
    ch: "AWS Events", lang: "en", dur: 55, kind: "deepdive", lvl: 3, y: 2025,
    dom: { aip: [2, 4] }, svc: ["bedrock-agents"], top: ["agents-ai", "llm-ops"] },

  { id: "yt-mhItmKsB5tQ", yt: "mhItmKsB5tQ", title: "Amazon Bedrock: Fast-track gen AI from prototype to production | Amazon Web Services",
    ch: "Amazon Web Services", lang: "en", dur: 12, kind: "explainer", lvl: 2, y: 2023,
    dom: { aip: [1], aif: [3] }, svc: ["bedrock"], top: ["generative-ai"] },

  { id: "yt-loOIG0-cL3Q", yt: "loOIG0-cL3Q", title: "What is Amazon Bedrock? An Introduction to Generative AI with AWS Bedrock for Beginners",
    ch: "Cameron McKenzie", lang: "en", dur: 18, kind: "explainer", lvl: 1, y: 2024,
    dom: { aif: [3], aip: [1] }, svc: ["bedrock"], top: ["generative-ai"] },

  /* ===================== ADVANCED NETWORKING SPECIALTY (ANS) ===================== */
  { id: "yt-HvH181B4BSQ", yt: "HvH181B4BSQ", title: "AWS Advanced Networking Course | FREE ANS-C01 Training | AWS Networking Specialty Course",
    ch: "Go Cloud Architects", lang: "en", dur: 480, kind: "course", lvl: 3, y: 2024,
    dom: { ans: [1, 2, 3, 4] }, svc: ["vpc", "transit-gateway", "direct-connect", "vpn"], top: ["network-design", "hybrid-connectivity"] },

  { id: "yt-RSxpr9aA75w", yt: "RSxpr9aA75w", title: "Amazon/AWS Route 53 Deep Dive: DNS, Domains, Routing Policies & Hands-On Demo",
    ch: "DheerajTechInsight", lang: "en", dur: 40, kind: "deepdive", lvl: 2, y: 2025,
    dom: { ans: [1], saa: [3] }, svc: ["route53"], top: ["dns"] },

  { id: "yt-sGMcGdhmun8", yt: "sGMcGdhmun8", title: "AWS CloudFront Deep Dive | CDN, Edge Locations, Caching & Global Delivery",
    ch: "DheerajTechInsight", lang: "en", dur: 35, kind: "deepdive", lvl: 2, y: 2025,
    dom: { ans: [1], saa: [3] }, svc: ["cloudfront"], top: ["content-delivery", "caching"] },

  /* ===================== AI BUSINESS STRATEGIST (AIB) ===================== */
  { id: "yt-zABvgbDQLhM", yt: "zABvgbDQLhM", title: "AWS Certified AI Business Strategist (AIB-C01) Practice Exam: New Certification",
    ch: "Cloud For All - Conhecimento e para Todos!", lang: "pt", dur: 30, kind: "explainer", lvl: 1, y: 2025,
    dom: { aib: [1, 2, 3, 4] }, svc: [], top: ["ai-strategy", "ai-governance"] },

  { id: "yt-uRI0dllESko", yt: "uRI0dllESko", title: "AWS re:Invent 2023 - Responsible AI in the generative era: Science and practice (AIM220)",
    ch: "AWS Events", lang: "en", dur: 55, kind: "deepdive", lvl: 2, y: 2023,
    dom: { aib: [3], aif: [4] }, svc: [], top: ["responsible-ai", "ai-governance"] },

  /* ===================== AI PRACTITIONER (AIF) ===================== */
  { id: "yt-WZeZZ8_W-M4", yt: "WZeZZ8_W-M4", title: "AWS Certified AI Practitioner (AIF-C01) - Full Course to PASS the Certification Exam",
    ch: "freeCodeCamp.org", lang: "en", dur: 900, kind: "course", lvl: 1, y: 2024,
    dom: { aif: [1, 2, 3, 4, 5] }, svc: ["sagemaker", "bedrock", "comprehend", "rekognition"], top: ["ai-ml-basics", "generative-ai", "responsible-ai"] },

  { id: "yt-wrlYYRgaW5w", yt: "wrlYYRgaW5w", title: "AWS AI Practitioner AIF-C01 Full Course [6 Hours] - Pass on Your First Try",
    ch: "sthithapragna", lang: "en", dur: 360, kind: "course", lvl: 1, y: 2024,
    dom: { aif: [1, 2, 3, 4, 5] }, svc: ["sagemaker", "bedrock"], top: ["ai-ml-basics", "generative-ai"] },

  { id: "yt-Npx1x1nLgLQ", yt: "Npx1x1nLgLQ", title: "AWS AI Practitioner Explained - Full Course to PASS the AIF-C01 Certification",
    ch: "Tech with Guilherme Teles", lang: "en", dur: 300, kind: "course", lvl: 1, y: 2024,
    dom: { aif: [1, 2, 3, 4, 5] }, svc: ["bedrock", "sagemaker"], top: ["ai-ml-basics", "generative-ai"] },

  { id: "yt-eDX8mikQrMo", yt: "eDX8mikQrMo", title: "AWS Certified AI Practitioner AIF-C01 Full Crash Course | 400+ Practice Questions | Exam Focused",
    ch: "Tech With Shapingpixel", lang: "en", dur: 240, kind: "course", lvl: 1, y: 2024,
    dom: { aif: [1, 2, 3, 4, 5] }, svc: [], top: ["exam-strategy"] },

  { id: "yt-o6t2AmOyw9o", yt: "o6t2AmOyw9o", title: "Modulo 1: Introducao ao Amazon Bedrock | IA Generativa na AWS explicada para AIF-C01!",
    ch: "Jean Diogo", lang: "pt", dur: 30, kind: "course", lvl: 1, y: 2024,
    dom: { aif: [2, 3] }, svc: ["bedrock"], top: ["generative-ai"] },

  { id: "yt-55nzTrFfE2s", yt: "55nzTrFfE2s", title: "Inteligencia Artificial Generativa na AWS | Amazon Bedrock e aplicacoes praticas",
    ch: "AWS Developers LATAM", lang: "pt", dur: 40, kind: "explainer", lvl: 1, y: 2024,
    dom: { aif: [2, 3] }, svc: ["bedrock"], top: ["generative-ai"] },

  /* ===================== CONTEUDO GERAL / TRANSVERSAL ===================== */
  { id: "yt-n4EliRQtXcc", yt: "n4EliRQtXcc", title: "Copy & Paste THIS Strategy To Get Any AWS Certification (Without Wasting Time)",
    ch: "Tech With Soleyman", lang: "en", dur: 15, kind: "explainer", lvl: 2, y: 2025,
    dom: { saa: [1, 2, 3, 4] }, svc: [], top: ["exam-strategy"] },

  { id: "yt-ecv-19sYL3w", yt: "ecv-19sYL3w", title: "Introduction to Amazon S3 | Amazon Web Services",
    ch: "Amazon Web Services", lang: "en", dur: 10, kind: "explainer", lvl: 1, y: 2020,
    dom: { clf: [3], saa: [2] }, svc: ["s3"], top: ["storage-choice"] },

  { id: "yt-cMVzm_Rqmc8", yt: "cMVzm_Rqmc8", title: "Armazenamento em nuvem com Amazon S3 na AWS | Tutorial pratico",
    ch: "AWS Developers LATAM", lang: "pt", dur: 25, kind: "explainer", lvl: 1, y: 2022,
    dom: { clf: [3], saa: [2] }, svc: ["s3"], top: ["storage-choice"] },

  /* ===================== DEEP DIVES DE SERVICOS CENTRAIS (compartilhados entre certs) ===================== */
  { id: "yt-S4swTRi1i0w", yt: "S4swTRi1i0w", title: "AWS re:Invent 2025 - Deep dive on Amazon S3 (STG407)",
    ch: "AWS Events", lang: "en", dur: 60, kind: "deepdive", lvl: 2, y: 2025,
    dom: { saa: [2, 3], soa: [1], dea: [2] }, svc: ["s3"], top: ["storage-choice", "high-availability", "performance"] },

  { id: "yt-NXehLy7IiPM", yt: "NXehLy7IiPM", title: "AWS re:Invent 2024 - Dive deep on Amazon S3 (STG302)",
    ch: "AWS Events", lang: "en", dur: 60, kind: "deepdive", lvl: 2, y: 2024,
    dom: { saa: [2, 3], soa: [1] }, svc: ["s3"], top: ["storage-choice", "performance"] },

  { id: "yt-sYDJYqvNeXU", yt: "sYDJYqvNeXU", title: "AWS re:Invent 2023 - Dive deep on Amazon S3 (STG314)",
    ch: "AWS Events", lang: "en", dur: 60, kind: "deepdive", lvl: 2, y: 2023,
    dom: { saa: [2, 3] }, svc: ["s3"], top: ["storage-choice", "high-availability"] },

  { id: "yt-HJNR_dX8g8c", yt: "HJNR_dX8g8c", title: "AWS re:Invent 2022 - Dive deep on AWS networking infrastructure (NET402)",
    ch: "AWS Events", lang: "en", dur: 60, kind: "deepdive", lvl: 3, y: 2022,
    dom: { saa: [2, 3], ans: [1, 2] }, svc: ["vpc", "transit-gateway"], top: ["network-design", "high-availability"] },

  { id: "yt-cRdDCkbE4es", yt: "cRdDCkbE4es", title: "AWS re:Invent 2023 - Advanced VPC designs and new capabilities (NET306)",
    ch: "AWS Events", lang: "en", dur: 60, kind: "deepdive", lvl: 3, y: 2023,
    dom: { saa: [1, 2], ans: [1, 2] }, svc: ["vpc"], top: ["network-design", "network-security"] },

  { id: "yt-7qaSfmnFiI0", yt: "7qaSfmnFiI0", title: "AWS re:Invent 2024 - Amazon VPC: Advanced design and what's new (NET301)",
    ch: "AWS Events", lang: "en", dur: 60, kind: "deepdive", lvl: 3, y: 2024,
    dom: { saa: [1, 2], ans: [1, 2] }, svc: ["vpc"], top: ["network-design", "vpc-connectivity"] },

  { id: "yt-hAk-7ImN6iM", yt: "hAk-7ImN6iM", title: "UPDATED - AWS Identity and Access Management (IAM) Basics | AWS Tutorials For Beginners",
    ch: "Tiny Technical Tutorials", lang: "en", dur: 20, kind: "explainer", lvl: 1, y: 2024,
    dom: { clf: [2], saa: [1], dva: [2], soa: [4] }, svc: ["iam"], top: ["least-privilege", "identity-access"] },

  { id: "yt-y8cbKJAo3B4", yt: "y8cbKJAo3B4", title: "AWS IAM Overview in 7 minutes | Beginner Overview",
    ch: "Be A Better Dev", lang: "en", dur: 7, kind: "explainer", lvl: 1, y: 2023,
    dom: { clf: [2], saa: [1] }, svc: ["iam"], top: ["identity-access", "least-privilege"] },

  { id: "yt-qlkr0h9JQ6U", yt: "qlkr0h9JQ6U", title: "AWS Lambda explained in 90 seconds | Amazon Web Services",
    ch: "Amazon Web Services", lang: "en", dur: 2, kind: "explainer", lvl: 1, y: 2023,
    dom: { clf: [3], dva: [1], saa: [3] }, svc: ["lambda"], top: ["serverless"] },

  { id: "yt-Qzs8mU5dgx4", yt: "Qzs8mU5dgx4", title: "AWS re:Invent 2024 - Dive deep into Amazon DynamoDB (DAT406)",
    ch: "AWS Events", lang: "en", dur: 60, kind: "deepdive", lvl: 2, y: 2024,
    dom: { saa: [2, 3], dva: [1], dea: [2] }, svc: ["dynamodb"], top: ["database-choice", "scalability", "performance"] },

  { id: "yt-ld-xoehkJuU", yt: "ld-xoehkJuU", title: "AWS re:Invent 2023 - Dive deep into Amazon DynamoDB (DAT330)",
    ch: "AWS Events", lang: "en", dur: 60, kind: "deepdive", lvl: 2, y: 2023,
    dom: { saa: [2, 3], dva: [1] }, svc: ["dynamodb"], top: ["database-choice", "performance"] },

  { id: "yt-ik2J0txfbdM", yt: "ik2J0txfbdM", title: "Amazon EC2 Instance Types Deep Dive",
    ch: "Stephane Maarek", lang: "en", dur: 20, kind: "deepdive", lvl: 2, y: 2023,
    dom: { saa: [3], soa: [1], clf: [3] }, svc: ["ec2"], top: ["performance", "cost-optimization"] },

  { id: "yt-Ph0dnixovNE", yt: "Ph0dnixovNE", title: "AWS Well-Architected Framework Simply Explained",
    ch: "CloudWolf AWS", lang: "en", dur: 15, kind: "explainer", lvl: 2, y: 2025,
    dom: { saa: [1, 2, 3, 4], sap: [2, 3] }, svc: [], top: ["well-architected"] },

  { id: "yt-o4NYjMPZPZE", yt: "o4NYjMPZPZE", title: "Six Pillars of AWS Well Architected Framework Explained",
    ch: "Tech With Yeshwanth", lang: "en", dur: 15, kind: "explainer", lvl: 2, y: 2025,
    dom: { saa: [1, 2, 3, 4], sap: [2, 3] }, svc: [], top: ["well-architected"] }

]);
