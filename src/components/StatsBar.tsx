import React from 'react';
import { CarparkItem } from '../types/carpark';
import { Car, Zap, Building2, Activity, Database } from 'lucide-react';

interface StatsBarProps {
  carparks: CarparkItem[];
  sourceLabel: string;
  onOpenApiConfig: () => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({ carparks, sourceLabel, onOpenApiConfig }) => {
  const totalCarparks = carparks.length;
  const totalCarLots = carparks.reduce((acc, c) => acc + c.lots.car.total, 0);
  const availCarLots = carparks.reduce((acc, c) => acc + c.lots.car.available, 0);
  const occupiedCarLots = totalCarLots - availCarLots;
  const occupancyRate = totalCarLots > 0 ? Math.round((occupiedCarLots / totalCarLots) * 100) : 0;

  const totalEvStations = carparks.filter(c => c.ev_charging.has_chargers).length;
  const availEvPoints = carparks.reduce((acc, c) => acc + c.ev_charging.available_chargers, 0);

  return (
    <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Key metrics grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full lg:w-auto">
            {/* Metric 1 */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Available Car Lots</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
                  {availCarLots.toLocaleString()} <span className="text-xs font-normal text-slate-400 dark:text-slate-500">/ {totalCarLots.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Avg Occupancy</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
                  {occupancyRate}%
                </div>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Active Facilities</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
                  {totalCarparks}
                </div>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">EV Plugs Free</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
                  {availEvPoints} <span className="text-xs font-normal text-slate-400 dark:text-slate-500">across {totalEvStations} sites</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Data Mode Bar */}
          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Data Source:</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">{sourceLabel}</span>
            </div>

            <button
              onClick={onOpenApiConfig}
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-4 cursor-pointer whitespace-nowrap"
            >
              Configure Backend
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
