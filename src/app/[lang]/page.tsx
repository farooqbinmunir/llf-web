import { notFound } from 'next/navigation';
import { hasLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

// TODO - Placeholder until the home page modules are built; it only proves the site shell in each language.
export default async function HomePage({ params }: PageProps<'/[lang]'>) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const { home } = await getDictionary(lang);

	return (
		<div className="rsg-container">
			<h1>{home.title}</h1>
		</div>
	);
}
