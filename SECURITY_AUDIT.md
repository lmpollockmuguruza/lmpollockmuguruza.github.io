# Security Audit — lmpollockmuguruza.github.io

Date: 2026-06-09
Scope: all pages (`index.html`, `did-it-rain/`, `cinefilematic/`, `gallery/`,
`tools/`, `architecture/`, `ofinterest/`, `fund-strategy-game/`,
`pl-vibe-quiz/`).

## Summary

This is a fully static GitHub Pages site with **no secrets, no
authentication, and no server-side code**, so the attack surface is small.
No embedded API keys or tokens were found anywhere; the only external API
called is the public, key-less Open-Meteo API (`did-it-rain`). The `tools/`
generator already HTML-escapes user input via `escapeHtml()` before
rendering. Nothing here is exploitable today; the items below are hardening
suggestions.

## Findings (all LOW)

### 1. Heavy `innerHTML` usage — latent XSS pattern

Many pages build markup with `innerHTML` (e.g. `did-it-rain`, `tools`,
`architecture`, `cinefilematic`). Today the interpolated values are either
hardcoded data, numbers, or escaped strings, so there is no current XSS. The
risk is future drift: if any of these templates ever starts interpolating
URL parameters, `localStorage` contents, or fetched JSON written by someone
else, it becomes injectable.

**Fix:** keep using `escapeHtml()` for every interpolated string (as
`tools/index.html` does), prefer `textContent` for plain text nodes, and
treat `gallery/gallery.json` and any future fetched data as untrusted.

### 2. No Content-Security-Policy

GitHub Pages doesn't let you set response headers, but a meta tag works:

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; img-src 'self' https: data;
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
               font-src https://fonts.gstatic.com;
               connect-src 'self' https://api.open-meteo.com https://archive-api.open-meteo.com;
               script-src 'self' 'unsafe-inline'">
```

(Adjust per page; pages with inline scripts need `'unsafe-inline'` unless
you move scripts to files.) This turns any future injected markup from
"exploit" into "blocked by CSP".

### 3. `target="_blank"` links without `rel="noopener noreferrer"`

Modern browsers imply `noopener` for `target="_blank"`, but adding
`rel="noopener noreferrer"` explicitly protects older browsers from
reverse-tabnabbing and avoids leaking the referrer.

### 4. Enforce HTTPS

Make sure **Settings → Pages → Enforce HTTPS** is enabled for the repo so
`http://` requests redirect (it usually is by default, worth confirming).

### 5. Third-party font loading

Google Fonts is loaded from Google's CDN on most pages — a privacy
(IP-leak) and availability dependency rather than a vulnerability.
Self-hosting the two or three font families used would remove it.

## Non-findings worth noting

- `google288b21b0501e7caa.html` is a Google site-verification file; it is
  intended to be public and is not a secret.
- `cinefilematic` and `fund-strategy-game` only persist state to the user's
  own `localStorage` — no data leaves the browser.
