/* AATAA: setup screen -> game picks -> how-to-play -> game */
(function () {
  'use strict';
  var A = window.AATAA, S = A.S;

  var VIBES = [['funny', '😂', 'Funny'], ['brainy', '🧠', 'Brainy'], ['teasing', '😏', 'Teasing'],
               ['active', '🏃', 'Active'], ['sneaky', '🕵️', 'Sneaky'], ['chill', '😌', 'Chill']];
  var AGES = [['teen', 'Teens'], ['young', '18–25'], ['adult', '25+'], ['mixed', 'Mixed']];
  var TIMES = [[10, '10 min'], [20, '20 min'], [30, '30+ min']];

  /* ---------------- setup ---------------- */
  A.showSetup = function () {
    A.cur = null;
    A.syncPlayers();

    var html =
      '<div class="hero"><h1 class="logo">AATAA</h1>' +
      '<p class="mute">Silent room? Not for long.<br>Tell us about your crowd and we’ll pick the games.</p></div>' +

      '<div class="card"><div class="row between"><h3>How many people?</h3>' +
      '<div class="stepper"><button id="minus" aria-label="fewer">−</button><b id="cnt">' + S.count + '</b><button id="plus" aria-label="more">+</button></div></div>' +
      '<p class="label">Everyone gets a nickname so it’s easy to remember who’s who</p>' +
      '<div class="chips">' + Object.keys(A.data.packs).map(function (k) {
        var p = A.data.packs[k]; return A.chip('pack', k, p.icon + ' ' + p.label, S.pack === k);
      }).join('') + '</div>' +
      '<div class="pgrid sm" id="plist"></div>' +
      '<p class="mute small">Tap a name to rename · <button class="link" id="shuf">🔀 shuffle names</button></p></div>' +

      '<div class="card"><h3>Age group</h3><div class="chips">' +
      AGES.map(function (a) { return A.chip('age', a[0], a[1], S.age === a[0]); }).join('') +
      '</div><p class="mute small">“Mixed” keeps everything family-friendly.</p></div>' +

      '<div class="card"><h3>What’s the vibe?</h3><p class="mute small">Pick any. Pick none for a surprise.</p><div class="chips">' +
      VIBES.map(function (v) {
        return '<button class="chip vibe' + (S.vibes.indexOf(v[0]) >= 0 ? ' on' : '') + '" data-v="' + v[0] + '">' + v[1] + ' ' + v[2] + '</button>';
      }).join('') + '</div></div>' +

      '<div class="card"><h3>How long do you have?</h3><div class="chips">' +
      TIMES.map(function (t) { return A.chip('time', t[0], t[1], S.time === t[0]); }).join('') +
      '</div></div>' +

      '<button class="btn primary big" id="go">Find our games →</button>' +
      '<p class="mute small foot">One phone, passed around. Works offline. No sign-up, no ads, no tracking.</p>';

    A.render(html, {
      '#minus': function () { step(-1); },
      '#plus': function () { step(1); },
      '#shuf': function () { A.makePlayers(); draw(); },
      '.chip[data-g]': function (e, el) {
        var g = el.dataset.g, v = el.dataset.v;
        S[g] = g === 'time' ? +v : v;
        A.$$('.chip[data-g="' + g + '"]').forEach(function (c) { c.classList.toggle('on', c === el); });
        if (g === 'pack') { A.makePlayers(); draw(); }
        A.save();
      },
      '.vibe': function (e, el) {
        var v = el.dataset.v, i = S.vibes.indexOf(v);
        if (i >= 0) S.vibes.splice(i, 1); else S.vibes.push(v);
        el.classList.toggle('on', i < 0);
        A.save();
      },
      '#go': function () { A.keepAwake(); A.seen = []; A.newPicks(); }
    }, { back: null, title: 'AATAA' });
    draw();

    function step(d) {
      S.count = Math.max(2, Math.min(12, S.count + d));
      A.$('#cnt').textContent = S.count;
      A.syncPlayers(); draw(); A.save();
    }
    function draw() {
      var box = A.$('#plist');
      box.innerHTML = A.pchips(S.players);
      A.$$('.pchip', box).forEach(function (b) {
        b.onclick = function () {
          var p = S.players[+b.dataset.i];
          var n = prompt('Rename ' + p.name + ' to:', p.name);
          if (n && n.trim()) { p.name = n.trim().slice(0, 14); draw(); }
        };
      });
    }
  };

  /* ---------------- picks ---------------- */
  A.newPicks = function () {
    A.picks = A.recommend();
    A.picks.forEach(function (x) { if (A.seen.indexOf(x.g.id) < 0) A.seen.push(x.g.id); });
    A.showPicks();
  };

  A.showPicks = function () {
    A.cur = null;
    if (!A.picks) return A.showSetup();
    var n = S.players.length;
    var cards = A.picks.map(function (x) {
      var g = x.g;
      return '<div class="pick">' +
        '<div class="ribbon">' + x.role.label + '</div>' +
        '<div class="row"><div class="gem">' + g.emoji + '</div><div><h2>' + A.esc(g.name) + '</h2><p class="mute">' + A.esc(g.tagline) + '</p></div></div>' +
        '<div class="meta"><span>👥 ' + g.min + '–' + g.max + '</span><span>⏱ ~' + g.mins[0] + '–' + g.mins[1] + ' min</span></div>' +
        '<p class="why">✨ ' + A.esc(x.why) + (x.role.note ? '. ' + A.esc(x.role.note) : '') + '</p>' +
        '<button class="btn primary" data-play="' + g.id + '">Let’s play</button></div>';
    }).join('');

    var all = A.games.filter(A.fits).map(function (g) {
      return '<button class="listrow" data-play="' + g.id + '"><span class="gem sm">' + g.emoji + '</span><span><b>' + A.esc(g.name) + '</b><br><small class="mute">' + A.esc(g.tagline) + '</small></span></button>';
    }).join('');

    A.render(
      '<div class="hero left"><p class="eyebrow">For ' + n + ' people</p><h1>Try this order 👇</h1>' +
      '<p class="mute">Start gentle, build up, end loud. Or ignore us and pick anything.</p></div>' +
      cards +
      '<div class="stack"><button class="btn ghost" id="other">🔀 Show me other games</button>' +
      '<button class="btn ghost" id="edit">⚙️ Change the setup</button></div>' +
      '<details class="all"><summary>See all games for ' + n + ' people</summary>' + all + '</details>',
      {
        '[data-play]': function (e, el) { A.intro(A.games.filter(function (g) { return g.id === el.dataset.play; })[0]); },
        '#other': function () { A.newPicks(); },
        '#edit': function () { A.showSetup(); }
      },
      { back: function () { A.showSetup(); }, title: 'AATAA' }
    );
  };

  /* ---------------- how to play ---------------- */
  A.intro = function (g) {
    A.cur = null;
    A.render(
      '<div class="center"><div class="bigav">' + g.emoji + '</div><h1>' + A.esc(g.name) + '</h1>' +
      '<p class="mute">' + A.esc(g.tagline) + '</p>' +
      '<div class="card howto"><h3>How to play</h3><ol>' + g.rules.map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ol></div>' +
      '<button class="btn primary big" id="start">Start game</button></div>',
      { '#start': function () { A.cur = g; g.start(); } },
      { back: function () { A.showPicks(); }, title: g.name }
    );
  };

  /* ---------------- boot ---------------- */
  A.load();
  A.$('#snd').textContent = S.sound ? '🔊' : '🔇';
  A.$('#snd').onclick = function () {
    S.sound = !S.sound; A.save();
    A.$('#snd').textContent = S.sound ? '🔊' : '🔇';
    A.unlockAudio();
  };
  A.showSetup();

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
})();
