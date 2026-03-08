import type React from 'react';
import { MCQExerciseCard } from 'src/features/exercise/components/strategy-components/exercise-card/MCQExerciseCard';
import { OpenEndedExerciseCard } from 'src/features/exercise/components/strategy-components/exercise-card/OpenEndedExerciseCard';
import { TrueFalseExerciseCard } from 'src/features/exercise/components/strategy-components/exercise-card/TrueFalseExerciseCard';
import { ExerciseType } from 'src/features/exercise/enum/exercise-type.enum';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import ActionMenuTriggerer from 'src/shared/components/ActionMenuTriggerer';
import { ButtonSize } from 'src/shared/enums/button-size.enum';

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
            className={`relative w-[250px] h-[250px] border rounded-[10px] px-6 py-6 overflow-y-auto`}
        >
            <div className="absolute top-1 right-1">
                <ActionMenuTriggerer
                    onClick={(event) => toggleExerciseActionMenu(event, exercise._id)}
                    size={ButtonSize.SM}
                />
            </div>
            
            {Component && <Component exercise={exercise} isAnswersHidden={isAnswersHidden} />}
        </div>
    );
}
