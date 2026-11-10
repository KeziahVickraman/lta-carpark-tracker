import React, { useState } from 'react';
import { CarparkItem, VehicleType } from '../types/carpark';
import {
  X,
  Navigation,
  Zap,
  Bookmark,
  Clock,
  DollarSign,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Compass
} from 'lucide-react';

interface CarparkDetailModalProps {
  carpark: CarparkItem | null;
  onClose: () => void;
  vehicleType: VehicleType;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const CarparkDetailModal: React.FC<CarparkDetailModalProps> = ({
  carpark,
  onClose,
  vehicleType,
  isFavorite,
  onToggleFavorite
}) => {
  if (!carpark) return null;

  // Parking rate fee estimator state
  const [stayDurationHours, setStayDurationHours] = useState<number>(2);
  const [stayDurationMins, setStayDurationMins] = useState<number>(0);
  const [isSunday, setIsSunday] = useState<boolean>(false);

  const lotInfo = carpark.lots[vehicleType];
  const availLots = lotInfo.available;
  const totalLots = lotInfo.total;
  const occPct = totalLots > 0 ? Math.round(((totalLots - availLots) / totalLots) * 100) : 100;

  // Simple fee calculation
  const totalDurationMins = stayDurationHours * 60 + stayDurationMins;
  let estimatedFeeSGD = 0;

  if (totalDurationMins <= carpark.rates.grace_period_mins) {
    estimatedFeeSGD = 0; // Within grace period
  } else if (isSunday && carpark.free_sunday_parking) {
    estimatedFeeSGD = 0;
  } else {
    // Standard calculation approximation
    const blocksOf30 = Math.ceil(totalDurationMins / 30);
    const hourlyRate = carpark.rates.estimated_hourly;
    estimatedFeeSGD = parseFloat(((totalDurationMins / 60) * hourlyRate).toFixed(2));
  }

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${carpark.coordinates.lat},${carpark.coordinates.lng}`;
  const wazeUrl = `https://waze.com/ul?ll=${carpark.coordinates.lat},${carpark.coordinates.lng}&navigate=yes`;

  // 24hr congestion labels
  const hours = [
    '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11',
    '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 transition-all">
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-colors"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {carpark.carpark_number}
              </span>
              <span>·</span>
              <span>{carpark.agency}</span>
              <span>·</span>
              <span>{carpark.region} Region</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {carpark.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(carpark.id)}
              className="p-2 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-sm">
          {/* Key Lot Availability Hero */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  Live Available Lots ({vehicleType.toUpperCase()})
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
                    {availLots}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    lots vacant out of <span className="font-semibold text-slate-700 dark:text-slate-300 tabular-nums">{totalLots}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="text-xs text-slate-400">Occupancy</div>
                  <div className="text-xl font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                    {occPct}%
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
                <div>
                  <div className="text-xs text-slate-400">Clearance</div>
                  <div className="text-xl font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                    {carpark.height_limit_m}m
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle breakdown */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400">
              <div>
                <span className="text-slate-400">Cars: </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                  {carpark.lots.car.available} / {carpark.lots.car.total}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Motorcycle: </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                  {carpark.lots.motorcycle.available} / {carpark.lots.motorcycle.total}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Heavy: </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                  {carpark.lots.heavy.available} / {carpark.lots.heavy.total}
                </span>
              </div>
            </div>
          </div>

          {/* Multi-Storey Decks Breakdown */}
          {carpark.decks && carpark.decks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Deck & Level Availability Breakdown
                </h3>
              </div>

              <div className="space-y-2">
                {carpark.decks.map(deck => {
                  const deckPct = deck.total > 0 ? Math.round((deck.available / deck.total) * 100) : 0;
                  return (
                    <div
                      key={deck.level}
                      className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="w-32 font-medium text-slate-800 dark:text-slate-200">
                        {deck.level}
                      </div>

                      <div className="flex-1 mx-4">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all"
                            style={{ width: `${deckPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-right tabular-nums font-semibold text-slate-900 dark:text-white w-24">
                        {deck.available} / {deck.total} lots
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 24-Hour Historical Congestion Trend Chart */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  24-Hour Typical Congestion Profile
                </h3>
              </div>
              <span className="text-xs text-slate-400">Hourly Occupancy %</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-end justify-between gap-1 h-24 pt-4">
                {carpark.hourly_congestion_trend.map((val, idx) => {
                  const isCurrentHour = new Date().getHours() === idx;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      {/* Bar */}
                      <div
                        className={`w-full rounded-t-xs transition-all ${
                          isCurrentHour
                            ? 'bg-emerald-600 dark:bg-emerald-400'
                            : val > 80
                            ? 'bg-rose-400 dark:bg-rose-500'
                            : val > 50
                            ? 'bg-amber-400 dark:bg-amber-500'
                            : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                        style={{ height: `${val}%` }}
                      />

                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none z-20">
                        {hours[idx]}:00 - {val}%
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Time tick markers */}
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-mono">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:00</span>
              </div>
            </div>
          </div>

          {/* Pricing & Fee Estimator */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Official Parking Rates & Fee Estimator
              </h3>
            </div>

            {/* Rates table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-slate-400">Peak / Day:</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {carpark.rates.peak}
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-slate-400">Off-Peak / Night:</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {carpark.rates.off_peak}
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-slate-400">Sundays & Public Holidays:</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {carpark.rates.sunday_holiday}
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-slate-400">Grace Period:</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {carpark.rates.grace_period_mins} minutes (no charge if exit within)
                </div>
              </div>
            </div>

            {/* Quick Fee Estimator Tool */}
            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 rounded-lg">
              <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-300 mb-2">
                Estimate Parking Fee
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-600 dark:text-slate-300">Duration:</span>
                  <select
                    value={stayDurationHours}
                    onChange={e => setStayDurationHours(parseInt(e.target.value, 10))}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs"
                  >
                    {[0, 1, 2, 3, 4, 5, 8, 12].map(h => (
                      <option key={h} value={h}>{h} hrs</option>
                    ))}
                  </select>
                  <select
                    value={stayDurationMins}
                    onChange={e => setStayDurationMins(parseInt(e.target.value, 10))}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs"
                  >
                    {[0, 15, 30, 45].map(m => (
                      <option key={m} value={m}>{m} mins</option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSunday}
                    onChange={e => setIsSunday(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Sunday / PH</span>
                </label>

                <div className="ml-auto flex items-baseline gap-1 text-right">
                  <span className="text-xs text-slate-500">Estimated Cost:</span>
                  <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {estimatedFeeSGD === 0 ? 'FREE' : `~$${estimatedFeeSGD.toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* EV Charging Info (if present) */}
          {carpark.ev_charging.has_chargers && (
            <div className="p-4 bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-900/60 rounded-xl">
              <div className="flex items-center gap-2 text-sm font-bold text-teal-900 dark:text-teal-200 mb-2">
                <Zap className="w-4 h-4 text-teal-600" />
                <span>EV Fast Charging Station Available</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-teal-800 dark:text-teal-300">
                <div>
                  <span className="text-teal-600/80">Available Plugs: </span>
                  <span className="font-semibold tabular-nums">
                    {carpark.ev_charging.available_chargers} of {carpark.ev_charging.total_chargers}
                  </span>
                </div>
                <div>
                  <span className="text-teal-600/80">Operator: </span>
                  <span className="font-semibold">{carpark.ev_charging.operator}</span>
                </div>
                <div>
                  <span className="text-teal-600/80">Rated Speed: </span>
                  <span className="font-semibold">{carpark.ev_charging.speed}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <a
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Waze</span>
            </a>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Start Navigation</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
