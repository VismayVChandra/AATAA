(function () {
  'use strict';
  var A = window.AATAA;

  A.games.push({
    id: 'charades', name: 'Dumb Charades', emoji: '🎭',
    tagline: 'Act it out, or stick the phone on your forehead. Phone keeps score.',
    min: 3, max: 12, mins: [10, 30], tags: ['active', 'funny'], energy: 3,
    rules: [
      'Pick a deck (Bollywood, animals, food…) and a mode. Each player gets one timed turn.',
      '<b>Act it out:</b> you see the word and act without talking; friends guess. Tap ✓ or Pass.',
      '<b>Heads-up:</b> hold the phone on your forehead; friends give clues. Tilt down = correct, up = pass.'
    ],
    start: function () {
      var players = A.S.players, n = players.length;
      var opts = { deck: 'bollywood', mode: 'act', secs: 60 };
      var scores, turn, queue;

      function allWords() {
        var d = A.data.charades;
        if (opts.deck === 'mixed') return Object.keys(d).reduce(function (a, k) { return a.concat(d[k].words); }, []);
        return d[opts.deck].words;
      }
      function nextWord() {
        if (!queue.length) queue = A.unseenFirst('charades', allWords()).reverse();   // pop() takes unseen words first
        var w = queue.pop();
        A.mark('charades', w);
        return w;
      }

      function setup() {
        var d = A.data.charades;
        A.render('<div class="center left"><p class="eyebrow">Charades setup</p>' +
          '<div class="card" style="width:100%"><h3>Deck</h3><div class="chips">' +
          Object.keys(d).map(function (k) { return A.chip('deck', k, d[k].emoji + ' ' + d[k].label, opts.deck === k); }).join('') +
          A.chip('deck', 'mixed', '🎲 Mixed', opts.deck === 'mixed') + '</div></div>' +
          '<div class="card" style="width:100%"><h3>Mode</h3><div class="chips">' +
          A.chip('mode', 'act', '🎭 Act it out', opts.mode === 'act') +
          A.chip('mode', 'tilt', '🤳 Heads-up (tilt)', opts.mode === 'tilt') + '</div>' +
          '<p class="mute small" style="margin-top:8px">Heads-up uses the tilt sensor. Buttons also work if tilt misbehaves.</p></div>' +
          '<div class="card" style="width:100%"><h3>Seconds per turn</h3><div class="chips">' +
          [45, 60, 90].map(function (s) { return A.chip('secs', s, s + 's', opts.secs === s); }).join('') + '</div></div>' +
          '<button class="btn primary big" id="go">Start</button></div>',
          { '.chip': A.chipHandler(opts), '#go': function () { scores = players.map(function () { return 0; }); turn = 0; queue = []; intro(); } });
      }

      function intro() {
        var p = players[turn % n], tilt = opts.mode === 'tilt';
        A.render('<div class="center"><p class="eyebrow">Turn ' + (turn + 1) + '</p><div class="bigav">' + p.emoji + '</div><h1>' + A.esc(p.name) + ' is up!</h1>' +
          '<p class="mute">' + (tilt
            ? 'Phone on your forehead, screen facing your friends. They give clues without saying the word.'
            : 'You’ll see the word. Act it out with no talking. Friends guess it.') + '</p>' +
          '<button class="btn primary big" id="ready">I’m ready</button></div>',
          { '#ready': function () { ensureMotion(function () { count(p); }); } });
      }

      function ensureMotion(cb) {
        if (opts.mode === 'tilt' && window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function') {
          DeviceMotionEvent.requestPermission().then(function () { cb(); }, function () { cb(); });
        } else cb();
      }

      function count(p) {
        A.render('<div class="center"><div class="cd" id="cd">3</div><p class="mute">Get ready, ' + A.esc(p.name) + '!</p></div>');
        A.countdown(A.$('#cd'), 3, function () { play(p); });
      }

      function play(p) {
        var left = opts.secs, got = [], skipped = [], word = nextWord(), tilt = opts.mode === 'tilt';
        A.render('<div class="center" style="justify-content:flex-start;gap:12px">' +
          '<div class="ring" id="ring"><div class="timer" id="t">' + left + '</div></div>' +
          '<div class="tag">✓ <b id="sc">0</b> correct</div>' +
          '<div class="word big" id="w">' + A.esc(word) + '</div>' +
          '<p class="mute small">' + (tilt ? 'Tilt DOWN = correct · Tilt UP = pass' : 'No talking, just acting!') + '</p>' +
          '<div class="row2"><button class="btn good big" id="ok">✓ Got it</button><button class="btn skip big" id="pass">⏭ Pass</button></div></div>',
          { '#ok': correct, '#pass': pass });

        function flash(cls) { var w = A.$('#w'); w.classList.remove('flash-ok', 'flash-no'); void w.offsetWidth; w.classList.add(cls); }
        function show() { A.$('#w').textContent = word; A.$('#sc').textContent = got.length; }
        function correct() { got.push(word); A.beep(880, 120); A.buzz(40); word = nextWord(); show(); flash('flash-ok'); }
        function pass() { skipped.push(word); A.beep(300, 120); word = nextWord(); show(); flash('flash-no'); }

        if (tilt) {
          var armed = true, flip = /iPhone|iPad|iPod/i.test(navigator.userAgent) ? -1 : 1;
          var h = function (e) {
            var g = e.accelerationIncludingGravity; if (!g || g.z == null) return;
            var z = g.z * flip;
            if (armed) { if (z < -6) { armed = false; correct(); } else if (z > 6) { armed = false; pass(); } }
            else if (Math.abs(z) < 3) armed = true;
          };
          window.addEventListener('devicemotion', h);
          A.onCleanup(function () { window.removeEventListener('devicemotion', h); });
        }

        A.interval(function () {
          left--;
          var t = A.$('#t'); if (!t) return;
          t.textContent = Math.max(left, 0);
          var rg = A.$('#ring'); rg.style.setProperty('--p', Math.max(left, 0) / opts.secs * 100 + '%');
          if (left <= 10) { t.classList.add('low'); rg.classList.add('low'); A.beep(700, 60); }
          if (left <= 0) { A.beep(300, 600, 'sawtooth'); A.buzz(400); summary(p, got, skipped); }
        }, 1000);
      }

      function summary(p, got, skipped) {
        scores[turn % n] += got.length;
        var more = (turn + 1) % n !== 0;
        function wl(arr, cls) { return arr.length ? '<div class="wlist">' + arr.map(function (w) { return '<span class="' + cls + '">' + A.esc(w) + '</span>'; }).join('') + '</div>' : '<p class="mute small">—</p>'; }
        A.render('<div class="center" style="justify-content:flex-start"><p class="eyebrow">Time’s up!</p>' +
          '<h1>' + A.esc(p.name) + ' got ' + got.length + '</h1>' +
          '<div class="card" style="width:100%;text-align:left"><h3>✓ Correct</h3>' + wl(got, 'ok') + '<h3 style="margin-top:12px">⏭ Passed</h3>' + wl(skipped, '') + '</div>' +
          '<button class="btn primary big" id="next">' + (more ? 'Next player →' : 'See scores →') + '</button></div>',
          {
            '#next': function () {
              turn++;
              if (more) return intro();
              A.results({
                title: 'Charades scores', emoji: '🎭', scores: scores, unit: 'pts',
                titles: [['Oscar Material', 'Natural Born Actor', 'Bollywood Is Calling', 'Over-Acting Champion'],
                         ['Statue Mode', 'Needs Acting Classes', 'Silent Film Extra', 'Buffering…']],
                againLabel: 'Another round',
                line: function (rows) { return rows[0].s ? A.esc(rows[0].p.name) + ' is leading. Stage name pending.' : 'Nobody scored yet. Try more dramatic acting.'; },
                again: intro
              });
            }
          });
      }

      setup();
    }
  });
})();
