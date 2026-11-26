(function () {
  'use strict';
  var A = window.AATAA;

  A.games.push({
    id: 'mystery', name: 'Mystery Stories', emoji: '🔍',
    tagline: 'A weird story, a hidden truth. Ask yes/no questions to crack it.',
    min: 3, max: 12, mins: [10, 30], tags: ['brainy', 'sneaky'], energy: 2,
    rules: [
      'Pick a <b>narrator</b>. They secretly read the real explanation on the phone.',
      'The narrator reads the strange story aloud. Everyone else asks <b>yes/no questions</b>.',
      'Narrator answers only “Yes”, “No” or “Irrelevant”. Stuck? Use a hint. Solve it together!'
    ],
    start: function () {
      var players = A.S.players, stories = A.shuffle(A.data.mystery), i = 0;

      function chooseNarrator() {
        var s = stories[i % stories.length];
        A.render('<div class="center"><p class="eyebrow">Mystery #' + (i + 1) + '</p><h1>Who’s the narrator?</h1>' +
          '<p class="mute">The narrator sees the secret solution and answers everyone’s questions with Yes / No / Irrelevant.</p>' +
          '<div class="pgrid">' + A.pchips(players) + '</div></div>',
          { '.pchip': function (e, el) { narrator(players[+el.dataset.i], s); } });
      }

      function narrator(p, s) {
        A.pass(p, {
          sub: 'Everyone else: look away for a moment!',
          onTap: function () {
            A.secret({
              player: p,
              html: '<small>The truth</small><p class="ans">' + A.esc(s.solution) + '</p>',
              done: 'Memorised — start the mystery',
              onDone: function () { play(p, s); }
            });
          }
        });
      }

      function play(p, s) {
        var shown = 0;
        A.render('<div class="center left" style="justify-content:flex-start">' +
          '<p class="eyebrow">Narrator: ' + A.esc(p.name) + ' ' + p.emoji + '</p>' +
          '<div class="story"><h2>' + A.esc(s.title) + '</h2><p>' + A.esc(s.story) + '</p></div>' +
          '<div class="reply"><span>✅ Yes</span><span>❌ No</span><span>🤷 Irrelevant</span></div>' +
          '<div id="hints" class="stack"></div>' +
          '<div id="sol"></div>' +
          '<div class="stack"><button class="btn ghost" id="hint">💡 Give a hint (0/' + s.hints.length + ')</button>' +
          '<button class="btn ghost" id="rev">🔓 Reveal the solution</button>' +
          '<button class="btn primary big" id="next">Next mystery ▶</button></div></div>',
          {
            '#hint': function (e, el) {
              A.sfx('chime');
              A.$('#hints').insertAdjacentHTML('beforeend', '<div class="hint">💡 ' + A.esc(s.hints[shown]) + '</div>');
              shown++;
              el.textContent = '💡 Give a hint (' + shown + '/' + s.hints.length + ')';
              if (shown >= s.hints.length) el.disabled = true;
            },
            '#rev': function (e, el) {
              A.sfx('win'); A.confetti(50);
              A.$('#sol').innerHTML = '<div class="solution"><b>Solution:</b> ' + A.esc(s.solution) + '</div>';
              el.disabled = true;
            },
            '#next': function () { i++; chooseNarrator(); }
          });
      }
      chooseNarrator();
    }
  });
})();
