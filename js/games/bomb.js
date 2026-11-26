(function () {
  'use strict';
  var A = window.AATAA;

  A.games.push({
    id: 'bomb', name: 'Pass the Bomb', emoji: '💣',
    tagline: 'Name things in a category, pass the phone fast. It WILL blow.',
    min: 3, max: 12, mins: [5, 20], tags: ['active', 'funny'], energy: 3,
    rules: [
      'A category appears, like “Bollywood movies”. Light the secret fuse.',
      'Say <b>one answer</b>, then pass the phone to the next person straight away. No repeats, no pausing!',
      'The beeping speeds up. Whoever holds the phone when it explodes takes a silly forfeit.'
    ],
    start: function () {
      var cats = A.shuffle(A.data.bomb.cats), r = 0;

      function ready() {
        var c = cats[r % cats.length];
        A.render('<div class="center"><p class="eyebrow">Round ' + (r + 1) + '</p>' +
          '<div class="prompt"><small>Category</small><b>' + A.esc(c) + '</b></div>' +
          '<p class="mute">Say one answer, then pass the phone. No repeats. No pausing. The fuse length is a secret…</p>' +
          '<button class="btn primary big" id="light">🔥 Light the fuse</button></div>',
          { '#light': function () { fuse(c); } });
      }

      function fuse(c) {
        var total = 15000 + Math.random() * 30000, t0 = Date.now();
        A.render('<div class="center"><div class="prompt sm"><small>Category</small><b>' + A.esc(c) + '</b></div>' +
          '<div class="bombface" id="bomb">💣</div><p class="mute">Answer → pass → repeat!</p></div>', {}, { theme: 'fuse' });
        (function tick() {
          var left = total - (Date.now() - t0);
          if (left <= 0) return boom();
          A.beep(left < 6000 ? 1100 : 700, 70, 'square', 0.12);
          A.buzz(25);
          var el = A.$('#bomb');
          if (el) { el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); }
          A.timeout(tick, Math.max(130, 160 + (left / total) * 600));
        })();
      }

      function boom() {
        A.buzz([300, 100, 300]);
        A.sfx('boom');
        var f = A.pick(A.data.bomb.forfeits);
        A.render('<div class="center"><div class="boomtxt">💥 BOOM!</div>' +
          '<h2>Whoever is holding the phone…</h2>' +
          '<div class="prompt"><small>…takes this forfeit</small><b>' + A.esc(f) + '</b></div>' +
          '<div class="stack"><button class="btn primary big" id="next">Next round</button>' +
          '<button class="btn ghost" id="done">Done with bombs</button></div></div>',
          { '#next': function () { r++; ready(); }, '#done': function () { A.showPicks(); } }, { theme: 'boom' });
      }
      ready();
    }
  });
})();
