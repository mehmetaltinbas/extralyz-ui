import React from 'react';
import { CreateExerciseSetForm } from 'src/features/exercise-set/components/CreateExerciseSetForm';
import { ChangeExerciseSetAssociationForm } from 'src/features/exercise-set/components/ChangeExerciseSetAssociationForm';
import { ExerciseSetActionMenu } from 'src/features/exercise-set/components/ExerciseSetActionMenu';
import { GenerateNotesForm } from 'src/features/exercise-set/components/GenerateNotesForm';
import { UpdateExerciseSetForm } from 'src/features/exercise-set/components/UpdateExerciseSetForm';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import { refreshExerciseSetsData } from 'src/features/exercise-set/store/thunks/refresh-exercise-sets-data.thunk';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { StartPracticeDecision } from 'src/features/exercise/components/StartPracticeDecision';
import { SourceActionMenu } from 'src/features/source/components/SourceActionMenu';
import { UpdateSourceForm } from 'src/features/source/components/UpdateSourceForm';
import { SourceService } from 'src/features/source/services/source.service';
import { sourcesActions } from 'src/features/source/store/sources.slice';
import type { GetSourcePdfResponse } from 'src/features/source/types/response/get-source-pdf.response';
import { SidebarPopupsContext } from 'src/features/workspace/contexts/sidebar-popups.context';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { BodyModal } from 'src/shared/components/BodyModal';
import { CriticOperationApproval } from 'src/shared/components/CriticOperationApproval';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function SidebarPopupsProvider({
    children,
    containerRef,
}: {
    children: React.ReactNode;
    containerRef: React.RefObject<HTMLDivElement | null>;
}) {
    const dispatch = useAppDispatch();
    const sources = useAppSelector((state) => state.sources);

    // Shared state
    const [isPopUpActive, setIsPopUpActive] = React.useState(false);
    const [isLoadingPageHidden, setIsLoadingPageHidden] = React.useState(true);

    // Source action menu state
    const [isSourceActionMenuHidden, setIsSourceActionMenuHidden] = React.useState(true);
    const [actionMenuSourceId, setActionMenuSourceId] = React.useState('');
    const [isCreateExerciseSetFormHidden, setIsCreateExerciseSetFormHidden] = React.useState(true);
    const [isUpdateSourceFormHidden, setIsUpdateSourceFormHidden] = React.useState(true);
    const [isSourceDeleteApprovalHidden, setIsSourceDeleteApprovalHidden] = React.useState(true);

    // Exercise set action menu state
    const [isExerciseSetActionMenuHidden, setIsExerciseSetActionMenuHidden] = React.useState(true);
    const [actionMenuExerciseSet, setActionMenuExerciseSet] = React.useState<ExerciseSet>();
    const [isStartPracticeDecisionHidden, setIsStartPracticeDecisionHidden] = React.useState(true);
    const [isGenerateNotesFormHidden, setIsGenerateNotesFormHidden] = React.useState(true);
    const [isUpdateExerciseSetFormHidden, setIsUpdateExerciseSetFormHidden] = React.useState(true);
    const [isChangeSourceFormHidden, setIsChangeSourceFormHidden] = React.useState(true);
    const [isExerciseSetDeleteApprovalHidden, setIsExerciseSetDeleteApprovalHidden] = React.useState(true);

    const sourceActionMenuRef = React.useRef<HTMLDivElement>(null);
    const exerciseSetActionMenuRef = React.useRef<HTMLDivElement>(null);

    // --- Source actions ---

    function openSourceActionMenu(
        event: React.MouseEvent<HTMLButtonElement>,
        sourceId: string
    ) {
        event.stopPropagation();
        const sourceActionMenu = sourceActionMenuRef.current;

        if (sourceActionMenu) {
            const buttonRect = event.currentTarget.getBoundingClientRect();

            sourceActionMenu.style.position = 'fixed';
            sourceActionMenu.style.top = `${buttonRect.bottom}px`;
            sourceActionMenu.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
            sourceActionMenu.style.transform = 'translateX(-50%)';

            if (!isSourceActionMenuHidden && actionMenuSourceId === sourceId) {
                setIsSourceActionMenuHidden(true);
            } else {
                setActionMenuSourceId(sourceId);
                setIsSourceActionMenuHidden(false);
                setIsExerciseSetActionMenuHidden(true);
            }
        }
    }

    function openExerciseSetActionMenu(
        event: React.MouseEvent<HTMLButtonElement>,
        exerciseSet: ExerciseSet
    ) {
        event.stopPropagation();
        const exerciseSetActionMenu = exerciseSetActionMenuRef.current;

        if (exerciseSetActionMenu) {
            const buttonRect = event.currentTarget.getBoundingClientRect();

            exerciseSetActionMenu.style.position = 'fixed';
            exerciseSetActionMenu.style.top = `${buttonRect.bottom}px`;
            exerciseSetActionMenu.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
            exerciseSetActionMenu.style.transform = 'translateX(-50%)';

            if (!isExerciseSetActionMenuHidden && actionMenuExerciseSet?._id === exerciseSet._id) {
                setIsExerciseSetActionMenuHidden(true);
            } else {
                setActionMenuExerciseSet(exerciseSet);
                setIsExerciseSetActionMenuHidden(false);
                setIsSourceActionMenuHidden(true);
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

    function toggleSourceDeleteApproval() {
        setIsSourceDeleteApprovalHidden((prev) => !prev);
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

    async function deleteSource(): Promise<{ isSuccess: boolean }> {
        const response = await SourceService.deleteById(actionMenuSourceId);

        if (!response.isSuccess) alert(response.message);
        else {
            dispatch(tabsActions.closeTabById(actionMenuSourceId));
            dispatch(sourcesActions.fetchData());
        }

        return { isSuccess: response.isSuccess };
    }

    // --- Exercise set actions ---

    function toggleStartPracticeDecision() {
        setIsStartPracticeDecisionHidden((prev) => !prev);
        setIsPopUpActive((prev) => !prev);
    }

    function toggleGenerateNotesForm() {
        setIsGenerateNotesFormHidden((prev) => !prev);
        setIsPopUpActive((prev) => !prev);
    }

    function toggleUpdateExerciseSetForm() {
        setIsUpdateExerciseSetFormHidden((prev) => !prev);
        setIsPopUpActive((prev) => !prev);
    }

    function toggleChangeSourceForm() {
        setIsChangeSourceFormHidden((prev) => !prev);
        setIsPopUpActive((prev) => !prev);
    }

    function toggleExerciseSetDeleteApproval() {
        setIsExerciseSetDeleteApprovalHidden((prev) => !prev);
        setIsPopUpActive((prev) => !prev);
    }

    function refreshExerciseSetData() {
        dispatch(refreshExerciseSetsData());
    }

    async function deleteExerciseSet(): Promise<{ isSuccess: boolean }> {
        if (actionMenuExerciseSet) {
            const response = await ExerciseSetService.deleteById(actionMenuExerciseSet._id);

            if (!response.isSuccess) alert(response.message);
            else {
                dispatch(refreshExerciseSetsData());
                dispatch(tabsActions.closeTabById(actionMenuExerciseSet._id));
            }

            return { isSuccess: response.isSuccess };
        }

        alert('no exercise set found to delete');
        return { isSuccess: false };
    }

    // --- Close all ---

    function closePopups() {
        setIsPopUpActive(false);
        setIsCreateExerciseSetFormHidden(true);
        setIsUpdateSourceFormHidden(true);
        setIsSourceDeleteApprovalHidden(true);
        setIsStartPracticeDecisionHidden(true);
        setIsGenerateNotesFormHidden(true);
        setIsUpdateExerciseSetFormHidden(true);
        setIsChangeSourceFormHidden(true);
        setIsExerciseSetDeleteApprovalHidden(true);
    }

    return (
        <SidebarPopupsContext value={{ openSourceActionMenu, openExerciseSetActionMenu }}>
            {children}

            <SourceActionMenu
                isHidden={isSourceActionMenuHidden}
                setIsHidden={setIsSourceActionMenuHidden}
                sourceId={actionMenuSourceId}
                ref={sourceActionMenuRef}
                toggleCreateExerciseSetForm={toggleCreateExerciseSetForm}
                toggleViewPdf={viewSourcePdf}
                toggleUpdateSourceForm={toggleUpdateSourceForm}
                toggleDeleteApproval={toggleSourceDeleteApproval}
            />

            <ExerciseSetActionMenu
                isHidden={isExerciseSetActionMenuHidden}
                setIsHidden={setIsExerciseSetActionMenuHidden}
                exerciseSet={actionMenuExerciseSet}
                ref={exerciseSetActionMenuRef}
                toggleStartPracticeDecision={toggleStartPracticeDecision}
                toggleUpdateExerciseSetForm={toggleUpdateExerciseSetForm}
                toggleChangeSourceForm={toggleChangeSourceForm}
                toggleDeleteApproval={toggleExerciseSetDeleteApproval}
                toggleGenerateNotesForm={toggleGenerateNotesForm}
            />

            <BodyModal
                isPopUpActive={isPopUpActive}
                onOverlayClick={closePopups}
                isOverlayClickDisabled={!isLoadingPageHidden}
                zIndex={60}
                components={[
                    <CreateExerciseSetForm
                        key='sidebar-create-exercise-set-form'
                        isHidden={isCreateExerciseSetFormHidden}
                        setIsHidden={setIsCreateExerciseSetFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        onClose={closePopups}
                        sourceId={actionMenuSourceId}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                    />,
                    ...[sources.find((source) => source._id === actionMenuSourceId) &&
                        <UpdateSourceForm
                            key='sidebar-update-source-form'
                            isHidden={isUpdateSourceFormHidden}
                            setIsHidden={setIsUpdateSourceFormHidden}
                            setIsPopUpActive={setIsPopUpActive}
                            setIsLoadingPageHidden={setIsLoadingPageHidden}
                            onClose={closePopups}
                            refreshData={() => dispatch(sourcesActions.fetchData())}
                            source={sources.find((source) => source._id === actionMenuSourceId)!}
                        />
                    ],
                    <CriticOperationApproval
                        key='sidebar-source-delete-approval'
                        warningMessage='All associated exercise sets and their exercises will also be deleted.'
                        isHidden={isSourceDeleteApprovalHidden}
                        setIsHidden={setIsSourceDeleteApprovalHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        onClose={closePopups}
                        onDelete={deleteSource}
                    />,
                    ...[actionMenuExerciseSet &&
                        <StartPracticeDecision
                            key='sidebar-start-practice-decision'
                            isHidden={isStartPracticeDecisionHidden}
                            setIsHidden={setIsStartPracticeDecisionHidden}
                            setIsPopUpActive={setIsPopUpActive}
                            setIsLoadingPageHidden={setIsLoadingPageHidden}
                            onClose={closePopups}
                            exerciseSet={actionMenuExerciseSet}
                            refreshData={refreshExerciseSetData}
                            isPublicAccess={false}
                        />
                    ],
                    ...[actionMenuExerciseSet &&
                        <GenerateNotesForm
                            key='sidebar-generate-notes-form'
                            isHidden={isGenerateNotesFormHidden}
                            setIsHidden={setIsGenerateNotesFormHidden}
                            setIsPopUpActive={setIsPopUpActive}
                            onClose={closePopups}
                            setIsLoadingPageHidden={setIsLoadingPageHidden}
                            refreshData={refreshExerciseSetData}
                            exerciseSet={actionMenuExerciseSet}
                        />
                    ],
                    ...[actionMenuExerciseSet &&
                        <UpdateExerciseSetForm
                            key='sidebar-update-exercise-set-form'
                            isHidden={isUpdateExerciseSetFormHidden}
                            setIsHidden={setIsUpdateExerciseSetFormHidden}
                            setIsPopUpActive={setIsPopUpActive}
                            setIsLoadingPageHidden={setIsLoadingPageHidden}
                            onClose={closePopups}
                            refreshData={refreshExerciseSetData}
                            exerciseSet={actionMenuExerciseSet}
                        />
                    ],
                    ...[actionMenuExerciseSet &&
                        <ChangeExerciseSetAssociationForm
                            key='sidebar-change-source-form'
                            isHidden={isChangeSourceFormHidden}
                            setIsHidden={setIsChangeSourceFormHidden}
                            setIsPopUpActive={setIsPopUpActive}
                            setIsLoadingPageHidden={setIsLoadingPageHidden}
                            onClose={closePopups}
                            refreshData={refreshExerciseSetData}
                            exerciseSet={actionMenuExerciseSet}
                        />
                    ],
                    <CriticOperationApproval
                        key='sidebar-exercise-set-delete-approval'
                        warningMessage='All associated exercises will also be deleted.'
                        isHidden={isExerciseSetDeleteApprovalHidden}
                        setIsHidden={setIsExerciseSetDeleteApprovalHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        onClose={closePopups}
                        onDelete={deleteExerciseSet}
                    />,
                    <LoadingPage key='sidebar-loading-page' isHidden={isLoadingPageHidden} />,
                ]}
            />
        </SidebarPopupsContext>
    );
}
