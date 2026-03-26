# Gestion d'etat frontend

Le frontend `apps/web` est encore minimal, mais la ligne directrice est deja fixee: separer l'etat serveur de l'etat d'interface et traiter les evenements temps reel comme un flux ephemere.

## Regle de base

- TanStack Query pour les donnees serveur, cachees et revalidables.
- Zustand pour l'etat local d'interface, les preferences et les buffers ephemeres.
- WebSocket pour pousser des evenements; ces evenements mettent a jour Query ou Zustand selon leur nature.

## Quand utiliser TanStack Query

Utiliser TanStack Query pour:

- resultats HTTP recuperables de nouveau;
- listes et details derives des routes `v1/*`;
- donnees ayant un cycle `loading / success / error / refetch`;
- invalidation apres mutation.

Exemples Murmura:

- analyse demandee puis relue par `requestId` ou historique;
- relations, memoire, identite, regles de gouvernance;
- sessions ou messages internes si exposes par API.

## Quand utiliser Zustand

Utiliser Zustand pour:

- etat purement UI: panneau ouvert, onglet actif, filtres locaux, draft;
- etat de connexion WebSocket;
- file d'evenements temporaires non persistants;
- progression live avant consolidation dans le cache serveur.

Ne pas mettre dans Zustand ce qui devrait etre rechargeable depuis le backend.

## Gestion des evenements WebSocket

Les types partages vivent dans `packages/shared-types/src/websocket/events.ts`.

Strategie recommandee:

1. Le transport WebSocket pousse un evenement type.
2. Une couche cliente le decode.
3. Selon l'evenement:
   - mise a jour de Query si l'evenement modifie une ressource serveur durable;
   - mise a jour de Zustand si l'evenement est ephemere.

### Exemples

- `InternalAnalysisReady`: invalider ou peupler une query d'analyse.
- `InternalTypingStart` / `InternalTypingStop`: stocker dans Zustand uniquement.
- `TwinStreamChunk`: accumuler dans Zustand pendant le streaming, puis eventuellement consolider dans Query a la fin.

## Pattern recommande

- Un dossier `lib/api` pour les fetchers HTTP.
- Un dossier `lib/ws` pour la connexion et le dispatch d'evenements.
- Un dossier `stores/` pour les stores Zustand ephemeres.
- Un dossier `queries/` pour les hooks TanStack Query.

## Anti-patterns a eviter

- dupliquer la meme ressource durable dans Query et Zustand;
- stocker un long historique serveur uniquement dans un store local;
- laisser un composant parser directement les payloads WebSocket;
- melanger un etat de formulaire local avec des reponses d'API cachees.

## Regle de decision rapide

Si la question est "puis-je refetch cette donnee depuis le serveur ?", la reponse est presque toujours TanStack Query.

Si la question est "cet etat n'existe que pour piloter l'interface ici et maintenant ?", la reponse est probablement Zustand.
