# My Website

A simple static website, deployed to a custom domain via Cloudflare Pages.

## Files
- `index.html` — the home page
- `styles.css` — the styling

## How updates work
1. Edit files locally (with help from Claude Code).
2. Commit and push to GitHub.
3. Cloudflare Pages automatically deploys the new version to the live domain.

## Shared header and footer

The header and footer are **not** edited inside each page. They live in `partials/`
and are injected into every page by a build step.

```
partials/header.html    the site header and nav
partials/footer.html    the site footer
build.py                injects both into all 29 pages
```

### Workflow

1. Edit `partials/header.html` or `partials/footer.html`
2. Run `python build.py`
3. Commit the partials **and** the regenerated pages

```bash
python build.py           # rebuild every page
python build.py --check   # list pages that are out of date, change nothing
```

Inside each page the injected markup sits between markers. Do not hand-edit
between them, the next build overwrites it:

```html
<!-- BUILD:header -->  ...generated...  <!-- /BUILD:header -->
<!-- BUILD:footer -->  ...generated...  <!-- /BUILD:footer -->
```

### Path tokens

Pages sit at two depths (root and `blogs/`), so the partials use tokens that
`build.py` resolves per page:

| Token | root `index.html` | other root pages | `blogs/*.html` |
|---|---|---|---|
| `{{BASE}}` | `` | `` | `../` |
| `{{HOME}}` | `` | `index.html` | `../index.html` |
| `{{HOME_HREF}}` | `/` | `/` | `/` |

So `{{HOME}}#topics` becomes `#topics` on the homepage, `index.html#topics` on
`about.html`, and `../index.html#topics` inside `blogs/`. Relative paths are used
rather than root-relative so the site still previews correctly from the filesystem.

### Why a build step and not a JavaScript include

Fetching the header and footer with JavaScript would leave crawlers with an empty
nav on first render and would weaken every internal link in the footer. The build
step keeps the shipped HTML fully static while still giving one place to edit.

## Topic pages

Articles are grouped into six subject topics under `topics/`. Each topic page carries a real
introduction, a "start here" pointer to that topic's pillar article, and every article in the
topic newest first.

```
topics/index.html                     all six topics
topics/productivity.html              7 articles
topics/time-tracking.html             4
topics/employee-monitoring.html       4
topics/engagement-and-retention.html  3
topics/time-management.html           2
topics/burnout-and-wellbeing.html     2
```

The taxonomy is by **subject**, not by format. An earlier "Guides" tag held 10 of 22 articles and
mixed burnout, monitoring, and capacity planning together, which made a poor hub page. Each
article now belongs to exactly one topic, and its visible tag, `article:section` meta, and
JSON-LD `articleSection` all match.

Topic pages carry `CollectionPage`, `ItemList`, and `BreadcrumbList` schema, and are included in
`sitemap.xml`. They are not in `feed.xml`, which stays articles-only.

Adding an article means adding its slug to the right topic list and regenerating, then running
`python build.py` to refresh the shared header and footer.
