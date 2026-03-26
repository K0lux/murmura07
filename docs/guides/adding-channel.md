# Ajouter un nouveau canal

Ce guide explique comment brancher un nouveau canal de messagerie dans `apps/api-gateway` sans coupler le transport au Cognitive Core.

## Objectif

Un canal doit pouvoir:

- recevoir un webhook ou un polling d'entree;
- normaliser le message vers le contrat `RawMessage` ou un equivalent applicatif;
- deleguer l'analyse ou l'envoi au bon service;
- rester testable sans dependance reseau reelle.

## Points d'extension existants

- `apps/api-gateway/src/modules/channels/channels.module.ts`
- `apps/api-gateway/src/modules/channels/channels.service.ts`
- exemples existants:
  - Telegram: `telegram.service.ts`, `telegram.webhook.controller.ts`
  - WhatsApp: `whatsapp.service.ts`, `whatsapp.webhook.controller.ts`
  - Slack: `slack.service.ts`, `slack.webhook.controller.ts`
  - Email: `email.service.ts`, `email.poller.ts`

## Etapes

### 1. Creer le service du canal

Ajouter un dossier `apps/api-gateway/src/modules/channels/<canal>/` avec au minimum:

- `<canal>.service.ts` pour `sendMessage()` et `handleWebhook()` si applicable;
- un controller webhook si le fournisseur pousse des evenements;
- un poller si le fournisseur ne pousse pas nativement.

Le service doit exposer une interface similaire aux canaux existants:

- `sendMessage(to, content)` pour la livraison sortante;
- `handleWebhook(body)` pour les entrees webhook.

### 2. Enregistrer le canal dans le module

Mettre a jour `ChannelsModule` pour:

- declarer le nouveau service dans `providers`;
- exporter ce service si d'autres modules en ont besoin;
- ajouter le controller webhook dans `controllers` si necessaire.

### 3. Router le canal dans `ChannelsService`

Ajouter un `case` dans `sendMessage()` pour votre identifiant de canal.

Le champ `canal` doit rester stable car il circule ensuite dans les contrats partages et les analyses.

### 4. Normaliser vers `RawMessage`

Les payloads externes ne doivent pas traverser l'application tels quels.

Normaliser au minimum:

- `userId`
- `canal`
- `interlocuteurId`
- `content`
- `metadata.timestamp`
- `metadata.threadId` si disponible
- `metadata.urgencyFlag`
- `metadata.attachments`

Bon reflexe: creer une petite fonction `toRawMessage()` dans le service du canal.

### 5. Configurer le webhook

Selon le fournisseur:

- `@Controller('webhooks/<canal>')`
- `@Post()` pour les callbacks entrants
- `@Get()` si une verification initiale est requise, comme WhatsApp

Le controller doit rester mince et deleguer la logique au service.

### 6. Gerer les erreurs

- Ne jamais propager le payload brut du fournisseur jusqu'au coeur.
- Journaliser suffisamment pour diagnostiquer sans exposer de secret.
- En cas d'echec de livraison, retourner un statut explicite et non ambigu.
- Pour un canal non supporte, conserver le comportement de repli documente dans `ChannelsService`.

## Tests requis

### Unitaires

- mapping du payload externe vers la structure normalisee;
- comportement de `sendMessage()`;
- verification webhook si presente;
- cas invalides ou partiels.

### Integration

- controller webhook branche au bon service;
- ajout du nouveau canal dans `ChannelsModule`;
- compatibilite avec le flux cognitif ou messaging si le canal alimente l'analyse.

## Checklist de revue

- Le nom du canal est coherent partout.
- Le controller ne contient pas de logique metier.
- Les payloads sont normalises avant usage.
- Les erreurs externes sont degradees proprement.
- Des tests couvrent entree, sortie et cas invalides.
