import { useExerciseSetPopups } from 'src/features/exercise-set/hooks/use-exercise-set-popups.hook';
import { EXERCISE_CARD_STYLES } from 'src/features/exercise/constants/exercise-card-styles.constant';
import { exerciseTypeFactory } from 'src/features/exercise/strategies/type/exercise-type.factory';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import ActionMenuTriggerer from 'src/shared/components/ActionMenuTriggerer';
import { ButtonSize } from 'src/shared/enums/button-size.enum';

export function ExerciseCard({
    exercise,
    isAnswersHidden,
}: {
    exercise: Exercise;
    isAnswersHidden: boolean;
}) {
    const { openExerciseActionMenu } = useExerciseSetPopups();

    const strategy = exerciseTypeFactory.resolveStrategy(exercise.type);

    return (
        <div
            className={`${EXERCISE_CARD_STYLES}`}
        >
            <div className="absolute top-1 right-1">
                <ActionMenuTriggerer
                    onClick={(event) => openExerciseActionMenu(event, exercise._id)}
                    size={ButtonSize.SM}
                />
            </div>

            <div className='w-full h-full overflow-y-auto'>
                {strategy?.getRestOfExerciseCard(exercise, isAnswersHidden)}
            </div>
        </div>
    );
}
