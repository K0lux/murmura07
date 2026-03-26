import { Injectable } from '@nestjs/common';
import type {
  SlashCommandExecutionContext,
  SlashCommandHandler,
  SlashCommandResult
} from '../slash-commands.types.js';
import { normalizeSpaces, splitSentences, truncateWords } from './handler.utils.js';

@Injectable()
export class ResumeHandler implements SlashCommandHandler {
  readonly command = 'resume';
  readonly aliases = ['resume', 'summary', 'summarize'];

  async execute(context: SlashCommandExecutionContext): Promise<SlashCommandResult> {
    const sourceText = normalizeSpaces(context.incomingMessage ?? context.inputText);
    const sentences = splitSentences(sourceText);

    const ranked = sentences
      .map((sentence) => ({
        sentence,
        score: this.rankSentence(sentence)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const top = ranked.length > 0 ? ranked : [{ sentence: sourceText, score: 1 }];
    const points = top.slice(0, Math.max(3, Math.min(5, top.length))).map((item, index) => {
      const label = this.looksActionable(item.sentence) ? '[Action]' : '[Info]';
      return `${index + 1}. ${label} ${truncateWords(item.sentence, 15)}`;
    });

    return {
      result: points.join('\n'),
      capabilityUsed: 'summarization'
    };
  }

  private rankSentence(sentence: string) {
    const normalized = sentence.toLowerCase();
    let score = sentence.length;
    if (this.looksActionable(sentence)) {
      score += 60;
    }
    if (/\d/.test(normalized)) {
      score += 15;
    }
    if (/(deadline|urgent|aujourd|demain|asap|important|bloquant)/.test(normalized)) {
      score += 25;
    }
    return score;
  }

  private looksActionable(sentence: string) {
    return /(merci de|peux-tu|peux tu|please|action|a faire|to do|doit|faut|envoyer|livrer|valider|planifier|repondre)/i.test(
      sentence
    );
  }
}

