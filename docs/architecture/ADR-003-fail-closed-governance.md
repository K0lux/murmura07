# ADR-003 — Fail-closed Governance

## Contexte
La gouvernance est la dernière barrière avant la sortie de messages sensibles.

## Décision
En cas d'erreur interne, la couche de gouvernance bloque la décision (fail-closed).

## Conséquences
- Sécurité renforcée au détriment d'une disponibilité maximale.
- Les erreurs de gouvernance sont loggées pour investigation.
