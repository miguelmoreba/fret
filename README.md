# Fretboard trainer

A small bass fretboard practice app with two modes:

- Find a prompted note on the fretboard.
- Name the note at a highlighted position.

The fretboard is shown from the player's perspective, with the low E string at
the bottom.

## Run locally

```bash
npm install
npm run dev
```

The production build includes an installable web app manifest and an offline
service worker. Regenerate the platform icons after editing `public/logo.svg`:

```bash
npm run generate-pwa-assets
```
