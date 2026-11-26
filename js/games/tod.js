(function () {
  'use strict';
  var A = window.AATAA;

  A.games.push({
    id: 'tod', name: 'Truth or Dare 2.0', emoji: '🎡',
    tagline: 'The classic, but the phone picks who and adds chaos twists.',
    min: 2, max: 12, mins: [10, 30], tags: ['teasing', 'funny'], energy: 2,
    rules: [
      'Hit <b>Spin</b>. The phone picks who’s in the hot seat.',
      'They choose <b>Truth</b>, <b>Dare</b>, or roll the dice for a <b>Chaos</b> twist.',
      'Complete it, or take a silly forfeit instead. Mild only. Nobody gets embarrassed for real.'
    ],
    start: function () {
      var T = A.data.tod, players = A.S.players;
      var truths = A.deck(T.truths), dares = A.deck(T.dares), chaos = A.shuffle(T.chaos);
      var ti = 0, di = 0, ci = 0, last = -1;

      function ready() {
        A.render('<div class="center"><div class="bigav">🎡</div><h1>Who’s next?</h1>' +
          '<p class="mute">Spin to pick the hot seat.</p>' +
          '<button class="btn primary big" id="spin">Spin!</button></div>', { '#spin': spin });
      }

      function spin() {
        A.render('<div class="center"><p class="eyebrow">Spinning…</p><div class="spin" id="sp"></div></div>');
        var el = A.$('#sp'), target, ticks = 0, total = 16 + A.rand(6);
        do { target = A.rand(players.length); } while (players.length > 1 && target === last);
        var idx = A.rand(players.length);
        (function tick() {
          var p = players[idx % players.length];
          el.innerHTML = A.who(p);
          A.beep(300 + (ticks % 5) * 60, 40, 'square', 0.08);
          ticks++;
          if (ticks > total && idx % players.length === target) { last = target; return chosen(p); }
          idx++;
          A.timeout(tick, 60 + ticks * 12);
        })();
      }

      function chosen(p) {
        A.buzz(120); A.sfx('chime');
        A.render('<div class="center"><p class="eyebrow">In the hot seat</p><div class="bigav">' + p.emoji + '</div><h1>' + A.esc(p.name) + '</h1>' +
          '<p class="mute">Choose wisely…</p>' +
          '<div class="stack"><button class="btn primary big" data-k="truth">🫣 Truth</button>' +
          '<button class="btn danger big" data-k="dare">😈 Dare</button>' +
          '<button class="btn ghost" data-k="chaos">🎲 Surprise me (chaos!)</button></div></div>',
          { '[data-k]': function (e, el) { card(p, el.dataset.k); } });
      }

      function card(p, kind) {
        var text;
        if (kind === 'truth') { text = truths[ti++ % truths.length]; }
        else if (kind === 'dare') { text = dares[di++ % dares.length]; }
        else { text = chaos[ci++ % chaos.length].replace(/\{p\}/g, p.name); }
        var label = { truth: 'Truth', dare: 'Dare', chaos: 'Chaos' }[kind];
        A.render('<div class="center"><span class="kind ' + kind + '">' + label + ' for ' + A.esc(p.name) + '</span>' +
          '<div class="prompt"><b>' + A.esc(text) + '</b></div>' +
          '<div class="stack"><button class="btn good big" id="done">✔ Done!</button>' +
          '<button class="btn ghost" id="skip">Can’t do it → forfeit</button></div></div>',
          { '#done': ready, '#skip': function () { forfeit(p); } });
      }

      function forfeit(p) {
        var f = A.pick(A.data.bomb.forfeits);
        A.render('<div class="center"><div class="bigav">🙈</div><h1>Forfeit!</h1>' +
          '<div class="prompt"><small>' + A.esc(p.name) + ' must…</small><b>' + A.esc(f) + '</b></div>' +
          '<button class="btn primary big" id="ok">Done → next spin</button></div>', { '#ok': ready });
      }
      ready();
    }
  });
})();
