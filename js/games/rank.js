(function () {
  'use strict';
  var A = window.AATAA;

  A.games.push({
    id: 'rank', name: 'Rank Your Friends', emoji: '🏅',
    tagline: 'Who’s the best, who’s the worst? Argue it out, then rank everyone.',
    min: 3, max: 12, mins: [8, 25], tags: ['teasing', 'funny', 'chill'], energy: 1,
    rules: [
      'A prompt appears, like “Who would survive longest in a zombie apocalypse?”',
      'Argue it out as a group (the louder the better), then agree on an order.',
      'Tap everyone from <b>#1 to last</b>. Rank high and you collect points. Leaderboard at the end.'
    ],
    start: function () {
      var players = A.S.players, n = players.length;
      var deck = A.deck(A.data.rank, 'rank'), i = 0;
      var pts = players.map(function () { return 0; });

      function prompt() {
        if (i >= deck.length) return end();
        A.mark('rank', deck[i]);
        A.render('<div class="center"><p class="eyebrow">Round ' + (i + 1) + '</p>' +
          '<div class="prompt"><small>Rank everyone. #1 is…</small><b>' + A.esc(deck[i]) + '</b></div>' +
          '<p class="mute">Argue first. Then lock in a ranking together.</p>' +
          '<button class="btn primary big" id="go">We’ve decided — rank them</button>' +
          '<button class="btn ghost" id="end">Finish &amp; see the board</button></div>',
          { '#go': rank, '#end': end });
        A.say(deck[i]);
      }

      function rank() {
        var order = [];
        A.render('<div class="center" style="justify-content:flex-start"><p class="eyebrow">Tap from #1 to last</p>' +
          '<div class="prompt sm"><b>' + A.esc(deck[i]) + '</b></div>' +
          '<div class="pgrid" id="rg"></div>' +
          '<div class="row2"><button class="btn ghost" id="undo">↶ Undo</button><button class="btn primary" id="lock" disabled>Lock it in</button></div></div>');
        var grid = A.$('#rg'), lock = A.$('#lock');
        function draw() {
          grid.innerHTML = players.map(function (p, k) {
            var pos = order.indexOf(k);
            return '<button class="pchip' + (pos >= 0 ? ' sel' : '') + '" data-i="' + k + '">' +
              (pos >= 0 ? '<span class="rk">' + (pos + 1) + '</span>' : '') + A.who(p) + '</button>';
          }).join('');
          A.$$('.pchip', grid).forEach(function (b) {
            b.onclick = function () {
              var k = +b.dataset.i;
              if (order.indexOf(k) < 0) { order.push(k); A.beep(500 + order.length * 60, 70); A.buzz(8); draw(); }
            };
          });
          lock.disabled = order.length !== n;
        }
        A.$('#undo').onclick = function () { order.pop(); draw(); };
        lock.onclick = function () { A.unlockAudio(); show(order); };
        draw();
      }

      function show(order) {
        order.forEach(function (k, r) { pts[k] += n - 1 - r; });
        var medals = ['🥇', '🥈', '🥉'];
        A.render('<div class="center"><div class="bigav">🏅</div><h2>The verdict</h2>' +
          '<p class="mute small">' + A.esc(deck[i]) + '</p>' +
          '<ol class="board">' + order.map(function (k, r) {
            return '<li><span class="m">' + (medals[r] || (r + 1)) + '</span><span class="nm">' + A.who(players[k]) + '</span></li>';
          }).join('') + '</ol>' +
          '<button class="btn primary big" id="next">Next round</button>' +
          '<button class="btn ghost" id="end">Finish &amp; see the board</button></div>',
          { '#next': function () { i++; prompt(); }, '#end': end });
        A.confetti(40);
      }

      function end() {
        A.results({
          title: 'Overall ranking', emoji: '🏅', scores: pts, unit: 'pts',
          titles: [['Group Favourite', 'Everyone’s Top Pick', 'The Chosen One', 'Teacher’s Pet'],
                   ['Humble Pie', 'Lowest Rank, Biggest Heart', 'Rebuilding Era', 'Underdog']],
          line: function (rows) { return rows[0].s ? A.esc(rows[0].p.name) + ' tops the table. The rest of you know why.' : 'No rankings were made. Diplomatic crowd.'; },
          again: function () { A.cur.start(); }
        });
      }
      prompt();
    }
  });
})();
