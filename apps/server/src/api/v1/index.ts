import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { plugin } from '../../utils/plugin';
import plans from './plans';

const routes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.register(plans);
};

export default plugin(routes);
