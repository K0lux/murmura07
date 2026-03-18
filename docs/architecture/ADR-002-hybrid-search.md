# ADR-002 — Hybrid Search (BM25 + Vectors)

## Contexte
Les recherches doivent combiner précision lexicale et pertinence sémantique.

## Décision
Utiliser un moteur hybride : BM25 pour les termes exacts et un index vectoriel pour la similarité sémantique.

## Conséquences
- Les résultats sont fusionnés et pondérés (70% vecteurs / 30% BM25 par défaut).
- Les index sont maintenus séparément et fusionnés à la requête.
