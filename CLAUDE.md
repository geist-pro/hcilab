# HCI Lab Website

Astro static site for the Human Computer Interaction Lab.

## Commands

```bash
npm run dev      # dev server at localhost:4321
npm run build    # production build → dist/
npm run preview  # preview the built site locally
```

## Stack

- **Astro** with vanilla CSS (no Tailwind)
- Deployed to `geist-pro.github.io/hcilab` via GitHub Actions
- Base path: `/hcilab` (set in `astro.config.mjs`)

## Key files

| File | Purpose |
|------|---------|
| `src/data/publications.ts` | Parses `../kaikunze.de/kaikunze.de-papers/publications.md` at build time |
| `src/data/team.ts` | Configure team members here |
| `src/styles/global.css` | Design tokens + utility classes |
| `src/components/` | All Astro components |
| `src/pages/index.astro` | Homepage |
| `src/pages/publications/index.astro` | Publications list with client-side search |
| `.github/workflows/deploy.yml` | CI/CD: pushes dist/ to GitHub Pages |

## Adding team members

Edit `src/data/team.ts`. Place photos in `public/team/` (square, ideally 200×200px).

## Design system (Anthropic-inspired)

```css
--color-accent: #d97757  /* rust/terracotta */
--color-bg:     #faf9f6  /* warm off-white */
--color-text:   #131314  /* near-black */
```

Fonts: **Plus Jakarta Sans** (headings) + **Inter** (body) — both from Google Fonts.

## Publications data

`publications.ts` reads `../kaikunze.de/kaikunze.de-papers/publications.md` relative to the project root at build time.
PDF/BibTeX links are rewritten to absolute `https://kaikunze.de/papers/...` URLs.

## Accessibility targets

- WCAG AA contrast
- Semantic HTML (`nav`, `main`, `article`, `section`, `footer`)
- `prefers-reduced-motion` disables all transitions
- ARIA live region on publications search result count
- Focus-visible styles on all interactive elements
