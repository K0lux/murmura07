# TESTING

## Philosophie
- Tests rapides, déterministes et reproductibles.
- Les validations de schéma sont testées en priorité.
- Toute régression sur la gouvernance est bloquante.

## Pyramide de tests
1. Unitaires (80% minimum)
2. Intégration (flows critiques)
3. E2E (parcours UI/API principaux)

## Règles de mock
- Les providers LLM sont toujours mockés.
- Le filesystem et Redis peuvent être mockés ou isolés via Testcontainers.

## Golden tests
- Les fixtures sont la source de vérité des résultats attendus.
- Ajouter un cas dans `fixtures/` et mettre à jour les métriques dans l'évaluation.

## Scripts
- `pnpm test`
- `pnpm test:e2e`
- `pnpm -w exec tsx scripts/eval.ts`
- `pnpm -w exec stryker run`
