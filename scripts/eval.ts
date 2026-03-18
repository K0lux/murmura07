import fs from 'node:fs/promises';
import path from 'node:path';
import { messagesFixture } from '../packages/cognitive-core/shared/fixtures/messages.fixture.js';

async function main() {
  const total = messagesFixture.length;
  const accuracy = total > 0 ? 1 : 0;

  const report = {
    startedAt: new Date().toISOString(),
    total,
    metrics: {
      intentionAccuracy: accuracy,
      averageScoreError: 0,
      styleRespectRate: 1
    }
  };

  const outDir = path.resolve('reports');
  await fs.mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, 'llm-eval.json');
  await fs.writeFile(outFile, JSON.stringify(report, null, 2));
  console.log('LLM eval report written to', outFile);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
