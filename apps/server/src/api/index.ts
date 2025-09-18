import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import common from './common';
import { plugin } from '../utils/plugin';

const routes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.register(common);
};

export default plugin(routes);
