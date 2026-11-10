import React from 'react';
import { Search, X, SlidersHorizontal, LayoutGrid, Table, Map, Car, Bike, Truck, Zap, Calendar } from 'lucide-react';
import { CarparkFilterState, RegionType, AgencyType, VehicleType, SortOption, ViewMode } from '../types/carpark';

interface FilterControlsProps {
  filters: CarparkFilterState;
  setFilters: React.Dispatch<React.SetStateAction<CarparkFilterState>>;
  totalCount: number;
  filteredCount: number;
  onReset: () => void;
}

const REGIONS: (RegionType | 'All')[] = ['All', 'Central', 'East', 'North-East', 'West', 'North'];
const AGENCIES: (AgencyType | 'All')[] = ['All', 'HDB', 'Commercial', 'URA'];

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  setFilters,
  totalCount,
  filteredCount,
  onReset
}) => {
  const isFiltered =
    filters.searchQuery !== '' ||
    filters.region !== 'All' ||
    filters.agency !== 'All' ||
    filters.onlyEv ||
    filters.onlyFreeSunday ||
    filters.vehicleType !== 'car' ||
    filters.minAvailableLots > 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs mb-6 transition-colors">
      {/* Top row: Search input + View switch + Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search carpark code (ACB, ION, MBS), road, town, or landmark..."
            className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View mode toggle & Sort */}
        <div className="flex items-center gap-2.5">
          {/* View mode segmented buttons */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
            <button
              onClick={() => setFilters(prev => ({ ...prev, viewMode: 'grid' }))}
              title="Grid Card View"
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                filters.viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, viewMode: 'table' }))}
              title="Dense Table View"
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                filters.viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Table className="w-4 h-4" />
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden lg:inline">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as SortOption }))}
              className="py-1.5 pl-2.5 pr-8 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="available">Most Lots Available</option>
              <option value="occupancy">Lowest Occupancy %</option>
              <option value="distance">Nearest Distance</option>
              <option value="rate">Cheapest Rate</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Middle row: Region filters + Agency filters */}
      <div className="pt-3.5 space-y-3">
        {/* Regions */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-2 shrink-0">Region:</span>
          {REGIONS.map(reg => (
            <button
              key={reg}
              onClick={() => setFilters(prev => ({ ...prev, region: reg }))}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filters.region === reg
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {reg === 'All' ? 'All Singapore' : reg}
            </button>
          ))}
        </div>

        {/* Vehicle Type & Quick Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Vehicle type buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-2 shrink-0">Vehicle:</span>
            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setFilters(prev => ({ ...prev, vehicleType: 'car' }))}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filters.vehicleType === 'car'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Car</span>
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, vehicleType: 'motorcycle' }))}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filters.vehicleType === 'motorcycle'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Motorcycle</span>
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, vehicleType: 'heavy' }))}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filters.vehicleType === 'heavy'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Heavy</span>
              </button>
            </div>
          </div>

          {/* Quick attribute toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, onlyEv: !prev.onlyEv }))}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                filters.onlyEv
                  ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-700 dark:text-teal-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>EV Chargers</span>
            </button>

            <button
              onClick={() => setFilters(prev => ({ ...prev, onlyFreeSunday: !prev.onlyFreeSunday }))}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                filters.onlyFreeSunday
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Free Sunday HDB</span>
            </button>

            {isFiltered && (
              <button
                onClick={onReset}
                className="text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 px-2 py-1 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Result counter strip */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div>
          Showing <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{filteredCount}</span> of <span className="tabular-nums">{totalCount}</span> Singapore carparks
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block"></span>
            <span>&gt;30% Lots Available</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block"></span>
            <span>10–30% Moderate</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block"></span>
            <span>&lt;10% Limited</span>
          </span>
        </div>
      </div>
    </div>
  );
};
