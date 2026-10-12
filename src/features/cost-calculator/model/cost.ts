export interface CostInput {
  per100kmKwh: number | null;
  perMonthKwh: number | null;
  perYearKwh: number | null;
  energyNeededKwh: number | null;
  pricePerKwh: number;
}

export interface CostEstimate {
  per100km: number | null;
  perMonth: number | null;
  perYear: number | null;
  perCharge: number | null;
}

const EMPTY_COST: CostEstimate = {
  per100km: null,
  perMonth: null,
  perYear: null,
  perCharge: null,
};

function priceOf(kwh: number | null, pricePerKwh: number): number | null {
  return kwh === null ? null : kwh * pricePerKwh;
}

/**
 * Converts energy figures into costs using the electricity price supplied by the user.
 * Every field is null when the price is missing or when its source energy is unknown.
 */
export function estimateCost(input: CostInput): CostEstimate {
  const { pricePerKwh } = input;
  if (!Number.isFinite(pricePerKwh) || pricePerKwh <= 0) return EMPTY_COST;

  return {
    per100km: priceOf(input.per100kmKwh, pricePerKwh),
    perMonth: priceOf(input.perMonthKwh, pricePerKwh),
    perYear: priceOf(input.perYearKwh, pricePerKwh),
    perCharge: priceOf(input.energyNeededKwh, pricePerKwh),
  };
}
