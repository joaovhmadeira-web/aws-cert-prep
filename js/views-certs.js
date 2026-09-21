/* Telas: Provas (informações oficiais), Estudar (lições) e Materiais oficiais. */
(function () {
  var A = window.AWSPREP, esc = A.esc, $ = A.$;
  var money = function (c) { return "US$ " + c.price + (c.priceNote ? "*" : ""); };

  /* ---------- PROVAS: lista + comparativo ---------- */
  A.route(/^#\/provas\/?$/, function () {
    var lv = sessionStorage.getItem("prov.lv") || "all";
    var list = A.certs.filter(function (c) { return lv === "all" || c.level === lv; });
    var h = "<h1>Certificações AWS</h1><p class=\"muted\">Dados oficiais coletados em " + esc(A.meta.collectedAt) + ' em <a target="_blank" rel="noopener" href="' + A.meta.source + '">aws.amazon.com/certification</a>. Preços em USD; podem variar com impostos e câmbio.</p>';
    h += '<div class="tabs" id="lvTabs">' + [["all", "Todas"]].concat(Object.keys(A.levels).map(function (k) { return [k, A.levels[k]]; })).map(function (t) {
      return '<button data-lv="' + t[0] + '" class="' + (lv === t[0] ? "on" : "") + '">' + t[1] + "</button>";
    }).join("") + "</div>";
    h += '<div class="card"><h3>Comparativo</h3><div class="tbl"><table><thead><tr><th>Prova</th><th>Nível</th><th>Preço</th><th>Duração</th><th>Questões</th><th>Nota mín.</th><th>Validade</th></tr></thead><tbody>' +
      list.map(function (c) {
        return '<tr><td><a href="#/provas/' + c.id + '"><b>' + esc(c.short) + "</b></a><br><span class=\"muted small\">" + esc(c.code) + "</span></td><td>" + A.levels[c.level] + "</td><td>" + money(c) + "</td><td>" + c.durationMin + " min</td><td>" +
          c.totalQuestions + (c.scoredQuestions ? " <span class=\"muted small\">(" + c.scoredQuestions + " pontuam)</span>" : "") + "</td><td>" + c.passing + "/1000</td><td>" + c.validityYears + " anos</td></tr>";
      }).join("") + '</tbody></table></div><p class="small muted">* preço beta ou variante; veja o detalhe de cada prova.</p></div>';
    h += '<div class="grid c2">' + list.map(function (c) {
      return '<a class="card" style="text-decoration:none;color:inherit" href="#/provas/' + c.id + '"><strong>' + esc(c.name) + "</strong><div>" + A.certBadges(c) + '</div><p class="small muted">' + esc(c.who) + "</p></a>";
    }).join("") + "</div>";
    var g = A.general;
    h += '<h2>Regras gerais de todas as provas</h2><div class="card prose">' + A.md(
      "- **Pontuação:** " + g.scoring + "\n- **Questões não pontuadas:** " + g.unscored + "\n- **Tipos de questão:** " + g.questionTypes + "\n- **Validade e renovação:** " + g.validity +
      "\n- **Reprovação / refazer:** " + g.retake + "\n- **Descontos:** " + g.discount + "\n- **Tempo extra (ESL):** " + g.accommodation + "\n- **Onde fazer:** " + g.delivery + "\n- **Exames beta:** " + g.beta + "\n- **Pré-requisitos:** " + g.prerequisites) + "</div>";
    h += '<h2>Dicas para o dia da prova</h2><div class="card"><ul>' + g.examDayTips.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div>";
    A.render(h);
    A.$$("#lvTabs button").forEach(function (b) { b.addEventListener("click", function () { sessionStorage.setItem("prov.lv", b.dataset.lv); A.refresh(); }); });
  });

  /* ---------- PROVAS: detalhe ---------- */
  A.route(/^#\/provas\/([a-z]+)/, function (m) {
    var c = A.certById(m[1]); if (!c) return A.go("#/provas");
    var guide = A.guides[c.guide] || [];
    var h = '<a class="small" href="#/provas">' + A.icon("left") + ' Todas as provas</a><h1>' + esc(c.name) + '</h1><div>' + A.certBadges(c) + A.chip(c.code) + "</div>";
    (c.notes || []).forEach(function (n) { h += '<div class="notice">' + A.icon(/ATUALIZA|DESCONTINUADA|ATENÇÃO/.test(n) ? "alert" : "info") + esc(n) + "</div>"; });
    h += '<div class="card"><dl class="kv"><dt>Preço</dt><dd>US$ ' + c.price + esc(c.priceNote ? " — " + c.priceNote : "") + "</dd><dt>Duração</dt><dd>" + c.durationMin + " minutos</dd>" +
      "<dt>Questões</dt><dd>" + c.totalQuestions + (c.scoredQuestions ? " (" + c.scoredQuestions + " pontuadas + " + (c.totalQuestions - c.scoredQuestions) + " não pontuadas)" : "") + "</dd>" +
      "<dt>Formato</dt><dd>Múltipla escolha e múltipla resposta</dd><dt>Escala de nota</dt><dd>100–1.000 · mínimo <b>" + c.passing + "</b></dd><dt>Validade</dt><dd>" + c.validityYears + " anos</dd>" +
      "<dt>Aplicação</dt><dd>Pearson VUE (presencial) ou online supervisionado</dd><dt>Idiomas</dt><dd>" + esc(c.languages.join(", ")) + "</dd><dt>Experiência sugerida</dt><dd>" + esc(c.experience) + "</dd></dl></div>";
    if (c.variants) {
      h += '<div class="card"><h3>Versões disponíveis</h3>' + c.variants.map(function (v) {
        return "<p><b>" + esc(v.code) + "</b> — " + v.durationMin + " min, " + v.totalQuestions + " questões, US$ " + v.price + '<br><span class="small muted">' + esc(v.note) + "</span></p>";
      }).join("") + "</div>";
    }
    h += '<div class="card"><h3>Para quem é</h3><p>' + esc(c.who) + "</p></div>";
    h += '<div class="card"><h3>Domínios e pesos</h3>' + c.domains.map(function (d, i) {
      var tasks = guide.filter(function (t) { return t.domain === i + 1; });
      return '<details style="margin:8px 0"><summary style="cursor:pointer;min-height:44px;display:flex;align-items:center;gap:8px"><b>D' + (i + 1) + "</b> " + esc(d[0]) + ' <span class="muted">— ' + d[1] + "%</span></summary>" + A.bar(d[1] * 2.5) +
        (tasks.length ? "<ul>" + tasks.map(function (t) {
          return "<li><b>" + t.id + "</b> " + esc(t.title) + ((t.skills.length || t.knowledge.length) ? '<details><summary class="small muted" style="cursor:pointer">habilidades e conhecimentos</summary><ul class="small">' +
            t.knowledge.concat(t.skills).slice(0, 14).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul></details>" : "") + "</li>";
        }).join("") + "</ul>" : '<p class="small muted">Detalhes de tarefas no guia oficial.</p>') + "</details>";
    }).join("") + "</div>";
    if (c.next && c.next.length) h += '<div class="card"><h3>Próximos passos na trilha</h3>' + c.next.map(function (id) { var n = A.certById(id); return '<a class="btn sm" href="#/provas/' + id + '">' + esc(n.short) + "</a> "; }).join("") + "</div>";
    h += '<div class="card"><h3>Links oficiais</h3><div class="row"><a class="btn sm accent" target="_blank" rel="noopener" href="' + c.url + '">Página da prova ' + A.icon("ext") + '</a><a class="btn sm" target="_blank" rel="noopener" href="' + c.guideUrl + '">Exam guide ' + A.icon("ext") + '</a>' +
      '<a class="btn sm" target="_blank" rel="noopener" href="' + c.skillBuilder + '">Plano no Skill Builder ' + A.icon("ext") + '</a><a class="btn sm" target="_blank" rel="noopener" href="https://aws.amazon.com/certification/policies/before-testing/">Políticas ' + A.icon("ext") + '</a></div></div>';
    h += '<div class="grid c3"><button class="btn primary" id="focusBtn">' + A.icon("target") + ' Estudar esta certificação</button><a class="btn" href="#/videos">' + A.icon("play") + ' Vídeos</a><a class="btn" href="#/simulados">' + A.icon("exam") + ' Simulados</a></div>';
    A.render(h);
    $("#focusBtn").addEventListener("click", function () { A.setCertAndRefresh(c.id); A.go("#/"); });
  });

  /* ---------- ESTUDAR: lista de lições ---------- */
  A.route(/^#\/estudar\/?$/, function () {
    var c = A.curCert();
    if (!c) return A.render('<h1>Estudar</h1><div class="card"><p>Escolha uma certificação no seletor acima para ver o conteúdo.</p><a class="btn" href="#/provas">Ver provas</a></div>');
    var dom = +(sessionStorage.getItem("st.dom") || 0), q = (sessionStorage.getItem("st.q") || "").toLowerCase();
    var all = A.bank.lessons.filter(function (l) { return l.dom && l.dom[c.id]; });
    var list = all.filter(function (l) {
      return (!dom || l.dom[c.id].indexOf(dom) >= 0) && (!q || (l.title + " " + (l.svc || []).map(A.svcName).join(" ") + " " + (l.top || []).map(A.topicName).join(" ")).toLowerCase().indexOf(q) >= 0);
    });
    list.sort(function (a, b) { return a.dom[c.id][0] - b.dom[c.id][0] || (a.ord || 0) - (b.ord || 0); });
    var h = "<h1>Estudar</h1><div class=\"row\" style=\"justify-content:space-between\"><span class=\"muted\">" + esc(c.short) + ' · <a href="#/materiais">materiais oficiais</a></span><span class="small muted">' + all.length + " lições</span></div>";
    h += '<div class="tabs" id="domTabs"><button data-d="0" class="' + (!dom ? "on" : "") + '">Todos</button>' + c.domains.map(function (d, i) {
      return '<button data-d="' + (i + 1) + '" class="' + (dom === i + 1 ? "on" : "") + '">D' + (i + 1) + " · " + esc(d[0].split(" ").slice(0, 2).join(" ")) + "</button>";
    }).join("") + "</div>" + '<input type="search" id="stQ" placeholder="Buscar serviço ou tópico…" value="' + esc(q) + '">';
    if (!all.length) h += '<div class="notice">Ainda não há lições para esta certificação.</div>';
    h += '<div style="margin-top:12px">' + list.map(function (l) { return A.lessonCard(l, null, c.id); }).join("") + "</div>";
    if (all.length && !list.length) h += '<p class="muted">Nada encontrado.</p>';
    A.render(h);
    A.$$("#domTabs button").forEach(function (b) { b.addEventListener("click", function () { sessionStorage.setItem("st.dom", b.dataset.d); A.refresh(); }); });
    $("#stQ").addEventListener("change", function (e) { sessionStorage.setItem("st.q", e.target.value); A.refresh(); });
  });

  /* ---------- ESTUDAR: lição ---------- */
  A.route(/^#\/estudar\/([\w-]+)/, function (m) {
    var l = A.bank.lessons.filter(function (x) { return x.id === m[1]; })[0];
    if (!l) return A.go("#/estudar");
    var c = A.curCert(), certId = (c && l.dom[c.id]) ? c.id : Object.keys(l.dom)[0], done = A.store.has("lessonsDone", l.id);
    // recomendações por matching de metadados usando as tags da própria lição
    var prof = A.rec.profileFromQuestion({ cert: certId, d: (l.dom[certId] || [1])[0], s: l.svc, p: l.top });
    var vids = A.bank.videos.filter(function (v) { return v.dom && v.dom[certId]; }).map(function (v) { return A.rec.scoreItem(v, prof, certId, { lang: A.store.get().profile.lang, done: A.store.get().videosDone }); }).filter(Boolean).sort(function (a, b) { return b.score - a.score; }).slice(0, 3);
    var qs = A.quizBank(certId).filter(function (q) { return q.s.some(function (s) { return (l.svc || []).indexOf(s) >= 0; }) || q.p.some(function (t) { return (l.top || []).indexOf(t) >= 0; }); });
    var h = '<a class="small" href="#/estudar">' + A.icon("left") + ' Lições</a><h1>' + esc(l.title) + '</h1><div class="small muted">' + l.min + " min · " + Object.keys(l.dom).map(function (k) { return k.toUpperCase() + " D" + l.dom[k].join(",D"); }).join(" · ") + "</div><div>" + A.tagChips(l, 8) + "</div>";
    h += '<div class="card prose">' + A.md(l.body) + "</div>";
    h += '<div class="row"><button class="btn ' + (done ? "" : "primary") + '" id="doneBtn">' + (done ? "Concluída (desmarcar)" : "Marcar como concluída") + "</button>" +
      (qs.length ? '<button class="btn accent" id="qzBtn">Praticar ' + Math.min(10, qs.length) + " questões deste tema</button>" : "") + "</div>";
    if (vids.length) h += "<h2>Vídeos relacionados</h2>" + vids.map(function (r) { return A.videoCard(r.item, A.rec.whyText(r.why)); }).join("");
    A.render(h);
    $("#doneBtn").addEventListener("click", function () { A.store.toggle("lessonsDone", l.id); A.refresh(); });
    var qb = $("#qzBtn");
    if (qb) qb.addEventListener("click", function () { A.startCustomQuiz(certId, qs, "practice"); });
  });

  /* ---------- MATERIAIS oficiais ---------- */
  A.route(/^#\/materiais/, function () {
    var c = A.curCert();
    var all = A.bank.resources.filter(function (r) { return !c || (r.dom && r.dom[c.id]) || r.dom && r.dom["*"]; });
    var types = {};
    all.forEach(function (r) { (types[r.type] = types[r.type] || []).push(r); });
    var h = '<a class="small" href="#/estudar">' + A.icon("left") + ' Lições</a><h1>Materiais oficiais e gratuitos</h1><p class="muted">Documentação, whitepapers, cursos do Skill Builder e labs' + (c ? " para " + esc(c.short) : "") + ".</p>";
    if (c) {
      var rr = A.rec.forCert(c.id, "resources", 4).items;
      if (rr.length) h += "<h2>Recomendados para você</h2>" + rr.map(function (r) { return A.resourceCard(r.item, A.rec.whyText(r.why)); }).join("");
    }
    Object.keys(types).forEach(function (t) { h += "<h2>" + esc(t) + "</h2>" + types[t].map(function (r) { return A.resourceCard(r); }).join(""); });
    if (!all.length) h += '<div class="notice">Nenhum material cadastrado para esta certificação.</div>';
    A.render(h);
  });
})();
