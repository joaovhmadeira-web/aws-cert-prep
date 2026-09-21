/*
 * DADOS OFICIAIS DAS CERTIFICAÇÕES
 * Fonte: páginas aws.amazon.com/certification/* e exam guides oficiais (coletados em 2026-09-20).
 * Preços em USD (podem variar com impostos/câmbio). Confirme sempre no site da AWS antes de agendar.
 */
window.AWSPREP = window.AWSPREP || {};
AWSPREP.meta = { collectedAt: "2026-09-20", source: "https://aws.amazon.com/certification/" };

AWSPREP.general = {
  scoring: "Nota em escala de 100 a 1.000. A nota mínima é 700 (Foundational e AI Business Strategist), 720 (Associate) ou 750 (Professional e Specialty). Modelo compensatório: você precisa passar na prova como um todo, não em cada domínio. Questões em branco contam como erradas e não há penalidade por chute.",
  unscored: "Cada prova inclui questões não pontuadas (15 nas Foundational/Associate/Specialty e 10 nas Professional) usadas para calibrar futuras questões; elas não são identificadas na prova.",
  questionTypes: "Múltipla escolha (1 correta + 3 distratores) e múltipla resposta (2+ corretas em 5+ opções; só pontua se marcar todas as corretas). Algumas provas novas também usam formatos como ordenação e correspondência.",
  validity: "3 anos. Para renovar, faça novamente a mesma prova ou uma de nível superior. Passar em uma Professional renova as Associate correspondentes.",
  retake: "Reprovou? Aguarde 14 dias corridos para refazer. Depois de aprovado, não é possível refazer a mesma prova por 2 anos.",
  discount: "Ao passar em qualquer prova você ganha um voucher de 50% de desconto para a próxima (recertificação ou upgrade), disponível na seção Benefícios da conta AWS Certification. A AWS também faz promoções periódicas de vouchers.",
  accommodation: "Falantes não nativos de inglês que fazem a prova em inglês podem solicitar ESL +30 minutos (Accommodation Type = ESL +30 MINUTES) antes de agendar.",
  delivery: "Centro de testes Pearson VUE ou exame online supervisionado (com câmera, ambiente limpo e verificação de identidade). Idade mínima: 13 anos.",
  beta: "Exames beta têm desconto no preço e só liberam o resultado semanas depois; quem passa recebe a certificação normalmente (válida por 3 anos).",
  prerequisites: "Nenhuma certificação é pré-requisito para outra. A ordem Foundational → Associate → Professional/Specialty é apenas uma trilha sugerida.",
  levels: {
    foundational: "Visão de alto nível de nuvem, serviços e IA; sem experiência técnica exigida.",
    associate: "Cerca de 1 ano de experiência prática com a AWS; foco em implementar e operar.",
    professional: "2+ anos de experiência projetando/operando soluções na AWS; cenários longos e complexos.",
    specialty: "Profundidade técnica em uma área específica (segurança, redes, etc.)."
  },
  examDayTips: [
    "Leia a pergunta inteira e identifique a palavra-chave da restrição: mais barato, menor esforço operacional, mais resiliente, menor latência, mais seguro.",
    "Elimine primeiro as opções que violam algum requisito explícito; sobram normalmente duas plausíveis.",
    "Prefira soluções gerenciadas/serverless quando o enunciado pede 'menor sobrecarga operacional'.",
    "Marque questões difíceis para revisão e volte depois: nunca deixe em branco (não há penalidade por chute).",
    "Em múltipla resposta, o número de respostas certas é informado no enunciado (ex.: 'Escolha DUAS').",
    "Gerencie o tempo: nas provas de 130 min, ~2 min por questão; nas Professional (180 min / 75 q), ~2 min e meia."
  ]
};

