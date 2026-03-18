import fs from 'node:fs/promises';
import path from 'node:path';
import { IdentityModel } from '@murmura/cognitive-core-shared';

export class SoulWriter {
  async write(userId: string, model: IdentityModel) {
    const root = process.env['WORKSPACE_ROOT'] ?? path.resolve('workspace-template');
    const userDir = path.join(root, userId);
    await fs.mkdir(userDir, { recursive: true });

    const content = `# SOUL\n\n## Style de Communication\n- formalité: ${model.communicationStyle.formality}\n- ton: ${model.communicationStyle.tone}\n\n## Niveaux d'Autonomie\n- confrontationLevel: ${model.confrontationLevel}\n- riskTolerance: ${model.riskTolerance}\n\n## Valeurs\n${model.coreValues.map((value) => `- ${value}`).join('\n')}\n\n## Zone Manuelle\n`;

    await fs.writeFile(path.join(userDir, 'SOUL.md'), content);
  }
}
