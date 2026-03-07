import React from 'react';
import { CreateExerciseSetForm } from 'src/features/exercise-set/components/CreateExerciseSetForm';
import { SourceActionMenu } from 'src/features/source/components/SourceActionMenu';
import { UpdateSourceForm } from 'src/features/source/components/UpdateSourceForm';
import { sourceService } from 'src/features/source/services/source.service';
import { sourcesActions } from 'src/features/source/store/sources.slice';
import type { DocumentNode } from 'src/features/source/types/document-node.interface';
import { type Source } from 'src/features/source/types/source.interface';
import { BodyModal } from 'src/shared/components/BodyModal';
import { Button } from 'src/shared/components/Button';
import { DeleteApproval } from 'src/shared/components/DeleteApproval';
import { DocumentRenderer } from 'src/shared/components/document-render/DocumentRenderer';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch } from 'src/store/hooks';

export function SourcePage({ source, className }: { source: Source; className?: string }) {
    const dispatch = useAppDispatch();
    const [isActionMenuHidden, setIsActionMenuHidden] = React.useState<boolean>(true);
    const [isPopUpActive, setIsPopUpActive] = React.useState<boolean>(false);
    const [isCreateExerciseSetFormHidden, setIsCreateExerciseSetFormHidden] =
        React.useState<boolean>(true);
    const [isUpdateSourceFormHidden, setIsUpdateSourceFormHidden] = React.useState<boolean>(true);
    const [isDeleteApproavelHidden, setIsDeleteApprovalHidden] = React.useState<boolean>(true);
    const [isLoadingPageHidden, setIsLoadingPageHidden] = React.useState<boolean>(true);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const actionMenuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {}, []);

    function toggleSourceActionMenu(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation();
        const sourceActionMenu = actionMenuRef.current;
        const container = containerRef.current;
        if (sourceActionMenu && container) {
            const containerRect = container.getBoundingClientRect();
            const positionOfButton = event.currentTarget.getBoundingClientRect();
            sourceActionMenu.style.top = `${positionOfButton.bottom - containerRect.top}px`;
            sourceActionMenu.style.left = `${positionOfButton.right - containerRect.left}px`;
            setIsActionMenuHidden((prev) => !prev);
        }
    }

    async function updateSourcesState() {
        dispatch(sourcesActions.fetchData());
    }

    function toggleCreateExerciseSetForm() {
        setIsCreateExerciseSetFormHidden((prev) => !prev);
        setIsPopUpActive((prev) => !prev);
    }

    function toggleUpdateSourceForm() {
        setIsUpdateSourceFormHidden((prev) => !prev);
        setIsPopUpActive((prev) => !prev);
    }

    function toggleDeleteApproval() {
        setIsDeleteApprovalHidden((prev) => !prev);
        setIsPopUpActive((prev) => !prev);
    }

    async function deleteSource(): Promise<{ isSuccess: boolean }> {
        const response = await sourceService.deleteById(source._id);

        if (!response.isSuccess) alert(response.message);
        else await updateSourcesState();

        return { isSuccess: response.isSuccess };
    }

    return source ? (
        <div
            ref={containerRef}
            className={`${className ?? ''} w-full h-full relative p-2`}
        >
            <SourceActionMenu
                isHidden={isActionMenuHidden}
                setIsHidden={setIsActionMenuHidden}
                sourceId={source._id}
                ref={actionMenuRef}
                toggleCreateExerciseSetForm={toggleCreateExerciseSetForm}
                toggleUpdateSourceForm={toggleUpdateSourceForm}
                toggleDeleteApproval={toggleDeleteApproval}
            />

            <div
                className="w-full h-auto absolute pb-4
                flex flex-col justify-start items-center gap-4"
            >
                <div className="absolute top-0 right-0 flex flex-col">
                    <Button
                        variant={ButtonVariant.GHOST}
                        onClick={(event) => toggleSourceActionMenu(event)}
                    >
                        ...
                    </Button>
                </div>

                <p>{source.title}</p>

                <p>{source.type}</p>

                <DocumentRenderer docNode={JSON.parse(source.rawText) as DocumentNode} />
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
                        sourceId={source._id}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                    />,
                    <UpdateSourceForm
                        key='update-source-form'
                        isHidden={isUpdateSourceFormHidden}
                        setIsHidden={setIsUpdateSourceFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        toggle={toggleUpdateSourceForm}
                        refreshData={updateSourcesState}
                        source={source}
                    />,
                    <DeleteApproval
                        key='delete-approval'
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
    ) : (
        <>No source</>
    );
}
