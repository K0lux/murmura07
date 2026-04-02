import { describe, expect, it, vi } from 'vitest';
import { SlackWebhookController } from '../modules/channels/slack/slack.webhook.controller.js';
import { TelegramWebhookController } from '../modules/channels/telegram/telegram.webhook.controller.js';
import { WhatsappWebhookController } from '../modules/channels/whatsapp/whatsapp.webhook.controller.js';
import { ContextController } from '../modules/cognitive/context/context.controller.js';
import { GovernanceController } from '../modules/cognitive/governance/governance.controller.js';
import { IdentityController } from '../modules/cognitive/identity/identity.controller.js';
import { MemoryController } from '../modules/cognitive/memory/memory.controller.js';
import { RelationshipsController } from '../modules/cognitive/relationships/relationships.controller.js';
import { DigitalTwinController } from '../modules/digital-twin/digital-twin.controller.js';
import { InternalMessagingController } from '../modules/internal-messaging/internal-messaging.controller.js';
import { MessagesController } from '../modules/messaging/messages/messages.controller.js';
import { ThreadsController } from '../modules/messaging/threads/threads.controller.js';

describe('Application controller smoke tests', () => {
  it('delegates internal messaging actions to the service layer', async () => {
    const service = {
      listThreads: vi.fn(() => ['thread-1']),
      createThread: vi.fn((targetUserId: string) => ({ id: 'thread-2', targetUserId })),
      listMessages: vi.fn((threadId: string) => [{ threadId }]),
      sendMessage: vi.fn((threadId: string, body: unknown) => ({ threadId, body })),
      react: vi.fn((messageId: string, emoji: string) => ({ messageId, emoji })),
      searchUsers: vi.fn((query: string) => [{ id: 'user-2', query }])
    };
    const controller = new InternalMessagingController(service as never);

    expect(controller.listThreads()).toEqual(['thread-1']);
    expect(controller.createThread({ targetUserId: 'user-2' })).toEqual({
      id: 'thread-2',
      targetUserId: 'user-2'
    });
    expect(controller.listMessages('thread-2')).toEqual([{ threadId: 'thread-2' }]);
    expect(controller.sendMessage('thread-2', { content: 'hello' } as never)).toEqual({
      threadId: 'thread-2',
      body: { content: 'hello' }
    });
    expect(controller.react('message-1', { emoji: 'fire' } as never)).toEqual({
      messageId: 'message-1',
      emoji: 'fire'
    });
    expect(controller.search('ali')).toEqual([{ id: 'user-2', query: 'ali' }]);
  });

  it('maps thread and message requests with authenticated or anonymous users', () => {
    const threadsService = {
      listThreads: vi.fn((userId: string) => ({ userId })),
      createThread: vi.fn((userId: string, body: unknown) => ({ userId, body })),
      getThread: vi.fn((id: string, userId: string) => ({ id, userId })),
      updateThread: vi.fn((id: string, userId: string, body: unknown) => ({ id, userId, body })),
      deleteThread: vi.fn((id: string, userId: string) => ({ id, userId, deleted: true }))
    };
    const messagesService = {
      listMessages: vi.fn((userId: string, threadId: string, limit?: number) => ({
        userId,
        threadId,
        limit
      })),
      sendMessage: vi.fn((userId: string, threadId: string, body: unknown) => ({
        userId,
        threadId,
        body
      })),
      markRead: vi.fn((userId: string, id: string) => ({ userId, id, read: true }))
    };

    const threadsController = new ThreadsController(threadsService as never);
    const messagesController = new MessagesController(messagesService as never);

    expect(threadsController.list({ user: { userId: 'user-1' } })).toEqual({ userId: 'user-1' });
    expect(threadsController.detail({}, 'thread-1')).toEqual({
      id: 'thread-1',
      userId: 'anonymous'
    });
    expect(threadsController.update({ user: { userId: 'user-3' } }, 'thread-4', { pinned: true })).toEqual({
      id: 'thread-4',
      userId: 'user-3',
      body: { pinned: true }
    });
    expect(messagesController.list({ user: { userId: 'user-2' } }, 'thread-8', '25')).toEqual({
      userId: 'user-2',
      threadId: 'thread-8',
      limit: 25
    });
    expect(messagesController.send({}, 'thread-8', { content: 'yo' } as never)).toEqual({
      userId: 'anonymous',
      threadId: 'thread-8',
      body: { content: 'yo' }
    });
    expect(messagesController.markRead({ user: { userId: 'user-2' } }, 'message-1')).toEqual({
      userId: 'user-2',
      id: 'message-1',
      read: true
    });
  });

  it('delegates digital twin workflows and cognitive read endpoints', async () => {
    const digitalTwinService = {
      createSession: vi.fn((userId: string, contactId: string) => ({ userId, contactId })),
      sendMessage: vi.fn((userId: string, sessionId: string, content: string) => ({
        userId,
        sessionId,
        content
      })),
      openStream: vi.fn((sessionId: string) => ({ sessionId, stream: true })),
      getRelationshipContext: vi.fn((userId: string, contactId: string) => ({ userId, contactId })),
      closeSession: vi.fn((userId: string, sessionId: string) => ({ userId, sessionId, closed: true }))
    };
    const cognitiveService = {
      getContext: vi.fn((userId: string, threadId: string) => ({ userId, threadId })),
      getGovernanceRules: vi.fn((userId: string) => ({ userId, rules: [] })),
      createGovernanceRule: vi.fn((userId: string, description: string) => ({ userId, description })),
      getIdentity: vi.fn((userId: string) => ({ userId })),
      updateIdentity: vi.fn((userId: string, body: unknown) => ({ userId, body })),
      searchMemory: vi.fn((userId: string, query: string, options: unknown) => ({
        userId,
        query,
        options
      })),
      getMemoryFile: vi.fn((userId: string, path: string, startLine?: number, numLines?: number) => ({
        userId,
        path,
        startLine,
        numLines
      })),
      getRelationships: vi.fn((userId: string, filters: unknown) => ({ userId, filters })),
      getRelationshipDetail: vi.fn((userId: string, id: string) => ({ userId, id })),
      updateRelationshipNotes: vi.fn((userId: string, id: string, notes: string) => ({
        userId,
        id,
        notes
      }))
    };

    const twinController = new DigitalTwinController(digitalTwinService as never);
    const contextController = new ContextController(cognitiveService as never);
    const governanceController = new GovernanceController(cognitiveService as never);
    const identityController = new IdentityController(cognitiveService as never);
    const memoryController = new MemoryController(cognitiveService as never);
    const relationshipsController = new RelationshipsController(cognitiveService as never);

    expect(twinController.createSession({ user: { userId: 'user-1' } }, { contactId: 'contact-1' } as never)).toEqual({
      userId: 'user-1',
      contactId: 'contact-1'
    });
    expect(twinController.stream('session-1')).toEqual({ sessionId: 'session-1', stream: true });
    await expect(
      contextController.get({ headers: { 'x-user-id': 'user-ctx' } }, 'thread-9')
    ).resolves.toEqual({
      userId: 'user-ctx',
      threadId: 'thread-9'
    });
    await expect(governanceController.create({ user: { userId: 'user-1' } }, { description: 'Be nice' })).resolves.toEqual({
      userId: 'user-1',
      description: 'Be nice'
    });
    await expect(identityController.update({}, { coreValues: ['clarity'] })).resolves.toEqual({
      userId: 'anonymous',
      body: { coreValues: ['clarity'] }
    });
    await expect(
      memoryController.search(
        { query: 'hello', limit: 10, sources: 'slack,email' },
        { user: { userId: 'user-4' } }
      )
    ).resolves.toEqual({
      userId: 'user-4',
      query: 'hello',
      options: { limit: 10, sources: ['slack', 'email'] }
    });
    await expect(
      relationshipsController.updateNotes(
        { user: { userId: 'user-5' } },
        'rel-1',
        { notes: 'Important partner' }
      )
    ).resolves.toEqual({
      userId: 'user-5',
      id: 'rel-1',
      notes: 'Important partner'
    });
  });

  it('handles webhook controllers for Slack, Telegram and WhatsApp', () => {
    const slackService = {
      handleWebhook: vi.fn((body: unknown) => ({ provider: 'slack', body }))
    };
    const telegramService = {
      handleWebhook: vi.fn((body: unknown) => ({ provider: 'telegram', body }))
    };
    const whatsappService = {
      handleWebhook: vi.fn((body: unknown) => ({ provider: 'whatsapp', body }))
    };

    const slackController = new SlackWebhookController(slackService as never);
    const telegramController = new TelegramWebhookController(telegramService as never);
    const whatsappController = new WhatsappWebhookController(whatsappService as never);

    expect(slackController.handle({ type: 'url_verification', challenge: 'abc123' })).toEqual({
      challenge: 'abc123'
    });
    expect(slackController.handle({ type: 'event_callback' })).toEqual({
      provider: 'slack',
      body: { type: 'event_callback' }
    });
    expect(telegramController.handle({ update_id: 1 })).toEqual({
      provider: 'telegram',
      body: { update_id: 1 }
    });
    expect(whatsappController.verify('hub-test')).toEqual({
      challenge: 'hub-test'
    });
    expect(whatsappController.handle({ entry: [] })).toEqual({
      provider: 'whatsapp',
      body: { entry: [] }
    });
  });
});
