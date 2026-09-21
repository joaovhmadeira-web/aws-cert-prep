/*
 * Motor de simulados: registro do banco, montagem de provas (distribuição por peso oficial
 * dos domínios + viés para questões recentes/inéditas/erradas), correção e estimativa de nota.
 *
 * Formato compacto de questão:
 *  { d: domínio(1..n), t: "1.2" task opcional, q: enunciado, o: [opções], a: [índices corretos],
 *    e: explicação, s: [serviços], p: [tópicos], l: 1-3 dificuldade, r: 1-3 recência do conteúdo,
 *    src: "original" | "official-sample" }
 *  r=3 -> serviço/recurso lançado ou incluído nos exam guides em 2025-26; r=1 -> conteúdo estável/clássico.
 */
(function () {
  var A = window.AWSPREP;
  A.qById = {};

  function fnv(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 0x01000193) >>> 0; }
    return h.toString(36);
  }

  A.addQ = function (cert, list) {
    list.forEach(function (q) {
      q.cert = cert;
      q.id = cert + "-" + fnv(q.q);
      q.r = q.r || 1; q.l = q.l || 2; q.s = q.s || []; q.p = q.p || [];
      if (A.qById[q.id]) { console.warn("Questão duplicada", q.id); return; }
      A.qById[q.id] = q;
      A.bank.questions.push(q);
    });
  };

  function bankFor(cert) { return A.bank.questions.filter(function (q) { return q.cert === cert; }); }
  A.quizBank = bankFor;

  /* histórico por questão: {seen, wrong} */
  function history(cert) {
    var h = {};
    A.store.get().attempts.forEach(function (at) {
      if (at.cert !== cert) return;
      at.answers.forEach(function (an) {
        var o = h[an.qid] = h[an.qid] || { seen: 0, wrong: 0, last: null };
        o.seen++; if (!an.ok) o.wrong++; o.last = an.ok;
      });
    });
    return h;
  }

  function weightedPick(pool, n, weightFn) {
    var res = [], items = pool.map(function (q) { return { q: q, w: weightFn(q) }; });
    while (res.length < n && items.length) {
      var tot = items.reduce(function (a, b) { return a + b.w; }, 0), x = Math.random() * tot, idx = 0;
      for (; idx < items.length - 1; idx++) { x -= items[idx].w; if (x <= 0) break; }
      res.push(items.splice(idx, 1)[0].q);
    }
    return res;
  }

  /* distribui n questões pelos domínios conforme o peso oficial (maiores restos) */
  function domainQuota(cert, n, available) {
    var c = A.certById(cert), total = c.domains.reduce(function (a, d) { return a + d[1]; }, 0);
    var raw = c.domains.map(function (d) { return n * d[1] / total; });
    var q = raw.map(Math.floor), left = n - q.reduce(function (a, b) { return a + b; }, 0);
    raw.map(function (v, i) { return [v - Math.floor(v), i]; }).sort(function (a, b) { return b[0] - a[0]; })
      .slice(0, left).forEach(function (x) { q[x[1]]++; });
    // limita ao disponível e redistribui o excedente
    var extra = 0;
    q = q.map(function (v, i) { var a = available[i + 1] || 0; if (v > a) { extra += v - a; return a; } return v; });
    for (var guard = 0; extra > 0 && guard < 500; guard++) {
      for (var i = 0; i < q.length && extra > 0; i++) if (q[i] < (available[i + 1] || 0)) { q[i]++; extra--; }
    }
    return q;
  }

  /*
   * opts: { cert, mode: 'exam'|'practice'|'weak'|'wrong', n, domain, recentBias(0..1) }
   * Retorna { cert, mode, questions:[q], seconds|null, startedAt }
   */
  A.buildQuiz = function (opts) {
    var c = A.certById(opts.cert), pool = bankFor(opts.cert), hist = history(opts.cert);
    var bias = opts.recentBias == null ? 0.6 : opts.recentBias;
    var weight = function (q) {
      var h = hist[q.id], w = 1 + bias * (q.r - 1);           // relevância para conteúdo recente
      if (!h) w *= 1.4;                                        // prioriza inéditas
      else if (h.wrong) w *= 1 + Math.min(1.5, h.wrong * 0.6); // reforça as que já errou
      else if (h.last) w *= 0.6;                               // acertou por último: menos provável
      return w;
    };
    var picked = [], n = opts.n || (opts.mode === "exam" ? c.totalQuestions : 20);

    if (opts.mode === "wrong") {
      picked = pool.filter(function (q) { return hist[q.id] && hist[q.id].wrong && !hist[q.id].last; });
      picked = A.shuffle(picked).slice(0, n);
    } else if (opts.mode === "weak") {
      var prof = A.rec.profileFromAttempts(A.store.get().attempts, opts.cert);
      var scored = pool.map(function (q) {
        var r = A.rec.scoreItem({ svc: q.s, top: q.p, dom: (function () { var o = {}; o[opts.cert] = [q.d]; return o; })() }, prof, opts.cert);
        return { q: q, s: r ? r.score : 0 };
      }).filter(function (x) { return x.s > 0; });
      picked = weightedPick(scored.map(function (x) { return x.q; }), n, function (q) {
        var x = scored.filter(function (y) { return y.q === q; })[0]; return (x ? x.s : 0.1) * weight(q);
      });
    } else if (opts.mode === "domain") {
      picked = weightedPick(pool.filter(function (q) { return q.d === opts.domain; }), n, weight);
    } else { // exam | practice (misto)
      var avail = {};
      pool.forEach(function (q) { avail[q.d] = (avail[q.d] || 0) + 1; });
      n = Math.min(n, pool.length);
      var quota = domainQuota(opts.cert, n, avail);
      quota.forEach(function (k, i) {
        picked = picked.concat(weightedPick(pool.filter(function (q) { return q.d === i + 1; }), k, weight));
      });
      picked = A.shuffle(picked);
    }
    var mins = opts.mode === "exam" ? Math.round(c.durationMin * picked.length / c.totalQuestions) : null;
    return { cert: opts.cert, mode: opts.mode, domain: opts.domain || null, questions: picked, seconds: mins ? mins * 60 : null, startedAt: Date.now() };
  };

  /* Visão embaralhada: opções em ordem aleatória preservando o gabarito */
  A.viewQuestion = function (q) {
    var idx = A.shuffle(q.o.map(function (_, i) { return i; }));
    return { q: q, order: idx, multi: q.a.length > 1 };
  };

  /* Correção de uma resposta: chosen = índices ORIGINAIS marcados */
  A.gradeAnswer = function (q, chosen) {
    var a = q.a.slice().sort().join(","), b = (chosen || []).slice().sort().join(",");
    return a === b;
  };

  /* Estimativa de nota escalada (100–1000). Aproximação linear — a AWS usa escalonamento próprio. */
  A.estimateScore = function (pct) { return Math.round(100 + 900 * pct); };

  /* Sumário de uma tentativa concluída */
  A.summarize = function (attempt) {
    var c = A.certById(attempt.cert), total = attempt.answers.length, ok = attempt.answers.filter(function (a) { return a.ok; }).length;
    var pct = total ? ok / total : 0, byD = {};
    attempt.answers.forEach(function (an) {
      var q = A.qById[an.qid]; if (!q) return;
      var o = byD[q.d] = byD[q.d] || { total: 0, ok: 0 };
      o.total++; if (an.ok) o.ok++;
    });
    var est = A.estimateScore(pct);
    return { total: total, ok: ok, pct: pct, est: est, pass: est >= c.passing, byDomain: byD, passing: c.passing };
  };
})();
