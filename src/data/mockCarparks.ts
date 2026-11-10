import { CarparkItem } from '../types/carpark';

export const INITIAL_CARPARKS: CarparkItem[] = [
  {
    id: 'sg-ion-orchard',
    carpark_number: 'ORCHARD_ION',
    name: 'ION Orchard Carpark',
    address: '2 Orchard Turn, Singapore 238801',
    agency: 'Commercial',
    carpark_type: 'Basement',
    region: 'Central',
    area: 'Orchard',
    coordinates: { lat: 1.3040, lng: 103.8319 },
    lots: {
      car: { total: 580, available: 64 },
      motorcycle: { total: 40, available: 12 },
      heavy: { total: 0, available: 0 }
    },
    ev_charging: {
      has_chargers: true,
      total_chargers: 8,
      available_chargers: 3,
      operator: 'SP Mobility',
      speed: 'DC 50kW'
    },
    rates: {
      peak: '$3.20 1st hr, $1.60/subseq 30m',
      off_peak: '$3.50 per entry (after 6pm)',
      sunday_holiday: '$3.50 1st 2hr, $1.60/subseq 30m',
      grace_period_mins: 15,
      estimated_hourly: 3.20
    },
    height_limit_m: 2.1,
    decks: [
      { level: 'Basement 3', available: 18, total: 290 },
      { level: 'Basement 4', available: 46, total: 290 }
    ],
    hourly_congestion_trend: [15, 10, 8, 5, 5, 12, 35, 60, 75, 88, 92, 95, 90, 88, 86, 92, 96, 98, 95, 85, 70, 50, 30, 20],
    updated_at: new Date().toISOString(),
    electronic_parking_system: true,
    free_sunday_parking: false,
    nearby_landmark: 'Orchard MRT & Wisma Atria',
    distance_km: 1.2
  },
  {
    id: 'sg-mbs-expo',
    carpark_number: 'MBS_01',
    name: 'Marina Bay Sands Expo & Convention',
    address: '10 Bayfront Ave, Singapore 018956',
    agency: 'Commercial',
    carpark_type: 'Basement',
    region: 'Central',
    area: 'Marina Bay',
    coordinates: { lat: 1.2834, lng: 103.8585 },
    lots: {
      car: { total: 950, available: 312 },
      motorcycle: { total: 60, available: 28 },
      heavy: { total: 10, available: 2 }
    },
    ev_charging: {
      has_chargers: true,
      total_chargers: 14,
      available_chargers: 6,
      operator: 'Shell Recharge',
      speed: 'DC 120kW Fast'
    },
    rates: {
      peak: '$4.00 1st hr, $1.50/subseq 30m',
      off_peak: '$12.00 cap 7pm-7am',
      sunday_holiday: '$4.00 1st hr, $1.50/subseq 30m',
      grace_period_mins: 10,
      night_cap: 'Max $12.00 overnight',
      estimated_hourly: 4.00
    },
    height_limit_m: 2.0,
    decks: [
      { level: 'Basement 1', available: 82, total: 320 },
      { level: 'Basement 2', available: 110, total: 330 },
      { level: 'Basement 3', available: 120, total: 300 }
    ],
    hourly_congestion_trend: [20, 15, 12, 10, 8, 15, 40, 65, 78, 82, 85, 80, 78, 82, 85, 90, 88, 85, 80, 75, 65, 50, 35, 25],
    updated_at: new Date().toISOString(),
    electronic_parking_system: true,
    free_sunday_parking: false,
    nearby_landmark: 'ArtScience Museum & The Shoppes',
    distance_km: 2.4
  },
  {
    id: 'sg-hdb-acb',
    carpark_number: 'ACB',
    name: 'Blk 210 Ang Mo Kio Ave 3 (MSCP)',
    address: 'Block 210 Ang Mo Kio Ave 3, Singapore 560210',
    agency: 'HDB',
    carpark_type: 'Multi-Storey (MSCP)',
    region: 'North-East',
    area: 'Ang Mo Kio',
    coordinates: { lat: 1.3695, lng: 103.8415 },
    lots: {
      car: { total: 420, available: 185 },
      motorcycle: { total: 80, available: 45 },
      heavy: { total: 0, available: 0 }
    },
    ev_charging: {
      has_chargers: true,
      total_chargers: 4,
      available_chargers: 2,
      operator: 'CDG ENGIE',
      speed: 'AC 22kW'
    },
    rates: {
      peak: '$0.60 per 30 mins (7am-5pm)',
      off_peak: '$0.60 per 30 mins (5pm-7am)',
      sunday_holiday: 'Free parking 7:30am - 10:30pm',
      grace_period_mins: 15,
      night_cap: 'Max $5.00 overnight',
      estimated_hourly: 1.20
    },
    height_limit_m: 2.15,
    decks: [
      { level: 'Deck 2', available: 22, total: 85 },
      { level: 'Deck 3', available: 38, total: 85 },
      { level: 'Deck 4', available: 55, total: 85 },
      { level: 'Deck 5 (Roof)', available: 70, total: 85 }
    ],
    hourly_congestion_trend: [80, 85, 88, 88, 85, 75, 50, 35, 30, 28, 30, 35, 32, 30, 35, 40, 55, 68, 75, 82, 85, 88, 85, 82],
    updated_at: new Date().toISOString(),
    electronic_parking_system: true,
    free_sunday_parking: true,
    nearby_landmark: 'Ang Mo Kio Town Centre & Central Park',
    distance_km: 7.8
  },
  {
    id: 'sg-hdb-tp1',
    carpark_number: 'TP1',
    name: 'Blk 123 Toa Payoh Lor 1 (MSCP)',
    address: 'Block 123 Toa Payoh Lorong 1, Singapore 310123',
    agency: 'HDB',
    carpark_type: 'Multi-Storey (MSCP)',
    region: 'Central',
    area: 'Toa Payoh',
    coordinates: { lat: 1.3328, lng: 103.8480 },
    lots: {
      car: { total: 360, available: 28 },
      motorcycle: { total: 50, available: 14 },
      heavy: { total: 0, available: 0 }
    },
    ev_charging: {
      has_chargers: true,
      total_chargers: 3,
      available_chargers: 1,
      operator: 'SP Mobility',
      speed: 'AC 7.4kW'
    },
    rates: {
      peak: '$0.60 per 30 mins',
      off_peak: '$0.60 per 30 mins',
      sunday_holiday: 'Free parking 7:30am - 10:30pm',
      grace_period_mins: 15,
      night_cap: 'Max $5.00 overnight',
      estimated_hourly: 1.20
    },
    height_limit_m: 2.1,
    decks: [
      { level: 'Deck 2', available: 2, total: 72 },
      { level: 'Deck 3', available: 6, total: 72 },
      { level: 'Deck 4', available: 8, total: 72 },
      { level: 'Deck 5 (Roof)', available: 12, total: 72 }
    ],
    hourly_congestion_trend: [85, 90, 92, 90, 85, 78, 60, 45, 40, 38, 42, 45, 42, 40, 48, 62, 75, 85, 92, 94, 96, 92, 88, 86],
    updated_at: new Date().toISOString(),
    electronic_parking_system: true,
    free_sunday_parking: true,
    nearby_landmark: 'Toa Payoh Central & Hub',
    distance_km: 4.1
  },
  {
    id: 'sg-vivocity',
    carpark_number: 'VIVO_01',
    name: 'VivoCity Shopping Centre',
    address: '1 HarbourFront Walk, Singapore 098585',
    agency: 'Commercial',
    carpark_type: 'Basement',
    region: 'Central',
    area: 'HarbourFront',
    coordinates: { lat: 1.2644, lng: 103.8222 },
    lots: {
      car: { total: 1200, available: 420 },
      motorcycle: { total: 120, available: 68 },
      heavy: { total: 15, available: 5 }
    },
    ev_charging: {
      has_chargers: true,
      total_chargers: 12,
      available_chargers: 5,
      operator: 'CDG ENGIE',
      speed: 'DC 50kW'
    },
    rates: {
      peak: '$2.00 1st hr, $0.60/subseq 15m',
      off_peak: '$3.50 per entry after 6pm',
      sunday_holiday: '$2.40 1st hr, $0.80/subseq 15m',
      grace_period_mins: 15,
      estimated_hourly: 2.40
    },
    height_limit_m: 2.0,
    decks: [
      { level: 'Basement 1', available: 95, total: 400 },
      { level: 'Basement 2', available: 160, total: 400 },
      { level: 'Multi-Storey L2', available: 165, total: 400 }
    ],
    hourly_congestion_trend: [10, 5, 5, 5, 5, 10, 25, 40, 55, 70, 85, 92, 88, 85, 86, 90, 94, 92, 85, 75, 55, 35, 20, 15],
    updated_at: new Date().toISOString(),
    electronic_parking_system: true,
    free_sunday_parking: false,
    nearby_landmark: 'Sentosa Express & HarbourFront Centre',
    distance_km: 3.9
  },
  {
    id: 'sg-sun-suntec',
    carpark_number: 'SUNTEC_01',
    name: 'Suntec City Mall & Convention',
    address: '3 Temasek Blvd, Singapore 038983',
    agency: 'Commercial',
    carpark_type: 'Basement',
    region: 'Central',
    area: 'Downtown/CBD',
    coordinates: { lat: 1.2935, lng: 103.8572 },
    lots: {
      car: { total: 3100, available: 840 },
      motorcycle: { total: 200, available: 95 },
      heavy: { total: 25, available: 8 }
    },
    ev_charging: {
      has_chargers: true,
      total_chargers: 20,
      available_chargers: 9,
      operator: 'SP Mobility',
      speed: 'DC 50kW'
    },
    rates: {
      peak: '$2.60 1st hr, $0.80/subseq 15m',
      off_peak: '$3.20 per entry after 5pm',
      sunday_holiday: '$3.20 per entry all day',
      grace_period_mins: 10,
      estimated_hourly: 2.60
    },
    height_limit_m: 2.0,
    decks: [
      { level: 'Red Zone B1', available: 210, total: 750 },
      { level: 'Yellow Zone B1', available: 190, total: 750 },
      { level: 'Blue Zone B1', available: 230, total: 800 },
      { level: 'Green Zone B1', available: 210, total: 800 }
    ],
    hourly_congestion_trend: [15, 10, 10, 8, 8, 20, 55, 80, 88, 90, 86, 85, 80, 78, 82, 85, 80, 72, 60, 45, 30, 20, 15, 12],
    updated_at: new Date().toISOString(),
    electronic_parking_system: true,
    free_sunday_parking: false,
    nearby_landmark: 'Fountain of Wealth & Esplanade',
    distance_km: 1.9
  },
  {
    id: 'sg-ura-telok-ayer',
    carpark_number: 'URA_TA',
    name: 'Telok Ayer Street (Off-Street)',
    address: 'Telok Ayer Street / Amoy St, Singapore 068625',
    agency: 'URA',
    carpark_type: 'Surface',
    region: 'Central',
    area: 'Downtown/CBD',
    coordinates: { lat: 1.2805, lng: 103.8485 },
    lots: {
      car: { total: 75, available: 4 },
      motorcycle: { total: 20, available: 3 },
      heavy: { total: 0, available: 0 }
    },
    ev_charging: {
      has_chargers: false,
      total_chargers: 0,
      available_chargers: 0,
      operator: 'None',
      speed: 'AC 7.4kW'
    },
    rates: {
      peak: '$1.40 per 30 mins (CBD Central Zone)',
      off_peak: '$0.80 per 30 mins (after 5pm)',
      sunday_holiday: '$0.80 per 30 mins',
      grace_period_mins: 10,
      estimated_hourly: 2.80
    },
    height_limit_m: 4.5,
    decks: [
      { level: 'Ground Surface', available: 4, total: 75 }
    ],
    hourly_congestion_trend: [10, 5, 2, 2, 5, 25, 75, 95, 98, 98, 96, 98, 95, 94, 95, 96, 92, 85, 70, 50, 30, 20, 15, 10],
    updated_at: new Date().toISOString(),
    electronic_parking_system: true,
    free_sunday_parking: false,
    nearby_landmark: 'Lau Pa Sat & Thian Hock Keng Temple',
    distance_km: 1.6
  },
  {
    id: 'sg-lta-chinatown',
    carpark_number: 'CKC',
    name: 'Chinatown Complex MSCP',
    address: '335 Smith Street, Singapore 050335',
    agency: 'HDB',
    carpark_type: 'Multi-Storey (MSCP)',
    region: 'Central',
    area: 'Chinatown',
    coordinates: { lat: 1.2828, lng: 103.8432 },
    lots: {
      car: { total: 320, available: 16 },
      motorcycle: { total: 70, available: 18 },
      heavy: { total: 0, available: 0 }
    },
    ev_charging: {
      has_chargers: true,
      total_chargers: 4,
      available_chargers: 0,
      operator: 'SP Mobility',
      speed: 'AC 22kW'
    },
    rates: {
      peak: '$1.40 per 30 mins (Central Area)',
      off_peak: '$0.80 per 30 mins (after 5pm)',
      sunday_holiday: 'Free 7:30am - 10:30pm',
      grace_period_mins: 15,
      night_cap: 'Max $5.00 overnight',
      estimated_hourly: 2.80
    },
    height_limit_m: 1.95,
    decks: [
      { level: 'Level 2', available: 2, total: 80 },
      { level: 'Level 3', available: 4, total: 80 },
      { level: 'Level 4', available: 3, total: 80 },
      { level: 'Level 5 (Roof)', available: 7, total: 80 }
    ],
    hourly_congestion_trend: [40, 30, 25, 20, 20, 30, 60, 85, 95, 98, 96, 98, 96, 94, 92, 95, 92, 88, 80, 65, 50, 45, 42, 40],
    updated_at: new Date().toISOString(),
    electronic_parking_system: true,
    free_sunday_parking: true,
    nearby_landmark: 'Chinatown Hawker & Buddha Tooth Relic Temple',
    distance_km: 1.8
  },
  {
    id: 'sg-hdb-tam-hub',
    carpark_number: 'TM3',
    name: 'Tampines Central Hub MSCP',
    address: '1 Tampines Walk, Singapore 528523',
    agency: 'HDB',
    carpark_type: 'Multi-Storey (MSCP)',
    region: 'East',
    area: 'Tampines',
    coordinates: { lat: 1.3533, lng: 103.9405 },
    lots: {
      car: { total: 680, available: 245 },
      motorcycle: { total: 110, available: 62 },
      heavy: { total: 0, available: 0 }
    },
    ev_charging: {
      has_chargers: true,
      total_chargers: 8,
      available_chargers: 4,
      operator: 'CDG ENGIE',
      speed: 'DC 50kW'
    },
    rates: {
      peak: '$0.60 per 30 mins',
      off_peak: '$0.60 per 30 mins',
      sunday_holiday: 'Free parking 7:30am - 10:30pm',
      grace_period_mins: 15,
      night_cap: 'Max $5.00 overnight',
      estimated_hourly: 1.20
    },
    height_limit_m: 2.15,
    decks: [
      { level: 'Deck 1', available: 15, total: 170 },
      { level: 'Deck 2', available: 45, total: 170 },
      { level: 'Deck 3', available: 85, total: 170 },
      { level: 'Deck 4 (Roof)', available: 100, total: 170 }
    ],
    hourly_congestion_trend: [75, 80, 85, 85, 80, 70, 50, 40, 45, 52, 60, 65, 62, 58, 60, 65, 75, 80, 85, 88, 85, 80, 78, 75],
    updated_at: new Date().toISOString(),
    electronic_parking_system: true,
    free_sunday_parking: true,
    nearby_landmark: 'Our Tampines Hub & Tampines Mall',
    distance_km: 12.5
  },
  {
    id: 'sg-changi-jewel',
    carpark_number: 'CHANGI_JWL',
    name: 'Jewel Changi Airport (Carpark B3-B5)',
    address: '78 Airport Blvd, Singapore 819666',
    agency: 'Commercial',
    carpark_type: 'Basement',
    region: 'East',
    area: 'Changi',
    coordinates: { lat: 1.3602, lng: 103.9897 },
    lots: {
      car: { total: 2500, available: 1180 },
      motorcycle: { total: 150, available: 82 },
      heavy: { total: 20, available: 10 }
    },
    ev_charging: {
      has_chargers: true,
      total_chargers: 16,
      available_chargers: 8,
      operator: 'Shell Recharge',
      speed: 'DC 120kW Fast'
    },
    rates: {
      peak: '$0.04 per min (first 90 mins)',
      off_peak: '$5.00 per 30 mins (after 90 mins)',
      sunday_holiday: 'Standard rate applies',
      grace_period_mins: 10,
      night_cap: 'Max $57.60 / 24 hrs',
      estimated_hourly: 2.40
    },
    height_limit_m: 2.1,
    decks: [
      { level: 'Basement 3', available: 320, total: 800 },
      { level: 'Basement 4', available: 410, total: 850 },
      { level: 'Basement 5', available: 450, total: 850 }
    ],
    hourly_congestion_trend: [30, 25, 20, 18, 20, 30, 45, 55, 60, 68, 75, 78, 74, 72, 75, 80, 82, 80, 75, 68, 55, 45, 40, 35],
    updated_at: new Date().toISOString(),
    electronic_parking_system: true,
    free_sunday_parking: false,
    nearby_landmark: 'HSBC Rain Vortex & Terminal 1',
    distance_km: 17.2
  },
  {
    id: 'sg-jurong-point',
    carpark_number: 'JP_01',
    name: 'Jurong Point Shopping Centre',
    address: '1 Jurong West Central 2, Singapore 648886',
    agency: 'Commercial',
    carpark_type: 'Basement',
    region: 'West',
    area: 'Jurong',
    coordinates: { lat: 1.3403, lng: 103.7064 },
    lots: {
      car: { total: 1150, available: 310 },
      motorcycle: { total: 100, available: 45 },
      heavy: { total: 10, available: 4 }
    },
    ev_charging: {
      has_chargers: true,
      total_chargers: 6,
      available_chargers: 2,
      operator: 'SP Mobility',
      speed: 'AC 22kW'
    },
    rates: {
      peak: '$1.40 1st hr, $0.70/subseq 30m',
      off_peak: '$2.50 per entry after 5pm',
      sunday_holiday: '$2.20 1st 2hr, $0.80/subseq 30m',
      grace_period_mins: 15,
      estimated_hourly: 1.40
    },
    height_limit_m: 1.9,
    decks: [
      { level: 'Basement 1', available: 75, total: 380 },
      { level: 'Basement 2', available: 110, total: 380 },
      { level: 'Basement 3', available: 125, total: 390 }
    ],
    hourly_congestion_trend: [15, 10, 8, 5, 5, 15, 35, 55, 68, 78, 88, 92, 88, 85, 88, 92, 95, 92, 85, 75, 55, 35, 25, 18],
    updated_at: new Date().toISOString(),
    electronic_parking_system: true,
    free_sunday_parking: false,
    nearby_landmark: 'Boon Lay MRT & Bus Interchange',
    distance_km: 16.5
  },
  {
    id: 'sg-hdb-jld',
    carpark_number: 'JE12',
    name: 'Blk 135 Jurong Gateway Rd (MSCP)',
    address: 'Block 135 Jurong Gateway Road, Singapore 600135',
    agency: 'HDB',
    carpark_type: 'Multi-Storey (MSCP)',
    region: 'West',
    area: 'Jurong',
    coordinates: { lat: 1.3345, lng: 103.7432 },
    lots: {
      car: { total: 450, available: 92 },
      motorcycle: { total: 60, available: 32 },
      heavy: { total: 0, available: 0 }
    },
    ev_charging: {
      has_chargers: true,
      total_chargers: 4,
      available_chargers: 3,
      operator: 'CDG ENGIE',
      speed: 'AC 7.4kW'
    },
    rates: {
      peak: '$0.60 per 30 mins',
      off_peak: '$0.60 per 30 mins',
      sunday_holiday: 'Free parking 7:30am - 10:30pm',
      grace_period_mins: 15,
      night_cap: 'Max $5.00 overnight',
      estimated_hourly: 1.20
    },
    height_limit_m: 2.1,
    decks: [
      { level: 'Deck 2', available: 12, total: 90 },
      { level: 'Deck 3', available: 20, total: 90 },
      { level: 'Deck 4', available: 28, total: 90 },
      { level: 'Deck 5 (Roof)', available: 32, total: 90 }
    ],
    hourly_congestion_trend: [80, 85, 88, 88, 82, 70, 48, 40, 42, 50, 62, 70, 68, 65, 70, 78, 82, 85, 88, 90, 88, 85, 82, 80],
    updated_at: new Date().toISOString(),
    electronic_parking_system: true,
    free_sunday_parking: true,
    nearby_landmark: 'JEM & Westgate Shopping Malls',
    distance_km: 13.8
  },
  {
    id: 'sg-woodlands-civic',
    carpark_number: 'WDL_CIV',
    name: 'Woodlands Civic Centre Basement',
    address: '900 South Woodlands Drive, Singapore 730900',
    agency: 'URA',
    carpark_type: 'Basement',
    region: 'North',
    area: 'Woodlands',
    coordinates: { lat: 1.4360, lng: 103.7865 },
    lots: {
      car: { total: 380, available: 142 },
      motorcycle: { total: 45, available: 24 },
      heavy: { total: 0, available: 0 }
    },
    ev_charging: {
      has_chargers: true,
      total_chargers: 4,
      available_chargers: 2,
      operator: 'SP Mobility',
      speed: 'AC 22kW'
    },
    rates: {
      peak: '$0.60 per 30 mins',
      off_peak: '$0.60 per 30 mins',
      sunday_holiday: '$0.60 per 30 mins',
      grace_period_mins: 15,
      night_cap: 'Max $5.00 overnight',
      estimated_hourly: 1.20
    },
    height_limit_m: 2.05,
    decks: [
      { level: 'Basement 1', available: 58, total: 190 },
      { level: 'Basement 2', available: 84, total: 190 }
    ],
    hourly_congestion_trend: [60, 65, 70, 70, 65, 55, 45, 50, 65, 72, 78, 75, 70, 68, 72, 78, 80, 82, 78, 70, 62, 58, 55, 58],
    updated_at: new Date().toISOString(),
    electronic_parking_system: true,
    free_sunday_parking: false,
    nearby_landmark: 'Causeway Point & Woodlands MRT',
    distance_km: 18.0
  },
  {
    id: 'sg-hdb-bishan',
    carpark_number: 'BS14',
    name: 'Blk 512 Bishan St 13 (MSCP)',
    address: 'Block 512 Bishan Street 13, Singapore 570512',
    agency: 'HDB',
    carpark_type: 'Multi-Storey (MSCP)',
    region: 'Central',
    area: 'Bishan',
    coordinates: { lat: 1.3508, lng: 103.8502 },
    lots: {
      car: { total: 510, available: 178 },
      motorcycle: { total: 70, available: 38 },
      heavy: { total: 0, available: 0 }
    },
    ev_charging: {
      has_chargers: true,
      total_chargers: 6,
      available_chargers: 4,
      operator: 'CDG ENGIE',
      speed: 'AC 22kW'
    },
    rates: {
      peak: '$0.60 per 30 mins',
      off_peak: '$0.60 per 30 mins',
      sunday_holiday: 'Free parking 7:30am - 10:30pm',
      grace_period_mins: 15,
      night_cap: 'Max $5.00 overnight',
      estimated_hourly: 1.20
    },
    height_limit_m: 2.15,
    decks: [
      { level: 'Deck 1', available: 14, total: 102 },
      { level: 'Deck 2', available: 32, total: 102 },
      { level: 'Deck 3', available: 44, total: 102 },
      { level: 'Deck 4', available: 42, total: 102 },
      { level: 'Deck 5 (Roof)', available: 46, total: 102 }
    ],
    hourly_congestion_trend: [78, 82, 85, 85, 80, 72, 45, 38, 42, 50, 58, 62, 58, 55, 60, 68, 75, 80, 85, 88, 85, 82, 80, 78],
    updated_at: new Date().toISOString(),
    electronic_parking_system: true,
    free_sunday_parking: true,
    nearby_landmark: 'Junction 8 & Bishan Stadium',
    distance_km: 6.2
  },
  {
    id: 'sg-bugis-plus',
    carpark_number: 'BUGIS_P',
    name: 'Bugis+ Multi-Storey Carpark',
    address: '201 Victoria Street, Singapore 188067',
    agency: 'Commercial',
    carpark_type: 'Multi-Storey (MSCP)',
    region: 'Central',
    area: 'Bugis',
    coordinates: { lat: 1.3007, lng: 103.8546 },
    lots: {
      car: { total: 325, available: 42 },
      motorcycle: { total: 50, available: 19 },
      heavy: { total: 0, available: 0 }
    },
    ev_charging: {
      has_chargers: true,
      total_chargers: 4,
      available_chargers: 1,
      operator: 'SP Mobility',
      speed: 'DC 50kW'
    },
    rates: {
      peak: '$2.00 1st hr, $0.60/subseq 15m',
      off_peak: '$3.50 per entry after 6pm',
      sunday_holiday: '$3.50 1st 2hr, $0.60/subseq 15m',
      grace_period_mins: 15,
      estimated_hourly: 2.00
    },
    height_limit_m: 2.0,
    decks: [
      { level: 'Level 5', available: 8, total: 108 },
      { level: 'Level 6', available: 14, total: 108 },
      { level: 'Level 7', available: 20, total: 109 }
    ],
    hourly_congestion_trend: [25, 18, 15, 12, 10, 15, 30, 50, 68, 80, 88, 92, 90, 88, 90, 94, 96, 95, 90, 82, 70, 55, 40, 30],
    updated_at: new Date().toISOString(),
    electronic_parking_system: true,
    free_sunday_parking: false,
    nearby_landmark: 'Bugis Junction & National Library',
    distance_km: 1.5
  },
  {
    id: 'sg-hdb-bedok',
    carpark_number: 'BM2',
    name: 'Blk 208 Bedok North St 1 (MSCP)',
    address: 'Block 208 Bedok North Street 1, Singapore 460208',
    agency: 'HDB',
    carpark_type: 'Multi-Storey (MSCP)',
    region: 'East',
    area: 'Bedok',
    coordinates: { lat: 1.3255, lng: 103.9312 },
    lots: {
      car: { total: 490, available: 165 },
      motorcycle: { total: 75, available: 32 },
      heavy: { total: 0, available: 0 }
    },
    ev_charging: {
      has_chargers: true,
      total_chargers: 4,
      available_chargers: 3,
      operator: 'CDG ENGIE',
      speed: 'AC 22kW'
    },
    rates: {
      peak: '$0.60 per 30 mins',
      off_peak: '$0.60 per 30 mins',
      sunday_holiday: 'Free parking 7:30am - 10:30pm',
      grace_period_mins: 15,
      night_cap: 'Max $5.00 overnight',
      estimated_hourly: 1.20
    },
    height_limit_m: 2.15,
    decks: [
      { level: 'Deck 2', available: 25, total: 122 },
      { level: 'Deck 3', available: 38, total: 122 },
      { level: 'Deck 4', available: 48, total: 123 },
      { level: 'Deck 5 (Roof)', available: 54, total: 123 }
    ],
    hourly_congestion_trend: [82, 85, 88, 88, 85, 75, 48, 38, 42, 50, 58, 62, 58, 55, 60, 68, 76, 82, 86, 90, 88, 85, 82, 80],
    updated_at: new Date().toISOString(),
    electronic_parking_system: true,
    free_sunday_parking: true,
    nearby_landmark: 'Bedok Mall & Heartbeat@Bedok',
    distance_km: 10.8
  },
  {
    id: 'sg-sentosa-beach',
    carpark_number: 'SENTOSA_BCH',
    name: 'Sentosa Beach Station Carpark',
    address: '50 Beach View, Sentosa, Singapore 098604',
    agency: 'Commercial',
    carpark_type: 'Basement',
    region: 'Central',
    area: 'HarbourFront',
    coordinates: { lat: 1.2514, lng: 103.8188 },
    lots: {
      car: { total: 450, available: 210 },
      motorcycle: { total: 40, available: 25 },
      heavy: { total: 8, available: 3 }
    },
    ev_charging: {
      has_chargers: true,
      total_chargers: 6,
      available_chargers: 4,
      operator: 'SP Mobility',
      speed: 'AC 22kW'
    },
    rates: {
      peak: '$1.20 per 4-hour block (7am-5pm)',
      off_peak: '$2.40 per entry (5pm-7am)',
      sunday_holiday: '$1.20 per 4-hour block',
      grace_period_mins: 15,
      estimated_hourly: 0.60
    },
    height_limit_m: 2.2,
    decks: [
      { level: 'Basement 1', available: 95, total: 225 },
      { level: 'Basement 2', available: 115, total: 225 }
    ],
    hourly_congestion_trend: [10, 5, 2, 2, 2, 5, 12, 25, 45, 65, 80, 85, 88, 85, 82, 80, 78, 70, 55, 40, 25, 18, 12, 10],
    updated_at: new Date().toISOString(),
    electronic_parking_system: true,
    free_sunday_parking: false,
    nearby_landmark: 'Siloso Beach & Wings of Time',
    distance_km: 6.5
  },
  {
    id: 'sg-great-world',
    carpark_number: 'GWC_01',
    name: 'Great World City Basement',
    address: '1 Kim Seng Promenade, Singapore 237994',
    agency: 'Commercial',
    carpark_type: 'Basement',
    region: 'Central',
    area: 'Orchard',
    coordinates: { lat: 1.2931, lng: 103.8322 },
    lots: {
      car: { total: 600, available: 195 },
      motorcycle: { total: 50, available: 28 },
      heavy: { total: 0, available: 0 }
    },
    ev_charging: {
      has_chargers: true,
      total_chargers: 8,
      available_chargers: 5,
      operator: 'CDG ENGIE',
      speed: 'DC 50kW'
    },
    rates: {
      peak: '$2.00 1st hr, $0.60/subseq 15m',
      off_peak: '$3.50 per entry after 6pm',
      sunday_holiday: '$2.20 1st hr, $0.60/subseq 15m',
      grace_period_mins: 15,
      estimated_hourly: 2.00
    },
    height_limit_m: 1.95,
    decks: [
      { level: 'Basement 2', available: 85, total: 300 },
      { level: 'Basement 3', available: 110, total: 300 }
    ],
    hourly_congestion_trend: [15, 10, 8, 5, 5, 10, 25, 45, 60, 72, 82, 88, 85, 82, 84, 88, 90, 88, 80, 68, 48, 30, 20, 15],
    updated_at: new Date().toISOString(),
    electronic_parking_system: true,
    free_sunday_parking: false,
    nearby_landmark: 'Great World MRT & Singapore River',
    distance_km: 2.1
  }
];

