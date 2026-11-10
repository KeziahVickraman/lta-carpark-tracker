import { CarparkItem, DataGovSgResponse } from '../types/carpark';
import { INITIAL_CARPARKS } from '../data/mockCarparks';

export type DataSourceMode = 'simulated' | 'datagov' | 'lta' | 'custom';

export interface ApiConfig {
  sourceMode: DataSourceMode;
  customEndpointUrl: string;
  autoRefreshIntervalSec: number;
}

const STORAGE_KEY_API_CONFIG = 'sg_carpark_api_config';
const STORAGE_KEY_SAVED_CARPARKS = 'sg_carpark_favorites';

export const getDefaultApiConfig = (): ApiConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_API_CONFIG);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return {
    sourceMode: 'simulated',
    customEndpointUrl: '/api/carparkavailability',
    autoRefreshIntervalSec: 45
  };
};

export const saveApiConfig = (config: ApiConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY_API_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save API config:', e);
  }
};

export const getFavoriteCarparks = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_CARPARKS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return ['sg-ion-orchard', 'sg-mbs-expo', 'sg-hdb-acb'];
};

export const saveFavoriteCarparks = (favorites: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_CARPARKS, JSON.stringify(favorites));
  } catch (e) {
    console.error('Failed to save favorites:', e);
  }
};

/**
 * Fetch carpark data based on active configuration
 */
