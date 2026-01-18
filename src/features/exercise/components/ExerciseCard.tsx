import type React from 'react';
import { Button } from 'src/shared/components/Button';
import { ButtonVariants } from 'src/shared/enums/button-variants.enum';
import { ExerciseType } from '../enum/exercise-types.enum';
import type { Exercise } from '../types/exercise.interface';
import { MCQExerciseCard } from './strategy-components/exercise-card/MCQExerciseCard';
import { OpenEndedExerciseCard } from './strategy-components/exercise-card/OpenEndedExerciseCard';
import { ShortExerciseCard } from './strategy-components/exercise-card/ShortExerciseCard';
import { TrueFalseExerciseCard } from './strategy-components/exercise-card/TrueFalseExerciseCard';

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
        [ExerciseType.SHORT, ShortExerciseCard],
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
