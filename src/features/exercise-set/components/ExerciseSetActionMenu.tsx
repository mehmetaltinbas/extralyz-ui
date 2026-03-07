import type React from 'react';
import { ExerciseSetMode } from 'src/features/exercise-set/enums/exercise-set-mode.enum';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { Section } from 'src/features/workspace/enums/sections.enum';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { Button } from 'src/shared/components/Button';
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
        <div
            ref={ref}
            className={`absolute border p-2 bg-white rounded-[10px] shadow-md z-10
            flex flex-col justify-center items-center gap-2
            ${isHidden && 'hidden'}`}
        >
            {exerciseSet && (
                <>
                    <Button
                        variant={ButtonVariant.PRIMARY}
                        onClick={(event) => {
                            event.stopPropagation();
                            setIsHidden(true);
                            dispatch(tabsActions.add({ element: {
                                section: Section.EXERCISE_SET_PRACTICE,
                                id: exerciseSet._id,
                                title: exerciseSet.title,
                                mode: ExerciseSetMode.PRACTICE,
                            }}));
                        }}
                    >
                        Start Practice
                    </Button>

                    <Button
                        variant={ButtonVariant.DANGER}
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
