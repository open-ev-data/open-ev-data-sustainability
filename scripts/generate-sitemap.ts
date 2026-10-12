import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'node:fs';
import { resolve } from 'node:path';

const BASE_URL = 'https://open-ev-data.github.io/open-ev-data-sustainability';

async function generateSitemap() {
  const sitemap = new SitemapStream({ hostname: BASE_URL });
  const writeStream = createWriteStream(resolve('./dist/sitemap.xml'));

  sitemap.pipe(writeStream);
  sitemap.write({
    url: '/',
    changefreq: 'weekly',
    priority: 1.0,
    lastmod: new Date().toISOString(),
  });
  sitemap.end();

  await streamToPromise(sitemap);
  console.log('Sitemap generated at dist/sitemap.xml');
}

generateSitemap().catch((error) => {
  console.error(error);
  process.exit(1);
});
