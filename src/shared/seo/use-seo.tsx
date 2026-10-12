import { Helmet } from 'react-helmet-async';
import type { ReactElement } from 'react';
import { APP_CONSTANTS } from '@/shared/config/constants';

const { BASE_URL, NAME } = APP_CONSTANTS.SITE;

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  schema?: object | object[];
}

/**
 * Builds the meta tags for a page with react-helmet-async.
 *
 * @example
 * const seo = useSEO({ title: 'Home', description: '...', canonical: '/' });
 * return <>{seo}<main /></>;
 */
export function useSEO({
  title,
  description,
  canonical,
  image = '/og-image.png',
  type = 'website',
  schema,
}: SEOProps): ReactElement {
  const fullTitle = title === NAME ? title : `${title} | ${NAME}`;
  const fullUrl = canonical ? `${BASE_URL}${canonical === '/' ? '' : canonical}` : BASE_URL;
  const fullImage = image.startsWith('http') ? image : `${BASE_URL}${image}`;
  const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={fullUrl} />}

      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {schemas.map((item, index) => (
        <script key={`schema-${index}`} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
}
