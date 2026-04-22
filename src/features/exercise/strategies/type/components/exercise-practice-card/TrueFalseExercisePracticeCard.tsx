import React from 'react';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { ExercisePracticeChoiceButton } from 'src/shared/components/ExercisePracticeChoiceButton';

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
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

    return (
        <div className='w-full flex justify-center items-center gap-4'>
            <ExercisePracticeChoiceButton
                onClick={() => {
                    recordAnswer(exercise._id, 1);
                    setSelectedIndex(1);
                }}
                isSelected={selectedIndex === 1}
            >
                True
            </ExercisePracticeChoiceButton>

            <ExercisePracticeChoiceButton
                onClick={() => {
                    recordAnswer(exercise._id, 0);
                    setSelectedIndex(0);
                }}
                isSelected={selectedIndex === 0}
            >
                False
            </ExercisePracticeChoiceButton>
        </div>
    );
}
