import { GripVertical } from 'lucide-react';
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
        <div className="relative w-[250px] h-[250px] border border-border rounded-[10px] px-6 py-6 bg-surface shadow-lg">
            <div className="absolute top-1 left-1 text-text-muted">
                <GripVertical size={20} />
            </div>
            <div className="w-full h-full overflow-y-auto">
                {strategy?.getRestOfExerciseCard(exercise, isAnswersHidden)}
            </div>
        </div>
    );
}
