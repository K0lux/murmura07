# ADR-001: Independance du Cognitive Core

## Statut

Accepte

## Contexte

Murmura expose aujourd'hui une API NestJS dans `apps/api-gateway`, mais la logique de raisonnement, de memoire, de gouvernance et de decision vit dans `packages/cognitive-core/*`.

Le risque principal serait de laisser les details du framework applicatif contaminer le coeur metier:

- dependance aux decorators NestJS dans les moteurs IA;
- cycle de vie HTTP melange a la logique de raisonnement;
- tests unitaires devenant des tests de framework;
- impossibilite de reexposer facilement le coeur par Fastify, worker ou CLI.

## Decision

Le Cognitive Core reste independant de NestJS, du frontend et des details d'infrastructure applicative.

Concretement:

- les packages `packages/cognitive-core/*` n'importent pas `@nestjs/*`;
- les contrats partages passent par `@murmura/cognitive-core-shared`;
- l'integration NestJS se fait dans des adaptateurs, principalement sous `apps/api-gateway/src/modules/cognitive/*`;
- le package `packages/cognitive-core/api` fournit une surface Fastify alternative pour exposer le coeur hors de NestJS.

## Consequences positives

- Testabilite: un moteur comme `ingestion`, `memory` ou `decision-engine` se teste avec Vitest sans serveur Nest.
- Portabilite: on peut remplacer `apps/api-gateway` par un autre backend sans reecrire la logique IA.
- Reutilisation: le meme coeur peut alimenter une API publique, un worker asynchrone ou des scripts d'evaluation.
- Lisibilite: la logique metier est regroupee par domaine, pas par framework.

## Compromis acceptes

- Il faut maintenir des couches d'adaptation entre DTO NestJS et schemas du Cognitive Core.
- Certaines validations peuvent exister a deux niveaux: transport et coeur metier.
- Les evolutions d'API demandent un peu plus de discipline de contrat.

## Alternatives ecartees

### Tout mettre dans `apps/api-gateway`

Rejete car cela couple la logique IA au cycle de vie NestJS et rend le remplacement du backend couteux.

### Exposer uniquement des services HTTP internes

Rejete car cela force des appels reseau meme pour des interactions intra-processus simples et complique les tests.

## Impact sur les developpements futurs

- Toute nouvelle logique de raisonnement doit d'abord viser `packages/cognitive-core/*`.
- Une nouvelle route NestJS doit rester un adaptateur mince.
- Si un module a besoin d'un framework, il appartient probablement a `apps/*` et non au coeur.
