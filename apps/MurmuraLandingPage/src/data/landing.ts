export type ProblemItem = {
  id: string;
  label: string;
  title: string;
  intro: string;
  points: string[];
};

export type WorkflowItem = {
  id: string;
  label: string;
  title: string;
  body: string;
  note: string;
};

export const problemData: ProblemItem[] = [
  {
    id: 'dispersion',
    label: 'Dispersion',
    title: 'Les conversations critiques sont dispersees.',
    intro:
      'Email, telephone, notes, SMS, messageries privees et chat interne vivent dans des espaces differents. Le contexte se casse en fragments.',
    points: [
      'Chaque echange repart sans vision consolidee.',
      'Les informations utiles restent dans la tete des personnes ou dans des outils sans lien entre eux.',
      "La qualite de decision depend davantage de la memoire individuelle que d'un systeme fiable."
    ]
  },
  {
    id: 'memoire',
    label: 'Memoire',
    title: "La relation n'a pas de memoire exploitable.",
    intro:
      "Les promesses, tensions, antecedents, sensibilites et habitudes d'interaction existent, mais ils ne sont pas structures.",
    points: [
      'Les signaux faibles sont detectes trop tard.',
      'Les sujets sensibles reapparaissent sans historique lisible.',
      'Les engagements tombent facilement entre les messages et les outils.'
    ]
  },
  {
    id: 'ia',
    label: 'IA superficielle',
    title: 'Une IA sans memoire relationnelle reste superficielle.',
    intro:
      'Un copilote peut reformuler un message. Il ne sait pas piloter une relation durable sans contexte profond.',
    points: [
      'Il raisonne sur le dernier echange au lieu de la trajectoire complete.',
      'Il ignore la dynamique relationnelle accumulee dans le temps.',
      'Il peut produire une bonne phrase mais une mauvaise decision.'
    ]
  },
  {
    id: 'gouvernance',
    label: 'Gouvernance',
    title: "L'action externe arrive trop vite et trop mal.",
    intro:
      'Dans beaucoup de systemes, envoyer un mail, relancer ou appeler est plus simple que clarifier la situation.',
    points: [
      "L'execution peut preceder l'analyse.",
      'Le risque de maladresse augmente dans les relations sensibles.',
      'Il manque souvent une couche claire de validation, simulation et arbitrage.'
    ]
  }
];

export const workflowData: WorkflowItem[] = [
  {
    id: 'initier',
    label: '01 Initier',
    title: 'Initier une conversation interne Murmura',
    body:
      "La discussion commence dans l'espace interne. Les numeros, emails ou identifiants externes servent a qualifier l'interlocuteur et a nourrir le contexte, pas a imposer immediatement un canal.",
    note: 'La messagerie interne reste le point de reference.'
  },
  {
    id: 'contextualiser',
    label: '02 Contextualiser',
    title: 'Reconstruire la memoire et la relation',
    body:
      'Murmura relie historique, memoire, signaux relationnels, promesses et sujets sensibles. Le systeme ne traite pas seulement un texte: il reconstruit une situation.',
    note: 'Le sens est remis avant la reaction.'
  },
  {
    id: 'analyser',
    label: '03 Analyser',
    title: 'Produire une lecture utile de la situation',
    body:
      "Le moteur d'analyse met en evidence tension, ton, risques, opportunites, posture conseillee et options de reponse. L'utilisateur gagne une base de decision plus defendable.",
    note: "L'IA travaille avec profondeur relationnelle."
  },
  {
    id: 'agir',
    label: '04 Agir',
    title: 'Declencher une action seulement si elle est justifiee',
    body:
      'Le jumeau numerique peut simuler, preparer puis executer une action externe via les outils adaptes. Cette couche reste separee de la conversation elle-meme pour conserver gouvernance et tracabilite.',
    note: "L'execution externe devient une consequence, pas un reflexe."
  }
];

export const impactMetrics = [
  {
    value: 4,
    caption: 'couches structurelles reliees',
    detail: 'messagerie, memoire, intelligence, execution'
  },
  {
    value: 3,
    caption: "niveaux d'intelligence visibles",
    detail: 'comprendre, relier, anticiper'
  },
  {
    value: 1,
    caption: 'conversation de reference',
    detail: "un centre unique pour decider avant d'agir"
  }
] as const;
