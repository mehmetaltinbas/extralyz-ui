import type { EvaluateAnswersResponse } from 'src/features/exercise-set/types/response/evaluate-answers.response';
import { ExerciseEvaluationCard } from 'src/features/exercise/components/ExerciseEvaluationCard';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function ExerciseSetEvaluationPage({
    exercises,
    evaluation,
}: {
    exercises: Exercise[];
    evaluation: EvaluateAnswersResponse;
}) {
    return (
        <div className="flex flex-col justify-start items-center gap-4 p-4">
            <p className="font-serif font-bold text-lg">
                Overall Score: {evaluation?.overallScore}
            </p>

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
