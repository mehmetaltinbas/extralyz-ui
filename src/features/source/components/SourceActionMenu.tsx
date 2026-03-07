import type React from 'react';
import { Button } from 'src/shared/components/Button';
import { ButtonVariants } from 'src/shared/enums/button-variants.enum';

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
        <div
            ref={ref}
            className={`absolute border p-2 bg-white rounded-[10px] shadow-md z-10
            flex flex-col justify-center items-center gap-2
            ${isHidden && 'hidden'}`}
        >
            {sourceId && (
                <>
                    <Button
                        variant={ButtonVariants.PRIMARY}
                        onClick={(event) => {
                            event.stopPropagation();
                            toggleCreateExerciseSetForm();
                            setIsHidden((prev) => !prev);
                        }}
                    >
                        Generate Exercises
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
