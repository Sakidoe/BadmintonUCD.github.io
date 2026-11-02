# Badminton Club at UC Davis — website

Source for [ucdavisbadminton.com](https://ucdavisbadminton.com). Vite + TypeScript, no framework,
GSAP for the home-page scroll animation. Deploys to GitHub Pages via GitHub Actions.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/ locally
```

## Deploy (GitHub Pages)

1. Push this folder to a GitHub repo (e.g. `Sakidoe/BadmintonUCD.github.io`) on the `main` branch.
2. In the repo: **Settings → Pages → Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which builds and publishes `dist/`.
4. The custom domain comes from `public/CNAME` (`ucdavisbadminton.com`). Keep your DNS as-is.

## Where to edit things

Almost everything you will change season to season lives in **`src/data/`**. Each file has a
comment block at the top explaining its fields.

| I want to change…                               | Edit                                          |
| ----------------------------------------------- | --------------------------------------------- |
| Officers (names, roles, photos, Instagram)      | `src/data/officers.ts` + photos in `public/img/` |
| Board year label                                | `src/data/officers.ts` → `boardYear`          |
| **Davis Fall Open** (date, venue, registration link, events, schedule, FAQ, photos, sponsors) | `src/data/fallOpen.ts` |
| Join steps, deadlines, dues, form links         | `src/data/join.ts`                            |
| Events list & weekly practice schedule          | `src/data/events.ts`                          |
| **Event detail pages** (one per event)          | `src/content/events/<slug>.mdx` — Markdown + `<Note>` / `<Button>` |
| Davis Spring Open poster (Events page)          | `src/data/springOpen.ts`                      |
| Mission, goals, home-page stats, photo gallery  | `src/data/about.ts`                           |
| Nav links, the centre nav button, socials, email, footer credit | `src/data/site.ts`             |
| Static page copy (headlines, paragraphs)        | The `.html` file for that page — each section is marked with a `<!-- SECTION: … -->` comment |
| Colours, fonts, spacing, radii                  | `src/styles/tokens.css`                       |
| Nav bar look (glass, pill, CTA)                 | `src/styles/nav.css`                          |
| Hero animation timing / cow poses               | `src/hero/rallyAnimation.ts`                  |
| Hero mascot layers (re-cut from a new drawing)  | `scripts/cut_cow.py` → `public/img/hero/`, `src/hero/cowLayers.ts` |

### Fall Open placeholders

`src/data/fallOpen.ts` ships with `date`, `registrationDeadline`, `entryFee` set to `TBA` and
`registrationUrl` set to `#`. Those render with a dashed gold outline on the page so they are easy
to spot. Fill them in and set `registrationOpen: true` to turn the "Registration opening soon"
button into a live "Register now" link.

### Event pages (MDX)

Every card on the Events page opens `/event.html?e=<slug>`, rendered from
`src/content/events/<slug>.mdx`. To add one, copy `_template.mdx`, name it after the slug,
add a matching entry (with the same `slug`) to `src/data/events.ts`, and write. Frontmatter
sets `title`, `subtitle` and `hero` (image path). Plain Markdown works; `<Note>` and
`<Button href>` are available without importing (defined in `src/content/mdx-components.tsx`).

### Adding a page

1. Copy one of the root `.html` files (e.g. `events.html`) and rename it.
2. Add its name to the `pages` array in `vite.config.ts`.
3. Set `<body data-page="your-page">` and, if it needs its own script, add
   `src/pages/yourPage.ts` (export an `init()` function) and register it in `src/main.ts`.
4. Add a link in `src/data/site.ts` if it belongs in the nav.

### Adding photos

Drop JPGs into `public/img/` and reference them as `/img/name.jpg`. Keep them under ~1800 px on
the long edge (the photos in this repo were resized from the originals; the site went from 137 MB
of images to under 8 MB).

## Project layout

```
index.html, about.html, events.html, board.html, join.html, fall-open.html   ← pages
public/            static files served as-is (img/, favicon, CNAME, the physical form PDF)
src/
  main.ts          shared entry: mounts nav + footer, scroll reveals, loads the page module
  data/            ← content (edit these)
  pages/           per-page rendering (turns data into HTML)
  components/      nav, footer, icons
  hero/            the cow-mascot smash scene (SVG <image> layers) + GSAP scroll timeline
scripts/cut_cow.py cuts scripts/cow-source.png into the hero layers (needs numpy, scipy, opencv, pillow)
scripts/cut_fall_logo.py splits scripts/fall-logo-source.png into public/img/art/fall-cow.png + fall-croissant.png
  lib/             tiny helpers (html tagged template, scroll reveal)
  styles/          tokens → base → nav → components → hero
.github/workflows/deploy.yml   GitHub Pages deploy
```

## Conventions

- `data-reveal` on any element fades/slides it in on scroll. `data-stagger="90"` on a parent
  staggers its children.
- `data-mount="name"` marks where a page module injects rendered content.
- All text is Raleway (loaded from Google Fonts in `src/styles/index.css`).
- The hero mascot is the original cow drawing split into layers by colour (`python3 scripts/cut_cow.py`).
  To swap the drawing, replace `scripts/cow-source.png` with a same-layout PNG and re-run the script.
- Respects `prefers-reduced-motion`: the hero shows a static frame and reveals are instant.
