import type React from 'react';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function CriticOperationApproval({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    setIsLoadingPageHidden,
    onClose,
    onDelete,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    onDelete: () => Promise<{ isSuccess: boolean }>;
}) {
    async function handleOnclick() {
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        const result = await onDelete();

        setIsLoadingPageHidden(true);
        if (result.isSuccess) {
            setIsPopUpActive(false);
        } else {
            setIsHidden(false);
        }
    }

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            <p>Are you sure?</p>
            <div className="flex justify-center items-center gap-2">
                <Button
                    variant={ButtonVariant.SECONDARY}
                    onClick={(event) => {
                        onClose();
                    }}
                >
                    Cancel
                </Button>
                
                <Button
                    variant={ButtonVariant.DANGER}
                    onClick={handleOnclick}
                >
                    Yes
                </Button>
            </div>
        </Modal>
    );
}
