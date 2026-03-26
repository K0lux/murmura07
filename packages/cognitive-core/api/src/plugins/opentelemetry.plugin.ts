import crypto from 'node:crypto';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function opentelemetryPluginHandler(app: FastifyInstance) {
  app.decorateRequest('span', null);

  app.addHook('onRequest', async (request, reply) => {
    const requestId = String(request.headers['x-request-id'] ?? `req_${Date.now()}`);
    const traceId = readHeader(request.headers['x-trace-id']) ?? crypto.randomBytes(16).toString('hex');
    const spanId = crypto.randomBytes(8).toString('hex');
    const exporter = resolveExporter();
    const routePath = request.routeOptions.url ?? request.url;

    reply.header('x-request-id', requestId);
    reply.header('x-trace-id', traceId);

    request.span = {
      traceId,
      spanId,
      name: `${request.method} ${request.url}`,
      startedAt: Date.now(),
      attributes: {
        'http.method': request.method,
        'http.route': routePath,
        'request.id': requestId,
        'otel.exporter': exporter.kind,
        'otel.endpoint': exporter.endpoint
      },
      setAttribute(key, value) {
        this.attributes[key] = value;
      },
      end(outcome) {
        const durationMs = Date.now() - this.startedAt;
        request.log.info(
          {
            traceId: this.traceId,
            spanId: this.spanId,
            requestId,
            exporter,
            durationMs,
            statusCode: outcome?.statusCode,
            error: outcome?.error instanceof Error ? outcome.error.message : outcome?.error,
            attributes: this.attributes
          },
          'request span completed'
        );
      }
    };
  });

  app.addHook('onResponse', async (request, reply) => {
    request.span?.end({ statusCode: reply.statusCode });
  });

  app.addHook('onError', async (request, _reply, error) => {
    request.span?.setAttribute('error', true);
    request.span?.end({ statusCode: 500, error });
  });
}

export const opentelemetryPlugin = fp(opentelemetryPluginHandler, {
  name: 'opentelemetry-plugin'
});

function resolveExporter() {
  const isProduction = process.env['NODE_ENV'] === 'production';
  return {
    kind: isProduction ? 'otlp' : 'jaeger',
    endpoint: isProduction
      ? process.env['OTEL_EXPORTER_OTLP_ENDPOINT'] ?? 'http://localhost:4318/v1/traces'
      : process.env['JAEGER_ENDPOINT'] ?? 'http://localhost:14268/api/traces'
  };
}

function readHeader(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}