export const SG_DESTINATIONS = [
  {
    name: 'Marina Bay Sands & ArtScience',
    area: 'Marina Bay',
    coordinates: { lat: 1.2834, lng: 103.8585 },
    recommendedCarparkIds: ['sg-mbs-expo', 'sg-sun-suntec', 'sg-ura-telok-ayer']
  },
  {
    name: 'Orchard Road Shopping District',
    area: 'Orchard',
    coordinates: { lat: 1.3040, lng: 103.8319 },
    recommendedCarparkIds: ['sg-ion-orchard', 'sg-great-world', 'sg-bugis-plus']
  },
  {
    name: 'Chinatown Food Street & Temple',
    area: 'Chinatown',
    coordinates: { lat: 1.2828, lng: 103.8432 },
    recommendedCarparkIds: ['sg-lta-chinatown', 'sg-ura-telok-ayer', 'sg-vivocity']
  },
  {
    name: 'Jewel & Changi Airport Terminals',
    area: 'Changi',
    coordinates: { lat: 1.3602, lng: 103.9897 },
    recommendedCarparkIds: ['sg-changi-jewel', 'sg-hdb-tam-hub', 'sg-hdb-bedok']
  },
  {
    name: 'Sentosa & Resorts World',
    area: 'HarbourFront',
    coordinates: { lat: 1.2580, lng: 103.8200 },
    recommendedCarparkIds: ['sg-vivocity', 'sg-sentosa-beach', 'sg-lta-chinatown']
  },
  {
    name: 'Jurong Gateway & JEM/Westgate',
    area: 'Jurong',
    coordinates: { lat: 1.3345, lng: 103.7432 },
    recommendedCarparkIds: ['sg-hdb-jld', 'sg-jurong-point', 'sg-hdb-acb']
  }
];
