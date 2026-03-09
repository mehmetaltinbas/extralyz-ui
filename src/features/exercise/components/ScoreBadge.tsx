import { getScoreColor } from 'src/features/exercise/utils/get-score-color.util';

export function ScoreBadge({
    score,
    label,
    className = '',
}: {
    score: number;
    label?: string;
    className?: string;
}) {
    const color = getScoreColor(score);

    return (
        <span
            className={`rounded-full px-3 py-0.5 text-sm font-serif inline-flex items-center gap-1 ${className}`}
            style={{ color }}
        >
            {label && <span>{label}:</span>}
            {score}
        </span>
    );
}
