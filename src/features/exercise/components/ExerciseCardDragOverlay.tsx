import { GripVertical } from 'lucide-react';
import { EXERCISE_CARD_STYLES } from 'src/features/exercise/constants/exercise-card-styles.constant';
import { exerciseTypeFactory } from 'src/features/exercise/strategies/type/exercise-type.factory';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function ExerciseCardDragOverlay({
    exercise,
    isAnswersHidden,
}: {
    exercise: Exercise;
    isAnswersHidden: boolean;
}) {
    const strategy = exerciseTypeFactory.resolveStrategy(exercise.type);

    return (
        <div className={`${EXERCISE_CARD_STYLES} bg-surface shadow-lg`}>
            <div className="absolute top-2 left-1 text-text-primary">
                <GripVertical size={22} />
            </div>

            <div className="w-full h-full overflow-y-auto">
                {strategy?.getRestOfExerciseCard(exercise, isAnswersHidden)}
            </div>
        </div>
    );
}
