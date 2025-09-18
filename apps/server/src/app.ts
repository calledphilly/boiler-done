import Fastify from 'fastify';
import cors from '@fastify/cors';
import api from './api';

const app = Fastify({ logger: true });

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
