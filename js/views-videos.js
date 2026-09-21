/* Tela de vídeos: recomendados pelos seus erros (matching por metadados), trilha por domínio e busca. */
(function () {
  var A = window.AWSPREP, esc = A.esc, $ = A.$;

  A.route(/^#\/videos/, function () {
    var c = A.curCert(), st = A.store.get();
    var f = { scope: sessionStorage.getItem("v.scope") || "cert", lang: sessionStorage.getItem("v.lang") || "all", q: sessionStorage.getItem("v.q") || "" };
    if (!c) f.scope = "all";
    var h = "<h1>Vídeos</h1>";
    if (c) {
      var hasAtt = st.attempts.some(function (a) { return a.cert === c.id; });
      var rec = A.rec.forCert(c.id, "videos", 5).items;
      if (hasAtt && rec.length) {
        h += "<h2>Recomendados para você</h2><p class=\"small muted\">Casamento entre as tags (serviços e tópicos) das questões que você errou e as tags de cada vídeo — não há vínculo manual.</p>" +
          rec.map(function (r) { return A.videoCard(r.item, A.rec.whyText(r.why)); }).join("");
      } else if (!hasAtt) {
        h += '<div class="notice info">' + A.icon("info") + 'Faça um <a href="#/simulados">simulado</a> para receber vídeos indicados conforme seus erros.</div>';
      }
    }
    h += "<h2>Biblioteca</h2>";
    if (c) h += '<div class="tabs"><button data-s="cert" class="' + (f.scope === "cert" ? "on" : "") + '">' + esc(c.short) + '</button><button data-s="all" class="' + (f.scope === "all" ? "on" : "") + '">Todas as certificações</button></div>';
    h += '<div class="tabs"><button data-l="all" class="' + (f.lang === "all" ? "on" : "") + '">Todos os idiomas</button><button data-l="pt" class="' + (f.lang === "pt" ? "on" : "") + '">Português</button><button data-l="en" class="' + (f.lang === "en" ? "on" : "") + '">Inglês</button></div>' +
      '<input type="search" id="vq" placeholder="Buscar por serviço ou tópico…" value="' + esc(f.q) + '">';
    var q = f.q.toLowerCase();
    var vids = A.bank.videos.filter(function (v) {
      if (f.scope === "cert" && c && !(v.dom && v.dom[c.id])) return false;
      if (f.lang !== "all" && v.lang !== f.lang) return false;
      return !q || (v.title + " " + v.ch + " " + (v.svc || []).map(A.svcName).join(" ") + " " + (v.top || []).map(A.topicName).join(" ")).toLowerCase().indexOf(q) >= 0;
    });
    if (f.scope === "cert" && c) {
      c.domains.forEach(function (d, i) {
        var g = vids.filter(function (v) { return v.dom[c.id].indexOf(i + 1) >= 0; });
        if (g.length) h += "<h3>D" + (i + 1) + " · " + esc(d[0]) + ' <span class="muted small">(' + d[1] + "%)</span></h3>" + g.map(function (v) { return A.videoCard(v); }).join("");
      });
      var full = vids.filter(function (v) { return v.kind === "course"; });
      if (full.length) h += "<h3>Cursos completos</h3>" + full.map(function (v) { return A.videoCard(v); }).join("");
    } else {
      h += '<div style="margin-top:10px">' + vids.map(function (v) { return A.videoCard(v); }).join("") + "</div>";
    }
    if (!vids.length) h += '<p class="muted">Nenhum vídeo encontrado com esses filtros.</p>';
    h += '<p class="small muted">Vídeos são links para conteúdo público no YouTube de seus autores; nada é baixado ou hospedado aqui.</p>';
    A.render(h);
    A.$$("[data-s]").forEach(function (b) { b.addEventListener("click", function () { sessionStorage.setItem("v.scope", b.dataset.s); A.refresh(); }); });
    A.$$("[data-l]").forEach(function (b) { b.addEventListener("click", function () { sessionStorage.setItem("v.lang", b.dataset.l); A.refresh(); }); });
    $("#vq").addEventListener("change", function (e) { sessionStorage.setItem("v.q", e.target.value); A.refresh(); });
  });
})();
