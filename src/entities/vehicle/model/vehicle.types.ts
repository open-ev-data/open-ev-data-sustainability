/**
 * TypeScript definitions for the OpenEV Data Schema.
 * Based on schema/reference_20260216.json
 */

export interface SlugName {
  slug: string;
  name: string;
}

export type VehicleType =
  | 'passenger_car'
  | 'suv'
  | 'pickup'
  | 'van'
  | 'bus'
  | 'motorcycle'
  | 'scooter'
  | 'commercial'
  | 'truck'
  | 'other';

export interface VehicleVariant {
  slug: string;
  name: string;
  kind?: string;
  notes?: string;
}

export interface Availability {
  status: 'production' | 'discontinued' | 'concept' | 'announced' | 'prototype';
  start_year?: number;
  end_year?: number;
  notes?: string;
}

export interface Body {
  style?: string;
  doors?: number;
  seats?: number;
  rows?: number;
  platform?: string;
  drag_coefficient_cd?: number;
}

export interface Dimensions {
  length_mm?: number;
  width_mm?: number;
  width_with_mirrors_mm?: number;
  height_mm?: number;
  wheelbase_mm?: number;
  ground_clearance_mm?: number;
  turning_circle_m?: number;
}

export interface Weights {
  curb_weight_kg?: number;
  gross_vehicle_weight_kg?: number;
  max_payload_kg?: number;
  roof_load_kg?: number;
}

export interface Capacity {
  cargo_l?: number;
  cargo_max_l?: number;
  frunk_l?: number;
  towing_braked_kg?: number;
  towing_unbraked_kg?: number;
  towing_vertical_load_kg?: number;
}

export interface Motor {
  position: 'front' | 'rear' | 'other';
  type?: string;
  power_kw?: number;
  torque_nm?: number;
  cooling?: string;
}

export interface Transmission {
  gears?: number;
  type?: string;
}

export interface Powertrain {
  drivetrain: 'fwd' | 'rwd' | 'awd' | '4wd';
  system_power_kw?: number;
  system_torque_nm?: number;
  motors?: Motor[];
  transmission?: Transmission;
}

export type ThermalManagement = 'liquid' | 'air' | 'passive' | 'refrigerant' | 'none';

export interface BatteryWarranty {
  years?: number;
  distance_km?: number;
  capacity_retention_percent?: number;
}

export interface Battery {
  manufacturer?: string;
  chemistry?: string;
  cathode_material?: string;
  pack_capacity_kwh_gross?: number;
  pack_capacity_kwh_net?: number;
  pack_voltage_nominal_v?: number;
  pack_voltage_max_v?: number;
  pack_voltage_min_v?: number;
  cell_count?: number;
  module_count?: number;
  thermal_management?: ThermalManagement;
  heat_pump?: boolean;
  preconditioning?: {
    supported: boolean;
    modes?: string[];
    notes?: string;
  };
  warranty?: BatteryWarranty;
  usable_soc_window_percent?: {
    min_percent?: number;
    max_percent?: number;
    notes?: string;
  };
}

export interface ChargePortLocation {
  side?: 'left' | 'right' | 'front' | 'rear' | 'center';
  position?: 'front' | 'rear' | 'mid';
  notes?: string;
}

export interface ChargePort {
  kind: 'ac_only' | 'dc_only' | 'combo';
  connector:
    | 'type1'
    | 'type2'
    | 'ccs1'
    | 'ccs2'
    | 'nacs'
    | 'chademo'
    | 'gb_t_ac'
    | 'gb_t_dc'
    | 'tesla_type2'
    | 'other';
  location?: ChargePortLocation;
  covers?: string;
  light?: boolean;
  motorized?: boolean;
  notes?: string;
}

export interface ChargingAC {
  max_power_kw: number;
  supported_power_steps_kw?: number[];
  phases?: 1 | 2 | 3;
  voltage_range_v?: {
    min_v?: number;
    max_v?: number;
  };
  frequency_hz?: number;
  max_current_a?: number;
  onboard_charger_count?: number;
  notes?: string;
}

export interface ChargingDC {
  max_power_kw: number;
  voltage_range_v?: {
    min_v?: number;
    max_v?: number;
  };
  max_current_a?: number;
  architecture_voltage_class?: '400v' | '800v' | 'other';
  power_limits_by_voltage?: {
    voltage_class: string;
    max_power_kw: number;
    notes?: string;
  }[];
  notes?: string;
}

export interface ChargingCurvePoint {
  soc_percent: number;
  power_kw?: number;
  current_a?: number;
  voltage_v?: number;
}

