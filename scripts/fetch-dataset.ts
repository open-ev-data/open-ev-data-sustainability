import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const OWNER = 'open-ev-data';
const REPO = 'open-ev-data-dataset';
const OUTPUT = resolve('public/dataset.json');

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface Release {
  tag_name: string;
  assets: ReleaseAsset[];
}

function authHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchLatestRelease(): Promise<Release> {
  const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`, {
    headers: { Accept: 'application/vnd.github+json', ...authHeaders() },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch latest release: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as Release;
}

function findDatasetAsset(release: Release): ReleaseAsset {
  const asset = release.assets.find((item) => /^open-ev-data-v.*\.json$/.test(item.name));

  if (!asset) {
    throw new Error(`No JSON dataset asset found in release ${release.tag_name}`);
  }

  return asset;
}

async function main() {
  const release = await fetchLatestRelease();
  const asset = findDatasetAsset(release);

  console.log(`Downloading ${asset.name} (${release.tag_name})`);

  const response = await fetch(asset.browser_download_url, { headers: authHeaders() });
  if (!response.ok) {
    throw new Error(`Failed to download dataset: ${response.status} ${response.statusText}`);
  }

  const body = await response.text();
  const parsed = JSON.parse(body) as { vehicles?: unknown[] };
  if (!Array.isArray(parsed.vehicles)) {
    throw new Error('Downloaded file is not a valid OpenEV dataset');
  }

  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, body);

  console.log(`Saved ${parsed.vehicles.length} vehicles to public/dataset.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
