import React from 'react';
import { CloneExerciseSetForm } from 'src/features/exercise-set/components/CloneExerciseSetForm';
import { PublicExerciseSetPopupsContext } from 'src/features/exercise-set/contexts/public-exercise-set-popups.context';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { StartPracticeDecision } from 'src/features/exercise/components/StartPracticeDecision';
import { ViewPdfDecision } from 'src/features/exercise/components/ViewPdfDecision';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { BodyModal } from 'src/shared/components/BodyModal';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch } from 'src/store/hooks';

export function PublicExerciseSetPopupsProvider({
    children,
    exerciseSet,
    exercises,
    ownerUserName,
}: {
    children: React.ReactNode;
    exerciseSet: ExerciseSet;
    exercises: Exercise[];
    ownerUserName: string;
}) {
    const dispatch = useAppDispatch();

    const [isPopUpActive, setIsPopUpActive] = React.useState(false);
    const [isLoadingPageHidden, setIsLoadingPageHidden] = React.useState(true);

    const [isStartPracticeDecisionHidden, setIsStartPracticeDecisionHidden] = React.useState(true);
    const [isOpenCloneExerciseSetFormHidden, setIsOpenCloneExerciseSetFormHidden] = React.useState(true);
    const [isViewPdfDecisionHidden, setIsViewPdfDecisionHidden] = React.useState(true);

    function openStartPracticeDecision() {
        setIsPopUpActive(true);
        setIsStartPracticeDecisionHidden(false);
    }

    function openCloneExerciseSetForm() {
        setIsPopUpActive(true);
        setIsOpenCloneExerciseSetFormHidden(false);
    }

    function openViewPdfDecision() {
        setIsPopUpActive(true);
        setIsViewPdfDecisionHidden(false);
    }

    function closePopups() {
        setIsPopUpActive(false);

        setIsStartPracticeDecisionHidden(true);
        setIsViewPdfDecisionHidden(true);
        setIsOpenCloneExerciseSetFormHidden(true);
    }

    function invalidateTab() {
        if (!exerciseSet?._id) {
            return;
        }

        dispatch(tabsActions.invalidateTabPropsById(exerciseSet._id));
    }

    return (
        <PublicExerciseSetPopupsContext value={{ openStartPracticeDecision, openCloneExerciseSetForm, openViewPdfDecision }}>
            {children}

            <BodyModal
                isPopUpActive={isPopUpActive}
                onOverlayClick={closePopups}
                components={[
                    <StartPracticeDecision
                        key='start-practice-decision'
                        isHidden={isStartPracticeDecisionHidden}
                        setIsHidden={setIsStartPracticeDecisionHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        onClose={closePopups}
                        exerciseSet={exerciseSet}
                        refreshData={invalidateTab}
                        isPublicAccess={true}
                        meta={ownerUserName}
                    />,
                    <CloneExerciseSetForm
                        key='clone-exercise-set-form'
                        isHidden={isOpenCloneExerciseSetFormHidden}
                        setIsHidden={setIsOpenCloneExerciseSetFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        onClose={closePopups}
                        exerciseSet={exerciseSet}
                    />,
                    <ViewPdfDecision
                        key='view-pdf-decision'
                        isHidden={isViewPdfDecisionHidden}
                        setIsHidden={setIsViewPdfDecisionHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        onClose={closePopups}
                        exerciseSet={exerciseSet}
                        isPublicAccess={true}
                    />,
                    <LoadingPage key='loading-page' isHidden={isLoadingPageHidden} />,
                ]}
            />
        </PublicExerciseSetPopupsContext>
    );
}
