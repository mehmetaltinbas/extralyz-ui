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

    function invalidateTab() {
        if (!source._id) {
            return;
        }

        dispatch(tabsActions.invalidateTabPropsById(source._id));
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
        <SourcePopupsContext value={{ openCreateExerciseSetForm, openUpdateSourceForm, openDeleteApproval }}>
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
                        refreshData={invalidateTab}
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
