(function () {
  'use strict';
  var A = window.AATAA;

  A.games.push({
    id: 'twotruths', name: 'Two Truths & a Lie', emoji: '🤥',
    tagline: 'Say three things about yourself. One is a lie. Can they spot it?',
    min: 3, max: 12, mins: [10, 30], tags: ['sneaky', 'teasing', 'chill'], energy: 2,
    rules: [
      'The phone picks a storyteller. They say <b>three things about themselves</b> out loud: two true, one lie, in any order.',
      'Everyone else counts down and holds up <b>1, 2 or 3 fingers</b> for the statement they think is the lie.',
      'Storyteller reveals the lie. Tap everyone who guessed right. Spotters score, and so does the storyteller for each person fooled.'
    ],
    start: function () {
      var players = A.S.players, n = players.length;
      var scores = players.map(function () { return 0; });
      var order = A.shuffle(players.map(function (p, i) { return i; })), turn = 0;

      function tell() {
        var k = order[turn % n], p = players[k], left = 60;
        A.render('<div class="center"><p class="eyebrow">Turn ' + (turn + 1) + ' · storyteller</p>' +
          '<div class="who" style="font-size:24px">' + A.who(p) + '</div>' +
          '<h2>Think of 2 truths and 1 lie</h2>' +
          '<div class="prompt sm"><small>Need an idea? Try</small><b>' + A.esc(A.pick(A.data.twotruths.nudges)) + '</b></div>' +
          '<div class="ring" id="ring"><div class="timer" id="t">' + left + '</div></div>' +
          '<button class="btn primary big" id="done">Said them — time to vote</button></div>',
          { '#done': function () { vote(k); } });
        A.say(p.name + ', think of two truths and one lie, and tell us all three.');
        A.interval(function () {
          left--; var t = A.$('#t'); if (!t) return;
          t.textContent = Math.max(left, 0);
          var rg = A.$('#ring'); rg.style.setProperty('--p', Math.max(left, 0) / 60 * 100 + '%');
          if (left <= 10) { rg.classList.add('low'); t.classList.add('low'); }
          if (left === 0) { A.beep(300, 500, 'sawtooth'); A.buzz(300); }
        }, 1000);
      }

      function vote(k) {
        A.render('<div class="center"><p class="eyebrow">Everyone but ' + A.esc(players[k].name) + '</p><div class="cd" id="cd">3</div>' +
          '<p class="mute">Hold up <b>1, 2 or 3 fingers</b> for the statement you think is the LIE.</p></div>');
        A.countdown(A.$('#cd'), 3, function () { reveal(k); });
      }

      function reveal(k) {
        var chips = players.map(function (p, i) {
          return i === k ? '' : '<button class="pchip" data-i="' + i + '">' + A.who(p) + '</button>';
        }).join('');
        A.render('<div class="center"><div class="point" style="font-size:36px">🤥 Reveal!</div>' +
          '<p class="mute"><b>' + A.esc(players[k].name) + '</b>, tell everyone which one was the lie. Then tap everyone who guessed right.</p>' +
          '<div class="pgrid">' + chips + '</div>' +
          '<p class="mute small">Nobody tapped = you fooled the whole room 😈</p>' +
          '<button class="btn primary big" id="ok">Confirm</button></div>',
          {
            '.pchip': function (e, el) { el.classList.toggle('sel'); },
            '#ok': function () {
              var right = A.$$('.pchip.sel');
              right.forEach(function (b) { scores[+b.dataset.i]++; });
              scores[k] += (n - 1 - right.length);
              A.toast(right.length ? right.length + ' spotted it' : 'Fooled everyone!');
              turn++;
              if (turn % n === 0) end(); else tell();
            }
          });
      }

      function end() {
        A.results({
          title: 'Truth detectors', emoji: '🤥', scores: scores, unit: 'pts', againLabel: 'Another round',
          titles: [['Master Deceiver', 'Poker Face Champion', 'Born Liar', 'Lie Detector Certified'],
                   ['Open Book', 'Wears It All on Their Face', 'Honest to a Fault', 'Easiest to Read']],
          line: function (rows) { return rows[0].s ? A.esc(rows[0].p.name) + ' is the one to watch tonight.' : 'Nobody scored. Everyone is a terrible liar.'; },
          again: function () { turn = 0; order = A.shuffle(order); tell(); }
        });
      }
      tell();
    }
  });
})();