export async function fetchCarparkData(config: ApiConfig): Promise<{
  data: CarparkItem[];
  source: string;
  timestamp: string;
  latencyMs: number;
  notice?: string;
}> {
  const start = performance.now();

  // 1. LTA DataMall Serverless API (/api/carparkavailability)
  if (config.sourceMode === 'lta') {
    try {
      const response = await fetch('/api/carparkavailability?all=true');
      const json = await response.json();
      const end = performance.now();

      if (!response.ok || !json.success) {
        return {
          data: getSimulatedFluctuatedData(),
          source: 'LTA DataMall Gateway (Key Pending)',
          timestamp: new Date().toLocaleTimeString('en-SG', { hour12: false }),
          latencyMs: Math.round(end - start),
          notice: json.error || 'LTA AccountKey not yet configured in environment.'
        };
      }

      // Merge LTA records into carpark dataset
      const records = json.data as Array<{
        CarParkID: string;
        Area: string;
        Development: string;
        AvailableLots: number;
        LotType: string;
        Agency: string;
      }>;

      const ltaMap = new Map<string, number>();
      if (Array.isArray(records)) {
        for (const item of records) {
          const key = (item.Development || '').toLowerCase().trim();
          ltaMap.set(key, item.AvailableLots);
          ltaMap.set(item.CarParkID, item.AvailableLots);
        }
      }

      const merged = INITIAL_CARPARKS.map(cp => {
        const devKey = cp.name.toLowerCase();
        let avail: number | undefined;

        for (const [key, val] of ltaMap.entries()) {
          if (devKey.includes(key) || key.includes(devKey.slice(0, 10))) {
            avail = val;
            break;
          }
        }

        if (avail !== undefined && avail >= 0) {
          return {
            ...cp,
            lots: {
              ...cp.lots,
              car: {
                total: Math.max(cp.lots.car.total, avail),
                available: avail
              }
            },
            updated_at: json.timestamp || new Date().toISOString()
          };
        }
        return cp;
      });

      return {
        data: merged,
        source: `LTA DataMall v2 Live (${records.length} lots)`,
        timestamp: new Date().toLocaleTimeString('en-SG', { hour12: false }),
        latencyMs: Math.round(end - start)
      };
    } catch (err: any) {
      const end = performance.now();
      return {
        data: getSimulatedFluctuatedData(),
        source: 'LTA DataMall (Offline fallback)',
        timestamp: new Date().toLocaleTimeString('en-SG', { hour12: false }),
        latencyMs: Math.round(end - start),
        notice: err.message
      };
    }
  }

  // 2. Custom backend endpoint
  if (config.sourceMode === 'custom' && config.customEndpointUrl) {
    try {
      const response = await fetch(config.customEndpointUrl, {
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`Backend returned HTTP status ${response.status}`);
      }
      const json = await response.json();
      const end = performance.now();
      return {
        data: Array.isArray(json) ? json : (json.data || INITIAL_CARPARKS),
        source: 'Custom Backend API',
        timestamp: new Date().toLocaleTimeString('en-SG', { hour12: false }),
        latencyMs: Math.round(end - start)
      };
    } catch (err) {
      console.warn('Custom backend failed, falling back to simulated data with warning:', err);
      const end = performance.now();
      return {
        data: getSimulatedFluctuatedData(),
        source: 'Custom Backend (Failed, showing simulation)',
        timestamp: new Date().toLocaleTimeString('en-SG', { hour12: false }),
        latencyMs: Math.round(end - start)
      };
    }
  }

  // 3. Official Data.gov.sg Direct API
  if (config.sourceMode === 'datagov') {
    try {
      const response = await fetch('https://api.data.gov.sg/v1/transport/carpark-availability');
      if (!response.ok) {
        throw new Error(`Data.gov.sg error ${response.status}`);
      }
      const json: DataGovSgResponse = await response.json();
      const end = performance.now();

      const itemsMap = new Map<string, { carAvail: number; carTotal: number; time: string }>();
      if (json.items?.[0]?.carpark_data) {
        for (const cp of json.items[0].carpark_data) {
          const carLotInfo = cp.carpark_info.find(i => i.lot_type === 'C') || cp.carpark_info[0];
          if (carLotInfo) {
            itemsMap.set(cp.carpark_number, {
              carAvail: parseInt(carLotInfo.lots_available, 10) || 0,
              carTotal: parseInt(carLotInfo.total_lots, 10) || 100,
              time: cp.update_datetime
            });
          }
        }
      }

      const merged = INITIAL_CARPARKS.map(cp => {
        const live = itemsMap.get(cp.carpark_number);
        if (live) {
          return {
            ...cp,
            lots: {
              ...cp.lots,
              car: {
                total: live.carTotal,
                available: Math.min(live.carAvail, live.carTotal)
              }
            },
            updated_at: live.time || new Date().toISOString()
          };
        }
        return cp;
      });

      return {
        data: merged,
        source: 'Data.gov.sg Live Carpark API',
        timestamp: new Date().toLocaleTimeString('en-SG', { hour12: false }),
        latencyMs: Math.round(end - start)
      };
    } catch (e) {
      console.warn('Data.gov.sg fetch failed or CORS restricted in client, using simulated data:', e);
      const end = performance.now();
      return {
        data: getSimulatedFluctuatedData(),
        source: 'Simulated Singapore Telemetry (Live Fallback)',
        timestamp: new Date().toLocaleTimeString('en-SG', { hour12: false }),
        latencyMs: Math.round(end - start)
      };
    }
  }

  // Default: Simulated real-world fluctuations
  await new Promise(r => setTimeout(r, 120));
  const end = performance.now();
  return {
    data: getSimulatedFluctuatedData(),
    source: 'Simulated Singapore Telemetry',
    timestamp: new Date().toLocaleTimeString('en-SG', { hour12: false }),
    latencyMs: Math.round(end - start)
  };
}

let simulatedCache = [...INITIAL_CARPARKS];

export function getSimulatedFluctuatedData(): CarparkItem[] {
  simulatedCache = simulatedCache.map(cp => {
    const delta = Math.floor(Math.random() * 7) - 3;
    const newCarAvail = Math.max(0, Math.min(cp.lots.car.total, cp.lots.car.available + delta));

    const newDecks = cp.decks.map(d => {
      const deckDelta = Math.floor(Math.random() * 3) - 1;
      return {
        ...d,
        available: Math.max(0, Math.min(d.total, d.available + deckDelta))
      };
    });

    return {
      ...cp,
      lots: {
        ...cp.lots,
        car: {
          ...cp.lots.car,
          available: newCarAvail
        }
      },
      decks: newDecks,
      updated_at: new Date().toISOString()
    };
  });

  return simulatedCache;
}
