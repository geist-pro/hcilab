# hcilab.io → geist.pro

hcilab.io is retired (30 October 2026). The lab's web site is https://geist.pro/ (source: `geist-pro/new-site`,
built output: `geist-pro/geist-pro.github.io`).

This repository only keeps the domain forwarding. `site/` is published as is by GitHub Pages
(`.github/workflows/deploy.yml`, on every push to `main`):

| hcilab.io address | forwards to |
|---|---|
| `/` | `https://geist.pro/` |
| `/#research`, `/#team`, `/#apply`, `/#publications` | `/research/`, `/people/`, `/join/`, `/publications/` on geist.pro |
| `/publications/` | `https://geist.pro/publications/` |
| anything else (`404.html`) | the same path on geist.pro |

Each page is a meta refresh plus a canonical link (GitHub Pages cannot send a real 301); the JavaScript adds the
hash and path mapping. The custom domain and its certificate stay configured in the repository's Pages settings
(`site/CNAME` keeps them on deploy). The old Astro site is in the git history before this commit.
