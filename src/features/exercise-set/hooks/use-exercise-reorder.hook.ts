import { useCallback, useEffect, useState } from 'react';
import {
    type DragEndEvent,
    type DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { useAppDispatch } from 'src/store/hooks';

export function useExerciseReorder(exercises: Exercise[], exerciseSetId: string) {
    const dispatch = useAppDispatch();
    const [localExercises, setLocalExercises] = useState<Exercise[]>(exercises);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isReordering, setIsReordering] = useState(false);

    useEffect(() => {
        if (activeId === null && !isReordering) {
            setLocalExercises(exercises);
        }
    }, [exercises, activeId, isReordering]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveId(String(event.active.id));
    }, []);

    const handleDragEnd = useCallback(
        async (event: DragEndEvent) => {
            setActiveId(null);

            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const oldIndex = localExercises.findIndex((e) => e._id === active.id);
            const newIndex = localExercises.findIndex((e) => e._id === over.id);
            if (oldIndex === -1 || newIndex === -1) return;

            const reordered = arrayMove(localExercises, oldIndex, newIndex);
            setLocalExercises(reordered);
            setIsReordering(true);

            const orderedExerciseIds = reordered.map((e) => e._id);
            const response = await ExerciseSetService.reorder(exerciseSetId, { orderedExerciseIds });

            if (!response.isSuccess) {
                alert(response.message);
            }

            setIsReordering(false);
            dispatch(tabsActions.invalidateTabPropsById(exerciseSetId));
        },
        [localExercises, exerciseSetId, dispatch]
    );

    const activeExercise = activeId
        ? localExercises.find((e) => e._id === activeId) ?? null
        : null;

    return { localExercises, sensors, activeExercise, handleDragStart, handleDragEnd };
}
