import { ExerciseSetMode } from 'src/features/exercise-set/enums/exercise-set-mode.enum';
import type { EvaluateAnswersResponse } from 'src/features/exercise-set/types/response/evaluate-answers.response';
import { ExerciseEvaluationCard } from 'src/features/exercise/components/ExerciseEvaluationCard';
import { ScoreBadge } from 'src/features/exercise/components/ScoreBadge';
import { WEAK_POINT_PASS_THRESHOLD } from 'src/features/exercise/constants/weak-point-pass-threshold.constant';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { Button } from 'src/shared/components/Button';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function ExerciseSetEvaluationPage({
    exercises,
    evaluation,
    startOver,
    mode,
    round,
    onContinueWithWeakPoints,
}: {
    exercises: Exercise[];
    evaluation: EvaluateAnswersResponse;
    startOver: () => void;
    mode?: string;
    round?: number;
    onContinueWithWeakPoints?: () => void;
}) {
    const isWeakPointMode = mode === ExerciseSetMode.WEAK_POINT_FOCUS_PRACTICE;
    const weakExerciseCount = isWeakPointMode
        ? (evaluation.exerciseAnswerEvaluationResults?.filter(
              (result) => result.score < WEAK_POINT_PASS_THRESHOLD
          ).length ?? 0)
        : 0;
    const allPassed = isWeakPointMode && weakExerciseCount === 0;

    return (
        <div className="w-full flex flex-col justify-start items-center gap-4 p-4">
            <div className='flex flex-col justify-center items-center gap-4'>
                {isWeakPointMode && round && (
                    <p className='text-sm opacity-70'>Round {round}</p>
                )}

                <ScoreBadge
                    score={evaluation?.overallScore ?? 0}
                    label="Overall Score"
                    className="text-lg font-bold"
                />

                {isWeakPointMode && allPassed && (
                    <p className='text-sm font-medium text-green-500'>
                        All exercises passed the {WEAK_POINT_PASS_THRESHOLD}/100 threshold!
                    </p>
                )}

                <div className='flex justify-center items-center gap-2'>
                    <Button onClick={startOver}>
                        Start Over
                    </Button>

                    {isWeakPointMode && !allPassed && onContinueWithWeakPoints && (
                        <Button
                            variant={ButtonVariant.PRIMARY}
                            onClick={onContinueWithWeakPoints}
                        >
                            Continue with Weak Points ({weakExerciseCount} remaining)
                        </Button>
                    )}
                </div>
            </div>

            {evaluation.exerciseAnswerEvaluationResults?.map((element, index) => {
                const matchingExercise = exercises.find(
                    (exercise) => exercise._id === element.exerciseId
                );

                if (matchingExercise) {
                    return (
                        <ExerciseEvaluationCard
                            exercise={matchingExercise}
                            evaluation={element}
                            index={index}
                        />
                    );
                }

                return <div>undefined</div>;
            })}
        </div>
    );
}
