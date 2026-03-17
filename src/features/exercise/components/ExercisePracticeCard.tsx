import { resolveExerciseTypeStrategy } from 'src/features/exercise/strategies/type/resolve-exercise-type-strategy';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function ExercisePracticeCard({
    exercise,
    index,
    recordAnswer,
    className,
}: {
    exercise: Exercise;
    index: number;
    recordAnswer: (exerciseId: string, answer: string | number) => void;
    className?: string;
}) {
    const strategy = resolveExerciseTypeStrategy(exercise.type);

    return (
        <div
            className={`w-full max-w-[400px] md:max-w-[600px] h-auto p-2
            flex flex-col justify-center items-center gap-2
            ${className ?? ''}`}
        >
            <p className="border-b p-2">
                <span className="font-serif font-semibold">Exercise {index + 1}</span> -{' '}
                {exercise.prompt}
            </p>

            {strategy?.getRestOfExercisePracticeCard(exercise, index, recordAnswer)}
        </div>
    );
}
