/* Shell, roteador por hash (compatível com GitHub Pages), componentes compartilhados e painel. */
(function () {
  var A = window.AWSPREP, esc = A.esc, $ = A.$;
  var routes = [];
  A.route = function (re, fn) { routes.push([re, fn]); };
  A.go = function (h) { location.hash = h; };

  var TABS = [["#/", "home", "Início", /^#\/?$/], ["#/trilhas", "layers", "Trilhas", /^#\/trilhas/], ["#/provas", "clipboard", "Provas", /^#\/provas/], ["#/estudar", "book", "Estudar", /^#\/(estudar|materiais)/],
              ["#/simulados", "exam", "Simulados", /^#\/simulados/], ["#/videos", "play", "Vídeos", /^#\/videos/]];

  A.render = function (html) { $("#app").innerHTML = '<div class="wrap">' + html + "</div>"; window.scrollTo(0, 0); };
  A.curCert = function () { var id = A.store.get().profile.cert; return id ? A.certById(id) : null; };

  /* ---------- componentes ---------- */
  A.chip = function (t, cls) { return '<span class="chip ' + (cls || "") + '">' + esc(t) + "</span>"; };
  A.bar = function (pct, cls) { return '<div class="bar ' + (cls || "") + '"><i style="width:' + Math.max(0, Math.min(100, pct)) + '%"></i></div>'; };
  A.certBadges = function (c) {
    return A.chip(A.levels[c.level], "lvl-" + c.level) + ({ active: "", retiring: A.chip("Sendo descontinuada", "st-retiring"), updating: A.chip("Nova versão a caminho", "st-updating"), beta: A.chip("Beta", "st-beta") }[c.status] || "");
  };
  A.tagChips = function (item, max) {
    var out = [];
    (item.svc || []).slice(0, max || 4).forEach(function (s) { out.push('<span class="chip svc">' + A.svcIcon(s) + esc(A.svcName(s)) + "</span>"); });
    (item.top || []).slice(0, 2).forEach(function (t) { out.push(A.chip(A.topicName(t))); });
    return out.join("");
  };
  A.domainName = function (cert, d) { var c = A.certById(cert); return c && c.domains[d - 1] ? c.domains[d - 1][0] : "Domínio " + d; };

  A.videoCard = function (v, why) {
    var done = A.store.has("videosDone", v.id);
    return '<div class="card"><div class="vcard"><button class="vthumb" data-play="' + v.id + '" aria-label="Assistir ' + esc(v.title) + '">' +
      '<img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + v.yt + '/mqdefault.jpg"><span class="pl">' + A.icon("tri") + '</span><span class="dur">' + (v.dur ? v.dur + " min" : "") + "</span></button>" +
      "<div><strong>" + esc(v.title) + '</strong><div class="small muted">' + esc(v.ch) + " · " + (v.lang === "pt" ? "PT-BR" : "EN") + (done ? " · assistido" : "") + "</div>" +
      '<div style="margin-top:4px">' + A.tagChips(v, 3) + "</div>" +
      (why ? '<div class="why"><b>Por que:</b> ' + esc(why) + "</div>" : "") + "</div></div>" +
      '<div id="vp-' + v.id + '"></div>' +
      '<div class="row" style="margin-top:8px"><a class="btn sm" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=' + v.yt + '">Abrir no YouTube ' + A.icon("ext") + '</a>' +
      '<button class="btn sm" data-vdone="' + v.id + '">' + (done ? "Desmarcar" : "Marcar assistido") + "</button></div></div>";
  };
  A.lessonCard = function (l, why, certId) {
    var done = A.store.has("lessonsDone", l.id), doms = certId && l.dom && l.dom[certId];
    return '<a class="card" style="display:block;text-decoration:none;color:inherit" href="#/estudar/' + l.id + '"><div class="row" style="justify-content:space-between"><strong>' + (done ? A.icon("check", "ok-t") + " " : "") + esc(l.title) +
      '</strong><span class="small muted">' + l.min + " min</span></div>" +
      (doms ? '<div class="small muted">' + doms.map(function (d) { return "D" + d + " · " + esc(A.domainName(certId, d)); }).join(" | ") + "</div>" : "") +
      "<div>" + A.tagChips(l, 4) + "</div>" + (why ? '<div class="why"><b>Por que:</b> ' + esc(why) + "</div>" : "") + "</a>";
  };
  A.resourceCard = function (r, why) {
    var done = A.store.has("resDone", r.id);
    return '<div class="card"><strong>' + esc(r.title) + "</strong> " + A.chip(A.resTypeLabel(r.type)) + (r.free ? A.chip("grátis", "st-active") : A.chip("pago")) +
      '<div class="small muted">' + esc(r.desc || "") + "</div><div>" + A.tagChips(r, 3) + "</div>" +
      (why ? '<div class="why"><b>Por que:</b> ' + esc(why) + "</div>" : "") +
      '<div class="row" style="margin-top:8px"><a class="btn sm accent" target="_blank" rel="noopener" href="' + esc(r.url) + '">Abrir ' + A.icon("ext") + '</a>' +
      '<button class="btn sm" data-rdone="' + r.id + '">' + (done ? "Concluído" : "Marcar concluído") + "</button></div></div>";
  };

  /* delegação de eventos globais (player lite, marcar vídeo/material) */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-play],[data-vdone],[data-rdone]");
    if (!t) return;
    if (t.dataset.play) {
      var v = A.bank.videos.filter(function (x) { return x.id === t.dataset.play; })[0], box = document.getElementById("vp-" + v.id);
      if (location.protocol === "file:") { window.open("https://www.youtube.com/watch?v=" + v.yt, "_blank"); return; }
      box.innerHTML = '<div class="vframe"><iframe src="https://www.youtube-nocookie.com/embed/' + v.yt + '?autoplay=1&rel=0" title="' + esc(v.title) +
        '" allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>';
      t.classList.add("hide");
    } else if (t.dataset.vdone) { A.store.toggle("videosDone", t.dataset.vdone); A.refresh(); }
    else if (t.dataset.rdone) { A.store.toggle("resDone", t.dataset.rdone); A.refresh(); }
  });

  /* ---------- roteamento ---------- */
  A.refresh = function () { var y = window.scrollY; dispatch(); window.scrollTo(0, y); };
  function dispatch() {
    var h = location.hash || "#/";
    A.$$("#nav a").forEach(function (a) { a.classList.toggle("on", TABS[+a.dataset.i][3].test(h)); });
    for (var i = 0; i < routes.length; i++) {
      var m = h.match(routes[i][0]);
      if (m) { try { routes[i][1](m); } catch (err) { console.error(err); A.render('<div class="card"><h3>Ops, algo deu errado</h3><p class="muted">' + esc(err.message) + '</p><a class="btn" href="#/">Voltar ao início</a></div>'); } return; }
    }
    A.render('<div class="card"><h3>Página não encontrada</h3><a class="btn" href="#/">Início</a></div>');
  }

  function fillCertPick() {
    var sel = $("#certPick"), cur = A.store.get().profile.cert, html = '<option value="">Escolha a certificação…</option>';
    Object.keys(A.levels).forEach(function (lv) {
      html += '<optgroup label="' + A.levels[lv] + '">' + A.certs.filter(function (c) { return c.level === lv; }).map(function (c) {
        return '<option value="' + c.id + '"' + (c.id === cur ? " selected" : "") + ">" + esc(c.short) + " (" + esc(c.code.split(" ")[0]) + ")</option>";
      }).join("") + "</optgroup>";
    });
    sel.innerHTML = html;
  }

  A.boot = function () {
    $("#nav").innerHTML = TABS.map(function (t, i) { return '<a href="' + t[0] + '" data-i="' + i + '"><span class="ico">' + A.icon(t[1]) + "</span>" + t[2] + "</a>"; }).join("");
    $("#themeBtn").innerHTML = A.icon("contrast"); $("#cfgBtn").innerHTML = A.icon("sliders");
    fillCertPick();
    $("#certPick").addEventListener("change", function (e) { A.store.setCert(e.target.value || null); dispatch(); });
    $("#themeBtn").addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme"), dark = cur ? cur === "dark" : matchMedia("(prefers-color-scheme: dark)").matches, nx = dark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", nx); try { localStorage.setItem("awsprep.theme", nx); } catch (e) {}
    });
    window.addEventListener("hashchange", dispatch);
    dispatch();
  };
  A.setCertAndRefresh = function (id) { A.store.setCert(id); fillCertPick(); dispatch(); };

  /* ---------- Painel ---------- */
  A.route(/^#\/?$/, function () {
    var c = A.curCert(), st = A.store.get();
    if (!c) {
      var h = '<h1>Bem-vindo</h1><p class="muted">Sistema completo de preparação para certificações AWS: conteúdo denso, simulados no estilo da prova, vídeos e recomendações baseadas nos seus erros. Escolha a certificação que vai estudar:</p>';
      Object.keys(A.levels).forEach(function (lv) {
        h += "<h3>" + A.levels[lv] + '</h3><div class="grid c2">' + A.certs.filter(function (x) { return x.level === lv; }).map(function (x) {
          return '<button class="card btn" style="display:block;text-align:left;font-weight:400" data-pick="' + x.id + '"><strong>' + esc(x.short) + "</strong> <span class=\"muted small\">" + esc(x.code) + "</span><div>" + A.certBadges(x) + '</div><div class="small muted">' + esc(x.who) + "</div></button>";
        }).join("") + "</div>";
      });
      A.render(h + '<div class="notice info">Dica: você também pode ver todas as provas lado a lado em <a href="#/provas">Provas</a>, ou explorar agrupamentos por objetivo em <a href="#/trilhas">Trilhas</a>.</div>');
      A.$$("[data-pick]").forEach(function (b) { b.addEventListener("click", function () { A.setCertAndRefresh(b.dataset.pick); }); });
      return;
    }
    var atts = st.attempts.filter(function (a) { return a.cert === c.id; }), sums = atts.map(A.summarize);
    var last = sums[sums.length - 1], avg5 = sums.slice(-5).reduce(function (a, s) { return a + s.est; }, 0) / (Math.min(5, sums.length) || 1);
    var lessons = A.bank.lessons.filter(function (l) { return l.dom && l.dom[c.id]; }), lDone = lessons.filter(function (l) { return st.lessonsDone[l.id]; }).length;
    var vids = A.bank.videos.filter(function (v) { return v.dom && v.dom[c.id]; }), vDone = vids.filter(function (v) { return st.videosDone[v.id]; }).length;
    var qn = A.quizBank(c.id).length, ds = A.rec.domainStats(c.id), weak = A.rec.weaknesses(c.id, 8);
    var exam = st.profile.exams && st.profile.exams[c.id], daysLeft = exam ? Math.ceil((new Date(exam) - Date.now()) / 86400000) : null;

    var h = "<h1>" + esc(c.short) + ' <span class="muted small">' + esc(c.code) + "</span></h1><div>" + A.certBadges(c) + "</div>";
    (c.notes || []).filter(function (n) { return /ATUALIZA|DESCONTINUADA|ATENÇÃO/.test(n); }).forEach(function (n) { h += '<div class="notice">' + A.icon("alert") + esc(n) + "</div>"; });
    h += '<div class="card"><div class="grid c4">' +
      '<div class="stat"><b>' + atts.length + "</b><span>simulados feitos</span></div>" +
      '<div class="stat"><b class="' + (last ? (last.pass ? "pass" : "fail") : "") + '">' + (last ? last.est : "–") + "</b><span>última nota estimada (mín. " + c.passing + ")</span></div>" +
      '<div class="stat"><b>' + (sums.length ? Math.round(avg5) : "–") + "</b><span>média dos últimos 5</span></div>" +
      '<div class="stat"><b>' + (daysLeft != null ? (daysLeft >= 0 ? daysLeft + " d" : "—") : "–") + "</b><span>até a prova</span></div></div>" +
      '<div class="row" style="margin-top:10px"><label class="small muted">Data da prova: <input type="date" id="examDate" value="' + esc(exam || "") + '" style="width:auto;min-height:36px"></label></div></div>';

    if (!atts.length) {
      h += '<div class="card"><h3>Comece com um simulado diagnóstico</h3><p class="muted">Responda 15 questões para mapear seus pontos fracos. A partir daí, o sistema recomenda lições, vídeos e materiais específicos para os temas que você errou.</p>' +
        (qn >= 5 ? '<a class="btn primary" href="#/simulados?start=diag">Iniciar diagnóstico</a>' : '<div class="notice">Banco de questões desta certificação ainda pequeno (' + qn + ").</div>") + "</div>";
    } else {
      h += '<div class="card"><h3>Desempenho por domínio</h3>' + ds.map(function (d) {
        return '<div style="margin:10px 0"><div class="row" style="justify-content:space-between"><span class="small">D' + d.d + " · " + esc(d.name) + ' <span class="muted">(' + d.weight + '% da prova)</span></span><b>' + (d.pct == null ? "–" : d.pct + "%") + "</b></div>" +
          A.bar(d.pct || 0, d.pct == null ? "" : d.pct >= 75 ? "ok" : d.pct >= 60 ? "warn" : "bad") + '<div class="small muted">' + d.ok + "/" + d.total + " corretas</div></div>";
      }).join("") + "</div>";
      if (weak.length) {
        h += '<div class="card"><h3>Seus pontos fracos</h3><p class="small muted">Tags (serviços/tópicos) das questões que você errou, ponderadas por recência e descontando acertos posteriores.</p>' +
          weak.map(function (w) { return A.chip(w.label, w.kind === "svc" ? "svc" : ""); }).join("") +
          '<div class="row" style="margin-top:8px"><a class="btn primary" href="#/simulados?start=weak">Praticar pontos fracos</a></div></div>';
      }
      var rv = A.rec.forCert(c.id, "videos", 3).items, rl = A.rec.forCert(c.id, "lessons", 3).items;
      if (rl.length) h += "<h2>Estude isto agora</h2>" + rl.map(function (r) { return A.lessonCard(r.item, A.rec.whyText(r.why), c.id); }).join("");
      if (rv.length) h += "<h2>Vídeos recomendados</h2>" + rv.map(function (r) { return A.videoCard(r.item, A.rec.whyText(r.why)); }).join("") + '<a class="btn" href="#/videos">Ver todos os vídeos</a>';
    }
    h += '<h2>Progresso de estudo</h2><div class="card"><div class="small">Lições: ' + lDone + "/" + lessons.length + "</div>" + A.bar(lessons.length ? 100 * lDone / lessons.length : 0, "ok") +
      '<div class="small" style="margin-top:8px">Vídeos: ' + vDone + "/" + vids.length + "</div>" + A.bar(vids.length ? 100 * vDone / vids.length : 0) +
      '<div class="small" style="margin-top:8px">Banco de questões: ' + qn + ' questões</div></div>' +
      '<div class="grid c4"><a class="btn" href="#/provas/' + c.id + '">' + A.icon("clipboard") + ' Info da prova</a><a class="btn" href="#/estudar">' + A.icon("book") + ' Estudar</a><a class="btn" href="#/simulados">' + A.icon("exam") + ' Simulados</a><a class="btn" href="#/trilhas">' + A.icon("layers") + " Trilhas</a></div>";
    A.render(h);
    var ed = $("#examDate");
    if (ed) ed.addEventListener("change", function () { var p = A.store.get().profile; p.exams = p.exams || {}; p.exams[c.id] = ed.value; A.store.save(); A.refresh(); });
  });

  /* ---------- Configurações / sincronização entre dispositivos ---------- */
  A.route(/^#\/config/, function () {
    var st = A.store.get();
    A.render("<h1>Configurações</h1>" +
      '<div class="card"><h3>Idioma preferido dos vídeos</h3><p class="small muted">Usado para priorizar recomendações.</p><select id="langSel"><option value="pt"' + (st.profile.lang === "pt" ? " selected" : "") + '>Português (Brasil) primeiro</option><option value="en"' + (st.profile.lang === "en" ? " selected" : "") + ">Inglês primeiro</option></select></div>" +
      '<div class="card"><h3>Sincronizar entre dispositivos</h3><p class="small muted">O site é estático (GitHub Pages): o progresso fica salvo <b>neste aparelho</b>. Para levar seu progresso a outro celular/computador, copie o código abaixo e cole no outro aparelho (ou use o arquivo).</p>' +
      '<textarea id="syncCode" rows="4" readonly></textarea><div class="row" style="margin-top:8px"><button class="btn sm" id="cpBtn">Copiar código</button><button class="btn sm" id="dlBtn">Baixar arquivo</button></div>' +
      '<label class="f">Colar código de outro aparelho (substitui o progresso atual)</label><textarea id="impCode" rows="3" placeholder="Cole aqui o código de sincronização"></textarea>' +
      '<div class="row" style="margin-top:8px"><button class="btn sm accent" id="impBtn">Importar código</button><label class="btn sm">Importar arquivo<input type="file" id="impFile" accept="application/json" style="display:none"></label></div><div id="syncMsg" class="small" style="margin-top:6px"></div></div>' +
      '<div class="card"><h3>Sobre o conteúdo e as questões</h3><p class="small muted">Dados das provas (custo, duração, domínios, nota mínima) vieram das páginas e exam guides oficiais da AWS em ' + esc(A.meta.collectedAt) + '. As questões de simulado são <b>originais</b>, escritas no estilo da prova e alinhadas aos domínios oficiais — este projeto <b>não usa questões vazadas (braindumps)</b>, que violam o acordo de confidencialidade da AWS. Vídeos são links para conteúdo público no YouTube. Os ícones de serviço são os <b>AWS Architecture Icons</b> oficiais, não modificados, usados apenas para identificar cada serviço. <b>Este é um projeto de estudo pessoal, não afiliado, endossado ou patrocinado pela Amazon Web Services, Inc.</b> AWS e os nomes de serviços citados são marcas da Amazon.com, Inc. ou afiliadas.</p></div>' +
      '<div class="card"><h3>Zona de risco</h3><button class="btn sm" id="resetBtn" style="color:var(--bad)">Apagar todo o progresso deste aparelho</button></div>');
    var code = btoa(unescape(encodeURIComponent(A.store.exportJson())));
    $("#syncCode").value = code;
    $("#langSel").addEventListener("change", function (e) { A.store.setLang(e.target.value); });
    var msg = function (t, ok) { var m = $("#syncMsg"); m.textContent = t; m.className = "small " + (ok ? "pass" : "fail"); };
    $("#cpBtn").addEventListener("click", function () { $("#syncCode").select(); try { navigator.clipboard.writeText(code); msg("Código copiado.", true); } catch (e) { document.execCommand("copy"); msg("Código copiado.", true); } });
    $("#dlBtn").addEventListener("click", function () {
      var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([A.store.exportJson()], { type: "application/json" })); a.download = "aws-prep-progresso.json"; a.click();
    });
    $("#impBtn").addEventListener("click", function () {
      try { A.store.importJson(decodeURIComponent(escape(atob($("#impCode").value.trim())))); msg("Importado com sucesso.", true); setTimeout(function () { location.hash = "#/"; location.reload(); }, 600); }
      catch (e) { msg("Código inválido.", false); }
    });
    $("#impFile").addEventListener("change", function (e) {
      var f = e.target.files[0]; if (!f) return; var r = new FileReader();
      r.onload = function () { try { A.store.importJson(r.result); msg("Importado com sucesso.", true); setTimeout(function () { location.hash = "#/"; location.reload(); }, 600); } catch (er) { msg("Arquivo inválido.", false); } };
      r.readAsText(f);
    });
    $("#resetBtn").addEventListener("click", function () { if (confirm("Apagar TODO o progresso deste aparelho?")) { A.store.reset(); location.hash = "#/"; location.reload(); } });
  });
})();
