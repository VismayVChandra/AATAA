(function () {
  'use strict';
  var A = window.AATAA;

  function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return m + ':' + (r < 10 ? '0' : '') + r; }

  A.games.push({
    id: 'imposter', name: 'Imposter', emoji: '🕵️',
    tagline: 'Everyone gets a secret word. One person got a different one.',
    min: 4, max: 12, mins: [10, 25], tags: ['sneaky', 'funny', 'brainy'], energy: 2,
    rules: [
      'The phone is passed around. Each player <b>holds to reveal</b> their secret word, then hides it.',
      'Everyone takes turns saying <b>one clue word</b> about their word. Don’t be too obvious, don’t be too vague.',
      'Vote on who the imposter is. The imposter got a similar but <b>different</b> word, and may not know it!'
    ],
    start: function () {
      var players = A.S.players, n = players.length;
      var opts = { cat: 'random', mode: 'confused', imps: 1 };

      function setup() {
        var cats = Object.keys(A.data.words);
        A.render('<div class="center left"><p class="eyebrow">Imposter setup</p>' +
          '<div class="card" style="width:100%"><h3>Word category</h3><div class="chips">' +
          A.chip('cat', 'random', '🎲 Surprise me', opts.cat === 'random') +
          cats.map(function (k) { return A.chip('cat', k, A.data.words[k].emoji + ' ' + A.data.words[k].label, opts.cat === k); }).join('') +
          '</div></div>' +
          '<div class="card" style="width:100%"><h3>What does the imposter get?</h3><div class="chips">' +
          A.chip('mode', 'confused', '🌀 A similar word (they don’t know!)', opts.mode === 'confused') +
          A.chip('mode', 'clueless', '🤫 No word (they know)', opts.mode === 'clueless') +
          '</div></div>' +
          (n >= 7 ? '<div class="card" style="width:100%"><h3>How many imposters?</h3><div class="chips">' +
            A.chip('imps', '1', '1 imposter', opts.imps === 1) + A.chip('imps', '2', '2 imposters', opts.imps === 2) + '</div></div>' : '') +
          '<button class="btn primary big" id="go">Deal the words</button></div>',
          { '.chip': A.chipHandler(opts), '#go': deal });
      }

      function deal() {
        var key = opts.cat === 'random' ? A.pick(Object.keys(A.data.words)) : opts.cat;
        var cat = A.data.words[key], pair = A.pick(cat.pairs);
        if (Math.random() < 0.5) pair = [pair[1], pair[0]];
        var imps = [];
        var count = Math.min(opts.imps, n >= 7 ? 2 : 1);
        while (imps.length < count) { var k = A.rand(n); if (imps.indexOf(k) < 0) imps.push(k); }

        function secret(p, i) {
          var catLine = '<small>Category: ' + cat.emoji + ' ' + cat.label + '</small>';
          if (imps.indexOf(i) >= 0) {
            return opts.mode === 'confused'
              ? '<div class="word">' + A.esc(pair[1]) + '</div>' + catLine
              : '<div class="imp">🕵️ You are the IMPOSTER</div><small>No word for you. Bluff!</small>' + catLine;
          }
          return '<div class="word">' + A.esc(pair[0]) + '</div>' + catLine;
        }
        A.passAround(players, secret, function () { discuss(pair, imps, cat); },
          { sub: 'Look at your word. Keep a poker face.', last: 'Got it — start the game' });
      }

      function discuss(pair, imps, cat) {
        var starter = A.pick(players), left = 180;
        A.render('<div class="center"><p class="eyebrow">Discussion</p>' +
          '<h1>' + A.who(starter) + ' goes first</h1>' +
          '<p class="mute">Go around the circle. Each person says <b>one clue word</b> about their secret word. Do two rounds, then argue!</p>' +
          '<div class="ring" id="ring"><div class="timer" id="t" style="font-size:28px">' + fmt(left) + '</div></div>' +
          '<button class="btn primary big" id="vote">Time to vote 🗳️</button></div>',
          { '#vote': function () { vote(pair, imps, cat, players.map(function (p, i) { return i; }), imps.length); } });
        A.interval(function () {
          left--; var t = A.$('#t'); if (!t) return;
          t.textContent = fmt(Math.max(left, 0));
          var rg = A.$('#ring'); rg.style.setProperty('--p', Math.max(left, 0) / 180 * 100 + '%');
          if (left === 30) { t.classList.add('low'); rg.classList.add('low'); A.beep(500, 150); }
          if (left <= 0) { A.beep(300, 600, 'sawtooth'); A.buzz(400); }
        }, 1000);
      }

      function vote(pair, imps, cat, alive, impsLeft) {
        A.render('<div class="center"><p class="eyebrow">Vote</p><h1>Who’s the imposter?</h1>' +
          '<p class="mute">Count 3-2-1 and everyone points at a suspect. Then tap the person with the most fingers.</p>' +
          '<div class="pgrid" id="vg"></div></div>');
        var g = A.$('#vg');
        g.innerHTML = players.map(function (p, i) {
          return '<button class="pchip' + (alive.indexOf(i) < 0 ? ' dead' : '') + '" data-i="' + i + '">' + A.who(p) + '</button>';
        }).join('');
        A.$$('.pchip', g).forEach(function (b) {
          b.onclick = function () { A.unlockAudio(); verdict(+b.dataset.i, pair, imps, cat, alive, impsLeft); };
        });
      }

      function verdict(k, pair, imps, cat, alive, impsLeft) {
        var guilty = imps.indexOf(k) >= 0;
        alive = alive.filter(function (x) { return x !== k; });
        if (guilty) impsLeft--;
        var crew = alive.length - impsLeft;
        var crewWin = impsLeft === 0, impWin = !crewWin && crew <= impsLeft;
        var head = guilty ? 'Caught one!' : 'Wrong! ' + A.esc(players[k].name) + ' was innocent.';
        if (crewWin || impWin) return finish(crewWin, pair, imps, cat);
        A.render('<div class="center"><div class="bigav">' + (guilty ? '🎯' : '😬') + '</div><h1>' + head + '</h1>' +
          '<p class="mute">' + A.esc(players[k].name) + ' is out. ' + impsLeft + ' imposter' + (impsLeft > 1 ? 's' : '') + ' still hiding among ' + alive.length + ' players. Another round of clues, then vote again.</p>' +
          '<button class="btn primary big" id="more">Vote again</button></div>',
          { '#more': function () { vote(pair, imps, cat, alive, impsLeft); } });
      }

      function finish(crewWin, pair, imps, cat) {
        var names = imps.map(function (i) { return A.who(players[i]); }).join(' &amp; ');
        A.render('<div class="center"><div class="bigav">' + (crewWin ? '🎉' : '😈') + '</div>' +
          '<h1>' + (crewWin ? 'The crew wins!' : 'The imposter wins!') + '</h1>' +
          '<p class="mute">The imposter' + (imps.length > 1 ? 's were' : ' was') + '</p><div class="who">' + names + '</div>' +
          '<div class="card" style="width:100%"><p class="mute small">Crew word</p><h2>' + A.esc(pair[0]) + '</h2>' +
          '<p class="mute small" style="margin-top:8px">Imposter’s ' + (opts.mode === 'confused' ? 'word' : 'secret') + '</p><h2>' + (opts.mode === 'confused' ? A.esc(pair[1]) : 'none 🤫') + '</h2></div>' +
          '<div class="stack"><button class="btn primary big" id="again">New words, same players</button>' +
          '<button class="btn ghost" id="home">Pick another game</button></div></div>',
          { '#again': deal, '#home': function () { A.showPicks(); } });
        setTimeout(function () { A.confetti(crewWin ? 120 : 70); A.sfx(crewWin ? 'win' : 'lose'); A.buzz([40, 30, 40]); }, 300);
      }

      setup();
    }
  });
})();
