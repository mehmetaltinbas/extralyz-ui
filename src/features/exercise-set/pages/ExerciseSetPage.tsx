import React from 'react';
import { ExerciseSetMode } from 'src/features/exercise-set/enums/exercise-set-mode.enum';
import { exerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import { exerciseSetsActions } from 'src/features/exercise-set/store/exercise-sets.slice';
import { independentExerciseSetsActions } from 'src/features/exercise-set/store/independent-exercise-sets.slice';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { CreateExerciseForm } from 'src/features/exercise/components/CreateExerciseForm';
import { ExerciseActionMenu } from 'src/features/exercise/components/ExerciseActionMenu';
import { ExerciseCard } from 'src/features/exercise/components/ExerciseCard';
import TransferExerciseForm from 'src/features/exercise/components/TransferExerciseForm';
import { UpdateExerciseForm } from 'src/features/exercise/components/UpdateExerciseForm';
import { exerciseService } from 'src/features/exercise/services/exercise.service';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { extendedSourcesActions } from 'src/features/source/store/extended-sources.slice';
import { Section } from 'src/features/workspace/enums/sections.enum';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';

import { BodyModal } from 'src/shared/components/BodyModal';
import { Button } from 'src/shared/components/Button';
import { DeleteApproval } from 'src/shared/components/DeleteApproval';
import { ButtonVariants } from 'src/shared/enums/button-variants.enum';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

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
    const tabs = useAppSelector((state) => state.tabs);
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

    const [localExerciseSet, setLocalExerciseSet] = React.useState<ExerciseSet>(exerciseSet!);
    const [localExercises, setLocalExercises] = React.useState<Exercise[]>(exercises || []);

    function toggleExerciseActionMenu(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        exerciseId: string
    ) {
        event.stopPropagation();
        const exerciseActionMenu = document.getElementById('exercise-action-menu');
        const container = document.getElementById('exercise-set-page-container');

        if (exerciseActionMenu && container) {
            const containerRect = container?.getBoundingClientRect();
            const positionOfButton = event.currentTarget.getBoundingClientRect();

            exerciseActionMenu.style.top = `${positionOfButton.bottom - containerRect?.top}px`;
            exerciseActionMenu.style.left = `${positionOfButton.right - containerRect?.left}px`;
            
            setActionMenuExerciseId(exerciseId);
            setIsExerciseActionMenuHidden((prev) => !prev);
        }
    }

    async function refreshData() {
        if (!exerciseSet?._id) {
            return;
        }

        setIsPopUpActive(true);
        setIsLoadingPageHidden(false);

        try {
            const updatedSet = (await exerciseSetService.readById(exerciseSet._id))
                .exerciseSet;

            const updatedExercises = (
                await exerciseService.readAllByExerciseSetId(exerciseSet._id)
            ).exercises;

            if (updatedSet && updatedExercises) {
                setLocalExerciseSet(updatedSet);
                setLocalExercises(updatedExercises);
            }
        } finally {
            setIsLoadingPageHidden(true);
            setIsPopUpActive(false);
        }
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

    async function deleteExerciseSet(): Promise<string> {
        const response = await exerciseSetService.deleteById(localExerciseSet!._id!);

        if (!response.isSuccess) alert(response.message);
        else {
            dispatch(extendedSourcesActions.fetchData());
            dispatch(independentExerciseSetsActions.fetchData());
            dispatch(exerciseSetsActions.fetchData());
        }

        return response.message;
    }

    async function deleteExercise(): Promise<string> {
        const response = await exerciseService.deleteById(actionMenuExerciseId);

        dispatch(tabsActions.subtract(tabs.activeTabIndex));

        await refreshData();

        return response.message;
    }

    return localExerciseSet && localExercises ? (
        <div
            id="exercise-set-page-container"
            className={`relative w-full h-full ${className ?? ''}`}
        >
            <ExerciseActionMenu
                isHidden={isExerciseActionMenuHidden}
                setIsHidden={setIsExerciseActionMenuHidden}
                exerciseId={actionMenuExerciseId}
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
                    <p><span className='font-bold'>Type:</span> <span className='italic'>{localExerciseSet.type}</span></p>

                    <p><span className='font-bold'>Count:</span> <span className='italic'>{localExerciseSet.count}</span></p>

                    <p><span className='font-bold'>Difficulty:</span><span className='italic'> {localExerciseSet.difficulty}</span></p>

                    <Button
                        variant={ButtonVariants.PRIMARY}
                        onClick={toggleCreateExerciseForm}
                    >
                        Generate Exercise
                    </Button>

                    <Button variant={ButtonVariants.OUTLINE} onClick={toggleAnswerVisibility}>
                        {isAnswersHidden ? 'Show Answers' : 'Hide Answers'}
                    </Button>

                    <Button
                        variant={ButtonVariants.PRIMARY}
                        onClick={(event) => {
                            event.stopPropagation();
                            dispatch(tabsActions.add({ element: {
                                section: Section.EXERCISE_SET_PRACTICE,
                                id: localExerciseSet._id,
                                title: localExerciseSet.title,
                                mode: ExerciseSetMode.PRACTICE,
                            }}));
                        }}
                    >
                        Start Practice
                    </Button>

                    <Button
                        variant={ButtonVariants.DANGER}
                        onClick={toggleExerciseSetDeleteApproval}
                    >
                        Delete Exercise Set
                    </Button>
                </div>

                <div
                    className="w-full h-full
                    grid grid-cols-3 gap-4"
                >
                    {localExercises.map((exercise) => (
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
                        refreshData={refreshData}
                        exerciseSet={localExerciseSet}
                    />,
                    ...[localExercises.find(localExercise => localExercise._id === actionMenuExerciseId) && <UpdateExerciseForm 
                        key='update-exercise-form'
                        isHidden={isUpdateExerciseFormHidden}
                        setIsHidden={setIsUpdateExerciseFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        toggle={toggleUpdateExerciseForm}
                        refreshData={refreshData}
                        exercise={localExercises.find(localExercise => localExercise._id === actionMenuExerciseId)!}
                    />],
                    <TransferExerciseForm
                        key='transfer-exercise-form'
                        isHidden={isTransferExerciseFormHidden}
                        setIsHidden={setIsTransferExerciseFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        exerciseId={actionMenuExerciseId}
                        refreshData={refreshData}
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
