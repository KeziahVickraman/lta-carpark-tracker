import React from 'react';
import { CarparkItem, VehicleType } from '../types/carpark';
import { Bookmark, Navigation, Zap, ShieldCheck, ChevronRight, AlertCircle, ArrowUpRight } from 'lucide-react';

interface CarparkCardProps {
  carpark: CarparkItem;
  vehicleType: VehicleType;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (carpark: CarparkItem) => void;
}

export const CarparkCard: React.FC<CarparkCardProps> = ({
  carpark,
  vehicleType,
  isFavorite,
  onToggleFavorite,
  onSelect
}) => {
  const lotInfo = carpark.lots[vehicleType];
  const availLots = lotInfo.available;
  const totalLots = lotInfo.total;
  const occupancyPct = totalLots > 0 ? Math.round(((totalLots - availLots) / totalLots) * 100) : 100;
  const availPct = 100 - occupancyPct;

  // Status color determination
  let statusColor = 'text-emerald-600 dark:text-emerald-400';
  let progressBg = 'bg-emerald-500';
  let statusLabel = 'High Availability';

  if (availPct < 10) {
    statusColor = 'text-rose-600 dark:text-rose-400';
    progressBg = 'bg-rose-500';
    statusLabel = availLots === 0 ? 'Full' : 'Almost Full';
  } else if (availPct <= 30) {
    statusColor = 'text-amber-600 dark:text-amber-400';
    progressBg = 'bg-amber-500';
    statusLabel = 'Filling Fast';
  }

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${carpark.coordinates.lat},${carpark.coordinates.lng}`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group shadow-xs">
      <div>
        {/* Unboxed Header / Kicker */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
              [{carpark.carpark_number}]
            </span>
            <span aria-hidden="true">·</span>
            <span>{carpark.agency}</span>
            <span aria-hidden="true">·</span>
            <span>{carpark.area}</span>
          </div>

          <button
            onClick={e => {
              e.stopPropagation();
              onToggleFavorite(carpark.id);
            }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors p-1"
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelect(carpark)}
          className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors cursor-pointer"
        >
          {carpark.name}
        </h3>

        {/* Quiet Address & Specs */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
          {carpark.address}
        </p>

        {/* Unboxed Metadata Row */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-2.5">
          <span>{carpark.carpark_type}</span>
          <span aria-hidden="true">·</span>
          <span>Max {carpark.height_limit_m}m</span>
          {carpark.electronic_parking_system && (
            <>
              <span aria-hidden="true">·</span>
              <span>EPS Gantry</span>
            </>
          )}
          {carpark.free_sunday_parking && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Free Sunday (HDB)</span>
            </>
          )}
        </div>

        {/* Lot Availability Gauge */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
                {availLots}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                lots free of <span className="tabular-nums font-semibold">{totalLots}</span>
              </span>
            </div>

            <div className={`text-xs font-semibold ${statusColor} tabular-nums flex items-center gap-1`}>
              <span>{statusLabel}</span>
              <span className="text-[11px] font-normal text-slate-400">({occupancyPct}% full)</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full ${progressBg} transition-all duration-500 rounded-full`}
              style={{ width: `${Math.min(100, Math.max(2, availPct))}%` }}
            />
          </div>
        </div>

        {/* Secondary Info: Rates & EV */}
        <div className="mt-3.5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span className="text-slate-400 dark:text-slate-500">Day Rate:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[190px] text-right">
              {carpark.rates.peak}
            </span>
          </div>

          {carpark.ev_charging.has_chargers && (
            <div className="flex items-center justify-between text-teal-700 dark:text-teal-400">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>EV Charging ({carpark.ev_charging.operator}):</span>
              </span>
              <span className="font-semibold tabular-nums">
                {carpark.ev_charging.available_chargers}/{carpark.ev_charging.total_chargers} free
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Action Links */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={() => onSelect(carpark)}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          <span>Decks & Rates</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
        >
          <Navigation className="w-3.5 h-3.5 text-slate-500" />
          <span>Navigate</span>
          <ArrowUpRight className="w-3 h-3 text-slate-400" />
        </a>
      </div>
    </div>
  );
};
