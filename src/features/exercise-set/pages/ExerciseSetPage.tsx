import React from 'react';
import { ExerciseSetMode } from 'src/features/exercise-set/enums/exercise-set-mode.enum';
import { exerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import { refreshExerciseSetData } from 'src/features/exercise-set/store/thunks/refresh-exercise-set-data.thunk';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { CreateExerciseForm } from 'src/features/exercise/components/CreateExerciseForm';
import { ExerciseActionMenu } from 'src/features/exercise/components/ExerciseActionMenu';
import { ExerciseCard } from 'src/features/exercise/components/ExerciseCard';
import TransferExerciseForm from 'src/features/exercise/components/TransferExerciseForm';
import { UpdateExerciseForm } from 'src/features/exercise/components/UpdateExerciseForm';
import { exerciseService } from 'src/features/exercise/services/exercise.service';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { Section } from 'src/features/workspace/enums/section.enum';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';

import { BodyModal } from 'src/shared/components/BodyModal';
import { Button } from 'src/shared/components/Button';
import { DeleteApproval } from 'src/shared/components/DeleteApproval';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch } from 'src/store/hooks';

export function ExerciseSetPage({
    exerciseSet,
    exercises,
    className,
}: {
    exerciseSet?: ExerciseSet;
    exercises?: Exercise[];
    className?: string;
}) {
    const dispatch = useAppDispatch();
    const [isAnswersHidden, setIsAnswersHidden] = React.useState<boolean>(true);
    const [actionMenuExerciseId, setActionMenuExerciseId] = React.useState<string>('');

    const [isExerciseActionMenuHidden, setIsExerciseActionMenuHidden] =
        React.useState<boolean>(true);
    const [isPopUpActive, setIsPopUpActive] = React.useState<boolean>(false);
    const [isCreateExerciseFormHidden, setIsCreateExerciseFormHidden] =
        React.useState<boolean>(true);
    const [isUpdateExerciseFormHidden, setIsUpdateExerciseFormHidden] = React.useState<boolean>(true);
    const [isTransferExerciseFormHidden, setIsTransferExerciseFormHidden] = React.useState<boolean>(true);
    const [isExerciseSetDeleteApprovalHidden, setIsExerciseSetDeleteApprovalHidden] =
        React.useState<boolean>(true);
    const [isExerciseDeleteApprovalHidden, setIsExerciseDeleteApprovalHidden] =
        React.useState<boolean>(true);
    const [isLoadingPageHidden, setIsLoadingPageHidden] = React.useState<boolean>(true);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const exerciseActionMenuRef = React.useRef<HTMLDivElement>(null);

    function toggleExerciseActionMenu(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        exerciseId: string
    ) {
        event.stopPropagation();
        const exerciseActionMenu = exerciseActionMenuRef.current;
        const container = containerRef.current;

        if (exerciseActionMenu && container) {
            const containerRect = container.getBoundingClientRect();
            const positionOfButton = event.currentTarget.getBoundingClientRect();

            exerciseActionMenu.style.top = `${positionOfButton.bottom - containerRect.top}px`;
            exerciseActionMenu.style.left = `${positionOfButton.right - containerRect.left}px`;

            setActionMenuExerciseId(exerciseId);
            setIsExerciseActionMenuHidden((prev) => !prev);
        }
    }

    function invalidateTab() {
        if (!exerciseSet?._id) {
            return;
        }

        dispatch(tabsActions.invalidateTabPropsById(exerciseSet._id));
    }

    function toggleCreateExerciseForm() {
        setIsPopUpActive((prev) => !prev);
        setIsCreateExerciseFormHidden((prev) => !prev);
    }

    function toggleAnswerVisibility() {
        setIsAnswersHidden((prev) => !prev);
    }

    function toggleExerciseSetDeleteApproval() {
        setIsPopUpActive((prev) => !prev);
        setIsExerciseSetDeleteApprovalHidden((prev) => !prev);
    }

    function toggleUpdateExerciseForm() {
        setIsPopUpActive((prev) => !prev);
        setIsUpdateExerciseFormHidden((prev) => !prev);
    }

    function toggleTransferExerciseForm() {
        setIsPopUpActive((prev) => !prev);
        setIsTransferExerciseFormHidden((prev) => !prev);
    }

    function toggleExerciseDeleteApproval() {
        setIsPopUpActive((prev) => !prev);
        setIsExerciseDeleteApprovalHidden((prev) => !prev);
    }

    async function deleteExerciseSet(): Promise<{ isSuccess: boolean }> {
        const response = await exerciseSetService.deleteById(exerciseSet!._id!);

        if (!response.isSuccess) alert(response.message);
        else {
            dispatch(refreshExerciseSetData());
        }

        return { isSuccess: response.isSuccess };
    }

    async function deleteExercise(): Promise<{ isSuccess: boolean }> {
        const response = await exerciseService.deleteById(actionMenuExerciseId);

        if (!response.isSuccess) {
            alert(response.message);
        } else {
            invalidateTab();
        }

        return { isSuccess: response.isSuccess };
    }

    return exerciseSet && exercises ? (
        <div
            ref={containerRef}
            className={`relative w-full h-full ${className ?? ''}`}
        >
            <ExerciseActionMenu
                isHidden={isExerciseActionMenuHidden}
                setIsHidden={setIsExerciseActionMenuHidden}
                exerciseId={actionMenuExerciseId}
                ref={exerciseActionMenuRef}
                toggleUpdateExerciseForm={toggleUpdateExerciseForm}
                toggleTransferExerciseForm={toggleTransferExerciseForm}
                toggleDeleteApproval={toggleExerciseDeleteApproval}
            />

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
                        variant={ButtonVariant.PRIMARY}
                        onClick={toggleCreateExerciseForm}
                    >
                        Generate Exercise
                    </Button>

                    <Button variant={ButtonVariant.OUTLINE} onClick={toggleAnswerVisibility}>
                        {isAnswersHidden ? 'Show Answers' : 'Hide Answers'}
                    </Button>

                    <Button
                        variant={ButtonVariant.PRIMARY}
                        onClick={(event) => {
                            event.stopPropagation();
                            dispatch(tabsActions.invalidateTabPropsById(exerciseSet._id));
                            dispatch(tabsActions.openTab({
                                section: Section.EXERCISE_SET_PRACTICE,
                                id: exerciseSet._id,
                                title: exerciseSet.title,
                                mode: ExerciseSetMode.PRACTICE,
                            }));
                        }}
                    >
                        Start Practice
                    </Button>

                    <Button
                        variant={ButtonVariant.DANGER}
                        onClick={toggleExerciseSetDeleteApproval}
                    >
                        Delete Exercise Set
                    </Button>
                </div>

                <div
                    className="w-full h-full
                    grid grid-cols-3 gap-4"
                >
                    {exercises.map((exercise) => (
                        <ExerciseCard
                            key={`exercise-card-${exercise._id}`}
                            exercise={exercise}
                            isAnswersHidden={isAnswersHidden}
                            toggleExerciseActionMenu={toggleExerciseActionMenu}
                        />
                    ))}
                </div>
            </div>

            <BodyModal
                isPopUpActive={isPopUpActive}
                components={[
                    <CreateExerciseForm
                        key='create-exercise-form'
                        isHidden={isCreateExerciseFormHidden}
                        setIsHidden={setIsCreateExerciseFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        toggle={toggleCreateExerciseForm}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        refreshData={invalidateTab}
                        exerciseSet={exerciseSet}
                    />,
                    ...[exercises.find(localExercise => localExercise._id === actionMenuExerciseId) && 
                        <UpdateExerciseForm 
                            key='update-exercise-form'
                            isHidden={isUpdateExerciseFormHidden}
                            setIsHidden={setIsUpdateExerciseFormHidden}
                            setIsPopUpActive={setIsPopUpActive}
                            setIsLoadingPageHidden={setIsLoadingPageHidden}
                            toggle={toggleUpdateExerciseForm}
                            refreshData={invalidateTab}
                            exercise={exercises.find(localExercise => localExercise._id === actionMenuExerciseId)!}
                        />
                    ],
                    <TransferExerciseForm
                        key='transfer-exercise-form'
                        isHidden={isTransferExerciseFormHidden}
                        setIsHidden={setIsTransferExerciseFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        exerciseId={actionMenuExerciseId}
                        currentExerciseSetId={exerciseSet._id}
                        refreshData={invalidateTab}
                    />,
                    <DeleteApproval // for exercise set
                        key='exercise-set-delete-approval'
                        isHidden={isExerciseSetDeleteApprovalHidden}
                        setIsHidden={setIsExerciseSetDeleteApprovalHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        toggle={toggleExerciseSetDeleteApproval}
                        onDelete={deleteExerciseSet}
                    />,
                    <DeleteApproval // for selected exercise
                        key='exercise-delete-approval'
                        isHidden={isExerciseDeleteApprovalHidden}
                        setIsHidden={setIsExerciseDeleteApprovalHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        toggle={toggleExerciseDeleteApproval}
                        onDelete={deleteExercise}
                    />,
                    <LoadingPage isHidden={isLoadingPageHidden} />,
                ]}
            />
        </div>
    ) : (
        <div className={`${className ?? ''}`}>undefined</div>
    );
}
