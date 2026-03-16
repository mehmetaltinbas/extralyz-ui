import React from 'react';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

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
        <div>
            <Button
                variant={ButtonVariant.GHOST}
                size={ButtonSize.LG}
                onClick={(event) => {
                    recordAnswer(exercise._id, 1);
                    setSelectedIndex(1);
                }}
            >
                <p className={`${selectedIndex === 1 && 'font-bold bg-surface-hover rounded px-2'}`}>True</p>
            </Button>

            <Button
                variant={ButtonVariant.GHOST}
                size={ButtonSize.LG}
                onClick={(event) => {
                    recordAnswer(exercise._id, 0);
                    setSelectedIndex(0);
                }}
            >
                <p className={`${selectedIndex === 0 && 'font-bold bg-surface-hover rounded px-2'}`}>False</p>
            </Button>
        </div>
    );
}
