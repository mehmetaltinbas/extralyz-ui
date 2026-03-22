import React from 'react';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

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
    const optionLattersMap: Map<number, string> = new Map([
        [0, 'A'],
        [1, 'B'],
        [2, 'C'],
        [3, 'D'],
        [4, 'E'],
    ]);

    return (
        <div className="flex flex-col justify-center items-center gap-1">
            {exercise.choices!.map((choice, index) => (
                <Button
                    key={`choice-${index}`}
                    variant={ButtonVariant.GHOST}
                    size={ButtonSize.LG}
                    onClick={(event) => {
                        recordAnswer(exercise._id, index);
                        setSelectedIndex(index);
                    }}
                >
                    <p className={`${index === selectedIndex && 'font-bold bg-surface-hover rounded px-2'}`}>{optionLattersMap.get(index)} - {choice}</p>
                </Button>
            ))}
        </div>
    );
}
