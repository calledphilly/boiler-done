import Fastify from 'fastify';
import cors from '@fastify/cors';
import rawBody from 'fastify-raw-body';
import api from './api';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';

const app = Fastify({ logger: true })
  .setValidatorCompiler(validatorCompiler)
  .setSerializerCompiler(serializerCompiler)
  .withTypeProvider<ZodTypeProvider>();

// Enregistrer le plugin raw-body pour les webhooks
app.register(rawBody, {
  field: 'rawBody', // ajoute request.rawBody
  global: false, // ne l'active que pour les routes qui le demandent
  encoding: false, // garde le Buffer brut
  runFirst: true, // execute avant les autres plugins
});

app.register(cors, {
  origin: [
    process.env['CLIENT_ORIGIN'] || 'http://localhost:5173',
    'http://localhost',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400,
});

app.register(api, { prefix: '/api' });

export { app };
