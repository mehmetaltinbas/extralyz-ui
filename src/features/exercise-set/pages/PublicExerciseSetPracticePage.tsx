import { ExerciseSetMode } from 'src/features/exercise-set/enums/exercise-set-mode.enum';
import { useExerciseSetPractice } from 'src/features/exercise-set/hooks/use-exercise-set-practice.hook';
import { ExerciseSetEvaluationPage } from 'src/features/exercise-set/pages/ExerciseSetEvaluationPage';
import { PublicExerciseSetService } from 'src/features/exercise-set/services/public-exercise-set.service';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { ExercisePracticeCard } from 'src/features/exercise/components/ExercisePracticeCard';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { Button } from 'src/shared/components/Button';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch } from 'src/store/hooks';

export function PublicExerciseSetPracticePage({
    exerciseSet,
    exercises,
    isActiveComponent,
    shuffleChoices,
    mode,
}: {
    exerciseSet?: ExerciseSet;
    exercises?: Exercise[];
    isActiveComponent: boolean;
    shuffleChoices?: boolean;
    mode?: string;
}) {
    const dispatch = useAppDispatch();
    const practice = useExerciseSetPractice(exercises, PublicExerciseSetService.evaluatePublicAnswers);

    return (
        <div className={`${isActiveComponent ? 'block' : 'hidden'} relative w-full h-full`}>
                <div className='absolute w-full h-full flex justify-start items-start'>
                {exerciseSet && practice.currentExercises.length > 0 ? (
                    practice.isEvaluating ? (
                        practice.evaluation ? (
                            <ExerciseSetEvaluationPage
                                exercises={practice.currentExercises}
                                evaluation={practice.evaluation}
                                startOver={() => dispatch(tabsActions.invalidateTabPropsById(exerciseSet!._id))}
                                mode={mode}
                                round={practice.round}
                                onContinueWithWeakPoints={practice.continueWithWeakPoints}
                            />
                        ) : (
                            <LoadingPage />
                        )
                    ) : (
                        <div
                            className={`w-full h-[50%]
                            flex justify-center items-center
                        `}
                        >
                            <div
                                className={`w-auto h-auto
                                flex-col justify-center items-center gap-4
                            `}
                            >
                                {mode === ExerciseSetMode.WEAK_POINT_FOCUS_PRACTICE && practice.round > 1 && (
                                    <p className='text-sm opacity-70 text-center mb-2'>
                                        Round {practice.round} — {practice.currentExercises.length} exercise{practice.currentExercises.length !== 1 ? 's' : ''} remaining
                                    </p>
                                )}

                                {practice.currentExercises.map((exercise, index) => (
                                    <ExercisePracticeCard
                                        exercise={exercise}
                                        index={index}
                                        recordAnswer={practice.recordAnswer}
                                        isHidden={index !== practice.activeExerciseIndex}
                                        shuffleChoices={shuffleChoices}
                                    />
                                ))}

                                <div className="flex flex-wrap justify-start items-center gap-2">
                                    <Button
                                        variant={ButtonVariant.SECONDARY}
                                        onClick={practice.goBack}
                                    >
                                        Back
                                    </Button>

                                    {!practice.isOnLastExercise ? (
                                        <Button
                                            variant={ButtonVariant.SECONDARY}
                                            onClick={practice.goNext}
                                        >
                                            Next
                                        </Button>
                                    ) : (
                                        <Button
                                            variant={ButtonVariant.PRIMARY}
                                            onClick={practice.finishAndEvaluate}
                                        >
                                            Finish and Evaluate Answers
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                ) : (
                    <div className={``}>undefined</div>
                )}
            </div>
        </div>
    );
}
