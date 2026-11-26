(function () {
  'use strict';
  var A = window.AATAA;

  A.games.push({
    id: 'never', name: 'Never Have I Ever', emoji: '🙊',
    tagline: 'Mild confessions only. The phone keeps the tally.',
    min: 3, max: 12, mins: [8, 25], tags: ['chill', 'teasing', 'funny'], energy: 1,
    rules: [
      'A statement appears: “Never have I ever…” Read it out loud.',
      'Everyone who <b>has</b> done it admits it. Tap their names.',
      'Each confession adds to your tally. Most confessions wins the “experienced” crown (and the stories).'
    ],
    start: function () {
      var players = A.S.players, deck = A.deck(A.data.never, 'never'), i = 0;
      var tally = players.map(function () { return 0; });

      function show() {
        if (i >= deck.length) return end();
        A.mark('never', deck[i]);
        A.render('<div class="center" style="justify-content:flex-start"><p class="eyebrow">Statement ' + (i + 1) + '</p>' +
          '<div class="prompt"><small>Never have I ever…</small><b>' + A.esc(deck[i]) + '</b></div>' +
          '<p class="mute">Tap everyone who <b>HAS</b> done it:</p>' +
          '<div class="pgrid">' + A.pchips(players) + '</div>' +
          '<button class="btn primary big" id="next">Next ▶</button>' +
          '<button class="btn ghost" id="end">Finish &amp; see the tally</button></div>',
          {
            '.pchip': function (e, el) { el.classList.toggle('sel'); },
            '#next': function () { commit(); i++; show(); },
            '#end': function () { commit(); end(); }
          });
        A.say('Never have I ever ' + deck[i]);
      }
      function commit() {
        var sel = A.$$('.pchip.sel');
        sel.forEach(function (b) { tally[+b.dataset.i]++; });
        if (sel.length) A.toast(sel.length + (sel.length === 1 ? ' confession' : ' confessions'));
      }
      function end() {
        A.results({
          title: 'Confession board', emoji: '🙊', scores: tally, unit: 'confessions',
          titles: [['Seen It All', 'Chaos Magnet', 'Walking Plot Twist', 'Main Character'],
                   ['Suspiciously Clean', 'Angel Wings', 'Pure Soul', 'The Innocent One']],
          line: function (rows) { return rows[0].s ? A.esc(rows[0].p.name) + ' has the best stories. Ask them.' : 'Nobody has done anything. Suspicious.'; },
          again: function () { A.cur.start(); }
        });
      }
      show();
    }
  });
})();
