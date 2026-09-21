/*
 * Lista ordenada de todos os scripts carregados pelo index.html (e pré-cacheados pelo service worker).
 * Para adicionar conteúdo novo, crie o arquivo em data/ e inclua-o aqui. Incremente DATA_VERSION ao publicar.
 */
var G = typeof window !== "undefined" ? window : self;
G.DATA_VERSION = "2026.09.20-5";
G.DATA_FILES = [
  "data/taxonomy.js", "data/certs.js", "data/guides.js", "data/tracks.js", "data/service-icons.js",
  "js/lib.js", "js/recommender.js", "js/quiz.js",
  "data/study/core-foundations.js", "data/study/core-compute-storage.js", "data/study/core-serverless-devops.js",
  "data/questions/saa.js", "data/questions/clf.js", "data/questions/aif.js", "data/questions/aib.js",
  "data/questions/dva.js", "data/questions/soa.js", "data/questions/dea.js",
  "data/questions/mla.js", "data/questions/sap.js", "data/questions/dop.js",
  "data/questions/aip.js", "data/questions/scs.js", "data/questions/ans.js",
  "data/videos.js", "data/resources.js",
  /*DATA*/
  "js/ui.js", "js/views-certs.js", "js/views-quiz.js", "js/views-videos.js", "js/views-tracks.js", "js/main.js"
];
