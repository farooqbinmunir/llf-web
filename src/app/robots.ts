import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';

// Search result pages are left uncrawled, as search engines advise for a site's own search; the Search page itself is not.
export default function robots(): MetadataRoute.Robots {
	return {
		rules: { userAgent: '*', allow: '/', disallow: locales.map((locale) => `/${locale}/search?`) },
		sitemap: `${process.env.SITE_URL}/sitemap.xml`,
	};
}
