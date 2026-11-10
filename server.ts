import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import healthHandler from './api/health.ts';
import carparkAvailabilityHandler from './api/carparkavailability.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Mount serverless handlers under /api
  app.get('/api/health', (req, res) => {
    return healthHandler(req, res);
  });

  app.get('/api/carparkavailability', (req, res) => {
    return carparkAvailabilityHandler(req, res);
  });

  if (!isProduction) {
    // In development: mount Vite dev server as middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // In production: serve built static files from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[SG Carpark Server] Running on http://localhost:${PORT}`);
    console.log(`[SG Carpark Server] Endpoint /api/health ready`);
    console.log(`[SG Carpark Server] Endpoint /api/carparkavailability ready`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
