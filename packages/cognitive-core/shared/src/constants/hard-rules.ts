import { Decision } from '../types/decision.types.js';

export const HARD_RULES = [
  {
    id: 'no_manipulation',
    description: 'Interdit la manipulation intentionnelle.',
    check: (decision: Decision) => (decision.suggestedReply ?? '').toLowerCase().includes('manipuler')
  },
  {
    id: 'no_deception',
    description: 'Interdit la deception volontaire.',
    check: (decision: Decision) => (decision.suggestedReply ?? '').toLowerCase().includes('mensonge')
  },
  {
    id: 'no_harassment',
    description: 'Interdit le harcelement.',
    check: (decision: Decision) => (decision.suggestedReply ?? '').toLowerCase().includes('insulte')
  },
  {
    id: 'no_overreach',
    description: 'Interdit les actions hors mandat.',
    check: (decision: Decision) => false
  }
];

