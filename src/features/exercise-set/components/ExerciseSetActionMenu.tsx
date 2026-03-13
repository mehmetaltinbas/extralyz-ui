import type React from 'react';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { ActionMenu } from 'src/shared/components/ActionMenu';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch } from 'src/store/hooks';

export function ExerciseSetActionMenu({
    isHidden,
    setIsHidden,
    exerciseSet,
    ref,
    toggleStartPracticeDecision,
    toggleUpdateExerciseSetForm,
    toggleDeleteApproval,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    exerciseSet?: ExerciseSet;
    ref: React.RefObject<HTMLDivElement | null>;
    toggleStartPracticeDecision: () => void;
    toggleUpdateExerciseSetForm: () => void;
    toggleDeleteApproval: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) {
    const dispatch = useAppDispatch();

    return (
        <ActionMenu isHidden={isHidden} onClose={() => setIsHidden(true)} ref={ref}>
            {exerciseSet && (
                <>
                    <Button
                        size={ButtonSize.SM}
                        onClick={(event) => {
                            event.stopPropagation();
                            toggleStartPracticeDecision();
                            setIsHidden(true);
                        }}
                    >
                        Start Practice
                    </Button>

                    <Button
                        size={ButtonSize.SM}
                        onClick={(event) => {
                            event.stopPropagation();
                            toggleUpdateExerciseSetForm();
                            setIsHidden(true);
                        }}
                    >
                        Update
                    </Button>

                    <Button
                        variant={ButtonVariant.DANGER}
                        size={ButtonSize.SM}
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
        </ActionMenu>
    );
}
