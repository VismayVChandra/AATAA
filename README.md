# AATAA — party games for a bored crowd

A pass-the-phone game hub. Tell it how many people, the age group, the vibe and the time you have,
and it recommends three games in order: **warm-up → main event → wildcard**.

- 100% static: plain HTML/CSS/JS. **No backend, no database, no API keys, no AI at runtime.**
- Works **offline** after the first visit and can be **installed** to the home screen (PWA).
- Content (prompts, riddles, words) lives in `data/*.js`. Edit those files to add more.

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

Age tiers: a plain string is for everyone; `{ t: "text", m: 1 }` needs 18+, `m: 2` needs 25+.

## Adding a game

Create `js/games/yourgame.js`, `A.games.push({ id, name, emoji, tagline, min, max, mins, tags, energy, rules, start })`
(copy `wyr.js` as a template), add `<script>` tags in `index.html`, and add the file to `sw.js`.
`energy` 1 = warm-up, 2 = main event, 3 = wildcard.
