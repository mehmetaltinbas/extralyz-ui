import React, { useEffect, useState } from 'react';
import { CreateExerciseSetForm } from 'src/features/exercise-set/components/CreateExerciseSetForm';
import { ProcessSourceForm } from 'src/features/processed-source/components/ProcessSourceForm';
import { CreateSourceForm } from 'src/features/source/components/CreateSourceForm';
import { SourceActionMenu } from 'src/features/source/components/SourceActionMenu';
import { sourcesActions } from 'src/features/source/store/sources.slice';
import { BodyModal } from 'src/shared/components/BodyModal';
import { DeleteApproval } from 'src/shared/components/DeleteApproval';
import { ButtonVariants } from 'src/shared/enums/button-variants.enum';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { Button } from '../../../shared/components/Button';
import { SourceCard } from '../components/SourceCard';
import { sourceService } from '../services/source.service';

export function SourcesPage({ className }: { className?: string }) {
    const dispatch = useAppDispatch();
    const sources = useAppSelector((state) => state.sources);
    const [isPopUpActive, setIsPopUpActive] = useState<boolean>(false);
    const [isSourceCreateFormHidden, setIsSourceCreateFormHidden] = useState<boolean>(true);
    const [actionMenuSourceId, setActionMenuSourceId] = useState<string>('');
    const [isSourceActionMenuHidden, setIsSourceActionMenuHidden] = useState<boolean>(true);
    const [isCreateExerciseSetFormHidden, setIsCreateExerciseSetFormHidden] =
        useState<boolean>(true);
    const [isProcessSourceFormHidden, setIsProcessSourceFormHidden] = useState<boolean>(true);
    const [isDeleteApproavelHidden, setIsDeleteApprovalHidden] = useState<boolean>(true);
    const [isLoadingPageHidden, setIsLoadingPageHidden] = useState<boolean>(true);

    function updateSourcesState() {
        dispatch(sourcesActions.fetchData());
    }

    useEffect(() => {
        updateSourcesState();
    }, []);

    function toggleSourceActionMenu(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        sourceId: string
    ) {
        event.stopPropagation();
        const sourceActionMenu = document.getElementById('source-action-menu');
        const container = document.getElementById('sources-page-container');
        if (sourceActionMenu && container) {
            const containerRect = container?.getBoundingClientRect();
            const positionOfButton = event.currentTarget.getBoundingClientRect();
            sourceActionMenu.style.top = `${positionOfButton.bottom - containerRect?.top}px`;
            sourceActionMenu.style.left = `${positionOfButton.right - containerRect?.left}px`;
            setActionMenuSourceId(sourceId);
            setIsSourceActionMenuHidden((prev) => !prev);
        }
    }

    function toggleCreateSourceForm() {
        setIsSourceCreateFormHidden((prev) => !prev);
        setIsPopUpActive((prev) => !prev);
    }

    function toggleProcessSourceForm() {
        setIsProcessSourceFormHidden((prev) => !prev);
        setIsPopUpActive((prev) => !prev);
    }

    function toggleCreateExerciseSetForm() {
        setIsCreateExerciseSetFormHidden((prev) => !prev);
        setIsPopUpActive((prev) => !prev);
    }

    function toggleDeleteApproval() {
        setIsDeleteApprovalHidden((prev) => !prev);
        setIsPopUpActive((prev) => !prev);
    }

    async function deleteSource(): Promise<string> {
        const response = await sourceService.deleteById(actionMenuSourceId);
        updateSourcesState();
        return response.message;
    }

    return (
        <div
            id="sources-page-container"
            className={`relative ${className ?? ''} w-full h-full`}
        >
            <SourceActionMenu
                isHidden={isSourceActionMenuHidden}
                setIsHidden={setIsSourceActionMenuHidden}
                sourceId={actionMenuSourceId}
                toggleCreateExerciseSetForm={toggleCreateExerciseSetForm}
                toggleProcessSourceForm={toggleProcessSourceForm}
                toggleDeleteApproval={toggleDeleteApproval}
            />

            <div // main
                className={`absolute w-full h-auto p-4
                grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8`}
            >
                <div
                    className="relative w-full h-auto p-4 col-span-1 sm:col-span-2 lg:col-span-3
                    flex flex justify-center items-center gap-2"
                >
                    <p className="text-2xl font-bold">Sources</p>
                    <Button variant={ButtonVariants.PRIMARY} onClick={toggleCreateSourceForm}>
                        new Source
                    </Button>
                </div>
                {sources.map((source) => (
                        <div className="flex justify-center items-center">
                            <SourceCard
                                source={source}
                                toggleSourceActionMenu={toggleSourceActionMenu}
                            />
                        </div>
                    ))
                }
            </div>

            <BodyModal
                isPopUpActive={isPopUpActive}
                components={[
                    <CreateSourceForm
                        isHidden={isSourceCreateFormHidden}
                        setIsHidden={setIsSourceCreateFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        toggle={toggleCreateSourceForm}
                        updateSources={updateSourcesState}
                    />,
                    <ProcessSourceForm
                        isHidden={isProcessSourceFormHidden}
                        setIsHidden={setIsProcessSourceFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        toggle={toggleProcessSourceForm}
                        sourceId={actionMenuSourceId}
                    />,
                    <CreateExerciseSetForm
                        isHidden={isCreateExerciseSetFormHidden}
                        setIsHidden={setIsCreateExerciseSetFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        toggle={toggleCreateExerciseSetForm}
                        sourceId={actionMenuSourceId}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                    />,
                    <DeleteApproval
                        isHidden={isDeleteApproavelHidden}
                        setIsHidden={setIsDeleteApprovalHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        toggle={toggleDeleteApproval}
                        onDelete={deleteSource}
                    />,
                    <LoadingPage isHidden={isLoadingPageHidden} />,
                ]}
            />
        </div>
    );
}
