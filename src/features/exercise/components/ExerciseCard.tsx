import type React from 'react';
import { Button } from 'src/shared/components/Button';
import { ButtonVariants } from 'src/shared/enums/button-variants.enum';
import { ExerciseType } from 'src/features/exercise/enum/exercise-type.enum';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { MCQExerciseCard } from 'src/features/exercise/components/strategy-components/exercise-card/MCQExerciseCard';
import { OpenEndedExerciseCard } from 'src/features/exercise/components/strategy-components/exercise-card/OpenEndedExerciseCard';
import { TrueFalseExerciseCard } from 'src/features/exercise/components/strategy-components/exercise-card/TrueFalseExerciseCard';

export function ExerciseCard({
    exercise,
    isAnswersHidden,
    toggleExerciseActionMenu,
}: {
    exercise: Exercise;
    isAnswersHidden: boolean;
    toggleExerciseActionMenu: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        exerciseId: string
    ) => void;
}) {
    const componentsMap: Map<
        ExerciseType,
        React.ComponentType<{ exercise: Exercise; isAnswersHidden: boolean }>
    > = new Map([
        [ExerciseType.MCQ, MCQExerciseCard],
        [ExerciseType.TRUE_FALSE, TrueFalseExerciseCard],
        [ExerciseType.OPEN_ENDED, OpenEndedExerciseCard],
    ]);
    const Component = componentsMap.get(exercise.type as ExerciseType);

    return (
        <div
            className={`relative w-[250px] h-[250px] border rounded-[10px] px-4 py-2 overflow-y-auto`}
        >
            <div className="absolute top-1 right-1">
                <Button
                    variant={ButtonVariants.GHOST}
                    onClick={(event) => toggleExerciseActionMenu(event, exercise._id)}
                >
                    ...
                </Button>
            </div>
            {Component && <Component exercise={exercise} isAnswersHidden={isAnswersHidden} />}
        </div>
    );
}
