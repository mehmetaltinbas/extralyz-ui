import type React from 'react';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { Section } from 'src/features/workspace/enums/sections.enum';
import { openTab } from 'src/features/workspace/features/tabs/utilities/openTab.utility';
import { Button } from 'src/shared/components/Button';
import { ButtonVariants } from 'src/shared/enums/button-variants.enum';
import { useAppDispatch } from 'src/store/hooks';

export function ExerciseSetCard({
    exerciseSet,
    toggleExerciseSetActionMenu,
}: {
    exerciseSet: ExerciseSet;
    toggleExerciseSetActionMenu: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        exerciseSet: ExerciseSet
    ) => void;
}) {
    const dispatch = useAppDispatch();

    return (
        <div
            onClick={(event) =>
                openTab(dispatch, {
                    section: Section.EXERCISE_SET,
                    id: exerciseSet._id,
                    title: exerciseSet.title,
                })
            }
            className="relative w-[250px] h-[150px] cursor-pointer rounded-[10px]
            flex-shrink-0 flex flex-col justify-start items-center gap-1
            border p-1
            hover:bg-gray-100"
        >
            <div
                className="w-[250px] h-auto border-b-1
                flex justify-center items-center"
            >
                <div className="w-[200px] h-auto flex justify-center items-center">
                    <p className="max-w-[200px] px-2 font-serif font-semibold truncate ">
                        {exerciseSet.title ? exerciseSet.title : exerciseSet._id}
                    </p>
                </div>
                <div className="w-[50px] h-auto">
                    <Button
                        variant={ButtonVariants.GHOST}
                        onClick={(event) => toggleExerciseSetActionMenu(event, exerciseSet)}
                    >
                        ...
                    </Button>
                </div>
            </div>
            <p>{exerciseSet.type}</p>
            <p>{exerciseSet.count}</p>
            <p>{exerciseSet.difficulty}</p>
        </div>
    );
}
