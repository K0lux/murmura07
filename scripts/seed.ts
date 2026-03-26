import { PrismaClient } from '@prisma/client';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import jwt from 'jsonwebtoken';
import { MemoryFlusher, SessionIndexer, SessionStore, WorkspaceManager } from '@murmura/cognitive-core-memory';

const prisma = new PrismaClient();
const workspaceRoot = path.resolve('.murmura', 'workspaces');
const workspaceManager = new WorkspaceManager(workspaceRoot);
const sessionStore = new SessionStore(workspaceManager);
const sessionIndexer = new SessionIndexer(workspaceManager);
const memoryFlusher = new MemoryFlusher(workspaceManager);

const refreshSecret = process.env['JWT_REFRESH_SECRET'] ?? 'dev_refresh_secret';
const refreshTtl = process.env['JWT_REFRESH_TTL'] ?? '30d';

const users = [
  {
    email: 'seed@murmura.local',
    password: 'murmura_dev',
    phoneNumber: '+22890000001',
    profile: {
      displayName: 'Seed User',
      style: 'coordinateur calme et pragmatique',
      contacts: [
        {
          id: 'camille-fournisseur',
          name: 'Camille',
          channel: 'email',
          relationshipType: 'partenaire',
          threadTitle: 'Renouvellement contrat 2026',
          messages: [
            'Bonjour Camille, peux-tu me confirmer les conditions du renouvellement ?',
            'Oui, je t’envoie la version consolidée en fin de journée.',
            'Parfait, je bloque un créneau demain pour validation.'
          ],
          memoryNotes: [
            'Camille apprécie les demandes structurées avec échéance explicite.',
            'Relation stable, bonne réactivité sur les sujets contractuels.'
          ]
        }
      ]
    }
  },
  {
    email: 'alice@murmura.local',
    password: 'alice_dev',
    phoneNumber: '+22890000002',
    profile: {
      displayName: 'Alice',
      style: 'directe, rapide, orientee resultat',
      contacts: [
        {
          id: 'marc-produit',
          name: 'Marc',
          channel: 'slack',
          relationshipType: 'collegue',
          threadTitle: 'Priorisation sprint mobile',
          messages: [
            'Marc, on garde le correctif notification dans le sprint ?',
            'Oui, mais il faut sortir le correctif paiement avant.',
            'Compris, je revois la roadmap et je te ping pour arbitrage.'
          ],
          memoryNotes: [
            'Marc repond vite quand les options sont deja tranchees.',
            'Preferer des messages courts avec impact produit explicite.'
          ]
        }
      ]
    }
  },
  {
    email: 'bob@murmura.local',
    password: 'bob_dev',
    phoneNumber: '+22890000003',
    profile: {
      displayName: 'Bob',
      style: 'prudent, diplomate, detaille',
      contacts: [
        {
          id: 'sarah-client',
          name: 'Sarah',
          channel: 'whatsapp',
          relationshipType: 'cliente',
          threadTitle: 'Suivi livraison atelier',
          messages: [
            'Bonsoir Sarah, je te confirme que le support sera livre vendredi.',
            'Merci Bob, peux-tu aussi me partager le recap des points ouverts ?',
            'Oui, je t’envoie un recap synthese avec les risques et actions.'
          ],
          memoryNotes: [
            'Sarah attend de la transparence sur les risques residuels.',
            'La relation se renforce quand les suivis sont proactifs.'
          ]
        }
      ]
    }
  }
];

function hashPassword(raw: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(raw, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function signRefreshToken(userId: string) {
  const jti = crypto.randomBytes(16).toString('hex');
  return jwt.sign({ sub: userId, type: 'refresh', jti }, refreshSecret, { expiresIn: refreshTtl });
}

function getExpiryDate(ttl: string) {
  const now = new Date();
  const match = ttl.match(/^(\d+)([smhd])$/);
  if (!match) {
    return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  }
  const value = Number(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };
  return new Date(now.getTime() + value * multipliers[unit]);
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function writeWorkspaceProfile(
  userId: string,
  profile: (typeof users)[number]['profile']
) {
  const workspacePath = await workspaceManager.ensureWorkspace(userId);
  const relationshipsDir = path.join(workspacePath, 'relationships');
  const sessionsDir = path.join(workspacePath, 'sessions');
  await fs.mkdir(relationshipsDir, { recursive: true });
  await fs.mkdir(path.join(sessionsDir, 'indexed'), { recursive: true });

  await fs.writeFile(
    path.join(workspacePath, 'SOUL.md'),
    `# ${profile.displayName}\n\n- Style: ${profile.style}\n- Workspace seeded for realistic development data.\n`,
    'utf8'
  );

  await fs.writeFile(
    path.join(workspacePath, 'CONTEXT.md'),
    `# Context\n\n${profile.displayName} utilise cet espace pour suivre des conversations actives et des decisions relationnelles.\n`,
    'utf8'
  );

  const sessionIndex = [];

  for (const contact of profile.contacts) {
    const contactSlug = slugify(contact.id);
    const sessionId = `${contactSlug}-${Date.now()}`;
    const now = new Date().toISOString();

    await fs.writeFile(
      path.join(relationshipsDir, `${contactSlug}.md`),
      [
        `# ${contact.name}`,
        '',
        `- Channel: ${contact.channel}`,
        `- Relationship: ${contact.relationshipType}`,
        '',
        '## Notes',
        ...contact.memoryNotes.map((note) => `- ${note}`)
      ].join('\n'),
      'utf8'
    );

    for (const content of contact.messages) {
      await sessionStore.append(userId, sessionId, {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        createdAt: now,
        channel: contact.channel
      });
    }

    await sessionIndexer.exportSession(userId, sessionId);
    for (const note of contact.memoryNotes) {
      await memoryFlusher.flush(userId, `${contact.name}: ${note}`);
    }

    sessionIndex.push({
      id: sessionId,
      createdAt: now,
      updatedAt: now,
      title: contact.threadTitle
    });
  }

  await fs.writeFile(
    path.join(sessionsDir, 'sessions.json'),
    JSON.stringify(sessionIndex, null, 2),
    'utf8'
  );
}

async function main() {
  for (const userInput of users) {
    const existing = await prisma.user.findUnique({ where: { email: userInput.email } });
    let user = existing;

    if (!user) {
      const { hash, salt } = hashPassword(userInput.password);
      user = await prisma.user.create({
        data: {
          email: userInput.email,
          phoneNumber: userInput.phoneNumber,
          passwordHash: hash,
          passwordSalt: salt
        }
      });

      console.log('Seed user created:', userInput.email);
    } else {
      console.log('Seed user already exists:', userInput.email);
    }

    const refreshToken = signRefreshToken(user.id);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: getExpiryDate(refreshTtl)
      }
    });

    await writeWorkspaceProfile(user.id, userInput.profile);
    console.log(`Workspace initialized for ${userInput.email} at ${workspaceManager.resolveWorkspace(user.id)}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
