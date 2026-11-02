import CountUp from '@/components/helpers/count-up';

type StatisticBlockProps = {
	statistic?: string | null;
	// A unit or short label shown above the figure, such as "USD".
	prefix?: string | null;
	footnote?: string | null;
	// Counts the figure up from zero when it scrolls into view, as the home page's impact figures do.
	countUp?: boolean;
};

// A headline figure and the line that explains it. With no figure (an expected result) the footnote is the statement.
export default function StatisticBlockStandard({ statistic, prefix, footnote, countUp }: StatisticBlockProps) {
	if (!statistic && !footnote) return null;

	return (
		<div className={statistic ? 'statistic-block standard' : 'statistic-block standard no-statistic'}>
			{statistic && (
				<div className="rsg-content-wrapper">
					<p className="value">
						{prefix && <span className="prefix">{prefix}</span>}
						<span className="statistic">{countUp ? <CountUp value={statistic} /> : statistic}</span>
					</p>
				</div>
			)}

			{footnote && <p className="footnote">{footnote}</p>}
		</div>
	);
}
