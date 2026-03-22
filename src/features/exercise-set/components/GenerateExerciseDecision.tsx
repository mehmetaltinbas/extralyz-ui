import type React from 'react';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';

export function GenerateExerciseDecision({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    onClose,
    onSelectManual,
    onSelectAI,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    onSelectManual: () => void;
    onSelectAI: () => void;
}) {
    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            <p className='text-center'>How would you like to generate exercises?</p>

            <Button
                onClick={(event) => {
                    event.stopPropagation();
                    onSelectAI();
                }}
            >
                <span className='whitespace-normal text-center'>
                    Generate with AI
                    <span className='block text-sm opacity-70'>AI creates exercises from parts of your source not yet covered.</span>
                </span>
            </Button>

            <Button
                onClick={(event) => {
                    event.stopPropagation();
                    onSelectManual();
                }}
            >
                <span className='whitespace-normal text-center'>
                    Create Manually
                    <span className='block text-sm opacity-70'>Write your own exercise from scratch.</span>
                </span>
            </Button>
        </Modal>
    );
}
