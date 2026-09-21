/*
 * TRILHAS: visão que agrupa certificações por objetivo e acompanha o progresso do usuário
 * em cada uma delas, mesmo trocando a certificação em foco (seletor do topo).
 */
(function () {
  var A = window.AWSPREP, esc = A.esc, $ = A.$;

  var STATUS = {
    todo: { label: "Não iniciada", cls: "" },
    progress: { label: "Em andamento", cls: "svc" },
    ready: { label: "Pronta (simulado)", cls: "st-active" }
  };

  /* Progresso de uma certificação: lições/vídeos concluídos + histórico de simulados. */
  function certProgress(id) {
    var c = A.certById(id); if (!c) return null;
    var st = A.store.get();
    var lessons = A.bank.lessons.filter(function (l) { return l.dom && l.dom[id]; });
    var lDone = lessons.filter(function (l) { return st.lessonsDone[l.id]; }).length;
    var vids = A.bank.videos.filter(function (v) { return v.dom && v.dom[id]; });
    var vDone = vids.filter(function (v) { return st.videosDone[v.id]; }).length;
    var atts = st.attempts.filter(function (a) { return a.cert === id; }).map(A.summarize);
    var last = atts[atts.length - 1] || null;
    var bestPass = atts.some(function (s) { return s.pass; });
    var itemsTotal = lessons.length + vids.length, itemsDone = lDone + vDone;
    var studyPct = itemsTotal ? Math.round(100 * itemsDone / itemsTotal) : null;
    var status = bestPass ? "ready" : (atts.length || itemsDone) ? "progress" : "todo";
    return { cert: c, lessons: { done: lDone, total: lessons.length }, vids: { done: vDone, total: vids.length },
      attempts: atts.length, last: last, bestPass: bestPass, studyPct: studyPct, status: status };
  }
  A.trackCertProgress = certProgress;

  function trackOverview(t) {
    var progs = t.certs.map(certProgress).filter(Boolean);
    var pcts = progs.map(function (p) { return p.studyPct || 0; });
    var overall = pcts.length ? Math.round(pcts.reduce(function (a, b) { return a + b; }, 0) / pcts.length) : 0;
    var ready = progs.filter(function (p) { return p.status === "ready"; }).length;
    return { progs: progs, overall: overall, ready: ready };
  }

  function statusChip(p) { var s = STATUS[p.status]; return A.chip(p.cert.code.split(" ")[0] + " · " + s.label, s.cls); }

  /* ---------- lista de trilhas ---------- */
  A.route(/^#\/trilhas\/?$/, function () {
    var cur = A.curCert();
    var h = "<h1>Trilhas</h1><p class=\"muted\">Certificações agrupadas por objetivo profissional (nenhuma é pré-requisito da outra — é só uma ordem sugerida). " +
      "Acompanhe aqui seu progresso entre provas diferentes, mesmo trocando a certificação em foco no topo.</p>";
    h += '<div class="grid">' + A.tracks.map(function (t) {
      var ov = trackOverview(t);
      return '<a class="card" style="display:block;text-decoration:none;color:inherit" href="#/trilhas/' + t.id + '">' +
        '<div class="row" style="justify-content:space-between"><strong>' + A.icon("layers") + " " + esc(t.name) + '</strong>' +
        '<span class="small muted">' + ov.ready + "/" + ov.progs.length + " prontas</span></div>" +
        '<p class="small muted">' + esc(t.desc) + "</p>" + A.bar(ov.overall) +
        '<div style="margin-top:8px">' + ov.progs.map(function (p) {
          return statusChip(p) + (cur && p.cert.id === cur.id ? A.chip("em foco", "lvl-associate") : "");
        }).join("") + "</div></a>";
    }).join("") + "</div>";
    A.render(h);
  });

  /* ---------- detalhe de uma trilha ---------- */
  A.route(/^#\/trilhas\/([\w-]+)/, function (m) {
    var t = A.trackById(m[1]); if (!t) return A.go("#/trilhas");
    var cur = A.curCert(), ov = trackOverview(t);
    var h = '<a class="small" href="#/trilhas">' + A.icon("left") + " Trilhas</a><h1>" + A.icon("layers") + " " + esc(t.name) + "</h1><p class=\"muted\">" + esc(t.desc) + "</p>";
    h += '<div class="card"><div class="grid c3">' +
      '<div class="stat"><b>' + ov.progs.length + "</b><span>certificações na trilha</span></div>" +
      '<div class="stat"><b class="' + (ov.ready ? "pass" : "") + '">' + ov.ready + "</b><span>prontas (simulado &ge; nota mín.)</span></div>" +
      '<div class="stat"><b>' + ov.overall + "%</b><span>estudo concluído (média)</span></div></div></div>";

    ov.progs.forEach(function (p, i) {
      var c = p.cert, s = STATUS[p.status], isCur = cur && cur.id === c.id;
      h += '<div class="card">' +
        '<div class="row" style="justify-content:space-between"><strong>' + (i + 1) + ". " + esc(c.short) + "</strong>" + A.chip(s.label, s.cls) + "</div>" +
        '<div class="small muted">' + esc(c.code) + " · " + A.levels[c.level] + (isCur ? " · você está com o foco aqui" : "") + "</div>";
      h += '<div class="small" style="margin-top:8px">Lições: ' + p.lessons.done + "/" + p.lessons.total + "</div>" + A.bar(p.lessons.total ? 100 * p.lessons.done / p.lessons.total : 0, "ok") +
        '<div class="small" style="margin-top:6px">Vídeos: ' + p.vids.done + "/" + p.vids.total + "</div>" + A.bar(p.vids.total ? 100 * p.vids.done / p.vids.total : 0);
      if (p.last) {
        h += '<div class="small muted" style="margin-top:8px">Último simulado: <b class="' + (p.last.pass ? "pass" : "fail") + '">' + p.last.est + "</b>/1000 (mín. " + c.passing + ") · " + p.attempts + " simulado(s) feito(s)</div>";
      } else {
        h += '<div class="small muted" style="margin-top:8px">Nenhum simulado feito ainda.</div>';
      }
      h += '<div class="row" style="margin-top:10px"><button class="btn sm primary" data-focus="' + c.id + '">' + A.icon("target") + " Focar nesta</button>" +
        '<a class="btn sm" href="#/provas/' + c.id + '">Info da prova</a><a class="btn sm" href="#/simulados">Simulados</a></div></div>';
      if (i < ov.progs.length - 1) h += '<div class="center muted small" style="margin:-4px 0 12px">↓ próxima da trilha</div>';
    });
    A.render(h);
    A.$$("[data-focus]").forEach(function (b) { b.addEventListener("click", function () { A.setCertAndRefresh(b.dataset.focus); A.go("#/"); }); });
  });
})();
