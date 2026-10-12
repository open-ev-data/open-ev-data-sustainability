import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDuration, formatEnergy, formatPower } from './format';

describe('format helpers', () => {
  it('formats energy with fixed fraction digits', () => {
    expect(formatEnergy(2475)).toBe('2,475.0 kWh');
    expect(formatEnergy(16.5, 2)).toBe('16.50 kWh');
  });

  it('formats power without trailing zeros', () => {
    expect(formatPower(11)).toBe('11 kW');
    expect(formatPower(7.4)).toBe('7.4 kW');
  });

  it('formats durations in hours and minutes', () => {
    expect(formatDuration(0)).toBe('< 1 min');
    expect(formatDuration(0.75)).toBe('45 min');
    expect(formatDuration(2)).toBe('2 h');
    expect(formatDuration(4.3636)).toBe('4 h 22 min');
  });

  it('formats currency with configurable decimals', () => {
    expect(formatCurrency(1237.5, 'USD', 'en-US', 2)).toBe('$1,237.50');
    expect(formatCurrency(1237.5, 'USD')).toBe('$1,238');
  });
});
