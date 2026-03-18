import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/cognitive-core/shared',
  'packages/cognitive-core/ingestion',
  'packages/cognitive-core/memory',
  'packages/cognitive-core/context-engine',
  'packages/cognitive-core/governance',
  'packages/cognitive-core/decision-engine',
  'packages/cognitive-core/identity-model',
  'packages/cognitive-core/relationship-graph',
  'packages/cognitive-core/reasoning-engine',
  'packages/cognitive-core/simulation-engine',
  'apps/api-gateway'
]);
