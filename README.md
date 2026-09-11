# certos.ai

The Certos website: a hand-built static site, no framework, no build step, no tracking.

## What is in here

```
index.html                         Home
products/index.html                Products
products/certos-framework/         Certos Framework
products/certos-cloud/             Certos White Label Cloud
services/                          Services
support/                           Support (developer resource request)
about-us/                          About Us
imprint/                           Imprint
privacy-policy/                    Privacy policy
404.html                           Not-found page
assets/css/site.css                Design system (tokens, components, layout)
assets/css/fonts.css               Self-hosted @font-face declarations
assets/fonts/                      Archivo + IBM Plex Sans + IBM Plex Mono (woff2)
assets/js/site.js                  Theme switch, mobile menu, counters, support form
assets/img/                        Product photography, screens, portraits (webp)
CNAME                              Custom domain for GitHub Pages
```

URLs match the previous WordPress site one for one, so existing links and search
results keep working.

## Local preview

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Root-relative paths (`/assets/...`) mean the site
must be served from a web root — opening the `.html` files directly from disk will
not load the CSS.

## Deployment

Pushing to `main` triggers `.github/workflows/pages.yml`, which publishes the
repository root to GitHub Pages. In **Settings → Pages**, set *Source* to
**GitHub Actions** once; the custom domain comes from the `CNAME` file.

## Design notes

- **Type**: Archivo (display, variable width), IBM Plex Sans (body), IBM Plex Mono
  (labels and data). All self-hosted — no request ever leaves the visitor's browser
  for a font server, which keeps the site clean under GDPR.
- **Colour**: tokens in `:root`, redefined for `prefers-color-scheme: dark` and for
  an explicit `data-theme` choice. Dark "instrument panel" bands (`.panel`) keep
  their own fixed palette in both themes.
- **No cookies.** The only browser storage is the visitor's own theme preference in
  `localStorage`.
- The support form composes a `mailto:` message rather than posting to a third-party
  form service. To switch to a hosted form backend later, give the `<form>` an
  `action` and remove the submit handler in `assets/js/site.js`.

## Editing

Every page is plain HTML with the same header and footer markup. When changing
navigation or the footer, update all nine pages plus `404.html`.
