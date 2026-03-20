import React from 'react';
import { CreateExerciseSetForm } from 'src/features/exercise-set/components/CreateExerciseSetForm';
import { ExerciseSetActionMenu } from 'src/features/exercise-set/components/ExerciseSetActionMenu';
import { UpdateExerciseSetForm } from 'src/features/exercise-set/components/UpdateExerciseSetForm';
import { ExerciseSetsPopupsContext } from 'src/features/exercise-set/contexts/exercise-sets-popups.context';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import { refreshExerciseSetData } from 'src/features/exercise-set/store/thunks/refresh-exercise-set-data.thunk';
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
    const [isDeleteApprovalHidden, setIsDeleteApprovalHidden] = React.useState(true);

    const [actionMenuExerciseSet, setActionMenuExerciseSet] = React.useState<ExerciseSet>();

    const actionMenuRef = React.useRef<HTMLDivElement>(null);

    function openCreateExerciseSetForm() {
        setIsPopUpActive(true);
        setIsCreateExerciseSetFormHidden(false);
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

    function toggleDeleteApproval() {
        setIsPopUpActive((prev) => !prev);
        setIsDeleteApprovalHidden((prev) => !prev);
    }

    function closePopups() {
        setIsPopUpActive(false);
        setIsCreateExerciseSetFormHidden(true);
        setIsStartPracticeDecisionHidden(true);
        setIsUpdateExerciseSetFormHidden(true);
        setIsDeleteApprovalHidden(true);
    }

    async function deleteExerciseSet(): Promise<{ isSuccess: boolean }> {
        if (actionMenuExerciseSet) {
            const response = await ExerciseSetService.deleteById(actionMenuExerciseSet._id);

            if (!response.isSuccess) alert(response.message);
            else {
                dispatch(refreshExerciseSetData());
                dispatch(tabsActions.closeTabById(actionMenuExerciseSet._id));
            }

            return { isSuccess: response.isSuccess };
        }

        alert('no exercise set found to delete');
        return { isSuccess: false };
    }

    return (
        <ExerciseSetsPopupsContext value={{ openCreateExerciseSetForm, openExerciseSetActionMenu }}>
            {children}

            <ExerciseSetActionMenu
                isHidden={isExerciseSetActionMenuHidden}
                setIsHidden={setIsExerciseSetActionMenuHidden}
                exerciseSet={actionMenuExerciseSet}
                ref={actionMenuRef}
                toggleStartPracticeDecision={toggleStartPracticeDecision}
                toggleUpdateExerciseSetForm={toggleUpdateExerciseSetForm}
                toggleDeleteApproval={toggleDeleteApproval}
            />

            <BodyModal
                isPopUpActive={isPopUpActive}
                onOverlayClick={closePopups}
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
                    ...[actionMenuExerciseSet &&
                        <StartPracticeDecision
                            key='start-practice-decision'
                            isHidden={isStartPracticeDecisionHidden}
                            setIsHidden={setIsStartPracticeDecisionHidden}
                            setIsPopUpActive={setIsPopUpActive}
                            setIsLoadingPageHidden={setIsLoadingPageHidden}
                            onClose={closePopups}
                            exerciseSet={actionMenuExerciseSet}
                            refreshData={() => dispatch(refreshExerciseSetData())}
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
                            refreshData={() => dispatch(refreshExerciseSetData())}
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
