# Integration du Cognitive Core dans NestJS

Ce guide decrit comment brancher les packages `packages/cognitive-core/*` dans `apps/api-gateway` sans casser l'isolation du coeur.

## Principe

NestJS ne doit pas contenir la logique IA. Il doit:

- recevoir la requete;
- la valider;
- la convertir vers les types du Cognitive Core;
- appeler un service applicatif;
- retourner une reponse claire, y compris en mode degrade.

## Packages utilises aujourd'hui

- `@murmura/cognitive-core-shared`
- `@murmura/cognitive-core-ingestion`
- `@murmura/cognitive-core-memory`
- `@murmura/cognitive-core-context-engine`
- les packages de decision, gouvernance, relation et raisonnement via les orchestrateurs associes

## Point d'integration principal

Le point d'entree actuel est `apps/api-gateway/src/modules/cognitive/cognitive.service.ts`.

Ce service:

- instancie les moteurs du coeur;
- garantit l'initialisation du workspace utilisateur;
- orchestre l'analyse et la decision;
- renvoie une reponse conforme aux schemas partages.

## Etapes d'integration

### 1. Importer les packages du coeur

Les modules NestJS consomment les packages publies dans le workspace PNPM. L'import doit toujours se faire via le nom de package, pas via un chemin relatif profond.

### 2. Normaliser les entrees

Exemple avec l'analyse:

- le controller NestJS valide le DTO;
- il construit un `RawMessage`;
- il laisse `CognitiveService` appeler `ingestion.process()`.

### 3. Configurer le workspace path

Les modules de memoire utilisent un workspace file-first par utilisateur via `WorkspaceManager`.

Regles pratiques:

- chaque utilisateur doit avoir un workspace resolu de maniere deterministe;
- l'acces fichier doit rester borne au workspace de l'utilisateur;
- tout chemin relatif doit etre resolu puis verifie, comme dans `getMemoryFile()`.

### 4. Propager le `requestId`

Le `requestId` doit etre cree ou relaye le plus tot possible, puis traverse l'orchestration pour faciliter debug, traces et correlation.

### 5. Gerer les erreurs et la degradation

Le pipeline du coeur degrade explicitement certaines etapes.

Implications cote NestJS:

- ne pas masquer un mode degrade derriere un `200` vide;
- exposer les champs de reponse qui signalent l'absence d'autonomie ou la baisse de confiance;
- journaliser la raison technique en backend sans l'exposer telle quelle au frontend si elle est sensible.

## Resultats degrades

Un resultat degrade reste une reponse valide, mais plus prudente:

- `autonomyAllowed` doit pouvoir passer a `false`;
- `requiresValidation` peut etre force dans la decision;
- la confiance baisse;
- la suggestion de reponse peut etre absente.

Le frontend doit donc traiter le degrade comme un etat fonctionnel, pas comme une erreur fatale par defaut.

## Bonnes pratiques

- Garder les controllers minces.
- Centraliser les conversions DTO -> contrats cognitifs.
- Appeler les schemas partages pour valider les sorties critiques.
- Eviter de stocker un etat durable dans les controllers ou gateways.

## A eviter

- injecter NestJS dans `packages/cognitive-core/*`;
- reimplementer les schemas du coeur dans les DTO NestJS;
- laisser un module web ou websocket appeler directement plusieurs moteurs sans passer par un service d'orchestration.
