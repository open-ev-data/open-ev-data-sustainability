import { API_ENDPOINTS } from '@/shared/config/env';
import type { VehicleDataset } from '../model/vehicle.types';

interface GitHubRelease {
  tag_name: string;
}

/**
 * Fetches the latest release tag from GitHub.
 */
export async function fetchLatestReleaseTag(): Promise<string> {
  const response = await fetch(API_ENDPOINTS.LATEST_RELEASE, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch latest release: ${response.statusText}`);
  }

  const data = (await response.json()) as GitHubRelease;
  return data.tag_name;
}

/**
 * Fetches the vehicle dataset for a specific release tag.
 * @param tag - Release tag (e.g. "v1.24.0")
 */
export async function fetchDataset(tag: string): Promise<VehicleDataset> {
  const response = await fetch(`${API_ENDPOINTS.DOWNLOAD_BASE}/${tag}/open-ev-data-${tag}.json`);

  if (!response.ok) {
    throw new Error(`Failed to download dataset for tag ${tag}: ${response.statusText}`);
  }

  return response.json();
}

async function fetchBundledDataset(): Promise<VehicleDataset | null> {
  const response = await fetch(`${import.meta.env.BASE_URL}dataset.json`);
  const isJson = response.headers.get('content-type')?.includes('json') ?? false;

  if (!response.ok || !isJson) return null;
  return response.json();
}

/**
 * Loads the latest vehicle dataset.
 *
 * In production the dataset is the `dataset.json` file bundled at build time,
 * so there is no runtime dependency on any API. In development the bundled
 * file is used when present, otherwise the latest release is fetched through
 * the Vite proxies.
 */
export async function fetchLatestVehicles(): Promise<VehicleDataset> {
  const bundled = await fetchBundledDataset();
  if (bundled) return bundled;

  if (import.meta.env.PROD) {
    throw new Error('Failed to load the bundled dataset');
  }

  const tag = await fetchLatestReleaseTag();
  return fetchDataset(tag);
}
