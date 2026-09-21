/*
 * TRILHAS
 * Agrupamentos de certificações por objetivo profissional (não são pré-requisito entre si,
 * ver AWSPREP.general.prerequisites). Uma mesma prova pode aparecer em mais de uma trilha.
 * Usadas em #/trilhas para comparar o progresso do usuário entre certificações diferentes.
 */
window.AWSPREP = window.AWSPREP || {};
AWSPREP.tracks = [
  { id: "fundamentos", name: "Fundamentos", desc: "Base de nuvem e de IA para quem está começando.", certs: ["clf", "aif"] },
  { id: "arquitetura", name: "Arquitetura de Soluções", desc: "Projetar, evoluir e otimizar arquiteturas na AWS.", certs: ["clf", "saa", "sap"] },
  { id: "dev-devops", name: "Desenvolvimento & DevOps", desc: "Construir, implantar e automatizar aplicações na nuvem.", certs: ["clf", "dva", "dop"] },
  { id: "operacoes", name: "Operações em Nuvem", desc: "Monitorar, automatizar e manter workloads em produção.", certs: ["clf", "soa", "dop"] },
  { id: "dados", name: "Dados & Machine Learning", desc: "Pipelines, armazenamento, engenharia e ML de ponta a ponta.", certs: ["clf", "dea", "mla"] },
  { id: "ia-generativa", name: "Inteligência Artificial", desc: "Do letramento em IA a soluções generativas em produção.", certs: ["aif", "aib", "mla", "aip"] },
  { id: "seguranca", name: "Segurança", desc: "Proteção, detecção e resposta a incidentes na nuvem.", certs: ["clf", "saa", "scs"] },
  { id: "redes", name: "Redes Avançadas", desc: "Conectividade híbrida e redes complexas e críticas.", certs: ["saa", "ans"] }
];
AWSPREP.trackById = function (id) { return AWSPREP.tracks.find(function (t) { return t.id === id; }); };
