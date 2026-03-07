import type React from 'react';
import { ActionMenu } from 'src/shared/components/ActionMenu';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function ExerciseActionMenu({
    isHidden,
    setIsHidden,
    exerciseId,
    ref,
    toggleUpdateExerciseForm,
    toggleTransferExerciseForm,
    toggleDeleteApproval,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    exerciseId?: string;
    ref: React.RefObject<HTMLDivElement | null>;
    toggleUpdateExerciseForm(): void;
    toggleTransferExerciseForm(): void;
    toggleDeleteApproval(): void;
}) {
    return (
        <ActionMenu isHidden={isHidden} onClose={() => setIsHidden(true)} ref={ref}>
            {exerciseId && (
                <>
                    <Button
                        size={ButtonSize.SM}
                        onClick={(event) => {
                            event.stopPropagation();
                            toggleUpdateExerciseForm();
                            setIsHidden((prev) => !prev);
                        }}
                    >
                        Update
                    </Button>

                    <Button
                        size={ButtonSize.SM}
                        onClick={(event) => {
                            event.stopPropagation();
                            toggleTransferExerciseForm();
                            setIsHidden((prev) => !prev);
                        }}
                    >
                        Transfer
                    </Button>

                    <Button
                        variant={ButtonVariant.DANGER}
                        size={ButtonSize.SM}
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
        </ActionMenu>
    );
}
