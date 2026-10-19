import { Helmet } from 'react-helmet-async';

// ===== BRAND CONSTANTS =====
const SITE_NAME = 'Xone AI';
const PRODUCT_NAME = 'MonsterX AI';
const FULL_BRAND = 'MonsterX AI by Xone AI';
const BASE_URL = 'https://www.xoneai.in';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const TWITTER_HANDLE = '@xoneai';

// ===== DEFAULT KEYWORDS (har page par apply honge) =====
const DEFAULT_KEYWORDS = [
  'MonsterX AI', 'Xone AI', 'MonsterX AI by Xone AI',
  'AI chat', 'AI assistant', 'conversational AI', 'generative AI',
  'coding agent', 'AI coding assistant', 'AI code generator', 'code debugger',
  'deep search', 'AI deep research', 'AI research assistant',
  'AI skills', 'AI tools', 'AI skill platform',
  'Claude alternative', 'Gemini alternative', 'ChatGPT alternative',
  'large language model', 'LLM', 'artificial intelligence',
].join(', ');

// ===== DEFAULT SCHEMAS =====
const organizationSchema = {
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: 'Xone AI Platform',
  url: BASE_URL,
  logo: { '@type': 'ImageObject', url: DEFAULT_IMAGE },
  description: `${SITE_NAME} is the company behind ${PRODUCT_NAME}, an advanced AI assistant with coding agent, deep search, and AI skills.`,
};

const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: FULL_BRAND,
  alternateName: PRODUCT_NAME,
  publisher: { '@id': `${BASE_URL}/#organization` },
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
  author = SITE_NAME,
  publishedTime,
  modifiedTime,
  schema,
  noindex = false,
}: SEOProps) {
  const url = canonical || (typeof window !== 'undefined' ? window.location.href : BASE_URL);
  // Agar title mein already MonsterX ya Xone hai to brand suffix skip
  const hasBrand = title.includes(PRODUCT_NAME) || title.includes(SITE_NAME);
  const fullTitle = hasBrand ? title : `${title} | ${FULL_BRAND}`;
  const robotsContent = noindex
    ? 'noindex, nofollow'
    : robots || 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
  const finalKeywords = keywords ? `${keywords}, ${DEFAULT_KEYWORDS}` : DEFAULT_KEYWORDS;

  const customSchemas = Array.isArray(schema) ? schema : schema ? [schema] : [];
  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema, websiteSchema, ...customSchemas],
  };

  return (
    <Helmet>
      {/* ===== PRIMARY ===== */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <meta name="bingbot" content={robotsContent} />
      {url && <link rel="canonical" href={url} />}

      {/* ===== OPEN GRAPH ===== */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={FULL_BRAND} />
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

      {/* ===== STRUCTURED DATA (JSON-LD) ===== */}
      <script type="application/ld+json">{JSON.stringify(graphSchema)}</script>
    </Helmet>
  );
}
