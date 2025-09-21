import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { auth } from '../../utils/auth';
import { plugin } from '../../utils/plugin';

const routes: FastifyPluginAsyncZod = async (fastify) => {
  // Route spécifique pour le webhook Stripe avec body brut
  fastify.route({
    method: 'POST',
    url: '/auth/stripe/webhook',
    config: {
      rawBody: true,
    },
    async handler(request, reply) {
      try {
        const url = new URL(request.url, `http://${request.headers.host}`);
        const headers = new Headers();
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) headers.append(key, value.toString());
        });

        // Utiliser directement le body brut pour les webhooks Stripe
        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          body: request.rawBody, // Body brut nécessaire pour la validation Stripe
        });

        const response = await auth.handler(req);
        reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));
        reply.send(response.body ? await response.text() : null);
      } catch (error: any) {
        fastify.log.error('Stripe Webhook Error:', error);
        reply.status(500).send({
          error: 'Webhook processing error',
          code: 'WEBHOOK_FAILURE',
        });
      }
    },
  });

  // Routes pour toutes les autres authentifications
  fastify.route({
    method: ['GET', 'POST'],
    url: '/auth/*',
    async handler(request, reply) {
      try {
        // Ignorer les webhooks Stripe (déjà gérés ci-dessus)
        if (request.url === '/auth/stripe/webhook') {
          return;
        }

        const url = new URL(request.url, `http://${request.headers.host}`);
        const headers = new Headers();
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) headers.append(key, value.toString());
        });

        const body = request.body ? JSON.stringify(request.body) : undefined;

        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          body: body,
        });

        const response = await auth.handler(req);
        reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));
        reply.send(response.body ? await response.text() : null);
      } catch (error: any) {
        fastify.log.error('Authentication Error:', error);
        reply.status(500).send({
          error: 'Internal authentication error',
          code: 'AUTH_FAILURE',
        });
      }
    },
  });
};

export default plugin(routes);
