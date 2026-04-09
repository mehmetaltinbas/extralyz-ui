import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExerciseSetMode } from 'src/features/exercise-set/enums/exercise-set-mode.enum';
import { usePublicExerciseSetPopups } from 'src/features/exercise-set/hooks/use-public-exercise-set-popups.hook';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { exerciseTypeFactory } from 'src/features/exercise/strategies/type/exercise-type.factory';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { Section } from 'src/features/workspace/enums/section.enum';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { Button } from 'src/shared/components/Button';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch } from 'src/store/hooks';

export function PublicExerciseSetPageContent({
    exerciseSet,
    exercises,
    ownerUserName
}: {
    exerciseSet: ExerciseSet;
    exercises: Exercise[];
    ownerUserName: string;
}) {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const [isAnswersHidden, setIsAnswersHidden] = React.useState<boolean>(true);

    const { openStartPracticeDecision, openCloneExerciseSetForm, openViewPdfDecision } = usePublicExerciseSetPopups();

    function toggleAnswerVisibility() {
        setIsAnswersHidden((prev) => !prev);
    }

    function handleCopyPublicLink() {
        const uiUrl = import.meta.env.VITE_UI_URL || window.location.origin;

        const url = `${uiUrl}/user/${ownerUserName}/exercise-set/${encodeURIComponent(exerciseSet.title)}`;
        navigator.clipboard.writeText(url);

        alert('Public link copied to clipboard!');
    }

    return (
        <div
            className="absolute w-full h-full
            flex flex-col justify-start items-start gap-8 p-4 sm:p-8"
        >
            <div
                className="w-full h-auto
                flex flex-col justify-center items-start gap-2"
            >
                <div className='w-full h-auto flex flex-col justify-start items-center gap-4'>
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-2xl font-bold">{exerciseSet.title}</p>

                        <p className="text-text-secondary">
                            by{' '}
                            <span onClick={() => navigate(`/user/${ownerUserName}`)} className='cursor-pointer'>@{ownerUserName}</span>
                        </p>
                    </div>

                    <div className='flex flex-wrap gap-2 justify-center'>
                        <p><span>Type:</span> <span className='italic'>{exerciseSet.type}</span></p>

                        <p>|</p>

                        <p><span>Difficulty:</span> <span className='italic'>{exerciseSet.difficulty}</span></p>

                        <p>|</p>

                        <p><span>Count:</span> <span className='italic'>{exerciseSet.count}</span></p>
                    </div>

                    <div className='flex flex-wrap gap-2'>
                        <Button
                            onClick={() =>
                                openStartPracticeDecision()
                            }
                            disabled={exercises.length === 0}
                        >
                            Start Practice
                        </Button>

                        <Button
                            onClick={() => {
                                openViewPdfDecision();
                            }}
                        >
                            View as PDF
                        </Button>

                        <Button
                            onClick={() =>
                                dispatch(
                                    tabsActions.openTab({
                                        section: Section.PUBLIC_EXERCISE_SET_PAPER_EVALUATION,
                                        id: exerciseSet._id,
                                        title: exerciseSet.title,
                                        mode: ExerciseSetMode.PAPER_EVALUATION,
                                        meta: `@${ownerUserName}`
                                    })
                                )
                            }
                        >
                            Evaluate Paper Answers
                        </Button>

                        <Button onClick={openCloneExerciseSetForm}>
                            Clone to My Sets
                        </Button>

                        <Button variant={ButtonVariant.OUTLINE} onClick={handleCopyPublicLink}>
                            Copy Public Link
                        </Button>

                        <Button variant={ButtonVariant.OUTLINE} onClick={toggleAnswerVisibility}>
                            {isAnswersHidden ? 'Show Answers' : 'Hide Answers'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className='w-full h-full flex justify-center'>
                <div className="w-auto h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {exercises.map((exercise) => {
                        const strategy = exerciseTypeFactory.resolveStrategy(exercise.type);

                        return (
                            <div key={exercise._id} className='flex justify-center items-start'>
                                <div
                                    className="relative w-full max-w-[250px] md:max-w-[300px] aspect-square border rounded-[10px] px-8 py-8 text-sm md:text-base"
                                >
                                    <div className='w-full h-full overflow-y-auto'>
                                        {strategy?.getRestOfExerciseCard(exercise, isAnswersHidden)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
