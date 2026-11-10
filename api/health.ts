import type { Request, Response } from 'express';

export interface HealthResponse {
  status: 'ok' | 'degraded';
  timestamp: string;
  service: string;
  uptime: number;
  environment: {
    node_version: string;
    lta_key_configured: boolean;
  };
}

/**
 * Serverless Health Check Handler
 * Route: GET /api/health
 */
export default async function handler(req: Request, res: Response) {
  const ltaKey = process.env.LTA_DATAMALL_ACCOUNT_KEY || process.env.LTA_ACCOUNT_KEY || process.env.ACCOUNT_KEY;

  const data: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SG Carpark Watch - LTA DataMall Gateway',
    uptime: Math.round(process.uptime()),
    environment: {
      node_version: process.version,
      lta_key_configured: Boolean(ltaKey && ltaKey.trim().length > 0)
    }
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.status(200).json(data);
}
