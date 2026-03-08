import React from 'react';
import { CreateExerciseSetForm } from 'src/features/exercise-set/components/CreateExerciseSetForm';
import { SourceActionMenu } from 'src/features/source/components/SourceActionMenu';
import { UpdateSourceForm } from 'src/features/source/components/UpdateSourceForm';
import { SourceService } from 'src/features/source/services/source.service';
import type { DocumentNode } from 'src/features/source/types/document-node.interface';
import { type Source } from 'src/features/source/types/source.interface';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import ActionMenuTriggerer from 'src/shared/components/ActionMenuTriggerer';
import { BodyModal } from 'src/shared/components/BodyModal';
import { DeleteApproval } from 'src/shared/components/DeleteApproval';
import { DocumentRenderer } from 'src/shared/components/document-render/DocumentRenderer';
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
            sourceActionMenu.style.left = `${positionOfButton.right - containerRect.left}px`
            ;
            setIsActionMenuHidden((prev) => !prev);
        }
    }

    function invalidateTab() {
        if (!source._id) {
            return;
        }

        dispatch(tabsActions.invalidateTabPropsById(source._id));
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
        const response = await SourceService.deleteById(source._id);

        if (!response.isSuccess) alert(response.message);
        else invalidateTab();

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
                className="w-full h-auto pb-4 absolute
                flex flex-col justify-start items-center gap-4"
            >
                <div className='w-auto h-auto flex flex-col justify-start items-center'>
                    <p>{source.title}</p>

                    <p>{source.type}</p>

                    <ActionMenuTriggerer
                        onClick={(event) => toggleSourceActionMenu(event)}
                    />
                </div>

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
                        refreshData={invalidateTab}
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
