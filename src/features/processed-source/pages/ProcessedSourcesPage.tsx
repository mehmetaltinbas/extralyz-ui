import React, { useEffect, useState } from 'react';
import type { ProcessedSource } from '../types/processed-source.interface';
import { processedSourceService } from '../services/processed-source.service';
import { BlackButton } from '../../../shared/components/buttons/BlackButton';
import { ProcessedSourceCard } from '../components/ProcessedSourceCard';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { ProcessedSourceActionMenu } from 'src/features/processed-source/components/ProcessedSourceActionMenu';
import { CreateExerciseSetForm } from 'src/features/exercise-set/components/CreateExerciseSetForm';
import { ClaretButton } from 'src/shared/components/buttons/ClaretButton';
import { DeleteApproval } from 'src/shared/components/DeleteApproval';
import { BodyModal } from 'src/shared/components/BodyModal';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { processedSourcesActions } from 'src/features/processed-source/store/processed-sources.slice';

export function ProcessedSourcesPage({ className }: { className?: string }) {
    const dispatch = useAppDispatch();
    const processedSources = useAppSelector((state) => state.processedSources);
    const [actionMenuSourceId, setActionMenuSourceId] = useState<string>('');
    const [isPopUpActive, setIsPopUpActive] = useState<boolean>(false);
    const [isSourceActionMenuHidden, setIsSourceActionMenuHidden] = useState<boolean>(true);
    const [isCreateExerciseSetFormHidden, setIsCreateExerciseSetFormHidden] =
        useState<boolean>(true);
    const [isDeleteApproavelHidden, setIsDeleteApprovalHidden] = useState<boolean>(true);
    const [isLoadingPageHidden, setIsLoadingPageHidden] = useState<boolean>(true);

    async function updateProcessedSources() {
        dispatch(processedSourcesActions.fetchData());
    }

    useEffect(() => {
        updateProcessedSources();
    }, []);

    function toggleProcessedSourceActionMenu(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        sourceId: string
    ) {
        event.stopPropagation();
        const sourceActionMenu = document.getElementById('processed-source-action-menu');
        const container = document.getElementById('processed-sources-page-container');
        if (sourceActionMenu && container) {
            const containerRect = container?.getBoundingClientRect();
            const positionOfButton = event.currentTarget.getBoundingClientRect();
            sourceActionMenu.style.top = `${positionOfButton.bottom - containerRect?.top}px`;
            sourceActionMenu.style.left = `${positionOfButton.right - containerRect?.left}px`;
            setActionMenuSourceId(sourceId);
            setIsSourceActionMenuHidden((prev) => !prev);
        }
    }

    function toggleCreateExerciseSetForm() {
        setIsCreateExerciseSetFormHidden((prev) => !prev);
        setIsPopUpActive((prev) => !prev);
    }

    function toggleDeleteApproval() {
        setIsDeleteApprovalHidden((prev) => !prev);
        setIsPopUpActive((prev) => !prev);
    }

    async function deleteProcessedSource(): Promise<string> {
        const response = await processedSourceService.deleteById(actionMenuSourceId);
        updateProcessedSources();
        return response.message;
    }

    return (
        <div
            id="processed-sources-page-container"
            className={`w-full h-full flex flex-col justify-start items-center ${className ?? ''}`}
        >
            <ProcessedSourceActionMenu
                isHidden={isSourceActionMenuHidden}
                setIsHidden={setIsSourceActionMenuHidden}
                processedSourceId={actionMenuSourceId}
                fetchProcessedSources={updateProcessedSources}
                toggleCreateExerciseSetForm={toggleCreateExerciseSetForm}
                toggleDeleteApproval={toggleDeleteApproval}
            />

            <div // main
                className="w-full h-auto p-4 col-span-1 sm:col-span-2 lg:col-span-3
                grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                <div
                    className="w-full h-auto col-span-3
                    flex flex-col justify-center items-center p-4"
                >
                    <p className="text-2xl font-bold">Processed Sources</p>
                </div>
                {processedSources.map((processedSources) => (
                        <ProcessedSourceCard
                            processedSource={processedSources}
                            fetchProcessedSources={updateProcessedSources}
                            toggleSourceActionMenu={toggleProcessedSourceActionMenu}
                        />
                    ))
                }
            </div>

            <BodyModal
                isPopUpActive={isPopUpActive}
                components={[
                    <CreateExerciseSetForm
                        isHidden={isCreateExerciseSetFormHidden}
                        setIsHidden={setIsCreateExerciseSetFormHidden}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        sourceId={actionMenuSourceId}
                        toggle={toggleCreateExerciseSetForm}
                    />,
                    <DeleteApproval
                        isHidden={isDeleteApproavelHidden}
                        setIsHidden={setIsDeleteApprovalHidden}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        toggle={toggleDeleteApproval}
                        onDelete={deleteProcessedSource}
                    />,
                    <LoadingPage isHidden={isLoadingPageHidden} />,
                ]}
            ></BodyModal>
        </div>
    );
}
