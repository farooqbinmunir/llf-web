type StructuredDataProps = { data: Record<string, unknown> };

// Schema.org data for search engines, as JSON-LD. `<` is escaped so text from the CMS cannot close the script element.
export default function StructuredData({ data }: StructuredDataProps) {
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(/</g, '\\u003c') }} />;
}
