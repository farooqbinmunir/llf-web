import type { Metadata } from 'next';
import { Cairo, Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import SiteFooter from '@/components/site-footer/SiteFooter';
import SiteHeader from '@/components/site-header/SiteHeader';
import { hasLocale, localeDetails, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import '@/styles/main.scss';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo', display: 'swap' });

export function generateStaticParams() {
	return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const { meta } = await getDictionary(lang);

	return { title: { default: meta.siteName, template: `%s | ${meta.siteName}` }, description: meta.description };
}

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const dictionary = await getDictionary(lang);

	return (
		<html lang={lang} dir={localeDetails[lang].dir} className={`${inter.variable} ${cairo.variable}`}>
			<body className="surface-light">
				<a className="rsg-skip-link" href="#main">
					{dictionary.a11y.skipToContent}
				</a>

				<SiteHeader lang={lang} dictionary={dictionary} />

				<main id="main">{children}</main>

				<SiteFooter lang={lang} dictionary={dictionary} />
			</body>
		</html>
	);
}
