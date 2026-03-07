import type React from 'react';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { Section } from 'src/features/workspace/enums/sections.enum';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import ActionMenuTriggerer from 'src/shared/components/ActionMenuTriggerer';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
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

    function triggerActionMenu(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        toggleExerciseSetActionMenu(event, exerciseSet);
    }

    return (
        <div
            onClick={(event) => {
                dispatch(tabsActions.add({ element: {
                    section: Section.EXERCISE_SET,
                    id: exerciseSet._id,
                    title: exerciseSet.title,
                }}));
            }}
            className="relative w-[250px] h-[150px] cursor-pointer rounded-[10px]
            flex-shrink-0 flex flex-col justify-start items-center gap-1
            border border-gray-400 p-1
            hover:border-black"
        >
            <div
                className="w-[250px] h-[35px] border-b-1 border-gray-400
                flex justify-center items-center"
            >
                <div className="w-[200px] h-full flex justify-center items-center">
                    <p className="max-w-[200px] px-2 font-serif font-semibold truncate ">
                        {exerciseSet.title}
                    </p>
                </div>

                <div className="w-[50px] h-auto">
                    <ActionMenuTriggerer
                        onClick={(event) => toggleExerciseSetActionMenu(event, exerciseSet)}
                        size={ButtonSize.SM}
                    />
                </div>
            </div>
            <p>{exerciseSet.type}</p>
            <p>{exerciseSet.count}</p>
            <p>{exerciseSet.difficulty}</p>
        </div>
    );
}
