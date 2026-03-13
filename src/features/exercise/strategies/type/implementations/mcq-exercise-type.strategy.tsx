import type React from "react";
import type { ExerciseAnswerEvaluationResult } from "src/features/exercise-set/types/response/evaluate-answers.response";
import { MCQ_CHOICES_COUNT } from "src/features/exercise/constants/mcq-choices-count.constant";
import { ExerciseType } from "src/features/exercise/enum/exercise-type.enum";
import { MCQCreateForm } from "src/features/exercise/strategies/type/components/create-form/MCQCreateForm";
import { MCQExerciseCard } from "src/features/exercise/strategies/type/components/exercise-card/MCQExerciseCard";
import { MCQExerciseEvaluationCard } from "src/features/exercise/strategies/type/components/exercise-evaluation-card/MCQExerciseEvaluationCard";
import { MCQExercisePracticeCard } from "src/features/exercise/strategies/type/components/exercise-practice-card/MCQExercisePracticeCard";
import { MCQUpdateForm } from "src/features/exercise/strategies/type/components/update-form/MCQUpdateForm";
import type { ExerciseTypeStrategy } from "src/features/exercise/strategies/type/exercise-type-strategy.interface";
import type { CreateExerciseDto } from "src/features/exercise/types/dto/create-exercise.dto";
import type { UpdateExerciseDto } from "src/features/exercise/types/dto/update-exercise.dto";
import type { Exercise } from "src/features/exercise/types/exercise.interface";

export const McqExerciseTypeStrategy: ExerciseTypeStrategy = {
    type: ExerciseType.MCQ,

    changeCreateExerciseDto: (setDto: (value: React.SetStateAction<CreateExerciseDto>) => void, ): void => {
        setDto(prev => ({
            ...prev,
            type: ExerciseType.MCQ,
            solution: undefined,
            choices: Array(MCQ_CHOICES_COUNT).fill(''),
            correctChoiceIndex: 0,
        }));
    },
    
    getRestOfCreateExerciseForm: (dto: CreateExerciseDto, setDto: (value: React.SetStateAction<CreateExerciseDto>) => void): React.JSX.Element => {
       return (
            <MCQCreateForm
                dto={dto}
                setDto={setDto}
            />
       );
    },

    changeUpdateExerciseDto: (setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void, ): void => {
        setDto(prev => ({
            ...prev,
            type: ExerciseType.MCQ,
            solution: undefined,
            choices: Array(MCQ_CHOICES_COUNT).fill(''),
            correctChoiceIndex: 0,
        }));
    },

    getRestOfUpdateExerciseForm: (dto: UpdateExerciseDto, setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void): React.JSX.Element => {
        return (
            <MCQUpdateForm
                dto={dto}
                setDto={setDto}
            />
        );
    },

    getRestOfExerciseCard: (exercise: Exercise, isAnswersHidden: boolean) => {
        return (
            <MCQExerciseCard
                exercise={exercise}
                isAnswersHidden={isAnswersHidden}
            />
        );
    },

    getRestOfExercisePracticeCard: (exercise: Exercise, index: number, recordAnswer: (exerciseId: string, answer: string | number) => void) => {
        return (
            <MCQExercisePracticeCard
                exercise={exercise}
                index={index}
                recordAnswer={recordAnswer}
            />
        );
    },

    getRestOfExerciseEvaluationCard: (exercise: Exercise, evaluation: ExerciseAnswerEvaluationResult) => {
        return (
            <MCQExerciseEvaluationCard
                exercise={exercise}
                evaluation={evaluation}
            />
        );
    },
};
