import { GripVertical } from 'lucide-react';
import { resolveExerciseTypeStrategy } from 'src/features/exercise/strategies/type/resolve-exercise-type-strategy';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function ExerciseCardDragOverlay({
    exercise,
    isAnswersHidden,
}: {
    exercise: Exercise;
    isAnswersHidden: boolean;
}) {
    const strategy = resolveExerciseTypeStrategy(exercise.type);

    return (
        <div className="relative w-[250px] h-[250px] border rounded-[10px] px-6 py-6 bg-white shadow-lg">
            <div className="absolute top-1 left-1 text-gray-400">
                <GripVertical size={16} />
            </div>
            <div className="w-full h-full overflow-y-auto">
                {strategy?.getRestOfExerciseCard(exercise, isAnswersHidden)}
            </div>
        </div>
    );
}
