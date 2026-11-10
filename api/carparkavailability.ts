import type { Request, Response } from 'express';

const LTA_CARPARK_API_URL = 'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2';

export interface LTACarparkRecord {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string; // e.g. "1.2935 103.8572"
  AvailableLots: number;
  LotType: 'C' | 'H' | 'Y' | string; // C = Cars, H = Heavy, Y = Motorcycle
  Agency: 'HDB' | 'LTA' | 'URA' | string;
}

export interface LTAResponse {
  'odata.metadata'?: string;
  value: LTACarparkRecord[];
}

// In-memory cache to prevent exceeding LTA DataMall rate limits
let cache: {
  data: LTACarparkRecord[];
  timestamp: number;
} | null = null;

const CACHE_TTL_MS = 30 * 1000; // 30 seconds cache

/**
 * Serverless Carpark Availability Handler
 * Route: GET /api/carparkavailability
 *
 * Query Params:
 * - ?skip=0 (optional, LTA pagination)
 * - ?all=true (optional, fetch all pages)
 * - ?agency=HDB (optional, filter by agency)
 */
export default async function handler(req: Request, res: Response) {
  // Set CORS and JSON headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Retrieve AccountKey from environment variable (do not hardcode)
  const accountKey =
    process.env.LTA_DATAMALL_ACCOUNT_KEY ||
    process.env.LTA_ACCOUNT_KEY ||
    process.env.ACCOUNT_KEY;

  if (!accountKey || accountKey.trim() === '') {
    return res.status(503).json({
      success: false,
      error: 'LTA_DATAMALL_ACCOUNT_KEY is not configured in environment variables.',
      instruction:
        'Please set the LTA_DATAMALL_ACCOUNT_KEY environment variable with your LTA DataMall AccountKey. Obtain one from https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html',
      endpoint: LTA_CARPARK_API_URL,
      required_header: 'AccountKey',
      records_returned: 0,
      data: []
    });
  }

  const now = Date.now();
  const shouldFetchAll = req.query.all === 'true';
  const skip = typeof req.query.skip === 'string' ? req.query.skip : '0';
  const agencyFilter = typeof req.query.agency === 'string' ? req.query.agency.toUpperCase() : null;

  // Use cached data if valid and not a specific skip page request
  if (!shouldFetchAll && skip === '0' && cache && now - cache.timestamp < CACHE_TTL_MS) {
    let filtered = cache.data;
    if (agencyFilter) {
      filtered = filtered.filter(item => item.Agency.toUpperCase() === agencyFilter);
    }
    return res.status(200).json({
      success: true,
      source: 'LTA DataMall v2 (Cached)',
      cached: true,
      cache_age_seconds: Math.round((now - cache.timestamp) / 1000),
      total_records: filtered.length,
      data: filtered
    });
  }

  try {
    const fetchPage = async (skipOffset: number): Promise<LTACarparkRecord[]> => {
      const url = skipOffset > 0 ? `${LTA_CARPARK_API_URL}?$skip=${skipOffset}` : LTA_CARPARK_API_URL;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          AccountKey: accountKey.trim(),
          accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`LTA DataMall API responded with HTTP status ${response.status}: ${response.statusText}`);
      }

      const json = (await response.json()) as LTAResponse;
      return json.value || [];
    };

    let allRecords: LTACarparkRecord[] = [];

    if (shouldFetchAll) {
      // LTA returns records in batches of 500
      let currentSkip = 0;
      let hasMore = true;

      while (hasMore) {
        const batch = await fetchPage(currentSkip);
        allRecords = allRecords.concat(batch);
        if (batch.length < 500 || currentSkip >= 3000) {
          hasMore = false;
        } else {
          currentSkip += 500;
        }
      }
    } else {
      allRecords = await fetchPage(parseInt(skip, 10) || 0);
    }

    // Update in-memory cache
    cache = {
      data: allRecords,
      timestamp: now
    };

    let result = allRecords;
    if (agencyFilter) {
      result = result.filter(item => item.Agency.toUpperCase() === agencyFilter);
    }

    return res.status(200).json({
      success: true,
      source: 'LTA DataMall v2',
      cached: false,
      timestamp: new Date().toISOString(),
      total_records: result.length,
      data: result
    });
  } catch (err: any) {
    console.error('Error fetching from LTA DataMall:', err);
    return res.status(502).json({
      success: false,
      error: 'Failed to retrieve data from LTA DataMall',
      message: err.message || 'Unknown network error',
      endpoint: LTA_CARPARK_API_URL
    });
  }
}
