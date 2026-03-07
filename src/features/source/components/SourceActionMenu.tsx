import type React from 'react';
import { ActionMenu } from 'src/shared/components/ActionMenu';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function SourceActionMenu({
    isHidden,
    setIsHidden,
    sourceId,
    ref,
    toggleCreateExerciseSetForm,
    toggleDeleteApproval,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    sourceId?: string;
    ref: React.RefObject<HTMLDivElement | null>;
    toggleCreateExerciseSetForm: () => void;
    toggleDeleteApproval: () => void;
}) {
    return (
        <ActionMenu isHidden={isHidden} onClose={() => setIsHidden(true)} ref={ref}>
            {sourceId && (
                <>
                    <Button
                        variant={ButtonVariant.PRIMARY}
                        size={ButtonSize.SM}
                        onClick={(event) => {
                            event.stopPropagation();
                            toggleCreateExerciseSetForm();
                            setIsHidden((prev) => !prev);
                        }}
                    >
                        Generate Exercise Set
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
