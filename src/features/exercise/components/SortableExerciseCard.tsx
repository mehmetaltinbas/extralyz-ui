import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type React from 'react';
import { ExerciseCard } from 'src/features/exercise/components/ExerciseCard';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function SortableExerciseCard({
    exercise,
    isAnswersHidden,
}: {
    exercise: Exercise;
    isAnswersHidden: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: exercise._id });

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative">
            <div
                className="absolute top-1 left-1 z-10 cursor-grab active:cursor-grabbing text-text-muted hover:text-text-secondary"
                {...attributes}
                {...listeners}
            >
                <GripVertical size={20} />
            </div>

            <ExerciseCard exercise={exercise} isAnswersHidden={isAnswersHidden} />
        </div>
    );
}
