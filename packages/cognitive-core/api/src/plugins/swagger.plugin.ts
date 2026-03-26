import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';

export async function swaggerPlugin(app: FastifyInstance) {
  await app.register(swagger as never, {
    openapi: {
      info: {
        title: 'Murmura API',
        version: '0.1.0'
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  } as never);

  await app.register(swaggerUi as never, {
    routePrefix: '/docs',
    baseDir: undefined,
    staticCSP: false,
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    }
  } as never);

  app.get('/openapi.json', async () => app.swagger());
}
