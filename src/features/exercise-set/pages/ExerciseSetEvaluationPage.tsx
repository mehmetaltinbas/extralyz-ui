import type { EvaluateAnswersResponse } from 'src/features/exercise-set/types/response/evaluate-answers.response';
import { ExerciseEvaluationCard } from 'src/features/exercise/components/ExerciseEvaluationCard';
import { ScoreBadge } from 'src/features/exercise/components/ScoreBadge';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { Button } from 'src/shared/components/Button';

export function ExerciseSetEvaluationPage({
    exercises,
    evaluation,
    startOver,
}: {
    exercises: Exercise[];
    evaluation: EvaluateAnswersResponse;
    startOver: () => void;
}) {
    return (
        <div className="flex flex-col justify-start items-center gap-4 p-4">
            <div className='flex justify-center items-center gap-4'>
                <ScoreBadge
                    score={evaluation?.overallScore ?? 0}
                    label="Overall Score"
                    className="text-lg font-bold"
                />

                <Button onClick={startOver}>
                    Start Over
                </Button>
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
