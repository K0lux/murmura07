import { normalizeContent } from '../utils/text.js';

export interface DemandResult {
  explicitDemand: string;
  implicitDemand?: string;
}

export class DemandsExtractor {
  async extract(content: string): Promise<DemandResult> {
    const normalized = normalizeContent(content);
    const lower = normalized.toLowerCase();

    if (!normalized) {
      return { explicitDemand: 'Aucune demande explicite' };
    }

    if (/[?]/.test(normalized)) {
      return { explicitDemand: 'Demande d\'information', implicitDemand: 'Clarifier le besoin' };
    }

    if (/(peux-tu|pouvez-vous|merci de|please|could you)/.test(lower)) {
      return { explicitDemand: 'Demande d\'action', implicitDemand: 'Assurer la réalisation' };
    }

    if (/(je suis inquiet|je suis stress[ée]|je m'inqui[èe]te)/.test(lower)) {
      return { explicitDemand: 'Exprime une inqui\'etude', implicitDemand: 'Rassurer' };
    }

    return { explicitDemand: 'Demande implicite à clarifier' };
  }
}

