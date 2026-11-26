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

  // each game gets its own colour pair, used for buttons, glows and highlights
  A.accents = {
    likely: ['#ff4d8d', '#ff9a3c'], wyr: ['#5b8cff', '#a855f7'], riddles: ['#2ee6c5', '#5b8cff'],
    imposter: ['#a855f7', '#ff4d8d'], mystery: ['#ffd23f', '#ff8a3c'], tod: ['#ff4d8d', '#8b5cf6'],
    bomb: ['#ff5468', '#ff9a3c'], charades: ['#34d399', '#2ee6c5'], _: ['#ff4d8d', '#ff9a3c']
  };
  A.accentFor = function (id) { return A.accents[id] || A.accents._; };
  A.setAccent = function (id) {
    var ac = A.accentFor(id), r = document.documentElement.style;
    r.setProperty('--a1', ac[0]); r.setProperty('--a2', ac[1]);
  };

  A.render = function (html, handlers, opts) {
    opts = opts || {};
    A.cleanup();
    var app = A.$('#app');
    app.innerHTML = '<section class="screen ' + (opts.cls || '') + '">' + html + '</section>';
    window.scrollTo(0, 0);
    Object.keys(handlers || {}).forEach(function (sel) {
      A.$$(sel, app).forEach(function (el) {
        el.addEventListener('click', function (ev) { A.unlockAudio(); A.buzz(6); handlers[sel](ev, el); });
      });
    });
    var back = opts.back !== undefined ? opts.back : (A.cur ? A.leave : null);
    var b = A.$('#back');
    b.hidden = !back;
    b.onclick = back || null;
    var ingame = !!A.cur;
    A.$('#title').textContent = opts.title || (ingame ? A.cur.name : 'AATAA');
    document.body.dataset.theme = opts.theme || '';
    document.body.dataset.mode = opts.mode || (ingame ? 'game' : 'app');
    A.setAccent(opts.accentId || (A.cur && A.cur.id) || '_');
  };

  /* ---------- confetti (canvas, ~2s, respects reduced motion) ---------- */
  A.confetti = function (count) {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var cv = A.$('#fx'); if (!cv) return;
    var W = cv.width = innerWidth, H = cv.height = innerHeight, x = cv.getContext('2d');
    var cols = ['#ff4d8d', '#ff9a3c', '#ffd23f', '#2ee6c5', '#5b8cff', '#a855f7'];
    var ps = []; count = count || 110;
    for (var i = 0; i < count; i++) {
      ps.push({ x: W / 2 + (Math.random() - .5) * 80, y: H * .42, vx: (Math.random() - .5) * 15, vy: -Math.random() * 16 - 4,
        s: 6 + Math.random() * 7, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: cols[i % cols.length], life: 0 });
    }
    var t0 = performance.now();
    (function frame(t) {
      var el = t - t0; x.clearRect(0, 0, W, H);
      ps.forEach(function (p) {
        p.vy += .38; p.vx *= .992; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        x.save(); x.globalAlpha = Math.max(0, 1 - el / 2200); x.translate(p.x, p.y); x.rotate(p.r);
        x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .6); x.restore();
      });
      if (el < 2300) requestAnimationFrame(frame); else x.clearRect(0, 0, W, H);
    })(t0);
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
  A.buzz = function (p) {
    var ua = navigator.userActivation;
    if (A.S.sound && navigator.vibrate && (!ua || ua.hasBeenActive)) { try { navigator.vibrate(p); } catch (e) {} }
  };

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
    function bump() { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; }
    el.textContent = n; A.beep(520, 120);
    var id = A.interval(function () {
      n--;
      if (n > 0) { el.textContent = n; bump(); A.beep(520, 120); A.buzz(15); }
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

  // end-of-game leaderboard, with funny group-chat-worthy titles and a share card
  A.results = function (o) {
    var rows = A.S.players.map(function (p, i) { return { p: p, s: o.scores[i] }; }).sort(function (a, b) { return b.s - a.s; });
    var medals = ['🥇', '🥈', '🥉'];
    var badges = [];                       // [{p, text}]
    if (o.titles && rows.length > 1 && rows[0].s > rows[rows.length - 1].s) {
      badges.push({ p: rows[0].p, text: A.pick(o.titles[0]) });
      badges.push({ p: rows[rows.length - 1].p, text: A.pick(o.titles[1]) });
    }
    var shareLines = rows.slice(0, 3).map(function (r, i) { return medals[i] + ' ' + r.p.emoji + ' ' + r.p.name + ' — ' + r.s + ' ' + (o.unit || 'pts'); });
    badges.forEach(function (b) { shareLines.push('🏷️ ' + b.p.name + ': ' + b.text); });

    var unit = o.unit || 'pts', podium = '', rest = rows;
    if (rows.length >= 3) {
      podium = '<div class="podium">' + [1, 0, 2].map(function (k) {
        var r = rows[k];
        return '<div class="pod p' + (k + 1) + '"><div class="pav">' + r.p.emoji + '</div><div class="pname">' + A.esc(r.p.name) + '</div>' +
          '<div class="pbar"><span class="pm">' + medals[k] + '</span><b>' + r.s + '</b><small>' + unit + '</small></div></div>';
      }).join('') + '</div>';
      rest = rows.slice(3);
    }
    setTimeout(function () { if (rows[0].s > 0) { A.confetti(); A.buzz([40, 30, 40]); } }, 350);
    A.render('<div class="center results"><div class="bigav">' + (o.emoji || '🏆') + '</div><h1>' + o.title + '</h1>' + podium +
      (rest.length ? '<ol class="board">' + rest.map(function (r, i) {
        var idx = rows.indexOf(r);
        return '<li><span class="m">' + (medals[idx] || (idx + 1)) + '</span><span class="nm">' + A.who(r.p) + '</span><span class="pts">' + r.s + ' ' + unit + '</span></li>';
      }).join('') + '</ol>' : '') +
      (badges.length ? '<div class="badges">' + badges.map(function (b) { return '<div class="badge">🏷️ ' + A.who(b.p) + ' <span>' + A.esc(b.text) + '</span></div>'; }).join('') + '</div>' : '') +
      (o.line ? '<p class="mute">' + o.line(rows) + '</p>' : '') +
      '<div class="stack"><button class="btn primary big" id="again">' + (o.againLabel || 'Play again') + '</button>' +
      '<button class="btn ghost" id="share">📤 Share this result</button>' +
      '<button class="btn ghost" id="home">Pick another game</button></div></div>',
      {
        '#again': o.again,
        '#share': function () { A.shareCard(String(o.title).replace(/<[^>]+>/g, ''), o.emoji || '🏆', shareLines); },
        '#home': function () { A.showPicks(); }
      });
  };

  /* ---------- brand: start jingle ---------- */
  A.jingle = function () {
    A.unlockAudio();
    [[523, 0], [659, 110], [784, 220], [1047, 330]].forEach(function (n) {
      setTimeout(function () { A.beep(n[0], 160, 'triangle', 0.16); }, n[1]);
    });
    A.buzz([30, 40, 30]);
  };

  /* ---------- sharing (all client-side) ---------- */
  A.siteUrl = function () { return location.origin + location.pathname.replace(/index\.html$/, ''); };

  A.invite = function () {
    var url = A.siteUrl();
    var text = 'Silent room? AATAA shuru. 🎉 Party games on one phone, no sign-up, works offline:';
    if (navigator.share) {
      navigator.share({ title: 'AATAA', text: text, url: url }).catch(function () {});
    } else {
      window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + url), '_blank', 'noopener');
    }
  };

  // draws a 1080x1080 result card on a canvas and shares it as an image (falls back to text)
  A.shareCard = function (title, emoji, lines) {
    var url = A.siteUrl();
    var text = 'We just played ' + title + ' on AATAA 🎉\n' + lines.join('\n') + '\n\nPlay with your gang: ' + url;
    var c = document.createElement('canvas'); c.width = 1080; c.height = 1080;
    var x = c.getContext('2d');
    var g = x.createLinearGradient(0, 0, 1080, 1080);
    g.addColorStop(0, '#2a1763'); g.addColorStop(0.55, '#150f33'); g.addColorStop(1, '#3b0f3a');
    x.fillStyle = g; x.fillRect(0, 0, 1080, 1080);
    var glow = x.createRadialGradient(900, 100, 10, 900, 100, 520);
    glow.addColorStop(0, 'rgba(255,77,141,.35)'); glow.addColorStop(1, 'rgba(255,77,141,0)');
    x.fillStyle = glow; x.fillRect(0, 0, 1080, 1080);

    x.textAlign = 'center'; x.fillStyle = '#fff';
    x.font = '900 70px system-ui, Arial, sans-serif';
    var lg = x.createLinearGradient(380, 0, 700, 0); lg.addColorStop(0, '#ff4d8d'); lg.addColorStop(1, '#ffd23f');
    x.fillStyle = lg; x.fillText('A A T A A', 540, 120);
    x.font = '170px system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
    x.fillStyle = '#fff'; x.fillText(emoji, 540, 330);
    x.font = '800 62px system-ui, Arial, sans-serif';
    x.fillText(title.length > 26 ? title.slice(0, 25) + '…' : title, 540, 430);

    x.textAlign = 'left';
    var y = 540;
    lines.slice(0, 6).forEach(function (ln) {
      x.fillStyle = 'rgba(255,255,255,.09)';
      x.beginPath(); (x.roundRect ? x.roundRect(110, y - 54, 860, 84, 24) : x.rect(110, y - 54, 860, 84)); x.fill();
      x.fillStyle = '#fff'; x.font = '600 38px system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
      var t = ln.length > 40 ? ln.slice(0, 39) + '…' : ln;
      x.fillText(t, 140, y + 2);
      y += 100;
    });
    x.textAlign = 'center'; x.fillStyle = '#a9a1d4'; x.font = '600 34px system-ui, Arial, sans-serif';
    x.fillText('Silent room? AATAA shuru.', 540, 1010);

    c.toBlob(function (blob) {
      try {
        var file = new File([blob], 'aataa-result.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], text: text }).catch(function () {});
          return;
        }
      } catch (e) {}
      if (navigator.share) { navigator.share({ title: 'AATAA', text: text }).catch(function () {}); return; }
      // desktop fallback: download the image and open WhatsApp with the text
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'aataa-result.png'; a.click();
      A.toast('Image saved — attach it in your chat');
      setTimeout(function () { window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener'); }, 600);
    }, 'image/png');
  };
})();
