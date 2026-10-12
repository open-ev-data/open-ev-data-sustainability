import { describe, expect, it } from 'vitest';
import { estimateCost } from './index';

const energy = {
  per100kmKwh: 16.5,
  perMonthKwh: 206.25,
  perYearKwh: 2475,
  energyNeededKwh: 48,
};

describe('estimateCost', () => {
  it('multiplies every energy figure by the user price', () => {
    const cost = estimateCost({ ...energy, pricePerKwh: 0.5 });
    expect(cost.per100km).toBeCloseTo(8.25, 5);
    expect(cost.perMonth).toBeCloseTo(103.125, 5);
    expect(cost.perYear).toBeCloseTo(1237.5, 5);
    expect(cost.perCharge).toBeCloseTo(24, 5);
  });

  it('returns null fields when the price is not informed', () => {
    expect(estimateCost({ ...energy, pricePerKwh: 0 })).toEqual({
      per100km: null,
      perMonth: null,
      perYear: null,
      perCharge: null,
    });
  });

  it('keeps unknown energy figures as null', () => {
    const cost = estimateCost({
      per100kmKwh: null,
      perMonthKwh: null,
      perYearKwh: null,
      energyNeededKwh: 48,
      pricePerKwh: 0.5,
    });
    expect(cost.per100km).toBeNull();
    expect(cost.perYear).toBeNull();
    expect(cost.perCharge).toBeCloseTo(24, 5);
  });
});
