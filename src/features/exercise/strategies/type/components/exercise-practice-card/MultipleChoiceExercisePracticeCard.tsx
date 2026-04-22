import React from 'react';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { ExercisePracticeChoiceButton } from 'src/shared/components/ExercisePracticeChoiceButton';
import { getAlphabetLetter } from 'src/shared/utils/get-alphabet-letter.util';

export function MultipleChoiceExercisePracticeCard({
    exercise,
    index,
    recordAnswer,
    className,
    shuffleChoices,
}: {
    exercise: Exercise;
    index: number;
    recordAnswer: (exerciseId: string, answer: string | number) => void;
    className?: string;
    shuffleChoices?: boolean;
}) {
    const [selectedOriginalIndex, setSelectedOriginalIndex] = React.useState<number | null>(null);

    const displayOrder = React.useMemo(() => {
        const indices = Array.from({ length: exercise.choices!.length }, (_, i) => i);

        if (shuffleChoices) {
            for (let i = indices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indices[i], indices[j]] = [indices[j], indices[i]];
            }
        }

        return indices;
    }, [exercise._id, shuffleChoices]);

    return (
        <div className="flex flex-col gap-2 w-full max-w-full">
            {displayOrder.map((originalIndex, displayIndex) => (
                <ExercisePracticeChoiceButton
                    key={originalIndex}
                    onClick={() => {
                        recordAnswer(exercise._id, originalIndex);
                        setSelectedOriginalIndex(originalIndex);
                    }}
                    isSelected={originalIndex === selectedOriginalIndex}
                >
                    <span className="font-bold">{getAlphabetLetter(displayIndex)} - </span>
                    {exercise.choices![originalIndex]}
                </ExercisePracticeChoiceButton>
            ))}
        </div>
    );
}
