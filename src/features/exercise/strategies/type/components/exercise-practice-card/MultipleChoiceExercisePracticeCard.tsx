import React from 'react';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { ExercisePracticeChoiceButton } from 'src/shared/ExercisePracticeChoiceButton';

export function MultipleChoiceExercisePracticeCard({
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
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
    const optionLetters = ['A', 'B', 'C', 'D', 'E'];

    return (
        <div className="flex flex-col gap-2 w-full max-w-full">
            {exercise.choices!.map((choice, idx) => (
                <ExercisePracticeChoiceButton
                    onClick={() => {
                        recordAnswer(exercise._id, idx);
                        setSelectedIndex(idx);
                    }}
                    isSelected={idx === selectedIndex}
                >
                    <span className="font-bold">{optionLetters[idx]} - </span>
                    {choice}
                </ExercisePracticeChoiceButton>
            ))}
        </div>
    );
}