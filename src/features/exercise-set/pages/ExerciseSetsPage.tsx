import React, { useEffect, useState } from 'react';
import { exerciseSetService } from '../services/exercise-set.service';
import { ExerciseSetCard } from '../components/ExerciseSetCard';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { BodyModal } from 'src/shared/components/BodyModal';
import { DeleteApproval } from 'src/shared/components/DeleteApproval';
import { ExerciseSetActionMenu } from 'src/features/exercise-set/components/ExerciseSetActionMenu';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { extendedSourcesActions } from 'src/features/source/store/extended-sources.slice';

export function ExerciseSetsPage({ className }: { className?: string }) {
    const dispatch = useAppDispatch();
    const layoutDimensions = useAppSelector((state) => state.layoutDimensions);
    const extendedSources = useAppSelector((state) => state.extendedSources);
    const [isExerciseSetActionMenuHidden, setIsExerciseSetActionMenuHidden] =
        useState<boolean>(true);
    const [actionMenuExerciseSet, setActionMenuExerciseSet] = useState<ExerciseSet>();
    const [isPopUpActive, setIsPopUpActive] = useState<boolean>(false);
    const [isDeleteApprovalHidden, setIsDeleteApprovalHidden] = useState<boolean>(true);
    const [isLoadingPageHidden, setIsLoadingPageHidden] = useState<boolean>(true);

    function updateExtendedSources() {
        dispatch(extendedSourcesActions.fetchData());
    }

    useEffect(() => {
        updateExtendedSources();
    }, []);

    function toggleExerciseSetActionMenu(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        exerciseSet: ExerciseSet
    ) {
        event.stopPropagation();
        const exerciseSetActionMenu = document.getElementById('exercise-set-action-menu');
        const container = document.getElementById('exercise-sets-page-container');
        if (exerciseSetActionMenu && container) {
            const containerRect = container?.getBoundingClientRect();
            const positionOfButton = event.currentTarget.getBoundingClientRect();
            exerciseSetActionMenu.style.top = `${positionOfButton.bottom - containerRect?.top}px`;
            exerciseSetActionMenu.style.left = `${positionOfButton.right - containerRect?.left}px`;
            setActionMenuExerciseSet(exerciseSet);
            setIsExerciseSetActionMenuHidden((prev) => !prev);
        }
    }

    function toggleDeleteApproval() {
        setIsPopUpActive((prev) => !prev);
        setIsDeleteApprovalHidden((prev) => !prev);
    }

    async function deleteExerciseSet(): Promise<string> {
        let responseMessage;
        if (actionMenuExerciseSet) {
            responseMessage = (await exerciseSetService.deleteById(actionMenuExerciseSet?._id))
                .message;
            updateExtendedSources();
        } else {
            responseMessage = 'no exercise set found to delete';
        }

        return responseMessage;
    }

    return (
        <div
            id="exercise-sets-page-container"
            className={`relative w-full h-full ${className ?? ''}`}
        >
            <ExerciseSetActionMenu
                isHidden={isExerciseSetActionMenuHidden}
                setIsHidden={setIsExerciseSetActionMenuHidden}
                exerciseSet={actionMenuExerciseSet}
                // fetchExerciseSets={fetchExerciseSets}
                toggleDeleteApproval={toggleDeleteApproval}
            />

            <div // main
                className={`absolute w-full h-full p-4
                flex flex-col justify-start items-center`}
            >
                <div
                    className="w-full h-[auto]
                    flex flex-col justify-center items-center p-4"
                >
                    <p className="text-2xl font-bold">Exercise Sets</p>
                </div>
                <div
                    className="w-full h-auto p-4
                    flex flex-col justify-start items-start gap-10"
                >
                    {extendedSources.map((extendedSource) => (
                            <>
                                {extendedSource.exerciseSets &&
                                    extendedSource.exerciseSets.length > 0 && (
                                        <>
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
                                                    className={`w-[${layoutDimensions.exerciseSetsContainer.width}px] flex justify-start items-center gap-4 overflow-x-auto`}
                                                >
                                                    {extendedSource.exerciseSets &&
                                                        extendedSource.exerciseSets.map(
                                                            (exerciseSet) => (
                                                                <ExerciseSetCard
                                                                    exerciseSet={exerciseSet}
                                                                    toggleExerciseSetActionMenu={
                                                                        toggleExerciseSetActionMenu
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                {extendedSource.processedSources?.map((processedSource) => (
                                    <>
                                        {processedSource.exerciseSets &&
                                            processedSource.exerciseSets?.length > 0 && (
                                                <div
                                                    className="w-full h-auto p-4
                                            flex flex-col justify-start items-start gap-2"
                                                >
                                                    <div className="flex justify-start items-center gap-2">
                                                        <p className="font-serif font-semibold">
                                                            Processed Source:{' '}
                                                        </p>
                                                        <p>
                                                            {processedSource.title ||
                                                            processedSource.title.length > 0
                                                                ? processedSource.title
                                                                : processedSource._id}
                                                        </p>
                                                    </div>
                                                    <div
                                                        className={`w-[${layoutDimensions.exerciseSetsContainer.width}px] flex justify-start items-center gap-4 overflow-x-auto`}
                                                    >
                                                        {processedSource.exerciseSets &&
                                                            processedSource.exerciseSets.map(
                                                                (exerciseSet) => (
                                                                    <ExerciseSetCard
                                                                        exerciseSet={
                                                                            exerciseSet
                                                                        }
                                                                        toggleExerciseSetActionMenu={
                                                                            toggleExerciseSetActionMenu
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                    </div>
                                                </div>
                                            )}
                                    </>
                                ))}
                            </>
                        ))
                    }
                </div>
            </div>

            <BodyModal
                isPopUpActive={isPopUpActive}
                components={[
                    <DeleteApproval
                        isHidden={isDeleteApprovalHidden}
                        setIsHidden={setIsDeleteApprovalHidden}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        toggle={toggleDeleteApproval}
                        onDelete={deleteExerciseSet}
                    />,
                    <LoadingPage isHidden={isLoadingPageHidden} />,
                ]}
            />
        </div>
    );
}