export interface ChargingConditions {
  battery_temp_c?: number;
  ambient_temp_c?: number;
  preconditioning?: boolean;
  charger_power_kw?: number;
  notes?: string;
}

export interface ChargingTimeEntry {
  power_kw?: number; // For AC
  charger_power_kw?: number; // For DC
  from_soc_percent: number;
  to_soc_percent: number;
  time_min: number;
  conditions?: ChargingConditions;
  notes?: string;
}

export interface Charging {
  ac?: ChargingAC;
  dc?: ChargingDC;
  protocols?: {
    ac?: string[];
    dc?: string[];
    plug_and_charge?: boolean;
    notes?: string;
  };
  dc_charge_curve?: {
    curve_type: 'power_by_soc' | 'current_by_soc';
    points: ChargingCurvePoint[];
    conditions?: ChargingConditions;
    source_url?: string;
    notes?: string;
  };
  charging_time?: {
    ac?: ChargingTimeEntry[];
    dc?: ChargingTimeEntry[];
  };
}

export interface RangeRealWorld {
  profile: 'highway' | 'city' | 'mixed' | 'cold_weather' | 'winter' | 'summer';
  range_km: number;
  conditions?: {
    weather?: string;
    speed_kmh?: number;
  };
  notes?: string;
}

export interface RangeRated {
  cycle: 'wltp' | 'epa' | 'nedc' | 'cltc' | 'jc08' | 'other';
  range_km: number;
  notes?: string;
}

export interface Range {
  rated: RangeRated[];
  real_world?: RangeRealWorld[]; // Optional in UI even if required in schema, to be safe
}

export interface Performance {
  acceleration_0_100_kmh_s?: number;
  acceleration_0_60_mph_s?: number;
  top_speed_kmh?: number;
  quarter_mile_s?: number;
}

export interface WheelsTires {
  standard_wheel_size_in?: number;
  optional_wheel_sizes_in?: number[];
  tire_sizes?: string[];
  recommended_pressure_kpa?: {
    front_kpa?: number;
    rear_kpa?: number;
  };
  notes?: string;
}

export interface Source {
  type: 'oem' | 'regulatory' | 'press' | 'community' | 'testing_org';
  title: string;
  publisher?: string;
  url?: string;
  accessed_at: string;
  license?: string;
  notes?: string;
}

export interface V2LOutlet {
  kind: string;
  count?: number;
  location?: string;
  notes?: string;
}

export interface V2L {
  supported: boolean;
  max_power_kw?: number;
  outlets?: V2LOutlet[];
  notes?: string;
}

export interface V2H {
  supported: boolean;
  max_power_kw?: number;
  connector?: string;
  protocols?: string[];
  notes?: string;
}

export interface V2G {
  supported: boolean;
  max_power_kw?: number;
  connector?: string;
  protocols?: string[];
  notes?: string;
}

export interface V2X {
  v2l?: V2L;
  v2h?: V2H;
  v2g?: V2G;
}

export interface Vehicle {
  schema_version: string;
  unique_code: string;
  make: SlugName;
  model: SlugName;
  year: number;
  trim: SlugName;
  variant?: VehicleVariant;
  markets?: string[];
  availability?: Availability;
  vehicle_type: VehicleType;
  body?: Body;
  dimensions?: Dimensions;
  weights?: Weights;
  capacity?: Capacity;
  powertrain: Powertrain;
  battery?: Battery;
  charge_ports?: ChargePort[];
  charging?: Charging;
  v2x?: V2X;
  range: Range;
  efficiency?: {
    energy_consumption_wh_per_km?: number;
    mpge?: number;
    notes?: string;
  };
  performance?: Performance;
  wheels_tires?: WheelsTires;
  // Intentionally omitting pricing as per field-visibility.ts choice, but keeping in type for completeness if needed?
  // Let's keep it optional to match schema flexibility
  pricing?: {
    msrp?: {
      currency: string;
      amount: number;
      country?: string;
      year?: number;
      notes?: string;
    }[];
  };
  software?: {
    os?: string;
    ota_supported?: boolean;
    notes?: string;
  };
  links?: {
    manufacturer_url?: string;
    press_kit_url?: string;
    spec_sheet_url?: string;
    configurator_url?: string;
  };
  images?: {
    exterior_url?: string;
    interior_url?: string;
    charging_curve_plot_url?: string;
  };
  sources: Source[];
  metadata?: {
    created_at?: string;
    updated_at?: string;
    contributors?: string[];
    data_quality?: string;
    internal_notes?: string;
  };
}

export interface VehicleDataset {
  schema_version: string;
  generated_at: string;
  vehicle_count: number;
  vehicles: Vehicle[];
  metadata: {
    etl_version: string;
    dataset_commit: string;
  };
}
