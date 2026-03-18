# ARCHITECTURE

Murmura est organisé en packages indépendants sous `packages/cognitive-core/*`.

## Flux principal
Ingestion ? Memory/Context ? Reasoning ? Simulation ? Decision ? Governance ? API.

## Règles de dépendances
- `shared` est la base commune.
- Les packages ne dépendent pas circulairement.

## Principes
- Workspace file-first.
- Gouvernance fail-closed.
- Résilience par dégradation gracieuse.
