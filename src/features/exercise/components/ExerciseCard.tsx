import { useExerciseSetPopups } from 'src/features/exercise-set/hooks/use-exercise-set-popups.hook';
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
            className={`relative w-full max-w-[250px] md:max-w-[300px] aspect-square border rounded-[10px] px-8 py-8 text-sm md:text-base`}
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
