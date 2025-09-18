import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import auth from './auth';
import { plugin } from '../../utils/plugin';

const routes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.register(auth);
};

export default plugin(routes);
