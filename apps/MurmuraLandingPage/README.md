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

## Deploiement Vercel

Deployer le dossier `apps/MurmuraLandingPage` comme projet Vite.

- fichier de config: `vercel.json`
- dossier de sortie: `dist`
- rewrite SPA active vers `index.html`

Variables d'environnement a definir si necessaire:

- `VITE_WAITLIST_ENDPOINT`
- `VITE_WAITLIST_PROVIDER`
- `VITE_WAITLIST_ANALYTICS_ENDPOINT`

## Deploiement Netlify

Deployer le dossier `apps/MurmuraLandingPage` comme site statique.

- fichier de config: `netlify.toml`
- commande de build: `pnpm build`
- dossier publie: `dist`
- redirect SPA active vers `index.html`

Variables d'environnement a definir si necessaire:

- `VITE_WAITLIST_ENDPOINT`
- `VITE_WAITLIST_PROVIDER`
- `VITE_WAITLIST_ANALYTICS_ENDPOINT`

## Scripts

- `pnpm -C apps/MurmuraLandingPage dev`
- `pnpm -C apps/MurmuraLandingPage build`
- `pnpm -C apps/MurmuraLandingPage preview`
- `pnpm -C apps/MurmuraLandingPage typecheck`
