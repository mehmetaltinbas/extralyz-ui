import type React from 'react';
import { Button } from 'src/shared/components/Button';
import { ButtonVariants } from 'src/shared/enums/button-variants.enum';

export function ProcessedSourceActionMenu({
    isHidden,
    setIsHidden,
    processedSourceId,
    fetchProcessedSources,
    toggleCreateExerciseSetForm,
    toggleDeleteApproval,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    processedSourceId?: string;
    fetchProcessedSources: () => void;
    toggleCreateExerciseSetForm: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void;
    toggleDeleteApproval: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) {
    return (
        <div
            id="processed-source-action-menu"
            className={`absolute border p-2 bg-white rounded-[10px] shadow-md z-10
            flex flex-col justify-center items-center gap-2
            ${isHidden && 'hidden'}`}
        >
            {processedSourceId && (
                <>
                    <Button
                        variant={ButtonVariants.PRIMARY}
                        onClick={(event) => {
                            event.stopPropagation();
                            toggleCreateExerciseSetForm(event);
                            setIsHidden((prev) => !prev);
                        }}
                    >
                        Generate Exercises
                    </Button>
                    <Button
                        variant={ButtonVariants.DANGER}
                        onClick={(event) => {
                            event.stopPropagation();
                            toggleDeleteApproval(event);
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
