import { BadRequestException, NotFoundException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { SlashCommandsService } from '../slash-commands.service.js';

function createService() {
  const cognitiveService = {
    analyze: async () => ({
      analysis: {
        tensionScore: 0.72,
        ambiguityScore: 0.41
      }
    })
  };

  const threadsService = {
    getThread: async () => ({
      interlocuteurId: 'contact_1'
    })
  };

  const messagesService = {
    listMessages: async () => [
      {
        content: 'Merci de valider la proposition avant demain.'
      }
    ]
  };

  const reformuleHandler = {
    command: 'reformule',
    aliases: ['rewrite'],
    execute: async () => ({
      result: 'Version principale\nVersion courte',
      capabilityUsed: 'rewrite_message'
    })
  };
  const analyseHandler = {
    command: 'analyse',
    execute: async () => ({
      result: 'analyse',
      capabilityUsed: 'analysis'
    })
  };
  const toneHandler = {
    command: 'tone',
    execute: async () => ({
      result: 'tone',
      capabilityUsed: 'tone'
    })
  };
  const resumeHandler = {
    command: 'resume',
    aliases: ['summary'],
    execute: async () => ({
      result: 'resume',
      capabilityUsed: 'summary'
    })
  };
  const traduitHandler = {
    command: 'traduit',
    execute: async () => ({
      result: 'translation',
      capabilityUsed: 'translation'
    })
  };
  const brouillonHandler = {
    command: 'brouillon',
    execute: async () => ({
      result: 'draft',
      capabilityUsed: 'draft'
    })
  };

  return new SlashCommandsService(
    cognitiveService as never,
    threadsService as never,
    messagesService as never,
    reformuleHandler as never,
    analyseHandler as never,
    toneHandler as never,
    resumeHandler as never,
    traduitHandler as never,
    brouillonHandler as never
  );
}

describe('SlashCommandsService', () => {
  it('routes a command alias to the right handler and returns execution metadata', async () => {
    const service = createService();
    const response = await service.execute('/rewrite', 'texte original', 'user_1');

    expect(response.capabilityUsed).toBe('rewrite_message');
    expect(response.result).toContain('Version');
    expect(response.executionTimeMs).toBeGreaterThanOrEqual(0);
  });

  it('rejects empty input when no incoming message is provided', async () => {
    const service = createService();

    await expect(service.execute('/reformule', '   ', 'user_1')).rejects.toThrow(
      new BadRequestException('inputText cannot be empty')
    );
  });

  it('rejects unknown commands', async () => {
    const service = createService();

    await expect(service.execute('/unknown', 'hello', 'user_1')).rejects.toThrow(NotFoundException);
  });

  it('returns three ranked suggestions using thread context', async () => {
    const service = createService();
    const response = await service.getSuggestions('thread_1', 'user_1');

    expect(response.suggestions).toHaveLength(3);
    expect(response.threadId).toBe('thread_1');
    expect(response.contextSignals.tensionScore).toBe(0.72);
  });
});

