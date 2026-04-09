import React from 'react';
import { ChangeSourceForm } from 'src/features/exercise-set/components/ChangeSourceForm';
import { GenerateAdditionalExercisesForm } from 'src/features/exercise-set/components/GenerateAdditionalExercisesForm';
import { GenerateExerciseDecision } from 'src/features/exercise-set/components/GenerateExerciseDecision';
import { UpdateExerciseSetForm } from 'src/features/exercise-set/components/UpdateExerciseSetForm';
import { ExerciseSetPopupsContext } from 'src/features/exercise-set/contexts/exercise-set-popups.context';
import { ExerciseSetSourceType } from 'src/features/exercise-set/enums/exercise-set-source-type.enum';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import { refreshExerciseSetsData } from 'src/features/exercise-set/store/thunks/refresh-exercise-sets-data.thunk';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { CreateExerciseForm } from 'src/features/exercise/components/CreateExerciseForm';
import { ExerciseActionMenu } from 'src/features/exercise/components/ExerciseActionMenu';
import { GenerateWithContextForm } from 'src/features/exercise/components/GenerateWithContextForm';
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
    const [isGenerateExerciseDecisionHidden, setIsGenerateExerciseDecisionHidden] = React.useState(true);
    const [isGenerateAdditionalFormHidden, setIsGenerateAdditionalFormHidden] = React.useState(true);
    const [isChangeSourceFormHidden, setIsChangeSourceFormHidden] = React.useState(true);
    const [isGenerateWithContextFormHidden, setIsGenerateWithContextFormHidden] = React.useState(true);
    const [isExerciseDeleteApprovalHidden, setIsExerciseDeleteApprovalHidden] = React.useState(true);
    const [actionMenuExerciseId, setActionMenuExerciseId] = React.useState<string | null>(null);

    const actionMenuRef = React.useRef<HTMLDivElement>(null);

    function refreshData() {
        if (!exerciseSet?._id) {
            return;
        }
    
        dispatch(tabsActions.invalidateTabPropsById(exerciseSet._id));
        dispatch(refreshExerciseSetsData());
    }

    function openCreateExerciseForm() {
        setIsPopUpActive(true);

        if (exerciseSet.sourceType === ExerciseSetSourceType.SOURCE) {
            setIsGenerateExerciseDecisionHidden(false);
        } else {
            setIsCreateExerciseFormHidden(false);
        }
    }

    function onDecisionSelectManual() {
        setIsGenerateExerciseDecisionHidden(true);
        setIsCreateExerciseFormHidden(false);
    }

    function onDecisionSelectAI() {
        setIsGenerateExerciseDecisionHidden(true);
        setIsGenerateAdditionalFormHidden(false);
    }

    function onDecisionSelectContext() {
        setIsGenerateExerciseDecisionHidden(true);
        setIsGenerateWithContextFormHidden(false);
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

    function openChangeSourceForm() {
        setIsPopUpActive(true);
        setIsChangeSourceFormHidden(false);
    }

    function openExerciseActionMenu(
        event: React.MouseEvent<HTMLButtonElement>,
        exerciseId: string,
    ) {
        event.stopPropagation();
        const exerciseActionMenu = actionMenuRef.current;
        const container = containerRef.current;

        if (exerciseActionMenu && container && actionMenuRef.current) {
            const containerRect = container.getBoundingClientRect();
            const buttonRect = event.currentTarget.getBoundingClientRect();
            const actionMenuRect = actionMenuRef.current.getBoundingClientRect();

            exerciseActionMenu.style.top = `${buttonRect.bottom - containerRect.top}px`;
            exerciseActionMenu.style.left = `${buttonRect.right - (buttonRect.width / 2) - (actionMenuRect.width / 2) - containerRect.left}px`;

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
        setIsGenerateExerciseDecisionHidden(true);
        setIsGenerateAdditionalFormHidden(true);
        setIsExerciseSetDeleteApprovalHidden(true);
        setIsExerciseDeleteApprovalHidden(true);
        setIsChangeSourceFormHidden(true);
        setIsGenerateWithContextFormHidden(true);
    }

    async function deleteExerciseSet(): Promise<{ isSuccess: boolean }> {
        const response = await ExerciseSetService.deleteById(exerciseSet._id);

        if (!response.isSuccess) alert(response.message);
        else {
            dispatch(refreshExerciseSetsData());
            dispatch(tabsActions.closeTabById(exerciseSet._id));
        }

        return { isSuccess: response.isSuccess };
    }

    async function deleteExercise(): Promise<{ isSuccess: boolean }> {
        if (actionMenuExerciseId) {
            const response = await ExerciseService.deleteById(actionMenuExerciseId);
    
            if (!response.isSuccess) {
                alert(response.message);
            } else {
                refreshData();
            }
    
            return { isSuccess: response.isSuccess };
        }

        alert('no exercise set found to delete');
        return { isSuccess: false };
    }

    return (
        <ExerciseSetPopupsContext value={{ openCreateExerciseForm, openStartPracticeDecision, openViewPdfDecision, openUpdateExerciseSetForm, openExerciseSetDeleteApproval, openChangeSourceForm, openExerciseActionMenu }}>
            {children}

            <ExerciseActionMenu
                isHidden={isExerciseActionMenuHidden}
                setIsHidden={setIsExerciseActionMenuHidden}
                exerciseId={actionMenuExerciseId!}
                ref={actionMenuRef}
                toggleUpdateExerciseForm={toggleUpdateExerciseForm}
                toggleTransferExerciseForm={toggleTransferExerciseForm}
                toggleDeleteApproval={toggleExerciseDeleteApproval}
            />

            <BodyModal
                isPopUpActive={isPopUpActive}
                onOverlayClick={closePopups}
                isOverlayClickDisabled={!isLoadingPageHidden}
                components={[
                    <GenerateExerciseDecision
                        key='generate-exercise-decision'
                        isHidden={isGenerateExerciseDecisionHidden}
                        setIsHidden={setIsGenerateExerciseDecisionHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        onClose={closePopups}
                        onSelectManual={onDecisionSelectManual}
                        onSelectAI={onDecisionSelectAI}
                        onSelectContext={onDecisionSelectContext}
                    />,
                    <GenerateWithContextForm
                        key='generate-with-context-form'
                        isHidden={isGenerateWithContextFormHidden}
                        setIsHidden={setIsGenerateWithContextFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        onClose={closePopups}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        refreshData={refreshData}
                        exerciseSet={exerciseSet}
                    />,
                    <GenerateAdditionalExercisesForm
                        key='generate-additional-exercises-form'
                        isHidden={isGenerateAdditionalFormHidden}
                        setIsHidden={setIsGenerateAdditionalFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        onClose={closePopups}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        refreshData={refreshData}
                        exerciseSet={exerciseSet}
                    />,
                    <CreateExerciseForm
                        key='create-exercise-form'
                        isHidden={isCreateExerciseFormHidden}
                        setIsHidden={setIsCreateExerciseFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        onClose={closePopups}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        refreshData={refreshData}
                        exerciseSet={exerciseSet}
                    />,
                    ...[
                            exercises.find(localExercise => localExercise._id === actionMenuExerciseId) &&
                            <UpdateExerciseForm
                                key='update-exercise-form'
                                isHidden={isUpdateExerciseFormHidden}
                                setIsHidden={setIsUpdateExerciseFormHidden}
                                setIsPopUpActive={setIsPopUpActive}
                                setIsLoadingPageHidden={setIsLoadingPageHidden}
                                onClose={closePopups}
                                refreshData={refreshData}
                                exercise={exercises.find(localExercise => localExercise._id === actionMenuExerciseId)!}
                            />,
                            exercises.find(localExercise => localExercise._id === actionMenuExerciseId) &&
                            <TransferExerciseForm
                                key='transfer-exercise-form'
                                isHidden={isTransferExerciseFormHidden}
                                setIsHidden={setIsTransferExerciseFormHidden}
                                setIsPopUpActive={setIsPopUpActive}
                                exercise={exercises.find(localExercise => localExercise._id === actionMenuExerciseId)!}
                                currentExerciseSetId={exerciseSet._id}
                                onClose={closePopups}
                                refreshData={refreshData}
                                setIsLoadingPageHidden={setIsLoadingPageHidden}
                            />
                    ],
                    <StartPracticeDecision
                        key='start-practice-decision'
                        isHidden={isStartPracticeDecisionHidden}
                        setIsHidden={setIsStartPracticeDecisionHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        onClose={closePopups}
                        exerciseSet={exerciseSet}
                        refreshData={refreshData}
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
                        refreshData={refreshData}
                        exerciseSet={exerciseSet}
                    />,
                    <ChangeSourceForm
                        key='change-source-form'
                        isHidden={isChangeSourceFormHidden}
                        setIsHidden={setIsChangeSourceFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        onClose={closePopups}
                        refreshData={refreshData}
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
