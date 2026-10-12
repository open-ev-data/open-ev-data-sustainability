/**
 * Global application constants.
 */

export const APP_CONSTANTS = {
  CACHE: {
    STALE_TIME_MS: 30 * 60 * 1000,
    GC_TIME_MS: 60 * 60 * 1000,
  },
  VEHICLE_COLORS: {
    HUE_SALT: 10,
  },
  SITE: {
    NAME: 'OpenEV Data Sustainability',
    BASE_URL: 'https://open-ev-data.github.io/open-ev-data-sustainability',
    EXPLORER_URL: 'https://open-ev-data.github.io/open-ev-data-ui/',
    ORGANIZATION_URL: 'https://github.com/open-ev-data',
    REPOSITORY_URL: 'https://github.com/open-ev-data/open-ev-data-sustainability',
  },
} as const;
