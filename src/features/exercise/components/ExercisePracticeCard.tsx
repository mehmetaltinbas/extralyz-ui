import { exerciseTypeFactory } from 'src/features/exercise/strategies/type/exercise-type.factory';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function ExercisePracticeCard({
    exercise,
    index,
    recordAnswer,
    isHidden,
}: {
    exercise: Exercise;
    index: number;
    recordAnswer: (exerciseId: string, answer: string | number) => void;
    isHidden: boolean;
}) {
    const strategy = exerciseTypeFactory.resolveStrategy(exercise.type);

    return (
        <div
            className={`w-auto h-auto p-2
            flex flex-col justify-center items-center gap-2
            ${isHidden && 'hidden'}`}
        >
            <p className="border-b p-4">
                <span className="font-serif font-semibold">Exercise {index + 1}</span> -{' '}
                {exercise.prompt}
            </p>

            {strategy?.getRestOfExercisePracticeCard(exercise, index, recordAnswer)}
        </div>
    );
}
