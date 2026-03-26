# TESTING

## Philosophie
- Les tests Murmura doivent etre deterministes, lisibles et executables sur machine fraiche.
- Une regression de gouvernance, de decision ou de degradation pipeline est bloquante.
- On teste d'abord le comportement metier observable, puis les details d'implementation seulement si cela protege une branche critique.
- Les exclusions de couverture sont acceptees uniquement pour le boilerplate framework, les placeholders non branches et les fichiers purement declaratifs.

## Pyramide de tests
1. Unitaires: validation de schemas, heuristiques, scoring, autonomie, gouvernance, circuit breaker, cache et TTL.
2. Integration: chemins critiques du pipeline et isolation via Testcontainers pour PostgreSQL et Redis.
3. Evaluation LLM: golden dataset annote, rapport JSON exploitable, seuils explicites et artefacts CI.
4. Mutation et robustesse: modules critiques uniquement, avec seuil de kill a 75% minimum.

## Repartition par couche
- `packages/cognitive-core/*`: priorite aux tests unitaires et de comportement pur, sans framework.
- `packages/cognitive-core/api`: tests d'integration Fastify pour plugins, routes, auth et validation.
- `apps/api-gateway`: tests d'integration des controllers, orchestrateurs, modules NestJS et adaptations transport.
- `apps/web`: tests composants et etat lorsqu'une vraie UI remplace le scaffold actuel.
- Integrations externes: couverture par mocks deterministes en unitaire, puis verification ciblee en integration.

## Regles de mock
- Les providers LLM sont toujours mockes ou remplaces par des heuristiques deterministes en test.
- Le filesystem peut etre isole par workspace temporaire; ne jamais reutiliser un etat partage entre tests.
- Redis et PostgreSQL utilisent Testcontainers en integration. En local sans runtime conteneur, les tests d'integration se court-circuitent proprement; en CI ils doivent rester stricts.
- Les timeouts, retries et circuit breakers doivent etre testes avec des dependances injectees et observables.

## Couverture
- Chaque package expose un `vitest.config.ts` avec des seuils a 80% pour lines, branches, functions et statements.
- La commande racine `pnpm test:coverage` genere un rapport agrege pour la revue CI.
- Les fichiers de glue framework, DTO, modules Nest, placeholders documentes et artefacts de scripts peuvent etre exclus ou interpretes separement dans les revues de couverture; ils ne doivent pas masquer l'etat des modules critiques.

## Convention de nommage
- Les tests unitaires vivent au plus pres du module dans `src/__tests__/`.
- Le suffixe standard est `*.test.ts`.
- Les tests d'integration NestJS ou infra peuvent vivre sous `test/integration/` ou dans un dossier `__tests__` explicite si la portee reste locale au module.
- Le nom du fichier doit indiquer clairement la cible: `pipeline.orchestrator.test.ts`, `server.routes.test.ts`, `workspace.test.ts`.
- Un nom de test doit decrire un comportement observable, par exemple: `returns a degraded decision when the breaker is open`.

## Golden tests et evaluation LLM
- Les fixtures sous `packages/cognitive-core/shared/fixtures/` sont la source de verite minimale.
- `scripts/eval.ts` produit deux artefacts dans `reports/`: `llm-eval.json` et `llm-eval-summary.md`.
- Les seuils par defaut sont:
  - `LLM_EVAL_MIN_INTENTION_ACCURACY=0.8`
  - `LLM_EVAL_MAX_SCORE_ERROR=0.2`
  - `LLM_EVAL_MIN_STYLE_RATE=0.85`
- Pour ajouter un cas golden:
  1. Ajouter le fixture correspondant.
  2. Mettre a jour l'attendu dans les samples d'evaluation.
  3. Verifier le rapport via `pnpm -w exec tsx scripts/eval.ts`.

## Procedure recommandee pour les golden tests LLM
1. Partir d'un exemple reel anonymise ou d'un cas de regression connu.
2. Ajouter ou mettre a jour le fixture minimal dans `packages/cognitive-core/shared/fixtures/`.
3. Verrouiller l'attendu metier: intention, scores toleres, style ou alertes selon le module concerne.
4. Executer `pnpm -w exec tsx scripts/eval.ts` pour regenerer `reports/llm-eval.json` et `reports/llm-eval-summary.md`.
5. Lire le resume, verifier les seuils et documenter tout ecart acceptable avant merge.
6. En cas de changement volontaire du comportement, mettre a jour le fixture et la rationale dans la PR.

## Mutation et robustesse
- `stryker.conf.cjs` cible les modules critiques de calcul et impose `break: 75`.
- Les property tests `fast-check` restent le bon outil pour les schemas Zod, normalisations et parseurs.
- Les tests de degradation doivent verifier explicitement les cas suivants: LLM indisponible, cache invalide, breaker ouvert, runtime Docker absent en local, et gouvernance fail-closed.

## Commandes quotidiennes
- `pnpm test`: lance toute la workspace Vitest.
- `pnpm test:coverage`: lance toute la workspace avec rapport de couverture.
- `pnpm test:integration`: active les tests Testcontainers.
- `pnpm mutation`: lance Stryker sur les modules critiques.
- `pnpm -w exec tsx scripts/eval.ts`: genere le rapport d'evaluation LLM.

## Attendus CI
- `.github/workflows/ci.yml` execute la couverture et publie les artefacts.
- `.github/workflows/integration.yml` execute `pnpm test:integration` et publie les rapports.
- `.github/workflows/llm-eval.yml` execute le pipeline d'evaluation hebdomadaire et archive les rapports.
- Un nouveau test doit proteger une branche metier, une regression deja observee ou une regle explicite de l'architecture.
