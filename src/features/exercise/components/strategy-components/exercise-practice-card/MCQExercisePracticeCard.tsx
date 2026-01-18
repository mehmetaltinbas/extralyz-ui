import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function MCQExercisePracticeCard({
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
    const optionLattersMap: Map<number, string> = new Map([
        [0, 'A'],
        [1, 'B'],
        [2, 'C'],
        [3, 'D'],
        [4, 'E'],
    ]);

    return (
        <div className="flex flex-col justify-center items-center gap-1">
            {exercise.choices.map((choice, index) => (
                <button
                    onClick={(event) => recordAnswer(exercise._id, index)}
                    className="text-sm px-2 py-1 cursor-pointer 
                    border-1 border-white rounded-full
                    hover:border-black"
                >
                    {optionLattersMap.get(index)} - {choice}
                </button>
            ))}
        </div>
    );
}
