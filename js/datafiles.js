/*
 * Lista ordenada de todos os scripts carregados pelo index.html (e pré-cacheados pelo service worker).
 * Para adicionar conteúdo novo, crie o arquivo em data/ e inclua-o aqui. Incremente DATA_VERSION ao publicar.
 */
var G = typeof window !== "undefined" ? window : self;
G.DATA_VERSION = "2026.09.20-1";
G.DATA_FILES = [
  "data/taxonomy.js", "data/certs.js", "data/guides.js",
  "js/lib.js", "js/recommender.js", "js/quiz.js",
  "data/study/core-foundations.js", "data/study/core-compute-storage.js", "data/study/core-serverless-devops.js",
  "data/questions/saa.js",
  /*DATA*/
  "js/ui.js", "js/views-certs.js", "js/views-quiz.js", "js/views-videos.js", "js/main.js"
];
