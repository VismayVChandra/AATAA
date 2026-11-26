/* AATAA: home -> 4-step crowd wizard -> lineup -> how-to-play -> game */
(function () {
  'use strict';
  var A = window.AATAA, S = A.S;

  var VIBES = [
    ['funny', '😂', 'Funny', 'Laugh till it hurts'], ['brainy', '🧠', 'Brainy', 'Think hard, brag harder'],
    ['teasing', '😏', 'Teasing', 'Friendly roasting'], ['active', '🏃', 'Active', 'Get off the couch'],
    ['sneaky', '🕵️', 'Sneaky', 'Lies, bluffs, secrets'], ['chill', '😌', 'Chill', 'Easy and relaxed']
  ];
  var AGES = [
    ['teen', '🎒', 'Teens', 'Keeps it clean'], ['young', '🎓', '18–25', 'College and early career'],
    ['adult', '💼', '25+', 'Grown-up banter'], ['mixed', '🌈', 'Mixed', 'Family-friendly for all']
  ];
  var TIMES = [
    [10, '⚡', 'Quick', '~10 min · a round or two'], [20, '🔥', 'Good while', '~20 min · a proper session'],
    [30, '🌙', 'All night', '30+ min · settle in']
  ];

  // PWA install button (Chrome / Android)
  var installEvt = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); installEvt = e;
    var b = A.$('#install'); if (b) b.hidden = false;
  });

  /* ---------------- home ---------------- */
  A.showHome = function () {
    A.cur = null;
    // floaters live only in the top and bottom bands so they never sit on the text
    var fl = [['🕵️', '5%', '1%', 46, 7, 0], ['🔍', '40%', '0%', 34, 6.5, -1], ['💣', '76%', '2%', 50, 8, -2],
              ['🧩', '6%', '88%', 42, 7.5, -2], ['🎡', '44%', '92%', 40, 8.5, -4], ['⚖️', '80%', '88%', 40, 7, -5]];
    var names = A.games.map(function (g) { return '<span>' + g.emoji + ' ' + A.esc(g.name) + '</span>'; }).join('');

    A.render(
      '<div class="home"><div class="floaters">' + fl.map(function (f) {
        return '<span class="fl" style="--x:' + f[1] + ';--y:' + f[2] + ';--s:' + f[3] + 'px;--d:' + f[4] + 's;--dl:' + f[5] + 's">' + f[0] + '</span>';
      }).join('') + '</div>' +
      '<p class="eyebrow">Party games · one phone</p>' +
      '<h1 class="logo xl" aria-label="AATAA"><span>A</span><span>A</span><span class="tbl">T</span><span>A</span><span>A</span></h1>' +
      '<p class="tagline">Silent room? <b>AATAA shuru.</b></p>' +
      '<p class="sub">Tell us who’s in the room. We’ll pick the games and run them right from your phone.</p>' +
      '<div class="pillrow"><span class="pill">' + A.games.length + ' games</span><span class="pill">No sign-up</span><span class="pill">Works offline</span>' +
      (A.streak() >= 2 ? '<span class="pill hot">🔥 ' + A.streak() + '-day streak</span>' : '') + '</div>' +
      '<button class="btn primary big glow" id="start" style="max-width:340px">AATAA shuru! →</button>' +
      (S.ready ? '<button class="btn ghost" id="again" style="max-width:340px">⚡ Same crowd as last time · ' + S.players.length + ' people</button>' : '') +
      '<button class="link" id="install" hidden>⬇ Install the app</button>' +
      '<div class="ticker"><div class="track">' + names + names + '</div></div></div>',
      {
        '#start': function () { A.jingle(); wizard(0); },
        '#again': function () { A.syncPlayers(); finish(); },
        '#install': function () { if (installEvt) { installEvt.prompt(); installEvt = null; A.$('#install').hidden = true; } }
      },
      { back: null, mode: 'home', title: 'AATAA' }
    );
    if (installEvt) A.$('#install').hidden = false;
  };

  /* ---------------- wizard ---------------- */
  function prog(step) {
    var s = '';
    for (var i = 0; i < 4; i++) s += '<div class="seg' + (i <= step ? ' on' : '') + '"></div>';
    return '<div class="prog">' + s + '</div>';
  }
  function tile(g, v, e, title, sub, on, one) {
    return '<button class="tile' + (on ? ' on' : '') + '" data-g="' + g + '" data-v="' + v + '"><span class="ck">✓</span>' +
      (one ? '<span class="e">' + e + '</span><div><b>' + title + '</b><small>' + sub + '</small></div>'
           : '<span class="e">' + e + '</span><b>' + title + '</b><small>' + sub + '</small>') + '</button>';
  }

  A.showSetup = function () { wizard(0); };

  function wizard(step) {
    A.cur = null; A.syncPlayers();
    var body = '', next = step < 3 ? 'Next →' : 'Find our games ✨';
    var h = {};

    if (step === 0) {
      body = '<div class="stagger"><h1 class="q">How many in <em>the squad?</em></h1>' +
        '<p class="mute">Everyone gets a nickname, so it’s easy to remember who’s who.</p>' +
        '<div class="count"><button class="rbtn" id="minus" aria-label="fewer">−</button><div class="bignum" id="cnt">' + S.count + '</div><button class="rbtn" id="plus" aria-label="more">+</button></div>' +
        '<div class="bubbles" id="plist"></div>' +
        '<p class="mute small" style="text-align:center">Tap a bubble to rename it</p>' +
        '<div class="packs">' + Object.keys(A.data.packs).map(function (k) {
          var p = A.data.packs[k]; return A.chip('pack', k, p.icon + ' ' + p.label, S.pack === k);
        }).join('') + '<button class="chip" id="shuf">🔀 Shuffle</button></div></div>';
      h['#minus'] = function () { step0(-1); };
      h['#plus'] = function () { step0(1); };
      h['#shuf'] = function () { A.makePlayers(); draw(); };
      h['.chip[data-g]'] = function (e, el) {
        S.pack = el.dataset.v;
        A.$$('.chip[data-g="pack"]').forEach(function (c) { c.classList.toggle('on', c === el); });
        A.makePlayers(); draw(); A.save();
      };
    } else if (step === 1) {
      body = '<div class="stagger"><h1 class="q">Who’s <em>in the room?</em></h1><p class="mute">We’ll tune the prompts to your age group.</p>' +
        '<div class="tiles">' + AGES.map(function (a) { return tile('age', a[0], a[1], a[2], a[3], S.age === a[0]); }).join('') + '</div></div>';
      h['.tile'] = function (e, el) {
        S.age = el.dataset.v; A.save();
        A.$$('.tile').forEach(function (t) { t.classList.toggle('on', t === el); });
      };
    } else if (step === 2) {
      body = '<div class="stagger"><h1 class="q">What’s the <em>vibe?</em></h1><p class="mute">Pick any. Pick none and we’ll surprise you.</p>' +
        '<div class="tiles">' + VIBES.map(function (v) { return tile('vibe', v[0], v[1], v[2], v[3], S.vibes.indexOf(v[0]) >= 0); }).join('') + '</div></div>';
      h['.tile'] = function (e, el) {
        var v = el.dataset.v, i = S.vibes.indexOf(v);
        if (i >= 0) S.vibes.splice(i, 1); else S.vibes.push(v);
        el.classList.toggle('on', i < 0); A.save();
      };
    } else {
      body = '<div class="stagger"><h1 class="q">How long <em>do you have?</em></h1><p class="mute">We’ll only suggest games that fit.</p>' +
        '<div class="tiles one">' + TIMES.map(function (t) { return tile('time', t[0], t[1], t[2], t[3], S.time === t[0], true); }).join('') + '</div></div>';
      h['.tile'] = function (e, el) {
        S.time = +el.dataset.v; A.save();
        A.$$('.tile').forEach(function (t) { t.classList.toggle('on', t === el); });
      };
    }
    h['#next'] = function () { if (step < 3) wizard(step + 1); else finish(); };

    A.render(prog(step) + body + '<div class="cta"><button class="btn primary big" id="next">' + next + '</button></div>', h,
      { back: function () { if (step) wizard(step - 1); else A.showHome(); }, mode: 'app', title: 'Your crowd' });
    if (step === 0) draw();

    function step0(d) {
      S.count = Math.max(2, Math.min(12, S.count + d));
      var c = A.$('#cnt'); c.textContent = S.count; c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop');
      A.syncPlayers(); draw(); A.save();
    }
    function draw() {
      var box = A.$('#plist');
      box.innerHTML = S.players.map(function (p, i) {
        return '<button class="bub" data-i="' + i + '" style="animation-delay:' + (i * 35) + 'ms"><i>' + p.emoji + '</i><span>' + A.esc(p.name) + '</span></button>';
      }).join('');
      A.$$('.bub', box).forEach(function (b) {
        b.onclick = function () {
          var p = S.players[+b.dataset.i];
          var n = prompt('Rename ' + p.name + ' to:', p.name);
          if (n && n.trim()) { p.name = n.trim().slice(0, 14); draw(); A.save(); }
        };
      });
    }
  }

  function finish() {
    A.keepAwake(); A.jingle(); A.seen = [];
    S.ready = true; A.save();
    var vibes = S.vibes.length ? S.vibes.map(A.vibeLabel).join(' + ') : 'surprise me';
    var t = S.time >= 30 ? '30+ min' : S.time + ' min';
    A.render('<div class="center"><div class="loader"><span>🎲</span><span>🕵️</span><span>💣</span><span>🎭</span></div>' +
      '<h2>Reading the room…</h2><p class="mute">' + S.players.length + ' people · ' + A.esc(vibes) + ' · ' + t + '</p></div>',
      {}, { back: null, mode: 'home', title: 'AATAA' });
    A.timeout(function () { A.newPicks(); }, 1400);
  }

  /* ---------------- lineup ---------------- */
  A.newPicks = function () {
    A.picks = A.recommend();
    A.picks.forEach(function (x) { if (A.seen.indexOf(x.g.id) < 0) A.seen.push(x.g.id); });
    A.showPicks();
  };

  function fav(id) {
    var on = A.isFav(id);
    return '<span class="favbtn' + (on ? ' on' : '') + '" role="button" aria-label="Favourite" data-fav="' + id + '">' + (on ? '♥' : '♡') + '</span>';
  }

  A.showPicks = function () {
    A.cur = null;
    if (!A.picks) return A.showHome();
    var n = S.players.length;
    var cards = A.picks.map(function (x, i) {
      var g = x.g, ac = A.accentFor(g.id);
      return '<div class="stepcard" style="--a1:' + ac[0] + ';--a2:' + ac[1] + '"><div class="num">' + (i + 1) + '</div>' +
        '<div class="pick"><span class="ribbon">' + x.role.label + '</span>' + fav(g.id) +
        '<div class="row"><div class="gem">' + g.emoji + '</div><div><h2>' + A.esc(g.name) + '</h2><p class="mute small">' + A.esc(g.tagline) + '</p></div></div>' +
        '<div class="meta"><span>👥 ' + g.min + '–' + g.max + '</span><span>⏱ ~' + g.mins[0] + '–' + g.mins[1] + ' min</span></div>' +
        '<p class="why"><b>' + A.esc(x.why) + '.</b> ' + A.esc(x.role.note) + '</p>' +
        '<button class="btn primary" data-play="' + g.id + '">Let’s play</button></div></div>';
    }).join('');

    function gtile(g) {
      var ac = A.accentFor(g.id);
      return '<button class="gtile" data-play="' + g.id + '" style="--a1:' + ac[0] + ';--a2:' + ac[1] + '"><span class="gem">' + g.emoji + '</span><b>' + A.esc(g.name) + '</b>' + fav(g.id) + '</button>';
    }
    var fits = A.games.filter(A.fits);
    var favGames = fits.filter(function (g) { return A.isFav(g.id); });
    var all = (favGames.length ? '<p class="label" style="grid-column:1/-1;margin:4px 0 0">⭐ Your favourites</p>' + favGames.map(gtile).join('') + '<p class="label" style="grid-column:1/-1;margin:8px 0 0">All games</p>' : '') +
      fits.map(gtile).join('');

    var d = A.daily(), dac = A.accentFor(d.game.id);
    var daily = '<div class="daily" style="--a1:' + dac[0] + ';--a2:' + dac[1] + '"><div class="row"><div class="gem sm">' + d.game.emoji + '</div>' +
      '<div><p class="eyebrow">🔥 AATAA of the day</p><h2 style="margin:0">' + A.esc(d.game.name) + '</h2></div></div>' +
      '<p class="why"><b>Today’s twist:</b> ' + A.esc(d.twist) + '</p>' +
      '<button class="btn ghost" data-play="' + d.game.id + '">Play it with the twist</button></div>';

    A.render(
      '<div class="introhero" style="align-items:flex-start;text-align:left"><p class="eyebrow">Tonight · ' + n + ' people</p>' +
      '<h1>Your <span class="grad">lineup</span></h1>' +
      '<p class="mute">Start gentle, build up, end loud. Or ignore us and play anything.</p></div>' +
      daily +
      '<div class="lineup">' + cards + '</div>' +
      '<div class="stack"><button class="btn ghost" id="other">🔀 Shuffle the lineup</button>' +
      '<button class="btn ghost" id="edit">⚙️ Change the crowd</button>' +
      '<button class="btn ghost" id="invite">📲 Invite friends to AATAA</button></div>' +
      '<details class="all"><summary>Browse all games for ' + n + ' people</summary><div class="gamegrid">' + all + '</div></details>',
      {
        '[data-fav]': function (e, el) {
          e.stopPropagation();
          var id = el.dataset.fav, on = A.toggleFav(id);
          A.$$('[data-fav="' + id + '"]').forEach(function (b) { b.textContent = on ? '♥' : '♡'; b.classList.toggle('on', on); });
          A.toast(on ? 'Added to favourites ♥' : 'Removed from favourites');
        },
        '[data-play]': function (e, el) { A.intro(A.games.filter(function (g) { return g.id === el.dataset.play; })[0]); },
        '#other': function () { A.newPicks(); },
        '#edit': function () { wizard(0); },
        '#invite': function () { A.invite(); }
      },
      { back: function () { wizard(3); }, title: 'Tonight', mode: 'app' }
    );
  };

  /* ---------------- how to play ---------------- */
  A.intro = function (g) {
    A.cur = null;
    A.render(
      '<div class="introhero stagger"><div class="bigav gem2">' + g.emoji + '</div><h1>' + A.esc(g.name) + '</h1>' +
      '<p class="mute">' + A.esc(g.tagline) + '</p>' +
      '<div class="meta"><span>👥 ' + g.min + '–' + g.max + '</span><span>⏱ ~' + g.mins[0] + '–' + g.mins[1] + ' min</span></div></div>' +
      '<div class="card howto"><h3>How to play</h3><ol class="steps">' + g.rules.map(function (r) { return '<li><span>' + r + '</span></li>'; }).join('') + '</ol></div>' +
      '<div class="cta"><button class="btn primary big glow" id="start">Start game</button></div>',
      { '#start': function () { A.cur = g; A.jingle(); A.recordPlay(); g.start(); } },
      { back: function () { A.showPicks(); }, title: g.name, accentId: g.id, mode: 'app' }
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
  A.showHome();

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
})();
