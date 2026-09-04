import 'dotenv/config';
import { getRequestListener } from '@hono/node-server';
import { createApp } from '../apps/api/dist/app.js';

let cachedListener: any = null;

async function getListener() {
  if (!cachedListener) {
    const { app, seed } = await createApp();
    await seed().catch((err: Error) => {
      console.warn('Seed serverless inicial omitido:', err.message);
    });
    cachedListener = getRequestListener(app.fetch);
  }
  return cachedListener;
}

export const config = {
  runtime: 'nodejs'
};

export default async function handler(req: any, res: any) {
  try {
    if (req.headers && req.headers['x-forwarded-uri']) {
      req.url = req.headers['x-forwarded-uri'];
    }
    const listener = await getListener();
    return listener(req, res);
  } catch (error: any) {
    console.error('Error en Serverless Function:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Error interno del servidor en Vercel Function',
      message: error?.message || String(error)
    }));
  }
}

