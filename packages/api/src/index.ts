import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import feedbackRoutes from './routes/feedback.js';
import appsRoutes from './routes/apps.js';

const app = new Hono();

app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'X-App-Id', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
}));

app.get('/', (c) => c.json({ name: 'FTP Feedback API', version: '0.1.0' }));
app.get('/health', (c) => c.json({ ok: true }));

app.route('/v1/feedback', feedbackRoutes);
app.route('/v1/apps', appsRoutes);

const port = parseInt(process.env.PORT || '3456');
console.log(`FTP Feedback API running on http://0.0.0.0:${port}`);
serve({ fetch: app.fetch, port, hostname: '0.0.0.0' });
