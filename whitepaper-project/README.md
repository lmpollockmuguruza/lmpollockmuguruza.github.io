# How AI is Transforming the Evaluation of Public Sector Programmes

An interactive white paper by Angelo Leone & Lucas Pollock (PUBLIC, February 2026).

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Build for production

```bash
npm run build
```

Static output goes to `dist/` — deploy to GitHub Pages, Vercel, Netlify, or any static host.

## Deploy to GitHub Pages

1. Install the plugin: `npm install -D vite-plugin-static-copy` (optional) or simply push `dist/`.
2. Or use the Vercel / Netlify GitHub integration for zero-config deploys.

## Structure

```
├── index.html          # Entry HTML
├── vite.config.js      # Vite + React config
├── src/
│   ├── main.jsx        # React mount
│   └── WhitePaper.jsx  # Entire white paper component
└── package.json
```

The white paper is a single self-contained React component with no external dependencies beyond React itself. Poppins is loaded via Google Fonts CDN.
