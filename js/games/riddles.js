(function () {
  'use strict';
  var A = window.AATAA;

  A.games.push({
    id: 'riddles', name: 'Riddle Rush', emoji: '🧩',
    tagline: 'Quick-fire brain teasers. First to crack it scores.',
    min: 2, max: 12, mins: [5, 15], tags: ['brainy', 'chill'], energy: 1,
    rules: [
      'A riddle appears. Someone reads it out loud.',
      'Shout your answer. First correct answer wins the point. Nobody gets it? Peek at the answer.',
      'Tap “Reveal answer”, then tap the person who cracked it. Twelve riddles per game.'
    ],
    start: function () {
      var deck = A.shuffle(A.data.riddles).slice(0, 12), players = A.S.players;
      var scores = players.map(function () { return 0; }), i = 0;

      function ask() {
        if (i >= deck.length) return end();
        A.render('<div class="center"><p class="eyebrow">Riddle ' + (i + 1) + ' of ' + deck.length + '</p>' +
          '<div class="prompt"><b>' + A.esc(deck[i].q) + '</b></div>' +
          '<button class="btn primary big" id="show">Reveal answer</button>' +
          '<button class="btn ghost" id="end">Finish game</button></div>',
          { '#show': reveal, '#end': end });
      }
      function reveal() {
        A.render('<div class="center"><p class="eyebrow">The answer</p>' +
          '<div class="prompt"><small>' + A.esc(deck[i].q) + '</small><b>' + A.esc(deck[i].a) + '</b></div>' +
          '<p class="mute">Who cracked it first?</p>' +
          '<div class="pgrid">' + A.pchips(players) + '</div>' +
          '<button class="btn ghost" id="none">Nobody → next riddle</button></div>',
          {
            '.pchip': function (e, el) { var k = +el.dataset.i; scores[k]++; A.toast('🧠 ' + players[k].name + ' +1'); i++; ask(); },
            '#none': function () { i++; ask(); }
          });
      }
      function end() {
        A.results({
          title: 'Big brain board', emoji: '🧠', scores: scores, unit: 'pts',
          titles: [['Big Brain Energy', 'Walking Google', 'Riddle Royalty', 'Sherlock of the Group'],
                   ['Brain on Airplane Mode', 'Vibes Only', 'Professional Guesser (wrong)', 'Here For the Snacks']],
          line: function (rows) { return rows[0].s ? A.esc(rows[0].p.name) + ' has the sharpest mind tonight.' : 'Nobody scored. The riddles win this round.'; },
          again: function () { A.cur.start(); }
        });
      }
      ask();
    }
  });
})();
