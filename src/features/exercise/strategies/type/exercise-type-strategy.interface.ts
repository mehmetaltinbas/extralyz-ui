import type React from "react";
import type { ExerciseAnswerEvaluationResult } from "src/features/exercise-set/types/response/evaluate-answers.response";
import type { ExerciseType } from "src/features/exercise/enum/exercise-type.enum";
import type { CreateExerciseDto } from "src/features/exercise/types/dto/create-exercise.dto";
import type { UpdateExerciseDto } from "src/features/exercise/types/dto/update-exercise.dto";
import type { Exercise } from "src/features/exercise/types/exercise.interface";

export interface ExerciseTypeStrategy {
    type: ExerciseType;

    changeCreateExerciseDto: (setDto: (value: React.SetStateAction<CreateExerciseDto>) => void
) => void;
    getRestOfCreateExerciseForm: (dto: CreateExerciseDto, setDto: (value: React.SetStateAction<CreateExerciseDto>) => void) => React.JSX.Element;
    changeUpdateExerciseDto: (setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void
) => void;
    getRestOfUpdateExerciseForm: (dto: UpdateExerciseDto, setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void) => React.JSX.Element;
    getRestOfExercisePracticeCard: (exercise: Exercise, index: number, recordAnswer: (exerciseId: string, answer: string | number) => void, shuffleChoices?: boolean) => React.JSX.Element;
    getRestOfExerciseEvaluationCard: (exercise: Exercise, evaluation: ExerciseAnswerEvaluationResult) => React.JSX.Element;
    getRestOfExerciseCard: (exercise: Exercise, isAnswersHidden: boolean) => React.JSX.Element;
}
