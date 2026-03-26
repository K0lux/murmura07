# ADR-002: Separation OpenClaw / Cognitive Core

## Statut

Accepte

## Contexte

Murmura produit des analyses, recommandations, alertes et decisions. Certaines suites logiques peuvent conduire a une action sur un systeme externe: envoi de message, execution d'une commande, interaction outil ou automatisation.

Si le moteur de raisonnement execute lui-meme ces actions, plusieurs risques apparaissent:

- confusion entre conseil et action;
- surface de securite trop large dans le coeur IA;
- difficulte a auditer ce qui a ete suggere versus ce qui a ete reellement execute;
- impossibilite de desactiver l'execution tout en gardant l'analyse.

## Decision

Le Cognitive Core raisonne. OpenClaw agit.

La responsabilite du coeur est de:

- analyser un message;
- reconstruire le contexte;
- produire une recommandation ou une decision;
- indiquer si l'autonomie est permise ou si une validation humaine est requise.

La responsabilite d'OpenClaw ou des adaptateurs d'execution est de:

- appeler des services externes;
- manipuler des outils;
- effectuer une action irreversible ou observable par un tiers;
- journaliser l'execution effective.

## Justification

- Separation nette des responsabilites.
- Meilleure securite: le moteur IA n'obtient pas par defaut le droit d'agir.
- Auditabilite: une decision peut etre stockee sans execution immediate.
- Degradation propre: en cas de panne d'OpenClaw, le raisonnement reste disponible.

## Consequences

- Une suggestion IA n'est pas une action.
- Les APIs doivent transmettre explicitement les intentions d'action a une couche d'execution.
- Les tests du Cognitive Core verifient des sorties de decision, pas des effets de bord externes.
- Les tests OpenClaw ou channels verifient l'execution, les retries et les integrations.

## Garde-fous

- La gouvernance peut interdire ou limiter l'autonomie.
- Une decision degradee doit desactiver l'autonomie et forcer la validation.
- Les canaux `api` et `internal` peuvent volontairement court-circuiter la livraison externe.

## Alternatives ecartees

### Donner un acces outil direct au moteur de raisonnement

Rejete car cela melange intention, deliberation et execution dans la meme couche.

### Fusionner OpenClaw dans l'API Gateway

Rejete pour conserver une frontiere claire entre orchestration applicative et execution externe.
