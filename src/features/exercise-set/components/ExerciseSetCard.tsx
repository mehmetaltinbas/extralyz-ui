import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { useExerciseSetsPopups } from 'src/features/exercise-set/hooks/use-exercise-sets-popups.hook';
import { Section } from 'src/features/workspace/enums/section.enum';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import ActionMenuTriggerer from 'src/shared/components/ActionMenuTriggerer';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { useAppDispatch } from 'src/store/hooks';

export function ExerciseSetCard({
    exerciseSet,
}: {
    exerciseSet: ExerciseSet;
}) {
    const dispatch = useAppDispatch();
    const { openExerciseSetActionMenu } = useExerciseSetsPopups();

    return (
        <div
            onClick={(event) => {
                dispatch(tabsActions.openTab({
                    section: Section.EXERCISE_SET,
                    id: exerciseSet._id,
                    title: exerciseSet.title,
                }));
            }}
            className="relative w-[250px] h-[150px] cursor-pointer rounded-[10px]
            flex-shrink-0 flex flex-col justify-start items-center gap-1
            border border-border p-1
            hover:border-border-strong"
        >
            <div
                className="w-[250px] h-[35px] border-b-1 border-border
                flex justify-center items-center"
            >
                <div className="w-[200px] h-full flex justify-center items-center">
                    <p className="max-w-[200px] px-2 font-serif font-semibold truncate ">
                        {exerciseSet.title}
                    </p>
                </div>

                <div className="w-[50px] h-auto">
                    <ActionMenuTriggerer
                        onClick={(event) => openExerciseSetActionMenu(event, exerciseSet)}
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
