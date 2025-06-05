import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: Record<string, any>;
  noindex?: boolean;
}

const defaultTitle = 'D12 Websites - Professional Web Design for Dublin 12 Businesses';
const defaultDescription = 'Professional web design services for small businesses in Dublin 12, Ireland. Custom websites, logos, hosting, and SEO. Get your free quote today!';
const defaultOgImage = 'https://lovable.dev/opengraph-image-p98pqg.png';
const defaultOgType = 'website';
const defaultTwitterCard = 'summary_large_image';

export function SEO({
  title = defaultTitle,
  description = defaultDescription,
  canonical,
  ogImage = defaultOgImage,
  ogType = defaultOgType,
  twitterCard = defaultTwitterCard,
  structuredData,
  noindex = false,
}: SEOProps) {
  const siteUrl = 'https://d12websites.com';
  const fullCanonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

  // Default structured data for the organization
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'D12 Websites',
    url: siteUrl,
    logo: `${siteUrl}/lovable-uploads/29945e36-c2fc-4314-92be-40a1ba8250ac.png`,
    description: defaultDescription,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dublin 12',
      addressRegion: 'Dublin',
      addressCountry: 'IE'
    },
    sameAs: [
      'https://twitter.com/d12websites',
      // Add other social media profiles here
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph meta tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:site_name" content="D12 Websites" />

      {/* Twitter meta tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@d12websites" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
} 