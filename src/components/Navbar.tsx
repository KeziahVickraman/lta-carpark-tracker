import React from 'react';
import { RefreshCw, Moon, Sun, ShieldCheck, MapPin, Compass, Server, Layers } from 'lucide-react';
import { ViewMode } from '../types/carpark';

interface NavbarProps {
  activeTab: 'overview' | 'map' | 'trip' | 'api';
  setActiveTab: (tab: 'overview' | 'map' | 'trip' | 'api') => void;
  isDark: boolean;
  toggleTheme: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastRefreshTime: string;
  sourceLabel: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  onRefresh,
  isRefreshing,
  lastRefreshTime,
  sourceLabel
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              P
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                SG Carpark Watch
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Singapore Real-Time Lots
              </span>
            </div>
          </div>

          {/* Zone 2: 4 clean single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'overview'
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Carparks Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'map'
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Singapore Map</span>
            </button>

            <button
              onClick={() => setActiveTab('trip')}
              className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'trip'
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Destination Finder</span>
            </button>

            <button
              onClick={() => setActiveTab('api')}
              className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'api'
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Server className="w-4 h-4" />
              <span>Backend Integration</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action cluster */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Sync trigger */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title={`Last updated at ${lastRefreshTime}. Click to fetch latest availability.`}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 border border-slate-200 dark:border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline tabular-nums">Sync Now</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden lg:inline tabular-nums">
                ({lastRefreshTime})
              </span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-1 px-2 whitespace-nowrap shrink-0 ${
              activeTab === 'overview'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Carparks
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`py-1 px-2 whitespace-nowrap shrink-0 ${
              activeTab === 'map'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            SG Map
          </button>
          <button
            onClick={() => setActiveTab('trip')}
            className={`py-1 px-2 whitespace-nowrap shrink-0 ${
              activeTab === 'trip'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Destination
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`py-1 px-2 whitespace-nowrap shrink-0 ${
              activeTab === 'api'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            API Setup
          </button>
        </div>
      </div>
    </header>
  );
};
