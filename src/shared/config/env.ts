/**
 * Environment configuration and type-safe environment variables.
 */

export const ENV = {
  GITHUB_API_URL: 'https://api.github.com',
  GITHUB_RAW_URL: 'https://github.com',
  REPO_OWNER: 'open-ev-data',
  REPO_NAME: 'open-ev-data-dataset',
} as const;

// Use proxy in development to avoid CORS issues
const isDev = import.meta.env.DEV;

export const API_ENDPOINTS = {
  LATEST_RELEASE: isDev
    ? `/api/github/repos/${ENV.REPO_OWNER}/${ENV.REPO_NAME}/releases/latest`
    : `${ENV.GITHUB_API_URL}/repos/${ENV.REPO_OWNER}/${ENV.REPO_NAME}/releases/latest`,
  DOWNLOAD_BASE: `/proxy-github-release/${ENV.REPO_OWNER}/${ENV.REPO_NAME}/releases/download`,
} as const;