AWSPREP.certs = [
  {
    id: "clf", code: "CLF-C02", name: "AWS Certified Cloud Practitioner", short: "Cloud Practitioner", level: "foundational", status: "active",
    guide: "CLF-C02", price: 100, durationMin: 90, totalQuestions: 65, scoredQuestions: 50, passing: 700, validityYears: 3,
    languages: ["Árabe", "Inglês", "Francês", "Alemão", "Italiano", "Japonês", "Coreano", "Português (Brasil)", "Espanhol", "Chinês"],
    who: "Pessoas sem experiência prévia em TI/nuvem, profissionais de negócio, vendas, gestão e quem começa a jornada AWS.",
    experience: "Nenhuma. Ideal: ~6 meses de exposição à nuvem AWS.",
    next: ["saa", "aif", "dva"],
    domains: [["Conceitos de Nuvem", 24], ["Segurança e Conformidade", 30], ["Tecnologia e Serviços de Nuvem", 34], ["Faturamento, Preços e Suporte", 12]],
    url: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
    guideUrl: "https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf",
    skillBuilder: "https://skillbuilder.aws/category/exam-prep/cloud-practitioner-foundational-CLF-C02",
    notes: ["Versão em italiano e alemão será descontinuada após 31/12/2026."]
  },
  {
    id: "aif", code: "AIF-C01", name: "AWS Certified AI Practitioner", short: "AI Practitioner", level: "foundational", status: "active",
    guide: "AIF-C01", price: 100, durationMin: 90, totalQuestions: 65, scoredQuestions: 50, passing: 700, validityYears: 3,
    languages: ["Árabe", "Inglês", "Francês", "Alemão", "Italiano", "Japonês", "Coreano", "Português (Brasil)", "Espanhol", "Chinês"],
    who: "Profissionais de nuvem, desenvolvimento, dados, TI ou negócios que querem validar fundamentos de IA, ML e IA generativa na AWS.",
    experience: "Nenhuma experiência em construir modelos é exigida; conhecimento básico de nuvem AWS ajuda.",
    next: ["mla", "aip", "aib"],
    domains: [["Fundamentos de IA e ML", 20], ["Fundamentos de IA Generativa", 24], ["Aplicações de Foundation Models", 28], ["Diretrizes de IA Responsável", 14], ["Segurança, Conformidade e Governança para IA", 14]],
    url: "https://aws.amazon.com/certification/certified-ai-practitioner/",
    guideUrl: "https://d1.awsstatic.com/training-and-certification/docs-ai-practitioner/AWS-Certified-AI-Practitioner_Exam-Guide.pdf",
    skillBuilder: "https://skillbuilder.aws/category/exam-prep/ai-practitioner-AIF-C01",
    notes: ["Versão em italiano e alemão será descontinuada após 15/10/2026."]
  },
  {
    id: "aib", code: "AIB-C01", name: "AWS Certified AI Business Strategist (beta)", short: "AI Business Strategist", level: "foundational", status: "beta",
    guide: "AIB-C01", price: 50, priceNote: "Preço beta (padrão: USD 100)", durationMin: 170, totalQuestions: 85, scoredQuestions: null, passing: 700, validityYears: 3,
    languages: ["Inglês", "Japonês"],
    who: "Gerentes de produto/programa, líderes de negócio, consultores, analistas e marketing que conduzem iniciativas de IA. Não exige código nem conhecimento de serviços AWS.",
    experience: "Nenhuma experiência em código ou implementação AWS.",
    next: ["aif"],
    domains: [["Fundamentos e Letramento em IA", 24], ["Estratégia de IA e Criação de Valor", 28], ["Governança de IA e Liderança em IA Responsável", 24], ["Prontidão de Negócio, Liderança e Transformação", 24]],
    url: "https://aws.amazon.com/certification/certified-ai-business-strategist/",
    guideUrl: "https://docs.aws.amazon.com/aws-certification/latest/ai-business-strategist-01/ai-business-strategist-01.html",
    skillBuilder: "https://skillbuilder.aws/category/exam-prep/ai-business-strategist-business-AIB-C01",
    notes: ["Exame em fase beta: categoria 'Business'. Não avalia conhecimento de serviços AWS.", "Sem simulado oficial durante o beta."]
  },
  {
    id: "saa", code: "SAA-C03", name: "AWS Certified Solutions Architect - Associate", short: "Solutions Architect Associate", level: "associate", status: "active",
    guide: "SAA-C03", price: 150, durationMin: 130, totalQuestions: 65, scoredQuestions: 50, passing: 720, validityYears: 3,
    languages: ["Inglês", "Francês", "Italiano", "Japonês", "Coreano", "Português (Brasil)", "Espanhol", "Chinês"],
    who: "Quem projeta soluções otimizadas em custo e desempenho; ponto de partida para quem vem de TI on-premises ou da nuvem AWS.",
    experience: "~1 ano projetando soluções na AWS; não exige experiência profunda em código.",
    next: ["sap", "scs", "ans"],
    domains: [["Projetar Arquiteturas Seguras", 30], ["Projetar Arquiteturas Resilientes", 26], ["Projetar Arquiteturas de Alto Desempenho", 24], ["Projetar Arquiteturas com Custo Otimizado", 20]],
    url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    guideUrl: "https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf",
    skillBuilder: "https://skillbuilder.aws/category/exam-prep/solutions-architect-associate-SAA-C03",
    notes: ["A prova usa nomes abreviados de serviços; há uma lista de nomes curtos no botão Ajuda durante o exame.", "Versão em italiano será descontinuada após 31/12/2026."]
  },
  {
    id: "dva", code: "DVA-C02", name: "AWS Certified Developer - Associate", short: "Developer Associate", level: "associate", status: "updating",
    guide: "DVA-C02", price: 150, durationMin: 130, totalQuestions: 65, scoredQuestions: 50, passing: 720, validityYears: 3,
    languages: ["Inglês", "Japonês", "Coreano", "Português (Brasil)", "Chinês simplificado", "Espanhol (América Latina)"],
    who: "Desenvolvedores que criam, testam, implantam e depuram aplicações na nuvem AWS.",
    experience: "~1 ano de experiência desenvolvendo e mantendo aplicações com serviços AWS.",
    next: ["dop"],
    domains: [["Desenvolvimento com Serviços AWS", 32], ["Segurança", 26], ["Deploy", 24], ["Troubleshooting e Otimização", 18]],
    url: "https://aws.amazon.com/certification/certified-developer-associate/",
    guideUrl: "https://d1.awsstatic.com/training-and-certification/docs-dev-associate/AWS-Certified-Developer-Associate_Exam-Guide.pdf",
    skillBuilder: "https://skillbuilder.aws/category/exam-prep/developer-associate-DVA-C02",
    notes: ["ATUALIZAÇÃO: inscrições para DVA-C03 abrem em 27/10/2026. Último dia para o DVA-C02: 01/12/2026."]
  },
  {
    id: "soa", code: "SOA-C03", name: "AWS Certified CloudOps Engineer - Associate", short: "CloudOps Engineer Associate", level: "associate", status: "active",
    guide: "SOA-C03", price: 150, durationMin: 130, totalQuestions: 65, scoredQuestions: 50, passing: 720, validityYears: 3,
    languages: ["Inglês", "Japonês", "Coreano", "Chinês simplificado"],
    who: "Engenheiros de operações/CloudOps, suporte, consultores e especialistas em migração que implantam, gerenciam e operam workloads. Antiga certificação SysOps Administrator.",
    experience: "~1 ano implantando, gerenciando e operando workloads na AWS.",
    next: ["dop", "scs", "ans"],
    domains: [["Monitoramento, Logging, Análise, Remediação e Otimização de Performance", 22], ["Confiabilidade e Continuidade de Negócios", 22], ["Deploy, Provisionamento e Automação", 22], ["Segurança e Conformidade", 16], ["Redes e Entrega de Conteúdo", 18]],
    url: "https://aws.amazon.com/certification/certified-cloudops-engineer-associate/",
    guideUrl: "https://docs.aws.amazon.com/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03.html",
    skillBuilder: "https://skillbuilder.aws/category/exam-prep/cloudops-engineer-associate-SOA-C03",
    notes: ["Substitui o SysOps Administrator (SOA-C02). Chinês simplificado e coreano serão descontinuados após 19/11/2026."]
  },
  {
    id: "dea", code: "DEA-C01", name: "AWS Certified Data Engineer - Associate", short: "Data Engineer Associate", level: "associate", status: "active",
    guide: "DEA-C01", price: 150, durationMin: 130, totalQuestions: 65, scoredQuestions: 50, passing: 720, validityYears: 3,
    languages: ["Inglês", "Japonês", "Coreano", "Chinês simplificado"],
    who: "Engenheiros de dados: ingestão e transformação, orquestração de pipelines, modelagem, ciclo de vida e qualidade de dados.",
    experience: "2-3 anos em engenharia de dados e 1-2 anos com serviços AWS de dados.",
    next: ["mla", "scs"],
    domains: [["Ingestão e Transformação de Dados", 34], ["Gerenciamento de Armazenamento de Dados", 26], ["Operações e Suporte de Dados", 22], ["Segurança e Governança de Dados", 18]],
    url: "https://aws.amazon.com/certification/certified-data-engineer-associate/",
    guideUrl: "https://d1.awsstatic.com/training-and-certification/docs-data-engineer-associate/AWS-Certified-Data-Engineer-Associate_Exam-Guide.pdf",
    skillBuilder: "https://skillbuilder.aws/category/exam-prep/data-engineer-associate-DEA-C01",
    notes: []
  },
  {
    id: "mla", code: "MLA-C01 / MLA-C02", name: "AWS Certified Machine Learning Engineer - Associate", short: "ML Engineer Associate", level: "associate", status: "updating",
    guide: "MLA-C02", price: 150, priceNote: "MLA-C02 beta: USD 75", durationMin: 130, totalQuestions: 65, scoredQuestions: 50, passing: 720, validityYears: 3,
    variants: [
      { code: "MLA-C01 (atual)", durationMin: 130, totalQuestions: 65, price: 150, note: "Último dia em inglês: 28/09/2026. Segue em coreano, japonês e chinês até o lançamento geral do C02." },
      { code: "MLA-C02 (beta)", durationMin: 170, totalQuestions: 85, price: 75, note: "Somente em inglês durante o beta; inclui Bedrock e fluxos de IA/FMs." }
    ],
    languages: ["Inglês", "Japonês", "Coreano", "Chinês simplificado"],
    who: "Engenheiros de ML/MLOps/LLMOps, engenheiros de dados, desenvolvedores back-end e cientistas de dados que colocam ML em produção.",
    experience: "≥1 ano com Amazon SageMaker AI, Bedrock e outros serviços de engenharia de ML.",
    next: ["aip"],
    domains: [["Preparação de Dados para ML e IA", 28], ["Desenvolvimento de Modelos de ML e Foundation Models", 24], ["Deploy e Orquestração de Workflows de ML e IA", 24], ["Operação, Monitoramento e Segurança de Soluções de ML e IA", 24]],
    url: "https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/",
    guideUrl: "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-02/machine-learning-engineer-associate-02.html",
    skillBuilder: "https://skillbuilder.aws/category/exam-prep/machine-learning-engineer-associate-MLA-C02",
    notes: ["Pesos acima seguem o guia MLA-C02 (28/24/24/24). No MLA-C01 eram 28/26/22/24.", "ATENÇÃO: o MLA-C01 em inglês encerra em 28/09/2026."]
  },
  {
    id: "sap", code: "SAP-C02", name: "AWS Certified Solutions Architect - Professional", short: "Solutions Architect Professional", level: "professional", status: "updating",
    guide: "SAP-C02", price: 300, durationMin: 180, totalQuestions: 75, scoredQuestions: 65, passing: 750, validityYears: 3,
    languages: ["Inglês", "Japonês", "Coreano", "Português (Brasil)", "Chinês simplificado", "Espanhol (América Latina)"],
    who: "Arquitetos com experiência avançada em soluções complexas: otimização de segurança, custo e desempenho, e automação de processos manuais.",
    experience: "2+ anos de experiência projetando e implantando soluções na nuvem AWS.",
    next: [],
    domains: [["Soluções para Complexidade Organizacional", 26], ["Projetar Novas Soluções", 29], ["Melhoria Contínua de Soluções Existentes", 25], ["Acelerar Migração e Modernização de Workloads", 20]],
    url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/",
    guideUrl: "https://d1.awsstatic.com/training-and-certification/docs-sa-pro/AWS-Certified-Solutions-Architect-Professional_Exam-Guide.pdf",
    skillBuilder: "https://skillbuilder.aws/category/exam-prep/solutions-architect-professional-SAP-C02",
    notes: ["ATUALIZAÇÃO: inscrições para SAP-C03 abrem em 27/10/2026. Último dia para o SAP-C02: 17/11/2026."]
  },
  {
    id: "dop", code: "DOP-C02", name: "AWS Certified DevOps Engineer - Professional", short: "DevOps Engineer Professional", level: "professional", status: "active",
    guide: "DOP-C02", price: 300, durationMin: 180, totalQuestions: 75, scoredQuestions: 65, passing: 750, validityYears: 3,
    languages: ["Inglês", "Japonês", "Coreano", "Chinês simplificado"],
    who: "Profissionais DevOps com experiência avançada em provisionamento, operação e gestão de sistemas distribuídos na AWS.",
    experience: "2+ anos provisionando, operando e gerenciando ambientes AWS.",
    next: [],
    domains: [["Automação do SDLC", 22], ["Gerenciamento de Configuração e IaC", 17], ["Soluções de Nuvem Resilientes", 15], ["Monitoramento e Logging", 15], ["Resposta a Incidentes e Eventos", 14], ["Segurança e Conformidade", 17]],
    url: "https://aws.amazon.com/certification/certified-devops-engineer-professional/",
    guideUrl: "https://d1.awsstatic.com/training-and-certification/docs-devops-pro/AWS-Certified-DevOps-Engineer-Professional_Exam-Guide.pdf",
    skillBuilder: "https://skillbuilder.aws/category/exam-prep/devops-engineer-professional-DOP-C02",
    notes: ["Versão em coreano será descontinuada após 31/12/2026."]
  },
  {
    id: "aip", code: "AIP-C01", name: "AWS Certified Generative AI Developer - Professional", short: "GenAI Developer Professional", level: "professional", status: "active",
    guide: "AIP-C01", price: 300, durationMin: 180, totalQuestions: 75, scoredQuestions: 65, passing: 750, validityYears: 3,
    languages: ["Inglês", "Japonês", "Coreano", "Chinês simplificado"],
    who: "Desenvolvedores com 2+ anos de nuvem que constroem e implantam soluções de IA generativa prontas para produção com Amazon Bedrock e outros serviços.",
    experience: "2+ anos de nuvem e experiência prática integrando FMs em aplicações.",
    next: [],
    domains: [["Integração de Foundation Models, Gestão de Dados e Conformidade", 31], ["Implementação e Integração", 26], ["Segurança, Proteção e Governança de IA", 20], ["Eficiência Operacional e Otimização de Apps GenAI", 12], ["Testes, Validação e Troubleshooting", 11]],
    url: "https://aws.amazon.com/certification/certified-generative-ai-developer-professional/",
    guideUrl: "https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html",
    skillBuilder: "https://skillbuilder.aws/category/exam-prep/generative-ai-developer-professional-AIP-C01",
    notes: []
  },
  {
    id: "scs", code: "SCS-C03", name: "AWS Certified Security - Specialty", short: "Security Specialty", level: "specialty", status: "active",
    guide: "SCS-C03", price: 300, durationMin: 170, totalQuestions: 65, scoredQuestions: 50, passing: 750, validityYears: 3,
    languages: ["Inglês", "Japonês", "Coreano", "Português (Brasil)", "Chinês simplificado", "Espanhol (América Latina)"],
    who: "Profissionais de segurança que criam e implementam soluções de segurança, proteção de dados, criptografia e protocolos seguros na AWS.",
    experience: "5+ anos em segurança de TI e 2+ anos com workloads AWS.",
    next: [],
    domains: [["Detecção", 16], ["Resposta a Incidentes", 14], ["Segurança de Infraestrutura", 18], ["Gerenciamento de Identidade e Acesso", 20], ["Proteção de Dados", 18], ["Fundamentos e Governança de Segurança", 14]],
    url: "https://aws.amazon.com/certification/certified-security-specialty/",
    guideUrl: "https://docs.aws.amazon.com/aws-certification/latest/security-specialty-03/security-specialty-03.html",
    skillBuilder: "https://skillbuilder.aws/category/exam-prep/security-specialty-SCS-C03",
    notes: ["SCS-C03 substituiu o SCS-C02 (encerrado em 01/12/2025).", "Versões em chinês, espanhol e português (Brasil) serão descontinuadas após 31/12/2026."]
  },
  {
    id: "ans", code: "ANS-C01", name: "AWS Certified Advanced Networking - Specialty", short: "Advanced Networking Specialty", level: "specialty", status: "retiring",
    guide: "ANS-C01", price: 300, durationMin: 170, totalQuestions: 65, scoredQuestions: 50, passing: 750, validityYears: 3,
    languages: ["Inglês", "Japonês", "Coreano", "Chinês simplificado"],
    who: "Engenheiros de rede que projetam, implementam e operam redes complexas e críticas na AWS e híbridas.",
    experience: "5+ anos em redes e 2+ anos com redes AWS.",
    next: [],
    domains: [["Design de Rede", 30], ["Implementação de Rede", 26], ["Gerenciamento e Operação de Rede", 20], ["Segurança, Conformidade e Governança de Rede", 24]],
    url: "https://aws.amazon.com/certification/certified-advanced-networking-specialty/",
    guideUrl: "https://d1.awsstatic.com/training-and-certification/docs-advnetworking-spec/AWS-Certified-Advanced-Networking-Specialty_Exam-Guide.pdf",
    skillBuilder: "https://skillbuilder.aws/category/exam-prep/advanced-networking-specialty-ANS-C01",
    notes: ["DESCONTINUADA: último dia para fazer o exame é 31/12/2026. Certificações já obtidas permanecem ativas pelos 3 anos padrão; novas não serão emitidas depois disso."]
  }
];

AWSPREP.certById = function (id) { return AWSPREP.certs.find(function (c) { return c.id === id; }); };
