import React from 'react';
import { CreateExerciseSetForm } from 'src/features/exercise-set/components/CreateExerciseSetForm';
import { ExerciseSetActionMenu } from 'src/features/exercise-set/components/ExerciseSetActionMenu';
import { ExerciseSetCard } from 'src/features/exercise-set/components/ExerciseSetCard';
import { UpdateExerciseSetForm } from 'src/features/exercise-set/components/UpdateExerciseSetForm';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import { selectIndependentExerciseSets } from 'src/features/exercise-set/store/selectors/select-independent-exercise-sets';
import { refreshExerciseSetData } from 'src/features/exercise-set/store/thunks/refresh-exercise-set-data.thunk';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { selectExtendedSources } from 'src/features/source/store/selectors/select-extended-sources';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { BodyModal } from 'src/shared/components/BodyModal';
import { Button } from 'src/shared/components/Button';
import { DeleteApproval } from 'src/shared/components/DeleteApproval';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function ExerciseSetsPage({ className }: { className?: string }) {
    const dispatch = useAppDispatch();
    const layoutDimensions = useAppSelector((state) => state.layoutDimensions);
    const independentExerciseSets = useAppSelector(selectIndependentExerciseSets);
    const extendedSources = useAppSelector(selectExtendedSources);

    const [isCreateExerciseSetFormHidden, setIsCreateExerciseSetFormHidden] =
        React.useState<boolean>(true);
    const [isExerciseSetActionMenuHidden, setIsExerciseSetActionMenuHidden] =
        React.useState<boolean>(true);
    const [actionMenuExerciseSet, setActionMenuExerciseSet] = React.useState<ExerciseSet>();
    const [isPopUpActive, setIsPopUpActive] = React.useState<boolean>(false);
    const [isUpdateExerciseSetFormHidden, setIsUpdateExerciseSetFormHidden] = React.useState<boolean>(true);
    const [isDeleteApprovalHidden, setIsDeleteApprovalHidden] = React.useState<boolean>(true);
    const [isLoadingPageHidden, setIsLoadingPageHidden] = React.useState<boolean>(true);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const actionMenuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        dispatch(refreshExerciseSetData());
    }, []);

    function toggleCreateExerciseSetForm() {
        setIsCreateExerciseSetFormHidden((prev) => !prev);
        setIsPopUpActive((prev) => !prev);
    }

    function toggleExerciseSetActionMenu(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
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

    async function deleteExerciseSet(): Promise<{ isSuccess: boolean }> {
        if (actionMenuExerciseSet) {
            const response = await ExerciseSetService.deleteById(actionMenuExerciseSet?._id);

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
        <div
            ref={containerRef}
            className={`relative w-full h-full ${className ?? ''}`}
        >
            <ExerciseSetActionMenu
                isHidden={isExerciseSetActionMenuHidden}
                setIsHidden={setIsExerciseSetActionMenuHidden}
                exerciseSet={actionMenuExerciseSet}
                ref={actionMenuRef}
                toggleUpdateExerciseSetForm={toggleUpdateExerciseSetForm}
                toggleDeleteApproval={toggleDeleteApproval}
            />

            <div // main
                className={`absolute w-full h-full p-4
                flex flex-col justify-start items-center`}
            >
                <div
                    className="relative w-full h-[auto]
                    flex flex-col justify-center items-center p-4"
                >
                    <p className="text-2xl font-bold">Exercise Sets</p>

                    <div className="absolute right-0">
                        <Button
                            variant={ButtonVariant.PRIMARY}
                            onClick={toggleCreateExerciseSetForm}
                        >
                            new exercise set
                        </Button>
                    </div>
                </div>

                <div // independents
                    className="w-full h-auto p-4
                    flex flex-col justify-start items-start gap-10"
                >
                    <div
                        className="w-full h-auto p-4
                        flex flex-col justify-start items-start gap-4"
                    >
                        <div className="w-full flex justify-start items-center gap-2 border-b-1">
                            <p className="font-serif font-semibold">Independents</p>
                        </div>
                        
                        <div
                            className={`w-[${layoutDimensions.exerciseSetsContainer.width}px] flex justify-start items-center gap-4 overflow-x-auto pb-1`} 
                        >
                            {independentExerciseSets.map((exerciseSet) => (
                                <ExerciseSetCard
                                    exerciseSet={exerciseSet}
                                    toggleExerciseSetActionMenu={toggleExerciseSetActionMenu}
                                />
                            ))}
                        </div>
                    </div>

                    {extendedSources.map((extendedSource) => (
                        <React.Fragment key={`extended-source-${extendedSource._id}`}>
                            {extendedSource.exerciseSets &&
                                extendedSource.exerciseSets.length > 0 && (
                                    <div
                                        className="w-full h-auto p-4
                                            flex flex-col justify-start items-start gap-4"
                                    >
                                        <div className="w-full flex justify-start items-center gap-2 border-b-1">
                                            <p className="font-serif font-semibold">
                                                Source:{' '}
                                            </p>
                                            <p>
                                                {extendedSource.title ||
                                                extendedSource.title.length > 0
                                                    ? extendedSource.title
                                                    : extendedSource._id}
                                            </p>
                                            <p className="font-serif italic">
                                                {extendedSource.type}
                                            </p>
                                        </div>
                                        <div
                                            className={`w-[${layoutDimensions.exerciseSetsContainer.width}px] flex justify-start items-center gap-4 overflow-x-auto pb-1`}
                                        >
                                            {extendedSource.exerciseSets &&
                                                extendedSource.exerciseSets.map(
                                                    (exerciseSet) => (
                                                        <ExerciseSetCard
                                                            key={`exercise-set-card-${exerciseSet._id}`}
                                                            exerciseSet={exerciseSet}
                                                            toggleExerciseSetActionMenu={
                                                                toggleExerciseSetActionMenu
                                                            }
                                                        />
                                                    )
                                                )}
                                        </div>
                                    </div>
                                )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <BodyModal
                isPopUpActive={isPopUpActive}
                components={[
                    <CreateExerciseSetForm
                        key='create-exercise-set-form'
                        isHidden={isCreateExerciseSetFormHidden}
                        setIsHidden={setIsCreateExerciseSetFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        toggle={toggleCreateExerciseSetForm}
                        sourceId={undefined}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                    />,
                    ...[actionMenuExerciseSet &&
                        <UpdateExerciseSetForm
                            isHidden={isUpdateExerciseSetFormHidden}
                            setIsHidden={setIsUpdateExerciseSetFormHidden}
                            setIsPopUpActive={setIsPopUpActive}
                            setIsLoadingPageHidden={setIsLoadingPageHidden}
                            toggle={toggleUpdateExerciseSetForm}
                            refreshData={() => dispatch(refreshExerciseSetData())}
                            exerciseSet={actionMenuExerciseSet}
                        />
                    ],
                    <DeleteApproval
                        key='exercise-set-delete-approval'
                        isHidden={isDeleteApprovalHidden}
                        setIsHidden={setIsDeleteApprovalHidden}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        toggle={toggleDeleteApproval}
                        onDelete={deleteExerciseSet}
                    />,
                    <LoadingPage key='loading-page' isHidden={isLoadingPageHidden} />,
                ]}
            />
        </div>
    );
}
