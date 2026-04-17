# SEO Audit Script (Reusable)

A lightweight Next.js SEO audit runner for local or staging environments.

## What it checks
- `robots.txt` availability and Sitemap directive
- `sitemap.xml` availability and URL count
- Static App Router pages are included in sitemap (`app/**/page.tsx`, excluding dynamic routes)
- favicon declaration and favicon URL reachability
- Next image optimization config (`image/webp` + `image/avif` in `next.config.*`)
- image localization checks:
  - external image URL references in source code
  - rendered page `<img>` external absolute URL usage
- font strategy checks:
  - remote Google Fonts CSS import detection (`fonts.googleapis.com`)
  - `next/font/google` vs `next/font/local` usage hint
- hardcoded year detection in `app/src` content (`20xx`), to encourage dynamic year rendering
- homepage social metadata checks:
  - Open Graph / Twitter core tags completeness
  - `og:image` reachability and image content type
- homepage structured data checks:
  - JSON-LD presence and parse validity
  - basic schema entity completeness (`@context`, `@type`, `name`, `url`)
- canonicalization checks:
  - http -> https redirect (non-localhost)
  - www/non-www host canonicalization (non-localhost)
  - trailing slash canonicalization on sampled page
- orphan page detection via internal crawl from homepage (non-localhost)
- lightweight homepage performance baseline (TTFB, HTML bytes, script/stylesheet counts)
- Per-page checks from sitemap URLs:
  - HTTP status
  - `<title>` and length
  - `meta description` and length
  - canonical existence and path match
  - `<h1>` existence/count
  - `<img>` missing `alt` / empty `alt`
  - `meta robots` with `noindex`

## Usage
From project root:

```bash
npm run seo:audit
```

With custom base URL:

```bash
node script/seo-audit-nextjs/index.mjs --base https://example.com
```

JSON output for CI:

```bash
node script/seo-audit-nextjs/index.mjs --base https://example.com --json
```

## CLI options
- `--base` default: `http://127.0.0.1:3000`
- `--sitemap` default: `${base}/sitemap.xml`
- `--timeout` default: `10000` (ms)
- `--max-pages` default: `500`
- `--fail-under` default: `85`
- `--use-sitemap-host` default: `false` (by default, sitemap URLs are remapped to `--base` host for local audit)
- `--json` output JSON instead of human-readable text

## Exit code
- Returns non-zero when:
  - any `error` issue exists, or
  - score is below `--fail-under`

This makes it ready for CI pipelines.
