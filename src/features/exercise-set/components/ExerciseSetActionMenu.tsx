import type React from 'react';
import { ExerciseSetMode } from 'src/features/exercise-set/enums/exercise-set-mode.enum';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { Section } from 'src/features/workspace/enums/sections.enum';
import { openTab } from 'src/features/workspace/features/tabs/utilities/open-tab.utility';
import { Button } from 'src/shared/components/Button';
import { ButtonVariants } from 'src/shared/enums/button-variants.enum';
import { useAppDispatch } from 'src/store/hooks';

export function ExerciseSetActionMenu({
    isHidden,
    setIsHidden,
    exerciseSet,
    toggleDeleteApproval,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    exerciseSet?: ExerciseSet;
    toggleDeleteApproval: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) {
    const dispatch = useAppDispatch();

    return (
        <div
            id="exercise-set-action-menu"
            className={`absolute border p-2 bg-white rounded-[10px] shadow-md z-10
            flex flex-col justify-center items-center gap-2
            ${isHidden && 'hidden'}`}
        >
            {exerciseSet && (
                <>
                    <Button
                        variant={ButtonVariants.PRIMARY}
                        onClick={(event) => {
                            event.stopPropagation();
                            setIsHidden(true);
                            openTab(dispatch, {
                                section: Section.EXERCISE_SET_PRACTICE,
                                id: exerciseSet._id,
                                title: exerciseSet.title,
                                mode: ExerciseSetMode.PRACTICE,
                            });
                        }}
                    >
                        Start Practice
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
