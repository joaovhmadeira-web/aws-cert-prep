/* Telas de simulado: configuração, execução, resultado/revisão e histórico. */
(function () {
  var A = window.AWSPREP, esc = A.esc, $ = A.$;
  var SKEY = "awsprep.session", S = null, timer = null;

  function saveSession() { try { localStorage.setItem(SKEY, JSON.stringify(S)); } catch (e) {} }
  function loadSession() { try { return JSON.parse(localStorage.getItem(SKEY)); } catch (e) { return null; } }
  function clearSession() { S = null; try { localStorage.removeItem(SKEY); } catch (e) {} }

  function startSession(quiz) {
    if (!quiz.questions.length) { alert("Não há questões suficientes para este modo. Tente outro modo ou faça mais simulados."); return; }
    S = { cert: quiz.cert, mode: quiz.mode, domain: quiz.domain, qids: quiz.questions.map(function (q) { return q.id; }), order: {}, answers: {}, checked: {}, flags: {}, times: {},
          idx: 0, startedAt: Date.now(), endAt: quiz.seconds ? Date.now() + quiz.seconds * 1000 : null, qStart: Date.now() };
    quiz.questions.forEach(function (q) { S.order[q.id] = A.shuffle(q.o.map(function (_, i) { return i; })); });
    saveSession(); A.go("#/simulados/run");
  }
  A.startCustomQuiz = function (cert, list, mode) {
    startSession({ cert: cert, mode: mode || "practice", questions: A.shuffle(list).slice(0, 10), seconds: null });
  };

  function parseQuery() { var q = {}; ((location.hash.split("?")[1]) || "").split("&").forEach(function (p) { var kv = p.split("="); if (kv[0]) q[kv[0]] = decodeURIComponent(kv[1] || ""); }); return q; }

  /* ---------- Configuração ---------- */
  A.route(/^#\/simulados(\?.*)?$/, function () {
    var c = A.curCert();
    if (!c) return A.render('<h1>Simulados</h1><div class="card"><p>Escolha uma certificação no seletor acima.</p><a class="btn" href="#/provas">Ver provas</a></div>');
    var pool = A.quizBank(c.id), q = parseQuery(), st = A.store.get(), bias = +(sessionStorage.getItem("qz.bias") || 0.6);
    if (q.start === "diag") { history.replaceState(null, "", "#/simulados"); return startSession(A.buildQuiz({ cert: c.id, mode: "practice", n: Math.min(15, pool.length), recentBias: bias })); }
    if (q.start === "weak") { history.replaceState(null, "", "#/simulados"); return startSession(A.buildQuiz({ cert: c.id, mode: "weak", n: 15, recentBias: bias })); }
    var sess = loadSession(), hasSess = sess && sess.cert === c.id && sess.idx != null;
    var nExam = Math.min(c.totalQuestions, pool.length), mins = Math.round(c.durationMin * nExam / c.totalQuestions);
    var wrongN = pool.filter(function (x) { return A.rec.profileFromAttempts([], c.id) && false; }).length; // placeholder (calculado abaixo)
    var byD = c.domains.map(function (d, i) { return pool.filter(function (x) { return x.d === i + 1; }).length; });
    var recent = pool.filter(function (x) { return x.r >= 2; }).length;

    var h = "<h1>Simulados</h1><p class=\"muted\">" + esc(c.short) + " · banco de <b>" + pool.length + "</b> questões originais no estilo da prova (" + recent + " sobre conteúdo recente).</p>";
    if (hasSess) h += '<div class="notice info">Você tem um simulado em andamento. <a class="btn sm accent" href="#/simulados/run">Continuar</a> <button class="btn sm" id="dropSess">Descartar</button></div>';
    if (pool.length < 10) h += '<div class="notice">O banco desta certificação é pequeno (' + pool.length + " questões). Os modos foram ajustados ao que está disponível.</div>";
    h += '<div class="card"><label class="row small" style="gap:8px"><span>Priorizar conteúdo recente</span><input type="range" id="bias" min="0" max="1" step="0.2" value="' + bias + '" style="flex:1;min-height:32px"><span id="biasV">' + Math.round(bias * 100) + "%</span></label>" +
      '<p class="small muted" style="margin:4px 0 0">Aumenta a chance de cair questões sobre serviços e recursos novos (marcados como recentes) e inéditas para você.</p></div>';
    h += '<div class="grid c2m">' +
      '<div class="card"><h3>' + A.icon("clock") + ' Simulado completo</h3><p class="small muted">' + nExam + " questões · " + mins + " min · distribuição pelos pesos oficiais dos domínios · sem feedback até o fim (como na prova real).</p><button class=\"btn primary block\" data-m=\"exam\">Iniciar simulado</button></div>" +
      '<div class="card"><h3>' + A.icon("target") + ' Prática rápida</h3><p class="small muted">10 ou 20 questões com correção e explicação imediatas.</p><div class="row"><button class="btn accent" data-m="practice" data-n="10">10 questões</button><button class="btn accent" data-m="practice" data-n="20">20 questões</button></div></div>' +
      '<div class="card"><h3>' + A.icon("trend") + ' Foco nos pontos fracos</h3><p class="small muted">Seleciona questões dos serviços e tópicos que você mais errou (metadados do seu histórico).</p><button class="btn block" data-m="weak" ' + (st.attempts.some(function (a) { return a.cert === c.id; }) ? "" : "disabled") + '>Praticar pontos fracos</button></div>' +
      '<div class="card"><h3>' + A.icon("repeat") + ' Refazer erradas</h3><p class="small muted">Questões que você errou da última vez que viu.</p><button class="btn block" data-m="wrong" ' + (st.attempts.some(function (a) { return a.cert === c.id && a.answers.some(function (x) { return !x.ok; }); }) ? "" : "disabled") + ">Refazer erradas</button></div></div>";
    h += '<div class="card"><h3>' + A.icon("layers") + ' Por domínio</h3><div class="grid c2m">' + c.domains.map(function (d, i) {
      return '<button class="btn" style="justify-content:space-between;text-align:left" data-m="domain" data-d="' + (i + 1) + '" ' + (byD[i] ? "" : "disabled") + "><span>D" + (i + 1) + " · " + esc(d[0]) + '</span><span class="muted small">' + byD[i] + "</span></button>";
    }).join("") + "</div></div>";
    var atts = st.attempts.map(function (a, i) { return [a, i]; }).filter(function (x) { return x[0].cert === c.id; }).reverse();
    if (atts.length) {
      h += "<h2>Histórico</h2>" + atts.slice(0, 15).map(function (x) {
        var s = A.summarize(x[0]);
        return '<a class="card" style="display:block;text-decoration:none;color:inherit" href="#/simulados/resultado/' + x[1] + '"><div class="row" style="justify-content:space-between"><b>' + A.fmtDate(x[0].finished) + " · " + ({ exam: "Simulado", practice: "Prática", weak: "Pontos fracos", wrong: "Erradas", domain: "Domínio" }[x[0].mode] || x[0].mode) + "</b><b class=\"" + (s.pass ? "pass" : "fail") + '">' + s.est + "</b></div>" +
          '<div class="small muted">' + s.ok + "/" + s.total + " corretas (" + Math.round(s.pct * 100) + "%)</div></a>";
      }).join("");
    }
    A.render(h);
    $("#bias").addEventListener("input", function (e) { sessionStorage.setItem("qz.bias", e.target.value); $("#biasV").textContent = Math.round(e.target.value * 100) + "%"; });
    var ds = $("#dropSess"); if (ds) ds.addEventListener("click", function () { clearSession(); A.refresh(); });
    A.$$("[data-m]").forEach(function (b) {
      b.addEventListener("click", function () {
        var m = b.dataset.m, opts = { cert: c.id, mode: m === "practice" ? "practice" : m, recentBias: +$("#bias").value };
        if (m === "exam") opts.n = nExam; else if (m === "practice") opts.n = Math.min(+b.dataset.n, pool.length); else if (m === "domain") { opts.domain = +b.dataset.d; opts.n = 15; } else opts.n = 15;
        startSession(A.buildQuiz(opts));
      });
    });
  });

  /* ---------- Execução ---------- */
  function finish(auto) {
    if (!S) return;
    var now = Date.now(), answers = S.qids.map(function (id) {
      var q = A.qById[id], ch = S.answers[id] || [];
      return { qid: id, chosen: ch, ok: A.gradeAnswer(q, ch), t: Math.round((S.times[id] || 0) / 1000), flag: !!S.flags[id] };
    });
    var at = { cert: S.cert, mode: S.mode, domain: S.domain, started: S.startedAt, finished: now, answers: answers, auto: !!auto };
    A.store.addAttempt(at); var idx = A.store.get().attempts.length - 1;
    clearSession(); clearInterval(timer); A.go("#/simulados/resultado/" + idx);
  }

  A.route(/^#\/simulados\/run/, function () {
    if (!S) S = loadSession();
    if (!S) return A.go("#/simulados");
    clearInterval(timer);
    var exam = S.mode === "exam", n = S.qids.length;

    function tick() {
      if (!/^#\/simulados\/run/.test(location.hash)) return clearInterval(timer);
      if (S.endAt) {
        var left = Math.round((S.endAt - Date.now()) / 1000), el = $("#timer");
        if (left <= 0) { clearInterval(timer); alert("Tempo esgotado! Sua prova será finalizada."); return finish(true); }
        if (el) { el.innerHTML = A.icon("clock") + " " + A.fmtTime(left); el.classList.toggle("low", left < 300); }
      }
    }
    function draw() {
      var id = S.qids[S.idx], q = A.qById[id], order = S.order[id], chosen = S.answers[id] || [], checked = !!S.checked[id], multi = q.a.length > 1;
      var h = '<div class="qhead"><div><b>Questão ' + (S.idx + 1) + "/" + n + '</b> <span class="small muted">D' + q.d + '</span></div><span class="timer" id="timer"></span>' +
        '<button class="btn sm" id="flagBtn">' + A.icon("flag") + (S.flags[id] ? " Marcada" : " Marcar") + "</button></div>";
      h += A.bar(100 * (S.idx + 1) / n);
      h += '<div class="card" style="margin-top:10px"><div class="qtext">' + esc(q.q) + "</div>" + (multi ? '<div class="multi-hint" style="margin-top:6px">Escolha ' + q.a.length + " respostas.</div>" : "");
      h += order.map(function (oi, pos) {
        var cls = "opt", sel = chosen.indexOf(oi) >= 0;
        if (checked) { if (q.a.indexOf(oi) >= 0) cls += " right"; else if (sel) cls += " wrong"; } else if (sel) cls += " sel";
        return '<button class="' + cls + '" data-o="' + oi + '"><span class="k">' + "ABCDEFG"[pos] + "</span><span>" + esc(q.o[oi]) + "</span></button>";
      }).join("");
      if (checked) {
        var ok = A.gradeAnswer(q, chosen);
        h += '<div class="expl"><b class="' + (ok ? "pass" : "fail") + '">' + A.icon(ok ? "check" : "x") + (ok ? " Correto" : " Incorreto") + "</b><div class=\"prose\">" + A.md(q.e) + "</div></div>";
      }
      h += "</div>";
      h += '<details style="margin:8px 0"><summary class="small muted" style="min-height:40px;display:flex;align-items:center;cursor:pointer">Navegador de questões</summary><div class="qnav">' + S.qids.map(function (qid, i) {
        var c2 = []; if (i === S.idx) c2.push("cur"); if (S.answers[qid] && S.answers[qid].length) c2.push("done"); if (S.flags[qid]) c2.push("flag");
        if (S.checked[qid]) c2.push(A.gradeAnswer(A.qById[qid], S.answers[qid]) ? "ok" : "no");
        return '<button class="' + c2.join(" ") + '" data-g="' + i + '">' + (i + 1) + "</button>";
      }).join("") + "</div></details>";
      h += '<div class="sticky-actions"><button class="btn" id="prevBtn" aria-label="Anterior" ' + (S.idx ? "" : "disabled") + ">' + A.icon("left") + '</button>";
      if (!exam && !checked) h += '<button class="btn accent" id="chkBtn" ' + (chosen.length ? "" : "disabled") + ">Verificar</button>";
      h += S.idx < n - 1 ? '<button class="btn primary" id="nextBtn">Próxima ' + A.icon("right") + '</button>' : '<button class="btn primary" id="endBtn">Finalizar</button>';
      h += "</div>";
      A.render(h); window.scrollTo(0, 0);
      tick();
      S.qStart = Date.now();

      A.$$(".opt").forEach(function (b) {
        b.addEventListener("click", function () {
          if (checked) return;
          var oi = +b.dataset.o, cur = (S.answers[id] || []).slice();
          if (multi) { var k = cur.indexOf(oi); if (k >= 0) cur.splice(k, 1); else cur.push(oi); } else cur = [oi];
          S.answers[id] = cur; saveSession(); draw();
        });
      });
      var go = function (i) { S.times[id] = (S.times[id] || 0) + (Date.now() - S.qStart); S.idx = i; saveSession(); draw(); };
      $("#prevBtn").addEventListener("click", function () { go(S.idx - 1); });
      var nb = $("#nextBtn"); if (nb) nb.addEventListener("click", function () { go(S.idx + 1); });
      var cb = $("#chkBtn"); if (cb) cb.addEventListener("click", function () { S.checked[id] = true; S.times[id] = (S.times[id] || 0) + (Date.now() - S.qStart); saveSession(); draw(); });
      $("#flagBtn").addEventListener("click", function () { S.flags[id] = !S.flags[id]; saveSession(); draw(); });
      A.$$("[data-g]").forEach(function (b) { b.addEventListener("click", function () { go(+b.dataset.g); }); });
      var eb = $("#endBtn");
      if (eb) eb.addEventListener("click", function () {
        S.times[id] = (S.times[id] || 0) + (Date.now() - S.qStart);
        var un = S.qids.filter(function (x) { return !(S.answers[x] && S.answers[x].length); }).length, fl = S.qids.filter(function (x) { return S.flags[x]; }).length;
        if (confirm("Finalizar" + (un ? " com " + un + " sem resposta" : "") + (fl ? " e " + fl + " marcada(s)" : "") + "?")) finish(false);
      });
    }
    draw();
    if (S.endAt) timer = setInterval(tick, 1000);
  });

  /* ---------- Resultado e revisão ---------- */
  A.route(/^#\/simulados\/resultado\/(\d+)/, function (m) {
    var at = A.store.get().attempts[+m[1]]; if (!at) return A.go("#/simulados");
    var c = A.certById(at.cert), s = A.summarize(at), only = sessionStorage.getItem("rv.wrong") === "1";
    var h = '<a class="small" href="#/simulados">' + A.icon("left") + ' Simulados</a><h1>Resultado</h1>' +
      '<div class="card center"><div class="score-ring" style="border:10px solid var(--' + (s.pass ? "ok" : "bad") + ')"><span class="' + (s.pass ? "pass" : "fail") + '">' + s.est + "</span></div>" +
      "<h3>" + (s.pass ? "Acima da nota mínima estimada" : "Abaixo da nota mínima estimada") + '</h3><p class="muted">' + s.ok + " de " + s.total + " corretas (" + Math.round(s.pct * 100) + "%). Nota mínima da prova: " + c.passing + "/1000.</p>" +
      '<p class="small muted">A nota é uma <b>estimativa linear</b>; a AWS usa escala própria e questões de pesos diferentes. Use como termômetro: consistentemente ≥ 80% costuma indicar boa prontidão.</p></div>';
    h += '<div class="card"><h3>Por domínio</h3>' + c.domains.map(function (d, i) {
      var o = s.byDomain[i + 1]; if (!o) return ""; var p = Math.round(100 * o.ok / o.total);
      return '<div style="margin:10px 0"><div class="row" style="justify-content:space-between"><span class="small">D' + (i + 1) + " · " + esc(d[0]) + "</span><b>" + p + "% <span class=\"muted small\">(" + o.ok + "/" + o.total + ")</span></b></div>" + A.bar(p, p >= 75 ? "ok" : p >= 60 ? "warn" : "bad") + "</div>";
    }).join("") + "</div>";

    // recomendações agregadas a partir dos erros DESTA tentativa (matching por metadados)
    var prof = A.rec.profileFromAttempts([Object.assign({}, at, { finished: Date.now() })], c.id);
    var st = A.store.get();
    function top(kind, done) { var out = []; (A.bank[kind] || []).forEach(function (it) { if (it.dom && it.dom[c.id]) { var r = A.rec.scoreItem(it, prof, c.id, { lang: st.profile.lang, done: done }); if (r) out.push(r); } }); return out.sort(function (a, b) { return b.score - a.score; }).slice(0, 3); }
    var rl = top("lessons", st.lessonsDone), rv = top("videos", st.videosDone), rr = top("resources", st.resDone);
    if (rl.length || rv.length) {
      h += "<h2>Recomendado com base nos seus erros</h2>";
      h += rl.map(function (r) { return A.lessonCard(r.item, A.rec.whyText(r.why), c.id); }).join("") + rv.map(function (r) { return A.videoCard(r.item, A.rec.whyText(r.why)); }).join("") + rr.map(function (r) { return A.resourceCard(r.item, A.rec.whyText(r.why)); }).join("");
    } else if (s.ok < s.total) h += '<div class="notice">Sem conteúdos casando com os metadados dos seus erros — explore <a href="#/estudar">Estudar</a>.</div>';

    h += '<h2>Revisão das questões</h2><label class="row small"><input type="checkbox" id="onlyWrong" ' + (only ? "checked" : "") + ' style="width:22px;height:22px"> Mostrar só as erradas</label>';
    at.answers.forEach(function (an, i) {
      var q = A.qById[an.qid]; if (!q || (only && an.ok)) return;
      h += '<div class="card"><div class="row" style="justify-content:space-between"><b>#' + (i + 1) + " · D" + q.d + '</b><b class="' + (an.ok ? "pass" : "fail") + '">' + A.icon(an.ok ? "check" : "x") + (an.ok ? " Correta" : an.chosen.length ? " Errada" : " Sem resposta") + '</b></div><div class="qtext">' + esc(q.q) + "</div>";
      h += q.o.map(function (o, oi) {
        var cls = "opt", isA = q.a.indexOf(oi) >= 0, sel = an.chosen.indexOf(oi) >= 0; if (isA) cls += " right"; else if (sel) cls += " wrong";
        return '<div class="' + cls + '" style="cursor:default"><span class="k">' + "ABCDEFG"[oi] + "</span><span>" + esc(o) + (sel ? " <i class=\"small\">(sua resposta)</i>" : "") + "</span></div>";
      }).join("");
      h += '<div class="expl prose">' + A.md(q.e) + "</div><div>" + A.tagChips(q, 5) + "</div>";
      if (!an.ok) {
        var rv2 = A.rec.forQuestion(q, "videos", 1), rl2 = A.rec.forQuestion(q, "lessons", 1);
        if (rv2.length || rl2.length) h += '<div class="why" style="margin-top:8px"><b>Estude para esta questão:</b> ' +
          rl2.map(function (r) { return '<a href="#/estudar/' + r.item.id + '">' + A.icon("book") + " " + esc(r.item.title) + "</a>"; }).concat(rv2.map(function (r) { return '<a target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=' + r.item.yt + '">' + A.icon("play") + " " + esc(r.item.title) + "</a>"; })).join(" · ") + "</div>";
      }
      h += "</div>";
    });
    h += '<div class="grid c2"><a class="btn primary" href="#/simulados">Novo simulado</a><a class="btn" href="#/">Ver painel</a></div>';
    A.render(h);
    $("#onlyWrong").addEventListener("change", function (e) { sessionStorage.setItem("rv.wrong", e.target.checked ? "1" : "0"); A.refresh(); });
  });
})();
