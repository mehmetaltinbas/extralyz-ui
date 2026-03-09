import React from 'react';
import { CreateExerciseSetForm } from 'src/features/exercise-set/components/CreateExerciseSetForm';
import { ExerciseSetActionMenu } from 'src/features/exercise-set/components/ExerciseSetActionMenu';
import { UpdateExerciseSetForm } from 'src/features/exercise-set/components/UpdateExerciseSetForm';
import { ExerciseSetsPopupsContext } from 'src/features/exercise-set/contexts/exercise-sets-popups.context';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import { refreshExerciseSetData } from 'src/features/exercise-set/store/thunks/refresh-exercise-set-data.thunk';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
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

        if (exerciseSetActionMenu && container) {
            const containerRect = container.getBoundingClientRect();
            const positionOfButton = event.currentTarget.getBoundingClientRect();

            exerciseSetActionMenu.style.top = `${positionOfButton.bottom - containerRect.top}px`;
            exerciseSetActionMenu.style.left = `${positionOfButton.right - containerRect.left}px`;

            setActionMenuExerciseSet(exerciseSet);
            setIsExerciseSetActionMenuHidden((prev) => !prev);
        }
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
                toggleUpdateExerciseSetForm={toggleUpdateExerciseSetForm}
                toggleDeleteApproval={toggleDeleteApproval}
            />

            <BodyModal
                isPopUpActive={isPopUpActive}
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
