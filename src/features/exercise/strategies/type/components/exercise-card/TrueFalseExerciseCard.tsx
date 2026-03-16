import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function TrueFalseExerciseCard({
    exercise,
    isAnswersHidden,
}: {
    exercise: Exercise;
    isAnswersHidden: boolean;
}) {
    const answers: Record<number, string> = {
        [0]: "True",
        [1]: "False"
    };

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <p>{exercise.prompt}</p>
            
            {!isAnswersHidden && (
                <p className="text-text-correct">
                    <span className='font-bold'>Answer:</span> {answers[exercise.correctChoiceIndex!]}
                </p>
            )}
        </div>
    );
}
