import { Intention, UrgencyLevel } from '@murmura/cognitive-core-shared';
import { clamp01, hashContent, normalizeContent } from '../utils/text.js';
import { withRetry } from '../utils/retry.js';

export interface IntentionAnalysisResult {
  intention: Intention;
  confidence: number;
  reasoning: string;
  urgencyLevel: UrgencyLevel;
  ambiguityScore: number;
}

export class IntentionAnalyzer {
  private cache = new Map<string, IntentionAnalysisResult>();

  async analyze(content: string): Promise<IntentionAnalysisResult> {
    const normalized = normalizeContent(content);
    const cacheKey = hashContent(normalized);
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await withRetry(
      () => Promise.resolve(this.heuristicAnalyze(normalized)),
      { retries: 2, baseDelayMs: 100 }
    );

    this.cache.set(cacheKey, result);
    return result;
  }

  private heuristicAnalyze(content: string): IntentionAnalysisResult {
    if (!content) {
      return {
        intention: 'unknown',
        confidence: 0.2,
        reasoning: 'empty content',
        urgencyLevel: 'low',
        ambiguityScore: 0.8
      };
    }

    const lower = content.toLowerCase();
    const matches: Array<{ intention: Intention; weight: number; reason: string }> = [];

    if (/[?]/.test(content)) {
      matches.push({ intention: 'information', weight: 0.6, reason: 'question mark' });
    }

    if (/(please|peux-tu|pouvez-vous|merci de|could you)/.test(lower)) {
      matches.push({ intention: 'request', weight: 0.7, reason: 'polite request' });
    }

    if (/(revoir le prix|n[ée]gocier|ren[ée]gocier|deal|contrat)/.test(lower)) {
      matches.push({ intention: 'negotiation', weight: 0.75, reason: 'negotiation cues' });
    }

    if (/(inacceptable|pas d'accord|tu n'as pas|ce n'est pas ok)/.test(lower)) {
      matches.push({ intention: 'confrontation', weight: 0.7, reason: 'confrontational phrasing' });
    }

    if (/(sinon|or else|je vais|cons[ée]quences)/.test(lower)) {
      matches.push({ intention: 'threat', weight: 0.7, reason: 'threat cues' });
    }

    if (/(bonjour|hello|merci|salut|cordialement)/.test(lower) && content.length < 80) {
      matches.push({ intention: 'social', weight: 0.4, reason: 'greeting/closure' });
    }

    const sorted = matches.sort((a, b) => b.weight - a.weight);
    const top = sorted[0];

    const urgencyLevel = this.detectUrgency(lower);
    const ambiguityScore = clamp01(matches.length > 1 ? 0.6 : 0.2);

    if (!top) {
      return {
        intention: 'unknown',
        confidence: 0.4,
        reasoning: 'no strong cues detected',
        urgencyLevel,
        ambiguityScore
      };
    }

    return {
      intention: top.intention,
      confidence: clamp01(top.weight + 0.2),
      reasoning: top.reason,
      urgencyLevel,
      ambiguityScore
    };
  }

  private detectUrgency(lower: string): UrgencyLevel {
    if (/(urgent|asap|imm[ée]diat|tout de suite)/.test(lower)) {
      return 'high';
    }
    if (/(aujourd'hui|rapidement|d[eè]s que possible)/.test(lower)) {
      return 'medium';
    }
    return 'low';
  }
}

