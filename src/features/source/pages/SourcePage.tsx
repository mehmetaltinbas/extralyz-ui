import React, { useEffect, useState } from 'react';
import { CreateExerciseSetForm } from 'src/features/exercise-set/components/CreateExerciseSetForm';
import { SourceActionMenu } from 'src/features/source/components/SourceActionMenu';
import { sourceService } from 'src/features/source/services/source.service';
import { sourcesActions } from 'src/features/source/store/sources.slice';
import type { DocumentNode } from 'src/features/source/types/document-node.interface';
import { type Source } from 'src/features/source/types/source.interface';
import { BodyModal } from 'src/shared/components/BodyModal';
import { Button } from 'src/shared/components/Button';
import { DeleteApproval } from 'src/shared/components/DeleteApproval';
import { DocumentRenderer } from 'src/shared/components/document-render/DocumentRenderer';
import { ButtonVariants } from 'src/shared/enums/button-variants.enum';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch } from 'src/store/hooks';

export function SourcePage({ source, className }: { source: Source; className?: string }) {
    const dispatch = useAppDispatch();
    const [isActionMenuHidden, setIsActionMenuHidden] = useState<boolean>(true);
    const [isPopUpActive, setIsPopUpActive] = useState<boolean>(false);
    const [isCreateExerciseSetFormHidden, setIsCreateExerciseSetFormHidden] =
        useState<boolean>(true);
    const [isDeleteApproavelHidden, setIsDeleteApprovalHidden] = useState<boolean>(true);
    const [isLoadingPageHidden, setIsLoadingPageHidden] = useState<boolean>(true);

    useEffect(() => {}, []);

    function toggleSourceActionMenu(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation();
        const sourceActionMenu = document.getElementById('source-action-menu');
        const container = document.getElementById('source-page-container');
        if (sourceActionMenu && container) {
            const containerRect = container?.getBoundingClientRect();
            const positionOfButton = event.currentTarget.getBoundingClientRect();
            sourceActionMenu.style.top = `${positionOfButton.bottom - containerRect?.top}px`;
            sourceActionMenu.style.left = `${positionOfButton.right - containerRect?.left}px`;
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

    function toggleDeleteApproval() {
        setIsDeleteApprovalHidden((prev) => !prev);
        setIsPopUpActive((prev) => !prev);
    }

    async function deleteSource(): Promise<string> {
        const response = await sourceService.deleteById(source._id);
        await updateSourcesState();
        return response.message;
    }

    return source ? (
        <div
            id="source-page-container"
            className={`${className ?? ''} w-full h-full relative p-2`}
        >
            <SourceActionMenu
                isHidden={isActionMenuHidden}
                setIsHidden={setIsActionMenuHidden}
                sourceId={source._id}
                toggleCreateExerciseSetForm={toggleCreateExerciseSetForm}
                toggleDeleteApproval={toggleDeleteApproval}
            />

            <div
                className="w-full h-auto absolute
                flex flex-col justify-start items-center gap-4"
            >
                <div className="absolute top-0 right-0 flex flex-col">
                    <div className=''>
                        <Button variant={ButtonVariants.GHOST} onClick={(event) => toggleSourceActionMenu(event)} >...</Button>
                    </div>
                </div>
                <p>{source.title}</p>
                <p>{source.type}</p>
                <DocumentRenderer
                    docNode={JSON.parse(source.rawText) as DocumentNode}
                />
            </div>

            <BodyModal
                isPopUpActive={isPopUpActive}
                components={[
                    <CreateExerciseSetForm
                        isHidden={isCreateExerciseSetFormHidden}
                        setIsHidden={setIsCreateExerciseSetFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        toggle={toggleCreateExerciseSetForm}
                        sourceId={source._id}
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
    ) : (
        <></>
    );
}
