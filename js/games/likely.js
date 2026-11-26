(function () {
  'use strict';
  var A = window.AATAA;

  A.games.push({
    id: 'likely', name: "Who's Most Likely To", emoji: '👉',
    tagline: 'Point at your friends. All at once. Mild roasting guaranteed.',
    min: 3, max: 12, mins: [5, 20], tags: ['funny', 'teasing', 'chill'], energy: 1,
    rules: [
      'A prompt appears: “Who is most likely to…”',
      'Hit the countdown. On <b>POINT!</b> everyone points at the person who fits best, at the same time.',
      'Whoever collects the most fingers wins a crown. Tap them to score it, then go to the next prompt.'
    ],
    start: function () {
      var players = A.S.players;
      var deck = A.deck(A.data.likely, 'likely').map(function (t) { return { t: t }; });
      // inside jokes from "Make it personal" are slipped in between the normal prompts
      var n = 0;
      players.forEach(function (p, k) {
        if (!p.fact) return;
        deck.splice(Math.min(deck.length, 1 + n * 2 + A.rand(2)), 0, { t: p.fact, who: k });
        n++;
      });
      var scores = players.map(function () { return 0; }), i = 0;

      function prompt() {
        if (i >= deck.length) return end();
        var cur = deck[i];
        if (cur.who == null) A.mark('likely', cur.t);
        A.render('<div class="center"><p class="eyebrow">Round ' + (i + 1) + '</p>' +
          '<div class="prompt"><small>Who is most likely to…</small><b>' + A.esc(cur.t) + '</b></div>' +
          '<button class="btn primary big" id="go">3 · 2 · 1 → POINT!</button>' +
          '<button class="btn ghost" id="end">Finish &amp; see the crowns</button></div>',
          { '#go': count, '#end': end });
        A.say('Who is most likely to ' + cur.t);
      }
      function count() {
        A.render('<div class="center"><div class="cd" id="cd">3</div><p class="mute">Decide who you’re pointing at…</p></div>');
        A.countdown(A.$('#cd'), 3, point);
      }
      function point() {
        var cur = deck[i];
        A.buzz(200);
        A.render('<div class="center"><div class="point">👉 POINT!</div>' +
          (cur.who != null ? '<p class="mute">😏 Plot twist: this one’s about <b>' + A.esc(players[cur.who].name) + '</b>!</p>' : '') +
          '<p class="mute">Who got the most fingers? Tap to crown them.</p>' +
          '<div class="pgrid">' + A.pchips(players) + '</div>' +
          '<button class="btn ghost" id="skip">Nobody / tie → next</button></div>',
          {
            '.pchip': function (e, el) {
              var k = +el.dataset.i; scores[k]++;
              A.toast('👑 ' + players[k].name + ' +1');
              i++; prompt();
            },
            '#skip': function () { i++; prompt(); }
          });
      }
      function end() {
        A.results({
          title: 'Crown count', emoji: '👑', scores: scores, unit: '👑',
          titles: [['Chief Pointee', 'The Usual Suspect', 'Public Enemy No. 1', 'Group Drama Department'],
                   ['Suspiciously Innocent', 'The Untouchable', 'Too Pure For This Group', 'Teflon Friend']],
          line: function (rows) {
            return rows[0].s ? A.esc(rows[0].p.name) + ' is officially the most-pointed-at. Everyone else: you know what you did.'
                             : 'Zero crowns. Suspiciously nice crowd.';
          },
          again: function () { A.cur.start(); }
        });
      }
      prompt();
    }
  });
})();
