import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import fp, { type PluginMetadata } from 'fastify-plugin';

export const plugin = (plugin: FastifyPluginAsyncZod, meta?: PluginMetadata) =>
  fp(async (app, opts) => {
    app.register(plugin, opts);
  }, meta);
