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
    title: 'Les conversations importantes sont eparpillees.',
    intro:
      'SMS, email, telephone, reseaux sociaux et messageries diverses fragmentent les echanges. La conversation privee perd son fil et son sens.',
    points: [
      'Chaque echange repart souvent sans vue d ensemble.',
      'Les details utiles restent dans la tete, dans des captures ou dans des applications sans lien entre elles.',
      'La continuite de la relation depend trop de la memoire humaine.'
    ]
  },
  {
    id: 'memoire',
    label: 'Memoire',
    title: "La relation n'a pas de memoire fiable.",
    intro:
      "Les promesses, les tensions, les antecedents et les sensibilites existent, mais ils ne sont presque jamais conserves dans un cadre clair.",
    points: [
      'Les malentendus reviennent parce que le passe relationnel est flou.',
      'Les sujets sensibles reapparaissent sans contexte lisible.',
      'Les engagements et nuances tombent facilement entre les messages.'
    ]
  },
  {
    id: 'ia',
    label: 'IA hors contexte',
    title: 'Une IA sans contexte prive reste superficielle.',
    intro:
      'Une IA peut aider a ecrire. Elle aide beaucoup moins a proteger une relation si elle ne comprend ni l historique, ni la sensibilite, ni la trajectoire de la conversation.',
    points: [
      'Elle raisonne souvent sur le dernier message au lieu de la relation complete.',
      'Elle ignore la charge emotionnelle accumulee dans le temps.',
      'Elle peut proposer une bonne phrase au mauvais moment.'
    ]
  },
  {
    id: 'privee',
    label: 'Vie privee',
    title: 'La conversation privee manque de protection active.',
    intro:
      "Aujourd'hui, les messageries facilitent l'envoi. Elles aident beaucoup moins a preserver l'intimite, la nuance et la qualite d'une relation.",
    points: [
      'Les conversations personnelles et sensibles sont traitees comme de simples flux.',
      'Il manque une memoire privee qui reste au service de la personne.',
      "L'utilisateur n'a pas de couche intelligente pour ralentir, eclairer ou proteger un echange delicat."
    ]
  }
];

export const workflowData: WorkflowItem[] = [
  {
    id: 'initier',
    label: '01 Initier',
    title: 'Ouvrir une conversation privee dans Murmura',
    body:
      "La conversation commence dans l'espace Murmura. Les numeros, emails ou autres identifiants servent a retrouver la bonne personne et a enrichir le contexte, sans imposer immediatement un canal externe.",
    note: 'La conversation privee reste le centre du produit.'
  },
  {
    id: 'contextualiser',
    label: '02 Contextualiser',
    title: 'Retrouver la memoire de la relation',
    body:
      'Murmura relie historique, promesses, sujets sensibles, habitudes d echange et signaux faibles. Le systeme ne traite pas juste un texte: il remet la relation dans son vrai contexte.',
    note: 'Le contexte passe avant la reaction.'
  },
  {
    id: 'analyser',
    label: '03 Analyser',
    title: 'Eclairer la situation sans prendre la place de la personne',
    body:
      "Le moteur d'analyse aide a lire le ton, la tension, les risques, les opportunites et la bonne posture. L'IA soutient la conversation privee au lieu de la reduire a de l'autocompletion.",
    note: "L'IA reste au service de la relation."
  },
  {
    id: 'agir',
    label: '04 Agir',
    title: 'Passer a un canal externe seulement si c est utile',
    body:
      'Si un email, un appel ou un autre canal devient necessaire, le jumeau numerique peut aider a preparer puis executer cette action. Cette couche reste separee de la conversation privee pour conserver le controle.',
    note: "Le canal externe devient une option, pas le coeur du produit."
  }
];

export const impactMetrics = [
  {
    value: 1,
    caption: 'conversation privee de reference',
    detail: 'un centre clair pour ecrire, relire et comprendre'
  },
  {
    value: 3,
    caption: "couches d'aide visibles",
    detail: 'memoire, analyse, action'
  },
  {
    value: 2,
    caption: 'grands usages naturels',
    detail: 'personnel et professionnel'
  }
] as const;
