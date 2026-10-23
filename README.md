# 🌵 Big Bend or Bust!

A single-page trip site for the **November 13–17, 2026** run to Big Bend National Park:
**Lajitas → Terlingua → Chisos Basin → Marathon.**

One scrollable page. Plain HTML, CSS and JavaScript — no build step, no frameworks, no API keys.

**Live site:** `https://<your-github-user>.github.io/big-bend-2026/` *(fill this in once Pages is on)*

---

## What's on the page

| Section | What it does |
| --- | --- |
| **Banner** | `images/images100.jpg` as the hero, with a live countdown to 7:00 AM, Friday Nov 13 |
| **Countdown** | Days / hours / minutes / seconds, a status card with a progress meter, and 11 milestone countdowns |
| **What should I be doing now** | Reads the itinerary and shows the *current* activity, the *next* one with a countdown, and the rest of today. Before the trip it flips to pre-flight mode with prep nudges; after it switches to the wrap-up list |
| **Weather forecast** | Nov 13–20 for Lajitas/Terlingua, Chisos Basin and Marathon — live Open-Meteo forecasts when the dates are inside the 16-day window, otherwise 5-year averages for the same dates. °F/°C toggle, offline caching, manual refresh |
| **Packing** | 16 items with checkboxes that persist on your device, plus the **NO WATER AT CAMP** warning |
| **Itinerary** | 8-day calendar grid (Nov 13–20). Days 1–5 are clickable and jump to the full details |
| **Day by day** | The full story of each day, the fun facts, and a 20-photo lightbox gallery |
| **Links** | Lajitas Golf Resort, "The Greatest Hike in Texas", and the Google My Map |

## Files

```
index.html          the page itself (GitHub Pages entry point — keep it in the root)
assets/styles.css   all styling: desert-sunset theme, responsive, focus states, print styles
assets/app.js       countdown, "right now", weather engine, packing, lightbox, mobile nav
images/*.jpg        the original photos (21 files)
images/web/         optimized copies for the browser (image007: 1.1 MB → 389 KB)
HTML_Build_Page.md  the original brief
```

## Preview it locally

```powershell
cd "G:\My Drive\Google Documents\Travel\Big_Bend_2026"
python -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` straight from File Explorer works too — the weather fetch is CORS-open, so it behaves the same.

## How the dynamic parts work

Everything time-based runs on **America/Chicago** and is driven by a few arrays at the top of `assets/app.js`:

- `TRIP` — departure / return / planning-start timestamps and the trip day list
- `SCHEDULE` — one object per agenda item (`start`, `end`, `icon`, `time`, `title`, `place`, `note`)
- `MILESTONES` — the highlights listed in the countdown card
- `PREP` — the before-you-go nudges
- `WX` — weather locations, dates, cache key and the 16-day horizon

**The trip year is 2026.** To move the trip, update `TRIP.days` + `TRIP.startISO`/`endISO`, every `start`/`end` in `SCHEDULE`, `MILESTONES`, and `WX.dates` / `WX.where`. Keep the `-06:00` offsets (CST) unless the trip moves to a different season — after the first Sunday in November, Texas is on standard time.

### Weather: live vs typical

- **Live:** `api.open-meteo.com/v1/forecast` — 16-day horizon, free, no key, CORS enabled for browser use
- **Typical:** `archive-api.open-meteo.com/v1/archive` — the same calendar dates from 2021–2025, averaged (ERA5 reanalysis). Every cell built this way is labelled **TYPICAL** and every live one is labelled **LIVE**
- **Right now the trip is outside the live window**, so the whole table reads TYPICAL. **Nov 13 flips to LIVE on Oct 29, 2026**, Nov 14 on Oct 30, and so on — the page handles the switch on its own, no edits required
- Results are cached in `localStorage` for 3 hours and re-rendered from that cache when the network is gone (useful in the basin, where there is no signal)
- Weather data by [Open-Meteo.com](https://open-meteo.com/), CC-BY 4.0

## Deploying to GitHub Pages

```powershell
cd "G:\My Drive\Google Documents\Travel\Big_Bend_2026"
git init -b main
git add .
git commit -m "Big Bend or Bust trip page"
git remote add origin https://github.com/ericwensel/big-bend-2026.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `/ (root)` → Save.**
The site shows up at `https://<your-user>.github.io/big-bend-2026/` a minute or two later. Every later
`git push` republishes it.

### Gotchas

- `index.html` must stay in the repository root — Pages looks for it there.
- All paths are relative and lowercase. **GitHub Pages is case-sensitive** (unlike Windows), so keep `images/` lowercase.
- This folder lives inside Google Drive, which will also sync the `.git` folder. That works, but if Drive ever
  locks a file mid-commit, pause Drive sync, run the commit, then resume.

## Notes and quirks

- The brief called the banner `image100.jpg`; the file on disk is **`images/images100.jpg`**, so that is what the page uses.
  It is only 738×246, so the hero caps its height and lays a gradient over it rather than stretching it to full screen.
  If you want a sharper banner later, `image011.jpg` (South Rim, 1200×844) drops straight in.
- Every one of the 21 photos has real alt text describing what is actually in the frame.
- `image007.jpg` (the tent photo) is served from `images/web/` at 1600 px for speed; clicking it opens the full-resolution original.
- The Google My Maps link is the *edit* URL from the brief, so it may prompt you to sign in.
- The packing checkboxes and the °F/°C choice are stored in `localStorage`, so they are per-device — nothing is sent anywhere.
- No tracking, no cookies, no third-party scripts. The only network request the page makes is to Open-Meteo.
