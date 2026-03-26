import { buildServer } from './server.js';

const server = buildServer();

const start = async () => {
  await server.listen({ port: Number(process.env['PORT'] ?? 3000), host: '0.0.0.0' });
};

start().catch((error) => {
  server.log.error(error);
  process.exit(1);
});

