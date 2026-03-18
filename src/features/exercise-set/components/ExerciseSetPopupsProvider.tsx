import React from 'react';
import { UpdateExerciseSetForm } from 'src/features/exercise-set/components/UpdateExerciseSetForm';
import { ExerciseSetPopupsContext } from 'src/features/exercise-set/contexts/exercise-set-popups.context';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import { refreshExerciseSetData } from 'src/features/exercise-set/store/thunks/refresh-exercise-set-data.thunk';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { CreateExerciseForm } from 'src/features/exercise/components/CreateExerciseForm';
import { ExerciseActionMenu } from 'src/features/exercise/components/ExerciseActionMenu';
import { StartPracticeDecision } from 'src/features/exercise/components/StartPracticeDecision';
import TransferExerciseForm from 'src/features/exercise/components/TransferExerciseForm';
import { UpdateExerciseForm } from 'src/features/exercise/components/UpdateExerciseForm';
import { ViewPdfDecision } from 'src/features/exercise/components/ViewPdfDecision';
import { ExerciseService } from 'src/features/exercise/services/exercise.service';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { BodyModal } from 'src/shared/components/BodyModal';
import { CriticOperationApproval } from 'src/shared/components/CriticOperationApproval';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch } from 'src/store/hooks';

export function ExerciseSetPopupsProvider({
    children,
    containerRef,
    exerciseSet,
    exercises,
}: {
    children: React.ReactNode;
    containerRef: React.RefObject<HTMLDivElement | null>;
    exerciseSet: ExerciseSet;
    exercises: Exercise[];
}) {
    const dispatch = useAppDispatch();

    const [isPopUpActive, setIsPopUpActive] = React.useState(false);
    const [isLoadingPageHidden, setIsLoadingPageHidden] = React.useState(true);
    const [isExerciseActionMenuHidden, setIsExerciseActionMenuHidden] = React.useState(true);
    const [isCreateExerciseFormHidden, setIsCreateExerciseFormHidden] = React.useState(true);
    const [isUpdateExerciseFormHidden, setIsUpdateExerciseFormHidden] = React.useState(true);
    const [isTransferExerciseFormHidden, setIsTransferExerciseFormHidden] = React.useState(true);
    const [isStartPracticeDecisionHidden, setIsStartPracticeDecisionHidden] = React.useState(true);
    const [isViewPdfDecisionHidden, setIsViewPdfDecisionHidden] = React.useState(true);
    const [isUpdateExerciseSetFormHidden, setIsUpdateExerciseSetFormHidden] = React.useState(true);
    const [isExerciseSetDeleteApprovalHidden, setIsExerciseSetDeleteApprovalHidden] = React.useState(true);
    const [isExerciseDeleteApprovalHidden, setIsExerciseDeleteApprovalHidden] = React.useState(true);
    const [actionMenuExerciseId, setActionMenuExerciseId] = React.useState('');

    const exerciseActionMenuRef = React.useRef<HTMLDivElement>(null);

    function openCreateExerciseForm() {
        setIsPopUpActive(true);
        setIsCreateExerciseFormHidden(false);
    }

    function openStartPracticeDecision() {
        setIsPopUpActive(true);
        setIsStartPracticeDecisionHidden(false);
    }

    function openViewPdfDecision() {
        setIsPopUpActive(true);
        setIsViewPdfDecisionHidden(false);
    }

    function openUpdateExerciseSetForm() {
        setIsPopUpActive(true);
        setIsUpdateExerciseSetFormHidden(false);
    }

    function openExerciseSetDeleteApproval() {
        setIsPopUpActive(true);
        setIsExerciseSetDeleteApprovalHidden(false);
    }

    function openExerciseActionMenu(
        event: React.MouseEvent<HTMLButtonElement>,
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

            if (!isExerciseActionMenuHidden && actionMenuExerciseId === exerciseId) {
                setIsExerciseActionMenuHidden(true);
            } else {
                setActionMenuExerciseId(exerciseId);
                setIsExerciseActionMenuHidden(false);
            }
        }
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

    function closePopups() {
        setIsPopUpActive(false);
        setIsCreateExerciseFormHidden(true);
        setIsUpdateExerciseFormHidden(true);
        setIsTransferExerciseFormHidden(true);
        setIsStartPracticeDecisionHidden(true);
        setIsViewPdfDecisionHidden(true);
        setIsUpdateExerciseSetFormHidden(true);
        setIsExerciseSetDeleteApprovalHidden(true);
        setIsExerciseDeleteApprovalHidden(true);
    }

    function invalidateTab() {
        if (!exerciseSet?._id) {
            return;
        }

        dispatch(tabsActions.invalidateTabPropsById(exerciseSet._id));
    }

    async function deleteExerciseSet(): Promise<{ isSuccess: boolean }> {
        const response = await ExerciseSetService.deleteById(exerciseSet._id);

        if (!response.isSuccess) alert(response.message);
        else {
            dispatch(refreshExerciseSetData());
        }

        return { isSuccess: response.isSuccess };
    }

    async function deleteExercise(): Promise<{ isSuccess: boolean }> {
        const response = await ExerciseService.deleteById(actionMenuExerciseId);

        if (!response.isSuccess) {
            alert(response.message);
        } else {
            invalidateTab();
        }

        return { isSuccess: response.isSuccess };
    }

    return (
        <ExerciseSetPopupsContext value={{ openCreateExerciseForm, openStartPracticeDecision, openViewPdfDecision, openUpdateExerciseSetForm, openExerciseSetDeleteApproval, openExerciseActionMenu }}>
            {children}

            <ExerciseActionMenu
                isHidden={isExerciseActionMenuHidden}
                setIsHidden={setIsExerciseActionMenuHidden}
                exerciseId={actionMenuExerciseId}
                ref={exerciseActionMenuRef}
                toggleUpdateExerciseForm={toggleUpdateExerciseForm}
                toggleTransferExerciseForm={toggleTransferExerciseForm}
                toggleDeleteApproval={toggleExerciseDeleteApproval}
            />

            <BodyModal
                isPopUpActive={isPopUpActive}
                onOverlayClick={closePopups}
                components={[
                    <CreateExerciseForm
                        key='create-exercise-form'
                        isHidden={isCreateExerciseFormHidden}
                        setIsHidden={setIsCreateExerciseFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        onClose={closePopups}
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
                            onClose={closePopups}
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
                        onClose={closePopups}
                        refreshData={invalidateTab}
                    />,
                    <StartPracticeDecision
                        key='start-practice-decision'
                        isHidden={isStartPracticeDecisionHidden}
                        setIsHidden={setIsStartPracticeDecisionHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        onClose={closePopups}
                        exerciseSet={exerciseSet}
                        refreshData={invalidateTab}
                        isPublicAccess={false}
                    />,
                    <ViewPdfDecision
                        key='view-pdf-decision'
                        isHidden={isViewPdfDecisionHidden}
                        setIsHidden={setIsViewPdfDecisionHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        onClose={closePopups}
                        exerciseSet={exerciseSet}
                        isPublicAccess={false}
                    />,
                    <UpdateExerciseSetForm
                        key='update-exercise-set-form'
                        isHidden={isUpdateExerciseSetFormHidden}
                        setIsHidden={setIsUpdateExerciseSetFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        onClose={closePopups}
                        refreshData={invalidateTab}
                        exerciseSet={exerciseSet}
                    />,
                    <CriticOperationApproval // for exercise set
                        key='exercise-set-delete-approval'
                        isHidden={isExerciseSetDeleteApprovalHidden}
                        setIsHidden={setIsExerciseSetDeleteApprovalHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        onClose={closePopups}
                        onDelete={deleteExerciseSet}
                    />,
                    <CriticOperationApproval // for selected exercise
                        key='exercise-delete-approval'
                        isHidden={isExerciseDeleteApprovalHidden}
                        setIsHidden={setIsExerciseDeleteApprovalHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        onClose={closePopups}
                        onDelete={deleteExercise}
                    />,
                    <LoadingPage key='loading-page' isHidden={isLoadingPageHidden} />,
                ]}
            />
        </ExerciseSetPopupsContext>
    );
}
