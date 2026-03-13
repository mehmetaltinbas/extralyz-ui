import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import React from 'react';
import { useExerciseReorder } from 'src/features/exercise-set/hooks/use-exercise-reorder.hook';
import { useExerciseSetPopups } from 'src/features/exercise-set/hooks/use-exercise-set-popups.hook';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { ExerciseCardDragOverlay } from 'src/features/exercise/components/ExerciseCardDragOverlay';
import { SortableExerciseCard } from 'src/features/exercise/components/SortableExerciseCard';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { Button } from 'src/shared/components/Button';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function ExerciseSetPageContent({
    exerciseSet,
    exercises,
}: {
    exerciseSet: ExerciseSet;
    exercises: Exercise[];
}) {
    const [isAnswersHidden, setIsAnswersHidden] = React.useState<boolean>(true);
    const { openCreateExerciseForm, openStartPracticeDecision, openUpdateExerciseSetForm, openExerciseSetDeleteApproval } = useExerciseSetPopups();
    const { localExercises, sensors, activeExercise, handleDragStart, handleDragEnd } = useExerciseReorder(exercises, exerciseSet._id);

    async function viewPdf() {
        const response = await ExerciseSetService.getPdf(exerciseSet._id);

        if (!response.isSuccess || !response.pdfBase64) {
            alert(response.message);
            return;
        }

        const byteCharacters = atob(response.pdfBase64);
        
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], { type: 'application/pdf' });

        const url = window.URL.createObjectURL(blob);

        window.open(url, '_blank');
    }

    function toggleAnswerVisibility() {
        setIsAnswersHidden((prev) => !prev);
    }

    return (
        <div // main
            className="absolute w-full h-full
            flex flex-col justify-start items-start gap-4
            p-4"
        >
            <div
                className="w-full h-auto
                flex flex-col justif-center items-start gap-2"
            >
                <p><span className='font-bold'>Type:</span> <span className='italic'>{exerciseSet.type}</span></p>

                <p><span className='font-bold'>Count:</span> <span className='italic'>{exerciseSet.count}</span></p>

                <p><span className='font-bold'>Difficulty:</span><span className='italic'> {exerciseSet.difficulty}</span></p>

                <Button
                    onClick={openCreateExerciseForm}
                >
                    Generate Exercise
                </Button>

                <Button variant={ButtonVariant.OUTLINE} onClick={toggleAnswerVisibility}>
                    {isAnswersHidden ? 'Show Answers' : 'Hide Answers'}
                </Button>

                <Button
                    onClick={openStartPracticeDecision}
                >
                    Start Practice
                </Button>

                <Button
                    onClick={viewPdf}
                >
                    View as PDF
                </Button>

                <Button
                    onClick={openUpdateExerciseSetForm}
                >
                    Update
                </Button>

                <Button
                    variant={ButtonVariant.DANGER}
                    onClick={openExerciseSetDeleteApproval}
                >
                    Delete
                </Button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={localExercises.map((e) => e._id)} strategy={rectSortingStrategy}>
                    <div className="w-full h-full grid grid-cols-3 gap-4 pb-12">
                        {localExercises.map((exercise) => (
                            <SortableExerciseCard
                                key={exercise._id}
                                exercise={exercise}
                                isAnswersHidden={isAnswersHidden}
                            />
                        ))}
                    </div>
                </SortableContext>
                <DragOverlay>
                    {activeExercise && (
                        <ExerciseCardDragOverlay exercise={activeExercise} isAnswersHidden={isAnswersHidden} />
                    )}
                </DragOverlay>
            </DndContext>
        </div>
    );
}