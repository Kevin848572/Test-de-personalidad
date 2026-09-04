import 'dotenv/config';
import { handle } from 'hono/vercel';
import { createApp } from '../apps/api/dist/app.js';

let cachedPromise: ReturnType<typeof createApp> | null = null;

function getApp() {
  if (!cachedPromise) {
    cachedPromise = createApp().then(async (result) => {
      await result.seed().catch((err: Error) => {
        console.warn('Seed serverless inicial omitido:', err.message);
      });
      return result;
    });
  }
  return cachedPromise;
}

export const config = {
  runtime: 'nodejs'
};

export default async function handler(req: any, res: any) {
  const { app } = await getApp();
  const vercelHandler = handle(app);
  return vercelHandler(req, res);
}
