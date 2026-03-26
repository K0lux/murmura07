# ADR-003: WebSocket pour les mises a jour IA

## Statut

Accepte

## Contexte

Certaines operations Murmura ne sont pas instantanees:

- analyse cognitive complete;
- generation ou streaming d'un digital twin;
- notifications de traitement asynchrone;
- diffusion d'evenements applicatifs vers l'interface.

Une strategie purement synchrone en HTTP bloquerait longtemps la reponse. Le long-polling resterait possible, mais au prix d'une charge inutile et d'une latence moins reguliere.

## Decision

Les mises a jour IA cote frontend sont poussees via WebSocket ou mecanisme equivalent de push applicatif, plutot que par polling repetitif.

Dans le depot actuel:

- `apps/api-gateway/src/modules/websocket/websocket.gateway.ts` offre une abstraction de diffusion par utilisateur et evenement;
- `packages/shared-types/src/websocket/events.ts` centralise les types d'evenements;
- certains parcours comme `DigitalTwinStreamService` simulent aussi une logique de streaming orientee chunk.

## Pourquoi WebSocket

- Push natif quand une analyse ou un chunk est pret.
- Meilleure efficacite que le long-polling pour les traitements de plusieurs secondes.
- Canal unique pour des evenements heterogenes: progression, outil utilise, resultat final, presence, typing.
- Meilleur confort frontend pour les experiences temps reel.

## Consequences

- Le backend doit identifier l'utilisateur ou la session cible pour router les evenements.
- Les payloads d'evenement doivent etre typages et versionnables.
- Le frontend doit distinguer l'etat serveur durable des evenements ephemeres.

## Alternatives ecartees

### Long-polling

Rejete car inefficace pour des analyses frequentes ou de duree variable.

### Polling periodique classique

Rejete car il ajoute de la latence, charge inutilement l'API et degrade l'experience utilisateur.

### SSE uniquement

Possible pour certains flux unidirectionnels, mais moins souple si l'on souhaite converger vers une couche d'evenements bidirectionnelle.

## Implications de mise en oeuvre

- Les evenements doivent etre concis, idempotents quand possible et documentes.
- Le frontend gere la reconnexion et l'eventual duplication.
- Les traitements longs doivent emettre au minimum: debut, progression utile, fin, erreur.
