import { Helmet } from 'react-helmet-async';

// ===== BRAND CONSTANTS =====
const SITE_NAME = 'Xone AI';
const PRODUCT_NAME = 'MonsterX AI';
const BASE_URL = 'https://www.xoneai.in';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const TWITTER_HANDLE = '@xoneai'; // apna handle daalein

// ===== DEFAULT SCHEMAS (Organization + Website + SoftwareApp) =====
const organizationSchema = {
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: SITE_NAME,
  url: BASE_URL,
  logo: { '@type': 'ImageObject', url: DEFAULT_IMAGE },
  description: `${SITE_NAME} is the company behind ${PRODUCT_NAME}, a powerful AI assistant.`,
  sameAs: [
    'https://twitter.com/xoneai',
    'https://www.linkedin.com/company/xoneai',
    'https://github.com/xoneai',
  ],
};

const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: PRODUCT_NAME,
  publisher: { '@id': `${BASE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const softwareAppSchema = {
  '@type': 'SoftwareApplication',
  name: PRODUCT_NAME,
  applicationCategory: 'AIApplication',
  operatingSystem: 'Web',
  url: BASE_URL,
  image: DEFAULT_IMAGE,
  description: `${PRODUCT_NAME} is a powerful AI assistant by ${SITE_NAME} for chat, image generation, and smart content.`,
  publisher: { '@id': `${BASE_URL}/#organization` },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
  },
};

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  robots?: string;
  type?: string;
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  /** Custom schema(s) — FAQPage, Article, Product, BreadcrumbList etc. */
  schema?: Record<string, any> | Record<string, any>[];
  noindex?: boolean;
}

export default function SEO({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  robots,
  type = 'website',
  keywords,
  author,
  publishedTime,
  modifiedTime,
  schema,
  noindex = false,
}: SEOProps) {
  const url = canonical || (typeof window !== 'undefined' ? window.location.href : BASE_URL);
  const fullTitle = title.includes(PRODUCT_NAME) ? title : `${title} | ${PRODUCT_NAME} by ${SITE_NAME}`;
  const robotsContent = noindex
    ? 'noindex, nofollow'
    : robots || 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

  // Combine default schemas + custom schema(s)
  const customSchemas = Array.isArray(schema) ? schema : schema ? [schema] : [];
  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema, websiteSchema, softwareAppSchema, ...customSchemas],
  };

  return (
    <Helmet>
      {/* ===== PRIMARY ===== */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <meta name="bingbot" content={robotsContent} />
      {url && <link rel="canonical" href={url} />}

      {/* ===== OPEN GRAPH ===== */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* ===== TWITTER ===== */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* ===== PERF HINTS ===== */}
      <link rel="preconnect" href="https://www.xoneai.in" />
      <link rel="dns-prefetch" href="https://www.xoneai.in" />

      {/* ===== STRUCTURED DATA (JSON-LD) ===== */}
      <script type="application/ld+json">{JSON.stringify(graphSchema)}</script>
    </Helmet>
  );
}
