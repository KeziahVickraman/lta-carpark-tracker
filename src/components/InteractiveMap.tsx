import React, { useState } from 'react';
import { CarparkItem, VehicleType, RegionType } from '../types/carpark';
import { Navigation, Zap, Layers, ZoomIn, ZoomOut, Maximize2, X, ChevronRight, Bookmark } from 'lucide-react';

interface InteractiveMapProps {
  carparks: CarparkItem[];
  vehicleType: VehicleType;
  selectedCarpark: CarparkItem | null;
  onSelectCarpark: (carpark: CarparkItem) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

// Convert Singapore GPS coordinate to SVG map coordinates
// Lat: 1.22 to 1.46, Lng: 103.65 to 104.02
function projectCoords(lat: number, lng: number): { x: number; y: number } {
  const minLng = 103.65;
  const maxLng = 104.02;
  const minLat = 1.23;
  const maxLat = 1.46;

  const x = ((lng - minLng) / (maxLng - minLng)) * 840 + 55;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 480 + 40;

  return { x: Math.round(x), y: Math.round(y) };
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  carparks,
  vehicleType,
  selectedCarpark,
  onSelectCarpark,
  favorites,
  onToggleFavorite
}) => {
  const [activeRegionFilter, setActiveRegionFilter] = useState<RegionType | 'All'>('All');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredPin, setHoveredPin] = useState<CarparkItem | null>(null);

  const filteredCarparks = carparks.filter(c =>
    activeRegionFilter === 'All' ? true : c.region === activeRegionFilter
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs relative transition-colors">
      {/* Map Header Toolbar */}
      <div className="p-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Singapore Real-Time Availability Radar
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            · {filteredCarparks.length} Active Gantries
          </span>
        </div>

        {/* Region Shortcuts */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(['All', 'Central', 'East', 'West', 'North', 'North-East'] as const).map(reg => (
            <button
              key={reg}
              onClick={() => setActiveRegionFilter(reg)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeRegionFilter === reg
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {reg === 'All' ? 'Island-Wide' : reg}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full overflow-hidden bg-slate-100/70 dark:bg-slate-950/80 min-h-[460px] sm:min-h-[540px] flex items-center justify-center p-2 sm:p-4">
        {/* SVG Graphic Map */}
        <svg
          viewBox="0 0 960 560"
          className="w-full h-auto max-h-[620px] transition-transform duration-300 select-none"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.15" />
            </filter>
            <linearGradient id="islandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" className="dark:stop-color-slate-800" />
              <stop offset="100%" stopColor="#cbd5e1" className="dark:stop-color-slate-850" />
            </linearGradient>
          </defs>

          {/* Water subtle grid texture */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148, 163, 184, 0.08)" strokeWidth="1" />
          </pattern>
          <rect width="960" height="560" fill="url(#grid)" />

          {/* Singapore Main Island Accurate Vector Silhouette */}
          <path
            d="M 120 310 
               C 100 280, 110 240, 140 210
               C 170 180, 220 150, 270 130
               C 330 110, 390 100, 460 95
               C 520 90, 590 110, 660 135
               C 720 160, 790 190, 850 230
               C 890 260, 910 290, 890 320
               C 860 350, 800 370, 730 380
               C 660 390, 600 395, 540 400
               C 490 405, 430 425, 380 430
               C 320 435, 270 420, 210 400
               C 160 380, 130 340, 120 310 Z"
            className="fill-slate-200/90 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700 transition-colors"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Jurong Island Outline */}
          <path
            d="M 140 410 C 130 395, 170 385, 200 405 C 220 425, 180 450, 150 440 Z"
            className="fill-slate-200/90 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700"
            strokeWidth="1.5"
          />

          {/* Sentosa Island Outline */}
          <path
            d="M 440 475 C 420 460, 480 455, 520 465 C 540 475, 500 495, 460 490 Z"
            className="fill-slate-200/90 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700"
            strokeWidth="1.5"
          />

          {/* Pulau Ubin Outline */}
          <path
            d="M 740 120 C 720 110, 770 100, 800 115 C 810 130, 760 135, 740 120 Z"
            className="fill-slate-200/90 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700"
            strokeWidth="1.5"
          />

          {/* Key Expressways lines (Subtle SG Traffic Arteries) */}
          <g className="opacity-40 dark:opacity-30 stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" fill="none">
            {/* PIE (Pan Island Expressway): Tuas to Changi */}
            <path d="M 160 330 Q 350 290 520 280 T 840 250" strokeDasharray="3 3" />
            {/* AYE (Ayer Rajah): Jurong to CBD */}
            <path d="M 180 370 Q 320 390 490 410" />
            {/* CTE (Central Expressway): Woodlands/AMK to CBD */}
            <path d="M 470 110 Q 480 250 490 410" />
            {/* ECP (East Coast Parkway): CBD to Changi Airport */}
            <path d="M 520 410 Q 680 390 850 280" />
          </g>

          {/* Region Label Watermarks (quiet, readable) */}
          <g className="text-[12px] font-bold fill-slate-400/60 dark:fill-slate-600 uppercase tracking-widest select-none pointer-events-none">
            <text x="470" y="140" textAnchor="middle">North</text>
            <text x="590" y="210" textAnchor="middle">North-East</text>
            <text x="490" y="340" textAnchor="middle">Central / CBD</text>
            <text x="760" y="270" textAnchor="middle">East Coast</text>
            <text x="250" y="310" textAnchor="middle">West</text>
            <text x="475" y="515" textAnchor="middle" className="text-[10px]">Sentosa</text>
          </g>

          {/* Carpark Pins */}
          {filteredCarparks.map(cp => {
            const { x, y } = projectCoords(cp.coordinates.lat, cp.coordinates.lng);
            const lot = cp.lots[vehicleType];
            const avail = lot.available;
            const total = lot.total;
            const isHovered = hoveredPin?.id === cp.id;
            const isSelected = selectedCarpark?.id === cp.id;

            // Color coding
            let fillBg = '#10b981'; // emerald
            let strokeColor = '#047857';

            if (avail < 15) {
              fillBg = '#ef4444'; // rose
              strokeColor = '#b91c1c';
            } else if (avail <= 45) {
              fillBg = '#f59e0b'; // amber
              strokeColor = '#b45309';
            }

            return (
              <g
                key={cp.id}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer group"
                onClick={() => onSelectCarpark(cp)}
                onMouseEnter={() => setHoveredPin(cp)}
                onMouseLeave={() => setHoveredPin(null)}
              >
                {/* Ping ring for selected or low availability */}
                {(isSelected || isHovered) && (
                  <circle
                    r="20"
                    fill="none"
                    stroke={fillBg}
                    strokeWidth="2"
                    className="animate-ping opacity-40"
                  />
                )}

                {/* Base Pin Circle */}
                <circle
                  r={isSelected ? '14' : isHovered ? '13' : '11'}
                  fill={fillBg}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                  filter="url(#shadow)"
                />

                {/* Inner lot number text */}
                <text
                  y="3.5"
                  textAnchor="middle"
                  fill="#ffffff"
                  className="text-[9px] font-bold tabular-nums pointer-events-none select-none font-mono"
                >
                  {avail > 999 ? `${Math.floor(avail / 1000)}k` : avail}
                </text>

                {/* Hover Label */}
                {(isHovered || isSelected) && (
                  <g transform="translate(0, -22)" className="pointer-events-none">
                    <rect
                      x="-70"
                      y="-18"
                      width="140"
                      height="22"
                      rx="4"
                      fill="#0f172a"
                      className="shadow-md"
                    />
                    <text
                      y="-4"
                      textAnchor="middle"
                      fill="#ffffff"
                      className="text-[10px] font-medium"
                    >
                      {cp.carpark_number}: {avail} lots ({cp.area})
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Map Controls Floating Widget */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm z-10">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))}
            title="Zoom in"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.85))}
            title="Zoom out"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            title="Reset zoom"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors text-[10px] font-bold"
          >
            1x
          </button>
        </div>

        {/* Selected Carpark Preview Card Overlay (Floating on Map) */}
        {selectedCarpark && (
          <div className="absolute top-4 left-4 max-w-xs sm:max-w-sm w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-lg z-20 transition-all">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {selectedCarpark.carpark_number}
                </span>
                <span>·</span>
                <span>{selectedCarpark.agency}</span>
                <span>·</span>
                <span>{selectedCarpark.area}</span>
              </div>
              <button
                onClick={() => onSelectCarpark(null as any)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              {selectedCarpark.name}
            </h4>

            {/* Lots Available display */}
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {selectedCarpark.lots[vehicleType].available}{' '}
                <span className="text-xs font-normal text-slate-500">
                  / {selectedCarpark.lots[vehicleType].total} {vehicleType} lots
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Clearance: {selectedCarpark.height_limit_m}m
              </span>
            </div>

            {/* Rate & EV quick specs */}
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between py-1 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Peak Rate:</span>
                <span className="font-medium text-right truncate max-w-[170px]">
                  {selectedCarpark.rates.peak}
                </span>
              </div>
              {selectedCarpark.ev_charging.has_chargers && (
                <div className="flex justify-between py-1 border-t border-slate-100 dark:border-slate-800 text-teal-600 dark:text-teal-400">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>EV Chargers:</span>
                  </span>
                  <span className="font-semibold tabular-nums">
                    {selectedCarpark.ev_charging.available_chargers} free ({selectedCarpark.ev_charging.speed})
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => onToggleFavorite(selectedCarpark.id)}
                className="p-1.5 text-slate-500 hover:text-amber-500 border border-slate-200 dark:border-slate-700 rounded-lg text-xs flex items-center gap-1"
              >
                <Bookmark className={`w-3.5 h-3.5 ${favorites.includes(selectedCarpark.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span className="hidden sm:inline">Save</span>
              </button>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCarpark.coordinates.lat},${selectedCarpark.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="p-3 sm:px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <span className="font-medium text-slate-700 dark:text-slate-300">Lot Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>&gt;45 Lots Free</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>15–45 Lots Free</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>&lt;15 Lots (Congested)</span>
          </span>
        </div>

        <div className="text-[11px] text-slate-400">
          Click any pin to inspect gantry status, level deck breakdown, and parking rates.
        </div>
      </div>
    </div>
  );
};
