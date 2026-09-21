/* Inicialização: valida integridade básica do banco e sobe a interface. */
(function () {
  var A = window.AWSPREP;
  // aviso em console se alguma tag não existir na taxonomia (ajuda a manter os metadados consistentes)
  var bad = {};
  ["lessons", "videos", "resources", "questions"].forEach(function (k) {
    A.bank[k].forEach(function (it) {
      (it.svc || it.s || []).forEach(function (s) { if (!A.services[s]) bad["svc:" + s] = 1; });
      (it.top || it.p || []).forEach(function (t) { if (!A.topics[t]) bad["top:" + t] = 1; });
    });
  });
  if (Object.keys(bad).length) console.warn("Tags fora da taxonomia:", Object.keys(bad).join(", "));
  A.boot();
})();
