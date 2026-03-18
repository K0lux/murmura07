# ADR-001 — File-first Memory

## Contexte
Les interactions et décisions doivent rester auditables, portables et lisibles hors application.

## Décision
La mémoire long terme est stockée en Markdown (MEMORY.md et logs quotidiens) et indexée de façon hybride (BM25 + vecteurs).

## Conséquences
- Le workspace devient la source de vérité.
- Les index sont reconstruisibles et ne sont jamais la source de vérité.
- Les modifications manuelles sont possibles et doivent être respectées.
