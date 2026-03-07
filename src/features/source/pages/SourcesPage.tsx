import React from 'react';
import { CreateExerciseSetForm } from 'src/features/exercise-set/components/CreateExerciseSetForm';
import { CreateSourceForm } from 'src/features/source/components/CreateSourceForm';
import { SourceActionMenu } from 'src/features/source/components/SourceActionMenu';
import { SourceCard } from 'src/features/source/components/SourceCard';
import { sourceService } from 'src/features/source/services/source.service';
import { sourcesActions } from 'src/features/source/store/sources.slice';
import { BodyModal } from 'src/shared/components/BodyModal';
import { Button } from 'src/shared/components/Button';
import { DeleteApproval } from 'src/shared/components/DeleteApproval';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function SourcesPage({ className }: { className?: string }) {
    const dispatch = useAppDispatch();
    const sources = useAppSelector((state) => state.sources);
    const [isPopUpActive, setIsPopUpActive] = React.useState<boolean>(false);
    const [isSourceCreateFormHidden, setIsSourceCreateFormHidden] =
        React.useState<boolean>(true);
    const [actionMenuSourceId, setActionMenuSourceId] = React.useState<string>('');
    const [isSourceActionMenuHidden, setIsSourceActionMenuHidden] =
        React.useState<boolean>(true);
    const [isCreateExerciseSetFormHidden, setIsCreateExerciseSetFormHidden] =
        React.useState<boolean>(true);
    const [isDeleteApproavelHidden, setIsDeleteApprovalHidden] = React.useState<boolean>(true);
    const [isLoadingPageHidden, setIsLoadingPageHidden] = React.useState<boolean>(true);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const actionMenuRef = React.useRef<HTMLDivElement>(null);

    function updateSourcesState() {
        dispatch(sourcesActions.fetchData());
    }

    React.useEffect(() => {
        updateSourcesState();
    }, []);

    function toggleSourceActionMenu(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        sourceId: string
    ) {
        event.stopPropagation();
        
        const sourceActionMenu = actionMenuRef.current;
        const container = containerRef.current;

        if (sourceActionMenu && container) {
            const containerRect = container.getBoundingClientRect();
            const positionOfButton = event.currentTarget.getBoundingClientRect();

            sourceActionMenu.style.top = `${positionOfButton.bottom - containerRect.top}px`;
            sourceActionMenu.style.left = `${positionOfButton.right - containerRect.left}px`;

            setActionMenuSourceId(sourceId);
            setIsSourceActionMenuHidden((prev) => !prev);
        }
    }

    function toggleCreateSourceForm() {
        setIsSourceCreateFormHidden((prev) => !prev);
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

    async function deleteSource(): Promise<{ isSuccess: boolean }> {
        const response = await sourceService.deleteById(actionMenuSourceId);

        if (!response.isSuccess) alert(response.message);
        else updateSourcesState();

        return { isSuccess: response.isSuccess };
    }

    return (
        <div
            ref={containerRef}
            className={`relative ${className ?? ''} w-full h-full`}
        >
            <SourceActionMenu
                isHidden={isSourceActionMenuHidden}
                setIsHidden={setIsSourceActionMenuHidden}
                sourceId={actionMenuSourceId}
                ref={actionMenuRef}
                toggleCreateExerciseSetForm={toggleCreateExerciseSetForm}
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
                    <Button variant={ButtonVariant.PRIMARY} onClick={toggleCreateSourceForm}>
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
                ))}
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
