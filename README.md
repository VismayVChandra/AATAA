# AATAA — party games for a bored crowd

A pass-the-phone game hub. Tell it how many people, the age group, the vibe and the time you have,
and it recommends three games in order: **warm-up → main event → wildcard**.

- 100% static: plain HTML/CSS/JS. **No backend, no database, no API keys, no AI at runtime.**
- Works **offline** after the first visit and can be **installed** to the home screen (PWA).
- Content (prompts, riddles, words) lives in `data/*.js`. Edit those files to add more.

## Features worth knowing about

- **Game Night:** from the lineup, “Run the whole night” plans a ladder of games that fits your time and keeps one scoreboard
  (3/2/1 points per game, or tap an MVP) with a champion card at the end.
- **Make it personal:** one inside joke per friend (“is most likely to…”) that appears in Most Likely To and Truth or Dare.
- **No repeats:** prompts a phone has already shown come last (hashes only, stored in `localStorage`, key `aataa.mem`).
- **Host voice:** the 🗣️ button reads prompts aloud using the browser's built-in speech. Tap a prompt card to hear it again.

## Font

Text uses **Plus Jakarta Sans** (variable, Latin subset), bundled in `fonts/` so every phone shows the same look and it
works offline. It is licensed under the SIL Open Font License; see `fonts/FONT-LICENSE.txt`.

## Run it locally

```powershell
python -m http.server 8080
```

Open http://localhost:8080 (or `http://<your-PC-ip>:8080` on a phone on the same Wi-Fi).
Opening `index.html` directly also works; only offline install needs a server.

## Deploy for free

Any static host works. Easiest options (all free, all give a free subdomain):

1. **Cloudflare Pages** / **Netlify** — drag and drop this folder in the dashboard.
2. **GitHub Pages** — push the folder to a repo, enable Pages on the `main` branch.

A custom domain is optional and is the only possible cost.

> After changing any file, bump `VERSION` in `sw.js` so installed copies pick up the update.

## Adding content

| What | File |
|---|---|
| "Most likely to" prompts | `data/likely.js` |
| Would-you-rather pairs | `data/wyr.js` |
| Riddles | `data/riddles.js` |
| Imposter word pairs | `data/words.js` |
| Bomb categories + forfeits | `data/bomb.js` |
| Charades decks | `data/charades.js` |
| Mystery stories | `data/mystery.js` |
| Truth / Dare / Chaos | `data/tod.js` |
| Nickname packs (Avengers…) | `data/packs.js` |
| Rank Your Friends prompts | `data/rank.js` |
| Never Have I Ever statements | `data/never.js` |
| Two Truths & a Lie topic nudges | `data/twotruths.js` |
| "AATAA of the day" twists | `data/daily.js` |
| Extra content for the base decks | `data/more.js` (add to the existing arrays) |

Age tiers: a plain string is for everyone; `{ t: "text", m: 1 }` needs 18+, `m: 2` needs 25+.

## Adding a game

Create `js/games/yourgame.js`, `A.games.push({ id, name, emoji, tagline, min, max, mins, tags, energy, rules, start })`
(copy `wyr.js` as a template), add `<script>` tags in `index.html`, and add the file to `sw.js`.
`energy` 1 = warm-up, 2 = main event, 3 = wildcard.
