/*
 * MOTOR DE RECOMENDAÇÃO POR METADADOS
 * Não existe vínculo fixo "questão -> vídeo". Questões, lições, vídeos e materiais
 * compartilham a mesma taxonomia (services, topics, cert/domínio, nível) e o casamento
 * é calculado por similaridade ponderada:
 *
 *   necessidade(tag) = erros(tag) ponderados por recência  -  crédito por acertos(tag)
 *   score(item)      = Σ necessidade(svc) + 0.7·Σ necessidade(top) + 0.6·média necessidade(domínio)
 *                      normalizado pelo nº de tags, com ajustes de nível, idioma, recência e "já concluído".
 */
(function () {
  var A = window.AWSPREP;
  var LEVEL_NUM = { foundational: 1, associate: 2, professional: 3, specialty: 3 };
  var HALF_LIFE_DAYS = 30, RIGHT_CREDIT = 0.35;

  function certLevel(certId) { var c = A.certById(certId); return c ? LEVEL_NUM[c.level] : 2; }
  function inc(map, k, v) { map[k] = (map[k] || 0) + v; }

  /* Perfil de necessidade a partir do histórico de tentativas */
  function profileFromAttempts(attempts, certId) {
    var wrong = { svc: {}, top: {}, dom: {} }, right = { svc: {}, top: {}, dom: {} }, counts = { wrong: 0, right: 0 };
    var now = Date.now();
    attempts.forEach(function (at) {
      if (certId && at.cert !== certId) return;
      var w = Math.pow(0.5, (now - at.finished) / 86400000 / HALF_LIFE_DAYS);
      at.answers.forEach(function (an) {
        var q = A.qById[an.qid];
        if (!q) return;
        var bucket = an.ok ? right : wrong;
        counts[an.ok ? "right" : "wrong"]++;
        (q.s || []).forEach(function (s) { inc(bucket.svc, s, w); });
        (q.p || []).forEach(function (t) { inc(bucket.top, t, w); });
        inc(bucket.dom, q.cert + ":" + q.d, w);
      });
    });
    function need(k) {
      var out = {};
      Object.keys(wrong[k]).forEach(function (t) {
        var v = wrong[k][t] - RIGHT_CREDIT * (right[k][t] || 0);
        if (v > 0.05) out[t] = v;
      });
      return out;
    }
    return { svc: need("svc"), top: need("top"), dom: need("dom"), counts: counts,
      acc: { svc: right.svc, top: right.top, wrongSvc: wrong.svc, wrongTop: wrong.top } };
  }

  /* Perfil sintético de uma única questão (usado na revisão: "estude isto para esta questão") */
  function profileFromQuestion(q) {
    var p = { svc: {}, top: {}, dom: {} };
    (q.s || []).forEach(function (s) { p.svc[s] = 1; });
    (q.p || []).forEach(function (t) { p.top[t] = 1; });
    p.dom[q.cert + ":" + q.d] = 1;
    return p;
  }

  function scoreItem(item, prof, certId, opts) {
    opts = opts || {};
    var why = { svc: [], top: [], dom: null };
    var raw = 0, n = 0;
    (item.svc || []).forEach(function (s) { n++; if (prof.svc[s]) { raw += prof.svc[s]; why.svc.push(s); } });
    (item.top || []).forEach(function (t) { n++; if (prof.top[t]) { raw += 0.7 * prof.top[t]; why.top.push(t); } });
    var doms = item.dom && item.dom[certId];
    if (doms && doms.length) {
      var ds = 0;
      doms.forEach(function (d) { ds += prof.dom[certId + ":" + d] || 0; });
      if (ds > 0) { raw += 0.6 * (ds / doms.length); why.dom = doms.filter(function (d) { return prof.dom[certId + ":" + d]; }); }
    }
    if (raw <= 0) return null;
    var score = raw / Math.sqrt(1 + Math.max(0, n - 1) * 0.35);
    // ajuste de nível: penaliza conteúdo muito distante do nível da certificação
    if (item.lvl) score *= 1 - 0.12 * Math.abs(item.lvl - certLevel(certId));
    if (opts.lang && item.lang) score *= item.lang === opts.lang ? 1.15 : 0.9;
    if (item.y && item.y >= new Date().getFullYear() - 1) score *= 1.08; // conteúdo recente
    if (opts.done && opts.done[item.id]) score *= 0.35;
    return { item: item, score: score, why: why };
  }

  function appliesTo(item, certId) { return !certId || (item.dom && item.dom[certId]); }

  function rank(kind, prof, certId, n, opts) {
    var res = [];
    (A.bank[kind] || []).forEach(function (it) {
      if (!appliesTo(it, certId)) return;
      var r = scoreItem(it, prof, certId, opts);
      if (r) res.push(r);
    });
    res.sort(function (a, b) { return b.score - a.score; });
    return res.slice(0, n || 6);
  }

  A.rec = {
    profileFromAttempts: profileFromAttempts,
    profileFromQuestion: profileFromQuestion,
    scoreItem: scoreItem,
    /* Recomendações gerais a partir de todo o histórico da certificação */
    forCert: function (certId, kind, n) {
      var st = A.store.get();
      var prof = profileFromAttempts(st.attempts, certId);
      var done = kind === "videos" ? st.videosDone : kind === "lessons" ? st.lessonsDone : st.resDone;
      return { profile: prof, items: rank(kind, prof, certId, n, { lang: st.profile.lang, done: done }) };
    },
    /* Recomendações para uma questão específica (matching direto por metadados) */
    forQuestion: function (q, kind, n) {
      var st = A.store.get();
      var done = kind === "videos" ? st.videosDone : kind === "lessons" ? st.lessonsDone : st.resDone;
      return rank(kind, profileFromQuestion(q), q.cert, n, { lang: st.profile.lang, done: done });
    },
    /* Rótulo legível do "por que": tags que casaram */
    whyText: function (why) {
      var parts = [];
      why.svc.slice(0, 3).forEach(function (s) { parts.push(A.svcName(s)); });
      why.top.slice(0, 2).forEach(function (t) { parts.push(A.topicName(t)); });
      return parts.join(" · ");
    },
    /* Fraquezas ordenadas para painéis: [{kind,slug,label,need}] */
    weaknesses: function (certId, n) {
      var prof = profileFromAttempts(A.store.get().attempts, certId), out = [];
      Object.keys(prof.svc).forEach(function (s) { out.push({ kind: "svc", slug: s, label: A.svcName(s), need: prof.svc[s] }); });
      Object.keys(prof.top).forEach(function (t) { out.push({ kind: "top", slug: t, label: A.topicName(t), need: prof.top[t] * 0.9 }); });
      out.sort(function (a, b) { return b.need - a.need; });
      return out.slice(0, n || 8);
    },
    /* Desempenho por domínio: [{d, name, weight, total, ok, pct}] */
    domainStats: function (certId) {
      var c = A.certById(certId), st = A.store.get(), agg = {};
      st.attempts.forEach(function (at) {
        if (at.cert !== certId) return;
        at.answers.forEach(function (an) {
          var q = A.qById[an.qid]; if (!q) return;
          var o = agg[q.d] = agg[q.d] || { total: 0, ok: 0 };
          o.total++; if (an.ok) o.ok++;
        });
      });
      return c.domains.map(function (d, i) {
        var o = agg[i + 1] || { total: 0, ok: 0 };
        return { d: i + 1, name: d[0], weight: d[1], total: o.total, ok: o.ok, pct: o.total ? Math.round(100 * o.ok / o.total) : null };
      });
    }
  };
})();
