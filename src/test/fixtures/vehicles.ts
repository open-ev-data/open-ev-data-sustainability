import type { Vehicle, VehicleDataset } from '@/entities/vehicle';

export function createVehicle(overrides: Partial<Vehicle> = {}): Vehicle {
  return {
    schema_version: '1.0.0',
    unique_code: 'test:model:2024:base',
    make: { slug: 'test', name: 'Test' },
    model: { slug: 'model', name: 'Model' },
    year: 2024,
    trim: { slug: 'base', name: 'Base' },
    vehicle_type: 'passenger_car',
    powertrain: { drivetrain: 'rwd' },
    battery: { pack_capacity_kwh_net: 80, chemistry: 'nmc', heat_pump: true },
    charging: { ac: { max_power_kw: 11 }, dc: { max_power_kw: 150, architecture_voltage_class: '400v' } },
    range: { rated: [{ cycle: 'wltp', range_km: 500 }] },
    sources: [],
    ...overrides,
  };
}

export function createDataset(vehicles: Vehicle[]): VehicleDataset {
  return {
    schema_version: '1.0.0',
    generated_at: '2026-01-01T00:00:00Z',
    vehicle_count: vehicles.length,
    vehicles,
    metadata: { etl_version: '1.0.0', dataset_commit: 'abc1234' },
  };
}

export const SAMPLE_VEHICLES: Vehicle[] = [
  createVehicle(),
  createVehicle({
    unique_code: 'test:model:2024:long_range',
    trim: { slug: 'long_range', name: 'Long Range' },
    battery: { pack_capacity_kwh_net: 100 },
    v2x: { v2l: { supported: true, max_power_kw: 3.6 } },
  }),
  createVehicle({
    unique_code: 'acme:city:2025:base',
    make: { slug: 'acme', name: 'Acme' },
    model: { slug: 'city', name: 'City' },
    year: 2025,
    battery: { pack_capacity_kwh_net: 40 },
    charging: { ac: { max_power_kw: 7.4 } },
    range: { rated: [{ cycle: 'cltc', range_km: 400 }] },
  }),
];
