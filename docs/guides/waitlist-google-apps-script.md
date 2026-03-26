# Waitlist Google Apps Script

Ce script permet de brancher le formulaire waitlist de `MurmuraLandingPage` a un Google Sheet.

## 1. Creer le Google Sheet

1. Creez un Google Sheet vide.
2. Ouvrez `Extensions > Apps Script`.
3. Remplacez le contenu par [waitlist-google-apps-script.gs](/c:/Users/kassa/OneDrive/Bureau/murmura/Murmura07/docs/guides/waitlist-google-apps-script.gs).

## 2. Deployer le script

1. Cliquez sur `Deploy > New deployment`.
2. Choisissez `Web app`.
3. `Execute as`: `Me`.
4. `Who has access`: `Anyone`.
5. Validez et copiez l'URL `/exec`.

## 3. Configurer la landing

Dans `apps/MurmuraLandingPage/.env`:

```env
VITE_WAITLIST_PROVIDER=google-apps-script
VITE_WAITLIST_ENDPOINT=https://script.google.com/macros/s/.../exec
```

Optionnel pour le tracking analytique:

```env
VITE_WAITLIST_ANALYTICS_ENDPOINT=https://your-endpoint.example.com/events
```

## 4. Colonnes ecrites dans le sheet

- `created_at`
- `email`
- `organization`
- `source`
- `submitted_at`
- `status`
- `message`

## Notes

- Le formulaire landing envoie `email`, `organization`, `source`, `submittedAt`.
- Le tracking analytique est separe du stockage waitlist.
- Le script cree automatiquement l'onglet `Waitlist` s'il n'existe pas.
