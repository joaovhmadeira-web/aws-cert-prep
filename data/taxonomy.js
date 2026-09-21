/*
 * TAXONOMIA DE METADADOS
 * Vocabulário único usado por questões, lições, vídeos e materiais.
 * O motor de recomendação (js/recommender.js) casa questões x conteúdos
 * comparando `services` e `topics` (e cert/domínio) — nunca por vínculo fixo.
 */
window.AWSPREP = window.AWSPREP || {};
AWSPREP.bank = { lessons: [], questions: [], videos: [], resources: [] };
AWSPREP.add = function (kind, items) { AWSPREP.bank[kind].push.apply(AWSPREP.bank[kind], items); };

// slug: [nome, categoria]
AWSPREP.services = {
  // Compute
  ec2: ["Amazon EC2", "compute"], lambda: ["AWS Lambda", "compute"], ecs: ["Amazon ECS", "compute"], eks: ["Amazon EKS", "compute"],
  fargate: ["AWS Fargate", "compute"], batch: ["AWS Batch", "compute"], beanstalk: ["AWS Elastic Beanstalk", "compute"],
  "auto-scaling": ["EC2 Auto Scaling", "compute"], elb: ["Elastic Load Balancing", "networking"], outposts: ["AWS Outposts", "compute"],
  "app-runner": ["AWS App Runner", "compute"], lightsail: ["Amazon Lightsail", "compute"],
  // Storage
  s3: ["Amazon S3", "storage"], "s3-glacier": ["S3 Glacier", "storage"], ebs: ["Amazon EBS", "storage"], efs: ["Amazon EFS", "storage"],
  fsx: ["Amazon FSx", "storage"], "storage-gateway": ["AWS Storage Gateway", "storage"], backup: ["AWS Backup", "storage"],
  datasync: ["AWS DataSync", "storage"], snow: ["AWS Snow Family", "storage"], "transfer-family": ["AWS Transfer Family", "storage"],
  drs: ["AWS Elastic Disaster Recovery", "storage"],
  // Database
  rds: ["Amazon RDS", "database"], aurora: ["Amazon Aurora", "database"], dynamodb: ["Amazon DynamoDB", "database"],
  elasticache: ["Amazon ElastiCache", "database"], memorydb: ["Amazon MemoryDB", "database"], redshift: ["Amazon Redshift", "database"],
  documentdb: ["Amazon DocumentDB", "database"], neptune: ["Amazon Neptune", "database"], keyspaces: ["Amazon Keyspaces", "database"],
  timestream: ["Amazon Timestream", "database"], dms: ["AWS DMS", "migration"], sct: ["AWS Schema Conversion Tool", "migration"],
  // Networking
  vpc: ["Amazon VPC", "networking"], route53: ["Amazon Route 53", "networking"], cloudfront: ["Amazon CloudFront", "networking"],
  "global-accelerator": ["AWS Global Accelerator", "networking"], "direct-connect": ["AWS Direct Connect", "networking"],
  vpn: ["AWS Site-to-Site VPN", "networking"], "transit-gateway": ["AWS Transit Gateway", "networking"], privatelink: ["AWS PrivateLink", "networking"],
  "api-gateway": ["Amazon API Gateway", "networking"], "network-firewall": ["AWS Network Firewall", "networking"], "vpc-lattice": ["Amazon VPC Lattice", "networking"],
  "cloud-wan": ["AWS Cloud WAN", "networking"], "cloud-map": ["AWS Cloud Map", "networking"],
  // Security & identity
  iam: ["AWS IAM", "security"], "identity-center": ["IAM Identity Center", "security"], organizations: ["AWS Organizations", "security"],
  "control-tower": ["AWS Control Tower", "security"], kms: ["AWS KMS", "security"], "secrets-manager": ["AWS Secrets Manager", "security"],
  acm: ["AWS Certificate Manager", "security"], cognito: ["Amazon Cognito", "security"], waf: ["AWS WAF", "security"], shield: ["AWS Shield", "security"],
  guardduty: ["Amazon GuardDuty", "security"], inspector: ["Amazon Inspector", "security"], macie: ["Amazon Macie", "security"],
  "security-hub": ["AWS Security Hub", "security"], detective: ["Amazon Detective", "security"], cloudtrail: ["AWS CloudTrail", "management"],
  config: ["AWS Config", "management"], "firewall-manager": ["AWS Firewall Manager", "security"], artifact: ["AWS Artifact", "security"],
  "directory-service": ["AWS Directory Service", "security"], cloudhsm: ["AWS CloudHSM", "security"], ram: ["AWS RAM", "security"],
  "security-lake": ["Amazon Security Lake", "security"],
  // Management & governance
  cloudwatch: ["Amazon CloudWatch", "management"], cloudformation: ["AWS CloudFormation", "management"], cdk: ["AWS CDK", "management"],
  ssm: ["AWS Systems Manager", "management"], "trusted-advisor": ["AWS Trusted Advisor", "management"], "cost-explorer": ["AWS Cost Explorer", "cost"],
  budgets: ["AWS Budgets", "cost"], "compute-optimizer": ["AWS Compute Optimizer", "management"], "service-catalog": ["AWS Service Catalog", "management"],
  "health-dashboard": ["AWS Health", "management"], "savings-plans": ["Savings Plans / RIs", "cost"], "cost-anomaly": ["AWS Cost Anomaly Detection", "cost"],
  "well-architected-tool": ["AWS Well-Architected Tool", "management"], "license-manager": ["AWS License Manager", "management"],
  // App integration
  sqs: ["Amazon SQS", "integration"], sns: ["Amazon SNS", "integration"], eventbridge: ["Amazon EventBridge", "integration"],
  "step-functions": ["AWS Step Functions", "integration"], kinesis: ["Amazon Kinesis Data Streams", "analytics"], firehose: ["Amazon Data Firehose", "analytics"],
  msk: ["Amazon MSK", "analytics"], mq: ["Amazon MQ", "integration"], appsync: ["AWS AppSync", "integration"], appflow: ["Amazon AppFlow", "integration"],
  // Dev tools
  codecommit: ["AWS CodeCommit", "devtools"], codebuild: ["AWS CodeBuild", "devtools"], codedeploy: ["AWS CodeDeploy", "devtools"],
  codepipeline: ["AWS CodePipeline", "devtools"], codeartifact: ["AWS CodeArtifact", "devtools"], xray: ["AWS X-Ray", "devtools"],
  amplify: ["AWS Amplify", "devtools"], sam: ["AWS SAM", "devtools"], ecr: ["Amazon ECR", "devtools"], "app-config": ["AWS AppConfig", "devtools"],
  // Analytics
  athena: ["Amazon Athena", "analytics"], glue: ["AWS Glue", "analytics"], emr: ["Amazon EMR", "analytics"], "lake-formation": ["AWS Lake Formation", "analytics"],
  quicksight: ["Amazon QuickSight", "analytics"], opensearch: ["Amazon OpenSearch Service", "analytics"], flink: ["Managed Service for Apache Flink", "analytics"],
  databrew: ["AWS Glue DataBrew", "analytics"], mwaa: ["Amazon MWAA", "analytics"], datazone: ["Amazon DataZone", "analytics"],
  // AI / ML
  sagemaker: ["Amazon SageMaker AI", "ml"], bedrock: ["Amazon Bedrock", "ml"], "bedrock-agents": ["Bedrock Agents / AgentCore", "ml"],
  "bedrock-kb": ["Bedrock Knowledge Bases", "ml"], "bedrock-guardrails": ["Bedrock Guardrails", "ml"], q: ["Amazon Q", "ml"],
  comprehend: ["Amazon Comprehend", "ml"], rekognition: ["Amazon Rekognition", "ml"], textract: ["Amazon Textract", "ml"], transcribe: ["Amazon Transcribe", "ml"],
  translate: ["Amazon Translate", "ml"], polly: ["Amazon Polly", "ml"], lex: ["Amazon Lex", "ml"], kendra: ["Amazon Kendra", "ml"],
  personalize: ["Amazon Personalize", "ml"], forecast: ["Amazon Forecast", "ml"], clarify: ["SageMaker Clarify", "ml"],
  "model-monitor": ["SageMaker Model Monitor", "ml"], "ground-truth": ["SageMaker Ground Truth", "ml"], a2i: ["Amazon Augmented AI", "ml"],
  jumpstart: ["SageMaker JumpStart", "ml"], "data-wrangler": ["SageMaker Data Wrangler", "ml"], "feature-store": ["SageMaker Feature Store", "ml"],
  "sm-pipelines": ["SageMaker Pipelines", "ml"], "model-registry": ["SageMaker Model Registry", "ml"], "sm-endpoints": ["SageMaker Endpoints", "ml"],
  // Migration
  mgn: ["AWS Application Migration Service", "migration"], "migration-hub": ["AWS Migration Hub", "migration"], "app-discovery": ["AWS Application Discovery Service", "migration"]
};

