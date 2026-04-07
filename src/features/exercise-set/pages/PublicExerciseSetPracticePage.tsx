import React from 'react';
import { ExerciseSetEvaluationPage } from 'src/features/exercise-set/pages/ExerciseSetEvaluationPage';
import { PublicExerciseSetService } from 'src/features/exercise-set/services/public-exercise-set.service';
import type { EvaluateAnswersDto } from 'src/features/exercise-set/types/dto/evaluate-answers.dto';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import type { EvaluateAnswersResponse } from 'src/features/exercise-set/types/response/evaluate-answers.response';
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
}: {
    exerciseSet?: ExerciseSet;
    exercises?: Exercise[];
    isActiveComponent: boolean;
    shuffleChoices?: boolean;
}) {
    const dispatch = useAppDispatch();
    const [activeExerciseIndex, setActiveExerciseIndex] = React.useState<number>(0);
    const [evaluateAnswersDto, setEvaluateAnswersDto] = React.useState<EvaluateAnswersDto>({
        exercises: [],
    });
    const [evaluation, setEvaluation] = React.useState<EvaluateAnswersResponse>();

    React.useEffect(() => {
        const dto = { ...evaluateAnswersDto };

        exercises?.map((exercise) => {
            if (!dto.exercises.some((element) => element.id === exercise._id)) {
                dto.exercises.push({ id: exercise._id });
            }
        });

        setEvaluateAnswersDto(dto);
    }, [exercises]);

    function recordAnswer(exerciseId: string, answer: string | number) {
        const newEvaluateAnswersDto = { ...evaluateAnswersDto };
        const exercise = newEvaluateAnswersDto.exercises.find(
            (exercise) => exercise.id === exerciseId
        );

        if (exercise) {
            exercise.answer = typeof answer === 'number' ? String(answer) : answer;
        }

        setEvaluateAnswersDto(newEvaluateAnswersDto);
    }

    async function evaluateAnswers() {
        const response = await PublicExerciseSetService.evaluatePublicAnswers(evaluateAnswersDto);

        if (response.isSuccess) {
            setEvaluation(response);
        }
    }

    return (
        <div className={`${isActiveComponent ? 'block' : 'hidden'} relative w-full h-full`}>
                <div className='absolute w-full h-full flex justify-start items-start'>
                {exerciseSet && exercises ? (
                    activeExerciseIndex === exercises.length ? (
                        evaluation ? (
                            <ExerciseSetEvaluationPage
                                exercises={exercises}
                                evaluation={evaluation}
                                startOver={() => dispatch(tabsActions.invalidateTabPropsById(exerciseSet!._id))}
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
                                {exercises.map((exercise, index) => (
                                    <ExercisePracticeCard
                                        exercise={exercise}
                                        index={index}
                                        recordAnswer={recordAnswer}
                                        isHidden={index !== activeExerciseIndex}
                                        shuffleChoices={shuffleChoices}
                                    />
                                ))}

                                <div className="flex flex-wrap justify-start items-center gap-2">
                                    <Button
                                        variant={ButtonVariant.SECONDARY}
                                        onClick={() =>
                                            setActiveExerciseIndex((prev) =>
                                                prev > 0 ? prev - 1 : prev
                                            )
                                        }
                                    >
                                        Back
                                    </Button>

                                    {!(activeExerciseIndex + 1 === exercises.length) ? (
                                        <Button
                                            variant={ButtonVariant.SECONDARY}
                                            onClick={() =>
                                                setActiveExerciseIndex((prev) => prev + 1)
                                            }
                                        >
                                            Next
                                        </Button>
                                    ) : (
                                        <Button
                                            variant={ButtonVariant.PRIMARY}
                                            onClick={async () => {
                                                setActiveExerciseIndex((prev) => prev + 1);
                                                await evaluateAnswers();
                                            }}
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
