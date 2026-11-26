/* AATAA core: tiny helpers + reusable screens. No frameworks, no build step. */
(function () {
  'use strict';
  var A = window.AATAA = { games: [], data: {}, picks: null, seen: [], cleanups: [], cur: null };

  A.S = { count: 5, pack: 'avengers', players: [], age: 'mixed', vibes: [], time: 20, sound: true };

  /* ---------- tiny utils ---------- */
  A.$ = function (s, r) { return (r || document).querySelector(s); };
  A.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  A.rand = function (n) { return Math.floor(Math.random() * n); };
  A.pick = function (a) { return a[A.rand(a.length)]; };
  A.shuffle = function (a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = A.rand(i + 1); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };
  A.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ---------- saved preferences (localStorage only, optional) ---------- */
  A.save = function () {
    try {
      var S = A.S;
      localStorage.setItem('aataa.prefs', JSON.stringify({ count: S.count, pack: S.pack, age: S.age, vibes: S.vibes, time: S.time, sound: S.sound }));
    } catch (e) {}
  };
  A.load = function () {
    try {
      var p = JSON.parse(localStorage.getItem('aataa.prefs') || 'null');
      if (p) Object.keys(p).forEach(function (k) { A.S[k] = p[k]; });
    } catch (e) {}
  };

  /* ---------- age filtering: content items are strings or {t, m} where m = min age tier ---------- */
  A.ageRank = function () { return { teen: 0, young: 1, adult: 2, mixed: 0 }[A.S.age] || 0; };
  A.txt = function (x) { return typeof x === 'string' ? x : x.t; };
  A.ageOK = function (x) { return (typeof x === 'string' ? 0 : (x.m || 0)) <= A.ageRank(); };
  A.deck = function (arr) { return A.shuffle(arr.filter(A.ageOK).map(A.txt)); };

  /* ---------- players ---------- */
  A.makePlayers = function () {
    var pk = A.data.packs[A.S.pack];
    A.S.players = A.shuffle(pk.names).slice(0, A.S.count).map(function (n) { return { name: n[0], emoji: n[1] }; });
  };
  A.syncPlayers = function () {
    var S = A.S;
    if (!S.players.length) return A.makePlayers();
    if (S.players.length > S.count) S.players = S.players.slice(0, S.count);
    while (S.players.length < S.count) {
      var pk = A.data.packs[S.pack];
      var used = S.players.map(function (p) { return p.name; });
      var free = pk.names.filter(function (n) { return used.indexOf(n[0]) < 0; });
      var n = free.length ? A.pick(free) : ['Player ' + (S.players.length + 1), '🙂'];
      S.players.push({ name: n[0], emoji: n[1] });
    }
  };
  A.avatar = function (p) { return '<span class="av">' + p.emoji + '</span>'; };
  A.who = function (p) { return A.avatar(p) + '<b>' + A.esc(p.name) + '</b>'; };
  A.pchips = function (players, cls) {
    return players.map(function (p, i) {
      return '<button class="pchip ' + (cls || '') + '" data-i="' + i + '">' + A.who(p) + '</button>';
    }).join('');
  };

  /* ---------- timers/listeners that die when the screen changes ---------- */
  A.interval = function (fn, ms) { var id = setInterval(fn, ms); A.cleanups.push(function () { clearInterval(id); }); return id; };
  A.timeout = function (fn, ms) { var id = setTimeout(fn, ms); A.cleanups.push(function () { clearTimeout(id); }); return id; };
  A.onCleanup = function (fn) { A.cleanups.push(fn); };
  A.cleanup = function () {
    var c = A.cleanups; A.cleanups = [];
    c.forEach(function (f) { try { f(); } catch (e) {} });
  };

  /* ---------- the one render function every screen uses ---------- */
  A.leave = function () { if (confirm('Leave this game?')) A.showPicks(); };

  A.render = function (html, handlers, opts) {
    opts = opts || {};
    A.cleanup();
    var app = A.$('#app');
    app.innerHTML = '<section class="screen ' + (opts.cls || '') + '">' + html + '</section>';
    window.scrollTo(0, 0);
    Object.keys(handlers || {}).forEach(function (sel) {
      A.$$(sel, app).forEach(function (el) {
        el.addEventListener('click', function (ev) { A.unlockAudio(); handlers[sel](ev, el); });
      });
    });
    var back = opts.back !== undefined ? opts.back : (A.cur ? A.leave : null);
    var b = A.$('#back');
    b.hidden = !back;
    b.onclick = back || null;
    A.$('#title').textContent = opts.title || (A.cur ? A.cur.name : 'AATAA');
    document.body.dataset.theme = opts.theme || '';
  };

  A.toast = function (msg) {
    var t = A.$('#toast');
    t.textContent = msg; t.hidden = false;
    t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
    clearTimeout(A._tt);
    A._tt = setTimeout(function () { t.hidden = true; }, 1400);
  };

  /* ---------- sound / vibration / wake lock ---------- */
  var ac;
  A.unlockAudio = function () {
    if (!A.S.sound) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
    } catch (e) {}
  };
  A.beep = function (f, ms, type, vol) {
    if (!A.S.sound || !ac) return;
    try {
      var o = ac.createOscillator(), g = ac.createGain(), d = (ms || 100) / 1000;
      o.type = type || 'sine'; o.frequency.value = f || 700;
      g.gain.value = vol == null ? 0.18 : vol;
      o.connect(g); g.connect(ac.destination);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + d);
      o.start(); o.stop(ac.currentTime + d + 0.02);
    } catch (e) {}
  };
  A.buzz = function (p) { if (A.S.sound && navigator.vibrate) { try { navigator.vibrate(p); } catch (e) {} } };

  var wl = null;
  A.keepAwake = function () {
    A.keepOn = true;
    try {
      if ('wakeLock' in navigator && !wl) {
        navigator.wakeLock.request('screen').then(function (l) { wl = l; l.addEventListener('release', function () { wl = null; }); }).catch(function () {});
      }
    } catch (e) {}
  };
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && A.keepOn) A.keepAwake();
  });

  /* ---------- reusable building blocks ---------- */
  A.chip = function (g, v, label, on) {
    return '<button class="chip' + (on ? ' on' : '') + '" data-g="' + g + '" data-v="' + A.esc(v) + '">' + label + '</button>';
  };
  // single-select chip group bound to an options object
  A.chipHandler = function (obj, after) {
    return function (e, el) {
      var g = el.dataset.g, v = el.dataset.v;
      if (typeof obj[g] === 'number') v = +v;
      obj[g] = v;
      A.$$('.chip[data-g="' + g + '"]').forEach(function (c) { c.classList.toggle('on', c === el); });
      if (after) after(g, v);
    };
  };

  // 3-2-1 style countdown that writes into `el`
  A.countdown = function (el, from, done) {
    var n = from;
    el.textContent = n; A.beep(520, 120);
    var id = A.interval(function () {
      n--;
      if (n > 0) { el.textContent = n; A.beep(520, 120); }
      else { clearInterval(id); A.beep(900, 300); if (done) done(); }
    }, 1000);
  };

  // "Pass the phone to X" screen
  A.pass = function (p, o) {
    o = o || {};
    A.render('<div class="center"><p class="eyebrow">' + (o.title || 'Pass the phone to') + '</p>' +
      '<div class="bigav">' + p.emoji + '</div><h1>' + A.esc(p.name) + '</h1>' +
      (o.sub ? '<p class="mute">' + o.sub + '</p>' : '') +
      '<button class="btn primary big" id="ok">' + (o.btn || ("I'm " + A.esc(p.name) + ' →')) + '</button></div>',
      { '#ok': o.onTap });
  };

  // hold-to-reveal secret screen (stops shoulder surfers)
  A.secret = function (o) {
    A.render('<div class="center"><div class="who">' + A.who(o.player) + '</div>' +
      '<div class="secret" id="sec"><div class="cover">👀<br>Hold to reveal</div><div class="body">' + o.html + '</div></div>' +
      '<p class="mute small">Release to hide. Only ' + A.esc(o.player.name) + ' should be looking!</p>' +
      '<button class="btn primary big" id="fin" disabled>' + (o.done || 'Got it — hide &amp; pass') + '</button></div>',
      { '#fin': o.onDone });
    var sec = A.$('#sec'), fin = A.$('#fin');
    function open() { sec.classList.add('open'); fin.disabled = false; }
    function shut() { sec.classList.remove('open'); }
    sec.addEventListener('pointerdown', function (e) { e.preventDefault(); A.unlockAudio(); open(); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (t) { sec.addEventListener(t, shut); });
    sec.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    // keyboard fallback for desktop testing
    sec.tabIndex = 0;
    sec.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); open(); } });
    sec.addEventListener('keyup', shut);
  };

  // pass a secret to each player in turn
  A.passAround = function (players, htmlFn, done, o) {
    o = o || {};
    var i = 0;
    (function step() {
      if (i >= players.length) return done();
      var p = players[i], last = i === players.length - 1;
      A.pass(p, {
        sub: o.sub,
        onTap: function () {
          A.secret({
            player: p, html: htmlFn(p, i),
            done: last ? (o.last || 'Got it — hide it') : 'Got it — hide &amp; pass',
            onDone: function () { i++; step(); }
          });
        }
      });
    })();
  };

  // end-of-game leaderboard
  A.results = function (o) {
    var rows = A.S.players.map(function (p, i) { return { p: p, s: o.scores[i] }; }).sort(function (a, b) { return b.s - a.s; });
    var medals = ['🥇', '🥈', '🥉'];
    A.render('<div class="center"><div class="bigav">' + (o.emoji || '🏆') + '</div><h1>' + o.title + '</h1>' +
      '<ol class="board">' + rows.map(function (r, i) {
        return '<li><span class="m">' + (medals[i] || '') + '</span><span class="nm">' + A.who(r.p) + '</span><span class="pts">' + r.s + ' ' + (o.unit || 'pts') + '</span></li>';
      }).join('') + '</ol>' +
      (o.line ? '<p class="mute">' + o.line(rows) + '</p>' : '') +
      '<div class="stack"><button class="btn primary big" id="again">' + (o.againLabel || 'Play again') + '</button>' +
      '<button class="btn ghost" id="home">Pick another game</button></div></div>',
      { '#again': o.again, '#home': function () { A.showPicks(); } });
  };
})();
