import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function TrueFalseExercisePracticeCard({
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
    return (
        <div>
            <button
                onClick={(event) => recordAnswer(exercise._id, 1)}
                className="text-sm px-2 py-1 cursor-pointer 
                border-1 border-white rounded-full
                hover:border-black"
            >
                True
            </button>

            <button
                onClick={(event) => recordAnswer(exercise._id, 0)}
                className="text-sm px-2 py-1 cursor-pointer 
                border-1 border-white rounded-full
                hover:border-black"
            >
                False
            </button>
        </div>
    );
}
