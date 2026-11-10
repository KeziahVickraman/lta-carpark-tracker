import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CarparkItem,
  CarparkFilterState,
  VehicleType
} from './types/carpark';
import {
  ApiConfig,
  getDefaultApiConfig,
  saveApiConfig,
  getFavoriteCarparks,
  saveFavoriteCarparks,
  fetchCarparkData
} from './services/carparkService';
import { INITIAL_CARPARKS } from './data/mockCarparks';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { FilterControls } from './components/FilterControls';
import { CarparkCard } from './components/CarparkCard';
import { TableView } from './components/TableView';
import { InteractiveMap } from './components/InteractiveMap';
import { TripFinder } from './components/TripFinder';
import { CarparkDetailModal } from './components/CarparkDetailModal';
import { ApiIntegrationModal } from './components/ApiIntegrationModal';
import { Bookmark, Sparkles, Navigation, Layers, Compass, Server, AlertCircle } from 'lucide-react';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('sg_carpark_theme') === 'dark' ||
        (!localStorage.getItem('sg_carpark_theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sg_carpark_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sg_carpark_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // API Config & Data State
  const [apiConfig, setApiConfig] = useState<ApiConfig>(getDefaultApiConfig);
  const [carparks, setCarparks] = useState<CarparkItem[]>(INITIAL_CARPARKS);
  const [sourceLabel, setSourceLabel] = useState<string>('Simulated SG Telemetry');
  const [lastRefreshTime, setLastRefreshTime] = useState<string>(
    new Date().toLocaleTimeString('en-SG', { hour12: false })
  );
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'trip' | 'api'>('overview');

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(getFavoriteCarparks);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      saveFavoriteCarparks(next);
      return next;
    });
  }, []);

  // Selected carpark for detail modal
  const [selectedCarpark, setSelectedCarpark] = useState<CarparkItem | null>(null);

  // Filter state
  const [filters, setFilters] = useState<CarparkFilterState>({
    searchQuery: '',
    region: 'All',
    agency: 'All',
    vehicleType: 'car',
    onlyEv: false,
    onlyFreeSunday: false,
    minAvailableLots: 0,
    sortBy: 'available',
    viewMode: 'grid'
  });

  const resetFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      region: 'All',
      agency: 'All',
      vehicleType: 'car',
      onlyEv: false,
      onlyFreeSunday: false,
      minAvailableLots: 0,
      sortBy: 'available',
      viewMode: 'grid'
    });
  }, []);

  // Fetch logic
  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const result = await fetchCarparkData(apiConfig);
      setCarparks(result.data);
      setSourceLabel(result.source);
      setLastRefreshTime(result.timestamp);
    } catch (e) {
      console.error('Error refreshing carparks:', e);
    } finally {
      setIsRefreshing(false);
    }
  }, [apiConfig]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Periodic auto-refresh
  useEffect(() => {
    const intervalSec = apiConfig.autoRefreshIntervalSec || 45;
    const timer = setInterval(() => {
      loadData();
    }, intervalSec * 1000);
    return () => clearInterval(timer);
  }, [apiConfig.autoRefreshIntervalSec, loadData]);

  const handleSaveApiConfig = (newConfig: ApiConfig) => {
    setApiConfig(newConfig);
    saveApiConfig(newConfig);
  };

  // Filtered & Sorted carparks
  const filteredCarparks = useMemo(() => {
    return carparks
      .filter(cp => {
        // Query filter
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchCode = cp.carpark_number.toLowerCase().includes(q);
          const matchName = cp.name.toLowerCase().includes(q);
          const matchAddr = cp.address.toLowerCase().includes(q);
          const matchArea = cp.area.toLowerCase().includes(q);
          const matchMark = cp.nearby_landmark?.toLowerCase().includes(q);
          if (!matchCode && !matchName && !matchAddr && !matchArea && !matchMark) {
            return false;
          }
        }

        // Region filter
        if (filters.region !== 'All' && cp.region !== filters.region) {
          return false;
        }

        // Agency filter
        if (filters.agency !== 'All' && cp.agency !== filters.agency) {
          return false;
        }

        // EV filter
        if (filters.onlyEv && !cp.ev_charging.has_chargers) {
          return false;
        }

        // Free Sunday
        if (filters.onlyFreeSunday && !cp.free_sunday_parking) {
          return false;
        }

        // Min lots
        const avail = cp.lots[filters.vehicleType].available;
        if (avail < filters.minAvailableLots) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const lotA = a.lots[filters.vehicleType];
        const lotB = b.lots[filters.vehicleType];

        if (filters.sortBy === 'available') {
          return lotB.available - lotA.available;
        }
        if (filters.sortBy === 'occupancy') {
          const occA = lotA.total > 0 ? (lotA.total - lotA.available) / lotA.total : 1;
          const occB = lotB.total > 0 ? (lotB.total - lotB.available) / lotB.total : 1;
          return occA - occB;
        }
        if (filters.sortBy === 'distance') {
          return (a.distance_km || 99) - (b.distance_km || 99);
        }
        if (filters.sortBy === 'rate') {
          return a.rates.estimated_hourly - b.rates.estimated_hourly;
        }
        if (filters.sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [carparks, filters]);

  // Favorite Carparks List
  const favoriteCarparks = useMemo(() => {
    return carparks.filter(c => favorites.includes(c.id));
  }, [carparks, favorites]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Bar Contract Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onRefresh={loadData}
        isRefreshing={isRefreshing}
        lastRefreshTime={lastRefreshTime}
        sourceLabel={sourceLabel}
      />

      {/* Real-time island-wide summary metrics bar */}
      <StatsBar
        carparks={carparks}
        sourceLabel={sourceLabel}
        onOpenApiConfig={() => setIsApiModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tab 1: Carparks Directory */}
        {activeTab === 'overview' && (
          <div>
            {/* Filter Toolbar */}
            <FilterControls
              filters={filters}
              setFilters={setFilters}
              totalCount={carparks.length}
              filteredCount={filteredCarparks.length}
              onReset={resetFilters}
            />

            {/* Saved Favorites Quick Strip (if any saved) */}
            {favoriteCarparks.length > 0 && !filters.searchQuery && filters.region === 'All' && (
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
                  <Bookmark className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>Pinned Watchlist ({favoriteCarparks.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {favoriteCarparks.map(cp => {
                    const lot = cp.lots[filters.vehicleType];
                    return (
                      <div
                        key={cp.id}
                        onClick={() => setSelectedCarpark(cp)}
                        className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-amber-200/80 dark:border-amber-900/50 hover:border-amber-400 dark:hover:border-amber-700 cursor-pointer flex items-center justify-between transition-colors shadow-2xs"
                      >
                        <div className="min-w-0 mr-3">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                              {cp.carpark_number}
                            </span>
                            <span>·</span>
                            <span>{cp.area}</span>
                          </div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {cp.name}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                            {lot.available}
                          </div>
                          <div className="text-[10px] text-slate-400">lots vacant</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredCarparks.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-lg mx-auto my-8">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Singapore carparks match your filter
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
                  Try clearing your search terms or expanding your region selection.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Reset All Filters
                </button>
              </div>
            ) : filters.viewMode === 'grid' ? (
              /* Grid Cards View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCarparks.map(cp => (
                  <CarparkCard
                    key={cp.id}
                    carpark={cp}
                    vehicleType={filters.vehicleType}
                    isFavorite={favorites.includes(cp.id)}
                    onToggleFavorite={toggleFavorite}
                    onSelect={setSelectedCarpark}
                  />
                ))}
              </div>
            ) : (
              /* Table View */
              <TableView
                carparks={filteredCarparks}
                vehicleType={filters.vehicleType}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onSelectCarpark={setSelectedCarpark}
              />
            )}
          </div>
        )}

        {/* Tab 2: Singapore Interactive Map Radar */}
        {activeTab === 'map' && (
          <InteractiveMap
            carparks={carparks}
            vehicleType={filters.vehicleType}
            selectedCarpark={selectedCarpark}
            onSelectCarpark={setSelectedCarpark}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {/* Tab 3: Destination Parking Trip Finder */}
        {activeTab === 'trip' && (
          <TripFinder
            carparks={carparks}
            vehicleType={filters.vehicleType}
            onSelectCarpark={setSelectedCarpark}
          />
        )}

        {/* Tab 4: Backend API Integration Hub */}
        {activeTab === 'api' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white font-bold">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Backend Connection Architecture
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Designed for seamless drop-in integration with your server proxy or Singapore open government data.
                  </p>
                </div>
              </div>

              <div className="prose prose-sm dark:prose-invert text-xs space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  As requested, this frontend application is built completely decoupled from backend persistence, ready for you to wire up your own database, Express service, or serverless functions when you are ready.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 not-prose">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                      1. Data.gov.sg Direct API
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                      <code>GET https://api.data.gov.sg/v1/transport/carpark-availability</code>
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Returns live lot counts for all HDB carparks across Singapore every minute.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                      2. LTA DataMall v2 API
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                      <code>GET https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2</code>
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Returns Orchard, Marina Bay, HarbourFront, CBD, Sentosa and commercial mall lots. Requires free LTA AccountKey header.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsApiModalOpen(true)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Open API Endpoint Configuration & Tester
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Carpark Detail Drawer / Modal */}
      <CarparkDetailModal
        carpark={selectedCarpark}
        onClose={() => setSelectedCarpark(null)}
        vehicleType={filters.vehicleType}
        isFavorite={selectedCarpark ? favorites.includes(selectedCarpark.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      {/* API Configuration & Connection Tester Modal */}
      <ApiIntegrationModal
        config={apiConfig}
        onSaveConfig={handleSaveApiConfig}
        onClose={() => setIsApiModalOpen(false)}
        isOpen={isApiModalOpen}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">SG Carpark Watch</span>
            <span>·</span>
            <span>Real-time Electronic Parking System (EPS) Lot Tracker</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Compliant with Singapore Data.gov.sg and LTA DataMall v2 specifications.
          </div>
        </div>
      </footer>
    </div>
  );
}
