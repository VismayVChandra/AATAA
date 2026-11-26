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
    // while a Game Night is running, "back to games" means "that game is over"
    if (A.night && A.night.active && A.night.pending) return A.nightAfterGame();
    A.cur = null;
    if (!A.picks) return A.showHome();
    var n = S.players.length;
    var plan = A.nightPlan = A.planNight();
    var planMins = plan.reduce(function (t, g) { return t + (g.mins[0] + g.mins[1]) / 2; }, 0);
    var nightCard = plan.length < 2 ? '' :
      '<div class="nightcard"><div class="row"><div class="gem sm">🌙</div><div><p class="eyebrow">New · let AATAA host</p><h2 style="margin:0">Run the whole night</h2></div></div>' +
      '<p class="why">' + plan.length + ' games · about ' + Math.round(planMins / 5) * 5 + ' min · one scoreboard · a champion at the end</p>' +
      '<div class="chain">' + plan.map(function (g) { return '<span>' + g.emoji + '</span>'; }).join('<i>›</i>') + '</div>' +
      '<button class="btn primary" id="night">🌙 Start Game Night</button></div>';
    var personalCount = S.players.filter(function (p) { return p.fact; }).length;
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
      nightCard +
      daily +
      '<div class="lineup">' + cards + '</div>' +
      '<div class="stack"><button class="btn ghost" id="other">🔀 Shuffle the lineup</button>' +
      '<button class="btn ghost" id="personal">✍️ Make it personal' + (personalCount ? ' · ' + personalCount + ' added' : '') + '</button>' +
      '<button class="btn ghost" id="edit">⚙️ Change the crowd</button>' +
      '<button class="btn ghost" id="invite">📲 Invite friends to AATAA</button></div>' +
      '<details class="all"><summary>Browse all games for ' + n + ' people</summary><div class="gamegrid">' + all + '</div></details>' +
      '<p class="foot small"><button class="link" id="resetmem">♻️ Forget which prompts we’ve already shown</button></p>',
      {
        '#night': function () { A.jingle(); A.nightStart(A.nightPlan); },
        '#personal': function () { A.showPersonal(); },
        '#resetmem': function () { A.resetMemory(); A.toast('Fresh start: all prompts are new again'); },
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
      { '#start': function () { A.cur = g; if (A.night && A.night.active) A.night.pending = true; A.jingle(); A.recordPlay(); g.start(); } },
      { back: function () { if (A.night && A.night.active) A.nightHub(); else A.showPicks(); }, title: g.name, accentId: g.id, mode: 'app' }
    );
  };

  /* ---------------- make it personal ---------------- */
  A.showPersonal = function () {
    A.cur = null;
    var fields = S.players.map(function (p, i) {
      return '<label class="field"><span class="who">' + A.who(p) + '<small> is most likely to…</small></span>' +
        '<input type="text" maxlength="60" data-i="' + i + '" placeholder="e.g. forget their own birthday" value="' + A.esc(p.fact || '') + '"></label>';
    }).join('');
    A.render(
      '<div class="introhero" style="align-items:flex-start;text-align:left"><p class="eyebrow">Optional · one minute</p>' +
      '<h1>Make it <span class="grad">personal</span></h1>' +
      '<p class="mute">Finish the sentence for each friend. AATAA will quietly slip these inside jokes into “Who’s Most Likely To” and Truth or Dare.</p></div>' +
      '<div class="stack">' + fields + '</div>' +
      '<div class="stack"><button class="btn ghost" id="suggest">🎲 Fill the empty ones with ideas</button>' +
      '<button class="btn primary big" id="save">Save</button></div>',
      {
        '#suggest': function () {
          var ideas = A.deck(A.data.likely), k = 0;
          A.$$('input[data-i]').forEach(function (inp) { if (!inp.value.trim()) inp.value = ideas[k++ % ideas.length]; });
        },
        '#save': function () {
          var n = 0;
          A.$$('input[data-i]').forEach(function (inp) {
            var v = inp.value.trim().replace(/^(is )?most likely to\s*/i, '').slice(0, 60);
            S.players[+inp.dataset.i].fact = v; if (v) n++;
          });
          A.save();
          A.toast(n ? n + ' inside joke' + (n > 1 ? 's' : '') + ' saved ✍️' : 'Cleared');
          A.showPicks();
        }
      },
      { back: function () { A.showPicks(); }, title: 'Make it personal', mode: 'app' }
    );
  };

  /* ---------------- Game Night ---------------- */
  // builds an ordered ladder of games (warm-up → main → wildcard) that fits the time you have
  A.planNight = function () {
    var keep = A.seen.slice(), pool = [], ids = {};
    A.seen = [];
    for (var r = 0; r < 2; r++) {
      var picks = A.recommend();
      picks.forEach(function (x) { if (!ids[x.g.id]) { ids[x.g.id] = 1; pool.push(x.g); } });
      A.seen = pool.map(function (g) { return g.id; });
    }
    A.seen = keep;
    var count = S.time <= 10 ? 2 : S.time <= 20 ? 4 : 5;
    pool = pool.map(function (g, i) { return { g: g, i: i }; })
      .sort(function (a, b) { return a.g.energy - b.g.energy || a.i - b.i; }).map(function (x) { return x.g; });
    while (pool.length > count) {
      var tiers = {};
      pool.forEach(function (g) { tiers[g.energy] = (tiers[g.energy] || 0) + 1; });
      var worst = Object.keys(tiers).sort(function (a, b) { return tiers[b] - tiers[a] || a - b; })[0];
      for (var k = pool.length - 1; k >= 0; k--) if (String(pool[k].energy) === worst) { pool.splice(k, 1); break; }
    }
    return pool;
  };

  A.nightStart = function (plan) {
    A.night = { active: true, plan: plan, idx: 0, pts: S.players.map(function () { return 0; }), pending: false, awarded: -1, autoDone: false };
    A.nightHub();
  };

  function standings(N, limit) {
    var rows = S.players.map(function (p, i) { return { p: p, s: N.pts[i] }; }).sort(function (a, b) { return b.s - a.s; });
    return '<ol class="board">' + rows.slice(0, limit || 5).map(function (r, i) {
      return '<li><span class="m">' + (['🥇', '🥈', '🥉'][i] || (i + 1)) + '</span><span class="nm">' + A.who(r.p) + '</span><span class="pts">' + r.s + ' pts</span></li>';
    }).join('') + '</ol>';
  }

  A.nightHub = function () {
    var N = A.night; A.cur = null;
    if (!N || !N.active) return A.showPicks();
    if (N.idx >= N.plan.length) return A.nightFinal();
    var g = N.plan[N.idx], ac = A.accentFor(g.id);
    var dots = N.plan.map(function (x, i) {
      return '<span class="dot' + (i < N.idx ? ' done' : i === N.idx ? ' now' : '') + '">' + x.emoji + '</span>';
    }).join('<i>›</i>');
    var any = N.pts.some(function (v) { return v > 0; });
    A.render(
      '<div class="introhero" style="align-items:flex-start;text-align:left"><p class="eyebrow">🌙 Game night · game ' + (N.idx + 1) + ' of ' + N.plan.length + '</p>' +
      '<h1>' + (N.idx === 0 ? 'Let’s <span class="grad">begin</span>' : 'Up <span class="grad">next</span>') + '</h1></div>' +
      '<div class="chain big">' + dots + '</div>' +
      '<div class="pick" style="--a1:' + ac[0] + ';--a2:' + ac[1] + '"><span class="ribbon">Game ' + (N.idx + 1) + '</span>' +
      '<div class="row"><div class="gem">' + g.emoji + '</div><div><h2>' + A.esc(g.name) + '</h2><p class="mute small">' + A.esc(g.tagline) + '</p></div></div>' +
      '<div class="meta"><span>👥 ' + g.min + '–' + g.max + '</span><span>⏱ ~' + g.mins[0] + '–' + g.mins[1] + ' min</span></div>' +
      '<button class="btn primary big" id="go">Start ' + A.esc(g.name) + '</button></div>' +
      (any ? '<div class="card"><h3>🏆 Night scoreboard</h3>' + standings(N, 5) + '</div>' : '') +
      '<div class="stack"><button class="btn ghost" id="skip">Skip this game</button><button class="btn ghost" id="end">End the night now</button></div>',
      {
        '#go': function () { A.intro(g); },
        '#skip': function () { N.idx++; A.nightHub(); },
        '#end': function () { N.idx = N.plan.length; A.nightHub(); }
      },
      { back: function () { if (confirm('Leave Game Night? The scoreboard will be lost.')) { A.night = null; A.showPicks(); } }, title: 'Game night', mode: 'app', accentId: g.id }
    );
    A.say(N.idx === 0 ? 'Welcome to game night. First up: ' + g.name : 'Up next: ' + g.name);
  };

  // runs when a game ends inside a night: award points (or ask who starred) and move on
  A.nightAfterGame = function () {
    var N = A.night; N.pending = false; A.cur = null;
    if (N.autoDone) { N.autoDone = false; N.idx++; return A.nightHub(); }
    var g = N.plan[N.idx];
    A.render(
      '<div class="center"><div class="bigav">⭐</div><h1>Who starred in ' + A.esc(g.name) + '?</h1>' +
      '<p class="mute">Tap the MVP for +3 points on the night scoreboard.</p>' +
      '<div class="pgrid">' + A.pchips(S.players) + '</div>' +
      '<button class="btn ghost" id="skip">Nobody / skip</button></div>',
      {
        '.pchip': function (e, el) {
          var k = +el.dataset.i; N.pts[k] += 3; A.toast('🌙 ' + S.players[k].name + ' +3');
          N.idx++; A.nightHub();
        },
        '#skip': function () { N.idx++; A.nightHub(); }
      },
      { back: null, title: 'Game night', mode: 'app' }
    );
  };

  A.nightFinal = function () {
    var N = A.night; A.cur = null;
    N.active = false;
    A.results({
      title: 'Champion of the night', emoji: '🏆', scores: N.pts, unit: 'pts', noNight: true,
      againLabel: 'Start another night', homeLabel: 'Back to the lineup',
      titles: [['Night Champion', 'Ruler of the Room', 'Main Character Tonight', 'Undisputed King/Queen'],
               ['Always Fun to Have', 'Still Here for the Snacks', 'Winning Hearts Instead', 'Rematch Pending']],
      line: function (rows) { return rows[0].s ? A.esc(rows[0].p.name) + ' takes the crown tonight. Everyone else: see you next weekend.' : 'No points tonight. A peaceful night.'; },
      again: function () { A.nightStart(A.planNight()); },
      home: function () { A.night = null; A.showPicks(); }
    });
  };

  /* ---------------- boot ---------------- */
  A.load();
  A.$('#snd').textContent = S.sound ? '🔊' : '🔇';
  A.$('#snd').onclick = function () {
    S.sound = !S.sound; A.save();
    A.$('#snd').textContent = S.sound ? '🔊' : '🔇';
    A.unlockAudio();
  };
  // host voice: reads prompts aloud (hidden if the browser has no speech support)
  var vb = A.$('#voice');
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) vb.hidden = true;
  vb.classList.toggle('off', !S.voice);
  vb.onclick = function () {
    S.voice = !S.voice; A.save();
    vb.classList.toggle('off', !S.voice);
    A.toast(S.voice ? '🗣️ Host voice on' : 'Host voice off');
    if (S.voice) A.say('Host voice on. I will read the prompts out loud.'); else { try { speechSynthesis.cancel(); } catch (e) {} }
  };
  A.showHome();

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
})();
