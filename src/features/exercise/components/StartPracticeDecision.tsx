import React from 'react';
import { ExerciseSetMode } from 'src/features/exercise-set/enums/exercise-set-mode.enum';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { WEAK_POINT_PASS_THRESHOLD } from 'src/features/exercise/constants/weak-point-pass-threshold.constant';
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
    isPublicAccess,
    meta,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    exerciseSet: ExerciseSet;
    refreshData: () => void;
    isPublicAccess: boolean;
    meta?: string;
}) {
    const dispatch = useAppDispatch();

    function startPractice(mode: ExerciseSetMode) {
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            refreshData();

            let section: Section = Section.EXERCISE_SET_PRACTICE;
            
            if (isPublicAccess) section = Section.PUBLIC_EXERCISE_SET_PRACTICE;

            dispatch(
                tabsActions.openTab({
                    section,
                    id: exerciseSet._id,
                    title: exerciseSet.title,
                    mode: mode,
                    meta: meta && `@${meta}`
                })
            );

            setIsPopUpActive(false);
        } catch (error) {
            alert('internal error');
            setIsHidden(false);
        } finally {
            setIsLoadingPageHidden(true);
        }
    }

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            <p className='text-center'>Choose your practice mode.</p>

            <Button
                onClick={(event) => {
                    event.stopPropagation();
                    startPractice(ExerciseSetMode.PRACTICE);
                }}
            >
                <span className='whitespace-normal text-center'>
                    In Order
                    <span className='block text-sm opacity-70'>Practice exercises in their original sequence.</span>
                </span>
            </Button>

            <Button
                onClick={(event) => {
                    event.stopPropagation();
                    startPractice(ExerciseSetMode.SHUFFLE_PRACTICE);
                }}
            >
                <span className='whitespace-normal text-center'>
                    Shuffle
                    <span className='block text-sm opacity-70'>Randomize exercise order and multiple choice options.</span>
                </span>
            </Button>

            <Button
                onClick={(event) => {
                    event.stopPropagation();
                    startPractice(ExerciseSetMode.WEAK_POINT_FOCUS_PRACTICE);
                }}
            >
                <span className='whitespace-normal text-center'>
                    Weak Point Focus
                    <span className='block text-sm opacity-70'>Repeat the set, each round dropping exercises you scored above {WEAK_POINT_PASS_THRESHOLD}/100. Focus narrows to your weak points.</span>
                </span>
            </Button>
        </Modal>
    );
}
