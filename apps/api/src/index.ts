import 'dotenv/config';
import { serve } from '@hono/node-server';
import { createApp } from './app.js';

export { createApp };

export async function bootstrap() {
  return createApp();
}

if (process.env.NODE_ENV !== 'test') {
  createApp().then(({ app, config, seed }) => {
    seed().then(() => {
      serve({ fetch: app.fetch, port: config.port }, (info) => {
        console.log(`🚀 Servidor API escuchando en http://localhost:${info.port}`);
      });
    });
  }).catch((err) => {
    console.error('❌ Error fatal al inicializar el servidor:', err);
    process.exit(1);
  });
}