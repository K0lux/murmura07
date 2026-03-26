import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { RawMessageSchema } from '../schemas/message.schema.js';

const idArb = fc.string({ minLength: 1, maxLength: 24 });

const messageArb = fc.record({
  userId: idArb,
  interlocuteurId: idArb,
  canal: fc.constant('email'),
  content: fc.string({ minLength: 1, maxLength: 200 }),
  metadata: fc.record({
    timestamp: fc
      .integer({
        min: Date.parse('2000-01-01T00:00:00.000Z'),
        max: Date.parse('2100-01-01T00:00:00.000Z')
      })
      .map((value) => new Date(value).toISOString()),
    threadId: fc.option(idArb, { nil: undefined }),
    urgencyFlag: fc.boolean(),
    attachments: fc.constant([])
  })
});

describe('RawMessageSchema property tests', () => {
  it('accepts valid generated messages', () => {
    fc.assert(
      fc.property(messageArb, (msg) => {
        expect(RawMessageSchema.safeParse(msg).success).toBe(true);
      })
    );
  });
});
