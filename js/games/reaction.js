(function () {
  'use strict';
  var A = window.AATAA;

  A.games.push({
    id: 'reaction', name: 'Reaction Duel', emoji: '⚡',
    tagline: 'Two thumbs, one phone. First to tap when it turns green wins.',
    min: 2, max: 12, mins: [5, 15], tags: ['active', 'funny'], energy: 3,
    rules: [
      'Two players sit facing each other with the phone between them, one thumb each on their own half of the screen.',
      'Both pads are red. When they turn <b>green</b>, tap first! Tap early and you lose the round.',
      'Best of 3. The winner stays on as king and takes on the next challenger.'
    ],
    start: function () {
      var players = A.S.players, n = players.length;
      var wins = players.map(function () { return 0; });
      var king = A.rand(n), queue = [];

      function nextChallenger() {
        if (!queue.length) queue = A.shuffle(players.map(function (p, i) { return i; }).filter(function (i) { return i !== king; }));
        return queue.shift();
      }

      function lobby() {
        var a = king, b = nextChallenger();
        A.render('<div class="center"><p class="eyebrow">Next duel</p>' +
          '<div class="vs"><div class="who" style="font-size:22px">' + A.who(players[a]) + '</div><span>VS</span><div class="who" style="font-size:22px">' + A.who(players[b]) + '</div></div>' +
          '<p class="mute">Sit facing each other, phone in the middle. One thumb each on your own pad. When both pads turn green, tap first. Jump early and you lose the round.</p>' +
          '<button class="btn primary big" id="go">Ready, steady…</button></div>',
          { '#go': function () { match(a, b); } });
      }

      function pad(el, cls, main, sub) {
        el.className = 'pad ' + el.dataset.pos + (cls ? ' ' + cls : '');
        el.innerHTML = '<span>' + main + '</span><small>' + sub + '</small>';
      }

      function match(a, b) {
        var sc = [0, 0];
        round();

        function round() {
          var pa = players[a], pb = players[b];
          A.render('<div class="duel">' +
            '<div class="pad top" data-pos="top" id="pb"></div>' +
            '<div class="mid" id="mid">' + sc[0] + ' – ' + sc[1] + '</div>' +
            '<div class="pad bottom" data-pos="bottom" id="pa"></div></div>');
          var elA = A.$('#pa'), elB = A.$('#pb');
          pad(elA, '', 'WAIT…', pa.emoji + ' ' + A.esc(pa.name));
          pad(elB, '', 'WAIT…', pb.emoji + ' ' + A.esc(pb.name));
          var state = 'wait', done = false, t0 = 0;
          var goId = setTimeout(function () {
            if (done) return;
            state = 'go'; t0 = performance.now();
            pad(elA, 'go', 'TAP!', pa.emoji + ' ' + A.esc(pa.name));
            pad(elB, 'go', 'TAP!', pb.emoji + ' ' + A.esc(pb.name));
            A.beep(1000, 180, 'square', 0.2); A.buzz(80);
          }, 1600 + Math.random() * 3400);
          A.onCleanup(function () { clearTimeout(goId); });

          function hit(side) {
            if (done) return; done = true; clearTimeout(goId);
            var early = state === 'wait', winner = early ? (side === 'a' ? 'b' : 'a') : side;
            var ms = early ? 0 : Math.round(performance.now() - t0);
            sc[winner === 'a' ? 0 : 1]++;
            var wEl = winner === 'a' ? elA : elB, lEl = winner === 'a' ? elB : elA;
            var wP = winner === 'a' ? pa : pb, lP = winner === 'a' ? pb : pa;
            pad(wEl, 'win', '🏆 ' + (early ? 'They jumped!' : ms + ' ms'), wP.emoji + ' ' + A.esc(wP.name));
            pad(lEl, 'lose', early ? 'Too early!' : 'Too slow', lP.emoji + ' ' + A.esc(lP.name));
            A.$('#mid').textContent = sc[0] + ' – ' + sc[1];
            A.beep(early ? 200 : 880, 200); A.buzz(early ? [60, 40, 60] : 40);
            A.timeout(function () {
              if (sc[0] === 2 || sc[1] === 2) matchOver(a, b, sc[0] === 2 ? a : b); else round();
            }, 1600);
          }
          elA.addEventListener('pointerdown', function (e) { e.preventDefault(); hit('a'); });
          elB.addEventListener('pointerdown', function (e) { e.preventDefault(); hit('b'); });
        }
      }

      function matchOver(a, b, w) {
        wins[w]++; king = w;
        A.render('<div class="center"><div class="bigav">⚡</div><h1>' + A.esc(players[w].name) + ' wins the duel!</h1>' +
          '<p class="mute">Stays on as king with ' + wins[w] + ' win' + (wins[w] > 1 ? 's' : '') + '. Who dares challenge?</p>' +
          '<div class="stack"><button class="btn primary big" id="next">Next challenger →</button>' +
          '<button class="btn ghost" id="end">Finish &amp; see scores</button></div></div>',
          { '#next': lobby, '#end': end });
        A.sfx && A.sfx('win');
      }

      function end() {
        A.results({
          title: 'Duel champions', emoji: '⚡', scores: wins, unit: 'wins',
          titles: [['Fastest Thumb', 'Reflex King', 'Lightning Fingers', 'Blink and You Lose'],
                   ['Buffering…', 'Sleepy Thumbs', 'Slow-Mo Specialist', 'Still Loading']],
          line: function (rows) { return rows[0].s ? A.esc(rows[0].p.name) + ' has the quickest thumbs in the room.' : 'No duels played. Fear?'; },
          again: function () { wins = players.map(function () { return 0; }); king = A.rand(n); queue = []; lobby(); }
        });
      }
      lobby();
    }
  });
})();
