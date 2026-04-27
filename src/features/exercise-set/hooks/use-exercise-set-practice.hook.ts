import React from 'react';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import type { EvaluateAnswersDto } from 'src/features/exercise-set/types/dto/evaluate-answers.dto';
import type { EvaluateAnswersResponse } from 'src/features/exercise-set/types/response/evaluate-answers.response';
import { WEAK_POINT_PASS_THRESHOLD } from 'src/features/exercise/constants/weak-point-pass-threshold.constant';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function useExerciseSetPractice(
    exercises: Exercise[] | undefined
) {
    const [activeExerciseIndex, setActiveExerciseIndex] = React.useState<number>(0);
    const [evaluateAnswersDto, setEvaluateAnswersDto] = React.useState<EvaluateAnswersDto>({
        exercises: [],
    });
    const [evaluation, setEvaluation] = React.useState<EvaluateAnswersResponse>();
    const [currentExercises, setCurrentExercises] = React.useState<Exercise[]>([]);
    const [round, setRound] = React.useState<number>(1);

    React.useEffect(() => {
        if (exercises) {
            setCurrentExercises(exercises);
        }
    }, [exercises]);

    React.useEffect(() => {
        const dto = { ...evaluateAnswersDto };

        currentExercises.map((exercise) => {
            if (!dto.exercises.some((element) => element.id === exercise._id)) {
                dto.exercises.push({ id: exercise._id });
            }
        });

        setEvaluateAnswersDto(dto);
    }, [currentExercises]);

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
        const response = await ExerciseSetService.evaluateAnswers(evaluateAnswersDto);

        if (response.isSuccess) {
            setEvaluation(response);
        }
    }

    function continueWithWeakPoints() {
        if (!evaluation?.exerciseAnswerEvaluationResults) return;

        const weakExerciseIds = evaluation.exerciseAnswerEvaluationResults
            .filter((result) => result.score < WEAK_POINT_PASS_THRESHOLD)
            .map((result) => result.exerciseId);

        const weakExercises = currentExercises.filter((exercise) =>
            weakExerciseIds.includes(exercise._id)
        );

        setCurrentExercises(weakExercises);
        setActiveExerciseIndex(0);
        setEvaluateAnswersDto({ exercises: weakExercises.map((e) => ({ id: e._id })) });
        setEvaluation(undefined);
        setRound((prev) => prev + 1);
    }

    function goBack() {
        setActiveExerciseIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }

    function goNext() {
        setActiveExerciseIndex((prev) => prev + 1);
    }

    async function finishAndEvaluate() {
        setActiveExerciseIndex((prev) => prev + 1);
        await evaluateAnswers();
    }

    const isOnLastExercise = currentExercises.length > 0 && activeExerciseIndex + 1 === currentExercises.length;
    const isEvaluating = currentExercises.length > 0 && activeExerciseIndex === currentExercises.length;

    return {
        currentExercises,
        activeExerciseIndex,
        evaluation,
        round,
        recordAnswer,
        continueWithWeakPoints,
        goBack,
        goNext,
        finishAndEvaluate,
        isOnLastExercise,
        isEvaluating,
    };
}
