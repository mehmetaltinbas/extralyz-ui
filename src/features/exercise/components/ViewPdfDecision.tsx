import React from 'react';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';

export function ViewPdfDecision({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    setIsLoadingPageHidden,
    onClose,
    exerciseSet,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    exerciseSet: ExerciseSet;
}) {
    async function viewPdf(withAnswers: boolean) {
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await ExerciseSetService.getPdf(exerciseSet._id, withAnswers);

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

            window.open(url, '_blank');

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
            <p>Do you want to view pdf with correct answers attached at the last page?</p>

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