// slug: nome PT-BR
AWSPREP.topics = {
  "least-privilege": "Menor privilégio", encryption: "Criptografia", "key-management": "Gestão de chaves", "high-availability": "Alta disponibilidade",
  "fault-tolerance": "Tolerância a falhas", "disaster-recovery": "Recuperação de desastres", scalability: "Escalabilidade", elasticity: "Elasticidade",
  "loose-coupling": "Desacoplamento", "event-driven": "Arquitetura orientada a eventos", serverless: "Serverless", "cost-optimization": "Otimização de custos",
  "pricing-models": "Modelos de preço", performance: "Performance", caching: "Cache", monitoring: "Monitoramento", logging: "Logging", auditing: "Auditoria",
  compliance: "Conformidade", governance: "Governança", "multi-account": "Multi-conta", "hybrid-connectivity": "Conectividade híbrida",
  "network-design": "Design de rede", "network-security": "Segurança de rede", dns: "DNS", "content-delivery": "Entrega de conteúdo (CDN)",
  "data-lake": "Data lake", etl: "ETL / transformação", streaming: "Streaming de dados", "batch-processing": "Processamento em lote",
  "data-migration": "Migração de dados", "migration-strategies": "Estratégias de migração (7 Rs)", "database-choice": "Escolha de banco de dados",
  "storage-choice": "Escolha de armazenamento", "ci-cd": "CI/CD", iac: "Infraestrutura como código", "deployment-strategies": "Estratégias de deploy",
  containers: "Contêineres", troubleshooting: "Troubleshooting", "incident-response": "Resposta a incidentes", "threat-detection": "Detecção de ameaças",
  "identity-federation": "Federação de identidade", "shared-responsibility": "Responsabilidade compartilhada", "well-architected": "Well-Architected Framework",
  "cloud-concepts": "Conceitos de nuvem", "support-plans": "Planos de suporte", billing: "Faturamento", "ai-ml-basics": "Fundamentos de IA/ML",
  "generative-ai": "IA generativa", "prompt-engineering": "Engenharia de prompts", rag: "RAG", "fine-tuning": "Fine-tuning / customização",
  "responsible-ai": "IA responsável", "model-evaluation": "Avaliação de modelos", mlops: "MLOps", "feature-engineering": "Engenharia de features",
  "model-deployment": "Deploy de modelos", "model-monitoring": "Monitoramento de modelos", "data-quality": "Qualidade de dados",
  "data-governance": "Governança de dados", "api-design": "Design de APIs", secrets: "Gestão de segredos", "backup-restore": "Backup e restauração",
  automation: "Automação", patching: "Patching", tagging: "Tags e alocação de custos", "ai-strategy": "Estratégia de IA", "ai-roi": "Valor e ROI de IA",
  "change-management": "Gestão de mudança", "ai-governance": "Governança de IA", "agents-ai": "Agentes de IA", "llm-ops": "LLMOps / otimização de FMs",
  "data-modeling": "Modelagem de dados", "sql-tuning": "Tuning de banco de dados", "vpc-connectivity": "Conectividade entre VPCs",
  "identity-access": "Identidade e acesso", "data-protection": "Proteção de dados", "exam-strategy": "Estratégia de prova"
};

AWSPREP.levels = { foundational: "Foundational", associate: "Associate", professional: "Professional", specialty: "Specialty" };
