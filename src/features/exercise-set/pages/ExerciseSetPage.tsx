import React, { useState } from 'react';
import { ExerciseSetMode } from 'src/features/exercise-set/enums/exercise-set-mode.enum';
import { exerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import { CreateExerciseForm } from 'src/features/exercise/components/CreateExerciseForm';
import { ExerciseActionMenu } from 'src/features/exercise/components/ExerciseActionMenu';
import { exerciseService } from 'src/features/exercise/services/exercise.service';
import { Section } from 'src/features/workspace/enums/sections.enum';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabsSlice';
import { openTab } from 'src/features/workspace/features/tabs/utilities/openTab.utility';
import { BodyModal } from 'src/shared/components/BodyModal';
import { ClaretButton } from 'src/shared/components/buttons/ClaretButton';
import { DeleteApproval } from 'src/shared/components/DeleteApproval';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { BlackButton } from '../../../shared/components/buttons/BlackButton';
import { ExerciseCard } from '../../exercise/components/ExerciseCard';
import type { Exercise } from '../../exercise/types/exercise.interface';
import type { ExerciseSet } from '../types/exercise-set.interface';

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
    const [isAnswersHidden, setIsAnswersHidden] = useState<boolean>(true);
    const [actionMenuExerciseId, setActionMenuExerciseId] = useState<string>('');
    const [isExerciseActionMenuHidden, setIsExerciseActionMenuHidden] =
        useState<boolean>(true);
    const [isPopUpActive, setIsPopUpActive] = useState<boolean>(false);
    const [isCreateExerciseFormHidden, setIsCreateExerciseFormHidden] = useState<boolean>(true);
    const [isExerciseSetDeleteApprovalHidden, setIsExerciseSetDeleteApprovalHidden] =
        useState<boolean>(true);
    const [isExerciseDeleteApprovalHidden, setIsExerciseDeleteApprovalHidden] =
        useState<boolean>(true);
    const [isLoadingPageHidden, setIsLoadingPageHidden] = useState<boolean>(true);
    const [localExerciseSet, setLocalExerciseSet] = useState<ExerciseSet>(exerciseSet!);
    const [localExercises, setLocalExercises] = useState<Exercise[]>(exercises || []);

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
        if (!exerciseSet?._id) return;
        setIsPopUpActive(true);
        setIsLoadingPageHidden(false);

        try {
            const updatedSet = (await exerciseSetService.readById(exerciseSet._id)).exerciseSet;
            const updatedExercises = (await exerciseService.readAllByExerciseSetId(exerciseSet._id)).exercises;
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
        setIsPopUpActive(prev => !prev);
        setIsCreateExerciseFormHidden(prev => !prev);
    }

    function toggleAnswerVisibility() {
        setIsAnswersHidden((prev) => !prev);
    }

    function toggleExerciseSetDeleteApproval() {
        setIsPopUpActive((prev) => !prev);
        setIsExerciseSetDeleteApprovalHidden((prev) => !prev);
    }

    function toggleExerciseDeleteApproval() {
        setIsPopUpActive((prev) => !prev);
        setIsExerciseDeleteApprovalHidden((prev) => !prev);
    }

    async function deleteExerciseSet(): Promise<string> {
        const response = await exerciseSetService.deleteById(localExerciseSet!._id!);
        dispatch(tabsActions.subtract(tabs.activeTabIndex));    
        await refreshData();
        return response.message;
    }

    async function deleteExercise(): Promise<string> {
        const response = await exerciseService.deleteById(actionMenuExerciseId);
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
                    <p>Type: {localExerciseSet.type}</p>
                    <p>Count: {localExerciseSet.count}</p>
                    <p>Difficulty: {localExerciseSet.difficulty}</p>
                    <BlackButton
                        onClick={toggleCreateExerciseForm}
                    >
                        Generate Additional Exercise
                    </BlackButton>
                    <BlackButton onClick={toggleAnswerVisibility}>
                        {isAnswersHidden ? 'Show Answers' : 'Hide Answers'}
                    </BlackButton>
                    <BlackButton
                        onClick={(event) => {
                            event.stopPropagation();
                            openTab(dispatch, {
                                section: Section.EXERCISE_SET_PRACTICE,
                                id: localExerciseSet._id,
                                title: localExerciseSet.title,
                                mode: ExerciseSetMode.PRACTICE,
                            });
                        }}
                    >
                        Start Practice
                    </BlackButton>
                    <ClaretButton onClick={toggleExerciseSetDeleteApproval}>
                        Delete Exercise Set
                    </ClaretButton>
                </div>
                <div
                    className="w-full h-full
                    grid grid-cols-3 gap-4"
                >
                    {localExercises.map((exercise) => (
                        <ExerciseCard
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
                        isHidden={isCreateExerciseFormHidden}
                        setIsHidden={setIsCreateExerciseFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        toggle={toggleCreateExerciseForm}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        refreshData={refreshData}
                        exerciseSetId={localExerciseSet._id}
                    />,
                    <DeleteApproval // for exercise set
                        isHidden={isExerciseSetDeleteApprovalHidden}
                        setIsHidden={setIsExerciseSetDeleteApprovalHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        toggle={toggleExerciseSetDeleteApproval}
                        onDelete={deleteExerciseSet}
                    />,
                    <DeleteApproval // for selected exercise
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
