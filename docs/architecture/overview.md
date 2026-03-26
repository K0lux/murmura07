# Vue d'ensemble de l'architecture

Murmura est organise en couches separees afin de garder la logique IA independante des details du framework, du transport reseau et des integrations externes.

## Vue systeme

```text
+-------------------+        +----------------------+        +------------------------+
| Frontend web      | <----> | API Gateway NestJS   | <----> | MurmuraClaw service    |
| apps/web          | WS/HTTP| apps/api-gateway     |  HTTP  | apps/murmuraclaw       |
+---------+---------+        +----------+-----------+        +-----------+------------+
          |                             |                                |
          |                             | appelle                        |
          |                             v                                |
          |                  +------------------------+                  |
          |                  | Cognitive adapters     |                  |
          |                  | modules/cognitive/*    |                  |
          |                  +-----------+------------+                  |
          |                              |                               |
          |                              v                               |
          |                  +------------------------+                  |
          |                  | Cognitive Core API     |                  |
          |                  | packages/.../api       |                  |
          |                  +-----------+------------+                  |
          |                              | orchestre                     |
          |                              v                               |
          |   +-------------+   +---------------+   +----------------+   |
          |   | Ingestion   |-> | Context/Memory|-> | Reasoning      |   |
          |   +-------------+   +---------------+   +----------------+   |
          |                              |                  |             |
          |                              v                  v             |
          |                      +---------------+   +----------------+   |
          |                      | Relationship  |   | Governance     |   |
          |                      +---------------+   +----------------+   |
          |                                      \   /                    |
          |                                       v v                     |
          |                                 +-------------+               |
          +-------------------------------- | Decision    | --------------+
                                            +-------------+
```

## Role de chaque couche

### 1. Frontend

- `apps/web` consomme les APIs HTTP et les flux temps reel.
- L'etat d'interface reste local au frontend; les decisions IA restent cote backend.

### 2. API Gateway NestJS

- `apps/api-gateway` expose les endpoints applicatifs, les webhooks de canaux et les flux internes.
- Cette couche gere l'authentification, la validation, les DTO et l'orchestration des services applicatifs.
- Elle sert de facade stable pour le frontend et pour les integrations externes.

### 3. Cognitive adapters

- Les modules `apps/api-gateway/src/modules/cognitive/*` traduisent les requetes NestJS vers les contrats du Cognitive Core.
- Ils construisent un `RawMessage`, propagent le `requestId`, puis convertissent la reponse du coeur en payload HTTP exploitable.

### 4. Cognitive Core

- Les packages sous `packages/cognitive-core/*` concentrent la logique metier IA.
- `shared` porte les schemas, types, constantes et fixtures.
- `ingestion` transforme un message brut en analyse exploitable.
- `memory` et `context-engine` reconstruisent le contexte et interrogent le workspace file-first.
- `reasoning-engine`, `relationship-graph`, `governance`, `decision-engine` produisent recommandations, garde-fous et decisions.
- `api` expose une surface Fastify independante qui permet d'utiliser le coeur sans NestJS.

### 5. OpenClaw

- `apps/murmuraclaw` represente la couche d'execution externe.
- Son role est d'agir sur le monde exterieur lorsque c'est necessaire, sans melanger cette responsabilite avec le raisonnement.

## Flux principal

1. Un message entre via HTTP, webhook ou messaging interne.
2. L'API Gateway normalise ce message vers le contrat `RawMessage` du Cognitive Core.
3. `ingestion` produit une `MessageAnalysis`.
4. Le pipeline reconstruit le contexte, consulte la memoire et calcule alertes, recommandations et decision.
5. La reponse est retournee en HTTP et, pour les parcours longs, diffusee via WebSocket ou streaming applicatif.
6. Si une action externe est requise, elle passe par OpenClaw ou par les services de canal, jamais directement par le moteur de raisonnement.

## Principes d'isolation et de dependances

### Dependances autorisees

- `packages/cognitive-core/shared` est la base commune.
- Les packages metier du Cognitive Core dependent de `shared`, pas de NestJS.
- `apps/api-gateway` depend des packages du Cognitive Core, jamais l'inverse.
- `apps/murmuraclaw` reste separable et remplacable.

### Dependances interdites

- Aucune reference a `@nestjs/*` dans `packages/cognitive-core/*`.
- Pas de dependance circulaire entre packages du coeur.
- Pas d'appel direct du frontend vers la memoire fichier ou les moteurs IA internes.

### Pourquoi cette separation

- Testabilite: les moteurs IA peuvent etre testes en unitaires sans bootstraper NestJS.
- Portabilite: le coeur peut etre expose par Fastify, CLI, job asynchrone ou autre backend.
- Robustesse: les pannes de transport, d'integration ou d'execution peuvent etre degradees sans corrompre le raisonnement.
- Evolutivite: chaque couche change a son rythme, avec des contrats explicites entre elles.
