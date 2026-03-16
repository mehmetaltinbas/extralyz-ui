import { getScoreColor } from 'src/features/exercise/utils/get-score-color.util';
import { useAppSelector } from 'src/store/hooks';

export function ScoreBadge({
    score,
    label,
    className = '',
}: {
    score: number;
    label?: string;
    className?: string;
}) {
    const mode = useAppSelector((state) => state.theme.mode);
    const color = getScoreColor(score, mode === 'dark');

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
