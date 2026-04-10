import React from 'react';
import { CreateExerciseSetGroupForm } from 'src/features/exercise-set-group/components/CreateExerciseSetGroupForm';
import { ChangeSourceForm } from 'src/features/exercise-set/components/ChangeSourceForm';
import { CreateExerciseSetForm } from 'src/features/exercise-set/components/CreateExerciseSetForm';
import { ExerciseSetActionMenu } from 'src/features/exercise-set/components/ExerciseSetActionMenu';
import { GenerateNotesForm } from 'src/features/exercise-set/components/GenerateNotesForm';
import { UpdateExerciseSetForm } from 'src/features/exercise-set/components/UpdateExerciseSetForm';
import { ExerciseSetsPopupsContext } from 'src/features/exercise-set/contexts/exercise-sets-popups.context';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import { refreshExerciseSetsData } from 'src/features/exercise-set/store/thunks/refresh-exercise-sets-data.thunk';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { StartPracticeDecision } from 'src/features/exercise/components/StartPracticeDecision';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { BodyModal } from 'src/shared/components/BodyModal';
import { CriticOperationApproval } from 'src/shared/components/CriticOperationApproval';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch } from 'src/store/hooks';

export function ExerciseSetsPopupsProvider({
    children,
    containerRef,
}: {
    children: React.ReactNode;
    containerRef: React.RefObject<HTMLDivElement | null>;
}) {
    const dispatch = useAppDispatch();

    const [isPopUpActive, setIsPopUpActive] = React.useState(false);
    const [isLoadingPageHidden, setIsLoadingPageHidden] = React.useState(true);
    const [isCreateExerciseSetFormHidden, setIsCreateExerciseSetFormHidden] = React.useState(true);
    const [isExerciseSetActionMenuHidden, setIsExerciseSetActionMenuHidden] = React.useState(true);
    const [isStartPracticeDecisionHidden, setIsStartPracticeDecisionHidden] = React.useState(true);
    const [isUpdateExerciseSetFormHidden, setIsUpdateExerciseSetFormHidden] = React.useState(true);
    const [isChangeSourceFormHidden, setIsChangeSourceFormHidden] = React.useState(true);
    const [isDeleteApprovalHidden, setIsDeleteApprovalHidden] = React.useState(true);
    const [isGenerateNotesFormHidden, setIsGenerateNotesFormHidden] = React.useState(true);
    const [isCreateGroupFormHidden, setIsCreateGroupFormHidden] = React.useState(true);

    const [actionMenuExerciseSet, setActionMenuExerciseSet] = React.useState<ExerciseSet>();

    const actionMenuRef = React.useRef<HTMLDivElement>(null);

    function refreshData() {
        dispatch(refreshExerciseSetsData());
    }

    function openCreateExerciseSetForm() {
        setIsPopUpActive(true);
        setIsCreateExerciseSetFormHidden(false);
    }

    function openCreateGroupForm() {
        setIsPopUpActive(true);
        setIsCreateGroupFormHidden(false);
    }

    function openExerciseSetActionMenu(
        event: React.MouseEvent<HTMLButtonElement>,
        exerciseSet: ExerciseSet
    ) {
        event.stopPropagation();
        const exerciseSetActionMenu = actionMenuRef.current;
        const container = containerRef.current;

        if (exerciseSetActionMenu && container && actionMenuRef.current) {
            const containerRect = container.getBoundingClientRect();
            const buttonRect = event.currentTarget.getBoundingClientRect();
            const actionMenuRect = actionMenuRef.current.getBoundingClientRect();

            exerciseSetActionMenu.style.top = `${buttonRect.bottom - containerRect.top}px`;
            exerciseSetActionMenu.style.left = `${buttonRect.right - (buttonRect.width / 2) - (actionMenuRect.width / 2) - containerRect.left}px`;

            if (!isExerciseSetActionMenuHidden && actionMenuExerciseSet?._id === exerciseSet._id) {
                setIsExerciseSetActionMenuHidden(true);
            } else {
                setActionMenuExerciseSet(exerciseSet);
                setIsExerciseSetActionMenuHidden(false);
            }
        }
    }

    function toggleStartPracticeDecision() {
        setIsPopUpActive((prev) => !prev);
        setIsStartPracticeDecisionHidden((prev) => !prev);
    }

    function toggleUpdateExerciseSetForm() {
        setIsPopUpActive((prev) => !prev);
        setIsUpdateExerciseSetFormHidden((prev) => !prev);
    }

    function toggleChangeSourceForm() {
        setIsPopUpActive((prev) => !prev);
        setIsChangeSourceFormHidden((prev) => !prev);
    }

    function toggleDeleteApproval() {
        setIsPopUpActive((prev) => !prev);
        setIsDeleteApprovalHidden((prev) => !prev);
    }

    function toggleGenerateNotesForm() {
        setIsPopUpActive((prev) => !prev);
        setIsGenerateNotesFormHidden((prev) => !prev);
    }

    function closePopups() {
        setIsPopUpActive(false);
        setIsCreateExerciseSetFormHidden(true);
        setIsCreateGroupFormHidden(true);
        setIsStartPracticeDecisionHidden(true);
        setIsUpdateExerciseSetFormHidden(true);
        setIsChangeSourceFormHidden(true);
        setIsDeleteApprovalHidden(true);
        setIsGenerateNotesFormHidden(true);
    }

    async function deleteExerciseSet(): Promise<{ isSuccess: boolean }> {
        if (actionMenuExerciseSet) {
            const response = await ExerciseSetService.deleteById(actionMenuExerciseSet._id);

            if (!response.isSuccess) alert(response.message);
            else {
                dispatch(refreshExerciseSetsData());
                dispatch(tabsActions.closeTabById(actionMenuExerciseSet._id));
            }

            return { isSuccess: response.isSuccess };
        }

        alert('no exercise set found to delete');
        return { isSuccess: false };
    }

    return (
        <ExerciseSetsPopupsContext value={{ openCreateExerciseSetForm, openCreateGroupForm, openExerciseSetActionMenu }}>
            {children}

            <ExerciseSetActionMenu
                isHidden={isExerciseSetActionMenuHidden}
                setIsHidden={setIsExerciseSetActionMenuHidden}
                exerciseSet={actionMenuExerciseSet}
                ref={actionMenuRef}
                toggleStartPracticeDecision={toggleStartPracticeDecision}
                toggleUpdateExerciseSetForm={toggleUpdateExerciseSetForm}
                toggleChangeSourceForm={toggleChangeSourceForm}
                toggleDeleteApproval={toggleDeleteApproval}
                toggleGenerateNotesForm={toggleGenerateNotesForm}
            />

            <BodyModal
                isPopUpActive={isPopUpActive}
                onOverlayClick={closePopups}
                isOverlayClickDisabled={!isLoadingPageHidden}
                components={[
                    <CreateExerciseSetForm
                        key='create-exercise-set-form'
                        isHidden={isCreateExerciseSetFormHidden}
                        setIsHidden={setIsCreateExerciseSetFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        onClose={closePopups}
                        sourceId={undefined}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                    />,
                    <CreateExerciseSetGroupForm
                        key='create-exercise-set-group-form'
                        isHidden={isCreateGroupFormHidden}
                        setIsHidden={setIsCreateGroupFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        onClose={closePopups}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                    />,
                    ...[actionMenuExerciseSet &&
                        <StartPracticeDecision
                            key='start-practice-decision'
                            isHidden={isStartPracticeDecisionHidden}
                            setIsHidden={setIsStartPracticeDecisionHidden}
                            setIsPopUpActive={setIsPopUpActive}
                            setIsLoadingPageHidden={setIsLoadingPageHidden}
                            onClose={closePopups}
                            exerciseSet={actionMenuExerciseSet}
                            refreshData={refreshData}
                            isPublicAccess={false}
                        />
                    ],
                    ...[actionMenuExerciseSet &&
                        <UpdateExerciseSetForm
                            isHidden={isUpdateExerciseSetFormHidden}
                            setIsHidden={setIsUpdateExerciseSetFormHidden}
                            setIsPopUpActive={setIsPopUpActive}
                            setIsLoadingPageHidden={setIsLoadingPageHidden}
                            onClose={closePopups}
                            refreshData={refreshData}
                            exerciseSet={actionMenuExerciseSet}
                        />
                    ],
                    ...[actionMenuExerciseSet &&
                        <ChangeSourceForm
                            isHidden={isChangeSourceFormHidden}
                            setIsHidden={setIsChangeSourceFormHidden}
                            setIsPopUpActive={setIsPopUpActive}
                            setIsLoadingPageHidden={setIsLoadingPageHidden}
                            onClose={closePopups}
                            refreshData={refreshData}
                            exerciseSet={actionMenuExerciseSet}
                        />
                    ],
                    ...[actionMenuExerciseSet &&
                        <GenerateNotesForm
                            key='generate-notes-form'
                            isHidden={isGenerateNotesFormHidden}
                            setIsHidden={setIsGenerateNotesFormHidden}
                            setIsPopUpActive={setIsPopUpActive}
                            onClose={closePopups}
                            setIsLoadingPageHidden={setIsLoadingPageHidden}
                            refreshData={refreshData}
                            exerciseSet={actionMenuExerciseSet}
                        />
                    ],
                    <CriticOperationApproval
                        key='exercise-set-delete-approval'
                        isHidden={isDeleteApprovalHidden}
                        setIsHidden={setIsDeleteApprovalHidden}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        onClose={closePopups}
                        onDelete={deleteExerciseSet}
                    />,
                    <LoadingPage key='loading-page' isHidden={isLoadingPageHidden} />,
                ]}
            />
        </ExerciseSetsPopupsContext>
    );
}
