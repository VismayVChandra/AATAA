/* Picks 3 games as a "ladder": warm-up -> main event -> wildcard. Pure scoring, no AI. */
(function () {
  'use strict';
  var A = window.AATAA;

  var VIBE_LABEL = { funny: 'Funny', brainy: 'Brainy', teasing: 'Teasing', active: 'Active', sneaky: 'Sneaky', chill: 'Chill' };
  A.vibeLabel = function (t) { return VIBE_LABEL[t] || t; };

  A.fits = function (g) {
    var n = A.S.players.length;
    return n >= g.min && n <= g.max;
  };

  A.recommend = function () {
    var S = A.S, vibes = S.vibes.length ? S.vibes : null;
    var pool = A.games.filter(function (g) { return A.fits(g) && g.mins[0] <= S.time; });
    if (!pool.length) pool = A.games.filter(A.fits);

    var scored = pool.map(function (g) {
      var match = vibes ? g.tags.filter(function (t) { return vibes.indexOf(t) >= 0; }).length * 3 : 1.5;
      return { g: g, s: match + Math.random() * 2 };
    });

    var roles = [
      { label: 'Warm-up', e: 1, note: 'Easy start — no one has to be brave yet.' },
      { label: 'Main event', e: 2, note: 'Once the room is warm, this is the one.' },
      { label: 'Wildcard', e: 3, note: 'Loud, silly, unpredictable. Save it for last.' }
    ];
    var out = [], used = {};

    roles.forEach(function (r) {
      var tier = scored.filter(function (x) { return x.g.energy === r.e && !used[x.g.id]; });
      if (!tier.length) return;
      var fresh = tier.filter(function (x) { return A.seen.indexOf(x.g.id) < 0; });
      if (!fresh.length) {               // we've shown them all: start cycling again
        A.seen = A.seen.filter(function (id) { return !tier.some(function (x) { return x.g.id === id; }); });
        fresh = tier;
      }
      fresh.sort(function (a, b) { return b.s - a.s; });
      used[fresh[0].g.id] = true;
      out.push({ g: fresh[0].g, role: r });
    });

    // small groups may miss a tier: top up with the best leftovers
    scored.sort(function (a, b) { return b.s - a.s; });
    scored.forEach(function (x) {
      if (out.length < 3 && !used[x.g.id]) { used[x.g.id] = true; out.push({ g: x.g, role: { label: 'Bonus pick', e: 0, note: '' } }); }
    });

    out.forEach(function (o) {
      var hit = vibes ? o.g.tags.filter(function (t) { return vibes.indexOf(t) >= 0; }).map(A.vibeLabel) : [];
      o.why = hit.length ? 'Matches your ' + hit.join(' + ').toLowerCase() + ' mood' : 'A crowd-pleaser for ' + S.players.length + ' people';
    });
    return out;
  };
})();
