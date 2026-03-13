import React from 'react';
import { ExerciseSetMode } from 'src/features/exercise-set/enums/exercise-set-mode.enum';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { Section } from 'src/features/workspace/enums/section.enum';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';
import { useAppDispatch } from 'src/store/hooks';

export function StartPracticeDecision({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    setIsLoadingPageHidden,
    onClose,
    exerciseSet,
    refreshData,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    exerciseSet: ExerciseSet;
    refreshData: () => void;
}) {
    const dispatch = useAppDispatch();

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            <p>Do you want to practice exercises in order?</p>

            <Button
                onClick={(event) => {
                    event.stopPropagation();
                    refreshData();
                    dispatch(tabsActions.openTab({
                        section: Section.EXERCISE_SET_PRACTICE,
                        id: exerciseSet._id,
                        title: exerciseSet.title,
                        mode: ExerciseSetMode.PRACTICE,
                    }));
                }}
            >
                Yes
            </Button>

            <Button
                onClick={(event) => {
                    event.stopPropagation();
                    refreshData();
                    dispatch(tabsActions.openTab({
                        section: Section.EXERCISE_SET_PRACTICE,
                        id: exerciseSet._id,
                        title: exerciseSet.title,
                        mode: ExerciseSetMode.SHUFFLE_PRACTICE,
                    }));
                }}
            >
                No, I want to practice in shuffle mode
            </Button>
        </Modal>
    );
}
