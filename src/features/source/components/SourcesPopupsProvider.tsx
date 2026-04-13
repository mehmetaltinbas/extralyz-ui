import React from 'react';
import { CreateExerciseSetForm } from 'src/features/exercise-set/components/CreateExerciseSetForm';
import { CreateSourceForm } from 'src/features/source/components/CreateSourceForm';
import { SourceActionMenu } from 'src/features/source/components/SourceActionMenu';
import { UpdateSourceForm } from 'src/features/source/components/UpdateSourceForm';
import { SourcesPopupsContext } from 'src/features/source/contexts/sources-popups.context';
import { SourceService } from 'src/features/source/services/source.service';
import { sourcesActions } from 'src/features/source/store/sources.slice';
import type { GetSourcePdfResponse } from 'src/features/source/types/response/get-source-pdf.response';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { BodyModal } from 'src/shared/components/BodyModal';
import { CriticOperationApproval } from 'src/shared/components/CriticOperationApproval';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function SourcesPopupsProvider({
    children,
    containerRef,
}: {
    children: React.ReactNode;
    containerRef: React.RefObject<HTMLDivElement | null>;
}) {
    const dispatch = useAppDispatch();
    const sources = useAppSelector((state) => state.sources);

    const [isPopUpActive, setIsPopUpActive] = React.useState(false);
    const [isLoadingPageHidden, setIsLoadingPageHidden] = React.useState(true);
    const [isSourceCreateFormHidden, setIsSourceCreateFormHidden] = React.useState(true);
    const [isSourceActionMenuHidden, setIsSourceActionMenuHidden] = React.useState(true);
    const [isCreateExerciseSetFormHidden, setIsCreateExerciseSetFormHidden] = React.useState(true);
    const [isUpdateSourceFormHidden, setIsUpdateSourceFormHidden] = React.useState(true);
    const [isDeleteApproavelHidden, setIsDeleteApprovalHidden] = React.useState(true);
    const [actionMenuSourceId, setActionMenuSourceId] = React.useState('');

    const actionMenuRef = React.useRef<HTMLDivElement>(null);

    function updateSourcesState() {
        dispatch(sourcesActions.fetchData());
    }

    function openCreateSourceForm() {
        setIsPopUpActive(true);
        setIsSourceCreateFormHidden(false);
    }

    function openSourceActionMenu(
        event: React.MouseEvent<HTMLButtonElement>,
        sourceId: string
    ) {
        event.stopPropagation();
        const sourceActionMenu = actionMenuRef.current;
        const container = containerRef.current;

        if (sourceActionMenu && container && actionMenuRef.current) {
            const containerRect = container.getBoundingClientRect();
            const buttonRect = event.currentTarget.getBoundingClientRect();
            const actionMenuRect = actionMenuRef.current.getBoundingClientRect();

            sourceActionMenu.style.top = `${buttonRect.bottom - containerRect.top}px`;
            sourceActionMenu.style.left = `${buttonRect.right - (buttonRect.width / 2) - (actionMenuRect.width / 2) - containerRect.left}px`;

            if (!isSourceActionMenuHidden && actionMenuSourceId === sourceId) {
                setIsSourceActionMenuHidden(true);
            } else {
                setActionMenuSourceId(sourceId);
                setIsSourceActionMenuHidden(false);
            }
        }
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

    async function viewSourcePdf() {
        setIsLoadingPageHidden(false);
        setIsPopUpActive(true);

        try {
            const source = sources.find((s) => s._id === actionMenuSourceId);
            const response: GetSourcePdfResponse = await SourceService.getPdf(actionMenuSourceId);

            if (!response.isSuccess || !response.pdfBase64) {
                alert(response.message);
                return;
            }

            const byteCharacters = atob(response.pdfBase64);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const newWindow = window.open(url, '_blank');

            if (!newWindow) {
                const a = document.createElement('a');
                a.href = url;
                a.download = `${source?.title ?? 'source'}.pdf`;
                a.click();
            }

            setIsPopUpActive(false);
        } catch (error) {
            alert('internal error');
        } finally {
            setIsLoadingPageHidden(true);
        }
    }

    function closePopups() {
        setIsPopUpActive(false);
        setIsSourceCreateFormHidden(true);
        setIsCreateExerciseSetFormHidden(true);
        setIsUpdateSourceFormHidden(true);
        setIsDeleteApprovalHidden(true);
    }

    async function deleteSource(): Promise<{ isSuccess: boolean }> {
        const response = await SourceService.deleteById(actionMenuSourceId);

        if (!response.isSuccess) alert(response.message);
        else {
            dispatch(tabsActions.closeTabById(actionMenuSourceId));
            updateSourcesState();
        }

        return { isSuccess: response.isSuccess };
    }

    return (
        <SourcesPopupsContext value={{ openCreateSourceForm, openSourceActionMenu }}>
            {children}

            <SourceActionMenu
                isHidden={isSourceActionMenuHidden}
                setIsHidden={setIsSourceActionMenuHidden}
                sourceId={actionMenuSourceId}
                ref={actionMenuRef}
                toggleCreateExerciseSetForm={toggleCreateExerciseSetForm}
                toggleViewPdf={viewSourcePdf}
                toggleUpdateSourceForm={toggleUpdateSourceForm}
                toggleDeleteApproval={toggleDeleteApproval}
            />

            <BodyModal
                isPopUpActive={isPopUpActive}
                onOverlayClick={closePopups}
                isOverlayClickDisabled={!isLoadingPageHidden}
                components={[
                    <CreateSourceForm
                        key='create-source-form'
                        isHidden={isSourceCreateFormHidden}
                        setIsHidden={setIsSourceCreateFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        onClose={closePopups}
                        updateSources={updateSourcesState}
                    />,
                    <CreateExerciseSetForm
                        key='create-exercise-set-form'
                        isHidden={isCreateExerciseSetFormHidden}
                        setIsHidden={setIsCreateExerciseSetFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        onClose={closePopups}
                        sourceId={actionMenuSourceId}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                    />,
                    ...[sources.find((source) => source._id === actionMenuSourceId) &&
                        <UpdateSourceForm
                            key='update-source-form'
                            isHidden={isUpdateSourceFormHidden}
                            setIsHidden={setIsUpdateSourceFormHidden}
                            setIsPopUpActive={setIsPopUpActive}
                            setIsLoadingPageHidden={setIsLoadingPageHidden}
                            onClose={closePopups}
                            refreshData={updateSourcesState}
                            source={sources.find((source) => source._id === actionMenuSourceId)!}
                        />
                    ],
                    <CriticOperationApproval
                        key='delete-approval'
                        warningMessage='All associated exercise sets and their exercises will also be deleted.'
                        isHidden={isDeleteApproavelHidden}
                        setIsHidden={setIsDeleteApprovalHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        onClose={closePopups}
                        onDelete={deleteSource}
                    />,
                    <LoadingPage key='loading-page' isHidden={isLoadingPageHidden} />,
                ]}
            />
        </SourcesPopupsContext>
    );
}
