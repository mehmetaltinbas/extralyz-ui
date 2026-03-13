import type React from "react";
import type { ExerciseAnswerEvaluationResult } from "src/features/exercise-set/types/response/evaluate-answers.response";
import { ExerciseType } from "src/features/exercise/enum/exercise-type.enum";
import { TrueFalseCreateForm } from "src/features/exercise/strategies/type/components/create-form/TrueFalseCreateForm";
import { TrueFalseExerciseCard } from "src/features/exercise/strategies/type/components/exercise-card/TrueFalseExerciseCard";
import { TrueFalseExerciseEvaluationCard } from "src/features/exercise/strategies/type/components/exercise-evaluation-card/TrueFalseExerciseEvaluationCard";
import { TrueFalseExercisePracticeCard } from "src/features/exercise/strategies/type/components/exercise-practice-card/TrueFalseExercisePracticeCard";
import { TrueFalseUpdateForm } from "src/features/exercise/strategies/type/components/update-form/TrueFalseUpdateForm";
import type { ExerciseTypeStrategy } from "src/features/exercise/strategies/type/exercise-type-strategy.interface";
import type { CreateExerciseDto } from "src/features/exercise/types/dto/create-exercise.dto";
import type { UpdateExerciseDto } from "src/features/exercise/types/dto/update-exercise.dto";
import type { Exercise } from "src/features/exercise/types/exercise.interface";

export const TrueFalseExerciseTypeStrategy: ExerciseTypeStrategy = {
    type: ExerciseType.TRUE_FALSE,

    changeCreateExerciseDto: (setDto: (value: React.SetStateAction<CreateExerciseDto>) => void): void => {
        setDto(prev => ({
            ...prev,
            type: ExerciseType.TRUE_FALSE,
            solution: undefined,
            choices: undefined,
            correctChoiceIndex: 0,
        }));
    },

    getRestOfCreateExerciseForm: (dto: CreateExerciseDto, setDto: (value: React.SetStateAction<CreateExerciseDto>) => void): React.JSX.Element => {
        return (
            <TrueFalseCreateForm
                dto={dto}
                setDto={setDto}
            />
        );
    },

    changeUpdateExerciseDto: (setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void): void => {
        setDto(prev => ({
            ...prev,
            type: ExerciseType.TRUE_FALSE,
            solution: undefined,
            choices: undefined,
            correctChoiceIndex: 0,
        }));
    },

    getRestOfUpdateExerciseForm: (dto: UpdateExerciseDto, setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void): React.JSX.Element => {
        return (
            <TrueFalseUpdateForm
                dto={dto}
                setDto={setDto}
            />
        );
    },

    getRestOfExerciseCard: (exercise: Exercise, isAnswersHidden: boolean) => {
        return (
            <TrueFalseExerciseCard
                exercise={exercise}
                isAnswersHidden={isAnswersHidden}
            />
        );
    },

    getRestOfExercisePracticeCard: (exercise: Exercise, index: number, recordAnswer: (exerciseId: string, answer: string | number) => void) => {
        return (
            <TrueFalseExercisePracticeCard
                exercise={exercise}
                index={index}
                recordAnswer={recordAnswer}
            />
        );
    },

    getRestOfExerciseEvaluationCard: (exercise: Exercise, evaluation: ExerciseAnswerEvaluationResult) => {
        return (
            <TrueFalseExerciseEvaluationCard
                exercise={exercise}
                evaluation={evaluation}
            />
        );
    },
};
