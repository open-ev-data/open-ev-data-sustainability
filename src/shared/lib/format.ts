export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
  fractionDigits: number = 0
) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
};

export const formatNumber = (
  value: number,
  locale: string = 'en-US',
  options?: Intl.NumberFormatOptions
) => {
  return new Intl.NumberFormat(locale, options).format(value);
};

export const formatDistance = (km: number, unit: 'km' | 'mi' = 'km') => {
  return `${formatNumber(km)} ${unit}`;
};

export const formatPower = (kw: number) => {
  return `${formatNumber(kw, 'en-US', { maximumFractionDigits: 1 })} kW`;
};

export const formatEnergy = (kwh: number, fractionDigits: number = 1) => {
  return `${formatNumber(kwh, 'en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })} kWh`;
};

export const formatDuration = (hours: number) => {
  const totalMinutes = Math.round(hours * 60);
  if (totalMinutes < 1) return '< 1 min';

  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
};
