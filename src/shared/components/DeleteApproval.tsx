import type React from 'react';
import { Button } from 'src/shared/components/Button';
import { ButtonVariants } from 'src/shared/enums/button-variants.enum';

export function DeleteApproval({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    setIsLoadingPageHidden,
    toggle,
    onDelete,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    toggle: () => void;
    onDelete: () => Promise<string>;
}) {
    async function handleOnclick() {
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        await onDelete();

        setIsLoadingPageHidden(true);
        setIsPopUpActive(false);
    }

    return (
        <div
            className={`${isHidden ? 'hidden' : ''} border px-2 py-4 bg-white rounded-[10px]
            flex flex-col justify-center items-center gap-2`}
        >
            <p>Are you sure?</p>
            <div className="flex justify-center items-center gap-2">
                <Button
                    variant={ButtonVariants.SECONDARY}
                    onClick={(event) => {
                        toggle();
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant={ButtonVariants.DANGER}
                    onClick={async (event) => {
                        await handleOnclick();
                    }}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}
