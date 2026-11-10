export type AgencyType = 'HDB' | 'LTA' | 'URA' | 'Commercial';
export type CarparkType = 'Multi-Storey (MSCP)' | 'Basement' | 'Surface' | 'Mechanised';
export type RegionType = 'Central' | 'East' | 'North' | 'North-East' | 'West';
export type VehicleType = 'car' | 'motorcycle' | 'heavy';

export interface LotCount {
  total: number;
  available: number;
}

export interface EVChargingInfo {
  has_chargers: boolean;
  total_chargers: number;
  available_chargers: number;
  operator: string;
  speed: 'AC 7.4kW' | 'AC 22kW' | 'DC 50kW' | 'DC 120kW Fast';
}

export interface CarparkDeck {
  level: string;
  available: number;
  total: number;
}

export interface CarparkRates {
  peak: string;
  off_peak: string;
  sunday_holiday: string;
  grace_period_mins: number;
  night_cap?: string;
  estimated_hourly: number; // in SGD
}

export interface CarparkItem {
  id: string;
  carpark_number: string;
  name: string;
  address: string;
  agency: AgencyType;
  carpark_type: CarparkType;
  region: RegionType;
  area: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  lots: {
    car: LotCount;
    motorcycle: LotCount;
    heavy: LotCount;
  };
  ev_charging: EVChargingInfo;
  rates: CarparkRates;
  height_limit_m: number;
  decks: CarparkDeck[];
  hourly_congestion_trend: number[]; // 24 values (00:00 to 23:00) in percentage
  updated_at: string;
  electronic_parking_system: boolean;
  free_sunday_parking: boolean;
  nearby_landmark: string;
  distance_km?: number;
}

export type SortOption = 'available' | 'occupancy' | 'distance' | 'rate' | 'name';
export type ViewMode = 'grid' | 'map' | 'table';

export interface CarparkFilterState {
  searchQuery: string;
  region: RegionType | 'All';
  agency: AgencyType | 'All';
  vehicleType: VehicleType;
  onlyEv: boolean;
  onlyFreeSunday: boolean;
  minAvailableLots: number;
  sortBy: SortOption;
  viewMode: ViewMode;
}

// Data.gov.sg official carpark availability API structure
export interface DataGovSgCarparkInfo {
  total_lots: string;
  lot_type: string; // 'C' (Car), 'H' (Heavy), 'Y' (Motorcycle)
  lots_available: string;
}

export interface DataGovSgItem {
  carpark_number: string;
  update_datetime: string;
  carpark_info: DataGovSgCarparkInfo[];
}

export interface DataGovSgResponse {
  items: Array<{
    timestamp: string;
    carpark_data: DataGovSgItem[];
  }>;
}
