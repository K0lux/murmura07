import type { CognitiveService } from '../../cognitive/cognitive.service.js';

export const SUPPORTED_TONES = [
  'formel',
  'empathique',
  'direct',
  'diplomatique',
  'professionnel',
  'chaleureux'
] as const;

export type SupportedTone = (typeof SUPPORTED_TONES)[number];

export function normalizeSpaces(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

export function normalizeCommand(command: string) {
  return normalizeSpaces(command)
    .replace(/^\//, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function truncateWords(text: string, maxWords: number) {
  const words = normalizeSpaces(text).split(' ').filter(Boolean);
  if (words.length <= maxWords) {
    return words.join(' ');
  }
  return `${words.slice(0, maxWords).join(' ')}...`;
}

export function splitSentences(input: string) {
  return input
    .split(/(?<=[.!?])\s+|\n+/)
    .map((item) => normalizeSpaces(item))
    .filter(Boolean);
}

export function detectLanguage(text: string): 'fr' | 'en' | 'unknown' {
  const lowered = ` ${text.toLowerCase()} `;
  const frenchSignals = [' le ', ' la ', ' les ', ' de ', ' et ', ' je ', ' vous ', ' nous '];
  const englishSignals = [' the ', ' and ', ' is ', ' are ', ' you ', ' we ', ' to '];
  const frenchScore = frenchSignals.reduce(
    (score, token) => score + Number(lowered.includes(token)),
    0
  );
  const englishScore = englishSignals.reduce(
    (score, token) => score + Number(lowered.includes(token)),
    0
  );

  if (frenchScore === englishScore) {
    return 'unknown';
  }
  return frenchScore > englishScore ? 'fr' : 'en';
}

export function toSupportedTone(candidate?: string): SupportedTone {
  const normalized = normalizeCommand(candidate ?? '');
  const byAlias: Record<string, SupportedTone> = {
    formal: 'formel',
    formel: 'formel',
    empathetic: 'empathique',
    empathique: 'empathique',
    direct: 'direct',
    diplomatic: 'diplomatique',
    diplomatique: 'diplomatique',
    professional: 'professionnel',
    professionnel: 'professionnel',
    warm: 'chaleureux',
    chaleureux: 'chaleureux'
  };
  return byAlias[normalized] ?? 'professionnel';
}

export async function loadSoulProfile(
  cognitiveService: CognitiveService,
  userId: string
): Promise<string | null> {
  try {
    const file = await cognitiveService.getMemoryFile(userId, 'SOUL.md', 1, 160);
    return file.lines.join('\n').trim() || null;
  } catch {
    return null;
  }
}

export function pickResponseText(payload: unknown): string | null {
  if (typeof payload === 'string') {
    return normalizeSpaces(payload);
  }

  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const objectPayload = payload as Record<string, unknown>;
  const candidateKeys = ['result', 'output', 'text', 'message', 'content', 'draft', 'translation'];
  for (const key of candidateKeys) {
    const value = objectPayload[key];
    if (typeof value === 'string' && normalizeSpaces(value)) {
      return normalizeSpaces(value);
    }
  }

  const nestedKeys = ['data', 'payload', 'response'];
  for (const key of nestedKeys) {
    const nested = objectPayload[key];
    const nestedText = pickResponseText(nested);
    if (nestedText) {
      return nestedText;
    }
  }

  return null;
}

