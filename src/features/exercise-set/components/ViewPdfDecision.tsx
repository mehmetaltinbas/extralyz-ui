import React from 'react';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { viewExerciseSetAsPdf } from 'src/features/exercise-set/utils/view-exercise-set-as-pdf.util';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';

export function ViewPdfDecision({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    setIsLoadingPageHidden,
    onClose,
    exerciseSet,
    isPublicAccess
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    exerciseSet: ExerciseSet;
    isPublicAccess: boolean;
}) {
    async function viewPdf(withAnswers: boolean) {
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            viewExerciseSetAsPdf(isPublicAccess, withAnswers, exerciseSet);

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
            <p className='text-center'>Do you want to view pdf with correct answers attached at the last page?</p>

            <div className='flex gap-2'>
                <Button
                    onClick={async (event) => {
                        event.stopPropagation();
                        await viewPdf(true);
                    }}
                >
                    Yes
                </Button>

                <Button
                    onClick={async (event) => {
                        event.stopPropagation();
                        await viewPdf(false);
                    }}
                >
                    No
                </Button>
            </div>
        </Modal>
    );
}
