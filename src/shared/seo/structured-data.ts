import type { WebApplication, Organization } from 'schema-dts';
import { APP_CONSTANTS } from '@/shared/config/constants';

const { BASE_URL, NAME, ORGANIZATION_URL } = APP_CONSTANTS.SITE;

/**
 * Generate Schema.org WebApplication schema for the home page.
 */
export function generateWebApplicationSchema(): WebApplication {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: NAME,
    url: BASE_URL,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    description:
      'Estimate energy consumption, charging time and running costs of electric vehicles using the OpenEV Data dataset.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  } as WebApplication;
}

/**
 * Generate Schema.org Organization schema.
 */
export function generateOrganizationSchema(): Organization {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OpenEV Data',
    url: ORGANIZATION_URL,
    sameAs: [ORGANIZATION_URL],
  } as Organization;
}
