import type React from 'react';
import { ActionMenu } from 'src/shared/components/ActionMenu';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function ExerciseSetGroupActionMenu({
    isHidden,
    setIsHidden,
    groupId,
    ref,
    toggleUpdateForm,
    toggleDeleteApproval,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    groupId?: string;
    ref: React.RefObject<HTMLDivElement | null>;
    toggleUpdateForm: () => void;
    toggleDeleteApproval: () => void;
}) {
    return (
        <ActionMenu isHidden={isHidden} onClose={() => setIsHidden(true)} ref={ref}>
            {groupId && (
                <>
                    <Button
                        size={ButtonSize.SM}
                        onClick={(event) => {
                            event.stopPropagation();
                            toggleUpdateForm();
                            setIsHidden((prev) => !prev);
                        }}
                    >
                        Update
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
