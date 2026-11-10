import React, { useState } from 'react';
import { CarparkItem, VehicleType } from '../types/carpark';
import { SG_DESTINATIONS } from '../data/mockCarparks';
import { Compass, Navigation, ArrowUpRight, Zap, CheckCircle, MapPin } from 'lucide-react';

interface TripFinderProps {
  carparks: CarparkItem[];
  vehicleType: VehicleType;
  onSelectCarpark: (carpark: CarparkItem) => void;
}

export const TripFinder: React.FC<TripFinderProps> = ({
  carparks,
  vehicleType,
  onSelectCarpark
}) => {
  const [selectedDestIndex, setSelectedDestIndex] = useState<number>(0);
  const currentDest = SG_DESTINATIONS[selectedDestIndex];

  // Find carparks near this destination
  const nearbyCarparks = currentDest.recommendedCarparkIds
    .map(id => carparks.find(c => c.id === id))
    .filter((c): c is CarparkItem => !!c);

  return (
    <div className="space-y-6">
      {/* Planner Hero Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Singapore Destination Parking Finder</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Where are you driving to in Singapore?
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare nearby carpark availability, estimated walking times, and rates before heading out.
          </p>
        </div>

        {/* Destination buttons */}
        <div className="flex flex-wrap gap-2 mt-5">
          {SG_DESTINATIONS.map((dest, idx) => (
            <button
              key={dest.name}
              onClick={() => setSelectedDestIndex(idx)}
              className={`px-3 py-2 text-xs font-medium rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                selectedDestIndex === idx
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{dest.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Recommended Parking Options for</span>
            <span className="text-emerald-600 dark:text-emerald-400">{currentDest.name}</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {nearbyCarparks.length} Carparks within 500m
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {nearbyCarparks.map((cp, rank) => {
            const lot = cp.lots[vehicleType];
            const isBestPick = rank === 0 && lot.available > 10;
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${cp.coordinates.lat},${cp.coordinates.lng}`;

            return (
              <div
                key={cp.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 flex flex-col justify-between transition-all relative ${
                  isBestPick
                    ? 'border-emerald-500 ring-2 ring-emerald-500/10 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {isBestPick && (
                  <div className="absolute -top-3 left-4 bg-emerald-600 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <CheckCircle className="w-3 h-3" />
                    <span>Top Recommendation</span>
                  </div>
                )}

                <div>
                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1 mb-2">
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {cp.carpark_number}
                    </span>
                    <span>{cp.agency}</span>
                    <span>~{(rank + 1) * 2} mins walk</span>
                  </div>

                  {/* Title */}
                  <h4
                    onClick={() => onSelectCarpark(cp)}
                    className="text-base font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                  >
                    {cp.name}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {cp.address}
                  </p>

                  {/* Vacancy Metric */}
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">
                      Real-Time Vacancy
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                      <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {lot.available}{' '}
                        <span className="text-xs font-normal text-slate-500">/ {lot.total} {vehicleType}s</span>
                      </div>
                      <span className={`text-xs font-semibold ${lot.available > 30 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {lot.available > 30 ? 'Vacant Lots' : 'Limited'}
                      </span>
                    </div>
                  </div>

                  {/* Rates */}
                  <div className="mt-3.5 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span className="text-slate-400">Estimated Rate:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        ${cp.rates.estimated_hourly.toFixed(2)}/hr
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span className="text-slate-400">Peak Schedule:</span>
                      <span className="truncate max-w-[170px] text-right font-medium">
                        {cp.rates.peak}
                      </span>
                    </div>
                    {cp.ev_charging.has_chargers && (
                      <div className="flex justify-between text-teal-600 dark:text-teal-400">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" />
                          <span>EV Chargers:</span>
                        </span>
                        <span className="font-semibold tabular-nums">
                          {cp.ev_charging.available_chargers} free
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectCarpark(cp)}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    View Details
                  </button>

                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
