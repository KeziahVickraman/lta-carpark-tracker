import React from 'react';
import { CarparkItem, VehicleType } from '../types/carpark';
import { Bookmark, Navigation, Zap, ArrowUpRight, ChevronRight } from 'lucide-react';

interface TableViewProps {
  carparks: CarparkItem[];
  vehicleType: VehicleType;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectCarpark: (carpark: CarparkItem) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  carparks,
  vehicleType,
  favorites,
  onToggleFavorite,
  onSelectCarpark
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            <tr>
              <th scope="col" className="w-10 px-4 py-3 text-center">
                <span className="sr-only">Favorite</span>
              </th>
              <th scope="col" className="px-4 py-3">Carpark & Code</th>
              <th scope="col" className="px-4 py-3">Agency / Type</th>
              <th scope="col" className="px-4 py-3">Area / Region</th>
              <th scope="col" className="px-4 py-3 text-right">Available Lots</th>
              <th scope="col" className="px-4 py-3 text-right">Occupancy %</th>
              <th scope="col" className="px-4 py-3 text-center">EV Plugs</th>
              <th scope="col" className="px-4 py-3">Hourly Rate</th>
              <th scope="col" className="px-4 py-3 text-center">Height</th>
              <th scope="col" className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {carparks.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-slate-400">
                  No carparks match your current filter criteria.
                </td>
              </tr>
            ) : (
              carparks.map(cp => {
                const isFav = favorites.includes(cp.id);
                const lot = cp.lots[vehicleType];
                const occ = lot.total > 0 ? Math.round(((lot.total - lot.available) / lot.total) * 100) : 100;
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${cp.coordinates.lat},${cp.coordinates.lng}`;

                // Status coloring
                let occColor = 'text-emerald-600 dark:text-emerald-400 font-semibold';
                if (occ > 90) {
                  occColor = 'text-rose-600 dark:text-rose-400 font-semibold';
                } else if (occ > 70) {
                  occColor = 'text-amber-600 dark:text-amber-400 font-semibold';
                }

                return (
                  <tr
                    key={cp.id}
                    onClick={() => onSelectCarpark(cp)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    {/* Favorite bookmark */}
                    <td
                      className="px-4 py-3 text-center"
                      onClick={e => {
                        e.stopPropagation();
                        onToggleFavorite(cp.id);
                      }}
                    >
                      <button
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        className="text-slate-400 hover:text-amber-500"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>
                    </td>

                    {/* Carpark & code */}
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                          [{cp.carpark_number}]
                        </span>
                        <span className="truncate max-w-[220px]">{cp.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[240px]">
                        {cp.address}
                      </div>
                    </td>

                    {/* Agency & Type */}
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      <div>{cp.agency}</div>
                      <div className="text-[11px] text-slate-400">{cp.carpark_type}</div>
                    </td>

                    {/* Area & Region */}
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      <div>{cp.area}</div>
                      <div className="text-[11px] text-slate-400">{cp.region}</div>
                    </td>

                    {/* Available lots */}
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {lot.available}
                      </span>
                      <span className="text-slate-400 text-[11px]"> / {lot.total}</span>
                    </td>

                    {/* Occupancy % */}
                    <td className={`px-4 py-3 text-right tabular-nums ${occColor}`}>
                      {occ}%
                    </td>

                    {/* EV Plugs */}
                    <td className="px-4 py-3 text-center">
                      {cp.ev_charging.has_chargers ? (
                        <span className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 font-semibold tabular-nums">
                          <Zap className="w-3 h-3" />
                          <span>{cp.ev_charging.available_chargers}/{cp.ev_charging.total_chargers}</span>
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>

                    {/* Rate */}
                    <td className="px-4 py-3 tabular-nums">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        ${cp.rates.estimated_hourly.toFixed(2)}/hr
                      </div>
                      {cp.free_sunday_parking && (
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                          Free Sunday
                        </div>
                      )}
                    </td>

                    {/* Height */}
                    <td className="px-4 py-3 text-center tabular-nums text-slate-500">
                      {cp.height_limit_m}m
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Navigate via Google Maps"
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => onSelectCarpark(cp)}
                          title="View Details"
                          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
