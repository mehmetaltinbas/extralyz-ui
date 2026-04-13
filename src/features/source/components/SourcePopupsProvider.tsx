import React from 'react';
import { CreateExerciseSetForm } from 'src/features/exercise-set/components/CreateExerciseSetForm';
import { UpdateSourceForm } from 'src/features/source/components/UpdateSourceForm';
import { SourcePopupsContext } from 'src/features/source/contexts/source-popups.context';
import { SourceService } from 'src/features/source/services/source.service';
import { sourcesActions } from 'src/features/source/store/sources.slice';
import type { Source } from 'src/features/source/types/source.interface';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { BodyModal } from 'src/shared/components/BodyModal';
import { CriticOperationApproval } from 'src/shared/components/CriticOperationApproval';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch } from 'src/store/hooks';
import type { GetSourcePdfResponse } from 'src/features/source/types/response/get-source-pdf.response';

export function SourcePopupsProvider({
    children,
    containerRef,
    source,
}: {
    children: React.ReactNode;
    containerRef: React.RefObject<HTMLDivElement | null>;
    source: Source;
}) {
    const dispatch = useAppDispatch();

    const [isPopUpActive, setIsPopUpActive] = React.useState(false);
    const [isLoadingPageHidden, setIsLoadingPageHidden] = React.useState(true);

    const [isCreateExerciseSetFormHidden, setIsCreateExerciseSetFormHidden] = React.useState(true);
    const [isUpdateSourceFormHidden, setIsUpdateSourceFormHidden] = React.useState(true);
    const [isDeleteApproavelHidden, setIsDeleteApprovalHidden] = React.useState(true);

    function refreshData() {
        if (!source._id) {
            return;
        }

        dispatch(tabsActions.invalidateTabPropsById(source._id));
        dispatch(sourcesActions.fetchData());
    }

    function openCreateExerciseSetForm() {
        setIsPopUpActive(true);
        setIsCreateExerciseSetFormHidden(false);
    }

    function openUpdateSourceForm() {
        setIsPopUpActive(true);
        setIsUpdateSourceFormHidden(false);
    }

    function openDeleteApproval() {
        setIsPopUpActive(true);
        setIsDeleteApprovalHidden(false);
    }

    async function viewSourcePdf() {
        setIsLoadingPageHidden(false);

        try {
            const response: GetSourcePdfResponse = await SourceService.getPdf(source._id);

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
                a.download = `${source.title}.pdf`;
                a.click();
            }
        } catch (error) {
            alert('internal error');
        } finally {
            setIsLoadingPageHidden(true);
        }
    }

    function closePopups() {
        setIsPopUpActive(false);
        setIsCreateExerciseSetFormHidden(true);
        setIsUpdateSourceFormHidden(true);
        setIsDeleteApprovalHidden(true);
    }

    async function deleteSource(): Promise<{ isSuccess: boolean }> {
        const response = await SourceService.deleteById(source._id);

        if (!response.isSuccess) alert(response.message);
        else {
            dispatch(sourcesActions.fetchData());
            dispatch(tabsActions.closeTabById(source._id));
        }

        return { isSuccess: response.isSuccess };
    }

    return (
        <SourcePopupsContext value={{ openCreateExerciseSetForm, openUpdateSourceForm, openDeleteApproval, viewSourcePdf }}>
            {children}

            <BodyModal
                isPopUpActive={isPopUpActive}
                onOverlayClick={closePopups}
                isOverlayClickDisabled={!isLoadingPageHidden}
                components={[
                    <CreateExerciseSetForm
                        key='create-exercise-set-form'
                        isHidden={isCreateExerciseSetFormHidden}
                        setIsHidden={setIsCreateExerciseSetFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        onClose={closePopups}
                        sourceId={source._id}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                    />,
                    <UpdateSourceForm
                        key='update-source-form'
                        isHidden={isUpdateSourceFormHidden}
                        setIsHidden={setIsUpdateSourceFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        onClose={closePopups}
                        refreshData={refreshData}
                        source={source}
                    />,
                    <CriticOperationApproval
                        key='delete-approval'
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
        </SourcePopupsContext>
    );
}
