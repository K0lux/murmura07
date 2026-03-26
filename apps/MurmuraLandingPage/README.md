# MurmuraLandingPage

Landing page React/Vite pour presenter Murmura de maniere professionnelle.

## Intent

- reprendre la palette et le langage visuel de `murmura-logo.html`
- conserver un rendu premium mais sobre
- expliquer clairement ce que Murmura fait et le probleme traite
- brancher la waitlist sur un endpoint configurable

## Waitlist

Configurez un fichier `.env` local avec:

- `VITE_WAITLIST_ENDPOINT=https://...`
- `VITE_WAITLIST_PROVIDER=generic`
- `VITE_WAITLIST_ANALYTICS_ENDPOINT=https://...` optionnel

Pour Google Apps Script:

- `VITE_WAITLIST_PROVIDER=google-apps-script`
- `VITE_WAITLIST_ENDPOINT=https://script.google.com/macros/s/.../exec`

## Pages de soumission

La landing utilise maintenant de vraies pages SPA:

- `/success`
- `/error`

Le formulaire navigue automatiquement vers ces pages apres soumission.

## Docker

La stack Docker expose maintenant la landing sur:

- `http://localhost:4174`

## Scripts

- `pnpm -C apps/MurmuraLandingPage dev`
- `pnpm -C apps/MurmuraLandingPage build`
- `pnpm -C apps/MurmuraLandingPage preview`
- `pnpm -C apps/MurmuraLandingPage typecheck`
