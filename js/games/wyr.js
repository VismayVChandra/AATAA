(function () {
  'use strict';
  var A = window.AATAA;

  A.games.push({
    id: 'wyr', name: 'Would You Rather', emoji: '⚖️',
    tagline: 'Impossible choices. Defend yours or be judged.',
    min: 2, max: 12, mins: [5, 20], tags: ['funny', 'chill', 'brainy'], energy: 1,
    rules: [
      'Two options appear. Read them out loud.',
      'On three, everyone shouts <b>A</b> (top) or <b>B</b> (bottom) at the same time.',
      'Hit “Minority defends” and whoever picked the less popular option gets 20 seconds to convince everyone.'
    ],
    start: function () {
      var rank = A.ageRank();
      var deck = A.unseenFirst('wyr', A.data.wyr.filter(function (x) { return (x[2] || 0) <= rank; })), i = 0;

      function show() {
        if (i >= deck.length) { deck = A.shuffle(deck); i = 0; }
        var q = deck[i];
        A.mark('wyr', q);
        A.render('<div class="center"><p class="eyebrow">Would you rather… #' + (i + 1) + '</p>' +
          '<div class="opt a">' + A.esc(q[0]) + '</div><div class="or">OR</div><div class="opt b">' + A.esc(q[1]) + '</div>' +
          '<p class="mute small">On three, shout A (top) or B (bottom) together. 1… 2… 3!</p>' +
          '<div id="defend"></div>' +
          '<div class="stack"><button class="btn ghost" id="def">🎤 Minority defends (20s)</button>' +
          '<button class="btn primary big" id="next">Next ▶</button></div></div>',
          {
            '#next': function () { i++; show(); },
            '#def': function (e, el) { el.disabled = true; defend(); }
          });
        A.say('Would you rather ' + q[0] + '. Or. ' + q[1]);
      }
      function defend() {
        var n = 20, box = A.$('#defend');
        box.innerHTML = '<div class="cd small" id="dcd">20</div>';
        var id = A.interval(function () {
          n--;
          var el = A.$('#dcd'); if (!el) return;
          el.textContent = n;
          if (n <= 5 && n > 0) A.beep(600, 80);
          if (n <= 0) { clearInterval(id); A.beep(300, 500, 'sawtooth'); A.buzz(300); el.textContent = 'Time! 🔔'; }
        }, 1000);
      }
      show();
    }
  });
})();
