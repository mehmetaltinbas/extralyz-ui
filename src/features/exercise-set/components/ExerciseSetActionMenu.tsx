import type React from 'react';
import { ExerciseSetMode } from 'src/features/exercise-set/enums/exercise-set-mode.enum';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { Section } from 'src/features/workspace/enums/sections.enum';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
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
    toggleDeleteApproval,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    exerciseSet?: ExerciseSet;
    ref: React.RefObject<HTMLDivElement | null>;
    toggleDeleteApproval: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) {
    const dispatch = useAppDispatch();

    return (
        <ActionMenu isHidden={isHidden} onClose={() => setIsHidden(true)} ref={ref}>
            {exerciseSet && (
                <>
                    <Button
                        variant={ButtonVariant.PRIMARY}
                        size={ButtonSize.SM}
                        onClick={(event) => {
                            event.stopPropagation();
                            setIsHidden(true);
                            dispatch(tabsActions.openTab({
                                section: Section.EXERCISE_SET_PRACTICE,
                                id: exerciseSet._id,
                                title: exerciseSet.title,
                                mode: ExerciseSetMode.PRACTICE,
                            }));
                        }}
                    >
                        Start Practice
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
