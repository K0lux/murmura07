import { EmotionProfile, PowerAsymmetry } from '@murmura/cognitive-core-shared';
import { clamp01, hashContent, normalizeContent } from '../utils/text.js';
import { withRetry } from '../utils/retry.js';

export interface EmotionAnalysisResult {
  emotion: EmotionProfile;
  tensionScore: number;
  ambiguityScore: number;
  powerAsymmetry: PowerAsymmetry;
}

export class EmotionAnalyzer {
  private cache = new Map<string, EmotionAnalysisResult>();

  async analyze(content: string): Promise<EmotionAnalysisResult> {
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

  private heuristicAnalyze(content: string): EmotionAnalysisResult {
    const lower = content.toLowerCase();
    let tension = 0.2;

    if (/[!]{2,}/.test(content)) {
      tension += 0.15;
    }
    if (/[A-Z]{4,}/.test(content)) {
      tension += 0.2;
    }
    if (/(furieux|agac[ée]|frustr[ée]|pas acceptable|d[ée]cu)/.test(lower)) {
      tension += 0.35;
    }
    if (/(urgent|asap|imm[ée]diat)/.test(lower)) {
      tension += 0.1;
    }
    if (/(merci|cordialement|bonne journ[ée]e)/.test(lower)) {
      tension -= 0.05;
    }

    tension = clamp01(tension);

    let dominant: EmotionProfile['dominant'] = 'neutral';
    if (/(inquiet|stress|anxieux)/.test(lower)) {
      dominant = 'anxiety';
    } else if (tension > 0.6) {
      dominant = 'anger';
    } else if (/(pression|deadline)/.test(lower)) {
      dominant = 'pressure';
    }

    const powerAsymmetry = this.detectPowerAsymmetry(lower);

    return {
      emotion: { dominant, intensity: tension },
      tensionScore: tension,
      ambiguityScore: tension > 0.5 && /merci/.test(lower) ? 0.4 : 0.2,
      powerAsymmetry
    };
  }

  private detectPowerAsymmetry(lower: string): PowerAsymmetry {
    if (/(client|patron|manager|chef)/.test(lower)) {
      return { direction: 'interlocutor_dominant', intensity: 0.6 };
    }
    if (/(je d[ée]cide|c'est non-n[ée]gociable)/.test(lower)) {
      return { direction: 'user_dominant', intensity: 0.6 };
    }
    return { direction: 'balanced', intensity: 0.2 };
  }
}

