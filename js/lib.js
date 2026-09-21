/* Utilitários, renderizador markdown mínimo e store de progresso (localStorage). */
(function () {
  var A = (window.AWSPREP = window.AWSPREP || {});

  A.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  A.$ = function (sel, root) { return (root || document).querySelector(sel); };
  A.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  A.fmtDate = function (t) { return new Date(t).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }); };
  A.fmtTime = function (sec) {
    sec = Math.max(0, Math.round(sec));
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return (h ? h + ":" : "") + (h ? String(m).padStart(2, "0") : m) + ":" + String(s).padStart(2, "0");
  };
  A.shuffle = function (arr, rnd) {
    rnd = rnd || Math.random;
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };
  /* Ícones de traço (24x24, estilo minimalista); herdam a cor do texto via currentColor */
  var ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7"/>',
    exam: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13l2 2 4-4M9 18h6"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z" fill="currentColor"/>',
    tri: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
    repeat: '<path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    check: '<path d="M4 12.5l5 5L20 6.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h0"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h0"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    layers: '<path d="M12 3 3 8l9 5 9-5zM3 13l9 5 9-5"/>'
  };
  A.icon = function (name, cls) {
    return '<svg class="i' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || "") + "</svg>";
  };

  A.svcName = function (slug) { return (A.services[slug] && A.services[slug][0]) || slug; };
  A.topicName = function (slug) { return A.topics[slug] || slug; };
  A.svcIcon = function (slug) {
    return (A.serviceIcons && A.serviceIcons[slug]) ? '<img class="svc-ico" src="icons/services/' + slug + '.svg" alt="" loading="lazy">' : "";
  };
  var RES_TYPE_LABELS = { whitepaper: "Whitepaper", docs: "Documentação oficial", skillbuilder: "AWS Skill Builder", lab: "Lab / ferramenta", practice: "Simulado oficial" };
  A.resTypeLabel = function (t) { return RES_TYPE_LABELS[t] || t; };

  /* ---------- Markdown mínimo: ##/###, listas, **negrito**, `código`, tabelas, > dicas ---------- */
  function inline(s) {
    s = A.esc(s);
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
    return s;
  }
  A.md = function (src) {
    var lines = String(src).replace(/\r/g, "").split("\n"), out = [], i = 0, list = null;
    function closeList() { if (list) { out.push("</" + list + ">"); list = null; } }
    while (i < lines.length) {
      var l = lines[i];
      if (/^\s*$/.test(l)) { closeList(); i++; continue; }
      var m;
      if ((m = l.match(/^(#{2,4})\s+(.*)$/))) { closeList(); out.push("<h" + m[1].length + ">" + inline(m[2]) + "</h" + m[1].length + ">"); i++; continue; }
      if (/^\|.*\|\s*$/.test(l) && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1] || "")) {
        closeList();
        var head = l.trim().slice(1, -1).split("|").map(function (c) { return c.trim(); });
        var rows = []; i += 2;
        while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) { rows.push(lines[i].trim().slice(1, -1).split("|").map(function (c) { return c.trim(); })); i++; }
        out.push('<div class="tbl"><table><thead><tr>' + head.map(function (c) { return "<th>" + inline(c) + "</th>"; }).join("") + "</tr></thead><tbody>" +
          rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + inline(c) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>");
        continue;
      }
      if ((m = l.match(/^>\s?(.*)$/))) {
        closeList();
        var q = [m[1]]; i++;
        while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, "")); i++; }
        var txt = q.join(" ");
        var kind = /^\*\*(Dica|Pegadinha|Atenção|Exame)/i.test(txt) ? (/Pegadinha|Atenção/i.test(txt.slice(0, 14)) ? "warn" : "tip") : "note";
        out.push('<blockquote class="' + kind + '">' + inline(txt) + "</blockquote>");
        continue;
      }
      if ((m = l.match(/^\s*[-*]\s+(.*)$/))) {
        if (list !== "ul") { closeList(); out.push("<ul>"); list = "ul"; }
        out.push("<li>" + inline(m[1]) + "</li>"); i++; continue;
      }
      if ((m = l.match(/^\s*\d+\.\s+(.*)$/))) {
        if (list !== "ol") { closeList(); out.push("<ol>"); list = "ol"; }
        out.push("<li>" + inline(m[1]) + "</li>"); i++; continue;
      }
      closeList();
      var p = [l]; i++;
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{2,4}\s|\s*[-*]\s|\s*\d+\.\s|>|\|)/.test(lines[i])) { p.push(lines[i]); i++; }
      out.push("<p>" + inline(p.join(" ")) + "</p>");
    }
    closeList();
    return out.join("\n");
  };

  /* ---------- Store ---------- */
  var KEY = "awsprep.v1";
  var mem = null;
  function blank() { return { profile: { cert: null, lang: "pt", created: Date.now() }, attempts: [], lessonsDone: {}, videosDone: {}, bookmarks: {}, notes: {}, resDone: {} }; }
  function load() {
    if (mem) return mem;
    try { mem = JSON.parse(localStorage.getItem(KEY)) || blank(); } catch (e) { mem = blank(); }
    ["attempts", "lessonsDone", "videosDone", "bookmarks", "notes", "resDone"].forEach(function (k) { if (!mem[k]) mem[k] = k === "attempts" ? [] : {}; });
    if (!mem.profile) mem.profile = blank().profile;
    return mem;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* modo privado/sem storage: segue em memória */ } }
  A.store = {
    get: load, save: save,
    setCert: function (id) { load().profile.cert = id; save(); },
    setLang: function (l) { load().profile.lang = l; save(); },
    addAttempt: function (a) { load().attempts.push(a); save(); },
    toggle: function (bucket, id) { var b = load()[bucket]; if (b[id]) delete b[id]; else b[id] = Date.now(); save(); return !!b[id]; },
    has: function (bucket, id) { return !!load()[bucket][id]; },
    reset: function () { mem = blank(); save(); },
    exportJson: function () { return JSON.stringify(load(), null, 2); },
    importJson: function (txt) { var o = JSON.parse(txt); if (!o || !o.attempts) throw new Error("Arquivo inválido"); mem = o; save(); }
  };
})();
