import { GripVertical } from 'lucide-react';
import { MCQExerciseCard } from 'src/features/exercise/components/strategy-components/exercise-card/MCQExerciseCard';
import { OpenEndedExerciseCard } from 'src/features/exercise/components/strategy-components/exercise-card/OpenEndedExerciseCard';
import { TrueFalseExerciseCard } from 'src/features/exercise/components/strategy-components/exercise-card/TrueFalseExerciseCard';
import { ExerciseType } from 'src/features/exercise/enum/exercise-type.enum';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';

const componentsMap = new Map<
    ExerciseType,
    React.ComponentType<{ exercise: Exercise; isAnswersHidden: boolean }>
>([
    [ExerciseType.MCQ, MCQExerciseCard],
    [ExerciseType.TRUE_FALSE, TrueFalseExerciseCard],
    [ExerciseType.OPEN_ENDED, OpenEndedExerciseCard],
]);

export function ExerciseCardDragOverlay({
    exercise,
    isAnswersHidden,
}: {
    exercise: Exercise;
    isAnswersHidden: boolean;
}) {
    const Component = componentsMap.get(exercise.type as ExerciseType);

    return (
        <div className="relative w-[250px] h-[250px] border rounded-[10px] px-6 py-6 bg-white shadow-lg">
            <div className="absolute top-1 left-1 text-gray-400">
                <GripVertical size={16} />
            </div>
            <div className="w-full h-full overflow-y-auto">
                {Component && <Component exercise={exercise} isAnswersHidden={isAnswersHidden} />}
            </div>
        </div>
    );
}
