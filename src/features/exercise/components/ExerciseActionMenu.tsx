import type React from 'react';
import { Button } from 'src/shared/components/Button';
import { ButtonVariants } from 'src/shared/enums/button-variants.enum';

export function ExerciseActionMenu({
    isHidden,
    setIsHidden,
    exerciseId,
    toggleTransferExerciseForm,
    toggleDeleteApproval,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    exerciseId?: string;
    toggleTransferExerciseForm: () => void;
    toggleDeleteApproval: () => void;
}) {
    return (
        <div
            id="exercise-action-menu"
            className={`absolute border p-2 bg-white rounded-[10px] shadow-md z-10
            flex flex-col justify-center items-center gap-2
            ${isHidden && 'hidden'}`}
        >
            {exerciseId && (
                <>
                    <Button
                        onClick={(event) => {
                            event?.stopPropagation();
                            toggleTransferExerciseForm();
                            setIsHidden((prev) => !prev);
                        }}
                    >
                        Transfer
                    </Button>

                    <Button
                        variant={ButtonVariants.DANGER}
                        onClick={(event) => {
                            event.stopPropagation();
                            toggleDeleteApproval();
                            setIsHidden((prev) => !prev);
                        }}
                    >
                        Delete
                    </Button>
                </>
            )}
        </div>
    );
}
