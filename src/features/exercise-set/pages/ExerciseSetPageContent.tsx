import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import React from 'react';
import { createPortal } from 'react-dom';
import { ExerciseSetMode } from 'src/features/exercise-set/enums/exercise-set-mode.enum';
import { ExerciseSetSourceType } from 'src/features/exercise-set/enums/exercise-set-source-type.enum';
import { ExerciseSetVisibility } from 'src/features/exercise-set/enums/exercise-set-visibility.enum';
import { useExerciseReorder } from 'src/features/exercise-set/hooks/use-exercise-reorder.hook';
import { useExerciseSetPopups } from 'src/features/exercise-set/hooks/use-exercise-set-popups.hook';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { ExerciseCardDragOverlay } from 'src/features/exercise/components/ExerciseCardDragOverlay';
import { SortableExerciseCard } from 'src/features/exercise/components/SortableExerciseCard';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { Section } from 'src/features/workspace/enums/section.enum';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { Button } from 'src/shared/components/Button';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function ExerciseSetPageContent({
    exerciseSet,
    exercises,
}: {
    exerciseSet: ExerciseSet;
    exercises: Exercise[];
}) {
    const dispatch = useAppDispatch();
    const sources = useAppSelector(state => state.sources);
    const user = useAppSelector(state => state.user);

    const [isAnswersHidden, setIsAnswersHidden] = React.useState<boolean>(true);

    const { openCreateExerciseForm, openStartPracticeDecision, openViewPdfDecision, openUpdateExerciseSetForm, openExerciseSetDeleteApproval } = useExerciseSetPopups();
    const { localExercises, sensors, activeExercise, handleDragStart, handleDragEnd } = useExerciseReorder(exercises, exerciseSet._id);

    function toggleAnswerVisibility() {
        setIsAnswersHidden((prev) => !prev);
    }

    function handleCopyPublicLink() {
        if (!user) return;

        const uiUrl = import.meta.env.VITE_UI_URL || window.location.origin;
        const url = `${uiUrl}/user/${user.userName}/exercise-set/${encodeURIComponent(exerciseSet.title)}`;
        navigator.clipboard.writeText(url);
        alert('Public link copied to clipboard!');
    }

    return (
        <div
            className="absolute w-full h-full overflow-auto
            flex flex-col justify-start items-start gap-8 p-8"
        >
            <div
                className="w-full h-auto
                flex flex-col justif-center items-start gap-2"
            >
                <div className='w-full h-auto flex flex-col justify-start items-center gap-4'>
                    <p className='text-lg font-bold'>{exerciseSet.title}</p>

                    <div className='flex gap-2'>
                        <p><span className=''>Source:</span> <span className='italic'>{exerciseSet.sourceType === ExerciseSetSourceType.SOURCE ? sources.find((source) => source._id === exerciseSet.sourceId)?.title : exerciseSet.sourceType}</span></p>

                        <p>|</p>

                        <p><span className=''>Type:</span> <span className='italic'>{exerciseSet.type}</span></p>

                        <p>|</p>

                        <p><span className=''>Difficulty:</span><span className='italic'> {exerciseSet.difficulty}</span></p>

                        <p>|</p>

                        <p><span className=''>Count:</span> <span className='italic'>{exerciseSet.count}</span></p>
                    </div>

                    <div className='flex flex-wrap gap-2'>
                        <Button
                            onClick={openCreateExerciseForm}
                        >
                            Generate Exercise
                        </Button>

                        <Button
                            onClick={openStartPracticeDecision}
                        >
                            Start Practice
                        </Button>

                        <Button
                            onClick={openViewPdfDecision}
                        >
                            View as PDF
                        </Button>

                        <Button
                            onClick={() =>
                                dispatch(
                                    tabsActions.openTab({
                                        section: Section.EXERCISE_SET_PAPER_EVALUATION,
                                        id: exerciseSet._id,
                                        title: exerciseSet.title,
                                        mode: ExerciseSetMode.PAPER_EVALUATION
                                    })
                                )
                            }
                        >
                            Evaluate Paper Answers
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

                        {exerciseSet.visibility === ExerciseSetVisibility.PUBLIC && (
                            <Button variant={ButtonVariant.OUTLINE} onClick={handleCopyPublicLink}>
                                Copy Public Link
                            </Button>
                        )}

                        <Button variant={ButtonVariant.OUTLINE} onClick={toggleAnswerVisibility}>
                            {isAnswersHidden ? 'Show Answers' : 'Hide Answers'}
                        </Button>
                    </div>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={localExercises.map((e) => e._id)} strategy={rectSortingStrategy}>
                    <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {localExercises.map((exercise) => (
                            <div className='flex justify-center items-center'>
                                <SortableExerciseCard
                                    key={exercise._id}
                                    exercise={exercise}
                                    isAnswersHidden={isAnswersHidden}
                                />
                            </div>
                        ))}
                    </div>
                </SortableContext>

                {createPortal(
                    <DragOverlay>
                        {activeExercise && (
                            <ExerciseCardDragOverlay exercise={activeExercise} isAnswersHidden={isAnswersHidden} />
                        )}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
}
