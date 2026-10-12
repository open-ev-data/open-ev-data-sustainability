const base = {
  schema_version: '1.0.0',
  vehicle_type: 'passenger_car',
  powertrain: { drivetrain: 'rwd' },
  sources: [],
};

export const E2E_DATASET = {
  schema_version: '1.0.0',
  generated_at: '2026-01-01T00:00:00Z',
  vehicle_count: 2,
  metadata: { etl_version: '1.0.0', dataset_commit: 'abc1234' },
  vehicles: [
    {
      ...base,
      unique_code: 'byd:dolphin:2024:extended',
      make: { slug: 'byd', name: 'BYD' },
      model: { slug: 'dolphin', name: 'Dolphin' },
      year: 2024,
      trim: { slug: 'extended', name: 'Extended Range' },
      battery: { chemistry: 'lfp', pack_capacity_kwh_net: 80, heat_pump: true },
      charging: {
        ac: { max_power_kw: 11 },
        dc: { max_power_kw: 150, architecture_voltage_class: '400v' },
      },
      v2x: { v2l: { supported: true, max_power_kw: 3.3 } },
      range: { rated: [{ cycle: 'wltp', range_km: 500 }] },
    },
    {
      ...base,
      unique_code: 'acme:city:2025:base',
      make: { slug: 'acme', name: 'Acme' },
      model: { slug: 'city', name: 'City' },
      year: 2025,
      trim: { slug: 'base', name: 'Base' },
      battery: { chemistry: 'nmc', pack_capacity_kwh_net: 40 },
      charging: { ac: { max_power_kw: 7.4 } },
      range: { rated: [{ cycle: 'cltc', range_km: 400 }] },
    },
  ],
};
